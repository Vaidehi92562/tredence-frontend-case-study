import {
  Bot,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Flag,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import type { SelectedWorkflowNode } from "../components/WorkflowCanvas";
import type { AutomationAction } from "../api/mockWorkflowApi";

type NodeConfigPreviewProps = {
  selectedNode: SelectedWorkflowNode | null;
  automations: AutomationAction[];
  onChange: (patch: Partial<SelectedWorkflowNode>) => void;
  onDelete: () => void;
};

function prettyLabel(text: string) {
  return text
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function InputField({
  label,
  value,
  type = "text",
  icon,
  onChange,
}: {
  label: string;
  value: string | number;
  type?: string;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {icon}
        {label}
      </p>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-none bg-transparent p-0 text-sm font-medium text-slate-800 outline-none"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-none border-none bg-transparent p-0 text-sm font-medium text-slate-800 outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-none bg-transparent p-0 text-sm font-medium text-slate-800 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}

export function NodeConfigPreview({
  selectedNode,
  automations,
  onChange,
  onDelete,
}: NodeConfigPreviewProps) {
  if (!selectedNode) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        Select a node from the canvas to inspect and edit its live configuration.
      </div>
    );
  }

  const iconMap = {
    start: CheckCircle2,
    task: ClipboardList,
    approval: ShieldCheck,
    automated: Bot,
    end: Flag,
  };

  const toneMap = {
    start: "text-emerald-700 bg-emerald-50 border-emerald-200",
    task: "text-sky-700 bg-sky-50 border-sky-200",
    approval: "text-amber-700 bg-amber-50 border-amber-200",
    automated: "text-violet-700 bg-violet-50 border-violet-200",
    end: "text-slate-700 bg-slate-100 border-slate-300",
  };

  const Icon = iconMap[selectedNode.kind];
  const tone = toneMap[selectedNode.kind];

  const activeAutomation =
    automations.find((automation) => automation.id === selectedNode.actionId) ??
    automations[0];

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border p-4 ${tone}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              Live node editor
            </p>
            <h3 className="mt-1 text-base font-bold">{selectedNode.title}</h3>
          </div>
        </div>

        <p className="mt-3 text-sm opacity-90">{selectedNode.subtitle}</p>
      </div>

      {selectedNode.kind === "start" && (
        <div className="grid gap-3">
          <InputField
            label="Start Title"
            value={selectedNode.title}
            onChange={(value) => onChange({ title: value })}
          />
          <TextareaField
            label="Subtitle"
            value={selectedNode.subtitle}
            onChange={(value) => onChange({ subtitle: value })}
          />
          <InputField
            label="Metadata Key"
            value={selectedNode.metadataKey ?? ""}
            onChange={(value) => onChange({ metadataKey: value })}
          />
          <InputField
            label="Metadata Value"
            value={selectedNode.metadataValue ?? ""}
            onChange={(value) => onChange({ metadataValue: value })}
          />
        </div>
      )}

      {selectedNode.kind === "task" && (
        <div className="grid gap-3">
          <InputField
            label="Title"
            value={selectedNode.title}
            onChange={(value) => onChange({ title: value })}
          />
          <TextareaField
            label="Description"
            value={selectedNode.description ?? ""}
            onChange={(value) =>
              onChange({
                description: value,
                subtitle: value || selectedNode.subtitle,
              })
            }
          />
          <InputField
            label="Assignee"
            icon={<UserRound className="h-3.5 w-3.5" />}
            value={selectedNode.assignee ?? ""}
            onChange={(value) => onChange({ assignee: value })}
          />
          <InputField
            label="Due Date"
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            value={selectedNode.dueDate ?? ""}
            onChange={(value) => onChange({ dueDate: value })}
          />
          <InputField
            label="Custom Key"
            value={selectedNode.customKey ?? ""}
            onChange={(value) => onChange({ customKey: value })}
          />
          <InputField
            label="Custom Value"
            value={selectedNode.customValue ?? ""}
            onChange={(value) => onChange({ customValue: value })}
          />
        </div>
      )}

      {selectedNode.kind === "approval" && (
        <div className="grid gap-3">
          <InputField
            label="Title"
            value={selectedNode.title}
            onChange={(value) => onChange({ title: value })}
          />
          <TextareaField
            label="Subtitle"
            value={selectedNode.subtitle}
            onChange={(value) => onChange({ subtitle: value })}
          />
          <InputField
            label="Approver Role"
            value={selectedNode.approverRole ?? ""}
            onChange={(value) => onChange({ approverRole: value })}
          />
          <InputField
            label="Auto-Approve Threshold"
            type="number"
            value={selectedNode.threshold ?? 0}
            onChange={(value) =>
              onChange({ threshold: value ? Number(value) : 0 })
            }
          />
        </div>
      )}

      {selectedNode.kind === "automated" && (
        <div className="grid gap-3">
          <InputField
            label="Title"
            value={selectedNode.title}
            onChange={(value) => onChange({ title: value })}
          />
          <TextareaField
            label="Subtitle"
            value={selectedNode.subtitle}
            onChange={(value) => onChange({ subtitle: value })}
          />
          <SelectField
            label="Automation Action"
            value={selectedNode.actionId ?? activeAutomation?.id ?? ""}
            options={automations.map((automation) => ({
              value: automation.id,
              label: automation.label,
            }))}
            onChange={(value) => {
              const nextAutomation =
                automations.find((automation) => automation.id === value) ??
                automations[0];

              const nextParams = Object.fromEntries(
                (nextAutomation?.params ?? []).map((key) => [
                  key,
                  selectedNode.params?.[key] ?? "",
                ])
              );

              onChange({
                actionId: nextAutomation?.id,
                actionLabel: nextAutomation?.label,
                subtitle: nextAutomation?.description ?? selectedNode.subtitle,
                params: nextParams,
              });
            }}
          />

          {(activeAutomation?.params ?? []).map((paramKey) => (
            <InputField
              key={paramKey}
              label={prettyLabel(paramKey)}
              value={selectedNode.params?.[paramKey] ?? ""}
              onChange={(value) =>
                onChange({
                  params: {
                    ...(selectedNode.params ?? {}),
                    [paramKey]: value,
                  },
                })
              }
            />
          ))}
        </div>
      )}

      {selectedNode.kind === "end" && (
        <div className="grid gap-3">
          <InputField
            label="Title"
            value={selectedNode.title}
            onChange={(value) => onChange({ title: value })}
          />
          <TextareaField
            label="End Message"
            value={selectedNode.endMessage ?? ""}
            onChange={(value) =>
              onChange({
                endMessage: value,
                subtitle: value || selectedNode.subtitle,
              })
            }
          />
          <ToggleField
            label="Summary Flag"
            checked={Boolean(selectedNode.summaryFlag)}
            onChange={(checked) => onChange({ summaryFlag: checked })}
          />
        </div>
      )}

      <button
        onClick={onDelete}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
      >
        <Trash2 className="h-4 w-4" />
        Delete Selected Node
      </button>

      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
        <div className="flex items-center gap-2 text-violet-700">
          <Sparkles className="h-4 w-4" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
            Standout factor
          </p>
        </div>

        <p className="mt-2 text-sm font-medium text-violet-900">
          Every node type has its own configurable form surface with controlled fields.
        </p>

        <p className="mt-3 text-xs text-violet-700">
          Selected node id: {selectedNode.id}
        </p>
      </div>
    </div>
  );
}
