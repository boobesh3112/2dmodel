import { useEffect, useRef } from "react";
import {
  usePlayground,
  emptyInfo,
  type ActiveSource,
  type ExtraCharacter,
} from "@/context/PlaygroundContext";
import { buildResolvedSettings } from "@/lib/live2d/loader";
import { toast } from "sonner";

type StageRuntime = {
  app: any;
  model: any;
  cleanup: () => void;
  overlay?: any;
  extras: Map<string, any>;
};

export default function Live2DStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<StageRuntime | null>(null);
  const bootedRef = useRef(false);
  const {
    source,
    extras,
    updateExtra,
    state,
    setInfo,
    background,
    bgColor,
    bgImageUrl,
    bgImageFit,
    bgImageOpacity,
    debug,
    config,
  } = usePlayground();

  // Lazy-boot Pixi only when a model is requested (keeps GPU idle at rest)
  useEffect(() => {
    if ((!source && extras.length === 0) || bootedRef.current) return;
    let disposed = false;
    bootedRef.current = true;

    (async () => {
      const PIXI = await import("pixi.js");
      (window as any).PIXI = PIXI;
      await import("pixi-live2d-display");
      if (disposed || !hostRef.current) return;

      const app = new PIXI.Application({
        resizeTo: hostRef.current,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
      });
      hostRef.current.appendChild(app.view as HTMLCanvasElement);

      const { Live2DModel } = await import("pixi-live2d-display");
      Live2DModel.registerTicker(PIXI.Ticker);

      const overlay = new PIXI.Graphics();
      app.stage.addChild(overlay);

      let lastReport = performance.now();
      let frames = 0;
      app.ticker.add(() => {
        frames++;
        const now = performance.now();
        if (now - lastReport > 500) {
          const fps = (frames * 1000) / (now - lastReport);
          const ft = (now - lastReport) / frames;
          frames = 0;
          lastReport = now;
          setInfo((info) => ({
            ...info,
            fps: +fps.toFixed(1),
            frameTime: +ft.toFixed(2),
            canvasWidth: app.renderer.width,
            canvasHeight: app.renderer.height,
            memory: (performance as any).memory?.usedJSHeapSize / (1024 * 1024),
          }));
        }
      });

      runtimeRef.current = { app, model: null, cleanup: () => {}, overlay, extras: new Map() };
      (window as any).__l2dApp = app;
    })();

    return () => {
      disposed = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, extras.length]);

  // Full teardown on unmount only (component lifetime)
  useEffect(() => {
    return () => {
      const rt = runtimeRef.current;
      if (rt) {
        try {
          rt.cleanup?.();
          rt.model?.destroy?.({ children: true, texture: true, baseTexture: true });
          rt.app?.destroy?.(true, { children: true, texture: true, baseTexture: true });
        } catch (e) {
          console.warn(e);
        }
      }
      runtimeRef.current = null;
      bootedRef.current = false;
    };
  }, []);

  // Load / swap model on source change
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Wait for the app to boot if we just requested one
      for (let i = 0; i < 200 && !runtimeRef.current && source; i++) {
        await new Promise((r) => setTimeout(r, 20));
      }
      const rt = runtimeRef.current;
      if (!rt) {
        setInfo(emptyInfo);
        return;
      }

      // Unload previous model fully (memory, textures, physics)
      rt.cleanup?.();
      rt.cleanup = () => {};
      if (rt.model) {
        try {
          rt.app.stage.removeChild(rt.model);
          rt.model.destroy({ children: true, texture: true, baseTexture: true });
        } catch {}
        rt.model = null;
        (window as any).__l2dModel = null;
      }

      if (!source) {
        setInfo(emptyInfo);
        return;
      }

      try {
        const modelInput = await resolveSource(source);
        const { Live2DModel } = await import("pixi-live2d-display");
        const model: any = await Live2DModel.from(modelInput, { autoInteract: true });
        if (cancelled) {
          model.destroy({ children: true, texture: true, baseTexture: true });
          return;
        }
        model.anchor.set(0.5, 0.5);
        model.x = rt.app.renderer.width / 2;
        model.y = rt.app.renderer.height / 2;
        rt.app.stage.addChild(model);
        rt.model = model;
        (window as any).__l2dModel = model;

        wireDragging(model, rt.app);

        if (config.autoFit) {
          fitModel(model, rt.app);
        }

        const internal = model.internalModel;
        const settingsObj = internal.settings;
        const motions: Record<string, string[]> = {};
        const rawMotions =
          settingsObj?.motions || settingsObj?.json?.FileReferences?.Motions || {};
        for (const g of Object.keys(rawMotions)) {
          motions[g] = rawMotions[g].map(
            (m: any, i: number) =>
              m.Name ||
              m.name ||
              m.File?.split("/").pop() ||
              m.file?.split("/").pop() ||
              `${g}_${i}`,
          );
        }
        const expressions: string[] =
          (settingsObj?.expressions || settingsObj?.json?.FileReferences?.Expressions || []).map(
            (e: any) => e.Name || e.name,
          ) || [];
        const hitAreas: string[] =
          (settingsObj?.hitAreas || settingsObj?.json?.HitAreas || []).map(
            (h: any) => h.Name || h.name || h.Id,
          ) || [];

        const coreModel = internal.coreModel;
        const parameters: any[] = [];
        const parts: any[] = [];
        try {
          const paramCount = coreModel.getParameterCount?.() ?? 0;
          for (let i = 0; i < paramCount; i++) {
            parameters.push({
              id: coreModel.getParameterId(i),
              value: coreModel.getParameterValue(i),
              default: coreModel.getParameterDefaultValue?.(i) ?? 0,
              min: coreModel.getParameterMinimumValue(i),
              max: coreModel.getParameterMaximumValue(i),
            });
          }
          const partCount = coreModel.getPartCount?.() ?? 0;
          for (let i = 0; i < partCount; i++) {
            parts.push({
              id: coreModel.getPartId(i),
              opacity: coreModel.getPartOpacity?.(i) ?? 1,
            });
          }
        } catch (e) {
          console.warn("[live2d] parameter/part read failed", e);
        }

        const textures =
          settingsObj?.textures || settingsObj?.json?.FileReferences?.Textures || [];
        const firstTex = model.textures?.[0]?.baseTexture;
        const texRes = firstTex ? `${firstTex.realWidth}×${firstTex.realHeight}` : "-";

        setInfo({
          fps: 0,
          frameTime: 0,
          canvasWidth: rt.app.renderer.width,
          canvasHeight: rt.app.renderer.height,
          textureCount: textures.length,
          textureRes: texRes,
          drawableCount: coreModel?.getDrawableCount?.() ?? 0,
          meshCount: coreModel?.getDrawableCount?.() ?? 0,
          parameterCount: parameters.length,
          partCount: parts.length,
          hitAreas,
          motions,
          expressions,
          parameters,
          parts,
          warnings: [],
          errors: [],
          loadedOk: true,
        });

        const paramInterval = window.setInterval(() => {
          if (cancelled || !runtimeRef.current || runtimeRef.current.model !== model) return;
          try {
            const cm = model.internalModel.coreModel;
            const paramCount = cm.getParameterCount?.() ?? 0;
            const arr: any[] = [];
            for (let i = 0; i < paramCount; i++) {
              arr.push({
                id: cm.getParameterId(i),
                value: cm.getParameterValue(i),
                default: cm.getParameterDefaultValue?.(i) ?? 0,
                min: cm.getParameterMinimumValue(i),
                max: cm.getParameterMaximumValue(i),
              });
            }
            setInfo((info) => ({ ...info, parameters: arr }));
          } catch {}
        }, 300);
        rt.cleanup = () => window.clearInterval(paramInterval);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to build model", { description: err?.message ?? String(err) });
        setInfo((info) => ({
          ...info,
          loadedOk: false,
          errors: [...info.errors, String(err?.message ?? err)],
        }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, setInfo, config.autoFit]);

  // Apply state -> model
  useEffect(() => {
    const rt = runtimeRef.current;
    if (!rt?.model) return;
    const m = rt.model;
    m.scale.set(state.scale);
    m.rotation = (state.rotation * Math.PI) / 180;
    m.alpha = state.opacity;
    m.x = rt.app.renderer.width / 2 + state.x;
    m.y = rt.app.renderer.height / 2 + state.y;
    m.interactive = state.dragEnabled;
    if (m.internalModel?.motionManager) {
      m.internalModel.motionManager.speed = state.animationSpeed;
    }
  }, [state]);

  // Sync extra characters -> pixi stage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Ensure app is booted (only meaningful when a primary source triggered boot,
      // but we also boot here if the user adds an extra with no primary).
      if (!runtimeRef.current && extras.length > 0) {
        // borrow the boot path by pretending a source is required
        // Actually the primary boot only runs when `source` is set. We only load
        // extras when the stage is already alive.
      }
      for (let i = 0; i < 100 && extras.length > 0 && !runtimeRef.current; i++) {
        await new Promise((r) => setTimeout(r, 20));
      }
      const rt = runtimeRef.current;
      if (!rt) return;

      // Remove characters no longer present
      const wanted = new Set(extras.map((e) => e.instanceId));
      for (const [id, m] of rt.extras.entries()) {
        if (!wanted.has(id)) {
          try {
            rt.app.stage.removeChild(m);
            m.destroy({ children: true, texture: true, baseTexture: true });
          } catch {}
          rt.extras.delete(id);
        }
      }

      // Add newly present characters
      const { Live2DModel } = await import("pixi-live2d-display");
      for (const ex of extras) {
        if (rt.extras.has(ex.instanceId)) continue;
        try {
          const model: any = await Live2DModel.from(ex.entry.settingsUrl, { autoInteract: false });
          if (cancelled) {
            model.destroy({ children: true, texture: true, baseTexture: true });
            continue;
          }
          model.anchor.set(0.5, 0.5);
          model.scale.set(ex.scale);
          model.x = rt.app.renderer.width / 2 + ex.x;
          model.y = rt.app.renderer.height / 2 + ex.y;
          rt.app.stage.addChild(model);
          rt.extras.set(ex.instanceId, model);
          wireExtraDragging(model, rt.app, ex.instanceId, (patch) =>
            updateExtra(ex.instanceId, patch),
          );
        } catch (err: any) {
          console.warn("[live2d] extra failed", err);
          toast.error(`Failed to load ${ex.entry.modelName}`, {
            description: err?.message ?? String(err),
          });
        }
      }

      // Apply transforms to existing extras
      for (const ex of extras) {
        const m = rt.extras.get(ex.instanceId);
        if (!m) continue;
        m.scale.set(ex.scale);
        m.x = rt.app.renderer.width / 2 + ex.x;
        m.y = rt.app.renderer.height / 2 + ex.y;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [extras, updateExtra]);

  // Debug overlay
  useEffect(() => {
    const draw = () => {
      const rt = runtimeRef.current;
      if (!rt) return;
      const overlay = rt.overlay;
      const model = rt.model;
      const app = rt.app;
      if (!overlay || !app) return;
      overlay.clear();
      if (debug.showSafeArea) {
        overlay.lineStyle(1, 0x8a5cf5, 0.4);
        overlay.drawRect(40, 40, app.renderer.width - 80, app.renderer.height - 80);
      }
      if (debug.showBounds && model) {
        const b = model.getBounds();
        overlay.lineStyle(1, 0x22d3ee, 0.7);
        overlay.drawRect(b.x, b.y, b.width, b.height);
      }
      if (debug.showOrigin && model) {
        overlay.lineStyle(1, 0xff5f7e, 0.9);
        overlay.moveTo(model.x - 12, model.y);
        overlay.lineTo(model.x + 12, model.y);
        overlay.moveTo(model.x, model.y - 12);
        overlay.lineTo(model.x, model.y + 12);
      }
    };
    const id = window.setInterval(draw, 100);
    return () => window.clearInterval(id);
  }, [debug]);

  // Wheel zoom
  const { setState } = usePlayground();
  useEffect(() => {
    if (!config.wheelZoom) return;
    const el = hostRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.0008;
      setState((s) => ({
        ...s,
        scale: Math.max(0.02, Math.min(5, +(s.scale + delta).toFixed(3))),
      }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [setState, config.wheelZoom]);

  const bgStyle: React.CSSProperties = (() => {
    switch (background) {
      case "solid":
        return { background: bgColor };
      case "transparent":
        return { background: "transparent" };
      case "gradient":
        return {
          background: `radial-gradient(circle at 30% 20%, ${bgColor}, transparent 60%), linear-gradient(135deg, oklch(0.18 0.05 300), oklch(0.22 0.05 200))`,
        };
      case "image":
        return { background: "#0a0d14" };
      case "checker":
        return {};
      case "grid":
      default:
        return {};
    }
  })();

  const bgClass =
    background === "checker" ? "checker-bg" : background === "grid" ? "grid-bg" : "";

  const imageObjectFit: React.CSSProperties["objectFit"] =
    bgImageFit === "fill" ? "fill" : bgImageFit === "contain" ? "contain" : bgImageFit === "center" ? "none" : "cover";

  return (
    <div ref={hostRef} className={`absolute inset-0 ${bgClass}`} style={bgStyle}>
      {background === "image" && bgImageUrl && (
        <img
          src={bgImageUrl}
          alt=""
          draggable={false}
          crossOrigin="anonymous"
          onError={() => {
            /* silently ignore — user may paste an invalid URL */
          }}
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          style={{ objectFit: imageObjectFit, opacity: bgImageOpacity }}
        />
      )}
    </div>
  );
}

async function resolveSource(source: NonNullable<ActiveSource>): Promise<any> {
  if (source.kind === "files") {
    return await buildResolvedSettings(source.loaded);
  }
  // URL-based: pixi-live2d-display fetches the JSON + relative assets.
  return source.entry.settingsUrl;
}

function fitModel(model: any, app: any) {
  try {
    const bounds = model.getBounds();
    if (!bounds.width || !bounds.height) return;
    const pad = 40;
    const sx = (app.renderer.width - pad * 2) / (bounds.width / model.scale.x);
    const sy = (app.renderer.height - pad * 2) / (bounds.height / model.scale.y);
    const s = Math.min(sx, sy);
    if (isFinite(s) && s > 0) model.scale.set(s);
  } catch {}
}

function wireDragging(model: any, app: any) {
  let dragging = false;
  const offset = { x: 0, y: 0 };
  model.interactive = true;
  model.buttonMode = true;
  model.on("pointerdown", (e: any) => {
    dragging = true;
    offset.x = e.data.global.x - model.x;
    offset.y = e.data.global.y - model.y;
  });
  const stop = () => (dragging = false);
  app.stage.interactive = true;
  app.stage.hitArea = app.screen;
  app.stage.on("pointerup", stop);
  app.stage.on("pointerupoutside", stop);
  app.stage.on("pointermove", (e: any) => {
    if (!dragging) return;
    model.x = e.data.global.x - offset.x;
    model.y = e.data.global.y - offset.y;
  });
}

function wireExtraDragging(
  model: any,
  app: any,
  _id: string,
  onChange: (patch: { x?: number; y?: number }) => void,
) {
  let dragging = false;
  const offset = { x: 0, y: 0 };
  model.interactive = true;
  model.buttonMode = true;
  model.on("pointerdown", (e: any) => {
    dragging = true;
    offset.x = e.data.global.x - model.x;
    offset.y = e.data.global.y - model.y;
  });
  const stop = () => {
    if (!dragging) return;
    dragging = false;
    onChange({
      x: model.x - app.renderer.width / 2,
      y: model.y - app.renderer.height / 2,
    });
  };
  app.stage.on("pointerup", stop);
  app.stage.on("pointerupoutside", stop);
  app.stage.on("pointermove", (e: any) => {
    if (!dragging) return;
    model.x = e.data.global.x - offset.x;
    model.y = e.data.global.y - offset.y;
  });
}
