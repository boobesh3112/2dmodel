import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RefreshCw, Square, Star, Trash2 } from "lucide-react";
import { fmtBytes, fmtRelativeTime } from "@/lib/live2d/manifest";
import { useModelLibrary } from "@/context/ModelLibraryContext";
import { usePlayground } from "@/context/PlaygroundContext";

export default function ModelManager({
  openId,
  onOpenChange,
}: {
  openId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { byId, hide } = useModelLibrary();
  const { source, loadFromEntry, unload, favorites, toggleFavorite } = usePlayground();
  const m = openId ? byId(openId) : undefined;
  const isActive = source?.kind === "url" && source.entry.id === m?.id;
  const isFav = m ? favorites.includes(m.id) : false;

  return (
    <Dialog open={!!openId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {m ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {m.modelName}
                <Badge variant="outline">Cubism {m.cubismVersion}</Badge>
                <StatusBadge status={m.status} />
              </DialogTitle>
              <DialogDescription className="truncate font-mono text-[11px]">
                {m.settingsUrl}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-[160px_1fr] gap-4">
              <div className="overflow-hidden rounded-lg border border-panel-border/60 bg-muted/20">
                {m.thumbnail ? (
                  <img
                    src={m.thumbnail}
                    alt={m.modelName}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="grid h-40 w-full place-items-center text-xs text-muted-foreground">
                    No thumbnail
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <Meta k="Folder" v={m.folderName} />
                <Meta k="Files" v={m.fileCount} />
                <Meta k="Folder size" v={fmtBytes(m.totalBytes)} />
                <Meta k="Last modified" v={fmtRelativeTime(m.lastModified)} />
                <Meta k="Motions" v={m.motionCount} />
                <Meta k="Expressions" v={m.expressionCount} />
                <Meta k="Textures" v={m.textureCount} />
                <Meta k="Physics" v={m.hasPhysics ? "Yes" : "—"} />
                <Meta k="Pose" v={m.hasPose ? "Yes" : "—"} />
                <Meta k="Status" v={m.status.replace("_", " ")} />
              </div>
            </div>

            {m.warnings.length > 0 && (
              <div className="rounded-md border border-[color:var(--color-warning)]/40 bg-[color:var(--color-warning)]/10 p-2 text-[11px] text-[color:var(--color-warning)]">
                <div className="mb-1 font-semibold">Warnings</div>
                <ul className="space-y-0.5">
                  {m.warnings.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter className="flex-wrap gap-2 sm:justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleFavorite(m.id)}>
                  <Star className={`mr-1 h-3.5 w-3.5 ${isFav ? "fill-current text-primary" : ""}`} />
                  {isFav ? "Unfavorite" : "Favorite"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (isActive) unload();
                    hide(m.id);
                    onOpenChange(false);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Delete (local)
                </Button>
              </div>
              <div className="flex gap-2">
                {isActive ? (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        unload();
                        setTimeout(() => loadFromEntry(m), 50);
                      }}
                    >
                      <RefreshCw className="mr-1 h-3.5 w-3.5" /> Reload
                    </Button>
                    <Button size="sm" onClick={unload}>
                      <Square className="mr-1 h-3.5 w-3.5" /> Unload
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => loadFromEntry(m)}>
                    <Play className="mr-1 h-3.5 w-3.5" /> Load model
                  </Button>
                )}
              </div>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function Meta({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-panel-border/40 py-1">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: "ok" | "missing_files" | "broken" }) {
  if (status === "ok") return <Badge className="bg-success/15 text-[var(--color-success)]">OK</Badge>;
  if (status === "missing_files")
    return (
      <Badge className="bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]">
        Missing files
      </Badge>
    );
  return <Badge className="bg-destructive/15 text-destructive">Broken</Badge>;
}
