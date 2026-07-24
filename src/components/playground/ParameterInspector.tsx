import { usePlayground } from "@/context/PlaygroundContext";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { findModelOnStage } from "./MotionPanel";
import { RotateCcw } from "lucide-react";

export default function ParameterInspector() {
  const { info } = usePlayground();
  const [q, setQ] = useState("");
  const params = useMemo(
    () => info.parameters.filter((p) => p.id.toLowerCase().includes(q.toLowerCase())),
    [info.parameters, q],
  );

  const setVal = (id: string, v: number) => {
    const m = findModelOnStage();
    if (!m) return;
    try {
      m.internalModel.coreModel.setParameterValueById?.(id, v);
    } catch {
      const cm = m.internalModel.coreModel;
      const n = cm.getParameterCount();
      for (let i = 0; i < n; i++) {
        if (cm.getParameterId(i) === id) {
          cm.setParameterValueByIndex(i, v);
          break;
        }
      }
    }
  };

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Parameters ({info.parameters.length})
        </div>
      </div>
      <Input
        placeholder="Search parameters…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-2 h-8 text-xs"
      />
      <div className="scrollbar-thin max-h-[45vh] space-y-2 overflow-y-auto pr-1">
        {params.length === 0 && (
          <div className="text-xs text-muted-foreground">No parameters.</div>
        )}
        {params.map((p) => (
          <div key={p.id} className="glass-inset px-2 py-2">
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="truncate font-mono">{p.id}</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-muted-foreground">{p.value.toFixed(2)}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5"
                  onClick={() => setVal(p.id, p.default)}
                  title="Reset"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Slider
              min={p.min}
              max={p.max}
              step={(p.max - p.min) / 200 || 0.01}
              value={[p.value]}
              onValueChange={(v) => setVal(p.id, v[0])}
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground">
              <span>{p.min.toFixed(1)}</span>
              <span>{p.max.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
