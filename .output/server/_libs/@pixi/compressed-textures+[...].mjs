import { $t as deprecation, C as BufferResource, En as FORMATS, Ft as extensions, In as TYPES, Pt as ExtensionType, _n as settings, ct as Texture, gt as ViewableBuffer, kn as MIPMAP_MODES, m as BaseTexture, pn as url, vn as ALPHA_MODES } from "./accessibility+[...].mjs";
//#region node_modules/@pixi/loaders/dist/esm/loaders.mjs
/*!
* @pixi/loaders - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/loaders is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* @memberof PIXI
*/
var SignalBinding = function() {
	/**
	* SignalBinding constructor.
	* @constructs SignalBinding
	* @param {Function} fn - Event handler to be called.
	* @param {boolean} [once=false] - Should this listener be removed after dispatch
	* @param {object} [thisArg] - The context of the callback function.
	* @api private
	*/
	function SignalBinding(fn, once, thisArg) {
		if (once === void 0) once = false;
		this._fn = fn;
		this._once = once;
		this._thisArg = thisArg;
		this._next = this._prev = this._owner = null;
	}
	SignalBinding.prototype.detach = function() {
		if (this._owner === null) return false;
		this._owner.detach(this);
		return true;
	};
	return SignalBinding;
}();
/**
* @param self
* @param node
* @private
*/
function _addSignalBinding(self, node) {
	if (!self._head) {
		self._head = node;
		self._tail = node;
	} else {
		self._tail._next = node;
		node._prev = self._tail;
		self._tail = node;
	}
	node._owner = self;
	return node;
}
/**
* @memberof PIXI
*/
var Signal = function() {
	/**
	* MiniSignal constructor.
	* @example
	* let mySignal = new Signal();
	* let binding = mySignal.add(onSignal);
	* mySignal.dispatch('foo', 'bar');
	* mySignal.detach(binding);
	*/
	function Signal() {
		this._head = this._tail = void 0;
	}
	/**
	* Return an array of attached SignalBinding.
	* @param {boolean} [exists=false] - We only need to know if there are handlers.
	* @returns {PIXI.SignalBinding[] | boolean} Array of attached SignalBinding or Boolean if called with exists = true
	* @api public
	*/
	Signal.prototype.handlers = function(exists) {
		if (exists === void 0) exists = false;
		var node = this._head;
		if (exists) return !!node;
		var ee = [];
		while (node) {
			ee.push(node);
			node = node._next;
		}
		return ee;
	};
	/**
	* Return true if node is a SignalBinding attached to this MiniSignal
	* @param {PIXI.SignalBinding} node - Node to check.
	* @returns {boolean} True if node is attache to mini-signal
	*/
	Signal.prototype.has = function(node) {
		if (!(node instanceof SignalBinding)) throw new Error("MiniSignal#has(): First arg must be a SignalBinding object.");
		return node._owner === this;
	};
	/**
	* Dispaches a signal to all registered listeners.
	* @param {...any} args
	* @returns {boolean} Indication if we've emitted an event.
	*/
	Signal.prototype.dispatch = function() {
		var arguments$1 = arguments;
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments$1[_i];
		var node = this._head;
		if (!node) return false;
		while (node) {
			if (node._once) this.detach(node);
			node._fn.apply(node._thisArg, args);
			node = node._next;
		}
		return true;
	};
	/**
	* Register a new listener.
	* @param {Function} fn - Callback function.
	* @param {object} [thisArg] - The context of the callback function.
	* @returns {PIXI.SignalBinding} The SignalBinding node that was added.
	*/
	Signal.prototype.add = function(fn, thisArg) {
		if (thisArg === void 0) thisArg = null;
		if (typeof fn !== "function") throw new Error("MiniSignal#add(): First arg must be a Function.");
		return _addSignalBinding(this, new SignalBinding(fn, false, thisArg));
	};
	/**
	* Register a new listener that will be executed only once.
	* @param {Function} fn - Callback function.
	* @param {object} [thisArg] - The context of the callback function.
	* @returns {PIXI.SignalBinding} The SignalBinding node that was added.
	*/
	Signal.prototype.once = function(fn, thisArg) {
		if (thisArg === void 0) thisArg = null;
		if (typeof fn !== "function") throw new Error("MiniSignal#once(): First arg must be a Function.");
		return _addSignalBinding(this, new SignalBinding(fn, true, thisArg));
	};
	/**
	* Remove binding object.
	* @param {PIXI.SignalBinding} node - The binding node that will be removed.
	* @returns {Signal} The instance on which this method was called.
	@api public */
	Signal.prototype.detach = function(node) {
		if (!(node instanceof SignalBinding)) throw new Error("MiniSignal#detach(): First arg must be a SignalBinding object.");
		if (node._owner !== this) return this;
		if (node._prev) node._prev._next = node._next;
		if (node._next) node._next._prev = node._prev;
		if (node === this._head) {
			this._head = node._next;
			if (node._next === null) this._tail = null;
		} else if (node === this._tail) {
			this._tail = node._prev;
			this._tail._next = null;
		}
		node._owner = null;
		return this;
	};
	/**
	* Detach all listeners.
	* @returns {Signal} The instance on which this method was called.
	*/
	Signal.prototype.detachAll = function() {
		var node = this._head;
		if (!node) return this;
		this._head = this._tail = null;
		while (node) {
			node._owner = null;
			node = node._next;
		}
		return this;
	};
	return Signal;
}();
/**
* function from npm package `parseUri`, converted to TS to avoid leftpad incident
* @param {string} str
* @param [opts] - options
* @param {boolean} [opts.strictMode] - type of parser
*/
function parseUri(str, opts) {
	opts = opts || {};
	var o = {
		key: [
			"source",
			"protocol",
			"authority",
			"userInfo",
			"user",
			"password",
			"host",
			"port",
			"relative",
			"path",
			"directory",
			"file",
			"query",
			"anchor"
		],
		q: {
			name: "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser: {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	};
	var m = o.parser[opts.strictMode ? "strict" : "loose"].exec(str);
	var uri = {};
	var i = 14;
	while (i--) uri[o.key[i]] = m[i] || "";
	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function(_t0, t1, t2) {
		if (t1) uri[o.q.name][t1] = t2;
	});
	return uri;
}
var useXdr;
var tempAnchor = null;
var STATUS_NONE = 0;
var STATUS_OK = 200;
var STATUS_EMPTY = 204;
var STATUS_IE_BUG_EMPTY = 1223;
var STATUS_TYPE_OK = 2;
function _noop$1() {}
/**
* Quick helper to set a value on one of the extension maps. Ensures there is no
* dot at the start of the extension.
* @ignore
* @param map - The map to set on.
* @param extname - The extension (or key) to set.
* @param val - The value to set.
*/
function setExtMap(map, extname, val) {
	if (extname && extname.indexOf(".") === 0) extname = extname.substring(1);
	if (!extname) return;
	map[extname] = val;
}
/**
* Quick helper to get string xhr type.
* @ignore
* @param xhr - The request to check.
* @returns The type.
*/
function reqType(xhr) {
	return xhr.toString().replace("object ", "");
}
/**
* Manages the state and loading of a resource and all child resources.
*
* Can be extended in `GlobalMixins.LoaderResource`.
* @memberof PIXI
*/
var LoaderResource = function() {
	/**
	* @param {string} name - The name of the resource to load.
	* @param {string|string[]} url - The url for this resource, for audio/video loads you can pass
	*      an array of sources.
	* @param {object} [options] - The options for the load.
	* @param {string|boolean} [options.crossOrigin] - Is this request cross-origin? Default is to
	*      determine automatically.
	* @param {number} [options.timeout=0] - A timeout in milliseconds for the load. If the load takes
	*      longer than this time it is cancelled and the load is considered a failure. If this value is
	*      set to `0` then there is no explicit timeout.
	* @param {PIXI.LoaderResource.LOAD_TYPE} [options.loadType=LOAD_TYPE.XHR] - How should this resource
	*      be loaded?
	* @param {PIXI.LoaderResource.XHR_RESPONSE_TYPE} [options.xhrType=XHR_RESPONSE_TYPE.DEFAULT] - How
	*      should the data being loaded be interpreted when using XHR?
	* @param {PIXI.LoaderResource.IMetadata} [options.metadata] - Extra configuration for middleware
	*      and the Resource object.
	*/
	function LoaderResource(name, url, options) {
		/**
		* The `dequeue` method that will be used a storage place for the async queue dequeue method
		* used privately by the loader.
		* @private
		* @member {Function}
		*/
		this._dequeue = _noop$1;
		/**
		* Used a storage place for the on load binding used privately by the loader.
		* @private
		* @member {Function}
		*/
		this._onLoadBinding = null;
		/**
		* The timer for element loads to check if they timeout.
		* @private
		*/
		this._elementTimer = 0;
		/**
		* The `complete` function bound to this resource's context.
		* @private
		* @type {Function}
		*/
		this._boundComplete = null;
		/**
		* The `_onError` function bound to this resource's context.
		* @private
		* @type {Function}
		*/
		this._boundOnError = null;
		/**
		* The `_onProgress` function bound to this resource's context.
		* @private
		* @type {Function}
		*/
		this._boundOnProgress = null;
		/**
		* The `_onTimeout` function bound to this resource's context.
		* @private
		* @type {Function}
		*/
		this._boundOnTimeout = null;
		this._boundXhrOnError = null;
		this._boundXhrOnTimeout = null;
		this._boundXhrOnAbort = null;
		this._boundXhrOnLoad = null;
		if (typeof name !== "string" || typeof url !== "string") throw new Error("Both name and url are required for constructing a resource.");
		options = options || {};
		this._flags = 0;
		this._setFlag(LoaderResource.STATUS_FLAGS.DATA_URL, url.indexOf("data:") === 0);
		this.name = name;
		this.url = url;
		this.extension = this._getExtension();
		this.data = null;
		this.crossOrigin = options.crossOrigin === true ? "anonymous" : options.crossOrigin;
		this.timeout = options.timeout || 0;
		this.loadType = options.loadType || this._determineLoadType();
		this.xhrType = options.xhrType;
		this.metadata = options.metadata || {};
		this.error = null;
		this.xhr = null;
		this.children = [];
		this.type = LoaderResource.TYPE.UNKNOWN;
		this.progressChunk = 0;
		this._dequeue = _noop$1;
		this._onLoadBinding = null;
		this._elementTimer = 0;
		this._boundComplete = this.complete.bind(this);
		this._boundOnError = this._onError.bind(this);
		this._boundOnProgress = this._onProgress.bind(this);
		this._boundOnTimeout = this._onTimeout.bind(this);
		this._boundXhrOnError = this._xhrOnError.bind(this);
		this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this);
		this._boundXhrOnAbort = this._xhrOnAbort.bind(this);
		this._boundXhrOnLoad = this._xhrOnLoad.bind(this);
		this.onStart = new Signal();
		this.onProgress = new Signal();
		this.onComplete = new Signal();
		this.onAfterMiddleware = new Signal();
	}
	/**
	* Sets the load type to be used for a specific extension.
	* @static
	* @param {string} extname - The extension to set the type for, e.g. "png" or "fnt"
	* @param {PIXI.LoaderResource.LOAD_TYPE} loadType - The load type to set it to.
	*/
	LoaderResource.setExtensionLoadType = function(extname, loadType) {
		setExtMap(LoaderResource._loadTypeMap, extname, loadType);
	};
	/**
	* Sets the load type to be used for a specific extension.
	* @static
	* @param {string} extname - The extension to set the type for, e.g. "png" or "fnt"
	* @param {PIXI.LoaderResource.XHR_RESPONSE_TYPE} xhrType - The xhr type to set it to.
	*/
	LoaderResource.setExtensionXhrType = function(extname, xhrType) {
		setExtMap(LoaderResource._xhrTypeMap, extname, xhrType);
	};
	Object.defineProperty(LoaderResource.prototype, "isDataUrl", {
		/**
		* When the resource starts to load.
		* @memberof PIXI.LoaderResource
		* @callback OnStartSignal
		* @param {PIXI.Resource} resource - The resource that the event happened on.
		*/
		/**
		* When the resource reports loading progress.
		* @memberof PIXI.LoaderResource
		* @callback OnProgressSignal
		* @param {PIXI.Resource} resource - The resource that the event happened on.
		* @param {number} percentage - The progress of the load in the range [0, 1].
		*/
		/**
		* When the resource finishes loading.
		* @memberof PIXI.LoaderResource
		* @callback OnCompleteSignal
		* @param {PIXI.Resource} resource - The resource that the event happened on.
		*/
		/**
		* @memberof PIXI.LoaderResource
		* @typedef {object} IMetadata
		* @property {HTMLImageElement|HTMLAudioElement|HTMLVideoElement} [loadElement=null] - The
		*      element to use for loading, instead of creating one.
		* @property {boolean} [skipSource=false] - Skips adding source(s) to the load element. This
		*      is useful if you want to pass in a `loadElement` that you already added load sources to.
		* @property {string|string[]} [mimeType] - The mime type to use for the source element
		*      of a video/audio elment. If the urls are an array, you can pass this as an array as well
		*      where each index is the mime type to use for the corresponding url index.
		*/
		/**
		* Stores whether or not this url is a data url.
		* @readonly
		* @member {boolean}
		*/
		get: function() {
			return this._hasFlag(LoaderResource.STATUS_FLAGS.DATA_URL);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(LoaderResource.prototype, "isComplete", {
		/**
		* Describes if this resource has finished loading. Is true when the resource has completely
		* loaded.
		* @readonly
		* @member {boolean}
		*/
		get: function() {
			return this._hasFlag(LoaderResource.STATUS_FLAGS.COMPLETE);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(LoaderResource.prototype, "isLoading", {
		/**
		* Describes if this resource is currently loading. Is true when the resource starts loading,
		* and is false again when complete.
		* @readonly
		* @member {boolean}
		*/
		get: function() {
			return this._hasFlag(LoaderResource.STATUS_FLAGS.LOADING);
		},
		enumerable: false,
		configurable: true
	});
	/** Marks the resource as complete. */
	LoaderResource.prototype.complete = function() {
		this._clearEvents();
		this._finish();
	};
	/**
	* Aborts the loading of this resource, with an optional message.
	* @param {string} message - The message to use for the error
	*/
	LoaderResource.prototype.abort = function(message) {
		if (this.error) return;
		this.error = new Error(message);
		this._clearEvents();
		if (this.xhr) this.xhr.abort();
		else if (this.xdr) this.xdr.abort();
		else if (this.data) if (this.data.src) this.data.src = LoaderResource.EMPTY_GIF;
		else while (this.data.firstChild) this.data.removeChild(this.data.firstChild);
		this._finish();
	};
	/**
	* Kicks off loading of this resource. This method is asynchronous.
	* @param {PIXI.LoaderResource.OnCompleteSignal} [cb] - Optional callback to call once the resource is loaded.
	*/
	LoaderResource.prototype.load = function(cb) {
		var _this = this;
		if (this.isLoading) return;
		if (this.isComplete) {
			if (cb) setTimeout(function() {
				return cb(_this);
			}, 1);
			return;
		} else if (cb) this.onComplete.once(cb);
		this._setFlag(LoaderResource.STATUS_FLAGS.LOADING, true);
		this.onStart.dispatch(this);
		if (this.crossOrigin === false || typeof this.crossOrigin !== "string") this.crossOrigin = this._determineCrossOrigin(this.url);
		switch (this.loadType) {
			case LoaderResource.LOAD_TYPE.IMAGE:
				this.type = LoaderResource.TYPE.IMAGE;
				this._loadElement("image");
				break;
			case LoaderResource.LOAD_TYPE.AUDIO:
				this.type = LoaderResource.TYPE.AUDIO;
				this._loadSourceElement("audio");
				break;
			case LoaderResource.LOAD_TYPE.VIDEO:
				this.type = LoaderResource.TYPE.VIDEO;
				this._loadSourceElement("video");
				break;
			case LoaderResource.LOAD_TYPE.XHR:
			default:
				if (typeof useXdr === "undefined") useXdr = !!(globalThis.XDomainRequest && !("withCredentials" in new XMLHttpRequest()));
				if (useXdr && this.crossOrigin) this._loadXdr();
				else this._loadXhr();
				break;
		}
	};
	/**
	* Checks if the flag is set.
	* @param flag - The flag to check.
	* @returns True if the flag is set.
	*/
	LoaderResource.prototype._hasFlag = function(flag) {
		return (this._flags & flag) !== 0;
	};
	/**
	* (Un)Sets the flag.
	* @param flag - The flag to (un)set.
	* @param value - Whether to set or (un)set the flag.
	*/
	LoaderResource.prototype._setFlag = function(flag, value) {
		this._flags = value ? this._flags | flag : this._flags & ~flag;
	};
	/** Clears all the events from the underlying loading source. */
	LoaderResource.prototype._clearEvents = function() {
		clearTimeout(this._elementTimer);
		if (this.data && this.data.removeEventListener) {
			this.data.removeEventListener("error", this._boundOnError, false);
			this.data.removeEventListener("load", this._boundComplete, false);
			this.data.removeEventListener("progress", this._boundOnProgress, false);
			this.data.removeEventListener("canplaythrough", this._boundComplete, false);
		}
		if (this.xhr) if (this.xhr.removeEventListener) {
			this.xhr.removeEventListener("error", this._boundXhrOnError, false);
			this.xhr.removeEventListener("timeout", this._boundXhrOnTimeout, false);
			this.xhr.removeEventListener("abort", this._boundXhrOnAbort, false);
			this.xhr.removeEventListener("progress", this._boundOnProgress, false);
			this.xhr.removeEventListener("load", this._boundXhrOnLoad, false);
		} else {
			this.xhr.onerror = null;
			this.xhr.ontimeout = null;
			this.xhr.onprogress = null;
			this.xhr.onload = null;
		}
	};
	/** Finalizes the load. */
	LoaderResource.prototype._finish = function() {
		if (this.isComplete) throw new Error("Complete called again for an already completed resource.");
		this._setFlag(LoaderResource.STATUS_FLAGS.COMPLETE, true);
		this._setFlag(LoaderResource.STATUS_FLAGS.LOADING, false);
		this.onComplete.dispatch(this);
	};
	/**
	* Loads this resources using an element that has a single source,
	* like an HTMLImageElement.
	* @private
	* @param type - The type of element to use.
	*/
	LoaderResource.prototype._loadElement = function(type) {
		if (this.metadata.loadElement) this.data = this.metadata.loadElement;
		else if (type === "image" && typeof globalThis.Image !== "undefined") this.data = new Image();
		else this.data = document.createElement(type);
		if (this.crossOrigin) this.data.crossOrigin = this.crossOrigin;
		if (!this.metadata.skipSource) this.data.src = this.url;
		this.data.addEventListener("error", this._boundOnError, false);
		this.data.addEventListener("load", this._boundComplete, false);
		this.data.addEventListener("progress", this._boundOnProgress, false);
		if (this.timeout) this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout);
	};
	/**
	* Loads this resources using an element that has multiple sources,
	* like an HTMLAudioElement or HTMLVideoElement.
	* @param type - The type of element to use.
	*/
	LoaderResource.prototype._loadSourceElement = function(type) {
		if (this.metadata.loadElement) this.data = this.metadata.loadElement;
		else if (type === "audio" && typeof globalThis.Audio !== "undefined") this.data = new Audio();
		else this.data = document.createElement(type);
		if (this.data === null) {
			this.abort("Unsupported element: " + type);
			return;
		}
		if (this.crossOrigin) this.data.crossOrigin = this.crossOrigin;
		if (!this.metadata.skipSource) if (navigator.isCocoonJS) this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
		else if (Array.isArray(this.url)) {
			var mimeTypes = this.metadata.mimeType;
			for (var i = 0; i < this.url.length; ++i) this.data.appendChild(this._createSource(type, this.url[i], Array.isArray(mimeTypes) ? mimeTypes[i] : mimeTypes));
		} else {
			var mimeTypes = this.metadata.mimeType;
			this.data.appendChild(this._createSource(type, this.url, Array.isArray(mimeTypes) ? mimeTypes[0] : mimeTypes));
		}
		this.data.addEventListener("error", this._boundOnError, false);
		this.data.addEventListener("load", this._boundComplete, false);
		this.data.addEventListener("progress", this._boundOnProgress, false);
		this.data.addEventListener("canplaythrough", this._boundComplete, false);
		this.data.load();
		if (this.timeout) this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout);
	};
	/** Loads this resources using an XMLHttpRequest. */
	LoaderResource.prototype._loadXhr = function() {
		if (typeof this.xhrType !== "string") this.xhrType = this._determineXhrType();
		var xhr = this.xhr = new XMLHttpRequest();
		if (this.crossOrigin === "use-credentials") xhr.withCredentials = true;
		xhr.open("GET", this.url, true);
		xhr.timeout = this.timeout;
		if (this.xhrType === LoaderResource.XHR_RESPONSE_TYPE.JSON || this.xhrType === LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT) xhr.responseType = LoaderResource.XHR_RESPONSE_TYPE.TEXT;
		else xhr.responseType = this.xhrType;
		xhr.addEventListener("error", this._boundXhrOnError, false);
		xhr.addEventListener("timeout", this._boundXhrOnTimeout, false);
		xhr.addEventListener("abort", this._boundXhrOnAbort, false);
		xhr.addEventListener("progress", this._boundOnProgress, false);
		xhr.addEventListener("load", this._boundXhrOnLoad, false);
		xhr.send();
	};
	/** Loads this resources using an XDomainRequest. This is here because we need to support IE9 (gross). */
	LoaderResource.prototype._loadXdr = function() {
		if (typeof this.xhrType !== "string") this.xhrType = this._determineXhrType();
		var xdr = this.xhr = new globalThis.XDomainRequest();
		xdr.timeout = this.timeout || 5e3;
		xdr.onerror = this._boundXhrOnError;
		xdr.ontimeout = this._boundXhrOnTimeout;
		xdr.onprogress = this._boundOnProgress;
		xdr.onload = this._boundXhrOnLoad;
		xdr.open("GET", this.url, true);
		setTimeout(function() {
			return xdr.send();
		}, 1);
	};
	/**
	* Creates a source used in loading via an element.
	* @param type - The element type (video or audio).
	* @param url - The source URL to load from.
	* @param [mime] - The mime type of the video
	* @returns The source element.
	*/
	LoaderResource.prototype._createSource = function(type, url, mime) {
		if (!mime) mime = type + "/" + this._getExtension(url);
		var source = document.createElement("source");
		source.src = url;
		source.type = mime;
		return source;
	};
	/**
	* Called if a load errors out.
	* @param event - The error event from the element that emits it.
	*/
	LoaderResource.prototype._onError = function(event) {
		this.abort("Failed to load element using: " + event.target.nodeName);
	};
	/**
	* Called if a load progress event fires for an element or xhr/xdr.
	* @param event - Progress event.
	*/
	LoaderResource.prototype._onProgress = function(event) {
		if (event && event.lengthComputable) this.onProgress.dispatch(this, event.loaded / event.total);
	};
	/** Called if a timeout event fires for an element. */
	LoaderResource.prototype._onTimeout = function() {
		this.abort("Load timed out.");
	};
	/** Called if an error event fires for xhr/xdr. */
	LoaderResource.prototype._xhrOnError = function() {
		var xhr = this.xhr;
		this.abort(reqType(xhr) + " Request failed. Status: " + xhr.status + ", text: \"" + xhr.statusText + "\"");
	};
	/** Called if an error event fires for xhr/xdr. */
	LoaderResource.prototype._xhrOnTimeout = function() {
		var xhr = this.xhr;
		this.abort(reqType(xhr) + " Request timed out.");
	};
	/** Called if an abort event fires for xhr/xdr. */
	LoaderResource.prototype._xhrOnAbort = function() {
		var xhr = this.xhr;
		this.abort(reqType(xhr) + " Request was aborted by the user.");
	};
	/** Called when data successfully loads from an xhr/xdr request. */
	LoaderResource.prototype._xhrOnLoad = function() {
		var xhr = this.xhr;
		var text = "";
		var status = typeof xhr.status === "undefined" ? STATUS_OK : xhr.status;
		if (xhr.responseType === "" || xhr.responseType === "text" || typeof xhr.responseType === "undefined") text = xhr.responseText;
		if (status === STATUS_NONE && (text.length > 0 || xhr.responseType === LoaderResource.XHR_RESPONSE_TYPE.BUFFER)) status = STATUS_OK;
		else if (status === STATUS_IE_BUG_EMPTY) status = STATUS_EMPTY;
		if ((status / 100 | 0) === STATUS_TYPE_OK) if (this.xhrType === LoaderResource.XHR_RESPONSE_TYPE.TEXT) {
			this.data = text;
			this.type = LoaderResource.TYPE.TEXT;
		} else if (this.xhrType === LoaderResource.XHR_RESPONSE_TYPE.JSON) try {
			this.data = JSON.parse(text);
			this.type = LoaderResource.TYPE.JSON;
		} catch (e) {
			this.abort("Error trying to parse loaded json: " + e);
			return;
		}
		else if (this.xhrType === LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT) try {
			if (globalThis.DOMParser) {
				var domparser = new DOMParser();
				this.data = domparser.parseFromString(text, "text/xml");
			} else {
				var div = document.createElement("div");
				div.innerHTML = text;
				this.data = div;
			}
			this.type = LoaderResource.TYPE.XML;
		} catch (e$1) {
			this.abort("Error trying to parse loaded xml: " + e$1);
			return;
		}
		else this.data = xhr.response || text;
		else {
			this.abort("[" + xhr.status + "] " + xhr.statusText + ": " + xhr.responseURL);
			return;
		}
		this.complete();
	};
	/**
	* Sets the `crossOrigin` property for this resource based on if the url
	* for this resource is cross-origin. If crossOrigin was manually set, this
	* function does nothing.
	* @private
	* @param url - The url to test.
	* @param [loc=globalThis.location] - The location object to test against.
	* @returns The crossOrigin value to use (or empty string for none).
	*/
	LoaderResource.prototype._determineCrossOrigin = function(url, loc) {
		if (url.indexOf("data:") === 0) return "";
		if (globalThis.origin !== globalThis.location.origin) return "anonymous";
		loc = loc || globalThis.location;
		if (!tempAnchor) tempAnchor = document.createElement("a");
		tempAnchor.href = url;
		var parsedUrl = parseUri(tempAnchor.href, { strictMode: true });
		var samePort = !parsedUrl.port && loc.port === "" || parsedUrl.port === loc.port;
		var protocol = parsedUrl.protocol ? parsedUrl.protocol + ":" : "";
		if (parsedUrl.host !== loc.hostname || !samePort || protocol !== loc.protocol) return "anonymous";
		return "";
	};
	/**
	* Determines the responseType of an XHR request based on the extension of the
	* resource being loaded.
	* @private
	* @returns {PIXI.LoaderResource.XHR_RESPONSE_TYPE} The responseType to use.
	*/
	LoaderResource.prototype._determineXhrType = function() {
		return LoaderResource._xhrTypeMap[this.extension] || LoaderResource.XHR_RESPONSE_TYPE.TEXT;
	};
	/**
	* Determines the loadType of a resource based on the extension of the
	* resource being loaded.
	* @private
	* @returns {PIXI.LoaderResource.LOAD_TYPE} The loadType to use.
	*/
	LoaderResource.prototype._determineLoadType = function() {
		return LoaderResource._loadTypeMap[this.extension] || LoaderResource.LOAD_TYPE.XHR;
	};
	/**
	* Extracts the extension (sans '.') of the file being loaded by the resource.
	* @param [url] - url to parse, `this.url` by default.
	* @returns The extension.
	*/
	LoaderResource.prototype._getExtension = function(url) {
		if (url === void 0) url = this.url;
		var ext = "";
		if (this.isDataUrl) {
			var slashIndex = url.indexOf("/");
			ext = url.substring(slashIndex + 1, url.indexOf(";", slashIndex));
		} else {
			var queryStart = url.indexOf("?");
			var hashStart = url.indexOf("#");
			var index = Math.min(queryStart > -1 ? queryStart : url.length, hashStart > -1 ? hashStart : url.length);
			url = url.substring(0, index);
			ext = url.substring(url.lastIndexOf(".") + 1);
		}
		return ext.toLowerCase();
	};
	/**
	* Determines the mime type of an XHR request based on the responseType of
	* resource being loaded.
	* @param type - The type to get a mime type for.
	* @private
	* @returns The mime type to use.
	*/
	LoaderResource.prototype._getMimeFromXhrType = function(type) {
		switch (type) {
			case LoaderResource.XHR_RESPONSE_TYPE.BUFFER: return "application/octet-binary";
			case LoaderResource.XHR_RESPONSE_TYPE.BLOB: return "application/blob";
			case LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT: return "application/xml";
			case LoaderResource.XHR_RESPONSE_TYPE.JSON: return "application/json";
			case LoaderResource.XHR_RESPONSE_TYPE.DEFAULT:
			case LoaderResource.XHR_RESPONSE_TYPE.TEXT:
			default: return "text/plain";
		}
	};
	return LoaderResource;
}();
(function(LoaderResource) {
	(function(STATUS_FLAGS) {
		/** None */
		STATUS_FLAGS[STATUS_FLAGS["NONE"] = 0] = "NONE";
		/** Data URL */
		STATUS_FLAGS[STATUS_FLAGS["DATA_URL"] = 1] = "DATA_URL";
		/** Complete */
		STATUS_FLAGS[STATUS_FLAGS["COMPLETE"] = 2] = "COMPLETE";
		/** Loading */
		STATUS_FLAGS[STATUS_FLAGS["LOADING"] = 4] = "LOADING";
	})(LoaderResource.STATUS_FLAGS || (LoaderResource.STATUS_FLAGS = {}));
	(function(TYPE) {
		/** Unknown */
		TYPE[TYPE["UNKNOWN"] = 0] = "UNKNOWN";
		/** JSON */
		TYPE[TYPE["JSON"] = 1] = "JSON";
		/** XML */
		TYPE[TYPE["XML"] = 2] = "XML";
		/** Image */
		TYPE[TYPE["IMAGE"] = 3] = "IMAGE";
		/** Audio */
		TYPE[TYPE["AUDIO"] = 4] = "AUDIO";
		/** Video */
		TYPE[TYPE["VIDEO"] = 5] = "VIDEO";
		/** Plain text */
		TYPE[TYPE["TEXT"] = 6] = "TEXT";
	})(LoaderResource.TYPE || (LoaderResource.TYPE = {}));
	(function(LOAD_TYPE) {
		/** Uses XMLHttpRequest to load the resource. */
		LOAD_TYPE[LOAD_TYPE["XHR"] = 1] = "XHR";
		/** Uses an `Image` object to load the resource. */
		LOAD_TYPE[LOAD_TYPE["IMAGE"] = 2] = "IMAGE";
		/** Uses an `Audio` object to load the resource. */
		LOAD_TYPE[LOAD_TYPE["AUDIO"] = 3] = "AUDIO";
		/** Uses a `Video` object to load the resource. */
		LOAD_TYPE[LOAD_TYPE["VIDEO"] = 4] = "VIDEO";
	})(LoaderResource.LOAD_TYPE || (LoaderResource.LOAD_TYPE = {}));
	(function(XHR_RESPONSE_TYPE) {
		/** string */
		XHR_RESPONSE_TYPE["DEFAULT"] = "text";
		/** ArrayBuffer */
		XHR_RESPONSE_TYPE["BUFFER"] = "arraybuffer";
		/** Blob */
		XHR_RESPONSE_TYPE["BLOB"] = "blob";
		/** Document */
		XHR_RESPONSE_TYPE["DOCUMENT"] = "document";
		/** Object */
		XHR_RESPONSE_TYPE["JSON"] = "json";
		/** String */
		XHR_RESPONSE_TYPE["TEXT"] = "text";
	})(LoaderResource.XHR_RESPONSE_TYPE || (LoaderResource.XHR_RESPONSE_TYPE = {}));
	LoaderResource._loadTypeMap = {
		gif: LoaderResource.LOAD_TYPE.IMAGE,
		png: LoaderResource.LOAD_TYPE.IMAGE,
		bmp: LoaderResource.LOAD_TYPE.IMAGE,
		jpg: LoaderResource.LOAD_TYPE.IMAGE,
		jpeg: LoaderResource.LOAD_TYPE.IMAGE,
		tif: LoaderResource.LOAD_TYPE.IMAGE,
		tiff: LoaderResource.LOAD_TYPE.IMAGE,
		webp: LoaderResource.LOAD_TYPE.IMAGE,
		tga: LoaderResource.LOAD_TYPE.IMAGE,
		avif: LoaderResource.LOAD_TYPE.IMAGE,
		svg: LoaderResource.LOAD_TYPE.IMAGE,
		"svg+xml": LoaderResource.LOAD_TYPE.IMAGE,
		mp3: LoaderResource.LOAD_TYPE.AUDIO,
		ogg: LoaderResource.LOAD_TYPE.AUDIO,
		wav: LoaderResource.LOAD_TYPE.AUDIO,
		mp4: LoaderResource.LOAD_TYPE.VIDEO,
		webm: LoaderResource.LOAD_TYPE.VIDEO
	};
	LoaderResource._xhrTypeMap = {
		xhtml: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		html: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		htm: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		xml: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		tmx: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		svg: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		tsx: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		gif: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		png: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		bmp: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		jpg: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		jpeg: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		tif: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		tiff: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		webp: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		tga: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		avif: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		json: LoaderResource.XHR_RESPONSE_TYPE.JSON,
		text: LoaderResource.XHR_RESPONSE_TYPE.TEXT,
		txt: LoaderResource.XHR_RESPONSE_TYPE.TEXT,
		ttf: LoaderResource.XHR_RESPONSE_TYPE.BUFFER,
		otf: LoaderResource.XHR_RESPONSE_TYPE.BUFFER
	};
	LoaderResource.EMPTY_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
})(LoaderResource || (LoaderResource = {}));
/**
* Smaller version of the async library constructs.
* @ignore
*/
function _noop() {}
/**
* Ensures a function is only called once.
* @ignore
* @param {Function} fn - The function to wrap.
* @returns {Function} The wrapping function.
*/
function onlyOnce(fn) {
	return function onceWrapper() {
		var arguments$1 = arguments;
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments$1[_i];
		if (fn === null) throw new Error("Callback was already called.");
		var callFn = fn;
		fn = null;
		callFn.apply(this, args);
	};
}
/**
* @private
* @memberof PIXI
*/
var AsyncQueueItem = function() {
	/**
	* @param data
	* @param callback
	* @private
	*/
	function AsyncQueueItem(data, callback) {
		this.data = data;
		this.callback = callback;
	}
	return AsyncQueueItem;
}();
/**
* @private
* @memberof PIXI
*/
var AsyncQueue = function() {
	/**
	* @param worker
	* @param concurrency
	* @private
	*/
	function AsyncQueue(worker, concurrency) {
		var _this = this;
		if (concurrency === void 0) concurrency = 1;
		this.workers = 0;
		this.saturated = _noop;
		this.unsaturated = _noop;
		this.empty = _noop;
		this.drain = _noop;
		this.error = _noop;
		this.started = false;
		this.paused = false;
		this._tasks = [];
		this._insert = function(data, insertAtFront, callback) {
			if (callback && typeof callback !== "function") throw new Error("task callback must be a function");
			_this.started = true;
			if (data == null && _this.idle()) {
				setTimeout(function() {
					return _this.drain();
				}, 1);
				return;
			}
			var item = new AsyncQueueItem(data, typeof callback === "function" ? callback : _noop);
			if (insertAtFront) _this._tasks.unshift(item);
			else _this._tasks.push(item);
			setTimeout(_this.process, 1);
		};
		this.process = function() {
			while (!_this.paused && _this.workers < _this.concurrency && _this._tasks.length) {
				var task = _this._tasks.shift();
				if (_this._tasks.length === 0) _this.empty();
				_this.workers += 1;
				if (_this.workers === _this.concurrency) _this.saturated();
				_this._worker(task.data, onlyOnce(_this._next(task)));
			}
		};
		this._worker = worker;
		if (concurrency === 0) throw new Error("Concurrency must not be zero");
		this.concurrency = concurrency;
		this.buffer = concurrency / 4;
	}
	/**
	* @param task
	* @private
	*/
	AsyncQueue.prototype._next = function(task) {
		var _this = this;
		return function() {
			var arguments$1 = arguments;
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments$1[_i];
			_this.workers -= 1;
			task.callback.apply(task, args);
			if (args[0] != null) _this.error(args[0], task.data);
			if (_this.workers <= _this.concurrency - _this.buffer) _this.unsaturated();
			if (_this.idle()) _this.drain();
			_this.process();
		};
	};
	AsyncQueue.prototype.push = function(data, callback) {
		this._insert(data, false, callback);
	};
	AsyncQueue.prototype.kill = function() {
		this.workers = 0;
		this.drain = _noop;
		this.started = false;
		this._tasks = [];
	};
	AsyncQueue.prototype.unshift = function(data, callback) {
		this._insert(data, true, callback);
	};
	AsyncQueue.prototype.length = function() {
		return this._tasks.length;
	};
	AsyncQueue.prototype.running = function() {
		return this.workers;
	};
	AsyncQueue.prototype.idle = function() {
		return this._tasks.length + this.workers === 0;
	};
	AsyncQueue.prototype.pause = function() {
		if (this.paused === true) return;
		this.paused = true;
	};
	AsyncQueue.prototype.resume = function() {
		if (this.paused === false) return;
		this.paused = false;
		for (var w = 1; w <= this.concurrency; w++) this.process();
	};
	/**
	* Iterates an array in series.
	* @param {Array.<*>} array - Array to iterate.
	* @param {Function} iterator - Function to call for each element.
	* @param {Function} callback - Function to call when done, or on error.
	* @param {boolean} [deferNext=false] - Break synchronous each loop by calling next with a setTimeout of 1.
	*/
	AsyncQueue.eachSeries = function(array, iterator, callback, deferNext) {
		var i = 0;
		var len = array.length;
		function next(err) {
			if (err || i === len) {
				if (callback) callback(err);
				return;
			}
			if (deferNext) setTimeout(function() {
				iterator(array[i++], next);
			}, 1);
			else iterator(array[i++], next);
		}
		next();
	};
	/**
	* Async queue implementation,
	* @param {Function} worker - The worker function to call for each task.
	* @param {number} concurrency - How many workers to run in parrallel.
	* @returns {*} The async queue object.
	*/
	AsyncQueue.queue = function(worker, concurrency) {
		return new AsyncQueue(worker, concurrency);
	};
	return AsyncQueue;
}();
var MAX_PROGRESS = 100;
var rgxExtractUrlHash = /(#[\w-]+)?$/;
/**
* The new loader, forked from Resource Loader by Chad Engler: https://github.com/englercj/resource-loader
*
* ```js
* const loader = PIXI.Loader.shared; // PixiJS exposes a premade instance for you to use.
* // or
* const loader = new PIXI.Loader(); // You can also create your own if you want
*
* const sprites = {};
*
* // Chainable `add` to enqueue a resource
* loader.add('bunny', 'data/bunny.png')
*       .add('spaceship', 'assets/spritesheet.json');
* loader.add('scoreFont', 'assets/score.fnt');
*
* // Chainable `pre` to add a middleware that runs for each resource, *before* loading that resource.
* // This is useful to implement custom caching modules (using filesystem, indexeddb, memory, etc).
* loader.pre(cachingMiddleware);
*
* // Chainable `use` to add a middleware that runs for each resource, *after* loading that resource.
* // This is useful to implement custom parsing modules (like spritesheet parsers, spine parser, etc).
* loader.use(parsingMiddleware);
*
* // The `load` method loads the queue of resources, and calls the passed in callback called once all
* // resources have loaded.
* loader.load((loader, resources) => {
*     // resources is an object where the key is the name of the resource loaded and the value is the resource object.
*     // They have a couple default properties:
*     // - `url`: The URL that the resource was loaded from
*     // - `error`: The error that happened when trying to load (if any)
*     // - `data`: The raw data that was loaded
*     // also may contain other properties based on the middleware that runs.
*     sprites.bunny = new PIXI.TilingSprite(resources.bunny.texture);
*     sprites.spaceship = new PIXI.TilingSprite(resources.spaceship.texture);
*     sprites.scoreFont = new PIXI.TilingSprite(resources.scoreFont.texture);
* });
*
* // throughout the process multiple signals can be dispatched.
* loader.onProgress.add(() => {}); // called once per loaded/errored file
* loader.onError.add(() => {}); // called once per errored file
* loader.onLoad.add(() => {}); // called once per loaded file
* loader.onComplete.add(() => {}); // called once when the queued resources all load.
* ```
* @memberof PIXI
*/
var Loader = function() {
	/**
	* @param baseUrl - The base url for all resources loaded by this loader.
	* @param concurrency - The number of resources to load concurrently.
	*/
	function Loader(baseUrl, concurrency) {
		var _this = this;
		if (baseUrl === void 0) baseUrl = "";
		if (concurrency === void 0) concurrency = 10;
		/** The progress percent of the loader going through the queue. */
		this.progress = 0;
		/** Loading state of the loader, true if it is currently loading resources. */
		this.loading = false;
		/**
		* A querystring to append to every URL added to the loader.
		*
		* This should be a valid query string *without* the question-mark (`?`). The loader will
		* also *not* escape values for you. Make sure to escape your parameters with
		* [`encodeURIComponent`](https://mdn.io/encodeURIComponent) before assigning this property.
		* @example
		* const loader = new Loader();
		*
		* loader.defaultQueryString = 'user=me&password=secret';
		*
		* // This will request 'image.png?user=me&password=secret'
		* loader.add('image.png').load();
		*
		* loader.reset();
		*
		* // This will request 'image.png?v=1&user=me&password=secret'
		* loader.add('iamge.png?v=1').load();
		*/
		this.defaultQueryString = "";
		/** The middleware to run before loading each resource. */
		this._beforeMiddleware = [];
		/** The middleware to run after loading each resource. */
		this._afterMiddleware = [];
		/** The tracks the resources we are currently completing parsing for. */
		this._resourcesParsing = [];
		/**
		* The `_loadResource` function bound with this object context.
		* @param r - The resource to load
		* @param d - The dequeue function
		*/
		this._boundLoadResource = function(r, d) {
			return _this._loadResource(r, d);
		};
		/** All the resources for this loader keyed by name. */
		this.resources = {};
		this.baseUrl = baseUrl;
		this._beforeMiddleware = [];
		this._afterMiddleware = [];
		this._resourcesParsing = [];
		this._boundLoadResource = function(r, d) {
			return _this._loadResource(r, d);
		};
		this._queue = AsyncQueue.queue(this._boundLoadResource, concurrency);
		this._queue.pause();
		this.resources = {};
		this.onProgress = new Signal();
		this.onError = new Signal();
		this.onLoad = new Signal();
		this.onStart = new Signal();
		this.onComplete = new Signal();
		for (var i = 0; i < Loader._plugins.length; ++i) {
			var plugin = Loader._plugins[i];
			var pre = plugin.pre, use = plugin.use;
			if (pre) this.pre(pre);
			if (use) this.use(use);
		}
		this._protected = false;
	}
	/**
	* Same as add, params have strict order
	* @private
	* @param name - The name of the resource to load.
	* @param url - The url for this resource, relative to the baseUrl of this loader.
	* @param options - The options for the load.
	* @param callback - Function to call when this specific resource completes loading.
	* @returns The loader itself.
	*/
	Loader.prototype._add = function(name, url, options, callback) {
		if (this.loading && (!options || !options.parentResource)) throw new Error("Cannot add resources while the loader is running.");
		if (this.resources[name]) throw new Error("Resource named \"" + name + "\" already exists.");
		url = this._prepareUrl(url);
		this.resources[name] = new LoaderResource(name, url, options);
		if (typeof callback === "function") this.resources[name].onAfterMiddleware.once(callback);
		if (this.loading) {
			var parent = options.parentResource;
			var incompleteChildren = [];
			for (var i = 0; i < parent.children.length; ++i) if (!parent.children[i].isComplete) incompleteChildren.push(parent.children[i]);
			var eachChunk = parent.progressChunk * (incompleteChildren.length + 1) / (incompleteChildren.length + 2);
			parent.children.push(this.resources[name]);
			parent.progressChunk = eachChunk;
			for (var i = 0; i < incompleteChildren.length; ++i) incompleteChildren[i].progressChunk = eachChunk;
			this.resources[name].progressChunk = eachChunk;
		}
		this._queue.push(this.resources[name]);
		return this;
	};
	/**
	* Sets up a middleware function that will run *before* the
	* resource is loaded.
	* @param fn - The middleware function to register.
	* @returns The loader itself.
	*/
	Loader.prototype.pre = function(fn) {
		this._beforeMiddleware.push(fn);
		return this;
	};
	/**
	* Sets up a middleware function that will run *after* the
	* resource is loaded.
	* @param fn - The middleware function to register.
	* @returns The loader itself.
	*/
	Loader.prototype.use = function(fn) {
		this._afterMiddleware.push(fn);
		return this;
	};
	/**
	* Resets the queue of the loader to prepare for a new load.
	* @returns The loader itself.
	*/
	Loader.prototype.reset = function() {
		this.progress = 0;
		this.loading = false;
		this._queue.kill();
		this._queue.pause();
		for (var k in this.resources) {
			var res = this.resources[k];
			if (res._onLoadBinding) res._onLoadBinding.detach();
			if (res.isLoading) res.abort("loader reset");
		}
		this.resources = {};
		return this;
	};
	/**
	* Starts loading the queued resources.
	* @param cb - Optional callback that will be bound to the `complete` event.
	* @returns The loader itself.
	*/
	Loader.prototype.load = function(cb) {
		deprecation("6.5.0", "@pixi/loaders is being replaced with @pixi/assets in the next major release.");
		if (typeof cb === "function") this.onComplete.once(cb);
		if (this.loading) return this;
		if (this._queue.idle()) {
			this._onStart();
			this._onComplete();
		} else {
			var chunk = MAX_PROGRESS / this._queue._tasks.length;
			for (var i = 0; i < this._queue._tasks.length; ++i) this._queue._tasks[i].data.progressChunk = chunk;
			this._onStart();
			this._queue.resume();
		}
		return this;
	};
	Object.defineProperty(Loader.prototype, "concurrency", {
		/**
		* The number of resources to load concurrently.
		* @default 10
		*/
		get: function() {
			return this._queue.concurrency;
		},
		set: function(concurrency) {
			this._queue.concurrency = concurrency;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Prepares a url for usage based on the configuration of this object
	* @param url - The url to prepare.
	* @returns The prepared url.
	*/
	Loader.prototype._prepareUrl = function(url) {
		var parsedUrl = parseUri(url, { strictMode: true });
		var result;
		if (parsedUrl.protocol || !parsedUrl.path || url.indexOf("//") === 0) result = url;
		else if (this.baseUrl.length && this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 && url.charAt(0) !== "/") result = this.baseUrl + "/" + url;
		else result = this.baseUrl + url;
		if (this.defaultQueryString) {
			var hash = rgxExtractUrlHash.exec(result)[0];
			result = result.slice(0, result.length - hash.length);
			if (result.indexOf("?") !== -1) result += "&" + this.defaultQueryString;
			else result += "?" + this.defaultQueryString;
			result += hash;
		}
		return result;
	};
	/**
	* Loads a single resource.
	* @param resource - The resource to load.
	* @param dequeue - The function to call when we need to dequeue this item.
	*/
	Loader.prototype._loadResource = function(resource, dequeue) {
		var _this = this;
		resource._dequeue = dequeue;
		AsyncQueue.eachSeries(this._beforeMiddleware, function(fn, next) {
			fn.call(_this, resource, function() {
				next(resource.isComplete ? {} : null);
			});
		}, function() {
			if (resource.isComplete) _this._onLoad(resource);
			else {
				resource._onLoadBinding = resource.onComplete.once(_this._onLoad, _this);
				resource.load();
			}
		}, true);
	};
	/** Called once loading has started. */
	Loader.prototype._onStart = function() {
		this.progress = 0;
		this.loading = true;
		this.onStart.dispatch(this);
	};
	/** Called once each resource has loaded. */
	Loader.prototype._onComplete = function() {
		this.progress = MAX_PROGRESS;
		this.loading = false;
		this.onComplete.dispatch(this, this.resources);
	};
	/**
	* Called each time a resources is loaded.
	* @param resource - The resource that was loaded
	*/
	Loader.prototype._onLoad = function(resource) {
		var _this = this;
		resource._onLoadBinding = null;
		this._resourcesParsing.push(resource);
		resource._dequeue();
		AsyncQueue.eachSeries(this._afterMiddleware, function(fn, next) {
			fn.call(_this, resource, next);
		}, function() {
			resource.onAfterMiddleware.dispatch(resource);
			_this.progress = Math.min(MAX_PROGRESS, _this.progress + resource.progressChunk);
			_this.onProgress.dispatch(_this, resource);
			if (resource.error) _this.onError.dispatch(resource.error, _this, resource);
			else _this.onLoad.dispatch(_this, resource);
			_this._resourcesParsing.splice(_this._resourcesParsing.indexOf(resource), 1);
			if (_this._queue.idle() && _this._resourcesParsing.length === 0) _this._onComplete();
		}, true);
	};
	/** Destroy the loader, removes references. */
	Loader.prototype.destroy = function() {
		if (!this._protected) this.reset();
	};
	Object.defineProperty(Loader, "shared", {
		/** A premade instance of the loader that can be used to load resources. */
		get: function() {
			var shared = Loader._shared;
			if (!shared) {
				shared = new Loader();
				shared._protected = true;
				Loader._shared = shared;
			}
			return shared;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Use the {@link PIXI.extensions.add} API to register plugins.
	* @deprecated since 6.5.0
	* @param plugin - The plugin to add
	* @returns Reference to PIXI.Loader for chaining
	*/
	Loader.registerPlugin = function(plugin) {
		deprecation("6.5.0", "Loader.registerPlugin() is deprecated, use extensions.add() instead.");
		extensions.add({
			type: ExtensionType.Loader,
			ref: plugin
		});
		return Loader;
	};
	Loader._plugins = [];
	return Loader;
}();
extensions.handleByList(ExtensionType.Loader, Loader._plugins);
Loader.prototype.add = function add(name, url, options, callback) {
	if (Array.isArray(name)) {
		for (var i = 0; i < name.length; ++i) this.add(name[i]);
		return this;
	}
	if (typeof name === "object") {
		options = name;
		callback = url || options.callback || options.onComplete;
		url = options.url;
		name = options.name || options.key || options.url;
	}
	if (typeof url !== "string") {
		callback = options;
		options = url;
		url = name;
	}
	if (typeof url !== "string") throw new Error("No url passed to add resource to loader.");
	if (typeof options === "function") {
		callback = options;
		options = null;
	}
	return this._add(name, url, options, callback);
};
/**
* Application plugin for supporting loader option. Installing the LoaderPlugin
* is not necessary if using **pixi.js** or **pixi.js-legacy**.
* @example
* import {AppLoaderPlugin} from '@pixi/loaders';
* import {extensions} from '@pixi/core';
* extensions.add(AppLoaderPlugin);
* @memberof PIXI
*/
var AppLoaderPlugin = function() {
	function AppLoaderPlugin() {}
	/**
	* Called on application constructor
	* @param options
	* @private
	*/
	AppLoaderPlugin.init = function(options) {
		options = Object.assign({ sharedLoader: false }, options);
		this.loader = options.sharedLoader ? Loader.shared : new Loader();
	};
	/**
	* Called when application destroyed
	* @private
	*/
	AppLoaderPlugin.destroy = function() {
		if (this.loader) {
			this.loader.destroy();
			this.loader = null;
		}
	};
	/** @ignore */
	AppLoaderPlugin.extension = ExtensionType.Application;
	return AppLoaderPlugin;
}();
/**
* Loader plugin for handling Texture resources.
* @memberof PIXI
*/
var TextureLoader = function() {
	function TextureLoader() {}
	/** Handle SVG elements a text, render with SVGResource. */
	TextureLoader.add = function() {
		LoaderResource.setExtensionLoadType("svg", LoaderResource.LOAD_TYPE.XHR);
		LoaderResource.setExtensionXhrType("svg", LoaderResource.XHR_RESPONSE_TYPE.TEXT);
	};
	/**
	* Called after a resource is loaded.
	* @see PIXI.Loader.loaderMiddleware
	* @param resource
	* @param {Function} next
	*/
	TextureLoader.use = function(resource, next) {
		if (resource.data && (resource.type === LoaderResource.TYPE.IMAGE || resource.extension === "svg")) {
			var data = resource.data, url = resource.url, name = resource.name, metadata = resource.metadata;
			Texture.fromLoader(data, url, name, metadata).then(function(texture) {
				resource.texture = texture;
				next();
			}).catch(next);
		} else next();
	};
	/** @ignore */
	TextureLoader.extension = ExtensionType.Loader;
	return TextureLoader;
}();
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
/**
* Encodes binary into base64.
* @function encodeBinary
* @param {string} input - The input data to encode.
* @returns {string} The encoded base64 string
*/
function encodeBinary(input) {
	var output = "";
	var inx = 0;
	while (inx < input.length) {
		var bytebuffer = [
			0,
			0,
			0
		];
		var encodedCharIndexes = [
			0,
			0,
			0,
			0
		];
		for (var jnx = 0; jnx < bytebuffer.length; ++jnx) if (inx < input.length) bytebuffer[jnx] = input.charCodeAt(inx++) & 255;
		else bytebuffer[jnx] = 0;
		encodedCharIndexes[0] = bytebuffer[0] >> 2;
		encodedCharIndexes[1] = (bytebuffer[0] & 3) << 4 | bytebuffer[1] >> 4;
		encodedCharIndexes[2] = (bytebuffer[1] & 15) << 2 | bytebuffer[2] >> 6;
		encodedCharIndexes[3] = bytebuffer[2] & 63;
		switch (inx - (input.length - 1)) {
			case 2:
				encodedCharIndexes[3] = 64;
				encodedCharIndexes[2] = 64;
				break;
			case 1:
				encodedCharIndexes[3] = 64;
				break;
		}
		for (var jnx = 0; jnx < encodedCharIndexes.length; ++jnx) output += _keyStr.charAt(encodedCharIndexes[jnx]);
	}
	return output;
}
/**
* A middleware for transforming XHR loaded Blobs into more useful objects
* @ignore
* @function parsing
* @example
* import { Loader, middleware } from 'resource-loader';
* const loader = new Loader();
* loader.use(middleware.parsing);
* @param resource - Current Resource
* @param next - Callback when complete
*/
function parsing(resource, next) {
	if (!resource.data) {
		next();
		return;
	}
	if (resource.xhr && resource.xhrType === LoaderResource.XHR_RESPONSE_TYPE.BLOB) {
		if (!self.Blob || typeof resource.data === "string") {
			var type = resource.xhr.getResponseHeader("content-type");
			if (type && type.indexOf("image") === 0) {
				resource.data = new Image();
				resource.data.src = "data:" + type + ";base64," + encodeBinary(resource.xhr.responseText);
				resource.type = LoaderResource.TYPE.IMAGE;
				resource.data.onload = function() {
					resource.data.onload = null;
					next();
				};
				return;
			}
		} else if (resource.data.type.indexOf("image") === 0) {
			var Url_1 = globalThis.URL || globalThis.webkitURL;
			var src_1 = Url_1.createObjectURL(resource.data);
			resource.blob = resource.data;
			resource.data = new Image();
			resource.data.src = src_1;
			resource.type = LoaderResource.TYPE.IMAGE;
			resource.data.onload = function() {
				Url_1.revokeObjectURL(src_1);
				resource.data.onload = null;
				next();
			};
			return;
		}
	}
	next();
}
/**
* Parse any blob into more usable objects (e.g. Image).
* @memberof PIXI
*/
var ParsingLoader = function() {
	function ParsingLoader() {}
	/** @ignore */
	ParsingLoader.extension = ExtensionType.Loader;
	ParsingLoader.use = parsing;
	return ParsingLoader;
}();
extensions.add(TextureLoader, ParsingLoader);
//#endregion
//#region node_modules/@pixi/compressed-textures/dist/esm/compressed-textures.mjs
/*!
* @pixi/compressed-textures - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/compressed-textures is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
var _a$2;
/**
* WebGL internal formats, including compressed texture formats provided by extensions
* @memberof PIXI
* @static
* @name INTERNAL_FORMATS
* @enum {number}
* @property {number} [COMPRESSED_RGB_S3TC_DXT1_EXT=0x83F0] -
* @property {number} [COMPRESSED_RGBA_S3TC_DXT1_EXT=0x83F1] -
* @property {number} [COMPRESSED_RGBA_S3TC_DXT3_EXT=0x83F2] -
* @property {number} [COMPRESSED_RGBA_S3TC_DXT5_EXT=0x83F3] -
* @property {number} [COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT=35917] -
* @property {number} [COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT=35918] -
* @property {number} [COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT=35919] -
* @property {number} [COMPRESSED_SRGB_S3TC_DXT1_EXT=35916] -
* @property {number} [COMPRESSED_R11_EAC=0x9270] -
* @property {number} [COMPRESSED_SIGNED_R11_EAC=0x9271] -
* @property {number} [COMPRESSED_RG11_EAC=0x9272] -
* @property {number} [COMPRESSED_SIGNED_RG11_EAC=0x9273] -
* @property {number} [COMPRESSED_RGB8_ETC2=0x9274] -
* @property {number} [COMPRESSED_RGBA8_ETC2_EAC=0x9278] -
* @property {number} [COMPRESSED_SRGB8_ETC2=0x9275] -
* @property {number} [COMPRESSED_SRGB8_ALPHA8_ETC2_EAC=0x9279] -
* @property {number} [COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2=0x9276] -
* @property {number} [COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2=0x9277] -
* @property {number} [COMPRESSED_RGB_PVRTC_4BPPV1_IMG=0x8C00] -
* @property {number} [COMPRESSED_RGBA_PVRTC_4BPPV1_IMG=0x8C02] -
* @property {number} [COMPRESSED_RGB_PVRTC_2BPPV1_IMG=0x8C01] -
* @property {number} [COMPRESSED_RGBA_PVRTC_2BPPV1_IMG=0x8C03] -
* @property {number} [COMPRESSED_RGB_ETC1_WEBGL=0x8D64] -
* @property {number} [COMPRESSED_RGB_ATC_WEBGL=0x8C92] -
* @property {number} [COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL=0x8C92] -
* @property {number} [COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL=0x87EE] -
* @property {number} [COMPRESSED_RGBA_ASTC_4x4_KHR=0x93B0] -
*/
var INTERNAL_FORMATS;
(function(INTERNAL_FORMATS) {
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB_S3TC_DXT1_EXT"] = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_S3TC_DXT1_EXT"] = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_S3TC_DXT3_EXT"] = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_S3TC_DXT5_EXT"] = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT"] = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT"] = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT"] = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB_S3TC_DXT1_EXT"] = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_R11_EAC"] = 37488] = "COMPRESSED_R11_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SIGNED_R11_EAC"] = 37489] = "COMPRESSED_SIGNED_R11_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RG11_EAC"] = 37490] = "COMPRESSED_RG11_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SIGNED_RG11_EAC"] = 37491] = "COMPRESSED_SIGNED_RG11_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB8_ETC2"] = 37492] = "COMPRESSED_RGB8_ETC2";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA8_ETC2_EAC"] = 37496] = "COMPRESSED_RGBA8_ETC2_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB8_ETC2"] = 37493] = "COMPRESSED_SRGB8_ETC2";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB8_ALPHA8_ETC2_EAC"] = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2"] = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2"] = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB_PVRTC_4BPPV1_IMG"] = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_PVRTC_4BPPV1_IMG"] = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB_PVRTC_2BPPV1_IMG"] = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_PVRTC_2BPPV1_IMG"] = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB_ETC1_WEBGL"] = 36196] = "COMPRESSED_RGB_ETC1_WEBGL";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB_ATC_WEBGL"] = 35986] = "COMPRESSED_RGB_ATC_WEBGL";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL"] = 35986] = "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL"] = 34798] = "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_ASTC_4x4_KHR"] = 37808] = "COMPRESSED_RGBA_ASTC_4x4_KHR";
})(INTERNAL_FORMATS || (INTERNAL_FORMATS = {}));
/**
* Maps the compressed texture formats in {@link PIXI.INTERNAL_FORMATS} to the number of bytes taken by
* each texel.
* @memberof PIXI
* @static
* @ignore
*/
var INTERNAL_FORMAT_TO_BYTES_PER_PIXEL = (_a$2 = {}, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB_S3TC_DXT1_EXT] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB_S3TC_DXT1_EXT] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_R11_EAC] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_SIGNED_R11_EAC] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RG11_EAC] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_SIGNED_RG11_EAC] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB8_ETC2] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA8_ETC2_EAC] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB8_ETC2] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = .25, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = .25, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB_ETC1_WEBGL] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB_ATC_WEBGL] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_ASTC_4x4_KHR] = 1, _a$2);
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
function __awaiter(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
function __generator(thisArg, body) {
	var _ = {
		label: 0,
		sent: function() {
			if (t[0] & 1) throw t[1];
			return t[1];
		},
		trys: [],
		ops: []
	}, f, y, t, g;
	return g = {
		next: verb(0),
		"throw": verb(1),
		"return": verb(2)
	}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
		return this;
	}), g;
	function verb(n) {
		return function(v) {
			return step([n, v]);
		};
	}
	function step(op) {
		if (f) throw new TypeError("Generator is already executing.");
		while (_) try {
			if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
			if (y = 0, t) op = [op[0] & 2, t.value];
			switch (op[0]) {
				case 0:
				case 1:
					t = op;
					break;
				case 4:
					_.label++;
					return {
						value: op[1],
						done: false
					};
				case 5:
					_.label++;
					y = op[1];
					op = [0];
					continue;
				case 7:
					op = _.ops.pop();
					_.trys.pop();
					continue;
				default:
					if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
						_ = 0;
						continue;
					}
					if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
						_.label = op[1];
						break;
					}
					if (op[0] === 6 && _.label < t[1]) {
						_.label = t[1];
						t = op;
						break;
					}
					if (t && _.label < t[2]) {
						_.label = t[2];
						_.ops.push(op);
						break;
					}
					if (t[2]) _.ops.pop();
					_.trys.pop();
					continue;
			}
			op = body.call(thisArg, _);
		} catch (e) {
			op = [6, e];
			y = 0;
		} finally {
			f = t = 0;
		}
		if (op[0] & 5) throw op[1];
		return {
			value: op[0] ? op[1] : void 0,
			done: true
		};
	}
}
/**
* Resource that fetches texture data over the network and stores it in a buffer.
* @class
* @extends PIXI.Resource
* @memberof PIXI
*/
var BlobResource = function(_super) {
	__extends(BlobResource, _super);
	/**
	* @param {string} source - the URL of the texture file
	* @param {PIXI.IBlobOptions} options
	* @param {boolean}[options.autoLoad] - whether to fetch the data immediately;
	*  you can fetch it later via {@link BlobResource#load}
	* @param {boolean}[options.width] - the width in pixels.
	* @param {boolean}[options.height] - the height in pixels.
	*/
	function BlobResource(source, options) {
		if (options === void 0) options = {
			width: 1,
			height: 1,
			autoLoad: true
		};
		var _this = this;
		var origin;
		var data;
		if (typeof source === "string") {
			origin = source;
			data = /* @__PURE__ */ new Uint8Array();
		} else {
			origin = null;
			data = source;
		}
		_this = _super.call(this, data, options) || this;
		/**
		* The URL of the texture file
		* @member {string}
		*/
		_this.origin = origin;
		/**
		* The viewable buffer on the data
		* @member {ViewableBuffer}
		*/
		_this.buffer = data ? new ViewableBuffer(data) : null;
		if (_this.origin && options.autoLoad !== false) _this.load();
		if (data && data.length) {
			_this.loaded = true;
			_this.onBlobLoaded(_this.buffer.rawBinaryData);
		}
		return _this;
	}
	BlobResource.prototype.onBlobLoaded = function(_data) {};
	/** Loads the blob */
	BlobResource.prototype.load = function() {
		return __awaiter(this, void 0, Promise, function() {
			var response, blob, arrayBuffer;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, fetch(this.origin)];
					case 1:
						response = _a.sent();
						return [4, response.blob()];
					case 2:
						blob = _a.sent();
						return [4, blob.arrayBuffer()];
					case 3:
						arrayBuffer = _a.sent();
						this.data = new Uint32Array(arrayBuffer);
						this.buffer = new ViewableBuffer(arrayBuffer);
						this.loaded = true;
						this.onBlobLoaded(arrayBuffer);
						this.update();
						return [2, this];
				}
			});
		});
	};
	return BlobResource;
}(BufferResource);
/**
* Resource for compressed texture formats, as follows: S3TC/DXTn (& their sRGB formats), ATC, ASTC, ETC 1/2, PVRTC.
*
* Compressed textures improve performance when rendering is texture-bound. The texture data stays compressed in
* graphics memory, increasing memory locality and speeding up texture fetches. These formats can also be used to store
* more detail in the same amount of memory.
*
* For most developers, container file formats are a better abstraction instead of directly handling raw texture
* data. PixiJS provides native support for the following texture file formats (via {@link PIXI.Loader}):
*
* **.dds** - the DirectDraw Surface file format stores DXTn (DXT-1,3,5) data. See {@link PIXI.DDSLoader}
* **.ktx** - the Khronos Texture Container file format supports storing all the supported WebGL compression formats.
*  See {@link PIXI.KTXLoader}.
* **.basis** - the BASIS supercompressed file format stores texture data in an internal format that is transcoded
*  to the compression format supported on the device at _runtime_. It also supports transcoding into a uncompressed
*  format as a fallback; you must install the `@pixi/basis-loader`, `@pixi/basis-transcoder` packages separately to
*  use these files. See {@link PIXI.BasisLoader}.
*
* The loaders for the aforementioned formats use `CompressedTextureResource` internally. It is strongly suggested that
* they be used instead.
*
* ## Working directly with CompressedTextureResource
*
* Since `CompressedTextureResource` inherits `BlobResource`, you can provide it a URL pointing to a file containing
* the raw texture data (with no file headers!):
*
* ```js
* // The resource backing the texture data for your textures.
* // NOTE: You can also provide a ArrayBufferView instead of a URL. This is used when loading data from a container file
* //   format such as KTX, DDS, or BASIS.
* const compressedResource = new PIXI.CompressedTextureResource("bunny.dxt5", {
*   format: PIXI.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
*   width: 256,
*   height: 256
* });
*
* // You can create a base-texture to the cache, so that future `Texture`s can be created using the `Texture.from` API.
* const baseTexture = new PIXI.BaseTexture(compressedResource, { pmaMode: PIXI.ALPHA_MODES.NPM });
*
* // Create a Texture to add to the TextureCache
* const texture = new PIXI.Texture(baseTexture);
*
* // Add baseTexture & texture to the global texture cache
* PIXI.BaseTexture.addToCache(baseTexture, "bunny.dxt5");
* PIXI.Texture.addToCache(texture, "bunny.dxt5");
* ```
* @memberof PIXI
*/
var CompressedTextureResource = function(_super) {
	__extends(CompressedTextureResource, _super);
	/**
	* @param source - the buffer/URL holding the compressed texture data
	* @param options
	* @param {PIXI.INTERNAL_FORMATS} options.format - the compression format
	* @param {number} options.width - the image width in pixels.
	* @param {number} options.height - the image height in pixels.
	* @param {number} [options.level=1] - the mipmap levels stored in the compressed texture, including level 0.
	* @param {number} [options.levelBuffers] - the buffers for each mipmap level. `CompressedTextureResource` can allows you
	*      to pass `null` for `source`, for cases where each level is stored in non-contiguous memory.
	*/
	function CompressedTextureResource(source, options) {
		var _this = _super.call(this, source, options) || this;
		_this.format = options.format;
		_this.levels = options.levels || 1;
		_this._width = options.width;
		_this._height = options.height;
		_this._extension = CompressedTextureResource._formatToExtension(_this.format);
		if (options.levelBuffers || _this.buffer) _this._levelBuffers = options.levelBuffers || CompressedTextureResource._createLevelBuffers(source instanceof Uint8Array ? source : _this.buffer.uint8View, _this.format, _this.levels, 4, 4, _this.width, _this.height);
		return _this;
	}
	/**
	* @override
	* @param renderer - A reference to the current renderer
	* @param _texture - the texture
	* @param _glTexture - texture instance for this webgl context
	*/
	CompressedTextureResource.prototype.upload = function(renderer, _texture, _glTexture) {
		var gl = renderer.gl;
		if (!renderer.context.extensions[this._extension]) throw new Error(this._extension + " textures are not supported on the current machine");
		if (!this._levelBuffers) return false;
		for (var i = 0, j = this.levels; i < j; i++) {
			var _a = this._levelBuffers[i], levelID = _a.levelID, levelWidth = _a.levelWidth, levelHeight = _a.levelHeight, levelBuffer = _a.levelBuffer;
			gl.compressedTexImage2D(gl.TEXTURE_2D, levelID, this.format, levelWidth, levelHeight, 0, levelBuffer);
		}
		return true;
	};
	/** @protected */
	CompressedTextureResource.prototype.onBlobLoaded = function() {
		this._levelBuffers = CompressedTextureResource._createLevelBuffers(this.buffer.uint8View, this.format, this.levels, 4, 4, this.width, this.height);
	};
	/**
	* Returns the key (to ContextSystem#extensions) for the WebGL extension supporting the compression format
	* @private
	* @param format - the compression format to get the extension for.
	*/
	CompressedTextureResource._formatToExtension = function(format) {
		if (format >= 33776 && format <= 33779) return "s3tc";
		else if (format >= 37488 && format <= 37497) return "etc";
		else if (format >= 35840 && format <= 35843) return "pvrtc";
		else if (format >= 36196) return "etc1";
		else if (format >= 35986 && format <= 34798) return "atc";
		throw new Error("Invalid (compressed) texture format given!");
	};
	/**
	* Pre-creates buffer views for each mipmap level
	* @private
	* @param buffer -
	* @param format - compression formats
	* @param levels - mipmap levels
	* @param blockWidth -
	* @param blockHeight -
	* @param imageWidth - width of the image in pixels
	* @param imageHeight - height of the image in pixels
	*/
	CompressedTextureResource._createLevelBuffers = function(buffer, format, levels, blockWidth, blockHeight, imageWidth, imageHeight) {
		var buffers = new Array(levels);
		var offset = buffer.byteOffset;
		var levelWidth = imageWidth;
		var levelHeight = imageHeight;
		var alignedLevelWidth = levelWidth + blockWidth - 1 & ~(blockWidth - 1);
		var alignedLevelHeight = levelHeight + blockHeight - 1 & ~(blockHeight - 1);
		var levelSize = alignedLevelWidth * alignedLevelHeight * INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[format];
		for (var i = 0; i < levels; i++) {
			buffers[i] = {
				levelID: i,
				levelWidth: levels > 1 ? levelWidth : alignedLevelWidth,
				levelHeight: levels > 1 ? levelHeight : alignedLevelHeight,
				levelBuffer: new Uint8Array(buffer.buffer, offset, levelSize)
			};
			offset += levelSize;
			levelWidth = levelWidth >> 1 || 1;
			levelHeight = levelHeight >> 1 || 1;
			alignedLevelWidth = levelWidth + blockWidth - 1 & ~(blockWidth - 1);
			alignedLevelHeight = levelHeight + blockHeight - 1 & ~(blockHeight - 1);
			levelSize = alignedLevelWidth * alignedLevelHeight * INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[format];
		}
		return buffers;
	};
	return CompressedTextureResource;
}(BlobResource);
/**
* Loader plugin for handling compressed textures for all platforms.
* @class
* @memberof PIXI
* @implements {PIXI.ILoaderPlugin}
*/
var CompressedTextureLoader = function() {
	function CompressedTextureLoader() {}
	/**
	* Called after a compressed-textures manifest is loaded.
	*
	* This will then load the correct compression format for the device. Your manifest should adhere
	* to the following schema:
	*
	* ```js
	* import { INTERNAL_FORMATS } from '@pixi/constants';
	*
	* type CompressedTextureManifest = {
	*  textures: Array<{ src: string, format?: keyof INTERNAL_FORMATS}>,
	*  cacheID: string;
	* };
	* ```
	*
	* This is an example of a .json manifest file
	*
	* ```json
	* {
	*   "cacheID":"asset",
	*   "textures":[
	*     { "src":"asset.fallback.png" },
	*     { "format":"COMPRESSED_RGBA_S3TC_DXT5_EXT", "src":"asset.s3tc.ktx" },
	*     { "format":"COMPRESSED_RGBA8_ETC2_EAC", "src":"asset.etc.ktx" },
	*     { "format":"RGBA_PVRTC_4BPPV1_IMG", "src":"asset.pvrtc.ktx" }
	*   ]
	* }
	* ```
	*/
	CompressedTextureLoader.use = function(resource, next) {
		var data = resource.data;
		var loader = this;
		if (resource.type === LoaderResource.TYPE.JSON && data && data.cacheID && data.textures) {
			var textures = data.textures;
			var textureURL = void 0;
			var fallbackURL = void 0;
			for (var i = 0, j = textures.length; i < j; i++) {
				var texture = textures[i];
				var url_1 = texture.src;
				var format = texture.format;
				if (!format) fallbackURL = url_1;
				if (CompressedTextureLoader.textureFormats[format]) {
					textureURL = url_1;
					break;
				}
			}
			textureURL = textureURL || fallbackURL;
			if (!textureURL) {
				next(/* @__PURE__ */ new Error("Cannot load compressed-textures in " + resource.url + ", make sure you provide a fallback"));
				return;
			}
			if (textureURL === resource.url) {
				next(/* @__PURE__ */ new Error("URL of compressed texture cannot be the same as the manifest's URL"));
				return;
			}
			var loadOptions = {
				crossOrigin: resource.crossOrigin,
				metadata: resource.metadata.imageMetadata,
				parentResource: resource
			};
			var resourcePath = url.resolve(resource.url.replace(loader.baseUrl, ""), textureURL);
			var resourceName = data.cacheID;
			loader.add(resourceName, resourcePath, loadOptions, function(res) {
				if (res.error) {
					next(res.error);
					return;
				}
				var _a = res.texture, texture = _a === void 0 ? null : _a, _b = res.textures;
				Object.assign(resource, {
					texture,
					textures: _b === void 0 ? {} : _b
				});
				next();
			});
		} else next();
	};
	Object.defineProperty(CompressedTextureLoader, "textureExtensions", {
		/**  Map of available texture extensions. */
		get: function() {
			if (!CompressedTextureLoader._textureExtensions) {
				var gl = settings.ADAPTER.createCanvas().getContext("webgl");
				if (!gl) {
					console.warn("WebGL not available for compressed textures. Silently failing.");
					return {};
				}
				CompressedTextureLoader._textureExtensions = {
					s3tc: gl.getExtension("WEBGL_compressed_texture_s3tc"),
					s3tc_sRGB: gl.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
					etc: gl.getExtension("WEBGL_compressed_texture_etc"),
					etc1: gl.getExtension("WEBGL_compressed_texture_etc1"),
					pvrtc: gl.getExtension("WEBGL_compressed_texture_pvrtc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
					atc: gl.getExtension("WEBGL_compressed_texture_atc"),
					astc: gl.getExtension("WEBGL_compressed_texture_astc")
				};
			}
			return CompressedTextureLoader._textureExtensions;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(CompressedTextureLoader, "textureFormats", {
		/** Map of available texture formats. */
		get: function() {
			if (!CompressedTextureLoader._textureFormats) {
				var extensions = CompressedTextureLoader.textureExtensions;
				CompressedTextureLoader._textureFormats = {};
				for (var extensionName in extensions) {
					var extension = extensions[extensionName];
					if (!extension) continue;
					Object.assign(CompressedTextureLoader._textureFormats, Object.getPrototypeOf(extension));
				}
			}
			return CompressedTextureLoader._textureFormats;
		},
		enumerable: false,
		configurable: true
	});
	/** @ignore */
	CompressedTextureLoader.extension = ExtensionType.Loader;
	return CompressedTextureLoader;
}();
/**
* Creates base-textures and textures for each compressed-texture resource and adds them into the global
* texture cache. The first texture has two IDs - `${url}`, `${url}-1`; while the rest have an ID of the
* form `${url}-i`.
* @param url - the original address of the resources
* @param resources - the resources backing texture data
* @ignore
*/
function registerCompressedTextures(url, resources, metadata) {
	var result = {
		textures: {},
		texture: null
	};
	if (!resources) return result;
	resources.map(function(resource) {
		return new Texture(new BaseTexture(resource, Object.assign({
			mipmap: MIPMAP_MODES.OFF,
			alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA
		}, metadata)));
	}).forEach(function(texture, i) {
		var baseTexture = texture.baseTexture;
		var cacheID = url + "-" + (i + 1);
		BaseTexture.addToCache(baseTexture, cacheID);
		Texture.addToCache(texture, cacheID);
		if (i === 0) {
			BaseTexture.addToCache(baseTexture, url);
			Texture.addToCache(texture, url);
			result.texture = texture;
		}
		result.textures[cacheID] = texture;
	});
	return result;
}
var _a$1;
var _b$1;
var DDS_MAGIC_SIZE = 4;
var DDS_HEADER_SIZE = 124;
var DDS_HEADER_PF_SIZE = 32;
var DDS_HEADER_DX10_SIZE = 20;
var DDS_MAGIC = 542327876;
/**
* DWORD offsets of the DDS file header fields (relative to file start).
* @ignore
*/
var DDS_FIELDS = {
	SIZE: 1,
	FLAGS: 2,
	HEIGHT: 3,
	WIDTH: 4,
	MIPMAP_COUNT: 7,
	PIXEL_FORMAT: 19
};
/**
* DWORD offsets of the DDS PIXEL_FORMAT fields.
* @ignore
*/
var DDS_PF_FIELDS = {
	SIZE: 0,
	FLAGS: 1,
	FOURCC: 2,
	RGB_BITCOUNT: 3,
	R_BIT_MASK: 4,
	G_BIT_MASK: 5,
	B_BIT_MASK: 6,
	A_BIT_MASK: 7
};
/**
* DWORD offsets of the DDS_HEADER_DX10 fields.
* @ignore
*/
var DDS_DX10_FIELDS = {
	DXGI_FORMAT: 0,
	RESOURCE_DIMENSION: 1,
	MISC_FLAG: 2,
	ARRAY_SIZE: 3,
	MISC_FLAGS2: 4
};
/**
* @see https://docs.microsoft.com/en-us/windows/win32/api/dxgiformat/ne-dxgiformat-dxgi_format
* @ignore
*/
var DXGI_FORMAT;
(function(DXGI_FORMAT) {
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_UNKNOWN"] = 0] = "DXGI_FORMAT_UNKNOWN";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32A32_TYPELESS"] = 1] = "DXGI_FORMAT_R32G32B32A32_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32A32_FLOAT"] = 2] = "DXGI_FORMAT_R32G32B32A32_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32A32_UINT"] = 3] = "DXGI_FORMAT_R32G32B32A32_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32A32_SINT"] = 4] = "DXGI_FORMAT_R32G32B32A32_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32_TYPELESS"] = 5] = "DXGI_FORMAT_R32G32B32_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32_FLOAT"] = 6] = "DXGI_FORMAT_R32G32B32_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32_UINT"] = 7] = "DXGI_FORMAT_R32G32B32_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32_SINT"] = 8] = "DXGI_FORMAT_R32G32B32_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_TYPELESS"] = 9] = "DXGI_FORMAT_R16G16B16A16_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_FLOAT"] = 10] = "DXGI_FORMAT_R16G16B16A16_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_UNORM"] = 11] = "DXGI_FORMAT_R16G16B16A16_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_UINT"] = 12] = "DXGI_FORMAT_R16G16B16A16_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_SNORM"] = 13] = "DXGI_FORMAT_R16G16B16A16_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_SINT"] = 14] = "DXGI_FORMAT_R16G16B16A16_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32_TYPELESS"] = 15] = "DXGI_FORMAT_R32G32_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32_FLOAT"] = 16] = "DXGI_FORMAT_R32G32_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32_UINT"] = 17] = "DXGI_FORMAT_R32G32_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32_SINT"] = 18] = "DXGI_FORMAT_R32G32_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G8X24_TYPELESS"] = 19] = "DXGI_FORMAT_R32G8X24_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_D32_FLOAT_S8X24_UINT"] = 20] = "DXGI_FORMAT_D32_FLOAT_S8X24_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS"] = 21] = "DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_X32_TYPELESS_G8X24_UINT"] = 22] = "DXGI_FORMAT_X32_TYPELESS_G8X24_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R10G10B10A2_TYPELESS"] = 23] = "DXGI_FORMAT_R10G10B10A2_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R10G10B10A2_UNORM"] = 24] = "DXGI_FORMAT_R10G10B10A2_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R10G10B10A2_UINT"] = 25] = "DXGI_FORMAT_R10G10B10A2_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R11G11B10_FLOAT"] = 26] = "DXGI_FORMAT_R11G11B10_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_TYPELESS"] = 27] = "DXGI_FORMAT_R8G8B8A8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_UNORM"] = 28] = "DXGI_FORMAT_R8G8B8A8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_UNORM_SRGB"] = 29] = "DXGI_FORMAT_R8G8B8A8_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_UINT"] = 30] = "DXGI_FORMAT_R8G8B8A8_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_SNORM"] = 31] = "DXGI_FORMAT_R8G8B8A8_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_SINT"] = 32] = "DXGI_FORMAT_R8G8B8A8_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_TYPELESS"] = 33] = "DXGI_FORMAT_R16G16_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_FLOAT"] = 34] = "DXGI_FORMAT_R16G16_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_UNORM"] = 35] = "DXGI_FORMAT_R16G16_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_UINT"] = 36] = "DXGI_FORMAT_R16G16_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_SNORM"] = 37] = "DXGI_FORMAT_R16G16_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_SINT"] = 38] = "DXGI_FORMAT_R16G16_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32_TYPELESS"] = 39] = "DXGI_FORMAT_R32_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_D32_FLOAT"] = 40] = "DXGI_FORMAT_D32_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32_FLOAT"] = 41] = "DXGI_FORMAT_R32_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32_UINT"] = 42] = "DXGI_FORMAT_R32_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32_SINT"] = 43] = "DXGI_FORMAT_R32_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R24G8_TYPELESS"] = 44] = "DXGI_FORMAT_R24G8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_D24_UNORM_S8_UINT"] = 45] = "DXGI_FORMAT_D24_UNORM_S8_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R24_UNORM_X8_TYPELESS"] = 46] = "DXGI_FORMAT_R24_UNORM_X8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_X24_TYPELESS_G8_UINT"] = 47] = "DXGI_FORMAT_X24_TYPELESS_G8_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_TYPELESS"] = 48] = "DXGI_FORMAT_R8G8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_UNORM"] = 49] = "DXGI_FORMAT_R8G8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_UINT"] = 50] = "DXGI_FORMAT_R8G8_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_SNORM"] = 51] = "DXGI_FORMAT_R8G8_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_SINT"] = 52] = "DXGI_FORMAT_R8G8_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_TYPELESS"] = 53] = "DXGI_FORMAT_R16_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_FLOAT"] = 54] = "DXGI_FORMAT_R16_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_D16_UNORM"] = 55] = "DXGI_FORMAT_D16_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_UNORM"] = 56] = "DXGI_FORMAT_R16_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_UINT"] = 57] = "DXGI_FORMAT_R16_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_SNORM"] = 58] = "DXGI_FORMAT_R16_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_SINT"] = 59] = "DXGI_FORMAT_R16_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8_TYPELESS"] = 60] = "DXGI_FORMAT_R8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8_UNORM"] = 61] = "DXGI_FORMAT_R8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8_UINT"] = 62] = "DXGI_FORMAT_R8_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8_SNORM"] = 63] = "DXGI_FORMAT_R8_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8_SINT"] = 64] = "DXGI_FORMAT_R8_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_A8_UNORM"] = 65] = "DXGI_FORMAT_A8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R1_UNORM"] = 66] = "DXGI_FORMAT_R1_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R9G9B9E5_SHAREDEXP"] = 67] = "DXGI_FORMAT_R9G9B9E5_SHAREDEXP";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_B8G8_UNORM"] = 68] = "DXGI_FORMAT_R8G8_B8G8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_G8R8_G8B8_UNORM"] = 69] = "DXGI_FORMAT_G8R8_G8B8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC1_TYPELESS"] = 70] = "DXGI_FORMAT_BC1_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC1_UNORM"] = 71] = "DXGI_FORMAT_BC1_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC1_UNORM_SRGB"] = 72] = "DXGI_FORMAT_BC1_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC2_TYPELESS"] = 73] = "DXGI_FORMAT_BC2_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC2_UNORM"] = 74] = "DXGI_FORMAT_BC2_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC2_UNORM_SRGB"] = 75] = "DXGI_FORMAT_BC2_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC3_TYPELESS"] = 76] = "DXGI_FORMAT_BC3_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC3_UNORM"] = 77] = "DXGI_FORMAT_BC3_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC3_UNORM_SRGB"] = 78] = "DXGI_FORMAT_BC3_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC4_TYPELESS"] = 79] = "DXGI_FORMAT_BC4_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC4_UNORM"] = 80] = "DXGI_FORMAT_BC4_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC4_SNORM"] = 81] = "DXGI_FORMAT_BC4_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC5_TYPELESS"] = 82] = "DXGI_FORMAT_BC5_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC5_UNORM"] = 83] = "DXGI_FORMAT_BC5_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC5_SNORM"] = 84] = "DXGI_FORMAT_BC5_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B5G6R5_UNORM"] = 85] = "DXGI_FORMAT_B5G6R5_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B5G5R5A1_UNORM"] = 86] = "DXGI_FORMAT_B5G5R5A1_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8A8_UNORM"] = 87] = "DXGI_FORMAT_B8G8R8A8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8X8_UNORM"] = 88] = "DXGI_FORMAT_B8G8R8X8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM"] = 89] = "DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8A8_TYPELESS"] = 90] = "DXGI_FORMAT_B8G8R8A8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8A8_UNORM_SRGB"] = 91] = "DXGI_FORMAT_B8G8R8A8_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8X8_TYPELESS"] = 92] = "DXGI_FORMAT_B8G8R8X8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8X8_UNORM_SRGB"] = 93] = "DXGI_FORMAT_B8G8R8X8_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC6H_TYPELESS"] = 94] = "DXGI_FORMAT_BC6H_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC6H_UF16"] = 95] = "DXGI_FORMAT_BC6H_UF16";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC6H_SF16"] = 96] = "DXGI_FORMAT_BC6H_SF16";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC7_TYPELESS"] = 97] = "DXGI_FORMAT_BC7_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC7_UNORM"] = 98] = "DXGI_FORMAT_BC7_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC7_UNORM_SRGB"] = 99] = "DXGI_FORMAT_BC7_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_AYUV"] = 100] = "DXGI_FORMAT_AYUV";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_Y410"] = 101] = "DXGI_FORMAT_Y410";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_Y416"] = 102] = "DXGI_FORMAT_Y416";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_NV12"] = 103] = "DXGI_FORMAT_NV12";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_P010"] = 104] = "DXGI_FORMAT_P010";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_P016"] = 105] = "DXGI_FORMAT_P016";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_420_OPAQUE"] = 106] = "DXGI_FORMAT_420_OPAQUE";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_YUY2"] = 107] = "DXGI_FORMAT_YUY2";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_Y210"] = 108] = "DXGI_FORMAT_Y210";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_Y216"] = 109] = "DXGI_FORMAT_Y216";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_NV11"] = 110] = "DXGI_FORMAT_NV11";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_AI44"] = 111] = "DXGI_FORMAT_AI44";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_IA44"] = 112] = "DXGI_FORMAT_IA44";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_P8"] = 113] = "DXGI_FORMAT_P8";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_A8P8"] = 114] = "DXGI_FORMAT_A8P8";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B4G4R4A4_UNORM"] = 115] = "DXGI_FORMAT_B4G4R4A4_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_P208"] = 116] = "DXGI_FORMAT_P208";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_V208"] = 117] = "DXGI_FORMAT_V208";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_V408"] = 118] = "DXGI_FORMAT_V408";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE"] = 119] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE"] = 120] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_FORCE_UINT"] = 121] = "DXGI_FORMAT_FORCE_UINT";
})(DXGI_FORMAT || (DXGI_FORMAT = {}));
/**
* Possible values of the field {@link DDS_DX10_FIELDS.RESOURCE_DIMENSION}
* @ignore
*/
var D3D10_RESOURCE_DIMENSION;
(function(D3D10_RESOURCE_DIMENSION) {
	D3D10_RESOURCE_DIMENSION[D3D10_RESOURCE_DIMENSION["DDS_DIMENSION_TEXTURE1D"] = 2] = "DDS_DIMENSION_TEXTURE1D";
	D3D10_RESOURCE_DIMENSION[D3D10_RESOURCE_DIMENSION["DDS_DIMENSION_TEXTURE2D"] = 3] = "DDS_DIMENSION_TEXTURE2D";
	D3D10_RESOURCE_DIMENSION[D3D10_RESOURCE_DIMENSION["DDS_DIMENSION_TEXTURE3D"] = 6] = "DDS_DIMENSION_TEXTURE3D";
})(D3D10_RESOURCE_DIMENSION || (D3D10_RESOURCE_DIMENSION = {}));
var PF_FLAGS = 1;
var DDPF_ALPHA = 2;
var DDPF_FOURCC = 4;
var DDPF_RGB = 64;
var DDPF_YUV = 512;
var DDPF_LUMINANCE = 131072;
var FOURCC_DXT1 = 827611204;
var FOURCC_DXT3 = 861165636;
var FOURCC_DXT5 = 894720068;
var FOURCC_DX10 = 808540228;
var DDS_RESOURCE_MISC_TEXTURECUBE = 4;
/**
* Maps `FOURCC_*` formats to internal formats (see {@link PIXI.INTERNAL_FORMATS}).
* @ignore
*/
var FOURCC_TO_FORMAT = (_a$1 = {}, _a$1[FOURCC_DXT1] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT, _a$1[FOURCC_DXT3] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT, _a$1[FOURCC_DXT5] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT, _a$1);
/**
* Maps {@link DXGI_FORMAT} to types/internal-formats (see {@link PIXI.TYPES}, {@link PIXI.INTERNAL_FORMATS})
* @ignore
*/
var DXGI_TO_FORMAT = (_b$1 = {}, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC1_TYPELESS] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC1_UNORM] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC2_TYPELESS] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC2_UNORM] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC3_TYPELESS] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC3_UNORM] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC1_UNORM_SRGB] = INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC2_UNORM_SRGB] = INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC3_UNORM_SRGB] = INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT, _b$1);
/**
* @class
* @memberof PIXI
* @implements {PIXI.ILoaderPlugin}
* @see https://docs.microsoft.com/en-us/windows/win32/direct3ddds/dx-graphics-dds-pguide
*/
/**
* Parses the DDS file header, generates base-textures, and puts them into the texture cache.
* @param arrayBuffer
*/
function parseDDS(arrayBuffer) {
	var data = new Uint32Array(arrayBuffer);
	if (data[0] !== DDS_MAGIC) throw new Error("Invalid DDS file magic word");
	var header = new Uint32Array(arrayBuffer, 0, DDS_HEADER_SIZE / Uint32Array.BYTES_PER_ELEMENT);
	var height = header[DDS_FIELDS.HEIGHT];
	var width = header[DDS_FIELDS.WIDTH];
	var mipmapCount = header[DDS_FIELDS.MIPMAP_COUNT];
	var pixelFormat = new Uint32Array(arrayBuffer, DDS_FIELDS.PIXEL_FORMAT * Uint32Array.BYTES_PER_ELEMENT, DDS_HEADER_PF_SIZE / Uint32Array.BYTES_PER_ELEMENT);
	var formatFlags = pixelFormat[PF_FLAGS];
	if (formatFlags & DDPF_FOURCC) {
		var fourCC = pixelFormat[DDS_PF_FIELDS.FOURCC];
		if (fourCC !== FOURCC_DX10) {
			var internalFormat_1 = FOURCC_TO_FORMAT[fourCC];
			var dataOffset_1 = DDS_MAGIC_SIZE + DDS_HEADER_SIZE;
			return [new CompressedTextureResource(new Uint8Array(arrayBuffer, dataOffset_1), {
				format: internalFormat_1,
				width,
				height,
				levels: mipmapCount
			})];
		}
		var dx10Offset = DDS_MAGIC_SIZE + DDS_HEADER_SIZE;
		var dx10Header = new Uint32Array(data.buffer, dx10Offset, DDS_HEADER_DX10_SIZE / Uint32Array.BYTES_PER_ELEMENT);
		var dxgiFormat = dx10Header[DDS_DX10_FIELDS.DXGI_FORMAT];
		var resourceDimension = dx10Header[DDS_DX10_FIELDS.RESOURCE_DIMENSION];
		var miscFlag = dx10Header[DDS_DX10_FIELDS.MISC_FLAG];
		var arraySize = dx10Header[DDS_DX10_FIELDS.ARRAY_SIZE];
		var internalFormat_2 = DXGI_TO_FORMAT[dxgiFormat];
		if (internalFormat_2 === void 0) throw new Error("DDSParser cannot parse texture data with DXGI format " + dxgiFormat);
		if (miscFlag === DDS_RESOURCE_MISC_TEXTURECUBE) throw new Error("DDSParser does not support cubemap textures");
		if (resourceDimension === D3D10_RESOURCE_DIMENSION.DDS_DIMENSION_TEXTURE3D) throw new Error("DDSParser does not supported 3D texture data");
		var imageBuffers = new Array();
		var dataOffset = DDS_MAGIC_SIZE + DDS_HEADER_SIZE + DDS_HEADER_DX10_SIZE;
		if (arraySize === 1) imageBuffers.push(new Uint8Array(arrayBuffer, dataOffset));
		else {
			var pixelSize = INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[internalFormat_2];
			var imageSize = 0;
			var levelWidth = width;
			var levelHeight = height;
			for (var i = 0; i < mipmapCount; i++) {
				var levelSize = Math.max(1, levelWidth + 3 & -4) * Math.max(1, levelHeight + 3 & -4) * pixelSize;
				imageSize += levelSize;
				levelWidth = levelWidth >>> 1;
				levelHeight = levelHeight >>> 1;
			}
			var imageOffset = dataOffset;
			for (var i = 0; i < arraySize; i++) {
				imageBuffers.push(new Uint8Array(arrayBuffer, imageOffset, imageSize));
				imageOffset += imageSize;
			}
		}
		return imageBuffers.map(function(buffer) {
			return new CompressedTextureResource(buffer, {
				format: internalFormat_2,
				width,
				height,
				levels: mipmapCount
			});
		});
	}
	if (formatFlags & DDPF_RGB) throw new Error("DDSParser does not support uncompressed texture data.");
	if (formatFlags & DDPF_YUV) throw new Error("DDSParser does not supported YUV uncompressed texture data.");
	if (formatFlags & DDPF_LUMINANCE) throw new Error("DDSParser does not support single-channel (lumninance) texture data!");
	if (formatFlags & DDPF_ALPHA) throw new Error("DDSParser does not support single-channel (alpha) texture data!");
	throw new Error("DDSParser failed to load a texture file due to an unknown reason!");
}
var _a;
var _b;
var _c;
/**
* The 12-byte KTX file identifier
* @see https://www.khronos.org/opengles/sdk/tools/KTX/file_format_spec/#2.1
* @ignore
*/
var FILE_IDENTIFIER = [
	171,
	75,
	84,
	88,
	32,
	49,
	49,
	187,
	13,
	10,
	26,
	10
];
/**
* The value stored in the "endianness" field.
* @see https://www.khronos.org/opengles/sdk/tools/KTX/file_format_spec/#2.2
* @ignore
*/
var ENDIANNESS = 67305985;
/**
* Byte offsets of the KTX file header fields
* @ignore
*/
var KTX_FIELDS = {
	FILE_IDENTIFIER: 0,
	ENDIANNESS: 12,
	GL_TYPE: 16,
	GL_TYPE_SIZE: 20,
	GL_FORMAT: 24,
	GL_INTERNAL_FORMAT: 28,
	GL_BASE_INTERNAL_FORMAT: 32,
	PIXEL_WIDTH: 36,
	PIXEL_HEIGHT: 40,
	PIXEL_DEPTH: 44,
	NUMBER_OF_ARRAY_ELEMENTS: 48,
	NUMBER_OF_FACES: 52,
	NUMBER_OF_MIPMAP_LEVELS: 56,
	BYTES_OF_KEY_VALUE_DATA: 60
};
/**
* Byte size of the file header fields in {@code KTX_FIELDS}
* @ignore
*/
var FILE_HEADER_SIZE = 64;
/**
* Maps {@link PIXI.TYPES} to the bytes taken per component, excluding those ones that are bit-fields.
* @ignore
*/
var TYPES_TO_BYTES_PER_COMPONENT = (_a = {}, _a[TYPES.UNSIGNED_BYTE] = 1, _a[TYPES.UNSIGNED_SHORT] = 2, _a[TYPES.INT] = 4, _a[TYPES.UNSIGNED_INT] = 4, _a[TYPES.FLOAT] = 4, _a[TYPES.HALF_FLOAT] = 8, _a);
/**
* Number of components in each {@link PIXI.FORMATS}
* @ignore
*/
var FORMATS_TO_COMPONENTS = (_b = {}, _b[FORMATS.RGBA] = 4, _b[FORMATS.RGB] = 3, _b[FORMATS.RG] = 2, _b[FORMATS.RED] = 1, _b[FORMATS.LUMINANCE] = 1, _b[FORMATS.LUMINANCE_ALPHA] = 2, _b[FORMATS.ALPHA] = 1, _b);
/**
* Number of bytes per pixel in bit-field types in {@link PIXI.TYPES}
* @ignore
*/
var TYPES_TO_BYTES_PER_PIXEL = (_c = {}, _c[TYPES.UNSIGNED_SHORT_4_4_4_4] = 2, _c[TYPES.UNSIGNED_SHORT_5_5_5_1] = 2, _c[TYPES.UNSIGNED_SHORT_5_6_5] = 2, _c);
function parseKTX(url, arrayBuffer, loadKeyValueData) {
	if (loadKeyValueData === void 0) loadKeyValueData = false;
	var dataView = new DataView(arrayBuffer);
	if (!validate(url, dataView)) return null;
	var littleEndian = dataView.getUint32(KTX_FIELDS.ENDIANNESS, true) === ENDIANNESS;
	var glType = dataView.getUint32(KTX_FIELDS.GL_TYPE, littleEndian);
	var glFormat = dataView.getUint32(KTX_FIELDS.GL_FORMAT, littleEndian);
	var glInternalFormat = dataView.getUint32(KTX_FIELDS.GL_INTERNAL_FORMAT, littleEndian);
	var pixelWidth = dataView.getUint32(KTX_FIELDS.PIXEL_WIDTH, littleEndian);
	var pixelHeight = dataView.getUint32(KTX_FIELDS.PIXEL_HEIGHT, littleEndian) || 1;
	var pixelDepth = dataView.getUint32(KTX_FIELDS.PIXEL_DEPTH, littleEndian) || 1;
	var numberOfArrayElements = dataView.getUint32(KTX_FIELDS.NUMBER_OF_ARRAY_ELEMENTS, littleEndian) || 1;
	var numberOfFaces = dataView.getUint32(KTX_FIELDS.NUMBER_OF_FACES, littleEndian);
	var numberOfMipmapLevels = dataView.getUint32(KTX_FIELDS.NUMBER_OF_MIPMAP_LEVELS, littleEndian);
	var bytesOfKeyValueData = dataView.getUint32(KTX_FIELDS.BYTES_OF_KEY_VALUE_DATA, littleEndian);
	if (pixelHeight === 0 || pixelDepth !== 1) throw new Error("Only 2D textures are supported");
	if (numberOfFaces !== 1) throw new Error("CubeTextures are not supported by KTXLoader yet!");
	if (numberOfArrayElements !== 1) throw new Error("WebGL does not support array textures");
	var blockWidth = 4;
	var blockHeight = 4;
	var alignedWidth = pixelWidth + 3 & -4;
	var alignedHeight = pixelHeight + 3 & -4;
	var imageBuffers = new Array(numberOfArrayElements);
	var imagePixels = pixelWidth * pixelHeight;
	if (glType === 0) imagePixels = alignedWidth * alignedHeight;
	var imagePixelByteSize;
	if (glType !== 0) if (TYPES_TO_BYTES_PER_COMPONENT[glType]) imagePixelByteSize = TYPES_TO_BYTES_PER_COMPONENT[glType] * FORMATS_TO_COMPONENTS[glFormat];
	else imagePixelByteSize = TYPES_TO_BYTES_PER_PIXEL[glType];
	else imagePixelByteSize = INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[glInternalFormat];
	if (imagePixelByteSize === void 0) throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
	var kvData = loadKeyValueData ? parseKvData(dataView, bytesOfKeyValueData, littleEndian) : null;
	var mipByteSize = imagePixels * imagePixelByteSize;
	var mipWidth = pixelWidth;
	var mipHeight = pixelHeight;
	var alignedMipWidth = alignedWidth;
	var alignedMipHeight = alignedHeight;
	var imageOffset = FILE_HEADER_SIZE + bytesOfKeyValueData;
	for (var mipmapLevel = 0; mipmapLevel < numberOfMipmapLevels; mipmapLevel++) {
		var imageSize = dataView.getUint32(imageOffset, littleEndian);
		var elementOffset = imageOffset + 4;
		for (var arrayElement = 0; arrayElement < numberOfArrayElements; arrayElement++) {
			var mips = imageBuffers[arrayElement];
			if (!mips) mips = imageBuffers[arrayElement] = new Array(numberOfMipmapLevels);
			mips[mipmapLevel] = {
				levelID: mipmapLevel,
				levelWidth: numberOfMipmapLevels > 1 || glType !== 0 ? mipWidth : alignedMipWidth,
				levelHeight: numberOfMipmapLevels > 1 || glType !== 0 ? mipHeight : alignedMipHeight,
				levelBuffer: new Uint8Array(arrayBuffer, elementOffset, mipByteSize)
			};
			elementOffset += mipByteSize;
		}
		imageOffset += imageSize + 4;
		imageOffset = imageOffset % 4 !== 0 ? imageOffset + 4 - imageOffset % 4 : imageOffset;
		mipWidth = mipWidth >> 1 || 1;
		mipHeight = mipHeight >> 1 || 1;
		alignedMipWidth = mipWidth + blockWidth - 1 & ~(blockWidth - 1);
		alignedMipHeight = mipHeight + blockHeight - 1 & ~(blockHeight - 1);
		mipByteSize = alignedMipWidth * alignedMipHeight * imagePixelByteSize;
	}
	if (glType !== 0) return {
		uncompressed: imageBuffers.map(function(levelBuffers) {
			var buffer = levelBuffers[0].levelBuffer;
			var convertToInt = false;
			if (glType === TYPES.FLOAT) buffer = new Float32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4);
			else if (glType === TYPES.UNSIGNED_INT) {
				convertToInt = true;
				buffer = new Uint32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4);
			} else if (glType === TYPES.INT) {
				convertToInt = true;
				buffer = new Int32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4);
			}
			return {
				resource: new BufferResource(buffer, {
					width: levelBuffers[0].levelWidth,
					height: levelBuffers[0].levelHeight
				}),
				type: glType,
				format: convertToInt ? convertFormatToInteger(glFormat) : glFormat
			};
		}),
		kvData
	};
	return {
		compressed: imageBuffers.map(function(levelBuffers) {
			return new CompressedTextureResource(null, {
				format: glInternalFormat,
				width: pixelWidth,
				height: pixelHeight,
				levels: numberOfMipmapLevels,
				levelBuffers
			});
		}),
		kvData
	};
}
/**
* Checks whether the arrayBuffer contains a valid *.ktx file.
* @param url
* @param dataView
*/
function validate(url, dataView) {
	for (var i = 0; i < FILE_IDENTIFIER.length; i++) if (dataView.getUint8(i) !== FILE_IDENTIFIER[i]) {
		console.error(url + " is not a valid *.ktx file!");
		return false;
	}
	return true;
}
function convertFormatToInteger(format) {
	switch (format) {
		case FORMATS.RGBA: return FORMATS.RGBA_INTEGER;
		case FORMATS.RGB: return FORMATS.RGB_INTEGER;
		case FORMATS.RG: return FORMATS.RG_INTEGER;
		case FORMATS.RED: return FORMATS.RED_INTEGER;
		default: return format;
	}
}
function parseKvData(dataView, bytesOfKeyValueData, littleEndian) {
	var kvData = /* @__PURE__ */ new Map();
	var bytesIntoKeyValueData = 0;
	while (bytesIntoKeyValueData < bytesOfKeyValueData) {
		var keyAndValueByteSize = dataView.getUint32(FILE_HEADER_SIZE + bytesIntoKeyValueData, littleEndian);
		var keyAndValueByteOffset = FILE_HEADER_SIZE + bytesIntoKeyValueData + 4;
		var valuePadding = 3 - (keyAndValueByteSize + 3) % 4;
		if (keyAndValueByteSize === 0 || keyAndValueByteSize > bytesOfKeyValueData - bytesIntoKeyValueData) {
			console.error("KTXLoader: keyAndValueByteSize out of bounds");
			break;
		}
		var keyNulByte = 0;
		for (; keyNulByte < keyAndValueByteSize; keyNulByte++) if (dataView.getUint8(keyAndValueByteOffset + keyNulByte) === 0) break;
		if (keyNulByte === -1) {
			console.error("KTXLoader: Failed to find null byte terminating kvData key");
			break;
		}
		var key = new TextDecoder().decode(new Uint8Array(dataView.buffer, keyAndValueByteOffset, keyNulByte));
		var value = new DataView(dataView.buffer, keyAndValueByteOffset + keyNulByte + 1, keyAndValueByteSize - keyNulByte - 1);
		kvData.set(key, value);
		bytesIntoKeyValueData += 4 + keyAndValueByteSize + valuePadding;
	}
	return kvData;
}
LoaderResource.setExtensionXhrType("dds", LoaderResource.XHR_RESPONSE_TYPE.BUFFER);
/**
* @class
* @memberof PIXI
* @implements {PIXI.ILoaderPlugin}
* @see https://docs.microsoft.com/en-us/windows/win32/direct3ddds/dx-graphics-dds-pguide
*/
var DDSLoader = function() {
	function DDSLoader() {}
	/**
	* Registers a DDS compressed texture
	* @see PIXI.Loader.loaderMiddleware
	* @param resource - loader resource that is checked to see if it is a DDS file
	* @param next - callback Function to call when done
	*/
	DDSLoader.use = function(resource, next) {
		if (resource.extension === "dds" && resource.data) try {
			Object.assign(resource, registerCompressedTextures(resource.name || resource.url, parseDDS(resource.data), resource.metadata));
		} catch (err) {
			next(err);
			return;
		}
		next();
	};
	/** @ignore */
	DDSLoader.extension = ExtensionType.Loader;
	return DDSLoader;
}();
LoaderResource.setExtensionXhrType("ktx", LoaderResource.XHR_RESPONSE_TYPE.BUFFER);
/**
* Loader plugin for handling KTX texture container files.
*
* This KTX loader does not currently support the following features:
* * cube textures
* * 3D textures
* * endianness conversion for big-endian machines
* * embedded *.basis files
*
* It does supports the following features:
* * multiple textures per file
* * mipmapping (only for compressed formats)
* * vendor-specific key/value data parsing (enable {@link PIXI.KTXLoader.loadKeyValueData})
* @class
* @memberof PIXI
* @implements {PIXI.ILoaderPlugin}
*/
var KTXLoader = function() {
	function KTXLoader() {}
	/**
	* Called after a KTX file is loaded.
	*
	* This will parse the KTX file header and add a {@code BaseTexture} to the texture
	* cache.
	* @see PIXI.Loader.loaderMiddleware
	* @param resource - loader resource that is checked to see if it is a KTX file
	* @param next - callback Function to call when done
	*/
	KTXLoader.use = function(resource, next) {
		if (resource.extension === "ktx" && resource.data) try {
			var url_1 = resource.name || resource.url;
			var _a = parseKTX(url_1, resource.data, this.loadKeyValueData), compressed = _a.compressed, uncompressed = _a.uncompressed, kvData_1 = _a.kvData;
			if (compressed) {
				var result = registerCompressedTextures(url_1, compressed, resource.metadata);
				if (kvData_1 && result.textures) for (var textureId in result.textures) result.textures[textureId].baseTexture.ktxKeyValueData = kvData_1;
				Object.assign(resource, result);
			} else if (uncompressed) {
				var textures_1 = {};
				uncompressed.forEach(function(image, i) {
					var texture = new Texture(new BaseTexture(image.resource, {
						mipmap: MIPMAP_MODES.OFF,
						alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
						type: image.type,
						format: image.format
					}));
					var cacheID = url_1 + "-" + (i + 1);
					if (kvData_1) texture.baseTexture.ktxKeyValueData = kvData_1;
					BaseTexture.addToCache(texture.baseTexture, cacheID);
					Texture.addToCache(texture, cacheID);
					if (i === 0) {
						textures_1[url_1] = texture;
						BaseTexture.addToCache(texture.baseTexture, url_1);
						Texture.addToCache(texture, url_1);
					}
					textures_1[cacheID] = texture;
				});
				Object.assign(resource, { textures: textures_1 });
			}
		} catch (err) {
			next(err);
			return;
		}
		next();
	};
	/** @ignore */
	KTXLoader.extension = ExtensionType.Loader;
	/**
	* If set to `true`, {@link PIXI.KTXLoader} will parse key-value data in KTX textures. This feature relies
	* on the [Encoding Standard]{@link https://encoding.spec.whatwg.org}.
	*
	* The key-value data will be available on the base-textures as {@code PIXI.BaseTexture.ktxKeyValueData}. They
	* will hold a reference to the texture data buffer, so make sure to delete key-value data once you are done
	* using it.
	*/
	KTXLoader.loadKeyValueData = false;
	return KTXLoader;
}();
//#endregion
export { FORMATS_TO_COMPONENTS as a, KTXLoader as c, parseDDS as d, parseKTX as f, TextureLoader as g, LoaderResource as h, DDSLoader as i, TYPES_TO_BYTES_PER_COMPONENT as l, Loader as m, CompressedTextureLoader as n, INTERNAL_FORMATS as o, AppLoaderPlugin as p, CompressedTextureResource as r, INTERNAL_FORMAT_TO_BYTES_PER_PIXEL as s, BlobResource as t, TYPES_TO_BYTES_PER_PIXEL as u };
