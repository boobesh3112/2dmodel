import { $t as deprecation, Gt as Rectangle, Pt as ExtensionType, ct as Texture, en as getResolutionOfUrl, m as BaseTexture, pn as url } from "./@pixi/accessibility+[...].mjs";
import { h as LoaderResource } from "./@pixi/compressed-textures+[...].mjs";
//#region node_modules/@pixi/spritesheet/dist/esm/spritesheet.mjs
/*!
* @pixi/spritesheet - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/spritesheet is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Utility class for maintaining reference to a collection
* of Textures on a single Spritesheet.
*
* To access a sprite sheet from your code you may pass its JSON data file to Pixi's loader:
*
* ```js
* PIXI.Loader.shared.add("images/spritesheet.json").load(setup);
*
* function setup() {
*   let sheet = PIXI.Loader.shared.resources["images/spritesheet.json"].spritesheet;
*   ...
* }
* ```
*
* Alternately, you may circumvent the loader by instantiating the Spritesheet directly:
* ```js
* const sheet = new PIXI.Spritesheet(texture, spritesheetData);
* await sheet.parse();
* console.log('Spritesheet ready to use!');
* ```
*
* With the `sheet.textures` you can create Sprite objects,`sheet.animations` can be used to create an AnimatedSprite.
*
* Sprite sheets can be packed using tools like {@link https://codeandweb.com/texturepacker|TexturePacker},
* {@link https://renderhjs.net/shoebox/|Shoebox} or {@link https://github.com/krzysztof-o/spritesheet.js|Spritesheet.js}.
* Default anchor points (see {@link PIXI.Texture#defaultAnchor}) and grouping of animation sprites are currently only
* supported by TexturePacker.
* @memberof PIXI
*/
var Spritesheet = function() {
	/**
	* @param texture - Reference to the source BaseTexture object.
	* @param {object} data - Spritesheet image data.
	* @param resolutionFilename - The filename to consider when determining
	*        the resolution of the spritesheet. If not provided, the imageUrl will
	*        be used on the BaseTexture.
	*/
	function Spritesheet(texture, data, resolutionFilename) {
		if (resolutionFilename === void 0) resolutionFilename = null;
		/** For multi-packed spritesheets, this contains a reference to all the other spritesheets it depends on. */
		this.linkedSheets = [];
		this._texture = texture instanceof Texture ? texture : null;
		this.baseTexture = texture instanceof BaseTexture ? texture : this._texture.baseTexture;
		this.textures = {};
		this.animations = {};
		this.data = data;
		var resource = this.baseTexture.resource;
		this.resolution = this._updateResolution(resolutionFilename || (resource ? resource.url : null));
		this._frames = this.data.frames;
		this._frameKeys = Object.keys(this._frames);
		this._batchIndex = 0;
		this._callback = null;
	}
	/**
	* Generate the resolution from the filename or fallback
	* to the meta.scale field of the JSON data.
	* @param resolutionFilename - The filename to use for resolving
	*        the default resolution.
	* @returns Resolution to use for spritesheet.
	*/
	Spritesheet.prototype._updateResolution = function(resolutionFilename) {
		if (resolutionFilename === void 0) resolutionFilename = null;
		var scale = this.data.meta.scale;
		var resolution = getResolutionOfUrl(resolutionFilename, null);
		if (resolution === null) resolution = scale !== void 0 ? parseFloat(scale) : 1;
		if (resolution !== 1) this.baseTexture.setResolution(resolution);
		return resolution;
	};
	/** @ignore */
	Spritesheet.prototype.parse = function(callback) {
		var _this = this;
		if (callback) deprecation("6.5.0", "Spritesheet.parse callback is deprecated, use the return Promise instead.");
		return new Promise(function(resolve) {
			_this._callback = function(textures) {
				callback === null || callback === void 0 || callback(textures);
				resolve(textures);
			};
			_this._batchIndex = 0;
			if (_this._frameKeys.length <= Spritesheet.BATCH_SIZE) {
				_this._processFrames(0);
				_this._processAnimations();
				_this._parseComplete();
			} else _this._nextBatch();
		});
	};
	/**
	* Process a batch of frames
	* @param initialFrameIndex - The index of frame to start.
	*/
	Spritesheet.prototype._processFrames = function(initialFrameIndex) {
		var frameIndex = initialFrameIndex;
		var maxFrames = Spritesheet.BATCH_SIZE;
		while (frameIndex - initialFrameIndex < maxFrames && frameIndex < this._frameKeys.length) {
			var i = this._frameKeys[frameIndex];
			var data = this._frames[i];
			var rect = data.frame;
			if (rect) {
				var frame = null;
				var trim = null;
				var sourceSize = data.trimmed !== false && data.sourceSize ? data.sourceSize : data.frame;
				var orig = new Rectangle(0, 0, Math.floor(sourceSize.w) / this.resolution, Math.floor(sourceSize.h) / this.resolution);
				if (data.rotated) frame = new Rectangle(Math.floor(rect.x) / this.resolution, Math.floor(rect.y) / this.resolution, Math.floor(rect.h) / this.resolution, Math.floor(rect.w) / this.resolution);
				else frame = new Rectangle(Math.floor(rect.x) / this.resolution, Math.floor(rect.y) / this.resolution, Math.floor(rect.w) / this.resolution, Math.floor(rect.h) / this.resolution);
				if (data.trimmed !== false && data.spriteSourceSize) trim = new Rectangle(Math.floor(data.spriteSourceSize.x) / this.resolution, Math.floor(data.spriteSourceSize.y) / this.resolution, Math.floor(rect.w) / this.resolution, Math.floor(rect.h) / this.resolution);
				this.textures[i] = new Texture(this.baseTexture, frame, orig, trim, data.rotated ? 2 : 0, data.anchor);
				Texture.addToCache(this.textures[i], i);
			}
			frameIndex++;
		}
	};
	/** Parse animations config. */
	Spritesheet.prototype._processAnimations = function() {
		var animations = this.data.animations || {};
		for (var animName in animations) {
			this.animations[animName] = [];
			for (var i = 0; i < animations[animName].length; i++) {
				var frameName = animations[animName][i];
				this.animations[animName].push(this.textures[frameName]);
			}
		}
	};
	/** The parse has completed. */
	Spritesheet.prototype._parseComplete = function() {
		var callback = this._callback;
		this._callback = null;
		this._batchIndex = 0;
		callback.call(this, this.textures);
	};
	/** Begin the next batch of textures. */
	Spritesheet.prototype._nextBatch = function() {
		var _this = this;
		this._processFrames(this._batchIndex * Spritesheet.BATCH_SIZE);
		this._batchIndex++;
		setTimeout(function() {
			if (_this._batchIndex * Spritesheet.BATCH_SIZE < _this._frameKeys.length) _this._nextBatch();
			else {
				_this._processAnimations();
				_this._parseComplete();
			}
		}, 0);
	};
	/**
	* Destroy Spritesheet and don't use after this.
	* @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
	*/
	Spritesheet.prototype.destroy = function(destroyBase) {
		var _a;
		if (destroyBase === void 0) destroyBase = false;
		for (var i in this.textures) this.textures[i].destroy();
		this._frames = null;
		this._frameKeys = null;
		this.data = null;
		this.textures = null;
		if (destroyBase) {
			(_a = this._texture) === null || _a === void 0 || _a.destroy();
			this.baseTexture.destroy();
		}
		this._texture = null;
		this.baseTexture = null;
		this.linkedSheets = [];
	};
	/** The maximum number of Textures to build per process. */
	Spritesheet.BATCH_SIZE = 1e3;
	return Spritesheet;
}();
/**
* Reference to Spritesheet object created.
* @member {PIXI.Spritesheet} spritesheet
* @memberof PIXI.LoaderResource
* @instance
*/
/**
* Dictionary of textures from Spritesheet.
* @member {Object<string, PIXI.Texture>} textures
* @memberof PIXI.LoaderResource
* @instance
*/
/**
* {@link PIXI.Loader} middleware for loading texture atlases that have been created with
* TexturePacker or similar JSON-based spritesheet.
*
* This middleware automatically generates Texture resources.
*
* If you're using Webpack or other bundlers and plan on bundling the atlas' JSON,
* use the {@link PIXI.Spritesheet} class to directly parse the JSON.
*
* The Loader's image Resource name is automatically appended with `"_image"`.
* If a Resource with this name is already loaded, the Loader will skip parsing the
* Spritesheet. The code below will generate an internal Loader Resource called `"myatlas_image"`.
* @example
* loader.add('myatlas', 'path/to/myatlas.json');
* loader.load(() => {
*   loader.resources.myatlas; // atlas JSON resource
*   loader.resources.myatlas_image; // atlas Image resource
* });
* @memberof PIXI
*/
var SpritesheetLoader = function() {
	function SpritesheetLoader() {}
	/**
	* Called after a resource is loaded.
	* @see PIXI.Loader.loaderMiddleware
	* @param resource
	* @param next
	*/
	SpritesheetLoader.use = function(resource, next) {
		var _a, _b;
		var loader = this;
		var imageResourceName = resource.name + "_image";
		if (!resource.data || resource.type !== LoaderResource.TYPE.JSON || !resource.data.frames || loader.resources[imageResourceName]) {
			next();
			return;
		}
		var multiPacks = (_b = (_a = resource.data) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.related_multi_packs;
		if (Array.isArray(multiPacks)) {
			var _loop_1 = function(item) {
				if (typeof item !== "string") return "continue";
				var itemName = item.replace(".json", "");
				var itemUrl = url.resolve(resource.url.replace(loader.baseUrl, ""), item);
				if (loader.resources[itemName] || Object.values(loader.resources).some(function(r) {
					return url.format(url.parse(r.url)) === itemUrl;
				})) return "continue";
				var options = {
					crossOrigin: resource.crossOrigin,
					loadType: LoaderResource.LOAD_TYPE.XHR,
					xhrType: LoaderResource.XHR_RESPONSE_TYPE.JSON,
					parentResource: resource,
					metadata: resource.metadata
				};
				loader.add(itemName, itemUrl, options);
			};
			for (var _i = 0, multiPacks_1 = multiPacks; _i < multiPacks_1.length; _i++) {
				var item = multiPacks_1[_i];
				_loop_1(item);
			}
		}
		var loadOptions = {
			crossOrigin: resource.crossOrigin,
			metadata: resource.metadata.imageMetadata,
			parentResource: resource
		};
		var resourcePath = SpritesheetLoader.getResourcePath(resource, loader.baseUrl);
		loader.add(imageResourceName, resourcePath, loadOptions, function onImageLoad(res) {
			if (res.error) {
				next(res.error);
				return;
			}
			var spritesheet = new Spritesheet(res.texture, resource.data, resource.url);
			spritesheet.parse().then(function() {
				resource.spritesheet = spritesheet;
				resource.textures = spritesheet.textures;
				next();
			});
		});
	};
	/**
	* Get the spritesheets root path
	* @param resource - Resource to check path
	* @param baseUrl - Base root url
	*/
	SpritesheetLoader.getResourcePath = function(resource, baseUrl) {
		if (resource.isDataUrl) return resource.data.meta.image;
		return url.resolve(resource.url.replace(baseUrl, ""), resource.data.meta.image);
	};
	/** @ignore */
	SpritesheetLoader.extension = ExtensionType.Loader;
	return SpritesheetLoader;
}();
//#endregion
export { SpritesheetLoader as n, Spritesheet as t };
