import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Scans `public/models/**` for Live2D model settings files (`*.model3.json`
 * for Cubism 3/4, `*.model.json` for Cubism 2) and writes
 * `public/models/manifest.json` with metadata. Runs on dev-server start,
 * on filesystem changes inside `public/models/`, and on production build.
 *
 * The generated manifest is a plain static asset — it works on any static
 * host (GitHub Pages, Vercel, Netlify) without server-side code.
 */
export function modelsManifestPlugin(): Plugin {
  const MODELS_DIR = path.resolve(process.cwd(), "public/models");
  const OUT_FILE = path.join(MODELS_DIR, "manifest.json");

  const walk = (dir: string, acc: string[] = []): string[] => {
    if (!fs.existsSync(dir)) return acc;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, acc);
      else acc.push(full);
    }
    return acc;
  };

  const posix = (p: string) => p.split(path.sep).join("/");

  const build = () => {
    if (!fs.existsSync(MODELS_DIR)) {
      fs.mkdirSync(MODELS_DIR, { recursive: true });
    }

    const rootFolders = fs
      .readdirSync(MODELS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort((a, b) => a.localeCompare(b));

    type ManifestModel = {
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

    const models: ManifestModel[] = [];

    for (const folder of rootFolders) {
      const folderPath = path.join(MODELS_DIR, folder);
      const all = walk(folderPath);
      if (all.length === 0) continue;

      let settings = all.find((f) => f.toLowerCase().endsWith(".model3.json"));
      let cubismVersion: 2 | 3 | 4 = 4;
      if (!settings) {
        settings = all.find((f) => f.toLowerCase().endsWith(".model.json"));
        cubismVersion = 2;
      }
      if (!settings) continue;

      const settingsRelToPublic = posix(
        path.relative(path.resolve(process.cwd(), "public"), settings),
      );
      const settingsUrl = "/" + settingsRelToPublic;

      const warnings: string[] = [];
      let status: ManifestModel["status"] = "ok";
      let motionCount = 0;
      let expressionCount = 0;
      let textureCount = 0;
      let hasPhysics = false;
      let hasPose = false;
      let modelName = folder;

      try {
        const raw = fs.readFileSync(settings, "utf-8");
        const json = JSON.parse(raw);
        const settingsDir = path.dirname(settings);
        const check = (rel: string) => fs.existsSync(path.join(settingsDir, rel));

        if (cubismVersion === 2) {
          if (Array.isArray(json.textures)) {
            textureCount = json.textures.length;
            for (const t of json.textures) if (!check(t)) warnings.push(`Missing texture: ${t}`);
          }
          if (json.physics && typeof json.physics === "string") {
            hasPhysics = true;
            if (!check(json.physics)) warnings.push(`Missing physics: ${json.physics}`);
          }
          if (json.pose && typeof json.pose === "string") {
            hasPose = true;
            if (!check(json.pose)) warnings.push(`Missing pose: ${json.pose}`);
          }
          if (json.motions && typeof json.motions === "object") {
            for (const g of Object.keys(json.motions)) {
              const arr = json.motions[g];
              if (Array.isArray(arr)) motionCount += arr.length;
            }
          }
          if (Array.isArray(json.expressions)) expressionCount = json.expressions.length;
          if (json.name) modelName = json.name;
        } else {
          const fr = json.FileReferences || {};
          if (fr.Moc && !check(fr.Moc)) warnings.push(`Missing moc: ${fr.Moc}`);
          if (Array.isArray(fr.Textures)) {
            textureCount = fr.Textures.length;
            for (const t of fr.Textures) if (!check(t)) warnings.push(`Missing texture: ${t}`);
          }
          if (fr.Physics) {
            hasPhysics = true;
            if (!check(fr.Physics)) warnings.push(`Missing physics: ${fr.Physics}`);
          }
          if (fr.Pose) {
            hasPose = true;
            if (!check(fr.Pose)) warnings.push(`Missing pose: ${fr.Pose}`);
          }
          if (fr.Expressions && Array.isArray(fr.Expressions)) {
            expressionCount = fr.Expressions.length;
            for (const e of fr.Expressions) if (e.File && !check(e.File)) warnings.push(`Missing expression: ${e.File}`);
          }
          if (fr.Motions && typeof fr.Motions === "object") {
            for (const g of Object.keys(fr.Motions)) {
              const arr = fr.Motions[g];
              if (Array.isArray(arr)) motionCount += arr.length;
            }
          }
          if (json.Name) modelName = json.Name;
          else if (fr.DisplayInfo) modelName = String(fr.DisplayInfo).replace(/\.[^.]+$/, "");
        }
      } catch (err: any) {
        status = "broken";
        warnings.push(`Failed to parse settings: ${err?.message ?? err}`);
      }

      if (warnings.length > 0 && status === "ok") status = "missing_files";

      let totalBytes = 0;
      let latest = 0;
      for (const f of all) {
        try {
          const st = fs.statSync(f);
          totalBytes += st.size;
          if (st.mtimeMs > latest) latest = st.mtimeMs;
        } catch {}
      }

      // thumbnail: any file named thumbnail/preview/icon, else first texture
      let thumbnail: string | null = null;
      const explicit = all.find((f) =>
        /(thumbnail|thumb|preview|icon|cover)\.(png|jpe?g|webp|gif)$/i.test(f),
      );
      if (explicit) {
        thumbnail = "/" + posix(path.relative(path.resolve(process.cwd(), "public"), explicit));
      } else {
        const tex = all.find((f) => /\.(png|jpe?g|webp)$/i.test(f));
        if (tex)
          thumbnail = "/" + posix(path.relative(path.resolve(process.cwd(), "public"), tex));
      }

      models.push({
        id: folder,
        folderName: folder,
        modelName,
        cubismVersion,
        settingsUrl,
        motionCount,
        expressionCount,
        textureCount,
        hasPhysics,
        hasPose,
        totalBytes,
        fileCount: all.length,
        lastModified: Math.round(latest),
        thumbnail,
        status,
        warnings,
      });
    }

    const manifest = {
      generatedAt: Date.now(),
      modelsDirectory: "/models",
      count: models.length,
      models,
    };

    fs.writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2));
  };

  let building = false;
  const rebuild = () => {
    if (building) return;
    building = true;
    queueMicrotask(() => {
      try {
        build();
      } catch (e) {
        console.error("[models-manifest] rebuild failed:", e);
      } finally {
        building = false;
      }
    });
  };

  return {
    name: "live2d-models-manifest",
    buildStart() {
      build();
    },
    configureServer(server) {
      build();
      server.watcher.add(MODELS_DIR);
      const shouldTrigger = (file: string) => {
        const p = file.replace(/\\/g, "/");
        return p.includes("/public/models/") && !p.endsWith("manifest.json");
      };
      server.watcher.on("add", (f) => shouldTrigger(f) && rebuild());
      server.watcher.on("unlink", (f) => shouldTrigger(f) && rebuild());
      server.watcher.on("addDir", (f) => shouldTrigger(f) && rebuild());
      server.watcher.on("unlinkDir", (f) => shouldTrigger(f) && rebuild());
      server.watcher.on("change", (f) => shouldTrigger(f) && rebuild());
    },
  };
}
