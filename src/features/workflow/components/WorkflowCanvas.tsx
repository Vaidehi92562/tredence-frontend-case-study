import { useCallback } from "react";
import { Eye, GitBranchPlus, Orbit, TimerReset, Zap } from "lucide-react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "reactflow";
import { PremiumNode } from "../nodes/PremiumNode";
import type { WorkflowNodeData, WorkflowNodeKind } from "../types/workflow";

export type SelectedWorkflowNode = WorkflowNodeData & {
  id: string;
};

const nodeTypes = {
  premium: PremiumNode,
};

const commandChips = [
  { icon: Eye, label: "Preview Mode" },
  { icon: GitBranchPlus, label: "Branch Logic" },
  { icon: TimerReset, label: "Replay Flow" },
];

function miniMapColor(node: Node<WorkflowNodeData>) {
  switch (node.data.kind) {
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
      return "#94a3b8";
  }
}

function PastelDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-24 top-20 h-24 w-24 rotate-12 rounded-[28px] bg-gradient-to-br from-violet-200/50 to-fuchsia-200/25 shadow-[0_20px_60px_rgba(168,85,247,0.18)] animate-float-soft" />
      <div className="absolute left-[42%] top-10 h-16 w-16 -rotate-12 rounded-[22px] bg-gradient-to-br from-sky-200/45 to-cyan-100/30 shadow-[0_18px_50px_rgba(14,165,233,0.18)] animate-float-soft-delayed" />
      <div className="absolute right-24 top-28 h-20 w-20 rotate-6 rounded-[26px] bg-gradient-to-br from-emerald-200/45 to-teal-100/25 shadow-[0_20px_50px_rgba(16,185,129,0.16)] animate-float-soft-slower" />
      <div className="absolute right-40 bottom-28 h-24 w-24 rotate-[18deg] rounded-[30px] bg-gradient-to-br from-amber-100/45 to-orange-200/25 shadow-[0_20px_55px_rgba(245,158,11,0.16)] animate-float-soft" />
      <div className="absolute left-[28%] bottom-20 h-14 w-14 -rotate-[14deg] rounded-[18px] bg-gradient-to-br from-indigo-200/45 to-violet-100/30 shadow-[0_16px_40px_rgba(99,102,241,0.16)] animate-float-soft-delayed" />
    </div>
  );
}

function CanvasInner({
  nodes,
  edges,
  stats,
  onNodesChange,
  onEdgesChange,
  onSelectNode,
  onSelectEdge,
  onClearSelection,
  onAddNode,
  onConnect,
}: {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  stats: {
    depth: string;
    human: string;
    decisions: string;
    automation: string;
  };
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onSelectNode: (node: SelectedWorkflowNode) => void;
  onSelectEdge: (edgeId: string) => void;
  onClearSelection: () => void;
  onAddNode: (
    kind: WorkflowNodeKind,
    position: { x: number; y: number }
  ) => void;
  onConnect: (connection: Connection) => void;
}) {
  const reactFlow = useReactFlow<WorkflowNodeData, Edge>();

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const kind = event.dataTransfer.getData(
        "application/hrflow-node-kind"
      ) as WorkflowNodeKind | "";

      if (!kind) return;

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      onAddNode(kind, position);
    },
    [onAddNode, reactFlow]
  );

  return (
    <div
      className="relative h-[640px] overflow-hidden rounded-[30px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.10),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_22%),linear-gradient(to_right,rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:auto,auto,28px_28px,28px_28px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <PastelDecor />

      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-lg backdrop-blur">
        <Orbit className="h-4 w-4" />
        Live orchestration preview
      </div>

      <div className="absolute right-5 top-5 z-10 flex items-center gap-2 rounded-2xl border border-white/80 bg-white/85 px-3 py-2 shadow-lg backdrop-blur">
        {commandChips.map((chip) => {
          const Icon = chip.icon;
          return (
            <div
              key={chip.label}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
            >
              <Icon className="h-3.5 w-3.5 text-violet-600" />
              {chip.label}
            </div>
          );
        })}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) =>
          onSelectNode({
            id: node.id,
            ...node.data,
          })
        }
        onEdgeClick={(event, edge) => {
          event.stopPropagation();
          onSelectEdge(edge.id);
        }}
        onPaneClick={onClearSelection}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.45}
        maxZoom={1.8}
        connectionLineStyle={{ stroke: "#7c3aed", strokeWidth: 2.5 }}
        defaultEdgeOptions={{ animated: true }}
        snapToGrid
        snapGrid={[16, 16]}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={["Delete", "Backspace"]}
        className="bg-transparent"
      >
        <Background gap={28} size={1} color="#d5dbe7" />
        <MiniMap
          nodeColor={miniMapColor}
          nodeStrokeWidth={3}
          pannable
          zoomable
          className="!bg-white/90"
        />
        <Controls position="bottom-right" />
      </ReactFlow>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 w-[94%] -translate-x-1/2">
        <div className="grid grid-cols-2 gap-3 rounded-[24px] border border-white/80 bg-white/85 p-3 shadow-xl backdrop-blur md:grid-cols-4">
          <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-violet-600">Flow depth</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{stats.depth}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-sky-50 to-cyan-50 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-sky-600">Human actions</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{stats.human}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-600">Decision points</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{stats.decisions}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-600">Automation</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{stats.automation}</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-28 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/80 bg-white/90 px-4 py-2 shadow-lg backdrop-blur">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <Zap className="h-4 w-4 text-violet-600" />
          Drag nodes, connect them, configure automation parameters, and simulate the graph
        </div>
      </div>
    </div>
  );
}

export function WorkflowCanvas({
  nodes,
  edges,
  stats,
  onNodesChange,
  onEdgesChange,
  onSelectNode,
  onSelectEdge,
  onClearSelection,
  onAddNode,
  onConnect,
}: {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  stats: {
    depth: string;
    human: string;
    decisions: string;
    automation: string;
  };
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onSelectNode: (node: SelectedWorkflowNode) => void;
  onSelectEdge: (edgeId: string) => void;
  onClearSelection: () => void;
  onAddNode: (
    kind: WorkflowNodeKind,
    position: { x: number; y: number }
  ) => void;
  onConnect: (connection: Connection) => void;
}) {
  return (
    <ReactFlowProvider>
      <CanvasInner
        nodes={nodes}
        edges={edges}
        stats={stats}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectNode={onSelectNode}
        onSelectEdge={onSelectEdge}
        onClearSelection={onClearSelection}
        onAddNode={onAddNode}
        onConnect={onConnect}
      />
    </ReactFlowProvider>
  );
}
