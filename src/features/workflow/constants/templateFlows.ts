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
        position: { x: 40, y: 110 },
        data: {
          kind: "start",
          title: "Employee joins",
          subtitle: "Trigger onboarding workflow",
          metaLabel: "Template",
          metaValue: "Onboarding",
          accent: "emerald",
        },
      },
      {
        id: "task",
        type: "premium",
        position: { x: 330, y: 210 },
        data: {
          kind: "task",
          title: "Collect documents",
          subtitle: "Assigned to HR Operations",
          metaLabel: "Owner",
          metaValue: "HR Ops",
          accent: "sky",
        },
      },
      {
        id: "approval",
        type: "premium",
        position: { x: 650, y: 320 },
        data: {
          kind: "approval",
          title: "Manager approval",
          subtitle: "Decision gate before provisioning",
          metaLabel: "Role",
          metaValue: "Reporting Manager",
          accent: "amber",
        },
      },
      {
        id: "automated",
        type: "premium",
        position: { x: 670, y: 110 },
        data: {
          kind: "automated",
          title: "Send welcome email",
          subtitle: "System-triggered email notification",
          metaLabel: "Action",
          metaValue: "Send Email",
          accent: "violet",
          actionId: "send_email",
          params: {
            to: "new.hire@company.com",
            subject: "Welcome to HRFlow",
          },
        },
      },
      {
        id: "end",
        type: "premium",
        position: { x: 980, y: 260 },
        data: {
          kind: "end",
          title: "Onboarding complete",
          subtitle: "Summary sent to PeopleOps",
          metaLabel: "Status",
          metaValue: "Closed",
          accent: "slate",
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
        position: { x: 40, y: 150 },
        data: {
          kind: "start",
          title: "Leave request submitted",
          subtitle: "Workflow starts from employee portal",
          metaLabel: "Template",
          metaValue: "Leave",
          accent: "emerald",
        },
      },
      {
        id: "task",
        type: "premium",
        position: { x: 320, y: 120 },
        data: {
          kind: "task",
          title: "Policy check",
          subtitle: "Verify balance and leave type",
          metaLabel: "Owner",
          metaValue: "HR Policy",
          accent: "sky",
        },
      },
      {
        id: "approval",
        type: "premium",
        position: { x: 640, y: 250 },
        data: {
          kind: "approval",
          title: "Manager decision",
          subtitle: "Approve or reject leave request",
          metaLabel: "Role",
          metaValue: "Line Manager",
          accent: "amber",
        },
      },
      {
        id: "automated",
        type: "premium",
        position: { x: 920, y: 120 },
        data: {
          kind: "automated",
          title: "Update leave ledger",
          subtitle: "Sync records to a mock system table",
          metaLabel: "Action",
          metaValue: "Update Records",
          accent: "violet",
          actionId: "update_records",
          params: {
            table: "leave_balance",
            mode: "approved",
          },
        },
      },
      {
        id: "end",
        type: "premium",
        position: { x: 1010, y: 360 },
        data: {
          kind: "end",
          title: "Employee notified",
          subtitle: "Final status shared on email + portal",
          metaLabel: "Status",
          metaValue: "Completed",
          accent: "slate",
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
        position: { x: 40, y: 120 },
        data: {
          kind: "start",
          title: "Document uploaded",
          subtitle: "Candidate uploads verification set",
          metaLabel: "Template",
          metaValue: "Verification",
          accent: "emerald",
        },
      },
      {
        id: "automated-1",
        type: "premium",
        position: { x: 320, y: 80 },
        data: {
          kind: "automated",
          title: "OCR + extraction",
          subtitle: "Run OCR and extract structured fields",
          metaLabel: "Action",
          metaValue: "Parse Documents",
          accent: "violet",
          actionId: "parse_documents",
          params: {
            model: "ocr-v2",
            source: "uploaded_zip",
          },
        },
      },
      {
        id: "task",
        type: "premium",
        position: { x: 610, y: 230 },
        data: {
          kind: "task",
          title: "Reviewer audit",
          subtitle: "Manual mismatch inspection",
          metaLabel: "Owner",
          metaValue: "Verifier",
          accent: "sky",
        },
      },
      {
        id: "automated-2",
        type: "premium",
        position: { x: 930, y: 120 },
        data: {
          kind: "automated",
          title: "Generate summary",
          subtitle: "Create a downloadable document artifact",
          metaLabel: "Action",
          metaValue: "Generate Document",
          accent: "violet",
          actionId: "generate_doc",
          params: {
            template: "Verification Summary",
            recipient: "PeopleOps",
          },
        },
      },
      {
        id: "end",
        type: "premium",
        position: { x: 1020, y: 340 },
        data: {
          kind: "end",
          title: "Verification complete",
          subtitle: "Decision stored and summary delivered",
          metaLabel: "Status",
          metaValue: "Verified",
          accent: "slate",
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
