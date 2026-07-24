import { usePlayground } from "@/context/PlaygroundContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMemo, useRef } from "react";
import { Copy, Download, Upload } from "lucide-react";
import { toast } from "sonner";

export default function ExportPanel() {
  const { state, setState, activeName } = usePlayground();
  const fileRef = useRef<HTMLInputElement>(null);

  const json = useMemo(
    () =>
      JSON.stringify(
        {
          model: activeName || "unknown",
          scale: +state.scale.toFixed(4),
          positionX: state.x,
          positionY: state.y,
          rotation: state.rotation,
          opacity: state.opacity,
          animationSpeed: state.animationSpeed,
          dragEnabled: state.dragEnabled,
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      ),
    [state, activeName],
  );


  return (
    <section>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Config
      </div>
      <Textarea readOnly value={json} className="h-40 font-mono text-[11px]" />
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(json);
            toast.success("Config copied");
          }}
        >
          <Copy className="mr-1 h-3 w-3" /> Copy
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${activeName || "live2d"}-config.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="mr-1 h-3 w-3" /> Download
        </Button>
        <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
          <Upload className="mr-1 h-3 w-3" /> Import
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              const j = JSON.parse(await f.text());
              setState((s) => ({
                ...s,
                scale: j.scale ?? s.scale,
                x: j.positionX ?? s.x,
                y: j.positionY ?? s.y,
                rotation: j.rotation ?? s.rotation,
                opacity: j.opacity ?? s.opacity,
                animationSpeed: j.animationSpeed ?? s.animationSpeed,
                dragEnabled: j.dragEnabled ?? s.dragEnabled,
              }));
              toast.success("Config imported");
            } catch (err: any) {
              toast.error("Invalid JSON", { description: err?.message });
            }
            e.target.value = "";
          }}
        />
      </div>
    </section>
  );
}
