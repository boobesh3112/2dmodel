import { usePlayground } from "@/context/PlaygroundContext";
import { Button } from "@/components/ui/button";
import { Shuffle, X } from "lucide-react";
import { findModelOnStage } from "./MotionPanel";
import { toast } from "sonner";

export default function ExpressionPanel() {
  const { info } = usePlayground();

  const apply = (name: string) => {
    const m = findModelOnStage();
    if (!m?.expression) {
      toast.error("Model missing expression()");
      return;
    }
    m.expression(name);
  };
  const reset = () => {
    const m = findModelOnStage();
    m?.internalModel?.motionManager?.expressionManager?.resetExpression?.();
  };
  const random = () => {
    if (!info.expressions.length) return;
    apply(info.expressions[Math.floor(Math.random() * info.expressions.length)]);
  };

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Expressions
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="secondary" onClick={random}>
            <Shuffle className="mr-1 h-3 w-3" /> Random
          </Button>
          <Button size="sm" variant="outline" onClick={reset}>
            <X className="mr-1 h-3 w-3" /> Reset
          </Button>
        </div>
      </div>
      {info.expressions.length === 0 ? (
        <div className="text-xs text-muted-foreground">None defined.</div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {info.expressions.map((name) => (
            <Button
              key={name}
              size="sm"
              variant="secondary"
              className="h-7 text-[11px]"
              onClick={() => apply(name)}
            >
              {name}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}
