import {
  Bot,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  Flag,
} from "lucide-react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { WorkflowNodeData } from "../types/workflow";

const iconMap = {
  start: CheckCircle2,
  task: ClipboardList,
  approval: ShieldCheck,
  automated: Bot,
  end: Flag,
};

const textToneMap = {
  start: "text-emerald-700",
  task: "text-sky-700",
  approval: "text-amber-700",
  automated: "text-violet-700",
  end: "text-slate-700",
};

const borderToneMap = {
  start: "border-emerald-200 shadow-[0_14px_28px_rgba(16,185,129,0.14)]",
  task: "border-sky-200 shadow-[0_14px_28px_rgba(14,165,233,0.14)]",
  approval: "border-amber-200 shadow-[0_14px_28px_rgba(245,158,11,0.14)]",
  automated: "border-violet-200 shadow-[0_14px_28px_rgba(168,85,247,0.14)]",
  end: "border-slate-300 shadow-[0_14px_28px_rgba(71,85,105,0.12)]",
};

const handleToneMap = {
  start: "#10b981",
  task: "#0ea5e9",
  approval: "#f59e0b",
  automated: "#a855f7",
  end: "#475569",
};

export function PremiumNode({ data }: NodeProps<WorkflowNodeData>) {
  const Icon = iconMap[data.kind];
  const tone = textToneMap[data.kind];
  const borderTone = borderToneMap[data.kind];
  const handleColor = handleToneMap[data.kind];

  return (
    <div
      className={`min-w-[250px] rounded-2xl border bg-white/95 p-4 backdrop-blur ${borderTone}`}
    >
      {data.kind !== "start" && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: handleColor, width: 10, height: 10, border: "2px solid white" }}
        />
      )}

      {data.kind !== "end" && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: handleColor, width: 10, height: 10, border: "2px solid white" }}
        />
      )}

      <div className={`flex items-center gap-2 ${tone}`}>
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
          {data.kind}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-slate-900">{data.title}</h3>
      <p className="mt-1 text-[15px] text-slate-500">{data.subtitle}</p>

      {(data.metaLabel || data.metaValue) && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
          <span>{data.metaLabel}</span>
          <span className="text-slate-400">•</span>
          <span>{data.metaValue}</span>
        </div>
      )}
    </div>
  );
}
