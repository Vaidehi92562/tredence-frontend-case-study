import type { Node } from "reactflow";
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

function formatParams(params?: Record<string, string>) {
  const entries = Object.entries(params ?? {}).filter(([, value]) => value?.trim());
  if (!entries.length) return "";
  return entries
    .slice(0, 2)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" • ");
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
        description: `Workflow initialized. ${node.data.subtitle}`,
        tone: "emerald",
      };

    case "task":
      return {
        id: `${node.id}-${index}`,
        step: index + 1,
        time,
        title: node.data.title,
        description: `${node.data.subtitle}${node.data.metaValue ? ` • ${node.data.metaValue}` : ""}`,
        tone: "sky",
      };

    case "approval":
      return {
        id: `${node.id}-${index}`,
        step: index + 1,
        time,
        title: node.data.title,
        description: `Approval gate evaluated${node.data.metaValue ? ` • ${node.data.metaValue}` : ""}.`,
        tone: "amber",
      };

    case "automated": {
      const paramText = formatParams(node.data.params);
      return {
        id: `${node.id}-${index}`,
        step: index + 1,
        time,
        title: node.data.title,
        description: `${node.data.metaValue ?? node.data.actionId ?? "Automation"} executed${paramText ? ` • ${paramText}` : ""}.`,
        tone: "violet",
      };
    }

    case "end":
      return {
        id: `${node.id}-${index}`,
        step: index + 1,
        time,
        title: node.data.title,
        description: `Workflow completed. ${node.data.subtitle}`,
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
  template: WorkflowTemplateKey
): {
  logs: SimulationLog[];
  summary: SimulationSummary;
} {
  const orderedNodes = [...nodes].sort((a, b) => {
    if (a.position.x === b.position.x) return a.position.y - b.position.y;
    return a.position.x - b.position.x;
  });

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
