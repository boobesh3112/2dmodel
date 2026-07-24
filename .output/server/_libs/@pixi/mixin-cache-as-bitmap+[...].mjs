import { An as MSAA_QUALITY, Bt as ObservablePoint, Gt as Rectangle, Ht as Point, J as RenderTexture, _n as settings, a as DisplayObject, ct as Texture, fn as uid, i as Container, ln as sign, m as BaseTexture, r as Bounds, yn as BLEND_MODES, zt as Matrix } from "./accessibility+[...].mjs";
//#region node_modules/@pixi/sprite/dist/esm/sprite.mjs
/*!
* @pixi/sprite - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/sprite is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d, b) {
	extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics(d, b);
};
function __extends(d, b) {
	extendStatics(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var tempPoint = new Point();
var indices = new Uint16Array([
	0,
	1,
	2,
	0,
	2,
	3
]);
/**
* The Sprite object is the base for all textured objects that are rendered to the screen
*
* A sprite can be created directly from an image like this:
*
* ```js
* let sprite = PIXI.Sprite.from('assets/image.png');
* ```
*
* The more efficient way to create sprites is using a {@link PIXI.Spritesheet},
* as swapping base textures when rendering to the screen is inefficient.
*
* ```js
* PIXI.Loader.shared.add("assets/spritesheet.json").load(setup);
*
* function setup() {
*   let sheet = PIXI.Loader.shared.resources["assets/spritesheet.json"].spritesheet;
*   let sprite = new PIXI.Sprite(sheet.textures["image.png"]);
*   ...
* }
* ```
* @memberof PIXI
*/
var Sprite = function(_super) {
	__extends(Sprite, _super);
	/** @param texture - The texture for this sprite. */
	function Sprite(texture) {
		var _this = _super.call(this) || this;
		_this._anchor = new ObservablePoint(_this._onAnchorUpdate, _this, texture ? texture.defaultAnchor.x : 0, texture ? texture.defaultAnchor.y : 0);
		_this._texture = null;
		_this._width = 0;
		_this._height = 0;
		_this._tint = null;
		_this._tintRGB = null;
		_this.tint = 16777215;
		_this.blendMode = BLEND_MODES.NORMAL;
		_this._cachedTint = 16777215;
		_this.uvs = null;
		_this.texture = texture || Texture.EMPTY;
		_this.vertexData = /* @__PURE__ */ new Float32Array(8);
		_this.vertexTrimmedData = null;
		_this._transformID = -1;
		_this._textureID = -1;
		_this._transformTrimmedID = -1;
		_this._textureTrimmedID = -1;
		_this.indices = indices;
		_this.pluginName = "batch";
		/**
		* Used to fast check if a sprite is.. a sprite!
		* @member {boolean}
		*/
		_this.isSprite = true;
		_this._roundPixels = settings.ROUND_PIXELS;
		return _this;
	}
	/** When the texture is updated, this event will fire to update the scale and frame. */
	Sprite.prototype._onTextureUpdate = function() {
		this._textureID = -1;
		this._textureTrimmedID = -1;
		this._cachedTint = 16777215;
		if (this._width) this.scale.x = sign(this.scale.x) * this._width / this._texture.orig.width;
		if (this._height) this.scale.y = sign(this.scale.y) * this._height / this._texture.orig.height;
	};
	/** Called when the anchor position updates. */
	Sprite.prototype._onAnchorUpdate = function() {
		this._transformID = -1;
		this._transformTrimmedID = -1;
	};
	/** Calculates worldTransform * vertices, store it in vertexData. */
	Sprite.prototype.calculateVertices = function() {
		var texture = this._texture;
		if (this._transformID === this.transform._worldID && this._textureID === texture._updateID) return;
		if (this._textureID !== texture._updateID) this.uvs = this._texture._uvs.uvsFloat32;
		this._transformID = this.transform._worldID;
		this._textureID = texture._updateID;
		var wt = this.transform.worldTransform;
		var a = wt.a;
		var b = wt.b;
		var c = wt.c;
		var d = wt.d;
		var tx = wt.tx;
		var ty = wt.ty;
		var vertexData = this.vertexData;
		var trim = texture.trim;
		var orig = texture.orig;
		var anchor = this._anchor;
		var w0 = 0;
		var w1 = 0;
		var h0 = 0;
		var h1 = 0;
		if (trim) {
			w1 = trim.x - anchor._x * orig.width;
			w0 = w1 + trim.width;
			h1 = trim.y - anchor._y * orig.height;
			h0 = h1 + trim.height;
		} else {
			w1 = -anchor._x * orig.width;
			w0 = w1 + orig.width;
			h1 = -anchor._y * orig.height;
			h0 = h1 + orig.height;
		}
		vertexData[0] = a * w1 + c * h1 + tx;
		vertexData[1] = d * h1 + b * w1 + ty;
		vertexData[2] = a * w0 + c * h1 + tx;
		vertexData[3] = d * h1 + b * w0 + ty;
		vertexData[4] = a * w0 + c * h0 + tx;
		vertexData[5] = d * h0 + b * w0 + ty;
		vertexData[6] = a * w1 + c * h0 + tx;
		vertexData[7] = d * h0 + b * w1 + ty;
		if (this._roundPixels) {
			var resolution = settings.RESOLUTION;
			for (var i = 0; i < vertexData.length; ++i) vertexData[i] = Math.round((vertexData[i] * resolution | 0) / resolution);
		}
	};
	/**
	* Calculates worldTransform * vertices for a non texture with a trim. store it in vertexTrimmedData.
	*
	* This is used to ensure that the true width and height of a trimmed texture is respected.
	*/
	Sprite.prototype.calculateTrimmedVertices = function() {
		if (!this.vertexTrimmedData) this.vertexTrimmedData = /* @__PURE__ */ new Float32Array(8);
		else if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID) return;
		this._transformTrimmedID = this.transform._worldID;
		this._textureTrimmedID = this._texture._updateID;
		var texture = this._texture;
		var vertexData = this.vertexTrimmedData;
		var orig = texture.orig;
		var anchor = this._anchor;
		var wt = this.transform.worldTransform;
		var a = wt.a;
		var b = wt.b;
		var c = wt.c;
		var d = wt.d;
		var tx = wt.tx;
		var ty = wt.ty;
		var w1 = -anchor._x * orig.width;
		var w0 = w1 + orig.width;
		var h1 = -anchor._y * orig.height;
		var h0 = h1 + orig.height;
		vertexData[0] = a * w1 + c * h1 + tx;
		vertexData[1] = d * h1 + b * w1 + ty;
		vertexData[2] = a * w0 + c * h1 + tx;
		vertexData[3] = d * h1 + b * w0 + ty;
		vertexData[4] = a * w0 + c * h0 + tx;
		vertexData[5] = d * h0 + b * w0 + ty;
		vertexData[6] = a * w1 + c * h0 + tx;
		vertexData[7] = d * h0 + b * w1 + ty;
	};
	/**
	*
	* Renders the object using the WebGL renderer
	* @param renderer - The webgl renderer to use.
	*/
	Sprite.prototype._render = function(renderer) {
		this.calculateVertices();
		renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
		renderer.plugins[this.pluginName].render(this);
	};
	/** Updates the bounds of the sprite. */
	Sprite.prototype._calculateBounds = function() {
		var trim = this._texture.trim;
		var orig = this._texture.orig;
		if (!trim || trim.width === orig.width && trim.height === orig.height) {
			this.calculateVertices();
			this._bounds.addQuad(this.vertexData);
		} else {
			this.calculateTrimmedVertices();
			this._bounds.addQuad(this.vertexTrimmedData);
		}
	};
	/**
	* Gets the local bounds of the sprite object.
	* @param rect - Optional output rectangle.
	* @returns The bounds.
	*/
	Sprite.prototype.getLocalBounds = function(rect) {
		if (this.children.length === 0) {
			if (!this._localBounds) this._localBounds = new Bounds();
			this._localBounds.minX = this._texture.orig.width * -this._anchor._x;
			this._localBounds.minY = this._texture.orig.height * -this._anchor._y;
			this._localBounds.maxX = this._texture.orig.width * (1 - this._anchor._x);
			this._localBounds.maxY = this._texture.orig.height * (1 - this._anchor._y);
			if (!rect) {
				if (!this._localBoundsRect) this._localBoundsRect = new Rectangle();
				rect = this._localBoundsRect;
			}
			return this._localBounds.getRectangle(rect);
		}
		return _super.prototype.getLocalBounds.call(this, rect);
	};
	/**
	* Tests if a point is inside this sprite
	* @param point - the point to test
	* @returns The result of the test
	*/
	Sprite.prototype.containsPoint = function(point) {
		this.worldTransform.applyInverse(point, tempPoint);
		var width = this._texture.orig.width;
		var height = this._texture.orig.height;
		var x1 = -width * this.anchor.x;
		var y1 = 0;
		if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
			y1 = -height * this.anchor.y;
			if (tempPoint.y >= y1 && tempPoint.y < y1 + height) return true;
		}
		return false;
	};
	/**
	* Destroys this sprite and optionally its texture and children.
	* @param options - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @param [options.children=false] - if set to true, all the children will have their destroy
	*      method called as well. 'options' will be passed on to those calls.
	* @param [options.texture=false] - Should it destroy the current texture of the sprite as well
	* @param [options.baseTexture=false] - Should it destroy the base texture of the sprite as well
	*/
	Sprite.prototype.destroy = function(options) {
		_super.prototype.destroy.call(this, options);
		this._texture.off("update", this._onTextureUpdate, this);
		this._anchor = null;
		if (typeof options === "boolean" ? options : options && options.texture) {
			var destroyBaseTexture = typeof options === "boolean" ? options : options && options.baseTexture;
			this._texture.destroy(!!destroyBaseTexture);
		}
		this._texture = null;
	};
	/**
	* Helper function that creates a new sprite based on the source you provide.
	* The source can be - frame id, image url, video url, canvas element, video element, base texture
	* @param {string|PIXI.Texture|HTMLCanvasElement|HTMLVideoElement} source - Source to create texture from
	* @param {object} [options] - See {@link PIXI.BaseTexture}'s constructor for options.
	* @returns The newly created sprite
	*/
	Sprite.from = function(source, options) {
		return new Sprite(source instanceof Texture ? source : Texture.from(source, options));
	};
	Object.defineProperty(Sprite.prototype, "roundPixels", {
		get: function() {
			return this._roundPixels;
		},
		/**
		* If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
		*
		* Advantages can include sharper image quality (like text) and faster rendering on canvas.
		* The main disadvantage is movement of objects may appear less smooth.
		*
		* To set the global default, change {@link PIXI.settings.ROUND_PIXELS}.
		* @default false
		*/
		set: function(value) {
			if (this._roundPixels !== value) this._transformID = -1;
			this._roundPixels = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Sprite.prototype, "width", {
		/** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
		get: function() {
			return Math.abs(this.scale.x) * this._texture.orig.width;
		},
		set: function(value) {
			var s = sign(this.scale.x) || 1;
			this.scale.x = s * value / this._texture.orig.width;
			this._width = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Sprite.prototype, "height", {
		/** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
		get: function() {
			return Math.abs(this.scale.y) * this._texture.orig.height;
		},
		set: function(value) {
			var s = sign(this.scale.y) || 1;
			this.scale.y = s * value / this._texture.orig.height;
			this._height = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Sprite.prototype, "anchor", {
		/**
		* The anchor sets the origin point of the sprite. The default value is taken from the {@link PIXI.Texture|Texture}
		* and passed to the constructor.
		*
		* The default is `(0,0)`, this means the sprite's origin is the top left.
		*
		* Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
		*
		* Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
		*
		* If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
		* @example
		* const sprite = new PIXI.Sprite(texture);
		* sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
		*/
		get: function() {
			return this._anchor;
		},
		set: function(value) {
			this._anchor.copyFrom(value);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Sprite.prototype, "tint", {
		/**
		* The tint applied to the sprite. This is a hex value.
		*
		* A value of 0xFFFFFF will remove any tint effect.
		* @default 0xFFFFFF
		*/
		get: function() {
			return this._tint;
		},
		set: function(value) {
			this._tint = value;
			this._tintRGB = (value >> 16) + (value & 65280) + ((value & 255) << 16);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Sprite.prototype, "texture", {
		/** The texture that the sprite is using. */
		get: function() {
			return this._texture;
		},
		set: function(value) {
			if (this._texture === value) return;
			if (this._texture) this._texture.off("update", this._onTextureUpdate, this);
			this._texture = value || Texture.EMPTY;
			this._cachedTint = 16777215;
			this._textureID = -1;
			this._textureTrimmedID = -1;
			if (value) if (value.baseTexture.valid) this._onTextureUpdate();
			else value.once("update", this._onTextureUpdate, this);
		},
		enumerable: false,
		configurable: true
	});
	return Sprite;
}(Container);
//#endregion
//#region node_modules/@pixi/mixin-cache-as-bitmap/dist/esm/mixin-cache-as-bitmap.mjs
/*!
* @pixi/mixin-cache-as-bitmap - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/mixin-cache-as-bitmap is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
var _tempMatrix = new Matrix();
DisplayObject.prototype._cacheAsBitmap = false;
DisplayObject.prototype._cacheData = null;
DisplayObject.prototype._cacheAsBitmapResolution = null;
DisplayObject.prototype._cacheAsBitmapMultisample = MSAA_QUALITY.NONE;
/**
* @class
* @ignore
* @private
*/
var CacheData = function() {
	function CacheData() {
		this.textureCacheId = null;
		this.originalRender = null;
		this.originalRenderCanvas = null;
		this.originalCalculateBounds = null;
		this.originalGetLocalBounds = null;
		this.originalUpdateTransform = null;
		this.originalDestroy = null;
		this.originalMask = null;
		this.originalFilterArea = null;
		this.originalContainsPoint = null;
		this.sprite = null;
	}
	return CacheData;
}();
Object.defineProperties(DisplayObject.prototype, {
	/**
	* The resolution to use for cacheAsBitmap. By default this will use the renderer's resolution
	* but can be overriden for performance. Lower values will reduce memory usage at the expense
	* of render quality. A falsey value of `null` or `0` will default to the renderer's resolution.
	* If `cacheAsBitmap` is set to `true`, this will re-render with the new resolution.
	* @member {number} cacheAsBitmapResolution
	* @memberof PIXI.DisplayObject#
	* @default null
	*/
	cacheAsBitmapResolution: {
		get: function() {
			return this._cacheAsBitmapResolution;
		},
		set: function(resolution) {
			if (resolution === this._cacheAsBitmapResolution) return;
			this._cacheAsBitmapResolution = resolution;
			if (this.cacheAsBitmap) {
				this.cacheAsBitmap = false;
				this.cacheAsBitmap = true;
			}
		}
	},
	/**
	* The number of samples to use for cacheAsBitmap. If set to `null`, the renderer's
	* sample count is used.
	* If `cacheAsBitmap` is set to `true`, this will re-render with the new number of samples.
	* @member {number} cacheAsBitmapMultisample
	* @memberof PIXI.DisplayObject#
	* @default PIXI.MSAA_QUALITY.NONE
	*/
	cacheAsBitmapMultisample: {
		get: function() {
			return this._cacheAsBitmapMultisample;
		},
		set: function(multisample) {
			if (multisample === this._cacheAsBitmapMultisample) return;
			this._cacheAsBitmapMultisample = multisample;
			if (this.cacheAsBitmap) {
				this.cacheAsBitmap = false;
				this.cacheAsBitmap = true;
			}
		}
	},
	/**
	* Set this to true if you want this display object to be cached as a bitmap.
	* This basically takes a snap shot of the display object as it is at that moment. It can
	* provide a performance benefit for complex static displayObjects.
	* To remove simply set this property to `false`
	*
	* IMPORTANT GOTCHA - Make sure that all your textures are preloaded BEFORE setting this property to true
	* as it will take a snapshot of what is currently there. If the textures have not loaded then they will not appear.
	* @member {boolean}
	* @memberof PIXI.DisplayObject#
	*/
	cacheAsBitmap: {
		get: function() {
			return this._cacheAsBitmap;
		},
		set: function(value) {
			if (this._cacheAsBitmap === value) return;
			this._cacheAsBitmap = value;
			var data;
			if (value) {
				if (!this._cacheData) this._cacheData = new CacheData();
				data = this._cacheData;
				data.originalRender = this.render;
				data.originalRenderCanvas = this.renderCanvas;
				data.originalUpdateTransform = this.updateTransform;
				data.originalCalculateBounds = this.calculateBounds;
				data.originalGetLocalBounds = this.getLocalBounds;
				data.originalDestroy = this.destroy;
				data.originalContainsPoint = this.containsPoint;
				data.originalMask = this._mask;
				data.originalFilterArea = this.filterArea;
				this.render = this._renderCached;
				this.renderCanvas = this._renderCachedCanvas;
				this.destroy = this._cacheAsBitmapDestroy;
			} else {
				data = this._cacheData;
				if (data.sprite) this._destroyCachedDisplayObject();
				this.render = data.originalRender;
				this.renderCanvas = data.originalRenderCanvas;
				this.calculateBounds = data.originalCalculateBounds;
				this.getLocalBounds = data.originalGetLocalBounds;
				this.destroy = data.originalDestroy;
				this.updateTransform = data.originalUpdateTransform;
				this.containsPoint = data.originalContainsPoint;
				this._mask = data.originalMask;
				this.filterArea = data.originalFilterArea;
			}
		}
	}
});
/**
* Renders a cached version of the sprite with WebGL
* @private
* @method _renderCached
* @memberof PIXI.DisplayObject#
* @param {PIXI.Renderer} renderer - the WebGL renderer
*/
DisplayObject.prototype._renderCached = function _renderCached(renderer) {
	if (!this.visible || this.worldAlpha <= 0 || !this.renderable) return;
	this._initCachedDisplayObject(renderer);
	this._cacheData.sprite.transform._worldID = this.transform._worldID;
	this._cacheData.sprite.worldAlpha = this.worldAlpha;
	this._cacheData.sprite._render(renderer);
};
/**
* Prepares the WebGL renderer to cache the sprite
* @private
* @method _initCachedDisplayObject
* @memberof PIXI.DisplayObject#
* @param {PIXI.Renderer} renderer - the WebGL renderer
*/
DisplayObject.prototype._initCachedDisplayObject = function _initCachedDisplayObject(renderer) {
	var _a;
	if (this._cacheData && this._cacheData.sprite) return;
	var cacheAlpha = this.alpha;
	this.alpha = 1;
	renderer.batch.flush();
	var bounds = this.getLocalBounds(null, true).clone();
	if (this.filters && this.filters.length) {
		var padding = this.filters[0].padding;
		bounds.pad(padding);
	}
	bounds.ceil(settings.RESOLUTION);
	var cachedRenderTexture = renderer.renderTexture.current;
	var cachedSourceFrame = renderer.renderTexture.sourceFrame.clone();
	var cachedDestinationFrame = renderer.renderTexture.destinationFrame.clone();
	var cachedProjectionTransform = renderer.projection.transform;
	var renderTexture = RenderTexture.create({
		width: bounds.width,
		height: bounds.height,
		resolution: this.cacheAsBitmapResolution || renderer.resolution,
		multisample: (_a = this.cacheAsBitmapMultisample) !== null && _a !== void 0 ? _a : renderer.multisample
	});
	var textureCacheId = "cacheAsBitmap_" + uid();
	this._cacheData.textureCacheId = textureCacheId;
	BaseTexture.addToCache(renderTexture.baseTexture, textureCacheId);
	Texture.addToCache(renderTexture, textureCacheId);
	var m = this.transform.localTransform.copyTo(_tempMatrix).invert().translate(-bounds.x, -bounds.y);
	this.render = this._cacheData.originalRender;
	renderer.render(this, {
		renderTexture,
		clear: true,
		transform: m,
		skipUpdateTransform: false
	});
	renderer.framebuffer.blit();
	renderer.projection.transform = cachedProjectionTransform;
	renderer.renderTexture.bind(cachedRenderTexture, cachedSourceFrame, cachedDestinationFrame);
	this.render = this._renderCached;
	this.updateTransform = this.displayObjectUpdateTransform;
	this.calculateBounds = this._calculateCachedBounds;
	this.getLocalBounds = this._getCachedLocalBounds;
	this._mask = null;
	this.filterArea = null;
	this.alpha = cacheAlpha;
	var cachedSprite = new Sprite(renderTexture);
	cachedSprite.transform.worldTransform = this.transform.worldTransform;
	cachedSprite.anchor.x = -(bounds.x / bounds.width);
	cachedSprite.anchor.y = -(bounds.y / bounds.height);
	cachedSprite.alpha = cacheAlpha;
	cachedSprite._bounds = this._bounds;
	this._cacheData.sprite = cachedSprite;
	this.transform._parentID = -1;
	if (!this.parent) {
		this.enableTempParent();
		this.updateTransform();
		this.disableTempParent(null);
	} else this.updateTransform();
	this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};
/**
* Renders a cached version of the sprite with canvas
* @private
* @method _renderCachedCanvas
* @memberof PIXI.DisplayObject#
* @param {PIXI.CanvasRenderer} renderer - The canvas renderer
*/
DisplayObject.prototype._renderCachedCanvas = function _renderCachedCanvas(renderer) {
	if (!this.visible || this.worldAlpha <= 0 || !this.renderable) return;
	this._initCachedDisplayObjectCanvas(renderer);
	this._cacheData.sprite.worldAlpha = this.worldAlpha;
	this._cacheData.sprite._renderCanvas(renderer);
};
/**
* Prepares the Canvas renderer to cache the sprite
* @private
* @method _initCachedDisplayObjectCanvas
* @memberof PIXI.DisplayObject#
* @param {PIXI.CanvasRenderer} renderer - The canvas renderer
*/
DisplayObject.prototype._initCachedDisplayObjectCanvas = function _initCachedDisplayObjectCanvas(renderer) {
	if (this._cacheData && this._cacheData.sprite) return;
	var bounds = this.getLocalBounds(null, true);
	var cacheAlpha = this.alpha;
	this.alpha = 1;
	var cachedRenderTarget = renderer.context;
	var cachedProjectionTransform = renderer._projTransform;
	bounds.ceil(settings.RESOLUTION);
	var renderTexture = RenderTexture.create({
		width: bounds.width,
		height: bounds.height
	});
	var textureCacheId = "cacheAsBitmap_" + uid();
	this._cacheData.textureCacheId = textureCacheId;
	BaseTexture.addToCache(renderTexture.baseTexture, textureCacheId);
	Texture.addToCache(renderTexture, textureCacheId);
	var m = _tempMatrix;
	this.transform.localTransform.copyTo(m);
	m.invert();
	m.tx -= bounds.x;
	m.ty -= bounds.y;
	this.renderCanvas = this._cacheData.originalRenderCanvas;
	renderer.render(this, {
		renderTexture,
		clear: true,
		transform: m,
		skipUpdateTransform: false
	});
	renderer.context = cachedRenderTarget;
	renderer._projTransform = cachedProjectionTransform;
	this.renderCanvas = this._renderCachedCanvas;
	this.updateTransform = this.displayObjectUpdateTransform;
	this.calculateBounds = this._calculateCachedBounds;
	this.getLocalBounds = this._getCachedLocalBounds;
	this._mask = null;
	this.filterArea = null;
	this.alpha = cacheAlpha;
	var cachedSprite = new Sprite(renderTexture);
	cachedSprite.transform.worldTransform = this.transform.worldTransform;
	cachedSprite.anchor.x = -(bounds.x / bounds.width);
	cachedSprite.anchor.y = -(bounds.y / bounds.height);
	cachedSprite.alpha = cacheAlpha;
	cachedSprite._bounds = this._bounds;
	this._cacheData.sprite = cachedSprite;
	this.transform._parentID = -1;
	if (!this.parent) {
		this.parent = renderer._tempDisplayObjectParent;
		this.updateTransform();
		this.parent = null;
	} else this.updateTransform();
	this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};
/**
* Calculates the bounds of the cached sprite
* @private
* @method
*/
DisplayObject.prototype._calculateCachedBounds = function _calculateCachedBounds() {
	this._bounds.clear();
	this._cacheData.sprite.transform._worldID = this.transform._worldID;
	this._cacheData.sprite._calculateBounds();
	this._bounds.updateID = this._boundsID;
};
/**
* Gets the bounds of the cached sprite.
* @private
* @method
* @returns {Rectangle} The local bounds.
*/
DisplayObject.prototype._getCachedLocalBounds = function _getCachedLocalBounds() {
	return this._cacheData.sprite.getLocalBounds(null);
};
/**
* Destroys the cached sprite.
* @private
* @method
*/
DisplayObject.prototype._destroyCachedDisplayObject = function _destroyCachedDisplayObject() {
	this._cacheData.sprite._texture.destroy(true);
	this._cacheData.sprite = null;
	BaseTexture.removeFromCache(this._cacheData.textureCacheId);
	Texture.removeFromCache(this._cacheData.textureCacheId);
	this._cacheData.textureCacheId = null;
};
/**
* Destroys the cached object.
* @private
* @method
* @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
*  have been set to that value.
*  Used when destroying containers, see the Container.destroy method.
*/
DisplayObject.prototype._cacheAsBitmapDestroy = function _cacheAsBitmapDestroy(options) {
	this.cacheAsBitmap = false;
	this.destroy(options);
};
//#endregion
export { Sprite as t };
