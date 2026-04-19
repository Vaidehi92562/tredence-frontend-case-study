import {
  Bot,
  CheckCircle2,
  ClipboardList,
  Flag,
  ShieldCheck,
  CalendarDays,
  UserRound,
  FileStack,
  Sparkles,
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

const toneMap = {
  start: {
    text: "text-emerald-700",
    border: "border-emerald-200",
    bg: "from-emerald-50/95 to-white",
    shadow: "shadow-[0_18px_45px_rgba(16,185,129,0.16)]",
    handle: "#10b981",
  },
  task: {
    text: "text-sky-700",
    border: "border-sky-200",
    bg: "from-sky-50/95 to-white",
    shadow: "shadow-[0_18px_45px_rgba(14,165,233,0.15)]",
    handle: "#0ea5e9",
  },
  approval: {
    text: "text-amber-700",
    border: "border-amber-200",
    bg: "from-amber-50/95 to-white",
    shadow: "shadow-[0_18px_45px_rgba(245,158,11,0.15)]",
    handle: "#f59e0b",
  },
  automated: {
    text: "text-violet-700",
    border: "border-violet-200",
    bg: "from-violet-50/95 to-white",
    shadow: "shadow-[0_18px_45px_rgba(168,85,247,0.18)]",
    handle: "#a855f7",
  },
  end: {
    text: "text-slate-700",
    border: "border-slate-300",
    bg: "from-slate-50/95 to-white",
    shadow: "shadow-[0_18px_45px_rgba(71,85,105,0.14)]",
    handle: "#475569",
  },
};

function MetaRow({
  left,
  right,
}: {
  left?: string;
  right?: string;
}) {
  if (!left && !right) return null;

  return (
    <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-600">
      <span>{left}</span>
      {left && right && <span className="text-slate-400">•</span>}
      <span className="truncate">{right}</span>
    </div>
  );
}

export function PremiumNode({ data, selected }: NodeProps<WorkflowNodeData>) {
  const Icon = iconMap[data.kind];
  const tone = toneMap[data.kind];

  return (
    <div
      className={`relative min-w-[260px] rounded-[26px] border bg-gradient-to-br ${tone.bg} p-4 backdrop-blur ${tone.border} ${tone.shadow} ${
        selected ? "ring-2 ring-violet-300 ring-offset-2" : ""
      }`}
    >
      <div className="absolute inset-x-6 bottom-[-10px] h-5 rounded-full bg-slate-300/25 blur-lg" />

      {data.kind !== "start" && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: tone.handle,
            width: 10,
            height: 10,
            border: "2px solid white",
          }}
        />
      )}

      {data.kind !== "end" && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: tone.handle,
            width: 10,
            height: 10,
            border: "2px solid white",
          }}
        />
      )}

      <div className={`flex items-center gap-2 ${tone.text}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
          {data.kind}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-slate-900">{data.title}</h3>
      <p className="mt-1 text-[14px] leading-6 text-slate-500">{data.subtitle}</p>

      <MetaRow left={data.metadataKey} right={data.metadataValue} />

      <div className="mt-4 flex flex-wrap gap-2">
        {data.assignee && (
          <div className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700">
            <UserRound className="h-3.5 w-3.5" />
            {data.assignee}
          </div>
        )}

        {data.dueDate && (
          <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
            <CalendarDays className="h-3.5 w-3.5" />
            {data.dueDate}
          </div>
        )}

        {data.approverRole && (
          <div className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            {data.approverRole}
          </div>
        )}

        {data.actionLabel && (
          <div className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700">
            <Sparkles className="h-3.5 w-3.5" />
            {data.actionLabel}
          </div>
        )}

        {data.summaryFlag && (
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
            <FileStack className="h-3.5 w-3.5" />
            Summary on
          </div>
        )}
      </div>

      {data.kind === "automated" && data.params && Object.keys(data.params).length > 0 && (
        <div className="mt-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-500">
            Runtime params
          </p>
          <div className="mt-2 space-y-1.5">
            {Object.entries(data.params)
              .filter(([, value]) => value?.trim())
              .slice(0, 2)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/80 px-2.5 py-1.5 text-[11px] text-slate-700"
                >
                  <span className="font-semibold capitalize text-slate-500">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="truncate font-medium text-slate-800">{value}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
