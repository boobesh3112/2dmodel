import { useMemo, useState } from "react";
import {
  Grid2x2,
  Heart,
  List,
  Play,
  Plus,
  RefreshCw,
  Search,
  Square,
  Star,
  Trash2,
  ArrowUpDown,
  ImageOff,
  History,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlayground } from "@/context/PlaygroundContext";
import { useModelLibrary } from "@/context/ModelLibraryContext";
import { fmtBytes, fmtRelativeTime, type ModelManifestEntry } from "@/lib/live2d/manifest";
import { toast } from "sonner";

type Sort = "name" | "modified" | "size" | "cubism" | "motions";

const statusBadge = (s: ModelManifestEntry["status"]) => {
  switch (s) {
    case "ok":
      return <Badge className="bg-success/15 text-[var(--color-success)]">OK</Badge>;
    case "missing_files":
      return (
        <Badge className="bg-[color:var(--color-warning)]/15 text-[var(--color-warning)]">
          Missing files
        </Badge>
      );
    case "broken":
      return <Badge className="bg-destructive/15 text-destructive">Broken</Badge>;
  }
};

export default function ModelSidebar({
  onOpenManager,
}: {
  onOpenManager: (id: string) => void;
}) {
  const { visibleModels, loading, refresh, hide } = useModelLibrary();
  const { source, loadFromEntry, unload, favorites, toggleFavorite, recent, config, addExtra } =
    usePlayground();

  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "list">(config.sidebar.defaultView);
  const [sort, setSort] = useState<Sort>(config.sidebar.defaultSort as Sort);
  const [onlyFav, setOnlyFav] = useState(false);

  const activeId = source?.kind === "url" ? source.entry.id : null;

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = visibleModels.filter((m) => {
      if (onlyFav && !favorites.includes(m.id)) return false;
      if (!term) return true;
      return (
        m.modelName.toLowerCase().includes(term) ||
        m.folderName.toLowerCase().includes(term) ||
        String(m.cubismVersion).includes(term)
      );
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "modified":
          return b.lastModified - a.lastModified;
        case "size":
          return b.totalBytes - a.totalBytes;
        case "cubism":
          return b.cubismVersion - a.cubismVersion;
        case "motions":
          return b.motionCount - a.motionCount;
        default:
          return a.modelName.localeCompare(b.modelName);
      }
    });
    return list;
  }, [visibleModels, q, sort, onlyFav, favorites]);

  const recentModels = useMemo(
    () =>
      recent
        .map((id) => visibleModels.find((m) => m.id === id))
        .filter(Boolean) as ModelManifestEntry[],
    [recent, visibleModels],
  );

  return (
    <div className="flex h-full flex-col">
      {/* Top toolbar */}
      <div className="border-b border-panel-border/60 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Library
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-[10px]">
              {visibleModels.length}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => refresh()}
              title="Rescan"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search models…"
            className="h-8 pl-7 text-xs"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1">
          <Button
            size="sm"
            variant={onlyFav ? "secondary" : "ghost"}
            className="h-7 gap-1 px-2 text-[11px]"
            onClick={() => setOnlyFav((v) => !v)}
          >
            <Heart className={`h-3 w-3 ${onlyFav ? "fill-current text-primary" : ""}`} />
            Favorites
          </Button>
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7" title="Sort">
                <ArrowUpDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(["name", "modified", "size", "cubism", "motions"] as Sort[]).map((s) => (
                <DropdownMenuItem key={s} onSelect={() => setSort(s)}>
                  {sort === s ? "• " : "  "}
                  {s === "name"
                    ? "Name"
                    : s === "modified"
                      ? "Last modified"
                      : s === "size"
                        ? "Folder size"
                        : s === "cubism"
                          ? "Cubism version"
                          : "Motion count"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex overflow-hidden rounded-md border border-panel-border/60">
            <button
              onClick={() => setView("grid")}
              className={`grid h-7 w-7 place-items-center ${view === "grid" ? "bg-muted/60 text-foreground" : "text-muted-foreground"}`}
              title="Grid"
            >
              <Grid2x2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`grid h-7 w-7 place-items-center ${view === "list" ? "bg-muted/60 text-foreground" : "text-muted-foreground"}`}
              title="List"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent */}
      {recentModels.length > 0 && (
        <div className="border-b border-panel-border/60 p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <History className="h-3 w-3" /> Recent
          </div>
          <div className="flex flex-wrap gap-1">
            {recentModels.slice(0, 6).map((m) => (
              <button
                key={m.id}
                onClick={() => loadFromEntry(m)}
                className={`rounded-md border border-panel-border/60 bg-muted/20 px-2 py-1 text-[10px] hover:bg-muted/40 ${
                  activeId === m.id ? "border-primary text-primary" : ""
                }`}
              >
                {m.modelName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div className="scrollbar-thin flex-1 overflow-y-auto p-3">
        {loading && filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">Scanning…</div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            {q ? "No matches." : "No models in /public/models/."}
          </div>
        )}

        {view === "grid" ? (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((m) => (
              <Card
                key={m.id}
                m={m}
                active={activeId === m.id}
                fav={favorites.includes(m.id)}
                onLoad={() => loadFromEntry(m)}
                onUnload={unload}
                onAdd={() => {
                  addExtra(m);
                  toast.success(`Added ${m.modelName} to stage`);
                }}
                onFav={() => toggleFavorite(m.id)}
                onOpen={() => onOpenManager(m.id)}
                onDelete={() => {
                  if (activeId === m.id) unload();
                  hide(m.id);
                  toast.message(`Hidden ${m.modelName}`, {
                    description: "Local only — files remain in /public/models/.",
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((m) => (
              <Row
                key={m.id}
                m={m}
                active={activeId === m.id}
                fav={favorites.includes(m.id)}
                onLoad={() => loadFromEntry(m)}
                onAdd={() => {
                  addExtra(m);
                  toast.success(`Added ${m.modelName} to stage`);
                }}
                onFav={() => toggleFavorite(m.id)}
                onOpen={() => onOpenManager(m.id)}
                onDelete={() => {
                  if (activeId === m.id) unload();
                  hide(m.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Thumb({ m }: { m: ModelManifestEntry }) {
  if (!m.thumbnail) {
    return (
      <div className="grid aspect-square w-full place-items-center rounded-md bg-gradient-to-br from-muted/30 to-muted/10">
        <ImageOff className="h-5 w-5 text-muted-foreground/60" />
      </div>
    );
  }
  return (
    <img
      src={m.thumbnail}
      alt={m.modelName}
      loading="lazy"
      className="aspect-square w-full rounded-md object-cover"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

function Card({
  m,
  active,
  fav,
  onLoad,
  onUnload,
  onAdd,
  onFav,
  onOpen,
  onDelete,
}: {
  m: ModelManifestEntry;
  active: boolean;
  fav: boolean;
  onLoad: () => void;
  onUnload: () => void;
  onAdd: () => void;
  onFav: () => void;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`group relative rounded-lg border p-2 transition ${
        active
          ? "border-primary/60 bg-primary/10 shadow-[0_0_0_1px_var(--color-primary)]"
          : "border-panel-border/60 bg-muted/10 hover:bg-muted/25"
      }`}
    >
      <button onClick={onOpen} className="block w-full text-left">
        <Thumb m={m} />
        <div className="mt-1.5 truncate text-[11px] font-medium">{m.modelName}</div>
        <div className="truncate text-[10px] text-muted-foreground">
          C{m.cubismVersion} · {m.motionCount}m · {m.expressionCount}e
        </div>
      </button>
      <div className="mt-1.5 flex items-center gap-1">
        <Button
          size="sm"
          variant={active ? "secondary" : "default"}
          className="h-6 flex-1 px-2 text-[10px]"
          onClick={active ? onUnload : onLoad}
        >
          {active ? <Square className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
          {active ? "Unload" : "Load"}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={onAdd}
          title="Add to stage (multi-character)"
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={onFav}
          title={fav ? "Unfavorite" : "Favorite"}
        >
          <Star className={`h-3 w-3 ${fav ? "fill-current text-primary" : ""}`} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
          title="Hide (local only)"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <div className="absolute right-1.5 top-1.5">{statusBadge(m.status)}</div>
    </div>
  );
}

function Row({
  m,
  active,
  fav,
  onLoad,
  onAdd,
  onFav,
  onOpen,
  onDelete,
}: {
  m: ModelManifestEntry;
  active: boolean;
  fav: boolean;
  onLoad: () => void;
  onAdd: () => void;
  onFav: () => void;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border p-1.5 ${
        active ? "border-primary/60 bg-primary/10" : "border-transparent hover:bg-muted/25"
      }`}
    >
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded">
        <Thumb m={m} />
      </div>
      <button onClick={onOpen} className="min-w-0 flex-1 text-left">
        <div className="truncate text-[11px] font-medium">{m.modelName}</div>
        <div className="truncate text-[10px] text-muted-foreground">
          C{m.cubismVersion} · {m.motionCount}m · {fmtBytes(m.totalBytes)} · {fmtRelativeTime(m.lastModified)}
        </div>
      </button>
      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onFav} title="Favorite">
        <Star className={`h-3 w-3 ${fav ? "fill-current text-primary" : ""}`} />
      </Button>
      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onAdd} title="Add to stage">
        <Plus className="h-3 w-3" />
      </Button>
      <Button size="icon" variant={active ? "secondary" : "ghost"} className="h-6 w-6" onClick={onLoad} title="Load">
        <Play className="h-3 w-3" />
      </Button>
      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onDelete} title="Remove">
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
