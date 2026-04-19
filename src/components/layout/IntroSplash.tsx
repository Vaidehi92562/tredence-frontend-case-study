import { Bot, ShieldCheck, Sparkles, Workflow, Zap } from "lucide-react";

type IntroSplashProps = {
  phase: "intro" | "exit";
};

const highlights = [
  { icon: Sparkles, label: "Workflow Intelligence", delay: "0ms" },
  { icon: Bot, label: "Automation Simulation", delay: "180ms" },
  { icon: ShieldCheck, label: "Validation-first Design", delay: "360ms" },
];

export function IntroSplash({ phase }: IntroSplashProps) {
  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-[#050816] transition-all duration-1000 ${
        phase === "exit" ? "scale-110 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(99,102,241,0.28),transparent_24%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.18),transparent_24%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.14),transparent_22%)]" />
      <div className="animate-intro-glow absolute left-[18%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="animate-intro-glow absolute right-[12%] top-[30%] h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative flex h-full items-center px-6 py-8">
        <div className="mx-auto grid h-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-intro-rise relative h-[78vh] min-h-[560px] overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <img
              src="https://i.pinimg.com/736x/76/37/f3/7637f349ce5ab46ca38e2a1fe54f51a4.jpg"
              alt="Workflow inspiration"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-cyan-400/10" />

            <div className="absolute left-6 top-6 rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-violet-200">
                premium preview
              </p>
              <p className="mt-1 text-sm font-semibold">Reviewer-first experience</p>
            </div>

            <div className="absolute right-6 top-6 rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-sky-200">
                standout factor
              </p>
              <p className="mt-1 text-sm font-semibold">Product, not assignment</p>
            </div>

            <div className="absolute bottom-6 left-6 right-6 rounded-[28px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-2xl">
              <div className="flex items-center gap-2 text-violet-200">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                  Design Inspiration
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-bold tracking-tight">
                High-clarity workflow storytelling
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
                We’re opening with a cinematic split-screen intro so the reviewer instantly
                feels this is a premium internal workflow platform.
              </p>
            </div>
          </div>

          <div className="animate-intro-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              Tredence Frontend Case Study
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/15 bg-white/10 text-white shadow-2xl shadow-violet-500/20 backdrop-blur-xl">
                <Workflow className="h-10 w-10" />
              </div>

              <div>
                <h1 className="bg-gradient-to-r from-white via-violet-100 to-sky-100 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-7xl">
                  HRFlow Studio
                </h1>
                <p className="mt-2 text-base text-slate-300 md:text-lg">
                  AI-assisted workflow design system for People Operations
                </p>
              </div>
            </div>

            <p className="mt-8 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              A cinematic product opening built to make the reviewer pause in the first
              five seconds — elegant branding, premium composition, and a transition into
              a workflow platform that feels real.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="animate-intro-rise rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-lg backdrop-blur-xl"
                    style={{ animationDelay: item.delay }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-violet-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="text-xs text-slate-400">Premium reviewer impact</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 max-w-2xl rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
                <span>Loading experience</span>
                <span>5 second cinematic preview</span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="animate-progress-fill h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-400" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-violet-400/15 bg-violet-400/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-violet-200">
                    Initializing
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Templates, validation graph, execution timeline
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-400/15 bg-sky-400/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-sky-200">
                    Positioning
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Internal product energy, not generic portfolio energy
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-400">
                Transitioning into the live dashboard…
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
