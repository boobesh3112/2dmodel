import type { LoadedModelFiles, VirtualFile } from "./types";

// ---------- Folder / drop ingestion ----------

export function normalizePath(p: string): string {
  return p.replace(/^\/+/, "").replace(/\\/g, "/");
}

export async function filesFromInput(fileList: FileList): Promise<File[]> {
  return Array.from(fileList);
}

/** Traverse dropped items (folders included) using webkitGetAsEntry. */
export async function filesFromDataTransfer(dt: DataTransfer): Promise<File[]> {
  const items = Array.from(dt.items);
  const out: File[] = [];

  const readEntry = async (entry: any, prefix = ""): Promise<void> => {
    if (!entry) return;
    if (entry.isFile) {
      await new Promise<void>((resolve) => {
        entry.file((f: File) => {
          // Rebuild a File with the full relative path stored on webkitRelativePath-ish key.
          Object.defineProperty(f, "webkitRelativePath", {
            value: prefix + entry.name,
            configurable: true,
          });
          out.push(f);
          resolve();
        });
      });
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const entries: any[] = await new Promise((resolve) => {
        const all: any[] = [];
        const readBatch = () =>
          reader.readEntries((batch: any[]) => {
            if (batch.length === 0) resolve(all);
            else {
              all.push(...batch);
              readBatch();
            }
          });
        readBatch();
      });
      for (const child of entries) {
        await readEntry(child, prefix + entry.name + "/");
      }
    }
  };

  await Promise.all(items.map((it) => readEntry(it.webkitGetAsEntry?.())));
  // Fallback: if webkitGetAsEntry unsupported, just files
  if (out.length === 0) {
    for (const f of Array.from(dt.files)) out.push(f);
  }
  return out;
}

// ---------- Build the LoadedModelFiles from a File[] ----------

export function buildLoadedModel(files: File[]): LoadedModelFiles {
  if (files.length === 0) throw new Error("No files provided");

  const map = new Map<string, VirtualFile>();
  let totalBytes = 0;
  let rootName = "model";

  // Determine common root
  const rels = files.map(
    (f) => (f as any).webkitRelativePath || (f as any).relativePath || f.name,
  );
  const firstSeg = rels[0].split("/")[0];
  const commonRoot = rels.every((r) => r.split("/")[0] === firstSeg) ? firstSeg : "";
  if (commonRoot) rootName = commonRoot;

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    let rel = normalizePath(rels[i]);
    if (commonRoot && rel.startsWith(commonRoot + "/")) rel = rel.slice(commonRoot.length + 1);
    if (!rel) rel = f.name;
    const url = URL.createObjectURL(f);
    map.set(rel, { path: rel, name: f.name, size: f.size, file: f, url });
    totalBytes += f.size;
  }

  // Find the model settings file
  let settingsPath = "";
  let cubismVersion: 2 | 3 | 4 = 4;
  for (const key of map.keys()) {
    if (key.endsWith(".model3.json")) {
      settingsPath = key;
      cubismVersion = 4;
      break;
    }
  }
  if (!settingsPath) {
    for (const key of map.keys()) {
      if (key.endsWith(".model.json") || key.endsWith(".model.json")) {
        settingsPath = key;
        cubismVersion = 2;
        break;
      }
    }
  }
  if (!settingsPath) {
    throw new Error("No .model3.json or .model.json found in the folder");
  }

  return { rootName, settingsPath, files: map, cubismVersion, totalBytes };
}

// ---------- Resolve a model settings JSON with blob URLs ----------

export async function buildResolvedSettings(loaded: LoadedModelFiles): Promise<any> {
  const settingsFile = loaded.files.get(loaded.settingsPath)!;
  const text = await settingsFile.file.text();
  const json = JSON.parse(text);

  const settingsDir = loaded.settingsPath.includes("/")
    ? loaded.settingsPath.slice(0, loaded.settingsPath.lastIndexOf("/") + 1)
    : "";

  const resolveRef = (ref: string) => {
    if (!ref) return ref;
    const rel = normalizePath(settingsDir + ref);
    const hit = loaded.files.get(rel);
    if (hit) return hit.url;
    // Try without the settings dir
    const hit2 = loaded.files.get(normalizePath(ref));
    if (hit2) return hit2.url;
    // Try to fuzzy match by basename
    const base = ref.split("/").pop();
    for (const [k, v] of loaded.files) {
      if (k.endsWith("/" + base) || k === base) return v.url;
    }
    console.warn("[live2d] missing referenced file:", ref);
    return ref;
  };

  // Walk the FileReferences (Cubism 4)
  if (json.FileReferences) {
    const fr = json.FileReferences;
    if (fr.Moc) fr.Moc = resolveRef(fr.Moc);
    if (Array.isArray(fr.Textures)) fr.Textures = fr.Textures.map(resolveRef);
    if (fr.Physics) fr.Physics = resolveRef(fr.Physics);
    if (fr.Pose) fr.Pose = resolveRef(fr.Pose);
    if (fr.DisplayInfo) fr.DisplayInfo = resolveRef(fr.DisplayInfo);
    if (fr.UserData) fr.UserData = resolveRef(fr.UserData);
    if (fr.Expressions && Array.isArray(fr.Expressions)) {
      fr.Expressions = fr.Expressions.map((e: any) => ({
        ...e,
        File: resolveRef(e.File),
      }));
    }
    if (fr.Motions && typeof fr.Motions === "object") {
      const resolvedMotions: any = {};
      for (const group of Object.keys(fr.Motions)) {
        resolvedMotions[group] = fr.Motions[group].map((m: any) => ({
          ...m,
          File: resolveRef(m.File),
          Sound: m.Sound ? resolveRef(m.Sound) : m.Sound,
        }));
      }
      fr.Motions = resolvedMotions;
    }
  }

  // Cubism 2 shape
  if (json.model && typeof json.model === "string") json.model = resolveRef(json.model);
  if (json.physics && typeof json.physics === "string") json.physics = resolveRef(json.physics);
  if (json.pose && typeof json.pose === "string") json.pose = resolveRef(json.pose);
  if (Array.isArray(json.textures)) json.textures = json.textures.map(resolveRef);
  if (json.motions && typeof json.motions === "object") {
    const resolved: any = {};
    for (const group of Object.keys(json.motions)) {
      resolved[group] = json.motions[group].map((m: any) => ({
        ...m,
        file: resolveRef(m.file),
        sound: m.sound ? resolveRef(m.sound) : m.sound,
      }));
    }
    json.motions = resolved;
  }
  if (Array.isArray(json.expressions)) {
    json.expressions = json.expressions.map((e: any) => ({ ...e, file: resolveRef(e.file) }));
  }

  // The settings object itself needs a `url` for the ModelSettings constructor
  json.url = settingsFile.url;

  return json;
}

export function disposeLoaded(loaded: LoadedModelFiles | null) {
  if (!loaded) return;
  for (const v of loaded.files.values()) URL.revokeObjectURL(v.url);
}

export function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
