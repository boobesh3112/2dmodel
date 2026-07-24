import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BajtTSM5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Playground = (0, import_react.lazy)(() => import("./Playground-DDgCdv9V.mjs"));
function Page() {
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setHydrated(true), []);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass rounded-2xl px-6 py-4 text-sm text-muted-foreground",
			children: "Booting Live2D Playground…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-screen items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass rounded-2xl px-6 py-4 text-sm text-muted-foreground",
				children: "Loading engine…"
			})
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Playground, {})
	});
}
//#endregion
export { Page as component };
