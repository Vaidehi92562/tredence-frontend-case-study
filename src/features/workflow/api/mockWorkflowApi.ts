import type { Node } from "reactflow";
import type { WorkflowNodeData } from "../types/workflow";
import type { WorkflowTemplateKey } from "../constants/templateFlows";
import { simulateWorkflow } from "../utils/simulateWorkflow";

export type AutomationAction = {
  id: string;
  label: string;
  description: string;
  paramKeys: string[];
};

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const AUTOMATION_ACTIONS: AutomationAction[] = [
  {
    id: "send_email",
    label: "Send Email",
    description: "System-triggered email notification",
    paramKeys: ["to", "subject"],
  },
  {
    id: "generate_doc",
    label: "Generate Document",
    description: "Create a downloadable document artifact",
    paramKeys: ["template", "recipient"],
  },
  {
    id: "update_records",
    label: "Update Records",
    description: "Sync records to a mock system table",
    paramKeys: ["table", "mode"],
  },
  {
    id: "parse_documents",
    label: "Parse Documents",
    description: "Run OCR and extract structured fields",
    paramKeys: ["model", "source"],
  },
  {
    id: "create_ticket",
    label: "Create Ticket",
    description: "Raise a follow-up task in an internal queue",
    paramKeys: ["queue", "priority"],
  },
];

export async function getAutomationActions(): Promise<AutomationAction[]> {
  await wait(250);
  return AUTOMATION_ACTIONS;
}

export async function simulateWorkflowApi(
  nodes: Node<WorkflowNodeData>[],
  template: WorkflowTemplateKey
) {
  await wait(850);
  return simulateWorkflow(nodes, template);
}
