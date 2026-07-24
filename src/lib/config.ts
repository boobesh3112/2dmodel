export type AppConfig = {
  modelsDirectory: string;
  autoScan: boolean;
  theme: "dark" | "light";
  defaultBackground: "grid" | "checker" | "solid" | "transparent" | "gradient";
  showFPS: boolean;
  autoFit: boolean;
  defaultScale: number;
  wheelZoom: boolean;
  dragEnabled: boolean;
  sidebar: {
    defaultView: "grid" | "list";
    defaultSort: "name" | "modified" | "size" | "cubism";
  };
};

export const defaultConfig: AppConfig = {
  modelsDirectory: "/models",
  autoScan: true,
  theme: "dark",
  defaultBackground: "grid",
  showFPS: true,
  autoFit: true,
  defaultScale: 0.25,
  wheelZoom: true,
  dragEnabled: true,
  sidebar: { defaultView: "grid", defaultSort: "name" },
};

let cached: AppConfig | null = null;

export async function loadAppConfig(): Promise<AppConfig> {
  if (cached) return cached;
  try {
    const res = await fetch("/config.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    cached = { ...defaultConfig, ...json, sidebar: { ...defaultConfig.sidebar, ...(json.sidebar || {}) } };
  } catch (err) {
    console.warn("[config] using defaults:", err);
    cached = defaultConfig;
  }
  return cached ?? defaultConfig;

}
