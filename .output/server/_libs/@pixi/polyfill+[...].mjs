import { r as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { Rn as performance_default } from "./accessibility+[...].mjs";
import { setImmediate } from "node:timers";
//#region node_modules/unenv/dist/runtime/polyfill/globalthis.mjs
var globalthis_default = globalThis;
//#endregion
//#region node_modules/promise-polyfill/src/finally.js
/**
* @this {Promise}
*/
function finallyConstructor(callback) {
	var constructor = this.constructor;
	return this.then(function(value) {
		return constructor.resolve(callback()).then(function() {
			return value;
		});
	}, function(reason) {
		return constructor.resolve(callback()).then(function() {
			return constructor.reject(reason);
		});
	});
}
//#endregion
//#region node_modules/promise-polyfill/src/allSettled.js
function allSettled(arr) {
	return new this(function(resolve, reject) {
		if (!(arr && typeof arr.length !== "undefined")) return reject(/* @__PURE__ */ new TypeError(typeof arr + " " + arr + " is not iterable(cannot read property Symbol(Symbol.iterator))"));
		var args = Array.prototype.slice.call(arr);
		if (args.length === 0) return resolve([]);
		var remaining = args.length;
		function res(i, val) {
			if (val && (typeof val === "object" || typeof val === "function")) {
				var then = val.then;
				if (typeof then === "function") {
					then.call(val, function(val) {
						res(i, val);
					}, function(e) {
						args[i] = {
							status: "rejected",
							reason: e
						};
						if (--remaining === 0) resolve(args);
					});
					return;
				}
			}
			args[i] = {
				status: "fulfilled",
				value: val
			};
			if (--remaining === 0) resolve(args);
		}
		for (var i = 0; i < args.length; i++) res(i, args[i]);
	});
}
//#endregion
//#region node_modules/promise-polyfill/src/any.js
/**
* @constructor
*/
function AggregateError(errors, message) {
	this.name = "AggregateError", this.errors = errors;
	this.message = message || "";
}
AggregateError.prototype = Error.prototype;
function any(arr) {
	var P = this;
	return new P(function(resolve, reject) {
		if (!(arr && typeof arr.length !== "undefined")) return reject(/* @__PURE__ */ new TypeError("Promise.any accepts an array"));
		var args = Array.prototype.slice.call(arr);
		if (args.length === 0) return reject();
		var rejectionReasons = [];
		for (var i = 0; i < args.length; i++) try {
			P.resolve(args[i]).then(resolve).catch(function(error) {
				rejectionReasons.push(error);
				if (rejectionReasons.length === args.length) reject(new AggregateError(rejectionReasons, "All promises were rejected"));
			});
		} catch (ex) {
			reject(ex);
		}
	});
}
//#endregion
//#region node_modules/promise-polyfill/src/index.js
var setTimeoutFunc = setTimeout;
function isArray(x) {
	return Boolean(x && typeof x.length !== "undefined");
}
function noop() {}
function bind(fn, thisArg) {
	return function() {
		fn.apply(thisArg, arguments);
	};
}
/**
* @constructor
* @param {Function} fn
*/
function Promise$1(fn) {
	if (!(this instanceof Promise$1)) throw new TypeError("Promises must be constructed via new");
	if (typeof fn !== "function") throw new TypeError("not a function");
	/** @type {!number} */
	this._state = 0;
	/** @type {!boolean} */
	this._handled = false;
	/** @type {Promise|undefined} */
	this._value = void 0;
	/** @type {!Array<!Function>} */
	this._deferreds = [];
	doResolve(fn, this);
}
function handle(self, deferred) {
	while (self._state === 3) self = self._value;
	if (self._state === 0) {
		self._deferreds.push(deferred);
		return;
	}
	self._handled = true;
	Promise$1._immediateFn(function() {
		var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
		if (cb === null) {
			(self._state === 1 ? resolve : reject)(deferred.promise, self._value);
			return;
		}
		var ret;
		try {
			ret = cb(self._value);
		} catch (e) {
			reject(deferred.promise, e);
			return;
		}
		resolve(deferred.promise, ret);
	});
}
function resolve(self, newValue) {
	try {
		if (newValue === self) throw new TypeError("A promise cannot be resolved with itself.");
		if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
			var then = newValue.then;
			if (newValue instanceof Promise$1) {
				self._state = 3;
				self._value = newValue;
				finale(self);
				return;
			} else if (typeof then === "function") {
				doResolve(bind(then, newValue), self);
				return;
			}
		}
		self._state = 1;
		self._value = newValue;
		finale(self);
	} catch (e) {
		reject(self, e);
	}
}
function reject(self, newValue) {
	self._state = 2;
	self._value = newValue;
	finale(self);
}
function finale(self) {
	if (self._state === 2 && self._deferreds.length === 0) Promise$1._immediateFn(function() {
		if (!self._handled) Promise$1._unhandledRejectionFn(self._value);
	});
	for (var i = 0, len = self._deferreds.length; i < len; i++) handle(self, self._deferreds[i]);
	self._deferreds = null;
}
/**
* @constructor
*/
function Handler(onFulfilled, onRejected, promise) {
	this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
	this.onRejected = typeof onRejected === "function" ? onRejected : null;
	this.promise = promise;
}
/**
* Take a potentially misbehaving resolver function and make sure
* onFulfilled and onRejected are only called once.
*
* Makes no guarantees about asynchrony.
*/
function doResolve(fn, self) {
	var done = false;
	try {
		fn(function(value) {
			if (done) return;
			done = true;
			resolve(self, value);
		}, function(reason) {
			if (done) return;
			done = true;
			reject(self, reason);
		});
	} catch (ex) {
		if (done) return;
		done = true;
		reject(self, ex);
	}
}
Promise$1.prototype["catch"] = function(onRejected) {
	return this.then(null, onRejected);
};
Promise$1.prototype.then = function(onFulfilled, onRejected) {
	var prom = new this.constructor(noop);
	handle(this, new Handler(onFulfilled, onRejected, prom));
	return prom;
};
Promise$1.prototype["finally"] = finallyConstructor;
Promise$1.all = function(arr) {
	return new Promise$1(function(resolve, reject) {
		if (!isArray(arr)) return reject(/* @__PURE__ */ new TypeError("Promise.all accepts an array"));
		var args = Array.prototype.slice.call(arr);
		if (args.length === 0) return resolve([]);
		var remaining = args.length;
		function res(i, val) {
			try {
				if (val && (typeof val === "object" || typeof val === "function")) {
					var then = val.then;
					if (typeof then === "function") {
						then.call(val, function(val) {
							res(i, val);
						}, reject);
						return;
					}
				}
				args[i] = val;
				if (--remaining === 0) resolve(args);
			} catch (ex) {
				reject(ex);
			}
		}
		for (var i = 0; i < args.length; i++) res(i, args[i]);
	});
};
Promise$1.any = any;
Promise$1.allSettled = allSettled;
Promise$1.resolve = function(value) {
	if (value && typeof value === "object" && value.constructor === Promise$1) return value;
	return new Promise$1(function(resolve) {
		resolve(value);
	});
};
Promise$1.reject = function(value) {
	return new Promise$1(function(resolve, reject) {
		reject(value);
	});
};
Promise$1.race = function(arr) {
	return new Promise$1(function(resolve, reject) {
		if (!isArray(arr)) return reject(/* @__PURE__ */ new TypeError("Promise.race accepts an array"));
		for (var i = 0, len = arr.length; i < len; i++) Promise$1.resolve(arr[i]).then(resolve, reject);
	});
};
Promise$1._immediateFn = typeof setImmediate === "function" && function(fn) {
	setImmediate(fn);
} || function(fn) {
	setTimeoutFunc(fn, 0);
};
Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
	if (typeof console !== "undefined" && console) console.warn("Possible Unhandled Promise Rejection:", err);
};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
//#endregion
//#region node_modules/@pixi/polyfill/dist/esm/polyfill.mjs
/*!
* @pixi/polyfill - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/polyfill is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
var import_object_assign = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	function toObject(val) {
		if (val === null || val === void 0) throw new TypeError("Object.assign cannot be called with null or undefined");
		return Object(val);
	}
	function shouldUseNative() {
		try {
			if (!Object.assign) return false;
			var test1 = /* @__PURE__ */ new String("abc");
			test1[5] = "de";
			if (Object.getOwnPropertyNames(test1)[0] === "5") return false;
			var test2 = {};
			for (var i = 0; i < 10; i++) test2["_" + String.fromCharCode(i)] = i;
			if (Object.getOwnPropertyNames(test2).map(function(n) {
				return test2[n];
			}).join("") !== "0123456789") return false;
			var test3 = {};
			"abcdefghijklmnopqrst".split("").forEach(function(letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") return false;
			return true;
		} catch (err) {
			return false;
		}
	}
	module.exports = shouldUseNative() ? Object.assign : function(target, source) {
		var from;
		var to = toObject(target);
		var symbols;
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
			for (var key in from) if (hasOwnProperty.call(from, key)) to[key] = from[key];
			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) if (propIsEnumerable.call(from, symbols[i])) to[symbols[i]] = from[symbols[i]];
			}
		}
		return to;
	};
})))(), 1);
if (typeof globalThis === "undefined") {
	if (typeof self !== "undefined") self.globalThis = self;
	else if (typeof globalthis_default !== "undefined") globalthis_default.globalThis = globalthis_default;
}
if (!globalThis.Promise) globalThis.Promise = Promise$1;
if (!Object.assign) Object.assign = import_object_assign.default;
var ONE_FRAME_TIME = 16;
if (!(Date.now && Date.prototype.getTime)) Date.now = function now() {
	return (/* @__PURE__ */ new Date()).getTime();
};
if (!(globalThis.performance && globalThis.performance.now)) {
	var startTime_1 = Date.now();
	if (!globalThis.performance) globalThis.performance = {};
	globalThis.performance.now = function() {
		return Date.now() - startTime_1;
	};
}
var lastTime = Date.now();
var vendors = [
	"ms",
	"moz",
	"webkit",
	"o"
];
for (var x = 0; x < vendors.length && !globalThis.requestAnimationFrame; ++x) {
	var p = vendors[x];
	globalThis.requestAnimationFrame = globalThis[p + "RequestAnimationFrame"];
	globalThis.cancelAnimationFrame = globalThis[p + "CancelAnimationFrame"] || globalThis[p + "CancelRequestAnimationFrame"];
}
if (!globalThis.requestAnimationFrame) globalThis.requestAnimationFrame = function(callback) {
	if (typeof callback !== "function") throw new TypeError(callback + "is not a function");
	var currentTime = Date.now();
	var delay = ONE_FRAME_TIME + lastTime - currentTime;
	if (delay < 0) delay = 0;
	lastTime = currentTime;
	return globalThis.self.setTimeout(function() {
		lastTime = Date.now();
		callback(performance_default.now());
	}, delay);
};
if (!globalThis.cancelAnimationFrame) globalThis.cancelAnimationFrame = function(id) {
	return clearTimeout(id);
};
if (!Math.sign) Math.sign = function mathSign(x) {
	x = Number(x);
	if (x === 0 || isNaN(x)) return x;
	return x > 0 ? 1 : -1;
};
if (!Number.isInteger) Number.isInteger = function numberIsInteger(value) {
	return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};
if (!globalThis.ArrayBuffer) globalThis.ArrayBuffer = Array;
if (!globalThis.Float32Array) globalThis.Float32Array = Array;
if (!globalThis.Uint32Array) globalThis.Uint32Array = Array;
if (!globalThis.Uint16Array) globalThis.Uint16Array = Array;
if (!globalThis.Uint8Array) globalThis.Uint8Array = Array;
if (!globalThis.Int32Array) globalThis.Int32Array = Array;
//#endregion
export { globalthis_default as t };
