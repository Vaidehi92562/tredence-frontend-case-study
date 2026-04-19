import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import type { ValidationResult } from "../utils/validateWorkflow";

export function ValidationSummary({
  validation,
}: {
  validation: ValidationResult;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workflow Validation
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Live structural checks for the current graph
          </p>
        </div>

        <div
          className={`rounded-2xl border px-4 py-3 text-center ${
            validation.isValid
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <p className="text-[11px] uppercase tracking-[0.18em]">Health score</p>
          <p className="mt-1 text-2xl font-bold">{validation.score}</p>
        </div>
      </div>

      <div className="mt-4">
        {validation.issues.length === 0 ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <p className="text-sm font-semibold">
                Workflow looks structurally healthy.
              </p>
            </div>
            <p className="mt-2 text-xs text-emerald-700">
              Start/End structure, reachability, and cycle checks look good.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {validation.issues.slice(0, 5).map((issue) => (
              <div
                key={issue.id}
                className={`rounded-2xl border p-3 ${
                  issue.level === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-800"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                <div className="flex items-start gap-2">
                  {issue.level === "error" ? (
                    <ShieldAlert className="mt-0.5 h-4 w-4" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4" />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{issue.message}</p>
                    <p className="mt-1 text-xs opacity-90">{issue.hint}</p>
                  </div>
                </div>
              </div>
            ))}

            {validation.issues.length > 5 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                + {validation.issues.length - 5} more issue(s)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
