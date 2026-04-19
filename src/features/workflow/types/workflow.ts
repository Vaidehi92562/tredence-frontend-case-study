export type WorkflowNodeKind = "start" | "task" | "approval" | "automated" | "end";

export type WorkflowNodeData = {
  kind: WorkflowNodeKind;
  title: string;
  subtitle: string;
  metaLabel?: string;
  metaValue?: string;
  accent: string;
  actionId?: string;
  params?: Record<string, string>;
};
