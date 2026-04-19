import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Workflow,
  ShieldCheck,
  BrainCircuit,
  Boxes,
  Stars,
  Layers3,
} from "lucide-react";
import { AppShell } from "./components/layout/AppShell";

const HERO_IMAGE_1 =
  "https://i.pinimg.com/1200x/51/3d/89/513d89d7689bc0b5be6c8f949c16e332.jpg";
const HERO_IMAGE_2 =
  "https://i.pinimg.com/736x/76/37/f3/7637f349ce5ab46ca38e2a1fe54f51a4.jpg";
const HERO_IMAGE_3 =
  "https://i.pinimg.com/736x/4f/93/c3/4f93c343115e3c68651f18e5719f3535.jpg";

function IntroSplash({ onSkip }: { onSkip: () => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#ede9fe,_#f8fafc_28%,_#eef6ff_68%,_#f5f3ff_100%)]">
      <div className="absolute inset-0">
        <div className="absolute left-20 top-16 h-32 w-32 rounded-[30px] bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-24 h-28 w-28 rounded-[26px] bg-sky-200/35 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-28 w-28 rounded-[26px] bg-emerald-200/30 blur-3xl" />
        <div className="absolute right-1/3 bottom-12 h-24 w-24 rounded-[24px] bg-fuchsia-200/25 blur-3xl" />
      </div>

      <div className="relative z-10 grid min-h-screen items-center gap-10 px-6 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-16">
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto h-[620px] w-full max-w-[760px]">
            <div className="absolute left-0 top-16 w-[58%] rounded-[34px] border border-white/80 bg-white/70 p-3 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[26px]">
                <img
                  src={HERO_IMAGE_1}
                  alt="Workflow inspiration 1"
                  className="h-[310px] w-full object-cover"
                />
              </div>
            </div>

            <div className="absolute right-2 top-0 w-[36%] rounded-[30px] border border-white/80 bg-white/70 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[22px]">
                <img
                  src={HERO_IMAGE_2}
                  alt="Workflow inspiration 2"
                  className="h-[220px] w-full object-cover"
                />
              </div>
            </div>

            <div className="absolute bottom-4 left-[20%] w-[48%] rounded-[32px] border border-white/80 bg-white/70 p-3 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[24px]">
                <img
                  src={HERO_IMAGE_3}
                  alt="Workflow inspiration 3"
                  className="h-[250px] w-full object-cover"
                />
              </div>
            </div>

            <div className="absolute left-[46%] top-[235px] rounded-full border border-violet-200 bg-white/90 px-4 py-2 shadow-lg backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-700">
                <Sparkles className="h-4 w-4" />
                Product-grade workflow UX
              </div>
            </div>

            <div className="absolute right-[8%] bottom-[84px] rounded-full border border-sky-200 bg-white/90 px-4 py-2 shadow-lg backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
                <Layers3 className="h-4 w-4" />
                Rich visual storytelling
              </div>
            </div>

            <div className="absolute left-8 bottom-0 rounded-3xl border border-white/80 bg-white/80 px-5 py-4 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Built for
              </p>
              <p className="mt-2 text-sm font-bold text-slate-900">
                HR automation design
              </p>
              <p className="mt-1 text-xs text-slate-500">
                onboarding • approvals • verification
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="mx-auto max-w-2xl rounded-[38px] border border-white/75 bg-white/78 p-8 shadow-[0_28px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
              <Stars className="h-4 w-4" />
              Tredence Frontend Case Study
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 text-white shadow-xl shadow-indigo-200">
                <Workflow className="h-8 w-8" />
              </div>

              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  HRFlow Studio
                </h1>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                  AI-Assisted Workflow Designer
                </p>
              </div>
            </div>

            <p className="mt-8 text-lg leading-8 text-slate-600">
              A premium mini workflow product for HR operations — designed to show
              modular React architecture, React Flow fluency, dynamic forms,
              validation, sandbox simulation, and mock API integration.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4">
                <div className="flex items-center gap-2 text-violet-700">
                  <Boxes className="h-4 w-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Canvas
                  </p>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Drag, connect, edit
                </p>
              </div>

              <div className="rounded-3xl border border-sky-200 bg-sky-50 p-4">
                <div className="flex items-center gap-2 text-sky-700">
                  <BrainCircuit className="h-4 w-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Sandbox
                  </p>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Simulate and inspect
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Quality
                  </p>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Validate graph health
                </p>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-full border border-slate-200 bg-white">
              <div className="h-3 w-full animate-pulse bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500" />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Launching standout studio preview...
              </p>

              <button
                onClick={onSkip}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Skip intro
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowIntro(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  return showIntro ? (
    <IntroSplash onSkip={() => setShowIntro(false)} />
  ) : (
    <AppShell />
  );
}
