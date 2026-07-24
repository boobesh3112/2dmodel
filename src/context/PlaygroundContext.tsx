import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from "react";
import type { LoadedModelFiles } from "@/lib/live2d/types";
import type { ModelManifestEntry } from "@/lib/live2d/manifest";
import { loadAppConfig, defaultConfig, type AppConfig } from "@/lib/config";

export type Background = "grid" | "checker" | "solid" | "transparent" | "gradient";
export type DebugFlags = {
  showHitAreas: boolean;
  showBounds: boolean;
  showOrigin: boolean;
  showSafeArea: boolean;
};

export type ModelState = {
  scale: number;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  animationSpeed: number;
  dragEnabled: boolean;
};

export const defaultModelState: ModelState = {
  scale: 0.25,
  x: 0,
  y: 0,
  rotation: 0,
  opacity: 1,
  animationSpeed: 1,
  dragEnabled: true,
};

export type ActiveSource =
  | { kind: "files"; loaded: LoadedModelFiles }
  | { kind: "url"; entry: ModelManifestEntry }
  | null;

type Ctx = {
  config: AppConfig;

  source: ActiveSource;
  loadFromFiles: (loaded: LoadedModelFiles) => void;
  loadFromEntry: (entry: ModelManifestEntry) => void;
  unload: () => void;

  activeName: string;
  activeCubism: 2 | 3 | 4 | null;

  recent: string[];
  pushRecent: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;

  state: ModelState;
  setState: React.Dispatch<React.SetStateAction<ModelState>>;

  background: Background;
  setBackground: (b: Background) => void;
  bgColor: string;
  setBgColor: (c: string) => void;

  debug: DebugFlags;
  setDebug: React.Dispatch<React.SetStateAction<DebugFlags>>;

  info: LiveInfo;
  setInfo: React.Dispatch<React.SetStateAction<LiveInfo>>;
};

export type LiveInfo = {
  fps: number;
  frameTime: number;
  memory?: number;
  canvasWidth: number;
  canvasHeight: number;
  textureCount: number;
  textureRes: string;
  drawableCount: number;
  meshCount: number;
  parameterCount: number;
  partCount: number;
  hitAreas: string[];
  motions: Record<string, string[]>;
  expressions: string[];
  parameters: { id: string; value: number; min: number; max: number; default: number }[];
  parts: { id: string; opacity: number }[];
  currentMotion?: string;
  currentExpression?: string;
  warnings: string[];
  errors: string[];
  loadedOk: boolean;
};

export const emptyInfo: LiveInfo = {
  fps: 0,
  frameTime: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  textureCount: 0,
  textureRes: "-",
  drawableCount: 0,
  meshCount: 0,
  parameterCount: 0,
  partCount: 0,
  hitAreas: [],
  motions: {},
  expressions: [],
  parameters: [],
  parts: [],
  warnings: [],
  errors: [],
  loadedOk: false,
};

const PlaygroundCtx = createContext<Ctx | null>(null);

const LS_RECENT = "l2d.recent";
const LS_FAVORITES = "l2d.favorites";

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

export function PlaygroundProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [source, setSource] = useState<ActiveSource>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [state, setState] = useState<ModelState>(defaultModelState);
  const [background, setBackground] = useState<Background>("grid");
  const [bgColor, setBgColor] = useState("#141a2a");
  const [debug, setDebug] = useState<DebugFlags>({
    showHitAreas: false,
    showBounds: false,
    showOrigin: false,
    showSafeArea: false,
  });
  const [info, setInfo] = useState<LiveInfo>(emptyInfo);

  useEffect(() => {
    setRecent(readLS<string[]>(LS_RECENT, []));
    setFavorites(readLS<string[]>(LS_FAVORITES, []));
    loadAppConfig().then((c) => {
      setConfig(c);
      setBackground(c.defaultBackground);
      setState((s) => ({ ...s, scale: c.defaultScale, dragEnabled: c.dragEnabled }));
    });
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LS_RECENT, JSON.stringify(recent));
    } catch {}
  }, [recent]);
  useEffect(() => {
    try {
      window.localStorage.setItem(LS_FAVORITES, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const disposeCurrent = (s: ActiveSource) => {
    if (s?.kind === "files") {
      for (const v of s.loaded.files.values()) URL.revokeObjectURL(v.url);
    }
  };

  const value = useMemo<Ctx>(() => {
    const pushRecent = (id: string) =>
      setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 12));

    return {
      config,
      source,
      loadFromFiles: (loaded) => {
        setSource((prev) => {
          disposeCurrent(prev);
          return { kind: "files", loaded };
        });
        pushRecent(loaded.rootName);
      },
      loadFromEntry: (entry) => {
        setSource((prev) => {
          disposeCurrent(prev);
          return { kind: "url", entry };
        });
        pushRecent(entry.id);
      },
      unload: () => setSource((prev) => (disposeCurrent(prev), null)),
      activeName:
        source?.kind === "files"
          ? source.loaded.rootName
          : source?.kind === "url"
            ? source.entry.modelName
            : "",
      activeCubism:
        source?.kind === "files"
          ? source.loaded.cubismVersion
          : source?.kind === "url"
            ? source.entry.cubismVersion
            : null,
      recent,
      pushRecent,
      favorites,
      toggleFavorite: (id) =>
        setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [id, ...f])),
      state,
      setState,
      background,
      setBackground,
      bgColor,
      setBgColor,
      debug,
      setDebug,
      info,
      setInfo,
    };
  }, [config, source, recent, favorites, state, background, bgColor, debug, info]);

  return <PlaygroundCtx.Provider value={value}>{children}</PlaygroundCtx.Provider>;
}

export function usePlayground() {
  const c = useContext(PlaygroundCtx);
  if (!c) throw new Error("usePlayground must be used inside PlaygroundProvider");
  return c;
}
