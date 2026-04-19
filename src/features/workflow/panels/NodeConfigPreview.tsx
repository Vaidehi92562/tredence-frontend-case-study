import {
  Bot,
  CheckCircle2,
  ClipboardList,
  Flag,
  ShieldCheck,
  Sparkles,
  Trash2,
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
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-none bg-transparent p-0 text-sm font-medium text-slate-800 outline-none"
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

  const extraFieldsByKind = {
    start: (
      <>
        <InputField
          label="Template Label"
          value={selectedNode.metaLabel ?? ""}
          onChange={(value) => onChange({ metaLabel: value })}
        />
        <InputField
          label="Template Value"
          value={selectedNode.metaValue ?? ""}
          onChange={(value) => onChange({ metaValue: value })}
        />
      </>
    ),
    task: (
      <>
        <InputField
          label="Owner Label"
          value={selectedNode.metaLabel ?? ""}
          onChange={(value) => onChange({ metaLabel: value })}
        />
        <InputField
          label="Assignee / Team"
          value={selectedNode.metaValue ?? ""}
          onChange={(value) => onChange({ metaValue: value })}
        />
      </>
    ),
    approval: (
      <>
        <InputField
          label="Role Label"
          value={selectedNode.metaLabel ?? ""}
          onChange={(value) => onChange({ metaLabel: value })}
        />
        <InputField
          label="Approver Role"
          value={selectedNode.metaValue ?? ""}
          onChange={(value) => onChange({ metaValue: value })}
        />
      </>
    ),
    automated: (
      <>
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
              (nextAutomation?.paramKeys ?? []).map((key) => [
                key,
                selectedNode.params?.[key] ?? "",
              ])
            );

            onChange({
              actionId: nextAutomation?.id,
              metaLabel: "Action",
              metaValue: nextAutomation?.label ?? "Automation",
              subtitle: nextAutomation?.description ?? selectedNode.subtitle,
              params: nextParams,
            });
          }}
        />

        <InputField
          label="Action Label"
          value={selectedNode.metaLabel ?? ""}
          onChange={(value) => onChange({ metaLabel: value })}
        />

        {activeAutomation?.paramKeys.map((paramKey) => (
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
      </>
    ),
    end: (
      <>
        <InputField
          label="Status Label"
          value={selectedNode.metaLabel ?? ""}
          onChange={(value) => onChange({ metaLabel: value })}
        />
        <InputField
          label="Status Value"
          value={selectedNode.metaValue ?? ""}
          onChange={(value) => onChange({ metaValue: value })}
        />
      </>
    ),
  };

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

      <div className="grid gap-3">
        <InputField
          label="Node Title"
          value={selectedNode.title}
          onChange={(value) => onChange({ title: value })}
        />
        <InputField
          label="Node Subtitle"
          value={selectedNode.subtitle}
          onChange={(value) => onChange({ subtitle: value })}
        />
        {extraFieldsByKind[selectedNode.kind]}
      </div>

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
            standout factor
          </p>
        </div>

        <p className="mt-2 text-sm font-medium text-violet-900">
          This is now a real editable inspector with dynamic automated-step fields.
        </p>

        <p className="mt-3 text-xs text-violet-700">
          Selected node id: {selectedNode.id}
        </p>
      </div>
    </div>
  );
}
