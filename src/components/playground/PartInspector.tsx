import { usePlayground } from "@/context/PlaygroundContext";
import { Slider } from "@/components/ui/slider";
import { findModelOnStage } from "./MotionPanel";

export default function PartInspector() {
  const { info } = usePlayground();
  return (
    <section>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Parts ({info.parts.length})
      </div>
      <div className="scrollbar-thin max-h-[30vh] space-y-2 overflow-y-auto pr-1">
        {info.parts.length === 0 && (
          <div className="text-xs text-muted-foreground">No parts.</div>
        )}
        {info.parts.map((p, i) => (
          <div key={p.id} className="glass-inset px-2 py-2">
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="truncate font-mono">{p.id}</span>
              <span className="text-muted-foreground">{p.opacity.toFixed(2)}</span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[p.opacity]}
              onValueChange={(v) => {
                const m = findModelOnStage();
                m?.internalModel?.coreModel?.setPartOpacity?.(i, v[0]);
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
