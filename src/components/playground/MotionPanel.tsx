import { usePlayground } from "@/context/PlaygroundContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useRef, useState } from "react";
import { Play, Square, Shuffle } from "lucide-react";
import { toast } from "sonner";

export default function MotionPanel() {
  const { info } = usePlayground();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const [g, list] of Object.entries(info.motions)) {
      const hits = list.filter((n) => (g + " " + n).toLowerCase().includes(q.toLowerCase()));
      if (hits.length) out[g] = hits;
    }
    return out;
  }, [info.motions, q]);
  const runningRef = useRef(false);

  const play = (group: string, index: number) => {
    const model = (window as any).__l2dModel ?? null;
    // Access the model via document lookup: playgroundContext keeps state; the stage stores model on window during load
    const app = (window as any).__l2dApp ?? null;
    const m = model || findModelInStage(app);
    if (!m) {
      toast.error("No model in stage");
      return;
    }
    try {
      m.motion(group, index);
      runningRef.current = true;
    } catch (e: any) {
      toast.error("motion() failed", { description: e?.message });
    }
  };

  const stop = () => {
    const m = findModelOnStage();
    m?.internalModel?.motionManager?.stopAllMotions?.();
  };

  const random = () => {
    const groups = Object.keys(info.motions);
    if (!groups.length) return;
    const g = groups[Math.floor(Math.random() * groups.length)];
    const i = Math.floor(Math.random() * info.motions[g].length);
    play(g, i);
  };

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Motions
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="secondary" onClick={random}>
            <Shuffle className="mr-1 h-3 w-3" /> Random
          </Button>
          <Button size="sm" variant="outline" onClick={stop}>
            <Square className="mr-1 h-3 w-3" /> Stop
          </Button>
        </div>
      </div>
      <Input
        placeholder="Search motions…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-2 h-8 text-xs"
      />
      <div className="scrollbar-thin max-h-[40vh] space-y-3 overflow-y-auto pr-1">
        {Object.keys(filtered).length === 0 && (
          <div className="text-xs text-muted-foreground">No motions.</div>
        )}
        {Object.entries(filtered).map(([group, list]) => (
          <div key={group}>
            <div className="mb-1 text-[11px] font-medium text-muted-foreground">{group}</div>
            <div className="flex flex-wrap gap-1.5">
              {list.map((name, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant="secondary"
                  className="h-7 text-[11px]"
                  onClick={() => play(group, i)}
                >
                  <Play className="mr-1 h-3 w-3" /> {name}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Utility: find the loaded pixi-live2d-display model on the current Pixi app.
export function findModelOnStage(): any | null {
  const m = (window as any).__l2dModel;
  if (m?.internalModel) return m;
  const app = (window as any).__l2dApp;
  if (app?.stage?.children) {
    for (const ch of app.stage.children) if (ch?.internalModel) return ch;
  }
  return null;
}

function findModelInStage(app: any): any | null {
  if (!app?.stage?.children) return null;
  for (const ch of app.stage.children) if (ch?.internalModel) return ch;
  return null;
}

