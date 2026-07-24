import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchModelManifest, type ModelManifest, type ModelManifestEntry } from "@/lib/live2d/manifest";
import { usePlayground } from "./PlaygroundContext";

type Ctx = {
  manifest: ModelManifest;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  /** IDs the user has locally hidden ("delete" in the sidebar). Manifest is
   *  still the source of truth on server; this just filters the UI. */
  hidden: string[];
  hide: (id: string) => void;
  unhideAll: () => void;
  visibleModels: ModelManifestEntry[];
  byId: (id: string) => ModelManifestEntry | undefined;
};

const LibraryCtx = createContext<Ctx | null>(null);
const LS_HIDDEN = "l2d.library.hidden";

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

export function ModelLibraryProvider({ children }: { children: ReactNode }) {
  const { config } = usePlayground();
  const [manifest, setManifest] = useState<ModelManifest>({
    generatedAt: 0,
    modelsDirectory: config.modelsDirectory,
    count: 0,
    models: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    setHidden(readLS<string[]>(LS_HIDDEN, []));
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(LS_HIDDEN, JSON.stringify(hidden));
    } catch {}
  }, [hidden]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const m = await fetchModelManifest(config.modelsDirectory);
      setManifest(m);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, [config.modelsDirectory]);

  useEffect(() => {
    if (config.autoScan) refresh();
  }, [config.autoScan, refresh]);

  const value = useMemo<Ctx>(
    () => ({
      manifest,
      loading,
      error,
      refresh,
      hidden,
      hide: (id) => setHidden((h) => (h.includes(id) ? h : [...h, id])),
      unhideAll: () => setHidden([]),
      visibleModels: manifest.models.filter((m) => !hidden.includes(m.id)),
      byId: (id) => manifest.models.find((m) => m.id === id),
    }),
    [manifest, loading, error, refresh, hidden],
  );

  return <LibraryCtx.Provider value={value}>{children}</LibraryCtx.Provider>;
}

export function useModelLibrary() {
  const c = useContext(LibraryCtx);
  if (!c) throw new Error("useModelLibrary must be used inside ModelLibraryProvider");
  return c;
}
