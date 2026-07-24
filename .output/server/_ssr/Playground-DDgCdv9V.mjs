import { r as __toESM } from "../_runtime.mjs";
import { Rn as performance_default } from "../_libs/@pixi/accessibility+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { A as Copy, C as History, D as FolderOpen, E as FolderPlus, F as ArrowUpDown, I as Activity, M as CircleCheck, N as ChevronRight, O as Download, P as Check, S as ImageOff, T as Grid2x2, _ as PackageOpen, a as Star, b as List, c as Shuffle, d as RefreshCw, f as Play, g as PanelLeftClose, h as PanelLeftOpen, i as Trash2, j as Circle, k as Crosshair, l as Search, m as PanelRightClose, n as Upload, o as Square, p as PanelRightOpen, r as TriangleAlert, s as Sparkles, t as X, u as RotateCcw, v as Move, w as Heart, x as Library, y as Maximize } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { t as Root$1 } from "../_libs/radix-ui__react-label.mjs";
import { i as Trigger$1, n as List$1, r as Root2$1, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Playground-DDgCdv9V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var defaultConfig = {
	modelsDirectory: "/models",
	autoScan: true,
	theme: "dark",
	defaultBackground: "grid",
	showFPS: true,
	autoFit: true,
	defaultScale: .25,
	wheelZoom: true,
	dragEnabled: true,
	sidebar: {
		defaultView: "grid",
		defaultSort: "name"
	}
};
var cached = null;
async function loadAppConfig() {
	if (cached) return cached;
	try {
		const res = await fetch("/config.json", { cache: "no-cache" });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const json = await res.json();
		cached = {
			...defaultConfig,
			...json,
			sidebar: {
				...defaultConfig.sidebar,
				...json.sidebar || {}
			}
		};
	} catch (err) {
		console.warn("[config] using defaults:", err);
		cached = defaultConfig;
	}
	return cached ?? defaultConfig;
}
var defaultModelState = {
	scale: .25,
	x: 0,
	y: 0,
	rotation: 0,
	opacity: 1,
	animationSpeed: 1,
	dragEnabled: true
};
var emptyInfo = {
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
	loadedOk: false
};
var PlaygroundCtx = (0, import_react.createContext)(null);
var LS_RECENT = "l2d.recent";
var LS_FAVORITES = "l2d.favorites";
function readLS$1(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		if (raw !== null) return JSON.parse(raw);
	} catch {}
	return fallback;
}
function PlaygroundProvider({ children }) {
	const [config, setConfig] = (0, import_react.useState)(defaultConfig);
	const [source, setSource] = (0, import_react.useState)(null);
	const [recent, setRecent] = (0, import_react.useState)([]);
	const [favorites, setFavorites] = (0, import_react.useState)([]);
	const [state, setState] = (0, import_react.useState)(defaultModelState);
	const [background, setBackground] = (0, import_react.useState)("grid");
	const [bgColor, setBgColor] = (0, import_react.useState)("#141a2a");
	const [debug, setDebug] = (0, import_react.useState)({
		showHitAreas: false,
		showBounds: false,
		showOrigin: false,
		showSafeArea: false
	});
	const [info, setInfo] = (0, import_react.useState)(emptyInfo);
	(0, import_react.useEffect)(() => {
		setRecent(readLS$1(LS_RECENT, []));
		setFavorites(readLS$1(LS_FAVORITES, []));
		loadAppConfig().then((c) => {
			setConfig(c);
			setBackground(c.defaultBackground);
			setState((s) => ({
				...s,
				scale: c.defaultScale,
				dragEnabled: c.dragEnabled
			}));
		});
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			window.localStorage.setItem(LS_RECENT, JSON.stringify(recent));
		} catch {}
	}, [recent]);
	(0, import_react.useEffect)(() => {
		try {
			window.localStorage.setItem(LS_FAVORITES, JSON.stringify(favorites));
		} catch {}
	}, [favorites]);
	const disposeCurrent = (s) => {
		if (s?.kind === "files") for (const v of s.loaded.files.values()) URL.revokeObjectURL(v.url);
	};
	const value = (0, import_react.useMemo)(() => {
		const pushRecent = (id) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 12));
		return {
			config,
			source,
			loadFromFiles: (loaded) => {
				setSource((prev) => {
					disposeCurrent(prev);
					return {
						kind: "files",
						loaded
					};
				});
				pushRecent(loaded.rootName);
			},
			loadFromEntry: (entry) => {
				setSource((prev) => {
					disposeCurrent(prev);
					return {
						kind: "url",
						entry
					};
				});
				pushRecent(entry.id);
			},
			unload: () => setSource((prev) => (disposeCurrent(prev), null)),
			activeName: source?.kind === "files" ? source.loaded.rootName : source?.kind === "url" ? source.entry.modelName : "",
			activeCubism: source?.kind === "files" ? source.loaded.cubismVersion : source?.kind === "url" ? source.entry.cubismVersion : null,
			recent,
			pushRecent,
			favorites,
			toggleFavorite: (id) => setFavorites((f) => f.includes(id) ? f.filter((x) => x !== id) : [id, ...f]),
			state,
			setState,
			background,
			setBackground,
			bgColor,
			setBgColor,
			debug,
			setDebug,
			info,
			setInfo
		};
	}, [
		config,
		source,
		recent,
		favorites,
		state,
		background,
		bgColor,
		debug,
		info
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaygroundCtx.Provider, {
		value,
		children
	});
}
function usePlayground() {
	const c = (0, import_react.useContext)(PlaygroundCtx);
	if (!c) throw new Error("usePlayground must be used inside PlaygroundProvider");
	return c;
}
async function fetchModelManifest(baseDir = "/models") {
	const url = `${baseDir.replace(/\/$/, "")}/manifest.json`;
	const res = await fetch(url, { cache: "no-cache" });
	if (!res.ok) return {
		generatedAt: Date.now(),
		modelsDirectory: baseDir,
		count: 0,
		models: []
	};
	try {
		return await res.json();
	} catch {
		return {
			generatedAt: Date.now(),
			modelsDirectory: baseDir,
			count: 0,
			models: []
		};
	}
}
function fmtBytes$1(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
	return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
function fmtRelativeTime(ts) {
	if (!ts) return "—";
	const diff = Date.now() - ts;
	const s = Math.round(diff / 1e3);
	if (s < 60) return `${s}s ago`;
	const m = Math.round(s / 60);
	if (m < 60) return `${m}m ago`;
	const h = Math.round(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.round(h / 24);
	if (d < 30) return `${d}d ago`;
	return new Date(ts).toLocaleDateString();
}
var LibraryCtx = (0, import_react.createContext)(null);
var LS_HIDDEN = "l2d.library.hidden";
function readLS(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		if (raw !== null) return JSON.parse(raw);
	} catch {}
	return fallback;
}
function ModelLibraryProvider({ children }) {
	const { config } = usePlayground();
	const [manifest, setManifest] = (0, import_react.useState)({
		generatedAt: 0,
		modelsDirectory: config.modelsDirectory,
		count: 0,
		models: []
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [hidden, setHidden] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setHidden(readLS(LS_HIDDEN, []));
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			window.localStorage.setItem(LS_HIDDEN, JSON.stringify(hidden));
		} catch {}
	}, [hidden]);
	const refresh = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const m = await fetchModelManifest(config.modelsDirectory);
			setManifest(m);
		} catch (e) {
			setError(String(e?.message ?? e));
		} finally {
			setLoading(false);
		}
	}, [config.modelsDirectory]);
	(0, import_react.useEffect)(() => {
		if (config.autoScan) refresh();
	}, [config.autoScan, refresh]);
	const value = (0, import_react.useMemo)(() => ({
		manifest,
		loading,
		error,
		refresh,
		hidden,
		hide: (id) => setHidden((h) => h.includes(id) ? h : [...h, id]),
		unhideAll: () => setHidden([]),
		visibleModels: manifest.models.filter((m) => !hidden.includes(m.id)),
		byId: (id) => manifest.models.find((m) => m.id === id)
	}), [
		manifest,
		loading,
		error,
		refresh,
		hidden
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryCtx.Provider, {
		value,
		children
	});
}
function useModelLibrary() {
	const c = (0, import_react.useContext)(LibraryCtx);
	if (!c) throw new Error("useModelLibrary must be used inside ModelLibraryProvider");
	return c;
}
function normalizePath(p) {
	return p.replace(/^\/+/, "").replace(/\\/g, "/");
}
async function filesFromInput(fileList) {
	return Array.from(fileList);
}
/** Traverse dropped items (folders included) using webkitGetAsEntry. */
async function filesFromDataTransfer(dt) {
	const items = Array.from(dt.items);
	const out = [];
	const readEntry = async (entry, prefix = "") => {
		if (!entry) return;
		if (entry.isFile) await new Promise((resolve) => {
			entry.file((f) => {
				Object.defineProperty(f, "webkitRelativePath", {
					value: prefix + entry.name,
					configurable: true
				});
				out.push(f);
				resolve();
			});
		});
		else if (entry.isDirectory) {
			const reader = entry.createReader();
			const entries = await new Promise((resolve) => {
				const all = [];
				const readBatch = () => reader.readEntries((batch) => {
					if (batch.length === 0) resolve(all);
					else {
						all.push(...batch);
						readBatch();
					}
				});
				readBatch();
			});
			for (const child of entries) await readEntry(child, prefix + entry.name + "/");
		}
	};
	await Promise.all(items.map((it) => readEntry(it.webkitGetAsEntry?.())));
	if (out.length === 0) for (const f of Array.from(dt.files)) out.push(f);
	return out;
}
function buildLoadedModel(files) {
	if (files.length === 0) throw new Error("No files provided");
	const map = /* @__PURE__ */ new Map();
	let totalBytes = 0;
	let rootName = "model";
	const rels = files.map((f) => f.webkitRelativePath || f.relativePath || f.name);
	const firstSeg = rels[0].split("/")[0];
	const commonRoot = rels.every((r) => r.split("/")[0] === firstSeg) ? firstSeg : "";
	if (commonRoot) rootName = commonRoot;
	for (let i = 0; i < files.length; i++) {
		const f = files[i];
		let rel = normalizePath(rels[i]);
		if (commonRoot && rel.startsWith(commonRoot + "/")) rel = rel.slice(commonRoot.length + 1);
		if (!rel) rel = f.name;
		const url = URL.createObjectURL(f);
		map.set(rel, {
			path: rel,
			name: f.name,
			size: f.size,
			file: f,
			url
		});
		totalBytes += f.size;
	}
	let settingsPath = "";
	let cubismVersion = 4;
	for (const key of map.keys()) if (key.endsWith(".model3.json")) {
		settingsPath = key;
		cubismVersion = 4;
		break;
	}
	if (!settingsPath) {
		for (const key of map.keys()) if (key.endsWith(".model.json") || key.endsWith(".model.json")) {
			settingsPath = key;
			cubismVersion = 2;
			break;
		}
	}
	if (!settingsPath) throw new Error("No .model3.json or .model.json found in the folder");
	return {
		rootName,
		settingsPath,
		files: map,
		cubismVersion,
		totalBytes
	};
}
async function buildResolvedSettings(loaded) {
	const settingsFile = loaded.files.get(loaded.settingsPath);
	const text = await settingsFile.file.text();
	const json = JSON.parse(text);
	const settingsDir = loaded.settingsPath.includes("/") ? loaded.settingsPath.slice(0, loaded.settingsPath.lastIndexOf("/") + 1) : "";
	const resolveRef = (ref) => {
		if (!ref) return ref;
		const rel = normalizePath(settingsDir + ref);
		const hit = loaded.files.get(rel);
		if (hit) return hit.url;
		const hit2 = loaded.files.get(normalizePath(ref));
		if (hit2) return hit2.url;
		const base = ref.split("/").pop();
		for (const [k, v] of loaded.files) if (k.endsWith("/" + base) || k === base) return v.url;
		console.warn("[live2d] missing referenced file:", ref);
		return ref;
	};
	if (json.FileReferences) {
		const fr = json.FileReferences;
		if (fr.Moc) fr.Moc = resolveRef(fr.Moc);
		if (Array.isArray(fr.Textures)) fr.Textures = fr.Textures.map(resolveRef);
		if (fr.Physics) fr.Physics = resolveRef(fr.Physics);
		if (fr.Pose) fr.Pose = resolveRef(fr.Pose);
		if (fr.DisplayInfo) fr.DisplayInfo = resolveRef(fr.DisplayInfo);
		if (fr.UserData) fr.UserData = resolveRef(fr.UserData);
		if (fr.Expressions && Array.isArray(fr.Expressions)) fr.Expressions = fr.Expressions.map((e) => ({
			...e,
			File: resolveRef(e.File)
		}));
		if (fr.Motions && typeof fr.Motions === "object") {
			const resolvedMotions = {};
			for (const group of Object.keys(fr.Motions)) resolvedMotions[group] = fr.Motions[group].map((m) => ({
				...m,
				File: resolveRef(m.File),
				Sound: m.Sound ? resolveRef(m.Sound) : m.Sound
			}));
			fr.Motions = resolvedMotions;
		}
	}
	if (json.model && typeof json.model === "string") json.model = resolveRef(json.model);
	if (json.physics && typeof json.physics === "string") json.physics = resolveRef(json.physics);
	if (json.pose && typeof json.pose === "string") json.pose = resolveRef(json.pose);
	if (Array.isArray(json.textures)) json.textures = json.textures.map(resolveRef);
	if (json.motions && typeof json.motions === "object") {
		const resolved = {};
		for (const group of Object.keys(json.motions)) resolved[group] = json.motions[group].map((m) => ({
			...m,
			file: resolveRef(m.file),
			sound: m.sound ? resolveRef(m.sound) : m.sound
		}));
		json.motions = resolved;
	}
	if (Array.isArray(json.expressions)) json.expressions = json.expressions.map((e) => ({
		...e,
		file: resolveRef(e.file)
	}));
	json.url = settingsFile.url;
	return json;
}
function fmtBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
	if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
	return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
