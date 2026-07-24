import { usePlayground } from "@/context/PlaygroundContext";
import { fmtBytes } from "@/lib/live2d/loader";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Activity } from "lucide-react";

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-panel-border/60 py-1.5 text-xs">
      <span className="text-muted-foreground">{k}</span>
      <span className="max-w-[60%] truncate text-right font-mono text-foreground">{v}</span>
    </div>
  );
}

export default function InfoPanel() {
  const { source, activeName, activeCubism, state, info } = usePlayground();

  const files =
    source?.kind === "files"
      ? source.loaded.files.size
      : source?.kind === "url"
        ? source.entry.fileCount
        : 0;
  const bytes =
    source?.kind === "files"
      ? source.loaded.totalBytes
      : source?.kind === "url"
        ? source.entry.totalBytes
        : 0;
  const settingsPath =
    source?.kind === "files"
      ? source.loaded.settingsPath
      : source?.kind === "url"
        ? source.entry.settingsUrl
        : "";

  return (
    <div className="space-y-4">
      <section>
        <div className="mb-2 flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Model
          </div>
          {source ? (
            info.loadedOk ? (
              <Badge className="bg-success/15 text-[var(--color-success)]">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Loaded
              </Badge>
            ) : (
              <Badge className="bg-destructive/15 text-destructive">
                <AlertTriangle className="mr-1 h-3 w-3" /> Loading…
              </Badge>
            )
          ) : (
            <Badge variant="outline">Empty</Badge>
          )}
        </div>
        <div className="glass-inset p-3">
          <Row k="Name" v={activeName || "—"} />
          <Row k="Path" v={settingsPath || "—"} />
          <Row k="Folder size" v={bytes ? fmtBytes(bytes) : "—"} />
          <Row k="Cubism" v={activeCubism ? String(activeCubism) : "—"} />
          <Row k="Files" v={files ? String(files) : "—"} />
        </div>
      </section>

      <section>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Assets
        </div>
        <div className="glass-inset p-3">
          <Row k="Textures" v={`${info.textureCount} · ${info.textureRes}`} />
          <Row k="Drawables" v={info.drawableCount} />
          <Row k="Parts" v={info.partCount} />
          <Row k="Parameters" v={info.parameterCount} />
          <Row k="Motions" v={Object.values(info.motions).reduce((a, b) => a + b.length, 0)} />
          <Row k="Expressions" v={info.expressions.length} />
          <Row k="Hit areas" v={info.hitAreas.join(", ") || "—"} />
        </div>
      </section>

      <section>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Transform
        </div>
        <div className="glass-inset p-3">
          <Row k="Scale" v={state.scale.toFixed(3)} />
          <Row k="Position" v={`${state.x.toFixed(0)}, ${state.y.toFixed(0)}`} />
          <Row k="Rotation" v={`${state.rotation}°`} />
          <Row k="Opacity" v={`${Math.round(state.opacity * 100)}%`} />
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <Activity className="h-3 w-3" /> Performance
        </div>
        <div className="glass-inset space-y-2 p-3">
          <Row k="FPS" v={info.fps.toFixed(1)} />
          <Row k="Frame time" v={`${info.frameTime.toFixed(2)} ms`} />
          <Row k="Canvas" v={`${info.canvasWidth}×${info.canvasHeight}`} />
          {info.memory !== undefined && <Row k="JS heap" v={`${info.memory.toFixed(1)} MB`} />}
          <div>
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>FPS meter</span>
              <span>{Math.min(60, Math.round(info.fps))}/60</span>
            </div>
            <Progress value={(info.fps / 60) * 100} className="mt-1 h-1.5" />
          </div>
        </div>
      </section>

      {(info.warnings.length > 0 || info.errors.length > 0) && (
        <section>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Diagnostics
          </div>
          <div className="glass-inset space-y-1 p-3 text-xs">
            {info.warnings.map((w, i) => (
              <div key={i} className="text-[var(--color-warning)]">⚠ {w}</div>
            ))}
            {info.errors.map((e, i) => (
              <div key={i} className="text-destructive">✕ {e}</div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
