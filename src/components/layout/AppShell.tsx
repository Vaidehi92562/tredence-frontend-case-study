import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  Activity,
  BrainCircuit,
  Check,
  ChevronRight,
  ClipboardList,
  Copy,
  Download,
  GitMerge,
  Link2Off,
  LoaderCircle,
  Play,
  RotateCcw,
  Sparkles,
  Workflow,
} from "lucide-react";
import { addEdge, applyEdgeChanges, applyNodeChanges, MarkerType } from "reactflow";
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "reactflow";
import {
  WorkflowCanvas,
  type SelectedWorkflowNode,
} from "../../features/workflow/components/WorkflowCanvas";
import {
  cloneTemplateFlow,
  templateFlows,
  type WorkflowTemplateKey,
} from "../../features/workflow/constants/templateFlows";
import { NodeConfigPreview } from "../../features/workflow/panels/NodeConfigPreview";
import { ValidationSummary } from "../../features/workflow/panels/ValidationSummary";
import { validateWorkflow } from "../../features/workflow/utils/validateWorkflow";
import {
  getAutomationActions,
  simulateWorkflowApi,
  type AutomationAction,
} from "../../features/workflow/api/mockWorkflowApi";
import type {
  WorkflowNodeData,
  WorkflowNodeKind,
} from "../../features/workflow/types/workflow";
import {
  type SimulationLog,
  type SimulationSummary,
} from "../../features/workflow/utils/simulateWorkflow";

const nodeCards: {
  kind: WorkflowNodeKind;
  title: string;
  subtitle: string;
  accent: string;
}[] = [
  {
    kind: "start",
    title: "Start Node",
    subtitle: "Entry point",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    kind: "task",
    title: "Task Node",
    subtitle: "Human action",
    accent: "from-sky-500 to-blue-500",
  },
  {
    kind: "approval",
    title: "Approval Node",
    subtitle: "Decision gate",
    accent: "from-amber-500 to-orange-500",
  },
  {
    kind: "automated",
    title: "Automated Step",
    subtitle: "System action",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    kind: "end",
    title: "End Node",
    subtitle: "Completion",
    accent: "from-slate-500 to-slate-700",
  },
];

const templateCards: {
  key: WorkflowTemplateKey;
  title: string;
  subtitle: string;
  badge: string;
}[] = [
  {
    key: "employee-onboarding",
    title: "Employee Onboarding",
    subtitle: "Documents → Approval → Welcome automation → Completion",
    badge: "Best demo",
  },
  {
    key: "leave-approval",
    title: "Leave Approval",
    subtitle: "Request → Policy check → Approval routing → Ledger update",
    badge: "Fast build",
  },
  {
    key: "document-verification",
    title: "Document Verification",
    subtitle: "Upload → OCR → Audit → Summary generation",
    badge: "Automation-heavy",
  },
];

function logToneClass(tone: SimulationLog["tone"]) {
  switch (tone) {
    case "emerald":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "sky":
      return "border-sky-200 bg-sky-50 text-sky-800";
    case "amber":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "violet":
      return "border-violet-200 bg-violet-50 text-violet-800";
    default:
      return "border-slate-300 bg-slate-100 text-slate-800";
  }
}

