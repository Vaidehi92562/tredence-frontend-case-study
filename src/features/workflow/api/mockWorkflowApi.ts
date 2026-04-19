import type { Edge, Node } from "reactflow";
import type { WorkflowNodeData } from "../types/workflow";
import type { WorkflowTemplateKey } from "../constants/templateFlows";
import { simulateWorkflow } from "../utils/simulateWorkflow";

export type AutomationAction = {
  id: string;
  label: string;
  description: string;
  params: string[];
};

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

export const AUTOMATION_ACTIONS: AutomationAction[] = [
  {
    id: "send_email",
    label: "Send Email",
    description: "Send an onboarding or status email",
    params: ["to", "subject"],
  },
  {
    id: "generate_doc",
    label: "Generate Document",
    description: "Create a PDF or summary document",
    params: ["template", "recipient"],
  },
  {
    id: "update_records",
    label: "Update Records",
    description: "Update internal HR systems with workflow outcomes",
    params: ["table", "mode"],
  },
  {
    id: "parse_documents",
    label: "Parse Documents",
    description: "Run OCR and extract structured fields",
    params: ["model", "source"],
  },
  {
    id: "create_ticket",
    label: "Create Ticket",
    description: "Create a task in an internal ops queue",
    params: ["queue", "priority"],
  },
];

export async function getAutomationActions(): Promise<AutomationAction[]> {
  await wait(250);
  return AUTOMATION_ACTIONS;
}

export async function simulateWorkflowApi(
  nodes: Node<WorkflowNodeData>[],
  template: WorkflowTemplateKey,
  edges: Edge[] = []
) {
  await wait(850);
  return simulateWorkflow(nodes, edges, template);
}
