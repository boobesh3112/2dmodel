export type ModelManifestEntry = {
  id: string;
  folderName: string;
  modelName: string;
  cubismVersion: 2 | 3 | 4;
  settingsUrl: string;
  motionCount: number;
  expressionCount: number;
  textureCount: number;
  hasPhysics: boolean;
  hasPose: boolean;
  totalBytes: number;
  fileCount: number;
  lastModified: number;
  thumbnail: string | null;
  status: "ok" | "missing_files" | "broken";
  warnings: string[];
};

export type ModelManifest = {
  generatedAt: number;
  modelsDirectory: string;
  count: number;
  models: ModelManifestEntry[];
};

export async function fetchModelManifest(baseDir = "/models"): Promise<ModelManifest> {
  const url = `${baseDir.replace(/\/$/, "")}/manifest.json`;
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) {
    return { generatedAt: Date.now(), modelsDirectory: baseDir, count: 0, models: [] };
  }
  try {
    return (await res.json()) as ModelManifest;
  } catch {
    return { generatedAt: Date.now(), modelsDirectory: baseDir, count: 0, models: [] };
  }
}

export function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function fmtRelativeTime(ts: number): string {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
