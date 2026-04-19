import type { Edge, Node } from "reactflow";
import type { WorkflowTemplateKey } from "../constants/templateFlows";
import type { WorkflowNodeData } from "../types/workflow";

export type SimulationLogTone =
  | "emerald"
  | "sky"
  | "amber"
  | "violet"
  | "slate";

export type SimulationLog = {
  id: string;
  step: number;
  time: string;
  title: string;
  description: string;
  tone: SimulationLogTone;
};

export type SimulationSummary = {
  template: string;
  totalSteps: number;
  humanSteps: number;
  automatedSteps: number;
  decisionPoints: number;
  completionLabel: string;
};

function getTemplateLabel(template: WorkflowTemplateKey) {
  switch (template) {
    case "employee-onboarding":
      return "Employee Onboarding";
    case "leave-approval":
      return "Leave Approval";
    case "document-verification":
      return "Document Verification";
    default:
      return "Workflow";
  }
}

function topologicalOrder(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): Node<WorkflowNodeData>[] {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const outgoing = new Map<string, string[]>();
  const indegree = new Map<string, number>();

  nodes.forEach((node) => {
    outgoing.set(node.id, []);
    indegree.set(node.id, 0);
  });

  edges.forEach((edge) => {
    outgoing.get(edge.source)?.push(edge.target);
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
  });

  const queue = nodes
    .filter((node) => (indegree.get(node.id) ?? 0) === 0)
    .sort((a, b) =>
      a.position.x === b.position.x
        ? a.position.y - b.position.y
        : a.position.x - b.position.x
    );

  const ordered: Node<WorkflowNodeData>[] = [];

  while (queue.length) {
    const current = queue.shift()!;
    ordered.push(current);

    const nextIds = outgoing.get(current.id) ?? [];
    for (const nextId of nextIds) {
      indegree.set(nextId, (indegree.get(nextId) ?? 1) - 1);
      if ((indegree.get(nextId) ?? 0) === 0) {
        const nextNode = nodeMap.get(nextId);
        if (nextNode) queue.push(nextNode);
        queue.sort((a, b) =>
          a.position.x === b.position.x
            ? a.position.y - b.position.y
            : a.position.x - b.position.x
        );
      }
    }
  }

  if (ordered.length < nodes.length) {
    const remaining = nodes
      .filter((node) => !ordered.some((item) => item.id === node.id))
      .sort((a, b) =>
        a.position.x === b.position.x
          ? a.position.y - b.position.y
          : a.position.x - b.position.x
      );

    ordered.push(...remaining);
  }

  return ordered;
}

function buildLog(
  node: Node<WorkflowNodeData>,
  index: number
): SimulationLog {
  const time = `T+${index + 1}s`;

  switch (node.data.kind) {
    case "start":
      return {
        id: `${node.id}-${index}`,
        step: index + 1,
        time,
        title: node.data.title,
        description: `Workflow initialized from ${node.data.metadataValue ?? "workflow trigger"}.`,
        tone: "emerald",
      };

    case "task":
      return {
        id: `${node.id}-${index}`,
        step: index + 1,
        time,
        title: node.data.title,
        description: `${node.data.description ?? node.data.subtitle}${node.data.assignee ? ` • ${node.data.assignee}` : ""}`,
        tone: "sky",
      };

    case "approval":
      return {
        id: `${node.id}-${index}`,
        step: index + 1,
        time,
        title: node.data.title,
        description: `${node.data.approverRole ?? "Approver"} gate evaluated${typeof node.data.threshold === "number" ? ` • threshold ${node.data.threshold}` : ""}.`,
        tone: "amber",
      };

    case "automated": {
      const paramText = Object.entries(node.data.params ?? {})
        .filter(([, value]) => value?.trim())
        .slice(0, 2)
        .map(([key, value]) => `${key}: ${value}`)
        .join(" • ");

      return {
        id: `${node.id}-${index}`,
        step: index + 1,
        time,
        title: node.data.title,
        description: `${node.data.actionLabel ?? "Automation"} executed${paramText ? ` • ${paramText}` : ""}.`,
        tone: "violet",
      };
    }

    case "end":
      return {
        id: `${node.id}-${index}`,
        step: index + 1,
        time,
        title: node.data.title,
        description: node.data.endMessage ?? node.data.subtitle,
        tone: "slate",
      };

    default:
      return {
        id: `${node.id}-${index}`,
        step: index + 1,
        time,
        title: node.data.title,
        description: node.data.subtitle,
        tone: "slate",
      };
  }
}

export function simulateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
  template: WorkflowTemplateKey
): {
  logs: SimulationLog[];
  summary: SimulationSummary;
} {
  const orderedNodes = topologicalOrder(nodes, edges);
  const logs = orderedNodes.map((node, index) => buildLog(node, index));

  const summary: SimulationSummary = {
    template: getTemplateLabel(template),
    totalSteps: orderedNodes.length,
    humanSteps: orderedNodes.filter((node) => node.data.kind === "task").length,
    automatedSteps: orderedNodes.filter((node) => node.data.kind === "automated").length,
    decisionPoints: orderedNodes.filter((node) => node.data.kind === "approval").length,
    completionLabel:
      orderedNodes.find((node) => node.data.kind === "end")?.data.title ?? "Completed",
  };

  return { logs, summary };
}