function formatCount(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function recalcStats(nodes: Node<WorkflowNodeData>[]) {
  const taskCount = nodes.filter((node) => node.data.kind === "task").length;
  const approvalCount = nodes.filter((node) => node.data.kind === "approval").length;
  const automatedCount = nodes.filter((node) => node.data.kind === "automated").length;

  return {
    depth: formatCount(nodes.length, "step", "steps"),
    human: formatCount(taskCount, "node", "nodes"),
    decisions: formatCount(approvalCount, "gate", "gates"),
    automation: formatCount(automatedCount, "action", "actions"),
  };
}

function normalizeNodeData(raw: any): WorkflowNodeData {
  const kind = raw.kind as WorkflowNodeKind;

  return {
    kind,
    title: raw.title ?? "Untitled",
    subtitle: raw.subtitle ?? "",
    accent: raw.accent ?? "sky",

    metadataKey: raw.metadataKey ?? (kind === "start" ? raw.metaLabel : undefined),
    metadataValue: raw.metadataValue ?? (kind === "start" ? raw.metaValue : undefined),

    description: raw.description ?? (kind === "task" ? raw.subtitle : undefined),
    assignee:
      raw.assignee ??
      (kind === "task" && raw.metaLabel === "Owner" ? raw.metaValue : undefined),
    dueDate: raw.dueDate,
    customKey: raw.customKey,
    customValue: raw.customValue,

    approverRole:
      raw.approverRole ??
      (kind === "approval" && raw.metaLabel === "Role" ? raw.metaValue : undefined),
    threshold: raw.threshold ?? 1,

    actionId: raw.actionId,
    actionLabel:
      raw.actionLabel ??
      (kind === "automated" ? raw.metaValue : undefined),
    params: raw.params ?? {},

    endMessage: raw.endMessage ?? (kind === "end" ? raw.subtitle : undefined),
    summaryFlag: raw.summaryFlag ?? false,
  };
}

function buildNodeData(
  kind: WorkflowNodeKind,
  automations: AutomationAction[]
): WorkflowNodeData {
  switch (kind) {
    case "start":
      return {
        kind,
        title: "New Start",
        subtitle: "Workflow entry point",
        accent: "emerald",
        metadataKey: "Trigger",
        metadataValue: "Manual",
      };
    case "task":
      return {
        kind,
        title: "New Task",
        subtitle: "Human task step",
        accent: "sky",
        description: "Describe the manual task",
        assignee: "HR Ops",
        dueDate: "Day 1",
        customKey: "Priority",
        customValue: "Medium",
      };
    case "approval":
      return {
        kind,
        title: "New Approval",
        subtitle: "Decision gate",
        accent: "amber",
        approverRole: "Manager",
        threshold: 1,
      };
    case "automated": {
      const defaultAction = automations[0];
      return {
        kind,
        title: "New Automation",
        subtitle: defaultAction?.description ?? "Automated step",
        accent: "violet",
        actionId: defaultAction?.id,
        actionLabel: defaultAction?.label,
        params: Object.fromEntries(
          (defaultAction?.params ?? []).map((key) => [key, ""])
        ),
      };
    }
    case "end":
      return {
        kind,
        title: "New End",
        subtitle: "Workflow completion",
        accent: "slate",
        endMessage: "Workflow completed successfully.",
        summaryFlag: false,
      };
  }
}

function getConnectionColor(
  sourceId: string | null | undefined,
  nodes: Node<WorkflowNodeData>[]
) {
  const sourceNode = nodes.find((node) => node.id === sourceId);

  switch (sourceNode?.data.kind) {
    case "start":
      return "#10b981";
    case "task":
      return "#0ea5e9";
    case "approval":
      return "#f59e0b";
    case "automated":
      return "#a855f7";
    case "end":
      return "#475569";
    default:
      return "#7c3aed";
  }
}

export function AppShell() {
  const [activeTemplate, setActiveTemplate] =
    useState<WorkflowTemplateKey>("employee-onboarding");
  const [automationActions, setAutomationActions] = useState<AutomationAction[]>([]);
  const [flowNodes, setFlowNodes] = useState<Node<WorkflowNodeData>[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const [flowStats, setFlowStats] = useState(
    templateFlows["employee-onboarding"].stats
  );
  const [selectedNode, setSelectedNode] =
    useState<SelectedWorkflowNode | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<SimulationLog[]>([]);
  const [simulationSummary, setSimulationSummary] =
    useState<SimulationSummary | null>(null);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const validation = validateWorkflow(flowNodes, flowEdges);

  const readinessScore = Math.max(
    76,
    Math.min(99, validation.score + (simulationSummary ? 4 : 0))
  );
  const approvalCount = flowNodes.filter((node) => node.data.kind === "approval").length;
  const automatedCount = flowNodes.filter((node) => node.data.kind === "automated").length;
  const bottleneckRisk =
    approvalCount >= 3 ? "High" : approvalCount === 2 ? "Medium" : "Low";
  const automationScore =
    automatedCount >= 3 ? "5/5" : automatedCount === 2 ? "4/5" : automatedCount === 1 ? "3/5" : "1/5";

  useEffect(() => {
    getAutomationActions().then(setAutomationActions);
  }, []);

  useEffect(() => {
    const flow = cloneTemplateFlow(activeTemplate);

    const normalizedNodes = flow.nodes.map((node) => ({
      ...node,
      data: normalizeNodeData(node.data),
    }));

    setFlowNodes(normalizedNodes);
    setFlowEdges(flow.edges);
    setFlowStats(recalcStats(normalizedNodes));

    const firstNode = normalizedNodes[0];
    setSelectedNode({
      id: firstNode.id,
      ...firstNode.data,
    });

    setSelectedEdgeId(null);
    setSimulationLogs([]);
    setSimulationSummary(null);
  }, [activeTemplate]);

  useEffect(() => {
    if (!copiedJson) return;
    const timer = window.setTimeout(() => setCopiedJson(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copiedJson]);

  const handleNodesChange = (changes: NodeChange[]) => {
    setFlowNodes((prev) => applyNodeChanges(changes, prev));
    setSimulationLogs([]);
    setSimulationSummary(null);
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    setFlowEdges((prev) => applyEdgeChanges(changes, prev));
    setSimulationLogs([]);
    setSimulationSummary(null);
  };

  const handleConnect = (connection: Connection) => {
    if (!connection.source || !connection.target) return;
    if (connection.source === connection.target) return;

    const sourceNode = flowNodes.find((node) => node.id === connection.source);
    const targetNode = flowNodes.find((node) => node.id === connection.target);

    if (!sourceNode || !targetNode) return;
    if (sourceNode.data.kind === "end") return;
    if (targetNode.data.kind === "start") return;

    const duplicateEdge = flowEdges.some(
      (edge) =>
        edge.source === connection.source && edge.target === connection.target
    );
    if (duplicateEdge) return;

    const color = getConnectionColor(connection.source, flowNodes);

    setFlowEdges((prev) =>
      addEdge(
        {
          ...connection,
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color },
          style: { stroke: color, strokeWidth: 3 },
        },
        prev
      )
    );

    setSelectedEdgeId(null);
    setSimulationLogs([]);
    setSimulationSummary(null);
  };

  const handleNodePatch = (patch: Partial<SelectedWorkflowNode>) => {
    if (!selectedNode) return;
    const nodeId = selectedNode.id;

    setSelectedNode((prev) => (prev ? { ...prev, ...patch } : prev));

    setFlowNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...patch,
              },
            }
          : node
      )
    );

    setSimulationLogs([]);
    setSimulationSummary(null);
  };

  const handleDeleteSelectedNode = () => {
    if (!selectedNode) return;
    const nodeId = selectedNode.id;

    setFlowNodes((prevNodes) => {
      const updatedNodes = prevNodes.filter((node) => node.id !== nodeId);
      setFlowStats(recalcStats(updatedNodes));

      const fallback = updatedNodes[0];
      setSelectedNode(
        fallback
          ? {
              id: fallback.id,
              ...fallback.data,
            }
          : null
      );

      return updatedNodes;
    });

    setFlowEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );

    setSelectedEdgeId(null);
    setSimulationLogs([]);
    setSimulationSummary(null);
  };

  const handleDeleteSelectedEdge = () => {
    if (!selectedEdgeId) return;
    setFlowEdges((prev) => prev.filter((edge) => edge.id !== selectedEdgeId));
    setSelectedEdgeId(null);
    setSimulationLogs([]);
    setSimulationSummary(null);
  };

  const handleAddNode = (
    kind: WorkflowNodeKind,
    position: { x: number; y: number }
  ) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `node-${Date.now()}`;

    const data = buildNodeData(kind, automationActions);

    const newNode: Node<WorkflowNodeData> = {
      id,
      type: "premium",
      position,
      data,
    };

    setFlowNodes((prev) => {
      const updated = [...prev, newNode];
      setFlowStats(recalcStats(updated));
      return updated;
    });

    setSelectedNode({
      id,
      ...data,
    });
    setSelectedEdgeId(null);
    setSimulationLogs([]);
    setSimulationSummary(null);
  };

  const handleRunSimulation = async () => {
    setIsRunningSimulation(true);
    setSimulationLogs([]);
    setSimulationSummary(null);

    const result = await simulateWorkflowApi(flowNodes as any, activeTemplate as any);
    setSimulationSummary(result.summary);
    setSimulationLogs(result.logs);
    setIsRunningSimulation(false);
  };

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    kind: WorkflowNodeKind
  ) => {
    event.dataTransfer.setData("application/hrflow-node-kind", kind);
    event.dataTransfer.effectAllowed = "move";
  };

  const workflowPayload = useMemo(
    () => ({
      template: activeTemplate,
      stats: flowStats,
      validation,
      nodes: flowNodes.map((node) => ({
        id: node.id,
        position: node.position,
        ...node.data,
      })),
      edges: flowEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    }),
    [activeTemplate, flowEdges, flowNodes, flowStats, validation]
  );

  const workflowJson = useMemo(
    () => JSON.stringify(workflowPayload, null, 2),
    [workflowPayload]
  );

  const handleExportJson = () => {
    const blob = new Blob([workflowJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hrflow-${activeTemplate}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(workflowJson);
      setCopiedJson(true);
    } catch {
      setCopiedJson(false);
    }
  };

  const handleResetTemplate = () => {
    const flow = cloneTemplateFlow(activeTemplate);

    const normalizedNodes = flow.nodes.map((node) => ({
      ...node,
      data: normalizeNodeData(node.data),
    }));

    setFlowNodes(normalizedNodes);
    setFlowEdges(flow.edges);
    setFlowStats(recalcStats(normalizedNodes));

    const firstNode = normalizedNodes[0];
    setSelectedNode({
      id: firstNode.id,
      ...firstNode.data,
    });

    setSelectedEdgeId(null);
    setSimulationLogs([]);
    setSimulationSummary(null);
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_#eef2ff,_#f8fafc_34%,_#f5f3ff_64%,_#eef6ff_100%)] text-slate-900">
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-white/60 bg-white/75 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-200">
                <Workflow className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">HRFlow Studio</h1>
                  <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700">
                    Standout Build
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  AI-assisted workflow design system for People Operations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportJson}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Export JSON
              </button>
              <button
                onClick={handleRunSimulation}
                disabled={isRunningSimulation}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isRunningSimulation ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isRunningSimulation ? "Running Simulation..." : "Run Demo Simulation"}
              </button>
            </div>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border-r border-white/60 bg-white/60 p-5 backdrop-blur-xl">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-600" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Quick Start Templates
                </h2>
              </div>

              <div className="mt-4 space-y-3">
                {templateCards.map((template) => {
                  const isActive = activeTemplate === template.key;

                  return (
                    <button
                      key={template.key}
                      onClick={() => setActiveTemplate(template.key)}
                      className={`w-full rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                        isActive
                          ? "border-violet-300 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-[0_10px_30px_rgba(124,58,237,0.10)]"
                          : "border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-violet-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {template.title}
                          </h3>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {template.subtitle}
                          </p>
                        </div>
                        <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                          {template.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-sky-600" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Node Library
                </h2>
              </div>

              <div className="mt-4 space-y-3">
                {nodeCards.map((node) => (
                  <div
                    key={node.title}
                    draggable
                    onDragStart={(event) => handleDragStart(event, node.kind)}
                    className="group cursor-grab rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:cursor-grabbing"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-2 rounded-full bg-gradient-to-b ${node.accent}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {node.title}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:text-slate-600" />
                        </div>
                        <p className="text-xs text-slate-500">{node.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-dashed border-violet-200 bg-violet-50 p-3 text-xs text-violet-700">
                Drag any node card from here and drop it onto the live workflow canvas.
              </div>
            </div>
          </aside>

          <main className="min-h-0 p-5">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-5">
                <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Workflow Canvas</h2>
                      <p className="text-sm text-slate-500">
                        Build, connect, edit, and test HR workflows in one product-grade surface.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Connection live
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          validation.isValid
                            ? "bg-sky-50 text-sky-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {validation.isValid
                          ? "Validation passed"
                          : `${validation.issues.length} issue(s)`}
                      </span>
                    </div>
                  </div>

                  <WorkflowCanvas
                    nodes={flowNodes}
                    edges={flowEdges}
                    stats={flowStats}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={handleEdgesChange}
                    onSelectNode={(node) => {
                      setSelectedNode(node);
                      setSelectedEdgeId(null);
                    }}
                    onSelectEdge={(edgeId) => {
                      setSelectedEdgeId(edgeId);
                      setSelectedNode(null);
                    }}
                    onClearSelection={() => {
                      setSelectedNode(null);
                      setSelectedEdgeId(null);
                    }}
                    onAddNode={handleAddNode}
                    onConnect={handleConnect}
                  />
                </div>

                <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-violet-600" />
                      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Live Simulation Timeline
                      </h2>
                    </div>

                    <button
                      onClick={handleRunSimulation}
                      disabled={isRunningSimulation}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isRunningSimulation ? "Running..." : "Replay Simulation"}
                    </button>
                  </div>

                  {!simulationSummary && !isRunningSimulation && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                      Run the simulation to generate a step-by-step execution trace for the current workflow.
                    </div>
                  )}

                  {isRunningSimulation && (
                    <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
                      <div className="flex items-center gap-3 text-violet-800">
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        <p className="text-sm font-semibold">
                          Simulating workflow execution...
                        </p>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                        <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500" />
                      </div>
                    </div>
                  )}

                  {simulationSummary && !isRunningSimulation && (
                    <>
                      <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-4 text-white shadow-lg">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-violet-100">
                            Template
                          </p>
                          <p className="mt-2 text-sm font-bold">
                            {simulationSummary.template}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                            Total steps
                          </p>
                          <p className="mt-2 text-2xl font-bold text-slate-900">
                            {simulationSummary.totalSteps}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-sky-700">
                            Human steps
                          </p>
                          <p className="mt-2 text-2xl font-bold text-sky-900">
                            {simulationSummary.humanSteps}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-violet-700">
                            Automated
                          </p>
                          <p className="mt-2 text-2xl font-bold text-violet-900">
                            {simulationSummary.automatedSteps}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700">
                            Completion
                          </p>
                          <p className="mt-2 text-sm font-bold text-emerald-900">
                            {simulationSummary.completionLabel}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {simulationLogs.map((log) => (
                          <div
                            key={log.id}
                            className={`rounded-2xl border p-4 ${logToneClass(log.tone)}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                                Step {log.step}
                              </span>
                              <span className="text-[11px] font-semibold opacity-80">
                                {log.time}
                              </span>
                            </div>

                            <h3 className="mt-3 text-sm font-bold">{log.title}</h3>
                            <p className="mt-2 text-xs leading-5 opacity-90">
                              {log.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-indigo-600" />
                    <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Workflow Intelligence
                    </h2>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-4 text-white shadow-lg">
                      <p className="text-xs uppercase tracking-wide text-violet-100">Readiness</p>
                      <p className="mt-2 text-3xl font-bold">{readinessScore}%</p>
                      <p className="mt-1 text-xs text-violet-100">
                        Submission-quality prototype
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Bottleneck Risk
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {bottleneckRisk}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {approvalCount} approval gate{approvalCount === 1 ? "" : "s"} detected
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-emerald-700">
                        Automation Score
                      </p>
                      <p className="mt-2 text-3xl font-bold text-emerald-900">
                        {automationScore}
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        {automatedCount} automated step{automatedCount === 1 ? "" : "s"} in graph
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-amber-700">
                        Active Issues
                      </p>
                      <p className="mt-2 text-3xl font-bold text-amber-900">
                        {validation.issues.length}
                      </p>
                      <p className="mt-1 text-xs text-amber-700">
                        Validation warnings and errors surfaced live
                      </p>
                    </div>
                  </div>
                </div>

                <ValidationSummary validation={validation} />

                <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                  <div className="flex items-center gap-2">
                    <GitMerge className="h-4 w-4 text-sky-600" />
                    <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Configuration Panel
                    </h2>
                  </div>

                  <div className="mt-4">
                    {selectedEdgeId ? (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                            Selected edge
                          </p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">
                            {selectedEdgeId}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            This connection is selected. Remove it if the flow path is invalid.
                          </p>
                        </div>

                        <button
                          onClick={handleDeleteSelectedEdge}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Link2Off className="h-4 w-4" />
                          Delete Selected Edge
                        </button>
                      </div>
                    ) : (
                      <NodeConfigPreview
                        selectedNode={selectedNode}
                        automations={automationActions}
                        onChange={handleNodePatch}
                        onDelete={handleDeleteSelectedNode}
                      />
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Sandbox + Export
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Serialize the workflow graph and ship the current state
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                      {flowNodes.length} nodes • {flowEdges.length} edges
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={handleExportJson}
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      <Download className="h-4 w-4" />
                      Export JSON
                    </button>

                    <button
                      onClick={handleCopyJson}
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      {copiedJson ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copiedJson ? "Copied" : "Copy JSON"}
                    </button>

                    <button
                      onClick={handleResetTemplate}
                      className="flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset Template
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Current template
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {activeTemplate}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Simulation
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {simulationSummary ? "Ready" : "Not run yet"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-950 p-3 shadow-inner">
                    <pre className="max-h-[180px] overflow-auto whitespace-pre-wrap text-[11px] leading-5 text-emerald-200">
{workflowJson}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