function Live2DStage() {
	const hostRef = (0, import_react.useRef)(null);
	const runtimeRef = (0, import_react.useRef)(null);
	const bootedRef = (0, import_react.useRef)(false);
	const { source, state, setInfo, background, bgColor, debug, config } = usePlayground();
	(0, import_react.useEffect)(() => {
		if (!source || bootedRef.current) return;
		let disposed = false;
		bootedRef.current = true;
		(async () => {
			const PIXI = await import("../_libs/pixi.js.mjs").then((n) => n.t);
			window.PIXI = PIXI;
			await import("../_libs/pixi-live2d-display.mjs").then((n) => n.t);
			if (disposed || !hostRef.current) return;
			const app = new PIXI.Application({
				resizeTo: hostRef.current,
				backgroundAlpha: 0,
				antialias: true,
				autoDensity: true,
				resolution: window.devicePixelRatio || 1
			});
			hostRef.current.appendChild(app.view);
			const { Live2DModel } = await import("../_libs/pixi-live2d-display.mjs").then((n) => n.t);
			Live2DModel.registerTicker(PIXI.Ticker);
			const overlay = new PIXI.Graphics();
			app.stage.addChild(overlay);
			let lastReport = performance_default.now();
			let frames = 0;
			app.ticker.add(() => {
				frames++;
				const now = performance_default.now();
				if (now - lastReport > 500) {
					const fps = frames * 1e3 / (now - lastReport);
					const ft = (now - lastReport) / frames;
					frames = 0;
					lastReport = now;
					setInfo((info) => ({
						...info,
						fps: +fps.toFixed(1),
						frameTime: +ft.toFixed(2),
						canvasWidth: app.renderer.width,
						canvasHeight: app.renderer.height,
						memory: performance_default.memory?.usedJSHeapSize / (1024 * 1024)
					}));
				}
			});
			runtimeRef.current = {
				app,
				model: null,
				cleanup: () => {},
				overlay
			};
			window.__l2dApp = app;
		})();
		return () => {
			disposed = true;
		};
	}, [source]);
	(0, import_react.useEffect)(() => {
		return () => {
			const rt = runtimeRef.current;
			if (rt) try {
				rt.cleanup?.();
				rt.model?.destroy?.({
					children: true,
					texture: true,
					baseTexture: true
				});
				rt.app?.destroy?.(true, {
					children: true,
					texture: true,
					baseTexture: true
				});
			} catch (e) {
				console.warn(e);
			}
			runtimeRef.current = null;
			bootedRef.current = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			for (let i = 0; i < 200 && !runtimeRef.current && source; i++) await new Promise((r) => setTimeout(r, 20));
			const rt = runtimeRef.current;
			if (!rt) {
				setInfo(emptyInfo);
				return;
			}
			rt.cleanup?.();
			rt.cleanup = () => {};
			if (rt.model) {
				try {
					rt.app.stage.removeChild(rt.model);
					rt.model.destroy({
						children: true,
						texture: true,
						baseTexture: true
					});
				} catch {}
				rt.model = null;
				window.__l2dModel = null;
			}
			if (!source) {
				setInfo(emptyInfo);
				return;
			}
			try {
				const modelInput = await resolveSource(source);
				const { Live2DModel } = await import("../_libs/pixi-live2d-display.mjs").then((n) => n.t);
				const model = await Live2DModel.from(modelInput, { autoInteract: true });
				if (cancelled) {
					model.destroy({
						children: true,
						texture: true,
						baseTexture: true
					});
					return;
				}
				model.anchor.set(.5, .5);
				model.x = rt.app.renderer.width / 2;
				model.y = rt.app.renderer.height / 2;
				rt.app.stage.addChild(model);
				rt.model = model;
				window.__l2dModel = model;
				wireDragging(model, rt.app);
				if (config.autoFit) fitModel(model, rt.app);
				const internal = model.internalModel;
				const settingsObj = internal.settings;
				const motions = {};
				const rawMotions = settingsObj?.motions || settingsObj?.json?.FileReferences?.Motions || {};
				for (const g of Object.keys(rawMotions)) motions[g] = rawMotions[g].map((m, i) => m.Name || m.name || m.File?.split("/").pop() || m.file?.split("/").pop() || `${g}_${i}`);
				const expressions = (settingsObj?.expressions || settingsObj?.json?.FileReferences?.Expressions || []).map((e) => e.Name || e.name) || [];
				const hitAreas = (settingsObj?.hitAreas || settingsObj?.json?.HitAreas || []).map((h) => h.Name || h.name || h.Id) || [];
				const coreModel = internal.coreModel;
				const parameters = [];
				const parts = [];
				try {
					const paramCount = coreModel.getParameterCount?.() ?? 0;
					for (let i = 0; i < paramCount; i++) parameters.push({
						id: coreModel.getParameterId(i),
						value: coreModel.getParameterValue(i),
						default: coreModel.getParameterDefaultValue?.(i) ?? 0,
						min: coreModel.getParameterMinimumValue(i),
						max: coreModel.getParameterMaximumValue(i)
					});
					const partCount = coreModel.getPartCount?.() ?? 0;
					for (let i = 0; i < partCount; i++) parts.push({
						id: coreModel.getPartId(i),
						opacity: coreModel.getPartOpacity?.(i) ?? 1
					});
				} catch (e) {
					console.warn("[live2d] parameter/part read failed", e);
				}
				const textures = settingsObj?.textures || settingsObj?.json?.FileReferences?.Textures || [];
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
					loadedOk: true
				});
				const paramInterval = window.setInterval(() => {
					if (cancelled || !runtimeRef.current || runtimeRef.current.model !== model) return;
					try {
						const cm = model.internalModel.coreModel;
						const paramCount = cm.getParameterCount?.() ?? 0;
						const arr = [];
						for (let i = 0; i < paramCount; i++) arr.push({
							id: cm.getParameterId(i),
							value: cm.getParameterValue(i),
							default: cm.getParameterDefaultValue?.(i) ?? 0,
							min: cm.getParameterMinimumValue(i),
							max: cm.getParameterMaximumValue(i)
						});
						setInfo((info) => ({
							...info,
							parameters: arr
						}));
					} catch {}
				}, 300);
				rt.cleanup = () => window.clearInterval(paramInterval);
			} catch (err) {
				console.error(err);
				toast.error("Failed to build model", { description: err?.message ?? String(err) });
				setInfo((info) => ({
					...info,
					loadedOk: false,
					errors: [...info.errors, String(err?.message ?? err)]
				}));
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		source,
		setInfo,
		config.autoFit
	]);
	(0, import_react.useEffect)(() => {
		const rt = runtimeRef.current;
		if (!rt?.model) return;
		const m = rt.model;
		m.scale.set(state.scale);
		m.rotation = state.rotation * Math.PI / 180;
		m.alpha = state.opacity;
		m.x = rt.app.renderer.width / 2 + state.x;
		m.y = rt.app.renderer.height / 2 + state.y;
		m.interactive = state.dragEnabled;
		if (m.internalModel?.motionManager) m.internalModel.motionManager.speed = state.animationSpeed;
	}, [state]);
	(0, import_react.useEffect)(() => {
		const draw = () => {
			const rt = runtimeRef.current;
			if (!rt) return;
			const overlay = rt.overlay;
			const model = rt.model;
			const app = rt.app;
			if (!overlay || !app) return;
			overlay.clear();
			if (debug.showSafeArea) {
				overlay.lineStyle(1, 9067765, .4);
				overlay.drawRect(40, 40, app.renderer.width - 80, app.renderer.height - 80);
			}
			if (debug.showBounds && model) {
				const b = model.getBounds();
				overlay.lineStyle(1, 2282478, .7);
				overlay.drawRect(b.x, b.y, b.width, b.height);
			}
			if (debug.showOrigin && model) {
				overlay.lineStyle(1, 16736126, .9);
				overlay.moveTo(model.x - 12, model.y);
				overlay.lineTo(model.x + 12, model.y);
				overlay.moveTo(model.x, model.y - 12);
				overlay.lineTo(model.x, model.y + 12);
			}
		};
		const id = window.setInterval(draw, 100);
		return () => window.clearInterval(id);
	}, [debug]);
	const { setState } = usePlayground();
	(0, import_react.useEffect)(() => {
		if (!config.wheelZoom) return;
		const el = hostRef.current;
		if (!el) return;
		const onWheel = (e) => {
			e.preventDefault();
			const delta = -e.deltaY * 8e-4;
			setState((s) => ({
				...s,
				scale: Math.max(.02, Math.min(5, +(s.scale + delta).toFixed(3)))
			}));
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, [setState, config.wheelZoom]);
	const bgStyle = (() => {
		switch (background) {
			case "solid": return { background: bgColor };
			case "transparent": return { background: "transparent" };
			case "gradient": return { background: `radial-gradient(circle at 30% 20%, ${bgColor}, transparent 60%), linear-gradient(135deg, oklch(0.18 0.05 300), oklch(0.22 0.05 200))` };
			case "checker": return {};
			default: return {};
		}
	})();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: hostRef,
		className: `absolute inset-0 ${background === "checker" ? "checker-bg" : background === "grid" ? "grid-bg" : ""}`,
		style: bgStyle
	});
}
async function resolveSource(source) {
	if (source.kind === "files") return await buildResolvedSettings(source.loaded);
	return source.entry.settingsUrl;
}
function fitModel(model, app) {
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
function wireDragging(model, app) {
	let dragging = false;
	const offset = {
		x: 0,
		y: 0
	};
	model.interactive = true;
	model.buttonMode = true;
	model.on("pointerdown", (e) => {
		dragging = true;
		offset.x = e.data.global.x - model.x;
		offset.y = e.data.global.y - model.y;
	});
	const stop = () => dragging = false;
	app.stage.interactive = true;
	app.stage.hitArea = app.screen;
	app.stage.on("pointerup", stop);
	app.stage.on("pointerupoutside", stop);
	app.stage.on("pointermove", (e) => {
		if (!dragging) return;
		model.x = e.data.global.x - offset.x;
		model.y = e.data.global.y - offset.y;
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function ModelLoader() {
	const inputRef = (0, import_react.useRef)(null);
	const { loadFromFiles } = usePlayground();
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const prevent = (e) => {
			e.preventDefault();
			setDragOver(true);
		};
		const leave = () => setDragOver(false);
		const drop = async (e) => {
			e.preventDefault();
			setDragOver(false);
			if (!e.dataTransfer) return;
			try {
				await ingest(await filesFromDataTransfer(e.dataTransfer));
			} catch (err) {
				toast.error("Failed to read dropped files", { description: String(err) });
			}
		};
		window.addEventListener("dragover", prevent);
		window.addEventListener("dragleave", leave);
		window.addEventListener("drop", drop);
		return () => {
			window.removeEventListener("dragover", prevent);
			window.removeEventListener("dragleave", leave);
			window.removeEventListener("drop", drop);
		};
	}, []);
	async function ingest(files) {
		try {
			const nextLoaded = buildLoadedModel(files);
			loadFromFiles(nextLoaded);
			toast.success(`Loaded ${nextLoaded.rootName}`, { description: `${nextLoaded.files.size} files · Cubism ${nextLoaded.cubismVersion}` });
		} catch (err) {
			toast.error("Model load failed", { description: err?.message ?? String(err) });
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: inputRef,
			type: "file",
			multiple: true,
			webkitdirectory: "",
			directory: "",
			className: "hidden",
			onChange: async (e) => {
				if (!e.target.files) return;
				await ingest(await filesFromInput(e.target.files));
				e.target.value = "";
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "secondary",
			size: "sm",
			onClick: () => inputRef.current?.click(),
			className: "gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline",
				children: "Load folder"
			})]
		}),
		dragOver && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass flex items-center gap-3 rounded-2xl px-6 py-5 text-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 text-primary" }), "Drop the model folder anywhere"]
			})
		})
	] });
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var statusBadge = (s) => {
	switch (s) {
		case "ok": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "bg-success/15 text-[var(--color-success)]",
			children: "OK"
		});
		case "missing_files": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "bg-[color:var(--color-warning)]/15 text-[var(--color-warning)]",
			children: "Missing files"
		});
		case "broken": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "bg-destructive/15 text-destructive",
			children: "Broken"
		});
	}
};
function ModelSidebar({ onOpenManager }) {
	const { visibleModels, loading, refresh, hide } = useModelLibrary();
	const { source, loadFromEntry, unload, favorites, toggleFavorite, recent, config } = usePlayground();
	const [q, setQ] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)(config.sidebar.defaultView);
	const [sort, setSort] = (0, import_react.useState)(config.sidebar.defaultSort);
	const [onlyFav, setOnlyFav] = (0, import_react.useState)(false);
	const activeId = source?.kind === "url" ? source.entry.id : null;
	const filtered = (0, import_react.useMemo)(() => {
		const term = q.trim().toLowerCase();
		let list = visibleModels.filter((m) => {
			if (onlyFav && !favorites.includes(m.id)) return false;
			if (!term) return true;
			return m.modelName.toLowerCase().includes(term) || m.folderName.toLowerCase().includes(term) || String(m.cubismVersion).includes(term);
		});
		list = [...list].sort((a, b) => {
			switch (sort) {
				case "modified": return b.lastModified - a.lastModified;
				case "size": return b.totalBytes - a.totalBytes;
				case "cubism": return b.cubismVersion - a.cubismVersion;
				case "motions": return b.motionCount - a.motionCount;
				default: return a.modelName.localeCompare(b.modelName);
			}
		});
		return list;
	}, [
		visibleModels,
		q,
		sort,
		onlyFav,
		favorites
	]);
	const recentModels = (0, import_react.useMemo)(() => recent.map((id) => visibleModels.find((m) => m.id === id)).filter(Boolean), [recent, visibleModels]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-panel-border/60 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
							children: "Library"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px]",
								children: visibleModels.length
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-7 w-7",
								onClick: () => refresh(),
								title: "Rescan",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search models…",
								className: "h-8 pl-7 text-xs"
							}),
							q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setQ(""),
								className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: onlyFav ? "secondary" : "ghost",
								className: "h-7 gap-1 px-2 text-[11px]",
								onClick: () => setOnlyFav((v) => !v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3 w-3 ${onlyFav ? "fill-current text-primary" : ""}` }), "Favorites"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "h-7 w-7",
									title: "Sort",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3.5 w-3.5" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
								align: "end",
								children: [
									"name",
									"modified",
									"size",
									"cubism",
									"motions"
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onSelect: () => setSort(s),
									children: [sort === s ? "• " : "  ", s === "name" ? "Name" : s === "modified" ? "Last modified" : s === "size" ? "Folder size" : s === "cubism" ? "Cubism version" : "Motion count"]
								}, s))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex overflow-hidden rounded-md border border-panel-border/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setView("grid"),
									className: `grid h-7 w-7 place-items-center ${view === "grid" ? "bg-muted/60 text-foreground" : "text-muted-foreground"}`,
									title: "Grid",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid2x2, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setView("list"),
									className: `grid h-7 w-7 place-items-center ${view === "list" ? "bg-muted/60 text-foreground" : "text-muted-foreground"}`,
									title: "List",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-3.5 w-3.5" })
								})]
							})
						]
					})
				]
			}),
			recentModels.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-panel-border/60 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3 w-3" }), " Recent"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					children: recentModels.slice(0, 6).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => loadFromEntry(m),
						className: `rounded-md border border-panel-border/60 bg-muted/20 px-2 py-1 text-[10px] hover:bg-muted/40 ${activeId === m.id ? "border-primary text-primary" : ""}`,
						children: m.modelName
					}, m.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "scrollbar-thin flex-1 overflow-y-auto p-3",
				children: [
					loading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-8 text-center text-xs text-muted-foreground",
						children: "Scanning…"
					}),
					!loading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-8 text-center text-xs text-muted-foreground",
						children: q ? "No matches." : "No models in /public/models/."
					}),
					view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							m,
							active: activeId === m.id,
							fav: favorites.includes(m.id),
							onLoad: () => loadFromEntry(m),
							onUnload: unload,
							onFav: () => toggleFavorite(m.id),
							onOpen: () => onOpenManager(m.id),
							onDelete: () => {
								if (activeId === m.id) unload();
								hide(m.id);
								toast.message(`Hidden ${m.modelName}`, { description: "Local only — files remain in /public/models/." });
							}
						}, m.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: filtered.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row$1, {
							m,
							active: activeId === m.id,
							fav: favorites.includes(m.id),
							onLoad: () => loadFromEntry(m),
							onFav: () => toggleFavorite(m.id),
							onOpen: () => onOpenManager(m.id),
							onDelete: () => {
								if (activeId === m.id) unload();
								hide(m.id);
							}
						}, m.id))
					})
				]
			})
		]
	});
}
function Thumb({ m }) {
	if (!m.thumbnail) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid aspect-square w-full place-items-center rounded-md bg-gradient-to-br from-muted/30 to-muted/10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "h-5 w-5 text-muted-foreground/60" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: m.thumbnail,
		alt: m.modelName,
		loading: "lazy",
		className: "aspect-square w-full rounded-md object-cover",
		onError: (e) => {
			e.currentTarget.style.display = "none";
		}
	});
}
function Card({ m, active, fav, onLoad, onUnload, onFav, onOpen, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `group relative rounded-lg border p-2 transition ${active ? "border-primary/60 bg-primary/10 shadow-[0_0_0_1px_var(--color-primary)]" : "border-panel-border/60 bg-muted/10 hover:bg-muted/25"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onOpen,
				className: "block w-full text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { m }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 truncate text-[11px] font-medium",
						children: m.modelName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate text-[10px] text-muted-foreground",
						children: [
							"C",
							m.cubismVersion,
							" · ",
							m.motionCount,
							"m · ",
							m.expressionCount,
							"e"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: active ? "secondary" : "default",
						className: "h-6 flex-1 px-2 text-[10px]",
						onClick: active ? onUnload : onLoad,
						children: [active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-2.5 w-2.5" }), active ? "Unload" : "Load"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-6 w-6",
						onClick: onFav,
						title: fav ? "Unfavorite" : "Favorite",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3 w-3 ${fav ? "fill-current text-primary" : ""}` })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-6 w-6 text-muted-foreground hover:text-destructive",
						onClick: onDelete,
						title: "Hide (local only)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute right-1.5 top-1.5",
				children: statusBadge(m.status)
			})
		]
	});
}
function Row$1({ m, active, fav, onLoad, onFav, onOpen, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center gap-2 rounded-md border p-1.5 ${active ? "border-primary/60 bg-primary/10" : "border-transparent hover:bg-muted/25"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-8 w-8 shrink-0 overflow-hidden rounded",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { m })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onOpen,
				className: "min-w-0 flex-1 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-[11px] font-medium",
					children: m.modelName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "truncate text-[10px] text-muted-foreground",
					children: [
						"C",
						m.cubismVersion,
						" · ",
						m.motionCount,
						"m · ",
						fmtBytes$1(m.totalBytes),
						" · ",
						fmtRelativeTime(m.lastModified)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				className: "h-6 w-6",
				onClick: onFav,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3 w-3 ${fav ? "fill-current text-primary" : ""}` })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: active ? "secondary" : "ghost",
				className: "h-6 w-6",
				onClick: onLoad,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3 w-3" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				className: "h-6 w-6",
				onClick: onDelete,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
			})
		]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function ModelManager({ openId, onOpenChange }) {
	const { byId, hide } = useModelLibrary();
	const { source, loadFromEntry, unload, favorites, toggleFavorite } = usePlayground();
	const m = openId ? byId(openId) : void 0;
	const isActive = source?.kind === "url" && source.entry.id === m?.id;
	const isFav = m ? favorites.includes(m.id) : false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!openId,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-w-2xl",
			children: m ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [
						m.modelName,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: ["Cubism ", m.cubismVersion]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: m.status })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "truncate font-mono text-[11px]",
					children: m.settingsUrl
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[160px_1fr] gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-lg border border-panel-border/60 bg-muted/20",
						children: m.thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: m.thumbnail,
							alt: m.modelName,
							className: "h-40 w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-40 w-full place-items-center text-xs text-muted-foreground",
							children: "No thumbnail"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-1 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								k: "Folder",
								v: m.folderName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								k: "Files",
								v: m.fileCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								k: "Folder size",
								v: fmtBytes$1(m.totalBytes)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								k: "Last modified",
								v: fmtRelativeTime(m.lastModified)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								k: "Motions",
								v: m.motionCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								k: "Expressions",
								v: m.expressionCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								k: "Textures",
								v: m.textureCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								k: "Physics",
								v: m.hasPhysics ? "Yes" : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								k: "Pose",
								v: m.hasPose ? "Yes" : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								k: "Status",
								v: m.status.replace("_", " ")
							})
						]
					})]
				}),
				m.warnings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-[color:var(--color-warning)]/40 bg-[color:var(--color-warning)]/10 p-2 text-[11px] text-[color:var(--color-warning)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 font-semibold",
						children: "Warnings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-0.5",
						children: m.warnings.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", w] }, i))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "flex-wrap gap-2 sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => toggleFavorite(m.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `mr-1 h-3.5 w-3.5 ${isFav ? "fill-current text-primary" : ""}` }), isFav ? "Unfavorite" : "Favorite"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								if (isActive) unload();
								hide(m.id);
								onOpenChange(false);
							},
							className: "text-muted-foreground hover:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-3.5 w-3.5" }), "Delete (local)"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => {
								unload();
								setTimeout(() => loadFromEntry(m), 50);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1 h-3.5 w-3.5" }), " Reload"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: unload,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "mr-1 h-3.5 w-3.5" }), " Unload"]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => loadFromEntry(m),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-1 h-3.5 w-3.5" }), " Load model"]
						})
					})]
				})
			] }) : null
		})
	});
}
function Meta({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between border-b border-panel-border/40 py-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono",
			children: v
		})]
	});
}
function StatusBadge({ status }) {
	if (status === "ok") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-success/15 text-[var(--color-success)]",
		children: "OK"
	});
	if (status === "missing_files") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]",
		children: "Missing files"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-destructive/15 text-destructive",
		children: "Broken"
	});
}
function EmptyState() {
	const { refresh, loading } = useModelLibrary();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary/25 to-accent/20 ring-1 ring-primary/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageOpen, { className: "h-9 w-9 text-primary" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold tracking-tight",
					children: "No Live2D models found."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "max-w-md text-sm text-muted-foreground",
					children: [
						"Upload model folders into",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[11px]",
							children: "/public/models/"
						}),
						" ",
						"and refresh. The scanner picks up any",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[11px]",
							children: "*.model3.json"
						}),
						" ",
						"automatically — no code changes needed."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => refresh(),
					disabled: loading,
					size: "sm",
					variant: "secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }), "Rescan"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => window.open("/models/", "_blank"),
					className: "gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "h-3.5 w-3.5" }), " Open models folder"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-panel-border/60 bg-muted/20 p-3 text-left text-[11px] font-mono text-muted-foreground",
				children: [
					"public/models/",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"\xA0\xA0my-model/",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"\xA0\xA0\xA0\xA0runtime/my-model.model3.json"
				]
			})
		]
	});
}
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between border-b border-panel-border/60 py-1.5 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "max-w-[60%] truncate text-right font-mono text-foreground",
			children: v
		})]
	});
}
function InfoPanel() {
	const { source, activeName, activeCubism, state, info } = usePlayground();
	const files = source?.kind === "files" ? source.loaded.files.size : source?.kind === "url" ? source.entry.fileCount : 0;
	const bytes = source?.kind === "files" ? source.loaded.totalBytes : source?.kind === "url" ? source.entry.totalBytes : 0;
	const settingsPath = source?.kind === "files" ? source.loaded.settingsPath : source?.kind === "url" ? source.entry.settingsUrl : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
					children: "Model"
				}), source ? info.loadedOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "bg-success/15 text-[var(--color-success)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3 w-3" }), " Loaded"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "bg-destructive/15 text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mr-1 h-3 w-3" }), " Loading…"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: "Empty"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-inset p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Name",
						v: activeName || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Path",
						v: settingsPath || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Folder size",
						v: bytes ? fmtBytes(bytes) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Cubism",
						v: activeCubism ? String(activeCubism) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Files",
						v: files ? String(files) : "—"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
				children: "Assets"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-inset p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Textures",
						v: `${info.textureCount} · ${info.textureRes}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Drawables",
						v: info.drawableCount
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Parts",
						v: info.partCount
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Parameters",
						v: info.parameterCount
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Motions",
						v: Object.values(info.motions).reduce((a, b) => a + b.length, 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Expressions",
						v: info.expressions.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Hit areas",
						v: info.hitAreas.join(", ") || "—"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
				children: "Transform"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-inset p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Scale",
						v: state.scale.toFixed(3)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Position",
						v: `${state.x.toFixed(0)}, ${state.y.toFixed(0)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Rotation",
						v: `${state.rotation}°`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Opacity",
						v: `${Math.round(state.opacity * 100)}%`
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3 w-3" }), " Performance"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-inset space-y-2 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "FPS",
						v: info.fps.toFixed(1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Frame time",
						v: `${info.frameTime.toFixed(2)} ms`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Canvas",
						v: `${info.canvasWidth}×${info.canvasHeight}`
					}),
					info.memory !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "JS heap",
						v: `${info.memory.toFixed(1)} MB`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FPS meter" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Math.min(60, Math.round(info.fps)), "/60"] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: info.fps / 60 * 100,
						className: "mt-1 h-1.5"
					})] })
				]
			})] }),
			(info.warnings.length > 0 || info.errors.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
				children: "Diagnostics"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-inset space-y-1 p-3 text-xs",
				children: [info.warnings.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[var(--color-warning)]",
					children: ["⚠ ", w]
				}, i)), info.errors.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-destructive",
					children: ["✕ ", e]
				}, i))]
			})] })
		]
	});
}
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root$1.displayName;
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass-inset space-y-3 p-3",
			children
		})]
	});
}
function SliderRow({ label, value, min, max, step, onChange, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-center justify-between text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-mono text-foreground",
			children: [value.toFixed(step < .01 ? 3 : step < 1 ? 2 : 0), suffix]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
		min,
		max,
		step,
		value: [value],
		onValueChange: (v) => onChange(v[0])
	})] });
}
function ControlPanel() {
	const { state, setState, background, setBackground, bgColor, setBgColor, debug, setDebug, info } = usePlayground();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Scale",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
				label: "Scale",
				value: state.scale,
				min: .02,
				max: 5,
				step: .005,
				onChange: (v) => setState((s) => ({
					...s,
					scale: v
				}))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => setState((s) => ({
							...s,
							scale: 1
						})),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1 h-3 w-3" }), " 1.0"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => setState((s) => ({
							...s,
							scale: .25
						})),
						children: "Default"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => {
							if (!info.canvasHeight) return;
							const target = info.canvasHeight * .85 / 2e3;
							setState((s) => ({
								...s,
								scale: +target.toFixed(3),
								x: 0,
								y: 0
							}));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, { className: "mr-1 h-3 w-3" }), " Fit"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => {
							navigator.clipboard.writeText(state.scale.toFixed(3));
							toast.success(`Copied ${state.scale.toFixed(3)}`);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1 h-3 w-3" }), " Copy"]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Position",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
					label: "X",
					value: state.x,
					min: -1e3,
					max: 1e3,
					step: 1,
					onChange: (v) => setState((s) => ({
						...s,
						x: v
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
					label: "Y",
					value: state.y,
					min: -1e3,
					max: 1e3,
					step: 1,
					onChange: (v) => setState((s) => ({
						...s,
						y: v
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => setState((s) => ({
							...s,
							x: 0,
							y: 0
						})),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "mr-1 h-3 w-3" }), " Center"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setState({ ...defaultModelState }),
						children: "Reset all"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Rotation & Opacity",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
				label: "Rotation",
				value: state.rotation,
				min: -180,
				max: 180,
				step: 1,
				suffix: "°",
				onChange: (v) => setState((s) => ({
					...s,
					rotation: v
				}))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
				label: "Opacity",
				value: state.opacity,
				min: 0,
				max: 1,
				step: .01,
				onChange: (v) => setState((s) => ({
					...s,
					opacity: v
				}))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Animation & Drag",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
				label: "Anim speed",
				value: state.animationSpeed,
				min: .1,
				max: 3,
				step: .05,
				suffix: "x",
				onChange: (v) => setState((s) => ({
					...s,
					animationSpeed: v
				}))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
					className: "text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Move, { className: "mr-1 inline h-3 w-3" }), " Enable drag"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: state.dragEnabled,
					onCheckedChange: (v) => setState((s) => ({
						...s,
						dragEnabled: v
					}))
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-1.5",
				children: [
					"grid",
					"checker",
					"solid",
					"gradient",
					"transparent"
				].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: background === b ? "default" : "secondary",
					onClick: () => setBackground(b),
					className: "capitalize",
					children: b
				}, b))
			}), (background === "solid" || background === "gradient") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs text-muted-foreground",
					children: "Color"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "color",
					value: bgColor,
					onChange: (e) => setBgColor(e.target.value),
					className: "h-8 w-16 p-1"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Debug overlays",
			children: [
				["showSafeArea", "Safe area"],
				["showBounds", "Model bounds"],
				["showOrigin", "Origin / pivot"],
				["showHitAreas", "Hit areas (info)"]
			].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: debug[key],
					onCheckedChange: (v) => setDebug((d) => ({
						...d,
						[key]: v
					}))
				})]
			}, key))
		})
	] });
}
function MotionPanel() {
	const { info } = usePlayground();
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const out = {};
		for (const [g, list] of Object.entries(info.motions)) {
			const hits = list.filter((n) => (g + " " + n).toLowerCase().includes(q.toLowerCase()));
			if (hits.length) out[g] = hits;
		}
		return out;
	}, [info.motions, q]);
	const runningRef = (0, import_react.useRef)(false);
	const play = (group, index) => {
		const model = window.__l2dModel ?? null;
		const app = window.__l2dApp ?? null;
		const m = model || findModelInStage(app);
		if (!m) {
			toast.error("No model in stage");
			return;
		}
		try {
			m.motion(group, index);
			runningRef.current = true;
		} catch (e) {
			toast.error("motion() failed", { description: e?.message });
		}
	};
	const stop = () => {
		findModelOnStage()?.internalModel?.motionManager?.stopAllMotions?.();
	};
	const random = () => {
		const groups = Object.keys(info.motions);
		if (!groups.length) return;
		const g = groups[Math.floor(Math.random() * groups.length)];
		const i = Math.floor(Math.random() * info.motions[g].length);
		play(g, i);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
				children: "Motions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: random,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "mr-1 h-3 w-3" }), " Random"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: stop,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "mr-1 h-3 w-3" }), " Stop"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			placeholder: "Search motions…",
			value: q,
			onChange: (e) => setQ(e.target.value),
			className: "mb-2 h-8 text-xs"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "scrollbar-thin max-h-[40vh] space-y-3 overflow-y-auto pr-1",
			children: [Object.keys(filtered).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: "No motions."
			}), Object.entries(filtered).map(([group, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-[11px] font-medium text-muted-foreground",
				children: group
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: list.map((name, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					className: "h-7 text-[11px]",
					onClick: () => play(group, i),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-1 h-3 w-3" }),
						" ",
						name
					]
				}, i))
			})] }, group))]
		})
	] });
}
function findModelOnStage() {
	const m = window.__l2dModel;
	if (m?.internalModel) return m;
	const app = window.__l2dApp;
	if (app?.stage?.children) {
		for (const ch of app.stage.children) if (ch?.internalModel) return ch;
	}
	return null;
}
function findModelInStage(app) {
	if (!app?.stage?.children) return null;
	for (const ch of app.stage.children) if (ch?.internalModel) return ch;
	return null;
}
function ExpressionPanel() {
	const { info } = usePlayground();
	const apply = (name) => {
		const m = findModelOnStage();
		if (!m?.expression) {
			toast.error("Model missing expression()");
			return;
		}
		m.expression(name);
	};
	const reset = () => {
		findModelOnStage()?.internalModel?.motionManager?.expressionManager?.resetExpression?.();
	};
	const random = () => {
		if (!info.expressions.length) return;
		apply(info.expressions[Math.floor(Math.random() * info.expressions.length)]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
			children: "Expressions"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "secondary",
				onClick: random,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "mr-1 h-3 w-3" }), " Random"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: reset,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-1 h-3 w-3" }), " Reset"]
			})]
		})]
	}), info.expressions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs text-muted-foreground",
		children: "None defined."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5",
		children: info.expressions.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			variant: "secondary",
			className: "h-7 text-[11px]",
			onClick: () => apply(name),
			children: name
		}, name))
	})] });
}
function ParameterInspector() {
	const { info } = usePlayground();
	const [q, setQ] = (0, import_react.useState)("");
	const params = (0, import_react.useMemo)(() => info.parameters.filter((p) => p.id.toLowerCase().includes(q.toLowerCase())), [info.parameters, q]);
	const setVal = (id, v) => {
		const m = findModelOnStage();
		if (!m) return;
		try {
			m.internalModel.coreModel.setParameterValueById?.(id, v);
		} catch {
			const cm = m.internalModel.coreModel;
			const n = cm.getParameterCount();
			for (let i = 0; i < n; i++) if (cm.getParameterId(i) === id) {
				cm.setParameterValueByIndex(i, v);
				break;
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 flex items-center justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
				children: [
					"Parameters (",
					info.parameters.length,
					")"
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			placeholder: "Search parameters…",
			value: q,
			onChange: (e) => setQ(e.target.value),
			className: "mb-2 h-8 text-xs"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "scrollbar-thin max-h-[45vh] space-y-2 overflow-y-auto pr-1",
			children: [params.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: "No parameters."
			}), params.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-inset px-2 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center justify-between text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-mono",
							children: p.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-muted-foreground",
								children: p.value.toFixed(2)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-5 w-5",
								onClick: () => setVal(p.id, p.default),
								title: "Reset",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: p.min,
						max: p.max,
						step: (p.max - p.min) / 200 || .01,
						value: [p.value],
						onValueChange: (v) => setVal(p.id, v[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 flex justify-between text-[10px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.min.toFixed(1) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.max.toFixed(1) })]
					})
				]
			}, p.id))]
		})
	] });
}
function PartInspector() {
	const { info } = usePlayground();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
		children: [
			"Parts (",
			info.parts.length,
			")"
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "scrollbar-thin max-h-[30vh] space-y-2 overflow-y-auto pr-1",
		children: [info.parts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: "No parts."
		}), info.parts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-inset px-2 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate font-mono",
					children: p.id
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: p.opacity.toFixed(2)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				min: 0,
				max: 1,
				step: .01,
				value: [p.opacity],
				onValueChange: (v) => {
					findModelOnStage()?.internalModel?.coreModel?.setPartOpacity?.(i, v[0]);
				}
			})]
		}, p.id))]
	})] });
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function ExportPanel() {
	const { state, setState, activeName } = usePlayground();
	const fileRef = (0, import_react.useRef)(null);
	const json = (0, import_react.useMemo)(() => JSON.stringify({
		model: activeName || "unknown",
		scale: +state.scale.toFixed(4),
		positionX: state.x,
		positionY: state.y,
		rotation: state.rotation,
		opacity: state.opacity,
		animationSpeed: state.animationSpeed,
		dragEnabled: state.dragEnabled,
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	}, null, 2), [state, activeName]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
			children: "Config"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
			readOnly: true,
			value: json,
			className: "h-40 font-mono text-[11px]"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex flex-wrap gap-1.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => {
						navigator.clipboard.writeText(json);
						toast.success("Config copied");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1 h-3 w-3" }), " Copy"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: () => {
						const blob = new Blob([json], { type: "application/json" });
						const url = URL.createObjectURL(blob);
						const a = document.createElement("a");
						a.href = url;
						a.download = `${activeName || "live2d"}-config.json`;
						a.click();
						URL.revokeObjectURL(url);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-3 w-3" }), " Download"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => fileRef.current?.click(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-1 h-3 w-3" }), " Import"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileRef,
					type: "file",
					accept: "application/json",
					className: "hidden",
					onChange: async (e) => {
						const f = e.target.files?.[0];
						if (!f) return;
						try {
							const j = JSON.parse(await f.text());
							setState((s) => ({
								...s,
								scale: j.scale ?? s.scale,
								x: j.positionX ?? s.x,
								y: j.positionY ?? s.y,
								rotation: j.rotation ?? s.rotation,
								opacity: j.opacity ?? s.opacity,
								animationSpeed: j.animationSpeed ?? s.animationSpeed,
								dragEnabled: j.dragEnabled ?? s.dragEnabled
							}));
							toast.success("Config imported");
						} catch (err) {
							toast.error("Invalid JSON", { description: err?.message });
						}
						e.target.value = "";
					}
				})
			]
		})
	] });
}
var Tabs = Root2$1;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List$1, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List$1.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$1, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger$1.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function Playground() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaygroundProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModelLibraryProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
		theme: "dark",
		richColors: true,
		position: "bottom-right"
	})] }) });
}
function Shell() {
	const { source, activeName, activeCubism, setState } = usePlayground();
	const { visibleModels, loading } = useModelLibrary();
	const [libraryOpen, setLibraryOpen] = (0, import_react.useState)(true);
	const [rightOpen, setRightOpen] = (0, import_react.useState)(true);
	const [managerId, setManagerId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const t = e.target;
			if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA") return;
			if (e.key.toLowerCase() === "r") setState({ ...defaultModelState });
			if (e.key.toLowerCase() === "f") setState((s) => ({
				...s,
				scale: .28,
				x: 0,
				y: 0
			}));
			if (e.key.toLowerCase() === "l") setLibraryOpen((v) => !v);
			if (e.key === "ArrowLeft") setState((s) => ({
				...s,
				x: s.x - 10
			}));
			if (e.key === "ArrowRight") setState((s) => ({
				...s,
				x: s.x + 10
			}));
			if (e.key === "ArrowUp") setState((s) => ({
				...s,
				y: s.y - 10
			}));
			if (e.key === "ArrowDown") setState((s) => ({
				...s,
				y: s.y + 10
			}));
			if (e.key === "+" || e.key === "=") setState((s) => ({
				...s,
				scale: +(s.scale + .02).toFixed(3)
			}));
			if (e.key === "-" || e.key === "_") setState((s) => ({
				...s,
				scale: Math.max(.05, +(s.scale - .02).toFixed(3))
			}));
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [setState]);
	const noModelsAtAll = !loading && visibleModels.length === 0 && !source;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-screen w-screen overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "glass fixed inset-x-3 top-3 z-30 flex h-14 items-center justify-between rounded-2xl px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "md:hidden",
							onClick: () => setLibraryOpen((v) => !v),
							title: "Toggle library",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-primary-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold tracking-tight neon-text",
							children: "Live2D Playground"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: source ? `${activeName} · Cubism ${activeCubism}` : `${visibleModels.length} model${visibleModels.length === 1 ? "" : "s"} available`
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelLoader, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => setLibraryOpen((v) => !v),
							title: "Toggle library (L)",
							className: "hidden md:inline-flex",
							children: libraryOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => setRightOpen((v) => !v),
							title: "Toggle right panel",
							className: "hidden md:inline-flex",
							children: rightOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRightOpen, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRightClose, {})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid h-full w-full gap-3 p-3 pt-20",
				style: {
					gridTemplateColumns: [
						libraryOpen ? "minmax(240px, 280px)" : "0px",
						"minmax(260px, 300px)",
						"1fr",
						rightOpen ? "minmax(300px, 340px)" : "0px"
					].join(" "),
					transition: "grid-template-columns 200ms ease"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: `glass overflow-hidden rounded-2xl transition-opacity ${libraryOpen ? "opacity-100" : "pointer-events-none opacity-0"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelSidebar, { onOpenManager: setManagerId })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "glass scrollbar-thin hidden overflow-y-auto rounded-2xl p-4 md:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoPanel, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "glass relative overflow-hidden rounded-2xl",
						children: noModelsAtAll ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Live2DStage, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: `glass overflow-hidden rounded-2xl transition-opacity ${rightOpen ? "opacity-100" : "pointer-events-none opacity-0"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							defaultValue: "controls",
							className: "flex h-full flex-col",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "mx-3 mt-3 grid grid-cols-3 bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "controls",
											children: "Controls"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "motions",
											children: "Motions"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "params",
											children: "Params"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "controls",
									className: "scrollbar-thin flex-1 overflow-y-auto p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlPanel, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportPanel, {})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "motions",
									className: "scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionPanel, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpressionPanel, {})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "params",
									className: "scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParameterInspector, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartInspector, {})]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelManager, {
				openId: managerId,
				onOpenChange: (o) => !o && setManagerId(null)
			})
		]
	});
}
//#endregion
export { Playground as default };
