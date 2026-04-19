import { MarkerType } from "reactflow";
import type { Edge, Node } from "reactflow";
import type { WorkflowNodeData } from "../types/workflow";

export type WorkflowTemplateKey =
  | "employee-onboarding"
  | "leave-approval"
  | "document-verification";

function makeEdge(id: string, source: string, target: string, color: string): Edge {
  return {
    id,
    source,
    target,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color },
    style: { stroke: color, strokeWidth: 3 },
  };
}

export const templateFlows: Record<
  WorkflowTemplateKey,
  {
    nodes: Node<WorkflowNodeData>[];
    edges: Edge[];
    stats: {
      depth: string;
      human: string;
      decisions: string;
      automation: string;
    };
  }
> = {
  "employee-onboarding": {
    nodes: [
      {
        id: "start",
        type: "premium",
        position: { x: 40, y: 120 },
        data: {
          kind: "start",
          title: "Employee joins",
          subtitle: "Workflow entry event from HRIS",
          accent: "emerald",
          metadataKey: "Trigger",
          metadataValue: "HRIS Event",
        },
      },
      {
        id: "task",
        type: "premium",
        position: { x: 290, y: 220 },
        data: {
          kind: "task",
          title: "Collect documents",
          subtitle: "Human task for HR Operations",
          accent: "sky",
          description: "Collect ID proof, signed policy docs, and bank details",
          assignee: "HR Ops",
          dueDate: "Day 1",
          customKey: "Priority",
          customValue: "High",
        },
      },
      {
        id: "approval",
        type: "premium",
        position: { x: 570, y: 300 },
        data: {
          kind: "approval",
          title: "Manager approval",
          subtitle: "Decision gate before provisioning",
          accent: "amber",
          approverRole: "Reporting Manager",
          threshold: 1,
        },
      },
      {
        id: "automated",
        type: "premium",
        position: { x: 560, y: 80 },
        data: {
          kind: "automated",
          title: "Send welcome email",
          subtitle: "Automated communication step",
          accent: "violet",
          actionId: "send_email",
          actionLabel: "Send Email",
          params: {
            to: "new.hire@company.com",
            subject: "Welcome to HRFlow",
          },
        },
      },
      {
        id: "end",
        type: "premium",
        position: { x: 860, y: 210 },
        data: {
          kind: "end",
          title: "Onboarding complete",
          subtitle: "Workflow ends after HR and manager tasks close",
          accent: "slate",
          endMessage: "Summary shared with PeopleOps and onboarding closed.",
          summaryFlag: true,
        },
      },
    ],
    edges: [
      makeEdge("e1", "start", "task", "#38bdf8"),
      makeEdge("e2", "task", "approval", "#f59e0b"),
      makeEdge("e3", "task", "automated", "#a855f7"),
      makeEdge("e4", "approval", "end", "#475569"),
      makeEdge("e5", "automated", "end", "#10b981"),
    ],
    stats: {
      depth: "5 steps",
      human: "1 node",
      decisions: "1 gate",
      automation: "1 action",
    },
  },

  "leave-approval": {
    nodes: [
      {
        id: "start",
        type: "premium",
        position: { x: 40, y: 160 },
        data: {
          kind: "start",
          title: "Leave request submitted",
          subtitle: "Employee initiates leave request",
          accent: "emerald",
          metadataKey: "Source",
          metadataValue: "Employee Portal",
        },
      },
      {
        id: "task",
        type: "premium",
        position: { x: 280, y: 130 },
        data: {
          kind: "task",
          title: "Policy check",
          subtitle: "Check balance and leave eligibility",
          accent: "sky",
          description: "Review leave balance and policy constraints",
          assignee: "HR Policy",
          dueDate: "4 hours",
          customKey: "Leave Type",
          customValue: "Earned Leave",
        },
      },
      {
        id: "approval",
        type: "premium",
        position: { x: 560, y: 280 },
        data: {
          kind: "approval",
          title: "Manager decision",
          subtitle: "Approve or reject request",
          accent: "amber",
          approverRole: "Line Manager",
          threshold: 1,
        },
      },
      {
        id: "automated",
        type: "premium",
        position: { x: 780, y: 130 },
        data: {
          kind: "automated",
          title: "Update leave ledger",
          subtitle: "Automated sync to internal records",
          accent: "violet",
          actionId: "update_records",
          actionLabel: "Update Records",
          params: {
            table: "leave_balance",
            mode: "approved",
          },
        },
      },
      {
        id: "end",
        type: "premium",
        position: { x: 850, y: 360 },
        data: {
          kind: "end",
          title: "Employee notified",
          subtitle: "Final status communicated and workflow closed",
          accent: "slate",
          endMessage: "Employee notified by email and portal update.",
          summaryFlag: false,
        },
      },
    ],
    edges: [
      makeEdge("e1", "start", "task", "#38bdf8"),
      makeEdge("e2", "task", "approval", "#f59e0b"),
      makeEdge("e3", "approval", "automated", "#a855f7"),
      makeEdge("e4", "approval", "end", "#475569"),
      makeEdge("e5", "automated", "end", "#10b981"),
    ],
    stats: {
      depth: "5 steps",
      human: "1 node",
      decisions: "1 gate",
      automation: "1 action",
    },
  },

  "document-verification": {
    nodes: [
      {
        id: "start",
        type: "premium",
        position: { x: 40, y: 150 },
        data: {
          kind: "start",
          title: "Document uploaded",
          subtitle: "Candidate uploads verification set",
          accent: "emerald",
          metadataKey: "Source",
          metadataValue: "Upload Portal",
        },
      },
      {
        id: "automated-1",
        type: "premium",
        position: { x: 300, y: 90 },
        data: {
          kind: "automated",
          title: "OCR + extraction",
          subtitle: "Parse uploaded documents",
          accent: "violet",
          actionId: "parse_documents",
          actionLabel: "Parse Documents",
          params: {
            model: "ocr-v2",
            source: "uploaded_zip",
          },
        },
      },
      {
        id: "task",
        type: "premium",
        position: { x: 560, y: 250 },
        data: {
          kind: "task",
          title: "Reviewer audit",
          subtitle: "Human mismatch inspection",
          accent: "sky",
          description: "Review extracted fields and resolve mismatches",
          assignee: "Verifier",
          dueDate: "Same day",
          customKey: "Risk Band",
          customValue: "Medium",
        },
      },
      {
        id: "automated-2",
        type: "premium",
        position: { x: 790, y: 120 },
        data: {
          kind: "automated",
          title: "Generate summary",
          subtitle: "Compile verification summary",
          accent: "violet",
          actionId: "generate_doc",
          actionLabel: "Generate Document",
          params: {
            template: "Verification Summary",
            recipient: "PeopleOps",
          },
        },
      },
      {
        id: "end",
        type: "premium",
        position: { x: 870, y: 340 },
        data: {
          kind: "end",
          title: "Verification complete",
          subtitle: "Decision stored and shared",
          accent: "slate",
          endMessage: "Verification summary delivered successfully.",
          summaryFlag: true,
        },
      },
    ],
    edges: [
      makeEdge("e1", "start", "automated-1", "#a855f7"),
      makeEdge("e2", "automated-1", "task", "#38bdf8"),
      makeEdge("e3", "task", "automated-2", "#a855f7"),
      makeEdge("e4", "automated-2", "end", "#475569"),
    ],
    stats: {
      depth: "5 steps",
      human: "1 node",
      decisions: "0 gates",
      automation: "2 actions",
    },
  },
};

export function cloneTemplateFlow(template: WorkflowTemplateKey) {
  const flow = templateFlows[template];

  return {
    nodes: flow.nodes.map((node) => ({
      ...node,
      position: { ...node.position },
      data: {
        ...node.data,
        params: node.data.params ? { ...node.data.params } : undefined,
      },
    })),
    edges: flow.edges.map((edge) => ({
      ...edge,
      markerEnd:
        edge.markerEnd && typeof edge.markerEnd === "object"
          ? { ...edge.markerEnd }
          : edge.markerEnd,
      style: edge.style ? { ...edge.style } : undefined,
    })),
    stats: { ...flow.stats },
  };
}
