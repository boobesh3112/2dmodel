import { n as __exportAll } from "../_runtime.mjs";
import { $ as SVGResource, A as Framebuffer, An as MSAA_QUALITY, At as Ticker, B as ImageResource, Bt as ObservablePoint, C as BufferResource, Cn as COLOR_MASK_BITS, Ct as generateProgram, D as Filter, Dn as GC_MODES, Dt as resources, E as CubeResource, En as FORMATS, Et as getUBOData, F as Geometry, Fn as TARGETS, Ft as extensions, G as ProjectionSystem, Gt as Rectangle, H as MaskSystem, Ht as Point, I as GeometrySystem, In as TYPES, It as Circle, J as RenderTexture, Jt as Transform, K as Quad, Kt as RoundedRectangle, L as IGLUniformData, Ln as WRAP_MODES, Lt as DEG_TO_RAD, M as GLFramebuffer, Mn as RENDERER_TYPE, Mt as UPDATE_PRIORITY, N as GLProgram, Nn as SAMPLER_TYPES, Nt as Runner, O as FilterState, On as MASK_TYPES, Ot as systems, P as GLTexture, Pn as SCALE_MODES, Pt as ExtensionType, Q as Resource, R as INSTALLED, Rt as Ellipse, S as Buffer, Sn as CLEAR_MODES, St as defaultVertex$1, T as ContextSystem, Tn as ENV, Tt as getTestContext, U as ObjectRenderer, Ut as Polygon, V as MaskData, Vt as PI_2, W as Program, Wt as RAD_TO_DEG, X as RenderTextureSystem, Y as RenderTexturePool, Yt as groupD8, Z as Renderer, _ as BatchPluginFactory, _n as settings, _t as autoDetectRenderer, a as DisplayObject, at as StateSystem, b as BatchSystem, bn as BUFFER_BITS, bt as createUBOElements, c as AbstractMultiResource, ct as Texture, d as Attribute, dt as TextureSystem, et as ScissorSystem, f as BaseImageResource, ft as TextureUvs, g as BatchGeometry, gn as isMobile, gt as ViewableBuffer, h as BatchDrawCall, hn as BrowserAdapter, ht as VideoResource, i as Container, it as State, j as FramebufferSystem, jn as PRECISION, jt as TickerPlugin, k as FilterSystem, kn as MIPMAP_MODES, kt as uniformParsers, l as AbstractRenderer, lt as TextureGCSystem, m as BaseTexture, mn as utils_exports, mt as VERSION, n as accessibleTarget, nt as ShaderSystem, o as TemporaryDisplayObject, ot as StencilSystem, p as BaseRenderTexture, pt as UniformGroup, q as QuadUv, qt as SHAPES, r as Bounds, rt as SpriteMaskFilter, s as AbstractBatchRenderer, st as System, t as AccessibilityManager, tt as Shader, u as ArrayResource, ut as TextureMatrix, v as BatchRenderer, vn as ALPHA_MODES, vt as autoDetectResource, w as CanvasResource, wn as DRAW_MODES, wt as generateUniformBufferSync, x as BatchTextureArray, xn as BUFFER_TYPE, xt as defaultFilterVertex, y as BatchShaderGenerator, yn as BLEND_MODES, yt as checkMaxIfStatementsInShader, z as ImageBitmapResource, zt as Matrix } from "./@pixi/accessibility+[...].mjs";
import "./@pixi/polyfill+[...].mjs";
import { a as interactiveTarget, i as InteractionTrackingData, n as InteractionEvent, r as InteractionManager, t as InteractionData } from "./pixi__interaction.mjs";
import { t as Extract } from "./pixi__extract.mjs";
import { a as FORMATS_TO_COMPONENTS, c as KTXLoader, d as parseDDS, f as parseKTX, g as TextureLoader, h as LoaderResource, i as DDSLoader, l as TYPES_TO_BYTES_PER_COMPONENT, m as Loader, n as CompressedTextureLoader, o as INTERNAL_FORMATS, p as AppLoaderPlugin, r as CompressedTextureResource, s as INTERNAL_FORMAT_TO_BYTES_PER_PIXEL, t as BlobResource, u as TYPES_TO_BYTES_PER_PIXEL } from "./@pixi/compressed-textures+[...].mjs";
import { n as ParticleRenderer, t as ParticleContainer } from "./pixi__particle-container.mjs";
import { a as GraphicsGeometry, c as LineStyle, i as GraphicsData, l as graphicsUtils, n as GRAPHICS_CURVES, o as LINE_CAP, r as Graphics, s as LINE_JOIN, t as FillStyle } from "./pixi__graphics.mjs";
import { t as Sprite } from "./@pixi/mixin-cache-as-bitmap+[...].mjs";
import { a as TEXT_GRADIENT, c as TextStyle, i as TimeLimiter, n as CountLimiter, o as Text, r as Prepare, s as TextMetrics, t as BasePrepare } from "./pixi__prepare+pixi__text.mjs";
import { n as SpritesheetLoader, t as Spritesheet } from "./pixi__spritesheet.mjs";
import { n as TilingSpriteRenderer, t as TilingSprite } from "./pixi__sprite-tiling.mjs";
import { i as MeshMaterial, n as MeshBatchUvs, r as MeshGeometry, t as Mesh } from "./pixi__mesh.mjs";
import { a as TextFormat, c as autoDetectFormat, i as BitmapText, n as BitmapFontData, o as XMLFormat, r as BitmapFontLoader, s as XMLStringFormat, t as BitmapFont } from "./pixi__text-bitmap.mjs";
import { t as AlphaFilter } from "./pixi__filter-alpha.mjs";
import { n as BlurFilterPass, t as BlurFilter } from "./pixi__filter-blur.mjs";
import { t as ColorMatrixFilter } from "./pixi__filter-color-matrix.mjs";
import { t as DisplacementFilter } from "./pixi__filter-displacement.mjs";
import { t as FXAAFilter } from "./pixi__filter-fxaa.mjs";
import { t as NoiseFilter } from "./pixi__filter-noise.mjs";
import "./pixi__mixin-get-child-by-name.mjs";
import "./@pixi/mixin-get-global-position+[...].mjs";
import { n as ResizePlugin, t as Application } from "./pixi__app.mjs";
import { a as SimplePlane, i as SimpleMesh, n as PlaneGeometry, o as SimpleRope, r as RopeGeometry, t as NineSlicePlane } from "./pixi__mesh-extras.mjs";
import { t as AnimatedSprite } from "./pixi__sprite-animated.mjs";
//#region node_modules/pixi.js/dist/esm/pixi.mjs
var pixi_exports = /* @__PURE__ */ __exportAll({
	ALPHA_MODES: () => ALPHA_MODES,
	AbstractBatchRenderer: () => AbstractBatchRenderer,
	AbstractMultiResource: () => AbstractMultiResource,
	AbstractRenderer: () => AbstractRenderer,
	AccessibilityManager: () => AccessibilityManager,
	AnimatedSprite: () => AnimatedSprite,
	AppLoaderPlugin: () => AppLoaderPlugin,
	Application: () => Application,
	ArrayResource: () => ArrayResource,
	Attribute: () => Attribute,
	BLEND_MODES: () => BLEND_MODES,
	BUFFER_BITS: () => BUFFER_BITS,
	BUFFER_TYPE: () => BUFFER_TYPE,
	BaseImageResource: () => BaseImageResource,
	BasePrepare: () => BasePrepare,
	BaseRenderTexture: () => BaseRenderTexture,
	BaseTexture: () => BaseTexture,
	BatchDrawCall: () => BatchDrawCall,
	BatchGeometry: () => BatchGeometry,
	BatchPluginFactory: () => BatchPluginFactory,
	BatchRenderer: () => BatchRenderer,
	BatchShaderGenerator: () => BatchShaderGenerator,
	BatchSystem: () => BatchSystem,
	BatchTextureArray: () => BatchTextureArray,
	BitmapFont: () => BitmapFont,
	BitmapFontData: () => BitmapFontData,
	BitmapFontLoader: () => BitmapFontLoader,
	BitmapText: () => BitmapText,
	BlobResource: () => BlobResource,
	Bounds: () => Bounds,
	BrowserAdapter: () => BrowserAdapter,
	Buffer: () => Buffer,
	BufferResource: () => BufferResource,
	CLEAR_MODES: () => CLEAR_MODES,
	COLOR_MASK_BITS: () => COLOR_MASK_BITS,
	CanvasResource: () => CanvasResource,
	Circle: () => Circle,
	CompressedTextureLoader: () => CompressedTextureLoader,
	CompressedTextureResource: () => CompressedTextureResource,
	Container: () => Container,
	ContextSystem: () => ContextSystem,
	CountLimiter: () => CountLimiter,
	CubeResource: () => CubeResource,
	DDSLoader: () => DDSLoader,
	DEG_TO_RAD: () => DEG_TO_RAD,
	DRAW_MODES: () => DRAW_MODES,
	DisplayObject: () => DisplayObject,
	ENV: () => ENV,
	Ellipse: () => Ellipse,
	ExtensionType: () => ExtensionType,
	Extract: () => Extract,
	FORMATS: () => FORMATS,
	FORMATS_TO_COMPONENTS: () => FORMATS_TO_COMPONENTS,
	FillStyle: () => FillStyle,
	Filter: () => Filter,
	FilterState: () => FilterState,
	FilterSystem: () => FilterSystem,
	Framebuffer: () => Framebuffer,
	FramebufferSystem: () => FramebufferSystem,
	GC_MODES: () => GC_MODES,
	GLFramebuffer: () => GLFramebuffer,
	GLProgram: () => GLProgram,
	GLTexture: () => GLTexture,
	GRAPHICS_CURVES: () => GRAPHICS_CURVES,
	Geometry: () => Geometry,
	GeometrySystem: () => GeometrySystem,
	Graphics: () => Graphics,
	GraphicsData: () => GraphicsData,
	GraphicsGeometry: () => GraphicsGeometry,
	IGLUniformData: () => IGLUniformData,
	INSTALLED: () => INSTALLED,
	INTERNAL_FORMATS: () => INTERNAL_FORMATS,
	INTERNAL_FORMAT_TO_BYTES_PER_PIXEL: () => INTERNAL_FORMAT_TO_BYTES_PER_PIXEL,
	ImageBitmapResource: () => ImageBitmapResource,
	ImageResource: () => ImageResource,
	InteractionData: () => InteractionData,
	InteractionEvent: () => InteractionEvent,
	InteractionManager: () => InteractionManager,
	InteractionTrackingData: () => InteractionTrackingData,
	KTXLoader: () => KTXLoader,
	LINE_CAP: () => LINE_CAP,
	LINE_JOIN: () => LINE_JOIN,
	LineStyle: () => LineStyle,
	Loader: () => Loader,
	LoaderResource: () => LoaderResource,
	MASK_TYPES: () => MASK_TYPES,
	MIPMAP_MODES: () => MIPMAP_MODES,
	MSAA_QUALITY: () => MSAA_QUALITY,
	MaskData: () => MaskData,
	MaskSystem: () => MaskSystem,
	Matrix: () => Matrix,
	Mesh: () => Mesh,
	MeshBatchUvs: () => MeshBatchUvs,
	MeshGeometry: () => MeshGeometry,
	MeshMaterial: () => MeshMaterial,
	NineSlicePlane: () => NineSlicePlane,
	ObjectRenderer: () => ObjectRenderer,
	ObservablePoint: () => ObservablePoint,
	PI_2: () => PI_2,
	PRECISION: () => PRECISION,
	ParticleContainer: () => ParticleContainer,
	ParticleRenderer: () => ParticleRenderer,
	PlaneGeometry: () => PlaneGeometry,
	Point: () => Point,
	Polygon: () => Polygon,
	Prepare: () => Prepare,
	Program: () => Program,
	ProjectionSystem: () => ProjectionSystem,
	Quad: () => Quad,
	QuadUv: () => QuadUv,
	RAD_TO_DEG: () => RAD_TO_DEG,
	RENDERER_TYPE: () => RENDERER_TYPE,
	Rectangle: () => Rectangle,
	RenderTexture: () => RenderTexture,
	RenderTexturePool: () => RenderTexturePool,
	RenderTextureSystem: () => RenderTextureSystem,
	Renderer: () => Renderer,
	ResizePlugin: () => ResizePlugin,
	Resource: () => Resource,
	RopeGeometry: () => RopeGeometry,
	RoundedRectangle: () => RoundedRectangle,
	Runner: () => Runner,
	SAMPLER_TYPES: () => SAMPLER_TYPES,
	SCALE_MODES: () => SCALE_MODES,
	SHAPES: () => SHAPES,
	SVGResource: () => SVGResource,
	ScissorSystem: () => ScissorSystem,
	Shader: () => Shader,
	ShaderSystem: () => ShaderSystem,
	SimpleMesh: () => SimpleMesh,
	SimplePlane: () => SimplePlane,
	SimpleRope: () => SimpleRope,
	Sprite: () => Sprite,
	SpriteMaskFilter: () => SpriteMaskFilter,
	Spritesheet: () => Spritesheet,
	SpritesheetLoader: () => SpritesheetLoader,
	State: () => State,
	StateSystem: () => StateSystem,
	StencilSystem: () => StencilSystem,
	System: () => System,
	TARGETS: () => TARGETS,
	TEXT_GRADIENT: () => TEXT_GRADIENT,
	TYPES: () => TYPES,
	TYPES_TO_BYTES_PER_COMPONENT: () => TYPES_TO_BYTES_PER_COMPONENT,
	TYPES_TO_BYTES_PER_PIXEL: () => TYPES_TO_BYTES_PER_PIXEL,
	TemporaryDisplayObject: () => TemporaryDisplayObject,
	Text: () => Text,
	TextFormat: () => TextFormat,
	TextMetrics: () => TextMetrics,
	TextStyle: () => TextStyle,
	Texture: () => Texture,
	TextureGCSystem: () => TextureGCSystem,
	TextureLoader: () => TextureLoader,
	TextureMatrix: () => TextureMatrix,
	TextureSystem: () => TextureSystem,
	TextureUvs: () => TextureUvs,
	Ticker: () => Ticker,
	TickerPlugin: () => TickerPlugin,
	TilingSprite: () => TilingSprite,
	TilingSpriteRenderer: () => TilingSpriteRenderer,
	TimeLimiter: () => TimeLimiter,
	Transform: () => Transform,
	UPDATE_PRIORITY: () => UPDATE_PRIORITY,
	UniformGroup: () => UniformGroup,
	VERSION: () => VERSION,
	VideoResource: () => VideoResource,
	ViewableBuffer: () => ViewableBuffer,
	WRAP_MODES: () => WRAP_MODES,
	XMLFormat: () => XMLFormat,
	XMLStringFormat: () => XMLStringFormat,
	accessibleTarget: () => accessibleTarget,
	autoDetectFormat: () => autoDetectFormat,
	autoDetectRenderer: () => autoDetectRenderer,
	autoDetectResource: () => autoDetectResource,
	checkMaxIfStatementsInShader: () => checkMaxIfStatementsInShader,
	createUBOElements: () => createUBOElements,
	defaultFilterVertex: () => defaultFilterVertex,
	defaultVertex: () => defaultVertex$1,
	extensions: () => extensions,
	filters: () => filters,
	generateProgram: () => generateProgram,
	generateUniformBufferSync: () => generateUniformBufferSync,
	getTestContext: () => getTestContext,
	getUBOData: () => getUBOData,
	graphicsUtils: () => graphicsUtils,
	groupD8: () => groupD8,
	interactiveTarget: () => interactiveTarget,
	isMobile: () => isMobile,
	parseDDS: () => parseDDS,
	parseKTX: () => parseKTX,
	resources: () => resources,
	settings: () => settings,
	systems: () => systems,
	uniformParsers: () => uniformParsers,
	utils: () => utils_exports
});
/*!
* pixi.js - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* pixi.js is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
extensions.add(AccessibilityManager, Extract, InteractionManager, ParticleRenderer, Prepare, BatchRenderer, TilingSpriteRenderer, BitmapFontLoader, CompressedTextureLoader, DDSLoader, KTXLoader, SpritesheetLoader, TickerPlugin, AppLoaderPlugin);
/**
* This namespace contains WebGL-only display filters that can be applied
* to DisplayObjects using the {@link PIXI.DisplayObject#filters filters} property.
*
* Since PixiJS only had a handful of built-in filters, additional filters
* can be downloaded {@link https://github.com/pixijs/pixi-filters here} from the
* PixiJS Filters repository.
*
* All filters must extend {@link PIXI.Filter}.
* @example
* // Create a new application
* const app = new PIXI.Application();
*
* // Draw a green rectangle
* const rect = new PIXI.Graphics()
*     .beginFill(0x00ff00)
*     .drawRect(40, 40, 200, 200);
*
* // Add a blur filter
* rect.filters = [new PIXI.filters.BlurFilter()];
*
* // Display rectangle
* app.stage.addChild(rect);
* document.body.appendChild(app.view);
* @namespace PIXI.filters
*/
var filters = {
	AlphaFilter,
	BlurFilter,
	BlurFilterPass,
	ColorMatrixFilter,
	DisplacementFilter,
	FXAAFilter,
	NoiseFilter
};
//#endregion
export { pixi_exports as t };
