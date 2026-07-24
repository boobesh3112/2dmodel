import { FolderPlus, PackageOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModelLibrary } from "@/context/ModelLibraryContext";

export default function EmptyState() {
  const { refresh, loading } = useModelLibrary();
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary/25 to-accent/20 ring-1 ring-primary/40">
        <PackageOpen className="h-9 w-9 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">No Live2D models found.</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Upload model folders into{" "}
          <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[11px]">
            /public/models/
          </code>{" "}
          and refresh. The scanner picks up any{" "}
          <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[11px]">
            *.model3.json
          </code>{" "}
          automatically — no code changes needed.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => refresh()} disabled={loading} size="sm" variant="secondary">
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Rescan
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open("/models/", "_blank")}
          className="gap-1.5"
        >
          <FolderPlus className="h-3.5 w-3.5" /> Open models folder
        </Button>
      </div>
      <div className="rounded-xl border border-panel-border/60 bg-muted/20 p-3 text-left text-[11px] font-mono text-muted-foreground">
        public/models/
        <br />
        &nbsp;&nbsp;my-model/
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;runtime/my-model.model3.json
      </div>
    </div>
  );
}
