import type { Edge, Node } from "reactflow";
import type { WorkflowNodeData } from "../types/workflow";

export type ValidationLevel = "error" | "warning";

export type ValidationIssue = {
  id: string;
  level: ValidationLevel;
  message: string;
  hint: string;
  nodeId?: string;
};

export type ValidationResult = {
  isValid: boolean;
  score: number;
  issues: ValidationIssue[];
};

function buildAdjacency(nodes: Node<WorkflowNodeData>[], edges: Edge[]) {
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();

  nodes.forEach((node) => {
    outgoing.set(node.id, []);
    incoming.set(node.id, []);
  });

  edges.forEach((edge) => {
    outgoing.get(edge.source)?.push(edge.target);
    incoming.get(edge.target)?.push(edge.source);
  });

  return { outgoing, incoming };
}

function detectCycle(nodes: Node<WorkflowNodeData>[], edges: Edge[]) {
  const { outgoing } = buildAdjacency(nodes, edges);
  const color = new Map<string, "white" | "gray" | "black">();

  nodes.forEach((node) => color.set(node.id, "white"));

  let hasCycle = false;

  function dfs(nodeId: string) {
    if (hasCycle) return;
    color.set(nodeId, "gray");

    for (const nextId of outgoing.get(nodeId) ?? []) {
      const nextColor = color.get(nextId);
      if (nextColor === "gray") {
        hasCycle = true;
        return;
      }
      if (nextColor === "white") {
        dfs(nextId);
      }
    }

    color.set(nodeId, "black");
  }

  for (const node of nodes) {
    if (color.get(node.id) === "white") dfs(node.id);
  }

  return hasCycle;
}

export function validateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const starts = nodes.filter((node) => node.data.kind === "start");
  const ends = nodes.filter((node) => node.data.kind === "end");
  const { outgoing, incoming } = buildAdjacency(nodes, edges);

  if (starts.length !== 1) {
    issues.push({
      id: "start-count",
      level: "error",
      message: `Workflow should have exactly 1 Start node, found ${starts.length}.`,
      hint: "Keep one clear entry point for the graph.",
    });
  }

  if (ends.length < 1) {
    issues.push({
      id: "end-missing",
      level: "error",
      message: "Workflow needs at least 1 End node.",
      hint: "Add a completion state for the flow.",
    });
  }

  if (ends.length > 1) {
    issues.push({
      id: "end-multiple",
      level: "warning",
      message: `Workflow has ${ends.length} End nodes.`,
      hint: "Multiple completion paths are okay when intentional.",
    });
  }

  if (edges.length === 0 && nodes.length > 1) {
    issues.push({
      id: "no-connections",
      level: "warning",
      message: "There are multiple nodes but no connections between them.",
      hint: "Connect the graph so execution can be traced.",
    });
  }

  if (detectCycle(nodes, edges)) {
    issues.push({
      id: "cycle-detected",
      level: "error",
      message: "A cycle was detected in the workflow graph.",
      hint: "Make the flow acyclic or explicitly model loop behavior.",
    });
  }

  for (const node of nodes) {
    const incomingCount = incoming.get(node.id)?.length ?? 0;
    const outgoingCount = outgoing.get(node.id)?.length ?? 0;

    if (node.data.kind === "start" && incomingCount > 0) {
      issues.push({
        id: `start-incoming-${node.id}`,
        level: "error",
        message: `"${node.data.title}" is a Start node but has incoming edges.`,
        hint: "Start nodes should only trigger outward.",
        nodeId: node.id,
      });
    }

    if (node.data.kind === "end" && outgoingCount > 0) {
      issues.push({
        id: `end-outgoing-${node.id}`,
        level: "warning",
        message: `"${node.data.title}" is an End node but still has outgoing edges.`,
        hint: "End nodes usually terminate the workflow.",
        nodeId: node.id,
      });
    }

    if (node.data.kind !== "start" && incomingCount === 0) {
      issues.push({
        id: `incoming-${node.id}`,
        level: "warning",
        message: `"${node.data.title}" has no incoming connection.`,
        hint: "This step may never execute.",
        nodeId: node.id,
      });
    }

    if (node.data.kind !== "end" && outgoingCount === 0) {
      issues.push({
        id: `outgoing-${node.id}`,
        level: "warning",
        message: `"${node.data.title}" has no outgoing connection.`,
        hint: "This step may block the workflow.",
        nodeId: node.id,
      });
    }
  }

  if (starts.length === 1) {
    const start = starts[0];
    const minX = Math.min(...nodes.map((node) => node.position.x));

    if (start.position.x > minX + 20) {
      issues.push({
        id: "start-not-leftmost",
        level: "warning",
        message: "Start node is not the left-most node in the graph.",
        hint: "Placing the entry node first improves readability.",
        nodeId: start.id,
      });
    }

    const visited = new Set<string>();
    const queue = [start.id];
    visited.add(start.id);

    while (queue.length) {
      const current = queue.shift()!;
      for (const next of outgoing.get(current) ?? []) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        issues.push({
          id: `unreachable-${node.id}`,
          level: "warning",
          message: `"${node.data.title}" is unreachable from the Start node.`,
          hint: "Connect this step into the main flow.",
          nodeId: node.id,
        });
      }
    }

    if (ends.length > 0 && !ends.some((end) => visited.has(end.id))) {
      issues.push({
        id: "end-not-reachable",
        level: "error",
        message: "No End node is reachable from the Start node.",
        hint: "Make sure at least one valid completion path exists.",
      });
    }
  }

  const errorCount = issues.filter((issue) => issue.level === "error").length;
  const warningCount = issues.filter((issue) => issue.level === "warning").length;
  const score = Math.max(0, 100 - errorCount * 24 - warningCount * 8);

  return {
    isValid: errorCount === 0,
    score,
    issues,
  };
}
