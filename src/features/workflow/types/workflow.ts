export type WorkflowNodeKind =
  | "start"
  | "task"
  | "approval"
  | "automated"
  | "end";

export type WorkflowNodeAccent =
  | "emerald"
  | "sky"
  | "amber"
  | "violet"
  | "slate";

export type WorkflowNodeData = {
  kind: WorkflowNodeKind;
  title: string;
  subtitle: string;
  accent: WorkflowNodeAccent;

  metadataKey?: string;
  metadataValue?: string;

  description?: string;
  assignee?: string;
  dueDate?: string;
  customKey?: string;
  customValue?: string;

  approverRole?: string;
  threshold?: number;

  actionId?: string;
  actionLabel?: string;
  params?: Record<string, string>;

  endMessage?: string;
  summaryFlag?: boolean;
};
