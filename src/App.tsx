import { useEffect, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { IntroSplash } from "./components/layout/IntroSplash";

function App() {
  const [phase, setPhase] = useState<"intro" | "exit" | "app">("intro");

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setPhase("exit"), 4200);
    const appTimer = window.setTimeout(() => setPhase("app"), 5200);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(appTimer);
    };
  }, []);

  return (
    <div className="min-h-screen w-full">
      <div
        className={`h-full w-full transition-all duration-1000 ${
          phase === "app" ? "scale-100 opacity-100" : "scale-[0.985] opacity-90 blur-[1px]"
        }`}
      >
        <AppShell />
      </div>

      {phase !== "app" && <IntroSplash phase={phase === "exit" ? "exit" : "intro"} />}
    </div>
  );
}

export default App;
