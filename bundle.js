/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ function(module, exports, __webpack_require__) {

	// require leaflet
	var L = __webpack_require__(/*! leaflet */ 1);
	
	// require esri-leaflet
	var esri = __webpack_require__(/*! esri-leaflet */ 2);
	
	// require esri-leaflet-geocoder
	var geocoding = __webpack_require__(/*! esri-leaflet-geocoder */ 25);
	
	// since leaflet is bundled into the browserify package it won't be able to detect where the images
	// solution is to point it to where you host the the leaflet images yourself
	L.Icon.Default.imagePath = 'http://cdn.leafletjs.com/leaflet-0.7.3/images';
	
	// create map
	var map = L.map('map').setView([51.505, -0.09], 13);
	
	// add basemap
	esri.basemapLayer('Topographic').addTo(map);
	
	// add layer
	esri.featureLayer({
	  url: '//services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/gisday/FeatureServer/0/'
	}).addTo(map);
	
	// add search control
	geocoding.geosearch({
	  providers: [
	    geocoding.arcgisOnlineProvider(),
	    geocoding.featureLayerProvider({
	      url: '//services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/gisday/FeatureServer/0/',
	      searchFields: ['Name', 'Organization'],
	      label: 'GIS Day Events',
	      bufferRadius: 20000,
	      formatSuggestion: function (feature) {
	        return feature.properties.Name + ' - ' + feature.properties.Organization;
	      }
	    })
	  ]
	}).addTo(map);


/***/ },
/* 1 */
/*!***************************************!*\
  !*** ./~/leaflet/dist/leaflet-src.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 Leaflet 1.0-dev (46d2d6a), a JS library for interactive maps. http://leafletjs.com
	 (c) 2010-2015 Vladimir Agafonkin, (c) 2010-2011 CloudMade
	*/
	(function (window, document, undefined) {
	var L = {
		version: '1.0-dev'
	};
	
	function expose() {
		var oldL = window.L;
	
		L.noConflict = function () {
			window.L = oldL;
			return this;
		};
	
		window.L = L;
	}
	
	// define Leaflet for Node module pattern loaders, including Browserify
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = L;
	
	// define Leaflet as an AMD module
	} else if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (L), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	// define Leaflet as a global L variable, saving the original L to restore later if needed
	if (typeof window !== 'undefined') {
		expose();
	}
	
	
	/*
	 * L.Util contains various utility functions used throughout Leaflet code.
	 */
	
	L.Util = {
		// extend an object with properties of one or more other objects
		extend: function (dest) {
			var i, j, len, src;
	
			for (j = 1, len = arguments.length; j < len; j++) {
				src = arguments[j];
				for (i in src) {
					dest[i] = src[i];
				}
			}
			return dest;
		},
	
		// create an object from a given prototype
		create: Object.create || (function () {
			function F() {}
			return function (proto) {
				F.prototype = proto;
				return new F();
			};
		})(),
	
		// bind a function to be called with a given context
		bind: function (fn, obj) {
			var slice = Array.prototype.slice;
	
			if (fn.bind) {
				return fn.bind.apply(fn, slice.call(arguments, 1));
			}
	
			var args = slice.call(arguments, 2);
	
			return function () {
				return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
			};
		},
	
		// return unique ID of an object
		stamp: function (obj) {
			/*eslint-disable */
			obj._leaflet_id = obj._leaflet_id || ++L.Util.lastId;
			return obj._leaflet_id;
			/*eslint-enable */
		},
	
		lastId: 0,
	
		// return a function that won't be called more often than the given interval
		throttle: function (fn, time, context) {
			var lock, args, wrapperFn, later;
	
			later = function () {
				// reset lock and call if queued
				lock = false;
				if (args) {
					wrapperFn.apply(context, args);
					args = false;
				}
			};
	
			wrapperFn = function () {
				if (lock) {
					// called too soon, queue to call later
					args = arguments;
	
				} else {
					// call and lock until later
					fn.apply(context, arguments);
					setTimeout(later, time);
					lock = true;
				}
			};
	
			return wrapperFn;
		},
	
		// wrap the given number to lie within a certain range (used for wrapping longitude)
		wrapNum: function (x, range, includeMax) {
			var max = range[1],
			    min = range[0],
			    d = max - min;
			return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
		},
	
		// do nothing (used as a noop throughout the code)
		falseFn: function () { return false; },
	
		// round a given number to a given precision
		formatNum: function (num, digits) {
			var pow = Math.pow(10, digits || 5);
			return Math.round(num * pow) / pow;
		},
	
		// trim whitespace from both sides of a string
		trim: function (str) {
			return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
		},
	
		// split a string into words
		splitWords: function (str) {
			return L.Util.trim(str).split(/\s+/);
		},
	
		// set options to an object, inheriting parent's options as well
		setOptions: function (obj, options) {
			if (!obj.hasOwnProperty('options')) {
				obj.options = obj.options ? L.Util.create(obj.options) : {};
			}
			for (var i in options) {
				obj.options[i] = options[i];
			}
			return obj.options;
		},
	
		// make a URL with GET parameters out of a set of properties/values
		getParamString: function (obj, existingUrl, uppercase) {
			var params = [];
			for (var i in obj) {
				params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
			}
			return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
		},
	
		// super-simple templating facility, used for TileLayer URLs
		template: function (str, data) {
			return str.replace(L.Util.templateRe, function (str, key) {
				var value = data[key];
	
				if (value === undefined) {
					throw new Error('No value provided for variable ' + str);
	
				} else if (typeof value === 'function') {
					value = value(data);
				}
				return value;
			});
		},
	
		templateRe: /\{ *([\w_]+) *\}/g,
	
		isArray: Array.isArray || function (obj) {
			return (Object.prototype.toString.call(obj) === '[object Array]');
		},
	
		indexOf: function (array, el) {
			for (var i = 0; i < array.length; i++) {
				if (array[i] === el) { return i; }
			}
			return -1;
		},
	
		// minimal image URI, set to an image when disposing to flush memory
		emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
	};
	
	(function () {
		// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	
		function getPrefixed(name) {
			return window['webkit' + name] || window['moz' + name] || window['ms' + name];
		}
	
		var lastTime = 0;
	
		// fallback for IE 7-8
		function timeoutDefer(fn) {
			var time = +new Date(),
			    timeToCall = Math.max(0, 16 - (time - lastTime));
	
			lastTime = time + timeToCall;
			return window.setTimeout(fn, timeToCall);
		}
	
		var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer,
		    cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
		               getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };
	
	
		L.Util.requestAnimFrame = function (fn, context, immediate) {
			if (immediate && requestFn === timeoutDefer) {
				fn.call(context);
			} else {
				return requestFn.call(window, L.bind(fn, context));
			}
		};
	
		L.Util.cancelAnimFrame = function (id) {
			if (id) {
				cancelFn.call(window, id);
			}
		};
	})();
	
	// shortcuts for most used utility functions
	L.extend = L.Util.extend;
	L.bind = L.Util.bind;
	L.stamp = L.Util.stamp;
	L.setOptions = L.Util.setOptions;
	
	
	/*
	 * L.Class powers the OOP facilities of the library.
	 * Thanks to John Resig and Dean Edwards for inspiration!
	 */
	
	L.Class = function () {};
	
	L.Class.extend = function (props) {
	
		// extended class with the new prototype
		var NewClass = function () {
	
			// call the constructor
			if (this.initialize) {
				this.initialize.apply(this, arguments);
			}
	
			// call all constructor hooks
			this.callInitHooks();
		};
	
		var parentProto = NewClass.__super__ = this.prototype;
	
		var proto = L.Util.create(parentProto);
		proto.constructor = NewClass;
	
		NewClass.prototype = proto;
	
		// inherit parent's statics
		for (var i in this) {
			if (this.hasOwnProperty(i) && i !== 'prototype') {
				NewClass[i] = this[i];
			}
		}
	
		// mix static properties into the class
		if (props.statics) {
			L.extend(NewClass, props.statics);
			delete props.statics;
		}
	
		// mix includes into the prototype
		if (props.includes) {
			L.Util.extend.apply(null, [proto].concat(props.includes));
			delete props.includes;
		}
	
		// merge options
		if (proto.options) {
			props.options = L.Util.extend(L.Util.create(proto.options), props.options);
		}
	
		// mix given properties into the prototype
		L.extend(proto, props);
	
		proto._initHooks = [];
	
		// add method for calling all hooks
		proto.callInitHooks = function () {
	
			if (this._initHooksCalled) { return; }
	
			if (parentProto.callInitHooks) {
				parentProto.callInitHooks.call(this);
			}
	
			this._initHooksCalled = true;
	
			for (var i = 0, len = proto._initHooks.length; i < len; i++) {
				proto._initHooks[i].call(this);
			}
		};
	
		return NewClass;
	};
	
	
	// method for adding properties to prototype
	L.Class.include = function (props) {
		L.extend(this.prototype, props);
	};
	
	// merge new default options to the Class
	L.Class.mergeOptions = function (options) {
		L.extend(this.prototype.options, options);
	};
	
	// add a constructor hook
	L.Class.addInitHook = function (fn) { // (Function) || (String, args...)
		var args = Array.prototype.slice.call(arguments, 1);
	
		var init = typeof fn === 'function' ? fn : function () {
			this[fn].apply(this, args);
		};
	
		this.prototype._initHooks = this.prototype._initHooks || [];
		this.prototype._initHooks.push(init);
	};
	
	
	/*
	 * L.Evented is a base class that Leaflet classes inherit from to handle custom events.
	 */
	
	L.Evented = L.Class.extend({
	
		on: function (types, fn, context) {
	
			// types can be a map of types/handlers
			if (typeof types === 'object') {
				for (var type in types) {
					// we don't process space-separated events here for performance;
					// it's a hot path since Layer uses the on(obj) syntax
					this._on(type, types[type], fn);
				}
	
			} else {
				// types can be a string of space-separated words
				types = L.Util.splitWords(types);
	
				for (var i = 0, len = types.length; i < len; i++) {
					this._on(types[i], fn, context);
				}
			}
	
			return this;
		},
	
		off: function (types, fn, context) {
	
			if (!types) {
				// clear all listeners if called without arguments
				delete this._events;
	
			} else if (typeof types === 'object') {
				for (var type in types) {
					this._off(type, types[type], fn);
				}
	
			} else {
				types = L.Util.splitWords(types);
	
				for (var i = 0, len = types.length; i < len; i++) {
					this._off(types[i], fn, context);
				}
			}
	
			return this;
		},
	
		// attach listener (without syntactic sugar now)
		_on: function (type, fn, context) {
	
			var events = this._events = this._events || {},
			    contextId = context && context !== this && L.stamp(context);
	
			if (contextId) {
				// store listeners with custom context in a separate hash (if it has an id);
				// gives a major performance boost when firing and removing events (e.g. on map object)
	
				var indexKey = type + '_idx',
				    indexLenKey = type + '_len',
				    typeIndex = events[indexKey] = events[indexKey] || {},
				    id = L.stamp(fn) + '_' + contextId;
	
				if (!typeIndex[id]) {
					typeIndex[id] = {fn: fn, ctx: context};
	
					// keep track of the number of keys in the index to quickly check if it's empty
					events[indexLenKey] = (events[indexLenKey] || 0) + 1;
				}
	
			} else {
				// individual layers mostly use "this" for context and don't fire listeners too often
				// so simple array makes the memory footprint better while not degrading performance
	
				events[type] = events[type] || [];
				events[type].push({fn: fn});
			}
		},
	
		_off: function (type, fn, context) {
			var events = this._events,
			    indexKey = type + '_idx',
			    indexLenKey = type + '_len';
	
			if (!events) { return; }
	
			if (!fn) {
				// clear all listeners for a type if function isn't specified
				delete events[type];
				delete events[indexKey];
				delete events[indexLenKey];
				return;
			}
	
			var contextId = context && context !== this && L.stamp(context),
			    listeners, i, len, listener, id;
	
			if (contextId) {
				id = L.stamp(fn) + '_' + contextId;
				listeners = events[indexKey];
	
				if (listeners && listeners[id]) {
					listener = listeners[id];
					delete listeners[id];
					events[indexLenKey]--;
				}
	
			} else {
				listeners = events[type];
	
				if (listeners) {
					for (i = 0, len = listeners.length; i < len; i++) {
						if (listeners[i].fn === fn) {
							listener = listeners[i];
							listeners.splice(i, 1);
							break;
						}
					}
				}
			}
	
			// set the removed listener to noop so that's not called if remove happens in fire
			if (listener) {
				listener.fn = L.Util.falseFn;
			}
		},
	
		fire: function (type, data, propagate) {
			if (!this.listens(type, propagate)) { return this; }
	
			var event = L.Util.extend({}, data, {type: type, target: this}),
			    events = this._events;
	
			if (events) {
				var typeIndex = events[type + '_idx'],
				    i, len, listeners, id;
	
				if (events[type]) {
					// make sure adding/removing listeners inside other listeners won't cause infinite loop
					listeners = events[type].slice();
	
					for (i = 0, len = listeners.length; i < len; i++) {
						listeners[i].fn.call(this, event);
					}
				}
	
				// fire event for the context-indexed listeners as well
				for (id in typeIndex) {
					typeIndex[id].fn.call(typeIndex[id].ctx, event);
				}
			}
	
			if (propagate) {
				// propagate the event to parents (set with addEventParent)
				this._propagateEvent(event);
			}
	
			return this;
		},
	
		listens: function (type, propagate) {
			var events = this._events;
	
			if (events && (events[type] || events[type + '_len'])) { return true; }
	
			if (propagate) {
				// also check parents for listeners if event propagates
				for (var id in this._eventParents) {
					if (this._eventParents[id].listens(type, propagate)) { return true; }
				}
			}
			return false;
		},
	
		once: function (types, fn, context) {
	
			if (typeof types === 'object') {
				for (var type in types) {
					this.once(type, types[type], fn);
				}
				return this;
			}
	
			var handler = L.bind(function () {
				this
				    .off(types, fn, context)
				    .off(types, handler, context);
			}, this);
	
			// add a listener that's executed once and removed after that
			return this
			    .on(types, fn, context)
			    .on(types, handler, context);
		},
	
		// adds a parent to propagate events to (when you fire with true as a 3rd argument)
		addEventParent: function (obj) {
			this._eventParents = this._eventParents || {};
			this._eventParents[L.stamp(obj)] = obj;
			return this;
		},
	
		removeEventParent: function (obj) {
			if (this._eventParents) {
				delete this._eventParents[L.stamp(obj)];
			}
			return this;
		},
	
		_propagateEvent: function (e) {
			for (var id in this._eventParents) {
				this._eventParents[id].fire(e.type, L.extend({layer: e.target}, e), true);
			}
		}
	});
	
	var proto = L.Evented.prototype;
	
	// aliases; we should ditch those eventually
	proto.addEventListener = proto.on;
	proto.removeEventListener = proto.clearAllEventListeners = proto.off;
	proto.addOneTimeEventListener = proto.once;
	proto.fireEvent = proto.fire;
	proto.hasEventListeners = proto.listens;
	
	L.Mixin = {Events: proto};
	
	
	/*
	 * L.Browser handles different browser and feature detections for internal Leaflet use.
	 */
	
	(function () {
	
		var ua = navigator.userAgent.toLowerCase(),
		    doc = document.documentElement,
	
		    ie = 'ActiveXObject' in window,
	
		    webkit    = ua.indexOf('webkit') !== -1,
		    phantomjs = ua.indexOf('phantom') !== -1,
		    android23 = ua.search('android [23]') !== -1,
		    chrome    = ua.indexOf('chrome') !== -1,
		    gecko     = ua.indexOf('gecko') !== -1  && !webkit && !window.opera && !ie,
	
		    mobile = typeof orientation !== 'undefined' || ua.indexOf('mobile') !== -1,
		    msPointer = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent,
		    pointer = (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) || msPointer,
	
		    ie3d = ie && ('transition' in doc.style),
		    webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
		    gecko3d = 'MozPerspective' in doc.style,
		    opera12 = 'OTransition' in doc.style;
	
		var touch = !window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window ||
				(window.DocumentTouch && document instanceof window.DocumentTouch));
	
		L.Browser = {
			ie: ie,
			ielt9: ie && !document.addEventListener,
			webkit: webkit,
			gecko: gecko,
			android: ua.indexOf('android') !== -1,
			android23: android23,
			chrome: chrome,
			safari: !chrome && ua.indexOf('safari') !== -1,
	
			ie3d: ie3d,
			webkit3d: webkit3d,
			gecko3d: gecko3d,
			opera12: opera12,
			any3d: !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantomjs,
	
			mobile: mobile,
			mobileWebkit: mobile && webkit,
			mobileWebkit3d: mobile && webkit3d,
			mobileOpera: mobile && window.opera,
			mobileGecko: mobile && gecko,
	
			touch: !!touch,
			msPointer: !!msPointer,
			pointer: !!pointer,
	
			retina: (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1
		};
	
	}());
	
	
	/*
	 * L.Point represents a point with x and y coordinates.
	 */
	
	L.Point = function (x, y, round) {
		this.x = (round ? Math.round(x) : x);
		this.y = (round ? Math.round(y) : y);
	};
	
	L.Point.prototype = {
	
		clone: function () {
			return new L.Point(this.x, this.y);
		},
	
		// non-destructive, returns a new point
		add: function (point) {
			return this.clone()._add(L.point(point));
		},
	
		// destructive, used directly for performance in situations where it's safe to modify existing point
		_add: function (point) {
			this.x += point.x;
			this.y += point.y;
			return this;
		},
	
		subtract: function (point) {
			return this.clone()._subtract(L.point(point));
		},
	
		_subtract: function (point) {
			this.x -= point.x;
			this.y -= point.y;
			return this;
		},
	
		divideBy: function (num) {
			return this.clone()._divideBy(num);
		},
	
		_divideBy: function (num) {
			this.x /= num;
			this.y /= num;
			return this;
		},
	
		multiplyBy: function (num) {
			return this.clone()._multiplyBy(num);
		},
	
		_multiplyBy: function (num) {
			this.x *= num;
			this.y *= num;
			return this;
		},
	
		scaleBy: function(point) {
			return new L.Point(this.x * point.x, this.y * point.y);
		},
	
		unscaleBy: function(point) {
			return new L.Point(this.x / point.x, this.y / point.y);
		},
	
		round: function () {
			return this.clone()._round();
		},
	
		_round: function () {
			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			return this;
		},
	
		floor: function () {
			return this.clone()._floor();
		},
	
		_floor: function () {
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			return this;
		},
	
		ceil: function () {
			return this.clone()._ceil();
		},
	
		_ceil: function () {
			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);
			return this;
		},
	
		distanceTo: function (point) {
			point = L.point(point);
	
			var x = point.x - this.x,
			    y = point.y - this.y;
	
			return Math.sqrt(x * x + y * y);
		},
	
		equals: function (point) {
			point = L.point(point);
	
			return point.x === this.x &&
			       point.y === this.y;
		},
	
		contains: function (point) {
			point = L.point(point);
	
			return Math.abs(point.x) <= Math.abs(this.x) &&
			       Math.abs(point.y) <= Math.abs(this.y);
		},
	
		toString: function () {
			return 'Point(' +
			        L.Util.formatNum(this.x) + ', ' +
			        L.Util.formatNum(this.y) + ')';
		}
	};
	
	L.point = function (x, y, round) {
		if (x instanceof L.Point) {
			return x;
		}
		if (L.Util.isArray(x)) {
			return new L.Point(x[0], x[1]);
		}
		if (x === undefined || x === null) {
			return x;
		}
		return new L.Point(x, y, round);
	};
	
	
	/*
	 * L.Bounds represents a rectangular area on the screen in pixel coordinates.
	 */
	
	L.Bounds = function (a, b) { //(Point, Point) or Point[]
		if (!a) { return; }
	
		var points = b ? [a, b] : a;
	
		for (var i = 0, len = points.length; i < len; i++) {
			this.extend(points[i]);
		}
	};
	
	L.Bounds.prototype = {
		// extend the bounds to contain the given point
		extend: function (point) { // (Point)
			point = L.point(point);
	
			if (!this.min && !this.max) {
				this.min = point.clone();
				this.max = point.clone();
			} else {
				this.min.x = Math.min(point.x, this.min.x);
				this.max.x = Math.max(point.x, this.max.x);
				this.min.y = Math.min(point.y, this.min.y);
				this.max.y = Math.max(point.y, this.max.y);
			}
			return this;
		},
	
		getCenter: function (round) { // (Boolean) -> Point
			return new L.Point(
			        (this.min.x + this.max.x) / 2,
			        (this.min.y + this.max.y) / 2, round);
		},
	
		getBottomLeft: function () { // -> Point
			return new L.Point(this.min.x, this.max.y);
		},
	
		getTopRight: function () { // -> Point
			return new L.Point(this.max.x, this.min.y);
		},
	
		getSize: function () {
			return this.max.subtract(this.min);
		},
	
		contains: function (obj) { // (Bounds) or (Point) -> Boolean
			var min, max;
	
			if (typeof obj[0] === 'number' || obj instanceof L.Point) {
				obj = L.point(obj);
			} else {
				obj = L.bounds(obj);
			}
	
			if (obj instanceof L.Bounds) {
				min = obj.min;
				max = obj.max;
			} else {
				min = max = obj;
			}
	
			return (min.x >= this.min.x) &&
			       (max.x <= this.max.x) &&
			       (min.y >= this.min.y) &&
			       (max.y <= this.max.y);
		},
	
		intersects: function (bounds) { // (Bounds) -> Boolean
			bounds = L.bounds(bounds);
	
			var min = this.min,
			    max = this.max,
			    min2 = bounds.min,
			    max2 = bounds.max,
			    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
			    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);
	
			return xIntersects && yIntersects;
		},
	
		overlaps: function (bounds) { // (Bounds) -> Boolean
			bounds = L.bounds(bounds);
	
			var min = this.min,
			    max = this.max,
			    min2 = bounds.min,
			    max2 = bounds.max,
			    xOverlaps = (max2.x > min.x) && (min2.x < max.x),
			    yOverlaps = (max2.y > min.y) && (min2.y < max.y);
	
			return xOverlaps && yOverlaps;
		},
	
		isValid: function () {
			return !!(this.min && this.max);
		}
	};
	
	L.bounds = function (a, b) { // (Bounds) or (Point, Point) or (Point[])
		if (!a || a instanceof L.Bounds) {
			return a;
		}
		return new L.Bounds(a, b);
	};
	
	
	/*
	 * L.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
	 */
	
	L.Transformation = function (a, b, c, d) {
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
	};
	
	L.Transformation.prototype = {
		transform: function (point, scale) { // (Point, Number) -> Point
			return this._transform(point.clone(), scale);
		},
	
		// destructive transform (faster)
		_transform: function (point, scale) {
			scale = scale || 1;
			point.x = scale * (this._a * point.x + this._b);
			point.y = scale * (this._c * point.y + this._d);
			return point;
		},
	
		untransform: function (point, scale) {
			scale = scale || 1;
			return new L.Point(
			        (point.x / scale - this._b) / this._a,
			        (point.y / scale - this._d) / this._c);
		}
	};
	
	
	/*
	 * L.DomUtil contains various utility functions for working with DOM.
	 */
	
	L.DomUtil = {
		get: function (id) {
			return typeof id === 'string' ? document.getElementById(id) : id;
		},
	
		getStyle: function (el, style) {
	
			var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);
	
			if ((!value || value === 'auto') && document.defaultView) {
				var css = document.defaultView.getComputedStyle(el, null);
				value = css ? css[style] : null;
			}
	
			return value === 'auto' ? null : value;
		},
	
		create: function (tagName, className, container) {
	
			var el = document.createElement(tagName);
			el.className = className;
	
			if (container) {
				container.appendChild(el);
			}
	
			return el;
		},
	
		remove: function (el) {
			var parent = el.parentNode;
			if (parent) {
				parent.removeChild(el);
			}
		},
	
		empty: function (el) {
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		},
	
		toFront: function (el) {
			el.parentNode.appendChild(el);
		},
	
		toBack: function (el) {
			var parent = el.parentNode;
			parent.insertBefore(el, parent.firstChild);
		},
	
		hasClass: function (el, name) {
			if (el.classList !== undefined) {
				return el.classList.contains(name);
			}
			var className = L.DomUtil.getClass(el);
			return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
		},
	
		addClass: function (el, name) {
			if (el.classList !== undefined) {
				var classes = L.Util.splitWords(name);
				for (var i = 0, len = classes.length; i < len; i++) {
					el.classList.add(classes[i]);
				}
			} else if (!L.DomUtil.hasClass(el, name)) {
				var className = L.DomUtil.getClass(el);
				L.DomUtil.setClass(el, (className ? className + ' ' : '') + name);
			}
		},
	
		removeClass: function (el, name) {
			if (el.classList !== undefined) {
				el.classList.remove(name);
			} else {
				L.DomUtil.setClass(el, L.Util.trim((' ' + L.DomUtil.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
			}
		},
	
		setClass: function (el, name) {
			if (el.className.baseVal === undefined) {
				el.className = name;
			} else {
				// in case of SVG element
				el.className.baseVal = name;
			}
		},
	
		getClass: function (el) {
			return el.className.baseVal === undefined ? el.className : el.className.baseVal;
		},
	
		setOpacity: function (el, value) {
	
			if ('opacity' in el.style) {
				el.style.opacity = value;
	
			} else if ('filter' in el.style) {
				L.DomUtil._setOpacityIE(el, value);
			}
		},
	
		_setOpacityIE: function (el, value) {
			var filter = false,
			    filterName = 'DXImageTransform.Microsoft.Alpha';
	
			// filters collection throws an error if we try to retrieve a filter that doesn't exist
			try {
				filter = el.filters.item(filterName);
			} catch (e) {
				// don't set opacity to 1 if we haven't already set an opacity,
				// it isn't needed and breaks transparent pngs.
				if (value === 1) { return; }
			}
	
			value = Math.round(value * 100);
	
			if (filter) {
				filter.Enabled = (value !== 100);
				filter.Opacity = value;
			} else {
				el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
			}
		},
	
		testProp: function (props) {
	
			var style = document.documentElement.style;
	
			for (var i = 0; i < props.length; i++) {
				if (props[i] in style) {
					return props[i];
				}
			}
			return false;
		},
	
		setTransform: function (el, offset, scale) {
			var pos = offset || new L.Point(0, 0);
	
			el.style[L.DomUtil.TRANSFORM] =
				'translate3d(' + pos.x + 'px,' + pos.y + 'px' + ',0)' + (scale ? ' scale(' + scale + ')' : '');
		},
	
		setPosition: function (el, point) { // (HTMLElement, Point[, Boolean])
	
			/*eslint-disable */
			el._leaflet_pos = point;
			/*eslint-enable */
	
			if (L.Browser.any3d) {
				L.DomUtil.setTransform(el, point);
			} else {
				el.style.left = point.x + 'px';
				el.style.top = point.y + 'px';
			}
		},
	
		getPosition: function (el) {
			// this method is only used for elements previously positioned using setPosition,
			// so it's safe to cache the position for performance
	
			return el._leaflet_pos;
		}
	};
	
	
	(function () {
		// prefix style property names
	
		L.DomUtil.TRANSFORM = L.DomUtil.testProp(
				['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);
	
	
		// webkitTransition comes first because some browser versions that drop vendor prefix don't do
		// the same for the transitionend event, in particular the Android 4.1 stock browser
	
		var transition = L.DomUtil.TRANSITION = L.DomUtil.testProp(
				['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);
	
		L.DomUtil.TRANSITION_END =
				transition === 'webkitTransition' || transition === 'OTransition' ? transition + 'End' : 'transitionend';
	
	
		if ('onselectstart' in document) {
			L.DomUtil.disableTextSelection = function () {
				L.DomEvent.on(window, 'selectstart', L.DomEvent.preventDefault);
			};
			L.DomUtil.enableTextSelection = function () {
				L.DomEvent.off(window, 'selectstart', L.DomEvent.preventDefault);
			};
	
		} else {
			var userSelectProperty = L.DomUtil.testProp(
				['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);
	
			L.DomUtil.disableTextSelection = function () {
				if (userSelectProperty) {
					var style = document.documentElement.style;
					this._userSelect = style[userSelectProperty];
					style[userSelectProperty] = 'none';
				}
			};
			L.DomUtil.enableTextSelection = function () {
				if (userSelectProperty) {
					document.documentElement.style[userSelectProperty] = this._userSelect;
					delete this._userSelect;
				}
			};
		}
	
		L.DomUtil.disableImageDrag = function () {
			L.DomEvent.on(window, 'dragstart', L.DomEvent.preventDefault);
		};
		L.DomUtil.enableImageDrag = function () {
			L.DomEvent.off(window, 'dragstart', L.DomEvent.preventDefault);
		};
	
		L.DomUtil.preventOutline = function (element) {
			while (element.tabIndex === -1) {
				element = element.parentNode;
			}
			if (!element) { return; }
			L.DomUtil.restoreOutline();
			this._outlineElement = element;
			this._outlineStyle = element.style.outline;
			element.style.outline = 'none';
			L.DomEvent.on(window, 'keydown', L.DomUtil.restoreOutline, this);
		};
		L.DomUtil.restoreOutline = function () {
			if (!this._outlineElement) { return; }
			this._outlineElement.style.outline = this._outlineStyle;
			delete this._outlineElement;
			delete this._outlineStyle;
			L.DomEvent.off(window, 'keydown', L.DomUtil.restoreOutline, this);
		};
	})();
	
	
	/*
	 * L.LatLng represents a geographical point with latitude and longitude coordinates.
	 */
	
	L.LatLng = function (lat, lng, alt) {
		if (isNaN(lat) || isNaN(lng)) {
			throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
		}
	
		this.lat = +lat;
		this.lng = +lng;
	
		if (alt !== undefined) {
			this.alt = +alt;
		}
	};
	
	L.LatLng.prototype = {
		equals: function (obj, maxMargin) {
			if (!obj) { return false; }
	
			obj = L.latLng(obj);
	
			var margin = Math.max(
			        Math.abs(this.lat - obj.lat),
			        Math.abs(this.lng - obj.lng));
	
			return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
		},
	
		toString: function (precision) {
			return 'LatLng(' +
			        L.Util.formatNum(this.lat, precision) + ', ' +
			        L.Util.formatNum(this.lng, precision) + ')';
		},
	
		distanceTo: function (other) {
			return L.CRS.Earth.distance(this, L.latLng(other));
		},
	
		wrap: function () {
			return L.CRS.Earth.wrapLatLng(this);
		},
	
		toBounds: function (sizeInMeters) {
			var latAccuracy = 180 * sizeInMeters / 40075017,
					lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);
	
			return L.latLngBounds(
			        [this.lat - latAccuracy, this.lng - lngAccuracy],
			        [this.lat + latAccuracy, this.lng + lngAccuracy]);
		},
	
		clone: function () {
			return new L.LatLng(this.lat, this.lng, this.alt);
		}
	};
	
	
	// constructs LatLng with different signatures
	// (LatLng) or ([Number, Number]) or (Number, Number) or (Object)
	
	L.latLng = function (a, b, c) {
		if (a instanceof L.LatLng) {
			return a;
		}
		if (L.Util.isArray(a) && typeof a[0] !== 'object') {
			if (a.length === 3) {
				return new L.LatLng(a[0], a[1], a[2]);
			}
			if (a.length === 2) {
				return new L.LatLng(a[0], a[1]);
			}
			return null;
		}
		if (a === undefined || a === null) {
			return a;
		}
		if (typeof a === 'object' && 'lat' in a) {
			return new L.LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
		}
		if (b === undefined) {
			return null;
		}
		return new L.LatLng(a, b, c);
	};
	
	
	/*
	 * L.LatLngBounds represents a rectangular area on the map in geographical coordinates.
	 */
	
	L.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
		if (!southWest) { return; }
	
		var latlngs = northEast ? [southWest, northEast] : southWest;
	
		for (var i = 0, len = latlngs.length; i < len; i++) {
			this.extend(latlngs[i]);
		}
	};
	
	L.LatLngBounds.prototype = {
	
		// extend the bounds to contain the given point or bounds
		extend: function (obj) { // (LatLng) or (LatLngBounds)
			var sw = this._southWest,
				ne = this._northEast,
				sw2, ne2;
	
			if (obj instanceof L.LatLng) {
				sw2 = obj;
				ne2 = obj;
	
			} else if (obj instanceof L.LatLngBounds) {
				sw2 = obj._southWest;
				ne2 = obj._northEast;
	
				if (!sw2 || !ne2) { return this; }
	
			} else {
				return obj ? this.extend(L.latLng(obj) || L.latLngBounds(obj)) : this;
			}
	
			if (!sw && !ne) {
				this._southWest = new L.LatLng(sw2.lat, sw2.lng);
				this._northEast = new L.LatLng(ne2.lat, ne2.lng);
			} else {
				sw.lat = Math.min(sw2.lat, sw.lat);
				sw.lng = Math.min(sw2.lng, sw.lng);
				ne.lat = Math.max(ne2.lat, ne.lat);
				ne.lng = Math.max(ne2.lng, ne.lng);
			}
	
			return this;
		},
	
		// extend the bounds by a percentage
		pad: function (bufferRatio) { // (Number) -> LatLngBounds
			var sw = this._southWest,
			    ne = this._northEast,
			    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
			    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;
	
			return new L.LatLngBounds(
			        new L.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
			        new L.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
		},
	
		getCenter: function () { // -> LatLng
			return new L.LatLng(
			        (this._southWest.lat + this._northEast.lat) / 2,
			        (this._southWest.lng + this._northEast.lng) / 2);
		},
	
		getSouthWest: function () {
			return this._southWest;
		},
	
		getNorthEast: function () {
			return this._northEast;
		},
	
		getNorthWest: function () {
			return new L.LatLng(this.getNorth(), this.getWest());
		},
	
		getSouthEast: function () {
			return new L.LatLng(this.getSouth(), this.getEast());
		},
	
		getWest: function () {
			return this._southWest.lng;
		},
	
		getSouth: function () {
			return this._southWest.lat;
		},
	
		getEast: function () {
			return this._northEast.lng;
		},
	
		getNorth: function () {
			return this._northEast.lat;
		},
	
		contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
			if (typeof obj[0] === 'number' || obj instanceof L.LatLng) {
				obj = L.latLng(obj);
			} else {
				obj = L.latLngBounds(obj);
			}
	
			var sw = this._southWest,
			    ne = this._northEast,
			    sw2, ne2;
	
			if (obj instanceof L.LatLngBounds) {
				sw2 = obj.getSouthWest();
				ne2 = obj.getNorthEast();
			} else {
				sw2 = ne2 = obj;
			}
	
			return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
			       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
		},
	
		intersects: function (bounds) { // (LatLngBounds) -> Boolean
			bounds = L.latLngBounds(bounds);
	
			var sw = this._southWest,
			    ne = this._northEast,
			    sw2 = bounds.getSouthWest(),
			    ne2 = bounds.getNorthEast(),
	
			    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
			    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);
	
			return latIntersects && lngIntersects;
		},
	
		overlaps: function (bounds) { // (LatLngBounds) -> Boolean
			bounds = L.latLngBounds(bounds);
	
			var sw = this._southWest,
			    ne = this._northEast,
			    sw2 = bounds.getSouthWest(),
			    ne2 = bounds.getNorthEast(),
	
			    latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
			    lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);
	
			return latOverlaps && lngOverlaps;
		},
	
		toBBoxString: function () {
			return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
		},
	
		equals: function (bounds) { // (LatLngBounds)
			if (!bounds) { return false; }
	
			bounds = L.latLngBounds(bounds);
	
			return this._southWest.equals(bounds.getSouthWest()) &&
			       this._northEast.equals(bounds.getNorthEast());
		},
	
		isValid: function () {
			return !!(this._southWest && this._northEast);
		}
	};
	
	//TODO International date line?
	
	L.latLngBounds = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
		if (!a || a instanceof L.LatLngBounds) {
			return a;
		}
		return new L.LatLngBounds(a, b);
	};
	
	
	/*
	 * Simple equirectangular (Plate Carree) projection, used by CRS like EPSG:4326 and Simple.
	 */
	
	L.Projection = {};
	
	L.Projection.LonLat = {
		project: function (latlng) {
			return new L.Point(latlng.lng, latlng.lat);
		},
	
		unproject: function (point) {
			return new L.LatLng(point.y, point.x);
		},
	
		bounds: L.bounds([-180, -90], [180, 90])
	};
	
	
	/*
	 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
	 */
	
	L.Projection.SphericalMercator = {
	
		R: 6378137,
	
		project: function (latlng) {
			var d = Math.PI / 180,
			    max = 1 - 1E-15,
			    sin = Math.max(Math.min(Math.sin(latlng.lat * d), max), -max);
	
			return new L.Point(
					this.R * latlng.lng * d,
					this.R * Math.log((1 + sin) / (1 - sin)) / 2);
		},
	
		unproject: function (point) {
			var d = 180 / Math.PI;
	
			return new L.LatLng(
				(2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
				point.x * d / this.R);
		},
	
		bounds: (function () {
			var d = 6378137 * Math.PI;
			return L.bounds([-d, -d], [d, d]);
		})()
	};
	
	
	/*
	 * L.CRS is the base object for all defined CRS (Coordinate Reference Systems) in Leaflet.
	 */
	
	L.CRS = {
		// converts geo coords to pixel ones
		latLngToPoint: function (latlng, zoom) {
			var projectedPoint = this.projection.project(latlng),
			    scale = this.scale(zoom);
	
			return this.transformation._transform(projectedPoint, scale);
		},
	
		// converts pixel coords to geo coords
		pointToLatLng: function (point, zoom) {
			var scale = this.scale(zoom),
			    untransformedPoint = this.transformation.untransform(point, scale);
	
			return this.projection.unproject(untransformedPoint);
		},
	
		// converts geo coords to projection-specific coords (e.g. in meters)
		project: function (latlng) {
			return this.projection.project(latlng);
		},
	
		// converts projected coords to geo coords
		unproject: function (point) {
			return this.projection.unproject(point);
		},
	
		// defines how the world scales with zoom
		scale: function (zoom) {
			return 256 * Math.pow(2, zoom);
		},
	
		// returns the bounds of the world in projected coords if applicable
		getProjectedBounds: function (zoom) {
			if (this.infinite) { return null; }
	
			var b = this.projection.bounds,
			    s = this.scale(zoom),
			    min = this.transformation.transform(b.min, s),
			    max = this.transformation.transform(b.max, s);
	
			return L.bounds(min, max);
		},
	
		// whether a coordinate axis wraps in a given range (e.g. longitude from -180 to 180); depends on CRS
		// wrapLng: [min, max],
		// wrapLat: [min, max],
	
		// if true, the coordinate space will be unbounded (infinite in all directions)
		// infinite: false,
	
		// wraps geo coords in certain ranges if applicable
		wrapLatLng: function (latlng) {
			var lng = this.wrapLng ? L.Util.wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
			    lat = this.wrapLat ? L.Util.wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
			    alt = latlng.alt;
	
			return L.latLng(lat, lng, alt);
		}
	};
	
	
	/*
	 * A simple CRS that can be used for flat non-Earth maps like panoramas or game maps.
	 */
	
	L.CRS.Simple = L.extend({}, L.CRS, {
		projection: L.Projection.LonLat,
		transformation: new L.Transformation(1, 0, -1, 0),
	
		scale: function (zoom) {
			return Math.pow(2, zoom);
		},
	
		distance: function (latlng1, latlng2) {
			var dx = latlng2.lng - latlng1.lng,
			    dy = latlng2.lat - latlng1.lat;
	
			return Math.sqrt(dx * dx + dy * dy);
		},
	
		infinite: true
	});
	
	
	/*
	 * L.CRS.Earth is the base class for all CRS representing Earth.
	 */
	
	L.CRS.Earth = L.extend({}, L.CRS, {
		wrapLng: [-180, 180],
	
		R: 6378137,
	
		// distance between two geographical points using spherical law of cosines approximation
		distance: function (latlng1, latlng2) {
			var rad = Math.PI / 180,
			    lat1 = latlng1.lat * rad,
			    lat2 = latlng2.lat * rad,
			    a = Math.sin(lat1) * Math.sin(lat2) +
			        Math.cos(lat1) * Math.cos(lat2) * Math.cos((latlng2.lng - latlng1.lng) * rad);
	
			return this.R * Math.acos(Math.min(a, 1));
		}
	});
	
	
	/*
	 * L.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping and is used by Leaflet by default.
	 */
	
	L.CRS.EPSG3857 = L.extend({}, L.CRS.Earth, {
		code: 'EPSG:3857',
		projection: L.Projection.SphericalMercator,
	
		transformation: (function () {
			var scale = 0.5 / (Math.PI * L.Projection.SphericalMercator.R);
			return new L.Transformation(scale, 0.5, -scale, 0.5);
		}())
	});
	
	L.CRS.EPSG900913 = L.extend({}, L.CRS.EPSG3857, {
		code: 'EPSG:900913'
	});
	
	
	/*
	 * L.CRS.EPSG4326 is a CRS popular among advanced GIS specialists.
	 */
	
	L.CRS.EPSG4326 = L.extend({}, L.CRS.Earth, {
		code: 'EPSG:4326',
		projection: L.Projection.LonLat,
		transformation: new L.Transformation(1 / 180, 1, -1 / 180, 0.5)
	});
	
	
	/*
	 * L.Map is the central class of the API - it is used to create a map.
	 */
	
	L.Map = L.Evented.extend({
	
		options: {
			crs: L.CRS.EPSG3857,
	
			/*
			center: LatLng,
			zoom: Number,
			layers: Array,
			*/
	
			fadeAnimation: true,
			trackResize: true,
			markerZoomAnimation: true,
			maxBoundsViscosity: 0.0
		},
	
		initialize: function (id, options) { // (HTMLElement or String, Object)
			options = L.setOptions(this, options);
	
			this._initContainer(id);
			this._initLayout();
	
			// hack for https://github.com/Leaflet/Leaflet/issues/1980
			this._onResize = L.bind(this._onResize, this);
	
			this._initEvents();
	
			if (options.maxBounds) {
				this.setMaxBounds(options.maxBounds);
			}
	
			if (options.zoom !== undefined) {
				this._zoom = this._limitZoom(options.zoom);
			}
	
			if (options.center && options.zoom !== undefined) {
				this.setView(L.latLng(options.center), options.zoom, {reset: true});
			}
	
			this._handlers = [];
			this._layers = {};
			this._zoomBoundLayers = {};
			this._sizeChanged = true;
	
			this.callInitHooks();
	
			this._addLayers(this.options.layers);
		},
	
	
		// public methods that modify map state
	
		// replaced by animation-powered implementation in Map.PanAnimation.js
		setView: function (center, zoom) {
			zoom = zoom === undefined ? this.getZoom() : zoom;
			this._resetView(L.latLng(center), zoom);
			return this;
		},
	
		setZoom: function (zoom, options) {
			if (!this._loaded) {
				this._zoom = zoom;
				return this;
			}
			return this.setView(this.getCenter(), zoom, {zoom: options});
		},
	
		zoomIn: function (delta, options) {
			return this.setZoom(this._zoom + (delta || 1), options);
		},
	
		zoomOut: function (delta, options) {
			return this.setZoom(this._zoom - (delta || 1), options);
		},
	
		setZoomAround: function (latlng, zoom, options) {
			var scale = this.getZoomScale(zoom),
			    viewHalf = this.getSize().divideBy(2),
			    containerPoint = latlng instanceof L.Point ? latlng : this.latLngToContainerPoint(latlng),
	
			    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
			    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));
	
			return this.setView(newCenter, zoom, {zoom: options});
		},
	
		_getBoundsCenterZoom: function (bounds, options) {
	
			options = options || {};
			bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);
	
			var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
			    paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),
	
			    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));
	
			zoom = options.maxZoom ? Math.min(options.maxZoom, zoom) : zoom;
	
			var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),
	
			    swPoint = this.project(bounds.getSouthWest(), zoom),
			    nePoint = this.project(bounds.getNorthEast(), zoom),
			    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);
	
			return {
				center: center,
				zoom: zoom
			};
		},
	
		fitBounds: function (bounds, options) {
			var target = this._getBoundsCenterZoom(bounds, options);
			return this.setView(target.center, target.zoom, options);
		},
	
		fitWorld: function (options) {
			return this.fitBounds([[-90, -180], [90, 180]], options);
		},
	
		panTo: function (center, options) { // (LatLng)
			return this.setView(center, this._zoom, {pan: options});
		},
	
		panBy: function (offset) { // (Point)
			// replaced with animated panBy in Map.PanAnimation.js
			this.fire('movestart');
	
			this._rawPanBy(L.point(offset));
	
			this.fire('move');
			return this.fire('moveend');
		},
	
		setMaxBounds: function (bounds) {
			bounds = L.latLngBounds(bounds);
	
			if (!bounds) {
				return this.off('moveend', this._panInsideMaxBounds);
			} else if (this.options.maxBounds) {
				this.off('moveend', this._panInsideMaxBounds);
			}
	
			this.options.maxBounds = bounds;
	
			if (this._loaded) {
				this._panInsideMaxBounds();
			}
	
			return this.on('moveend', this._panInsideMaxBounds);
		},
	
		setMinZoom: function (zoom) {
			this.options.minZoom = zoom;
	
			if (this._loaded && this.getZoom() < this.options.minZoom) {
				return this.setZoom(zoom);
			}
	
			return this;
		},
	
		setMaxZoom: function (zoom) {
			this.options.maxZoom = zoom;
	
			if (this._loaded && (this.getZoom() > this.options.maxZoom)) {
				return this.setZoom(zoom);
			}
	
			return this;
		},
	
		panInsideBounds: function (bounds, options) {
			var center = this.getCenter(),
				newCenter = this._limitCenter(center, this._zoom, L.latLngBounds(bounds));
	
			if (center.equals(newCenter)) { return this; }
	
			return this.panTo(newCenter, options);
		},
	
		invalidateSize: function (options) {
			if (!this._loaded) { return this; }
	
			options = L.extend({
				animate: false,
				pan: true
			}, options === true ? {animate: true} : options);
	
			var oldSize = this.getSize();
			this._sizeChanged = true;
			this._lastCenter = null;
	
			var newSize = this.getSize(),
			    oldCenter = oldSize.divideBy(2).round(),
			    newCenter = newSize.divideBy(2).round(),
			    offset = oldCenter.subtract(newCenter);
	
			if (!offset.x && !offset.y) { return this; }
	
			if (options.animate && options.pan) {
				this.panBy(offset);
	
			} else {
				if (options.pan) {
					this._rawPanBy(offset);
				}
	
				this.fire('move');
	
				if (options.debounceMoveend) {
					clearTimeout(this._sizeTimer);
					this._sizeTimer = setTimeout(L.bind(this.fire, this, 'moveend'), 200);
				} else {
					this.fire('moveend');
				}
			}
	
			return this.fire('resize', {
				oldSize: oldSize,
				newSize: newSize
			});
		},
	
		stop: function () {
			L.Util.cancelAnimFrame(this._flyToFrame);
			if (this._panAnim) {
				this._panAnim.stop();
			}
			return this;
		},
	
		// TODO handler.addTo
		addHandler: function (name, HandlerClass) {
			if (!HandlerClass) { return this; }
	
			var handler = this[name] = new HandlerClass(this);
	
			this._handlers.push(handler);
	
			if (this.options[name]) {
				handler.enable();
			}
	
			return this;
		},
	
		remove: function () {
	
			this._initEvents(true);
	
			try {
				// throws error in IE6-8
				delete this._container._leaflet;
			} catch (e) {
				this._container._leaflet = undefined;
			}
	
			L.DomUtil.remove(this._mapPane);
	
			if (this._clearControlPos) {
				this._clearControlPos();
			}
	
			this._clearHandlers();
	
			if (this._loaded) {
				this.fire('unload');
			}
	
			for (var i in this._layers) {
				this._layers[i].remove();
			}
	
			return this;
		},
	
		createPane: function (name, container) {
			var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : ''),
			    pane = L.DomUtil.create('div', className, container || this._mapPane);
	
			if (name) {
				this._panes[name] = pane;
			}
			return pane;
		},
	
	
		// public methods for getting map state
	
		getCenter: function () { // (Boolean) -> LatLng
			this._checkIfLoaded();
	
			if (this._lastCenter && !this._moved()) {
				return this._lastCenter;
			}
			return this.layerPointToLatLng(this._getCenterLayerPoint());
		},
	
		getZoom: function () {
			return this._zoom;
		},
	
		getBounds: function () {
			var bounds = this.getPixelBounds(),
			    sw = this.unproject(bounds.getBottomLeft()),
			    ne = this.unproject(bounds.getTopRight());
	
			return new L.LatLngBounds(sw, ne);
		},
	
		getMinZoom: function () {
			return this.options.minZoom === undefined ? this._layersMinZoom || 0 : this.options.minZoom;
		},
	
		getMaxZoom: function () {
			return this.options.maxZoom === undefined ?
				(this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom) :
				this.options.maxZoom;
		},
	
		getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
			bounds = L.latLngBounds(bounds);
	
			var zoom = this.getMinZoom() - (inside ? 1 : 0),
			    maxZoom = this.getMaxZoom(),
			    size = this.getSize(),
	
			    nw = bounds.getNorthWest(),
			    se = bounds.getSouthEast(),
	
			    zoomNotFound = true,
			    boundsSize;
	
			padding = L.point(padding || [0, 0]);
	
			do {
				zoom++;
				boundsSize = this.project(se, zoom).subtract(this.project(nw, zoom)).add(padding).floor();
				zoomNotFound = !inside ? size.contains(boundsSize) : boundsSize.x < size.x || boundsSize.y < size.y;
	
			} while (zoomNotFound && zoom <= maxZoom);
	
			if (zoomNotFound && inside) {
				return null;
			}
	
			return inside ? zoom : zoom - 1;
		},
	
		getSize: function () {
			if (!this._size || this._sizeChanged) {
				this._size = new L.Point(
					this._container.clientWidth,
					this._container.clientHeight);
	
				this._sizeChanged = false;
			}
			return this._size.clone();
		},
	
		getPixelBounds: function (center, zoom) {
			var topLeftPoint = this._getTopLeftPoint(center, zoom);
			return new L.Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
		},
	
		getPixelOrigin: function () {
			this._checkIfLoaded();
			return this._pixelOrigin;
		},
	
		getPixelWorldBounds: function (zoom) {
			return this.options.crs.getProjectedBounds(zoom === undefined ? this.getZoom() : zoom);
		},
	
		getPane: function (pane) {
			return typeof pane === 'string' ? this._panes[pane] : pane;
		},
	
		getPanes: function () {
			return this._panes;
		},
	
		getContainer: function () {
			return this._container;
		},
	
	
		// TODO replace with universal implementation after refactoring projections
	
		getZoomScale: function (toZoom, fromZoom) {
			var crs = this.options.crs;
			fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
			return crs.scale(toZoom) / crs.scale(fromZoom);
		},
	
		getScaleZoom: function (scale, fromZoom) {
			fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
			return fromZoom + (Math.log(scale) / Math.LN2);
		},
	
	
		// conversion methods
	
		project: function (latlng, zoom) { // (LatLng[, Number]) -> Point
			zoom = zoom === undefined ? this._zoom : zoom;
			return this.options.crs.latLngToPoint(L.latLng(latlng), zoom);
		},
	
		unproject: function (point, zoom) { // (Point[, Number]) -> LatLng
			zoom = zoom === undefined ? this._zoom : zoom;
			return this.options.crs.pointToLatLng(L.point(point), zoom);
		},
	
		layerPointToLatLng: function (point) { // (Point)
			var projectedPoint = L.point(point).add(this.getPixelOrigin());
			return this.unproject(projectedPoint);
		},
	
		latLngToLayerPoint: function (latlng) { // (LatLng)
			var projectedPoint = this.project(L.latLng(latlng))._round();
			return projectedPoint._subtract(this.getPixelOrigin());
		},
	
		wrapLatLng: function (latlng) {
			return this.options.crs.wrapLatLng(L.latLng(latlng));
		},
	
		distance: function (latlng1, latlng2) {
			return this.options.crs.distance(L.latLng(latlng1), L.latLng(latlng2));
		},
	
		containerPointToLayerPoint: function (point) { // (Point)
			return L.point(point).subtract(this._getMapPanePos());
		},
	
		layerPointToContainerPoint: function (point) { // (Point)
			return L.point(point).add(this._getMapPanePos());
		},
	
		containerPointToLatLng: function (point) {
			var layerPoint = this.containerPointToLayerPoint(L.point(point));
			return this.layerPointToLatLng(layerPoint);
		},
	
		latLngToContainerPoint: function (latlng) {
			return this.layerPointToContainerPoint(this.latLngToLayerPoint(L.latLng(latlng)));
		},
	
		mouseEventToContainerPoint: function (e) { // (MouseEvent)
			return L.DomEvent.getMousePosition(e, this._container);
		},
	
		mouseEventToLayerPoint: function (e) { // (MouseEvent)
			return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
		},
	
		mouseEventToLatLng: function (e) { // (MouseEvent)
			return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
		},
	
	
		// map initialization methods
	
		_initContainer: function (id) {
			var container = this._container = L.DomUtil.get(id);
	
			if (!container) {
				throw new Error('Map container not found.');
			} else if (container._leaflet) {
				throw new Error('Map container is already initialized.');
			}
	
			L.DomEvent.addListener(container, 'scroll', this._onScroll, this);
			container._leaflet = true;
		},
	
		_initLayout: function () {
			var container = this._container;
	
			this._fadeAnimated = this.options.fadeAnimation && L.Browser.any3d;
	
			L.DomUtil.addClass(container, 'leaflet-container' +
				(L.Browser.touch ? ' leaflet-touch' : '') +
				(L.Browser.retina ? ' leaflet-retina' : '') +
				(L.Browser.ielt9 ? ' leaflet-oldie' : '') +
				(L.Browser.safari ? ' leaflet-safari' : '') +
				(this._fadeAnimated ? ' leaflet-fade-anim' : ''));
	
			var position = L.DomUtil.getStyle(container, 'position');
	
			if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
				container.style.position = 'relative';
			}
	
			this._initPanes();
	
			if (this._initControlPos) {
				this._initControlPos();
			}
		},
	
		_initPanes: function () {
			var panes = this._panes = {};
			this._paneRenderers = {};
	
			this._mapPane = this.createPane('mapPane', this._container);
			L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
	
			this.createPane('tilePane');
			this.createPane('shadowPane');
			this.createPane('overlayPane');
			this.createPane('markerPane');
			this.createPane('popupPane');
	
			if (!this.options.markerZoomAnimation) {
				L.DomUtil.addClass(panes.markerPane, 'leaflet-zoom-hide');
				L.DomUtil.addClass(panes.shadowPane, 'leaflet-zoom-hide');
			}
		},
	
	
		// private methods that modify map state
	
		_resetView: function (center, zoom) {
			L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
	
			var loading = !this._loaded;
			this._loaded = true;
			zoom = this._limitZoom(zoom);
	
			var zoomChanged = this._zoom !== zoom;
			this
				._moveStart(zoomChanged)
				._move(center, zoom)
				._moveEnd(zoomChanged);
	
			this.fire('viewreset');
	
			if (loading) {
				this.fire('load');
			}
		},
	
		_moveStart: function (zoomChanged) {
			if (zoomChanged) {
				this.fire('zoomstart');
			}
			return this.fire('movestart');
		},
	
		_move: function (center, zoom, data) {
			if (zoom === undefined) {
				zoom = this._zoom;
			}
	
			var zoomChanged = this._zoom !== zoom;
	
			this._zoom = zoom;
			this._lastCenter = center;
			this._pixelOrigin = this._getNewPixelOrigin(center);
	
			if (zoomChanged) {
				this.fire('zoom', data);
			}
			return this.fire('move', data);
		},
	
		_moveEnd: function (zoomChanged) {
			if (zoomChanged) {
				this.fire('zoomend');
			}
			return this.fire('moveend');
		},
	
		_rawPanBy: function (offset) {
			L.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
		},
	
		_getZoomSpan: function () {
			return this.getMaxZoom() - this.getMinZoom();
		},
	
		_panInsideMaxBounds: function () {
			this.panInsideBounds(this.options.maxBounds);
		},
	
		_checkIfLoaded: function () {
			if (!this._loaded) {
				throw new Error('Set map center and zoom first.');
			}
		},
	
		// DOM event handling
	
		_initEvents: function (remove) {
			if (!L.DomEvent) { return; }
	
			this._targets = {};
			this._targets[L.stamp(this._container)] = this;
	
			var onOff = remove ? 'off' : 'on';
	
			L.DomEvent[onOff](this._container, 'click dblclick mousedown mouseup ' +
				'mouseover mouseout mousemove contextmenu keypress', this._handleDOMEvent, this);
	
			if (this.options.trackResize) {
				L.DomEvent[onOff](window, 'resize', this._onResize, this);
			}
		},
	
		_onResize: function () {
			L.Util.cancelAnimFrame(this._resizeRequest);
			this._resizeRequest = L.Util.requestAnimFrame(
			        function () { this.invalidateSize({debounceMoveend: true}); }, this, false, this._container);
		},
	
		_onScroll: function () {
			this._container.scrollTop  = 0;
			this._container.scrollLeft = 0;
		},
	
		_findEventTargets: function (src, type, bubble) {
			var targets = [], target;
			while (src) {
				target = this._targets[L.stamp(src)];
				if (target && target.listens(type, true)) {
					targets.push(target);
					if (!bubble) { break; }
				}
				if (src === this._container) {
					break;
				}
				src = src.parentNode;
			}
			return targets;
		},
	
		_handleDOMEvent: function (e) {
			if (!this._loaded || L.DomEvent._skipped(e)) { return; }
	
			// find the layer the event is propagating from and its parents
			var type = e.type === 'keypress' && e.keyCode === 13 ? 'click' : e.type;
	
			if (e.type === 'click') {
				// Fire a synthetic 'preclick' event which propagates up (mainly for closing popups).
				var synth = L.Util.extend({}, e);
				synth.type = 'preclick';
				this._handleDOMEvent(synth);
			}
	
			if (type === 'mousedown') {
				// prevents outline when clicking on keyboard-focusable element
				L.DomUtil.preventOutline(e.target || e.srcElement);
			}
	
			this._fireDOMEvent(e, type);
		},
	
		_fireDOMEvent: function (e, type, targets) {
	
			if (type === 'contextmenu') {
				L.DomEvent.preventDefault(e);
			}
	
			var isHover = type === 'mouseover' || type === 'mouseout';
			targets = (targets || []).concat(this._findEventTargets(e.target || e.srcElement, type, !isHover));
	
			if (!targets.length) {
				targets = [this];
	
				// special case for map mouseover/mouseout events so that they're actually mouseenter/mouseleave
				if (isHover && !L.DomEvent._checkMouse(this._container, e)) { return; }
			}
	
			var target = targets[0];
	
			// prevents firing click after you just dragged an object
			if (e.type === 'click' && !e._simulated && this._draggableMoved(target)) { return; }
	
			var data = {
				originalEvent: e
			};
	
			if (e.type !== 'keypress') {
				var isMarker = target instanceof L.Marker;
				data.containerPoint = isMarker ?
						this.latLngToContainerPoint(target.getLatLng()) : this.mouseEventToContainerPoint(e);
				data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
				data.latlng = isMarker ? target.getLatLng() : this.layerPointToLatLng(data.layerPoint);
			}
	
			for (var i = 0; i < targets.length; i++) {
				targets[i].fire(type, data, true);
				if (data.originalEvent._stopped
					|| (targets[i].options.nonBubblingEvents && L.Util.indexOf(targets[i].options.nonBubblingEvents, type) !== -1)) { return; }
			}
		},
	
		_draggableMoved: function (obj) {
			obj = obj.options.draggable ? obj : this;
			return (obj.dragging && obj.dragging.moved()) || (this.boxZoom && this.boxZoom.moved());
		},
	
		_clearHandlers: function () {
			for (var i = 0, len = this._handlers.length; i < len; i++) {
				this._handlers[i].disable();
			}
		},
	
		whenReady: function (callback, context) {
			if (this._loaded) {
				callback.call(context || this, {target: this});
			} else {
				this.on('load', callback, context);
			}
			return this;
		},
	
	
		// private methods for getting map state
	
		_getMapPanePos: function () {
			return L.DomUtil.getPosition(this._mapPane) || new L.Point(0, 0);
		},
	
		_moved: function () {
			var pos = this._getMapPanePos();
			return pos && !pos.equals([0, 0]);
		},
	
		_getTopLeftPoint: function (center, zoom) {
			var pixelOrigin = center && zoom !== undefined ?
				this._getNewPixelOrigin(center, zoom) :
				this.getPixelOrigin();
			return pixelOrigin.subtract(this._getMapPanePos());
		},
	
		_getNewPixelOrigin: function (center, zoom) {
			var viewHalf = this.getSize()._divideBy(2);
			return this.project(center, zoom)._subtract(viewHalf)._add(this._getMapPanePos())._round();
		},
	
		_latLngToNewLayerPoint: function (latlng, zoom, center) {
			var topLeft = this._getNewPixelOrigin(center, zoom);
			return this.project(latlng, zoom)._subtract(topLeft);
		},
	
		// layer point of the current center
		_getCenterLayerPoint: function () {
			return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
		},
	
		// offset of the specified place to the current center in pixels
		_getCenterOffset: function (latlng) {
			return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
		},
	
		// adjust center for view to get inside bounds
		_limitCenter: function (center, zoom, bounds) {
	
			if (!bounds) { return center; }
	
			var centerPoint = this.project(center, zoom),
			    viewHalf = this.getSize().divideBy(2),
			    viewBounds = new L.Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
			    offset = this._getBoundsOffset(viewBounds, bounds, zoom);
	
			return this.unproject(centerPoint.add(offset), zoom);
		},
	
		// adjust offset for view to get inside bounds
		_limitOffset: function (offset, bounds) {
			if (!bounds) { return offset; }
	
			var viewBounds = this.getPixelBounds(),
			    newBounds = new L.Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));
	
			return offset.add(this._getBoundsOffset(newBounds, bounds));
		},
	
		// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
		_getBoundsOffset: function (pxBounds, maxBounds, zoom) {
			var nwOffset = this.project(maxBounds.getNorthWest(), zoom).subtract(pxBounds.min),
			    seOffset = this.project(maxBounds.getSouthEast(), zoom).subtract(pxBounds.max),
	
			    dx = this._rebound(nwOffset.x, -seOffset.x),
			    dy = this._rebound(nwOffset.y, -seOffset.y);
	
			return new L.Point(dx, dy);
		},
	
		_rebound: function (left, right) {
			return left + right > 0 ?
				Math.round(left - right) / 2 :
				Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
		},
	
		_limitZoom: function (zoom) {
			var min = this.getMinZoom(),
			    max = this.getMaxZoom();
			if (!L.Browser.any3d) { zoom = Math.round(zoom); }
	
			return Math.max(min, Math.min(max, zoom));
		}
	});
	
	L.map = function (id, options) {
		return new L.Map(id, options);
	};
	
	
	
	L.Layer = L.Evented.extend({
	
		options: {
			pane: 'overlayPane',
			nonBubblingEvents: []  // Array of events that should not be bubbled to DOM parents (like the map)
		},
	
		addTo: function (map) {
			map.addLayer(this);
			return this;
		},
	
		remove: function () {
			return this.removeFrom(this._map || this._mapToAdd);
		},
	
		removeFrom: function (obj) {
			if (obj) {
				obj.removeLayer(this);
			}
			return this;
		},
	
		getPane: function (name) {
			return this._map.getPane(name ? (this.options[name] || name) : this.options.pane);
		},
	
		addInteractiveTarget: function (targetEl) {
			this._map._targets[L.stamp(targetEl)] = this;
			return this;
		},
	
		removeInteractiveTarget: function (targetEl) {
			delete this._map._targets[L.stamp(targetEl)];
			return this;
		},
	
		isPopupOpen: function() {
			return this._popup.isOpen();
		},
	
		_layerAdd: function (e) {
			var map = e.target;
	
			// check in case layer gets added and then removed before the map is ready
			if (!map.hasLayer(this)) { return; }
	
			this._map = map;
			this._zoomAnimated = map._zoomAnimated;
	
			this.onAdd(map);
	
			if (this.getAttribution && this._map.attributionControl) {
				this._map.attributionControl.addAttribution(this.getAttribution());
			}
	
			if (this.getEvents) {
				map.on(this.getEvents(), this);
			}
	
			this.fire('add');
			map.fire('layeradd', {layer: this});
		}
	});
	
	
	L.Map.include({
		addLayer: function (layer) {
			var id = L.stamp(layer);
			if (this._layers[id]) { return layer; }
			this._layers[id] = layer;
	
			layer._mapToAdd = this;
	
			if (layer.beforeAdd) {
				layer.beforeAdd(this);
			}
	
			this.whenReady(layer._layerAdd, layer);
	
			return this;
		},
	
		removeLayer: function (layer) {
			var id = L.stamp(layer);
	
			if (!this._layers[id]) { return this; }
	
			if (this._loaded) {
				layer.onRemove(this);
			}
	
			if (layer.getAttribution && this.attributionControl) {
				this.attributionControl.removeAttribution(layer.getAttribution());
			}
	
			if (layer.getEvents) {
				this.off(layer.getEvents(), layer);
			}
	
			delete this._layers[id];
	
			if (this._loaded) {
				this.fire('layerremove', {layer: layer});
				layer.fire('remove');
			}
	
			layer._map = layer._mapToAdd = null;
	
			return this;
		},
	
		hasLayer: function (layer) {
			return !!layer && (L.stamp(layer) in this._layers);
		},
	
		eachLayer: function (method, context) {
			for (var i in this._layers) {
				method.call(context, this._layers[i]);
			}
			return this;
		},
	
		_addLayers: function (layers) {
			layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];
	
			for (var i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		},
	
		_addZoomLimit: function (layer) {
			if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
				this._zoomBoundLayers[L.stamp(layer)] = layer;
				this._updateZoomLevels();
			}
		},
	
		_removeZoomLimit: function (layer) {
			var id = L.stamp(layer);
	
			if (this._zoomBoundLayers[id]) {
				delete this._zoomBoundLayers[id];
				this._updateZoomLevels();
			}
		},
	
		_updateZoomLevels: function () {
			var minZoom = Infinity,
				maxZoom = -Infinity,
				oldZoomSpan = this._getZoomSpan();
	
			for (var i in this._zoomBoundLayers) {
				var options = this._zoomBoundLayers[i].options;
	
				minZoom = options.minZoom === undefined ? minZoom : Math.min(minZoom, options.minZoom);
				maxZoom = options.maxZoom === undefined ? maxZoom : Math.max(maxZoom, options.maxZoom);
			}
	
			this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
			this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;
	
			if (oldZoomSpan !== this._getZoomSpan()) {
				this.fire('zoomlevelschange');
			}
		}
	});
	
	
	/*
	 * Mercator projection that takes into account that the Earth is not a perfect sphere.
	 * Less popular than spherical mercator; used by projections like EPSG:3395.
	 */
	
	L.Projection.Mercator = {
		R: 6378137,
		R_MINOR: 6356752.314245179,
	
		bounds: L.bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),
	
		project: function (latlng) {
			var d = Math.PI / 180,
			    r = this.R,
			    y = latlng.lat * d,
			    tmp = this.R_MINOR / r,
			    e = Math.sqrt(1 - tmp * tmp),
			    con = e * Math.sin(y);
	
			var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
			y = -r * Math.log(Math.max(ts, 1E-10));
	
			return new L.Point(latlng.lng * d * r, y);
		},
	
		unproject: function (point) {
			var d = 180 / Math.PI,
			    r = this.R,
			    tmp = this.R_MINOR / r,
			    e = Math.sqrt(1 - tmp * tmp),
			    ts = Math.exp(-point.y / r),
			    phi = Math.PI / 2 - 2 * Math.atan(ts);
	
			for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
				con = e * Math.sin(phi);
				con = Math.pow((1 - con) / (1 + con), e / 2);
				dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
				phi += dphi;
			}
	
			return new L.LatLng(phi * d, point.x * d / r);
		}
	};
	
	
	/*
	 * L.CRS.EPSG3857 (World Mercator) CRS implementation.
	 */
	
	L.CRS.EPSG3395 = L.extend({}, L.CRS.Earth, {
		code: 'EPSG:3395',
		projection: L.Projection.Mercator,
	
		transformation: (function () {
			var scale = 0.5 / (Math.PI * L.Projection.Mercator.R);
			return new L.Transformation(scale, 0.5, -scale, 0.5);
		}())
	});
	
	
	/*
	 * L.GridLayer is used as base class for grid-like layers like TileLayer.
	 */
	
	L.GridLayer = L.Layer.extend({
	
		options: {
			pane: 'tilePane',
	
			tileSize: 256,
			opacity: 1,
	
			updateWhenIdle: L.Browser.mobile,
			updateInterval: 200,
	
			attribution: null,
			zIndex: null,
			bounds: null,
	
			minZoom: 0
			// maxZoom: <Number>
		},
	
		initialize: function (options) {
			options = L.setOptions(this, options);
		},
	
		onAdd: function () {
			this._initContainer();
	
			this._levels = {};
			this._tiles = {};
	
			this._resetView();
			this._update();
		},
	
		beforeAdd: function (map) {
			map._addZoomLimit(this);
		},
	
		onRemove: function (map) {
			L.DomUtil.remove(this._container);
			map._removeZoomLimit(this);
			this._container = null;
			this._tileZoom = null;
		},
	
		bringToFront: function () {
			if (this._map) {
				L.DomUtil.toFront(this._container);
				this._setAutoZIndex(Math.max);
			}
			return this;
		},
	
		bringToBack: function () {
			if (this._map) {
				L.DomUtil.toBack(this._container);
				this._setAutoZIndex(Math.min);
			}
			return this;
		},
	
		getAttribution: function () {
			return this.options.attribution;
		},
	
		getContainer: function () {
			return this._container;
		},
	
		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			this._updateOpacity();
			return this;
		},
	
		setZIndex: function (zIndex) {
			this.options.zIndex = zIndex;
			this._updateZIndex();
	
			return this;
		},
	
		isLoading: function () {
			return this._loading;
		},
	
		redraw: function () {
			if (this._map) {
				this._removeAllTiles();
				this._update();
			}
			return this;
		},
	
		getEvents: function () {
			var events = {
				viewreset: this._resetAll,
				zoom: this._resetView,
				moveend: this._onMoveEnd
			};
	
			if (!this.options.updateWhenIdle) {
				// update tiles on move, but not more often than once per given interval
				if (!this._onMove) {
					this._onMove = L.Util.throttle(this._onMoveEnd, this.options.updateInterval, this);
				}
	
				events.move = this._onMove;
			}
	
			if (this._zoomAnimated) {
				events.zoomanim = this._animateZoom;
			}
	
			return events;
		},
	
		createTile: function () {
			return document.createElement('div');
		},
	
		getTileSize: function () {
			var s = this.options.tileSize;
			return s instanceof L.Point ? s : new L.Point(s, s);
		},
	
		_updateZIndex: function () {
			if (this._container && this.options.zIndex !== undefined && this.options.zIndex !== null) {
				this._container.style.zIndex = this.options.zIndex;
			}
		},
	
		_setAutoZIndex: function (compare) {
			// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)
	
			var layers = this.getPane().children,
			    edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min
	
			for (var i = 0, len = layers.length, zIndex; i < len; i++) {
	
				zIndex = layers[i].style.zIndex;
	
				if (layers[i] !== this._container && zIndex) {
					edgeZIndex = compare(edgeZIndex, +zIndex);
				}
			}
	
			if (isFinite(edgeZIndex)) {
				this.options.zIndex = edgeZIndex + compare(-1, 1);
				this._updateZIndex();
			}
		},
	
		_updateOpacity: function () {
			if (!this._map) { return; }
			var opacity = this.options.opacity;
	
			// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
			if (!L.Browser.ielt9 && !this._map._fadeAnimated) {
				L.DomUtil.setOpacity(this._container, opacity);
				return;
			}
	
			var now = +new Date(),
				nextFrame = false,
				willPrune = false;
	
			for (var key in this._tiles) {
				var tile = this._tiles[key];
				if (!tile.current || !tile.loaded) { continue; }
	
				var fade = Math.min(1, (now - tile.loaded) / 200);
				if (fade < 1) {
					L.DomUtil.setOpacity(tile.el, opacity * fade);
					nextFrame = true;
				} else {
					L.DomUtil.setOpacity(tile.el, opacity);
					if (tile.active) { willPrune = true; }
					tile.active = true;
				}
			}
	
			if (willPrune) { this._pruneTiles(); }
	
			if (nextFrame) {
				L.Util.cancelAnimFrame(this._fadeFrame);
				this._fadeFrame = L.Util.requestAnimFrame(this._updateOpacity, this);
			}
		},
	
		_initContainer: function () {
			if (this._container) { return; }
	
			this._container = L.DomUtil.create('div', 'leaflet-layer');
			this._updateZIndex();
	
			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
	
			this.getPane().appendChild(this._container);
		},
	
		_updateLevels: function () {
	
			var zoom = this._tileZoom,
				maxZoom = this.options.maxZoom;
	
			for (var z in this._levels) {
				if (this._levels[z].el.children.length || z === zoom) {
					this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom - z);
				} else {
					L.DomUtil.remove(this._levels[z].el);
					delete this._levels[z];
				}
			}
	
			var level = this._levels[zoom],
			    map = this._map;
	
			if (!level) {
				level = this._levels[zoom] = {};
	
				level.el = L.DomUtil.create('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
				level.el.style.zIndex = maxZoom;
	
				level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
				level.zoom = zoom;
	
				this._setZoomTransform(level, map.getCenter(), map.getZoom());
	
				// force the browser to consider the newly added element for transition
				L.Util.falseFn(level.el.offsetWidth);
			}
	
			this._level = level;
	
			return level;
		},
	
		_pruneTiles: function () {
			var key, tile;
	
			var zoom = this._map.getZoom();
			if (zoom > this.options.maxZoom ||
				zoom < this.options.minZoom) { return this._removeAllTiles(); }
	
			for (key in this._tiles) {
				tile = this._tiles[key];
				tile.retain = tile.current;
			}
	
			for (key in this._tiles) {
				tile = this._tiles[key];
				if (tile.current && !tile.active) {
					var coords = tile.coords;
					if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
						this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
					}
				}
			}
	
			for (key in this._tiles) {
				if (!this._tiles[key].retain) {
					this._removeTile(key);
				}
			}
		},
	
		_removeAllTiles: function () {
			for (var key in this._tiles) {
				this._removeTile(key);
			}
		},
	
		_resetAll: function () {
			for (var z in this._levels) {
				L.DomUtil.remove(this._levels[z].el);
				delete this._levels[z];
			}
			this._removeAllTiles();
	
			this._tileZoom = null;
			this._resetView();
		},
	
		_retainParent: function (x, y, z, minZoom) {
			var x2 = Math.floor(x / 2),
				y2 = Math.floor(y / 2),
				z2 = z - 1;
	
			var key = x2 + ':' + y2 + ':' + z2,
				tile = this._tiles[key];
	
			if (tile && tile.active) {
				tile.retain = true;
				return true;
	
			} else if (tile && tile.loaded) {
				tile.retain = true;
			}
	
			if (z2 > minZoom) {
				return this._retainParent(x2, y2, z2, minZoom);
			}
	
			return false;
		},
	
		_retainChildren: function (x, y, z, maxZoom) {
	
			for (var i = 2 * x; i < 2 * x + 2; i++) {
				for (var j = 2 * y; j < 2 * y + 2; j++) {
	
					var key = i + ':' + j + ':' + (z + 1),
						tile = this._tiles[key];
	
					if (tile && tile.active) {
						tile.retain = true;
						continue;
	
					} else if (tile && tile.loaded) {
						tile.retain = true;
					}
	
					if (z + 1 < maxZoom) {
						this._retainChildren(i, j, z + 1, maxZoom);
					}
				}
			}
		},
	
		_resetView: function (e) {
			var pinch = e && e.pinch;
			this._setView(this._map.getCenter(), this._map.getZoom(), pinch, pinch);
		},
	
		_animateZoom: function (e) {
			this._setView(e.center, e.zoom, true, e.noUpdate);
		},
	
		_setView: function (center, zoom, noPrune, noUpdate) {
			var tileZoom = Math.round(zoom),
				tileZoomChanged = this._tileZoom !== tileZoom;
	
			if (!noUpdate && tileZoomChanged) {
	
				if (this._abortLoading) {
					this._abortLoading();
				}
	
				this._tileZoom = tileZoom;
				this._updateLevels();
				this._resetGrid();
	
				if (!L.Browser.mobileWebkit) {
					this._update(center, tileZoom);
				}
	
				if (!noPrune) {
					this._pruneTiles();
				}
			}
	
			this._setZoomTransforms(center, zoom);
		},
	
		_setZoomTransforms: function (center, zoom) {
			for (var i in this._levels) {
				this._setZoomTransform(this._levels[i], center, zoom);
			}
		},
	
		_setZoomTransform: function (level, center, zoom) {
			var scale = this._map.getZoomScale(zoom, level.zoom),
			    translate = level.origin.multiplyBy(scale)
			        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();
	
			if (L.Browser.any3d) {
				L.DomUtil.setTransform(level.el, translate, scale);
			} else {
				L.DomUtil.setPosition(level.el, translate);
			}
		},
	
		_resetGrid: function () {
			var map = this._map,
			    crs = map.options.crs,
			    tileSize = this._tileSize = this.getTileSize(),
			    tileZoom = this._tileZoom;
	
			var bounds = this._map.getPixelWorldBounds(this._tileZoom);
			if (bounds) {
				this._globalTileRange = this._pxBoundsToTileRange(bounds);
			}
	
			this._wrapX = crs.wrapLng && [
				Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x),
				Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.y)
			];
			this._wrapY = crs.wrapLat && [
				Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.x),
				Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)
			];
		},
	
		_onMoveEnd: function () {
			if (!this._map) { return; }
	
			this._update();
			this._pruneTiles();
		},
	
		_getTiledPixelBounds: function (center, zoom, tileZoom) {
			var map = this._map;
	
			var scale = map.getZoomScale(zoom, tileZoom),
				pixelCenter = map.project(center, tileZoom).floor(),
				halfSize = map.getSize().divideBy(scale * 2);
	
			return new L.Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
		},
	
		_update: function (center, zoom) {
	
			var map = this._map;
			if (!map) { return; }
	
			if (center === undefined) { center = map.getCenter(); }
			if (zoom === undefined) { zoom = map.getZoom(); }
			var tileZoom = Math.round(zoom);
	
			if (tileZoom > this.options.maxZoom ||
				tileZoom < this.options.minZoom) { return; }
	
			var pixelBounds = this._getTiledPixelBounds(center, zoom, tileZoom);
	
			var tileRange = this._pxBoundsToTileRange(pixelBounds),
				tileCenter = tileRange.getCenter(),
				queue = [];
	
			for (var key in this._tiles) {
				this._tiles[key].current = false;
			}
	
			// create a queue of coordinates to load tiles from
			for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
				for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
					var coords = new L.Point(i, j);
					coords.z = tileZoom;
	
					if (!this._isValidTile(coords)) { continue; }
	
					var tile = this._tiles[this._tileCoordsToKey(coords)];
					if (tile) {
						tile.current = true;
					} else {
						queue.push(coords);
					}
				}
			}
	
			// sort tile queue to load tiles in order of their distance to center
			queue.sort(function (a, b) {
				return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
			});
	
			if (queue.length !== 0) {
				// if its the first batch of tiles to load
				if (!this._loading) {
					this._loading = true;
					this.fire('loading');
				}
	
				// create DOM fragment to append tiles in one batch
				var fragment = document.createDocumentFragment();
	
				for (i = 0; i < queue.length; i++) {
					this._addTile(queue[i], fragment);
				}
	
				this._level.el.appendChild(fragment);
			}
		},
	
		_isValidTile: function (coords) {
			var crs = this._map.options.crs;
	
			if (!crs.infinite) {
				// don't load tile if it's out of bounds and not wrapped
				var bounds = this._globalTileRange;
				if ((!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
				    (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))) { return false; }
			}
	
			if (!this.options.bounds) { return true; }
	
			// don't load tile if it doesn't intersect the bounds in options
			var tileBounds = this._tileCoordsToBounds(coords);
			return L.latLngBounds(this.options.bounds).overlaps(tileBounds);
		},
	
		_keyToBounds: function (key) {
			return this._tileCoordsToBounds(this._keyToTileCoords(key));
		},
	
		// converts tile coordinates to its geographical bounds
		_tileCoordsToBounds: function (coords) {
	
			var map = this._map,
			    tileSize = this.getTileSize(),
	
			    nwPoint = coords.scaleBy(tileSize),
			    sePoint = nwPoint.add(tileSize),
	
			    nw = map.wrapLatLng(map.unproject(nwPoint, coords.z)),
			    se = map.wrapLatLng(map.unproject(sePoint, coords.z));
	
			return new L.LatLngBounds(nw, se);
		},
	
		// converts tile coordinates to key for the tile cache
		_tileCoordsToKey: function (coords) {
			return coords.x + ':' + coords.y + ':' + coords.z;
		},
	
		// converts tile cache key to coordinates
		_keyToTileCoords: function (key) {
			var k = key.split(':'),
				coords = new L.Point(+k[0], +k[1]);
			coords.z = +k[2];
			return coords;
		},
	
		_removeTile: function (key) {
			var tile = this._tiles[key];
			if (!tile) { return; }
	
			L.DomUtil.remove(tile.el);
	
			delete this._tiles[key];
	
			this.fire('tileunload', {
				tile: tile.el,
				coords: this._keyToTileCoords(key)
			});
		},
	
		_initTile: function (tile) {
			L.DomUtil.addClass(tile, 'leaflet-tile');
	
			var tileSize = this.getTileSize();
			tile.style.width = tileSize.x + 'px';
			tile.style.height = tileSize.y + 'px';
	
			tile.onselectstart = L.Util.falseFn;
			tile.onmousemove = L.Util.falseFn;
	
			// update opacity on tiles in IE7-8 because of filter inheritance problems
			if (L.Browser.ielt9 && this.options.opacity < 1) {
				L.DomUtil.setOpacity(tile, this.options.opacity);
			}
	
			// without this hack, tiles disappear after zoom on Chrome for Android
			// https://github.com/Leaflet/Leaflet/issues/2078
			if (L.Browser.android && !L.Browser.android23) {
				tile.style.WebkitBackfaceVisibility = 'hidden';
			}
		},
	
		_addTile: function (coords, container) {
			var tilePos = this._getTilePos(coords),
			    key = this._tileCoordsToKey(coords);
	
			var tile = this.createTile(this._wrapCoords(coords), L.bind(this._tileReady, this, coords));
	
			this._initTile(tile);
	
			// if createTile is defined with a second argument ("done" callback),
			// we know that tile is async and will be ready later; otherwise
			if (this.createTile.length < 2) {
				// mark tile as ready, but delay one frame for opacity animation to happen
				setTimeout(L.bind(this._tileReady, this, coords, null, tile), 0);
			}
	
			// we prefer top/left over translate3d so that we don't create a HW-accelerated layer from each tile
			// which is slow, and it also fixes gaps between tiles in Safari
			L.DomUtil.setPosition(tile, tilePos);
	
			// save tile in cache
			this._tiles[key] = {
				el: tile,
				coords: coords,
				current: true
			};
	
			container.appendChild(tile);
			this.fire('tileloadstart', {
				tile: tile,
				coords: coords
			});
		},
	
		_tileReady: function (coords, err, tile) {
			if (!this._map) { return; }
	
			if (err) {
				this.fire('tileerror', {
					error: err,
					tile: tile,
					coords: coords
				});
			}
	
			var key = this._tileCoordsToKey(coords);
	
			tile = this._tiles[key];
			if (!tile) { return; }
	
			tile.loaded = +new Date();
			if (this._map._fadeAnimated) {
				L.DomUtil.setOpacity(tile.el, 0);
				L.Util.cancelAnimFrame(this._fadeFrame);
				this._fadeFrame = L.Util.requestAnimFrame(this._updateOpacity, this);
			} else {
				tile.active = true;
				this._pruneTiles();
			}
	
			L.DomUtil.addClass(tile.el, 'leaflet-tile-loaded');
	
			this.fire('tileload', {
				tile: tile.el,
				coords: coords
			});
	
			if (this._noTilesToLoad()) {
				this._loading = false;
				this.fire('load');
			}
		},
	
		_getTilePos: function (coords) {
			return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
		},
	
		_wrapCoords: function (coords) {
			var newCoords = new L.Point(
				this._wrapX ? L.Util.wrapNum(coords.x, this._wrapX) : coords.x,
				this._wrapY ? L.Util.wrapNum(coords.y, this._wrapY) : coords.y);
			newCoords.z = coords.z;
			return newCoords;
		},
	
		_pxBoundsToTileRange: function (bounds) {
			var tileSize = this.getTileSize();
			return new L.Bounds(
				bounds.min.unscaleBy(tileSize).floor(),
				bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1]));
		},
	
		_noTilesToLoad: function () {
			for (var key in this._tiles) {
				if (!this._tiles[key].loaded) { return false; }
			}
			return true;
		}
	});
	
	L.gridLayer = function (options) {
		return new L.GridLayer(options);
	};
	
	
	/*
	 * L.TileLayer is used for standard xyz-numbered tile layers.
	 */
	
	L.TileLayer = L.GridLayer.extend({
	
		options: {
			maxZoom: 18,
	
			subdomains: 'abc',
			errorTileUrl: '',
			zoomOffset: 0,
	
			maxNativeZoom: null, // Number
			tms: false,
			zoomReverse: false,
			detectRetina: false,
			crossOrigin: false
		},
	
		initialize: function (url, options) {
	
			this._url = url;
	
			options = L.setOptions(this, options);
	
			// detecting retina displays, adjusting tileSize and zoom levels
			if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {
	
				options.tileSize = Math.floor(options.tileSize / 2);
				options.zoomOffset++;
	
				options.minZoom = Math.max(0, options.minZoom);
				options.maxZoom--;
			}
	
			if (typeof options.subdomains === 'string') {
				options.subdomains = options.subdomains.split('');
			}
	
			// for https://github.com/Leaflet/Leaflet/issues/137
			if (!L.Browser.android) {
				this.on('tileunload', this._onTileRemove);
			}
		},
	
		setUrl: function (url, noRedraw) {
			this._url = url;
	
			if (!noRedraw) {
				this.redraw();
			}
			return this;
		},
	
		createTile: function (coords, done) {
			var tile = document.createElement('img');
	
			tile.onload = L.bind(this._tileOnLoad, this, done, tile);
			tile.onerror = L.bind(this._tileOnError, this, done, tile);
	
			if (this.options.crossOrigin) {
				tile.crossOrigin = '';
			}
	
			/*
			 Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
			 http://www.w3.org/TR/WCAG20-TECHS/H67
			*/
			tile.alt = '';
	
			tile.src = this.getTileUrl(coords);
	
			return tile;
		},
	
		getTileUrl: function (coords) {
			return L.Util.template(this._url, L.extend({
				r: this.options.detectRetina && L.Browser.retina && this.options.maxZoom > 0 ? '@2x' : '',
				s: this._getSubdomain(coords),
				x: coords.x,
				y: this.options.tms ? this._globalTileRange.max.y - coords.y : coords.y,
				z: this._getZoomForUrl()
			}, this.options));
		},
	
		_tileOnLoad: function (done, tile) {
			// For https://github.com/Leaflet/Leaflet/issues/3332
			if (L.Browser.ielt9) {
				setTimeout(L.bind(done, this, null, tile), 0);
			} else {
				done(null, tile);
			}
		},
	
		_tileOnError: function (done, tile, e) {
			var errorUrl = this.options.errorTileUrl;
			if (errorUrl) {
				tile.src = errorUrl;
			}
			done(e, tile);
		},
	
		getTileSize: function () {
			var map = this._map,
			    tileSize = L.GridLayer.prototype.getTileSize.call(this),
			    zoom = this._tileZoom + this.options.zoomOffset,
			    zoomN = this.options.maxNativeZoom;
	
			// increase tile size when overscaling
			return zoomN !== null && zoom > zoomN ?
					tileSize.divideBy(map.getZoomScale(zoomN, zoom)).round() :
					tileSize;
		},
	
		_onTileRemove: function (e) {
			e.tile.onload = null;
		},
	
		_getZoomForUrl: function () {
	
			var options = this.options,
			    zoom = this._tileZoom;
	
			if (options.zoomReverse) {
				zoom = options.maxZoom - zoom;
			}
	
			zoom += options.zoomOffset;
	
			return options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom;
		},
	
		_getSubdomain: function (tilePoint) {
			var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
			return this.options.subdomains[index];
		},
	
		// stops loading all tiles in the background layer
		_abortLoading: function () {
			var i, tile;
			for (i in this._tiles) {
				tile = this._tiles[i].el;
	
				tile.onload = L.Util.falseFn;
				tile.onerror = L.Util.falseFn;
	
				if (!tile.complete) {
					tile.src = L.Util.emptyImageUrl;
					L.DomUtil.remove(tile);
				}
			}
		}
	});
	
	L.tileLayer = function (url, options) {
		return new L.TileLayer(url, options);
	};
	
	
	/*
	 * L.TileLayer.WMS is used for WMS tile layers.
	 */
	
	L.TileLayer.WMS = L.TileLayer.extend({
	
		defaultWmsParams: {
			service: 'WMS',
			request: 'GetMap',
			version: '1.1.1',
			layers: '',
			styles: '',
			format: 'image/jpeg',
			transparent: false
		},
	
		options: {
			crs: null,
			uppercase: false
		},
	
		initialize: function (url, options) {
	
			this._url = url;
	
			var wmsParams = L.extend({}, this.defaultWmsParams);
	
			// all keys that are not TileLayer options go to WMS params
			for (var i in options) {
				if (!(i in this.options)) {
					wmsParams[i] = options[i];
				}
			}
	
			options = L.setOptions(this, options);
	
			wmsParams.width = wmsParams.height = options.tileSize * (options.detectRetina && L.Browser.retina ? 2 : 1);
	
			this.wmsParams = wmsParams;
		},
	
		onAdd: function (map) {
	
			this._crs = this.options.crs || map.options.crs;
			this._wmsVersion = parseFloat(this.wmsParams.version);
	
			var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
			this.wmsParams[projectionKey] = this._crs.code;
	
			L.TileLayer.prototype.onAdd.call(this, map);
		},
	
		getTileUrl: function (coords) {
	
			var tileBounds = this._tileCoordsToBounds(coords),
			    nw = this._crs.project(tileBounds.getNorthWest()),
			    se = this._crs.project(tileBounds.getSouthEast()),
	
			    bbox = (this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326 ?
				    [se.y, nw.x, nw.y, se.x] :
				    [nw.x, se.y, se.x, nw.y]).join(','),
	
			    url = L.TileLayer.prototype.getTileUrl.call(this, coords);
	
			return url +
				L.Util.getParamString(this.wmsParams, url, this.options.uppercase) +
				(this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;
		},
	
		setParams: function (params, noRedraw) {
	
			L.extend(this.wmsParams, params);
	
			if (!noRedraw) {
				this.redraw();
			}
	
			return this;
		}
	});
	
	L.tileLayer.wms = function (url, options) {
		return new L.TileLayer.WMS(url, options);
	};
	
	
	/*
	 * L.ImageOverlay is used to overlay images over the map (to specific geographical bounds).
	 */
	
	L.ImageOverlay = L.Layer.extend({
	
		options: {
			opacity: 1,
			alt: '',
			interactive: false
	
			/*
			crossOrigin: <Boolean>,
			*/
		},
	
		initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
			this._url = url;
			this._bounds = L.latLngBounds(bounds);
	
			L.setOptions(this, options);
		},
	
		onAdd: function () {
			if (!this._image) {
				this._initImage();
	
				if (this.options.opacity < 1) {
					this._updateOpacity();
				}
			}
	
			if (this.options.interactive) {
				L.DomUtil.addClass(this._image, 'leaflet-interactive');
				this.addInteractiveTarget(this._image);
			}
	
			this.getPane().appendChild(this._image);
			this._reset();
		},
	
		onRemove: function () {
			L.DomUtil.remove(this._image);
			if (this.options.interactive) {
				this.removeInteractiveTarget(this._image);
			}
		},
	
		setOpacity: function (opacity) {
			this.options.opacity = opacity;
	
			if (this._image) {
				this._updateOpacity();
			}
			return this;
		},
	
		setStyle: function (styleOpts) {
			if (styleOpts.opacity) {
				this.setOpacity(styleOpts.opacity);
			}
			return this;
		},
	
		bringToFront: function () {
			if (this._map) {
				L.DomUtil.toFront(this._image);
			}
			return this;
		},
	
		bringToBack: function () {
			if (this._map) {
				L.DomUtil.toBack(this._image);
			}
			return this;
		},
	
		setUrl: function (url) {
			this._url = url;
	
			if (this._image) {
				this._image.src = url;
			}
			return this;
		},
	
		getAttribution: function () {
			return this.options.attribution;
		},
	
		getEvents: function () {
			var events = {
				zoom: this._reset,
				viewreset: this._reset
			};
	
			if (this._zoomAnimated) {
				events.zoomanim = this._animateZoom;
			}
	
			return events;
		},
	
		getBounds: function () {
			return this._bounds;
		},
	
		getElement: function () {
			return this._image;
		},
	
		_initImage: function () {
			var img = this._image = L.DomUtil.create('img',
					'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));
	
			img.onselectstart = L.Util.falseFn;
			img.onmousemove = L.Util.falseFn;
	
			img.onload = L.bind(this.fire, this, 'load');
	
			if (this.options.crossOrigin) {
				img.crossOrigin = '';
			}
	
			img.src = this._url;
			img.alt = this.options.alt;
		},
	
		_animateZoom: function (e) {
			var scale = this._map.getZoomScale(e.zoom),
				offset = this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center);
	
			L.DomUtil.setTransform(this._image, offset, scale);
		},
	
		_reset: function () {
			var image = this._image,
			    bounds = new L.Bounds(
			        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
			        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
			    size = bounds.getSize();
	
			L.DomUtil.setPosition(image, bounds.min);
	
			image.style.width  = size.x + 'px';
			image.style.height = size.y + 'px';
		},
	
		_updateOpacity: function () {
			L.DomUtil.setOpacity(this._image, this.options.opacity);
		}
	});
	
	L.imageOverlay = function (url, bounds, options) {
		return new L.ImageOverlay(url, bounds, options);
	};
	
	
	/*
	 * L.Icon is an image-based icon class that you can use with L.Marker for custom markers.
	 */
	
	L.Icon = L.Class.extend({
		/*
		options: {
			iconUrl: (String) (required)
			iconRetinaUrl: (String) (optional, used for retina devices if detected)
			iconSize: (Point) (can be set through CSS)
			iconAnchor: (Point) (centered by default, can be set in CSS with negative margins)
			popupAnchor: (Point) (if not specified, popup opens in the anchor point)
			shadowUrl: (String) (no shadow by default)
			shadowRetinaUrl: (String) (optional, used for retina devices if detected)
			shadowSize: (Point)
			shadowAnchor: (Point)
			className: (String)
		},
		*/
	
		initialize: function (options) {
			L.setOptions(this, options);
		},
	
		createIcon: function (oldIcon) {
			return this._createIcon('icon', oldIcon);
		},
	
		createShadow: function (oldIcon) {
			return this._createIcon('shadow', oldIcon);
		},
	
		_createIcon: function (name, oldIcon) {
			var src = this._getIconUrl(name);
	
			if (!src) {
				if (name === 'icon') {
					throw new Error('iconUrl not set in Icon options (see the docs).');
				}
				return null;
			}
	
			var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
			this._setIconStyles(img, name);
	
			return img;
		},
	
		_setIconStyles: function (img, name) {
			var options = this.options,
			    size = L.point(options[name + 'Size']),
			    anchor = L.point(name === 'shadow' && options.shadowAnchor || options.iconAnchor ||
			            size && size.divideBy(2, true));
	
			img.className = 'leaflet-marker-' + name + ' ' + (options.className || '');
	
			if (anchor) {
				img.style.marginLeft = (-anchor.x) + 'px';
				img.style.marginTop  = (-anchor.y) + 'px';
			}
	
			if (size) {
				img.style.width  = size.x + 'px';
				img.style.height = size.y + 'px';
			}
		},
	
		_createImg: function (src, el) {
			el = el || document.createElement('img');
			el.src = src;
			return el;
		},
	
		_getIconUrl: function (name) {
			return L.Browser.retina && this.options[name + 'RetinaUrl'] || this.options[name + 'Url'];
		}
	});
	
	L.icon = function (options) {
		return new L.Icon(options);
	};
	
	
	/*
	 * L.Icon.Default is the blue marker icon used by default in Leaflet.
	 */
	
	L.Icon.Default = L.Icon.extend({
	
		options: {
			iconSize:    [25, 41],
			iconAnchor:  [12, 41],
			popupAnchor: [1, -34],
			shadowSize:  [41, 41]
		},
	
		_getIconUrl: function (name) {
			var key = name + 'Url';
	
			if (this.options[key]) {
				return this.options[key];
			}
	
			var path = L.Icon.Default.imagePath;
	
			if (!path) {
				throw new Error('Couldn\'t autodetect L.Icon.Default.imagePath, set it manually.');
			}
	
			return path + '/marker-' + name + (L.Browser.retina && name === 'icon' ? '-2x' : '') + '.png';
		}
	});
	
	L.Icon.Default.imagePath = (function () {
		var scripts = document.getElementsByTagName('script'),
		    leafletRe = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;
	
		var i, len, src, path;
	
		for (i = 0, len = scripts.length; i < len; i++) {
			src = scripts[i].src;
	
			if (src.match(leafletRe)) {
				path = src.split(leafletRe)[0];
				return (path ? path + '/' : '') + 'images';
			}
		}
	}());
	
	
	/*
	 * L.Marker is used to display clickable/draggable icons on the map.
	 */
	
	L.Marker = L.Layer.extend({
	
		options: {
			pane: 'markerPane',
			nonBubblingEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu'],
	
			icon: new L.Icon.Default(),
			// title: '',
			// alt: '',
			interactive: true,
			// draggable: false,
			keyboard: true,
			zIndexOffset: 0,
			opacity: 1,
			// riseOnHover: false,
			riseOffset: 250
		},
	
		initialize: function (latlng, options) {
			L.setOptions(this, options);
			this._latlng = L.latLng(latlng);
		},
	
		onAdd: function (map) {
			this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;
	
			this._initIcon();
			this.update();
		},
	
		onRemove: function () {
			if (this.dragging && this.dragging.enabled()) {
				this.options.draggable = true;
				this.dragging.removeHooks();
			}
	
			this._removeIcon();
			this._removeShadow();
		},
	
		getEvents: function () {
			var events = {
				zoom: this.update,
				viewreset: this.update
			};
	
			if (this._zoomAnimated) {
				events.zoomanim = this._animateZoom;
			}
	
			return events;
		},
	
		getLatLng: function () {
			return this._latlng;
		},
	
		setLatLng: function (latlng) {
			var oldLatLng = this._latlng;
			this._latlng = L.latLng(latlng);
			this.update();
			return this.fire('move', {oldLatLng: oldLatLng, latlng: this._latlng});
		},
	
		setZIndexOffset: function (offset) {
			this.options.zIndexOffset = offset;
			return this.update();
		},
	
		setIcon: function (icon) {
	
			this.options.icon = icon;
	
			if (this._map) {
				this._initIcon();
				this.update();
			}
	
			if (this._popup) {
				this.bindPopup(this._popup, this._popup.options);
			}
	
			return this;
		},
	
		getElement: function () {
			return this._icon;
		},
	
		update: function () {
	
			if (this._icon) {
				var pos = this._map.latLngToLayerPoint(this._latlng).round();
				this._setPos(pos);
			}
	
			return this;
		},
	
		_initIcon: function () {
			var options = this.options,
			    classToAdd = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');
	
			var icon = options.icon.createIcon(this._icon),
				addIcon = false;
	
			// if we're not reusing the icon, remove the old one and init new one
			if (icon !== this._icon) {
				if (this._icon) {
					this._removeIcon();
				}
				addIcon = true;
	
				if (options.title) {
					icon.title = options.title;
				}
				if (options.alt) {
					icon.alt = options.alt;
				}
			}
	
			L.DomUtil.addClass(icon, classToAdd);
	
			if (options.keyboard) {
				icon.tabIndex = '0';
			}
	
			this._icon = icon;
			this._initInteraction();
	
			if (options.riseOnHover) {
				this.on({
					mouseover: this._bringToFront,
					mouseout: this._resetZIndex
				});
			}
	
			var newShadow = options.icon.createShadow(this._shadow),
				addShadow = false;
	
			if (newShadow !== this._shadow) {
				this._removeShadow();
				addShadow = true;
			}
	
			if (newShadow) {
				L.DomUtil.addClass(newShadow, classToAdd);
			}
			this._shadow = newShadow;
	
	
			if (options.opacity < 1) {
				this._updateOpacity();
			}
	
	
			if (addIcon) {
				this.getPane().appendChild(this._icon);
			}
			if (newShadow && addShadow) {
				this.getPane('shadowPane').appendChild(this._shadow);
			}
		},
	
		_removeIcon: function () {
			if (this.options.riseOnHover) {
				this.off({
					mouseover: this._bringToFront,
				    mouseout: this._resetZIndex
				});
			}
	
			L.DomUtil.remove(this._icon);
			this.removeInteractiveTarget(this._icon);
	
			this._icon = null;
		},
	
		_removeShadow: function () {
			if (this._shadow) {
				L.DomUtil.remove(this._shadow);
			}
			this._shadow = null;
		},
	
		_setPos: function (pos) {
			L.DomUtil.setPosition(this._icon, pos);
	
			if (this._shadow) {
				L.DomUtil.setPosition(this._shadow, pos);
			}
	
			this._zIndex = pos.y + this.options.zIndexOffset;
	
			this._resetZIndex();
		},
	
		_updateZIndex: function (offset) {
			this._icon.style.zIndex = this._zIndex + offset;
		},
	
		_animateZoom: function (opt) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
	
			this._setPos(pos);
		},
	
		_initInteraction: function () {
	
			if (!this.options.interactive) { return; }
	
			L.DomUtil.addClass(this._icon, 'leaflet-interactive');
	
			this.addInteractiveTarget(this._icon);
	
			if (L.Handler.MarkerDrag) {
				var draggable = this.options.draggable;
				if (this.dragging) {
					draggable = this.dragging.enabled();
					this.dragging.disable();
				}
	
				this.dragging = new L.Handler.MarkerDrag(this);
	
				if (draggable) {
					this.dragging.enable();
				}
			}
		},
	
		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			if (this._map) {
				this._updateOpacity();
			}
	
			return this;
		},
	
		_updateOpacity: function () {
			var opacity = this.options.opacity;
	
			L.DomUtil.setOpacity(this._icon, opacity);
	
			if (this._shadow) {
				L.DomUtil.setOpacity(this._shadow, opacity);
			}
		},
	
		_bringToFront: function () {
			this._updateZIndex(this.options.riseOffset);
		},
	
		_resetZIndex: function () {
			this._updateZIndex(0);
		}
	});
	
	L.marker = function (latlng, options) {
		return new L.Marker(latlng, options);
	};
	
	
	/*
	 * L.DivIcon is a lightweight HTML-based icon class (as opposed to the image-based L.Icon)
	 * to use with L.Marker.
	 */
	
	L.DivIcon = L.Icon.extend({
		options: {
			iconSize: [12, 12], // also can be set through CSS
			/*
			iconAnchor: (Point)
			popupAnchor: (Point)
			html: (String)
			bgPos: (Point)
			*/
			className: 'leaflet-div-icon',
			html: false
		},
	
		createIcon: function (oldIcon) {
			var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
			    options = this.options;
	
			div.innerHTML = options.html !== false ? options.html : '';
	
			if (options.bgPos) {
				div.style.backgroundPosition = (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
			}
			this._setIconStyles(div, 'icon');
	
			return div;
		},
	
		createShadow: function () {
			return null;
		}
	});
	
	L.divIcon = function (options) {
		return new L.DivIcon(options);
	};
	
	
	/*
	 * L.Popup is used for displaying popups on the map.
	 */
	
	L.Map.mergeOptions({
		closePopupOnClick: true
	});
	
	L.Popup = L.Layer.extend({
	
		options: {
			pane: 'popupPane',
	
			minWidth: 50,
			maxWidth: 300,
			// maxHeight: <Number>,
			offset: [0, 7],
	
			autoPan: true,
			autoPanPadding: [5, 5],
			// autoPanPaddingTopLeft: <Point>,
			// autoPanPaddingBottomRight: <Point>,
	
			closeButton: true,
			autoClose: true,
			// keepInView: false,
			// className: '',
			zoomAnimation: true
		},
	
		initialize: function (options, source) {
			L.setOptions(this, options);
	
			this._source = source;
		},
	
		onAdd: function (map) {
			this._zoomAnimated = this._zoomAnimated && this.options.zoomAnimation;
	
			if (!this._container) {
				this._initLayout();
			}
	
			if (map._fadeAnimated) {
				L.DomUtil.setOpacity(this._container, 0);
			}
	
			clearTimeout(this._removeTimeout);
			this.getPane().appendChild(this._container);
			this.update();
	
			if (map._fadeAnimated) {
				L.DomUtil.setOpacity(this._container, 1);
			}
	
			map.fire('popupopen', {popup: this});
	
			if (this._source) {
				this._source.fire('popupopen', {popup: this}, true);
			}
		},
	
		openOn: function (map) {
			map.openPopup(this);
			return this;
		},
	
		onRemove: function (map) {
			if (map._fadeAnimated) {
				L.DomUtil.setOpacity(this._container, 0);
				this._removeTimeout = setTimeout(L.bind(L.DomUtil.remove, L.DomUtil, this._container), 200);
			} else {
				L.DomUtil.remove(this._container);
			}
	
			map.fire('popupclose', {popup: this});
	
			if (this._source) {
				this._source.fire('popupclose', {popup: this}, true);
			}
		},
	
		getLatLng: function () {
			return this._latlng;
		},
	
		setLatLng: function (latlng) {
			this._latlng = L.latLng(latlng);
			if (this._map) {
				this._updatePosition();
				this._adjustPan();
			}
			return this;
		},
	
		getContent: function () {
			return this._content;
		},
	
		setContent: function (content) {
			this._content = content;
			this.update();
			return this;
		},
	
		getElement: function () {
			return this._container;
		},
	
		update: function () {
			if (!this._map) { return; }
	
			this._container.style.visibility = 'hidden';
	
			this._updateContent();
			this._updateLayout();
			this._updatePosition();
	
			this._container.style.visibility = '';
	
			this._adjustPan();
		},
	
		getEvents: function () {
			var events = {
				zoom: this._updatePosition,
				viewreset: this._updatePosition
			};
	
			if (this._zoomAnimated) {
				events.zoomanim = this._animateZoom;
			}
			if ('closeOnClick' in this.options ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
				events.preclick = this._close;
			}
			if (this.options.keepInView) {
				events.moveend = this._adjustPan;
			}
			return events;
		},
	
		isOpen: function () {
			return !!this._map && this._map.hasLayer(this);
		},
	
		_close: function () {
			if (this._map) {
				this._map.closePopup(this);
			}
		},
	
		_initLayout: function () {
			var prefix = 'leaflet-popup',
			    container = this._container = L.DomUtil.create('div',
				prefix + ' ' + (this.options.className || '') +
				' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide'));
	
			if (this.options.closeButton) {
				var closeButton = this._closeButton = L.DomUtil.create('a', prefix + '-close-button', container);
				closeButton.href = '#close';
				closeButton.innerHTML = '&#215;';
	
				L.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
			}
	
			var wrapper = this._wrapper = L.DomUtil.create('div', prefix + '-content-wrapper', container);
			this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);
	
			L.DomEvent
				.disableClickPropagation(wrapper)
				.disableScrollPropagation(this._contentNode)
				.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);
	
			this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
			this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);
		},
	
		_updateContent: function () {
			if (!this._content) { return; }
	
			var node = this._contentNode;
			var content = (typeof this._content === 'function') ? this._content(this._source || this) : this._content;
	
			if (typeof content === 'string') {
				node.innerHTML = content;
			} else {
				while (node.hasChildNodes()) {
					node.removeChild(node.firstChild);
				}
				node.appendChild(content);
			}
			this.fire('contentupdate');
		},
	
		_updateLayout: function () {
			var container = this._contentNode,
			    style = container.style;
	
			style.width = '';
			style.whiteSpace = 'nowrap';
	
			var width = container.offsetWidth;
			width = Math.min(width, this.options.maxWidth);
			width = Math.max(width, this.options.minWidth);
	
			style.width = (width + 1) + 'px';
			style.whiteSpace = '';
	
			style.height = '';
	
			var height = container.offsetHeight,
			    maxHeight = this.options.maxHeight,
			    scrolledClass = 'leaflet-popup-scrolled';
	
			if (maxHeight && height > maxHeight) {
				style.height = maxHeight + 'px';
				L.DomUtil.addClass(container, scrolledClass);
			} else {
				L.DomUtil.removeClass(container, scrolledClass);
			}
	
			this._containerWidth = this._container.offsetWidth;
		},
	
		_updatePosition: function () {
			if (!this._map) { return; }
	
			var pos = this._map.latLngToLayerPoint(this._latlng),
			    offset = L.point(this.options.offset);
	
			if (this._zoomAnimated) {
				L.DomUtil.setPosition(this._container, pos);
			} else {
				offset = offset.add(pos);
			}
	
			var bottom = this._containerBottom = -offset.y,
			    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;
	
			// bottom position the popup in case the height of the popup changes (images loading etc)
			this._container.style.bottom = bottom + 'px';
			this._container.style.left = left + 'px';
		},
	
		_animateZoom: function (e) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
			L.DomUtil.setPosition(this._container, pos);
		},
	
		_adjustPan: function () {
			if (!this.options.autoPan) { return; }
	
			var map = this._map,
			    containerHeight = this._container.offsetHeight,
			    containerWidth = this._containerWidth,
			    layerPos = new L.Point(this._containerLeft, -containerHeight - this._containerBottom);
	
			if (this._zoomAnimated) {
				layerPos._add(L.DomUtil.getPosition(this._container));
			}
	
			var containerPos = map.layerPointToContainerPoint(layerPos),
			    padding = L.point(this.options.autoPanPadding),
			    paddingTL = L.point(this.options.autoPanPaddingTopLeft || padding),
			    paddingBR = L.point(this.options.autoPanPaddingBottomRight || padding),
			    size = map.getSize(),
			    dx = 0,
			    dy = 0;
	
			if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
				dx = containerPos.x + containerWidth - size.x + paddingBR.x;
			}
			if (containerPos.x - dx - paddingTL.x < 0) { // left
				dx = containerPos.x - paddingTL.x;
			}
			if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
				dy = containerPos.y + containerHeight - size.y + paddingBR.y;
			}
			if (containerPos.y - dy - paddingTL.y < 0) { // top
				dy = containerPos.y - paddingTL.y;
			}
	
			if (dx || dy) {
				map
				    .fire('autopanstart')
				    .panBy([dx, dy]);
			}
		},
	
		_onCloseButtonClick: function (e) {
			this._close();
			L.DomEvent.stop(e);
		}
	});
	
	L.popup = function (options, source) {
		return new L.Popup(options, source);
	};
	
	
	L.Map.include({
		openPopup: function (popup, latlng, options) { // (Popup) or (String || HTMLElement, LatLng[, Object])
			if (!(popup instanceof L.Popup)) {
				popup = new L.Popup(options).setContent(popup);
			}
	
			if (latlng) {
				popup.setLatLng(latlng);
			}
	
			if (this.hasLayer(popup)) {
				return this;
			}
	
			if (this._popup && this._popup.options.autoClose) {
				this.closePopup();
			}
	
			this._popup = popup;
			return this.addLayer(popup);
		},
	
		closePopup: function (popup) {
			if (!popup || popup === this._popup) {
				popup = this._popup;
				this._popup = null;
			}
			if (popup) {
				this.removeLayer(popup);
			}
			return this;
		}
	});
	
	
	/*
	 * Adds popup-related methods to all layers.
	 */
	
	L.Layer.include({
	
		bindPopup: function (content, options) {
	
			if (content instanceof L.Popup) {
				L.setOptions(content, options);
				this._popup = content;
				content._source = this;
			} else {
				if (!this._popup || options) {
					this._popup = new L.Popup(options, this);
				}
				this._popup.setContent(content);
			}
	
			if (!this._popupHandlersAdded) {
				this.on({
					click: this._openPopup,
					remove: this.closePopup,
					move: this._movePopup
				});
				this._popupHandlersAdded = true;
			}
	
			// save the originally passed offset
			this._originalPopupOffset = this._popup.options.offset;
	
			return this;
		},
	
		unbindPopup: function () {
			if (this._popup) {
				this.off({
					click: this._openPopup,
					remove: this.closePopup,
					move: this._movePopup
				});
				this._popupHandlersAdded = false;
				this._popup = null;
			}
			return this;
		},
	
		openPopup: function (layer, latlng) {
			if (!(layer instanceof L.Layer)) {
				latlng = layer;
				layer = this;
			}
	
			if (layer instanceof L.FeatureGroup) {
				for (var id in this._layers) {
					layer = this._layers[id];
					break;
				}
			}
	
			if (!latlng) {
				latlng = layer.getCenter ? layer.getCenter() : layer.getLatLng();
			}
	
			if (this._popup && this._map) {
				// set the popup offset for this layer
				this._popup.options.offset = this._popupAnchor(layer);
	
				// set popup source to this layer
				this._popup._source = layer;
	
				// update the popup (content, layout, ect...)
				this._popup.update();
	
				// open the popup on the map
				this._map.openPopup(this._popup, latlng);
			}
	
			return this;
		},
	
		closePopup: function () {
			if (this._popup) {
				this._popup._close();
			}
			return this;
		},
	
		togglePopup: function (target) {
			if (this._popup) {
				if (this._popup._map) {
					this.closePopup();
				} else {
					this.openPopup(target);
				}
			}
			return this;
		},
	
		setPopupContent: function (content) {
			if (this._popup) {
				this._popup.setContent(content);
			}
			return this;
		},
	
		getPopup: function () {
			return this._popup;
		},
	
		_openPopup: function (e) {
			var layer = e.layer || e.target;
	
			if (!this._popup) {
				return;
			}
	
			if (!this._map) {
				return;
			}
	
			// if this inherits from Path its a vector and we can just
			// open the popup at the new location
			if (layer instanceof L.Path) {
				this.openPopup(e.layer || e.target, e.latlng);
				return;
			}
	
			// otherwise treat it like a marker and figure out
			// if we should toggle it open/closed
			if (this._map.hasLayer(this._popup) && this._popup._source === layer) {
				this.closePopup();
			} else {
				this.openPopup(layer, e.latlng);
			}
		},
	
		_popupAnchor: function (layer) {
			// where shold we anchor the popup on this layer?
			var anchor = layer._getPopupAnchor ? layer._getPopupAnchor() : [0, 0];
	
			// add the users passed offset to that
			var offsetToAdd = this._originalPopupOffset || L.Popup.prototype.options.offset;
	
			// return the final point to anchor the popup
			return L.point(anchor).add(offsetToAdd);
		},
	
		_movePopup: function (e) {
			this._popup.setLatLng(e.latlng);
		}
	});
	
	
	/*
	 * Popup extension to L.Marker, adding popup-related methods.
	 */
	
	L.Marker.include({
		_getPopupAnchor: function() {
			return this.options.icon.options.popupAnchor || [0, 0];
		}
	});
	
	
	/*
	 * L.LayerGroup is a class to combine several layers into one so that
	 * you can manipulate the group (e.g. add/remove it) as one layer.
	 */
	
	L.LayerGroup = L.Layer.extend({
	
		initialize: function (layers) {
			this._layers = {};
	
			var i, len;
	
			if (layers) {
				for (i = 0, len = layers.length; i < len; i++) {
					this.addLayer(layers[i]);
				}
			}
		},
	
		addLayer: function (layer) {
			var id = this.getLayerId(layer);
	
			this._layers[id] = layer;
	
			if (this._map) {
				this._map.addLayer(layer);
			}
	
			return this;
		},
	
		removeLayer: function (layer) {
			var id = layer in this._layers ? layer : this.getLayerId(layer);
	
			if (this._map && this._layers[id]) {
				this._map.removeLayer(this._layers[id]);
			}
	
			delete this._layers[id];
	
			return this;
		},
	
		hasLayer: function (layer) {
			return !!layer && (layer in this._layers || this.getLayerId(layer) in this._layers);
		},
	
		clearLayers: function () {
			for (var i in this._layers) {
				this.removeLayer(this._layers[i]);
			}
			return this;
		},
	
		invoke: function (methodName) {
			var args = Array.prototype.slice.call(arguments, 1),
			    i, layer;
	
			for (i in this._layers) {
				layer = this._layers[i];
	
				if (layer[methodName]) {
					layer[methodName].apply(layer, args);
				}
			}
	
			return this;
		},
	
		onAdd: function (map) {
			for (var i in this._layers) {
				map.addLayer(this._layers[i]);
			}
		},
	
		onRemove: function (map) {
			for (var i in this._layers) {
				map.removeLayer(this._layers[i]);
			}
		},
	
		eachLayer: function (method, context) {
			for (var i in this._layers) {
				method.call(context, this._layers[i]);
			}
			return this;
		},
	
		getLayer: function (id) {
			return this._layers[id];
		},
	
		getLayers: function () {
			var layers = [];
	
			for (var i in this._layers) {
				layers.push(this._layers[i]);
			}
			return layers;
		},
	
		setZIndex: function (zIndex) {
			return this.invoke('setZIndex', zIndex);
		},
	
		getLayerId: function (layer) {
			return L.stamp(layer);
		}
	});
	
	L.layerGroup = function (layers) {
		return new L.LayerGroup(layers);
	};
	
	
	/*
	 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and additional methods
	 * shared between a group of interactive layers (like vectors or markers).
	 */
	
	L.FeatureGroup = L.LayerGroup.extend({
	
		addLayer: function (layer) {
			if (this.hasLayer(layer)) {
				return this;
			}
	
			layer.addEventParent(this);
	
			L.LayerGroup.prototype.addLayer.call(this, layer);
	
			return this.fire('layeradd', {layer: layer});
		},
	
		removeLayer: function (layer) {
			if (!this.hasLayer(layer)) {
				return this;
			}
			if (layer in this._layers) {
				layer = this._layers[layer];
			}
	
			layer.removeEventParent(this);
	
			L.LayerGroup.prototype.removeLayer.call(this, layer);
	
			return this.fire('layerremove', {layer: layer});
		},
	
		setStyle: function (style) {
			return this.invoke('setStyle', style);
		},
	
		bringToFront: function () {
			return this.invoke('bringToFront');
		},
	
		bringToBack: function () {
			return this.invoke('bringToBack');
		},
	
		getBounds: function () {
			var bounds = new L.LatLngBounds();
	
			for (var id in this._layers) {
				var layer = this._layers[id];
				bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
			}
			return bounds;
		}
	});
	
	L.featureGroup = function (layers) {
		return new L.FeatureGroup(layers);
	};
	
	
	/*
	 * L.Renderer is a base class for renderer implementations (SVG, Canvas);
	 * handles renderer container, bounds and zoom animation.
	 */
	
	L.Renderer = L.Layer.extend({
	
		options: {
			// how much to extend the clip area around the map view (relative to its size)
			// e.g. 0.1 would be 10% of map view in each direction; defaults to clip with the map view
			padding: 0.1
		},
	
		initialize: function (options) {
			L.setOptions(this, options);
			L.stamp(this);
		},
	
		onAdd: function () {
			if (!this._container) {
				this._initContainer(); // defined by renderer implementations
	
				if (this._zoomAnimated) {
					L.DomUtil.addClass(this._container, 'leaflet-zoom-animated');
				}
			}
	
			this.getPane().appendChild(this._container);
			this._update();
		},
	
		onRemove: function () {
			L.DomUtil.remove(this._container);
		},
	
		getEvents: function () {
			var events = {
				viewreset: this._reset,
				zoom: this._updateTransform,
				moveend: this._update
			};
			if (this._zoomAnimated) {
				events.zoomanim = this._animateZoom;
			}
			return events;
		},
	
		_animateZoom: function (e) {
			var scale = this._map.getZoomScale(e.zoom, this._zoom),
			    offset = this._map._latLngToNewLayerPoint(this._topLeft, e.zoom, e.center);
	
			L.DomUtil.setTransform(this._container, offset, scale);
		},
	
		_updateTransform: function () {
			var zoom = this._map.getZoom(),
			    center = this._map.getCenter(),
			    scale = this._map.getZoomScale(zoom, this._zoom),
			    offset = this._map._latLngToNewLayerPoint(this._topLeft, zoom, center);
	
			L.DomUtil.setTransform(this._container, offset, scale);
		},
	
		_reset: function () {
			this._update();
			this._updateTransform();
		},
	
		_update: function () {
			// update pixel bounds of renderer container (for positioning/sizing/clipping later)
			var p = this.options.padding,
			    size = this._map.getSize(),
			    min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();
	
			this._bounds = new L.Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());
	
			this._topLeft = this._map.layerPointToLatLng(min);
			this._zoom = this._map.getZoom();
		}
	});
	
	
	L.Map.include({
		// used by each vector layer to decide which renderer to use
		getRenderer: function (layer) {
			var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;
	
			if (!renderer) {
				renderer = this._renderer = (this.options.preferCanvas && L.canvas()) || L.svg();
			}
	
			if (!this.hasLayer(renderer)) {
				this.addLayer(renderer);
			}
			return renderer;
		},
	
		_getPaneRenderer: function (name) {
			if (name === 'overlayPane' || name === undefined) {
				return false;
			}
	
			var renderer = this._paneRenderers[name];
			if (renderer === undefined) {
				renderer = (L.SVG && L.svg({pane: name})) || (L.Canvas && L.canvas({pane: name}));
				this._paneRenderers[name] = renderer;
			}
			return renderer;
		}
	});
	
	
	/*
	 * L.Path is the base class for all Leaflet vector layers like polygons and circles.
	 */
	
	L.Path = L.Layer.extend({
	
		options: {
			stroke: true,
			color: '#3388ff',
			weight: 3,
			opacity: 1,
			lineCap: 'round',
			lineJoin: 'round',
			// dashArray: null
			// dashOffset: null
	
			// fill: false
			// fillColor: same as color by default
			fillOpacity: 0.2,
			fillRule: 'evenodd',
	
			// className: ''
			interactive: true
		},
	
		onAdd: function () {
			this._renderer = this._map.getRenderer(this);
			this._renderer._initPath(this);
			this._reset();
			this._renderer._addPath(this);
		},
	
		onRemove: function () {
			this._renderer._removePath(this);
		},
	
		getEvents: function () {
			return {
				zoomend: this._project,
				moveend: this._update,
				viewreset: this._reset
			};
		},
	
		redraw: function () {
			if (this._map) {
				this._renderer._updatePath(this);
			}
			return this;
		},
	
		setStyle: function (style) {
			L.setOptions(this, style);
			if (this._renderer) {
				this._renderer._updateStyle(this);
			}
			return this;
		},
	
		bringToFront: function () {
			if (this._renderer) {
				this._renderer._bringToFront(this);
			}
			return this;
		},
	
		bringToBack: function () {
			if (this._renderer) {
				this._renderer._bringToBack(this);
			}
			return this;
		},
	
		getElement: function () {
			return this._path;
		},
	
		_reset: function () {
			// defined in children classes
			this._project();
			this._update();
		},
	
		_clickTolerance: function () {
			// used when doing hit detection for Canvas layers
			return (this.options.stroke ? this.options.weight / 2 : 0) + (L.Browser.touch ? 10 : 0);
		}
	});
	
	
	/*
	 * L.LineUtil contains different utility functions for line segments
	 * and polylines (clipping, simplification, distances, etc.)
	 */
	
	L.LineUtil = {
	
		// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
		// Improves rendering performance dramatically by lessening the number of points to draw.
	
		simplify: function (points, tolerance) {
			if (!tolerance || !points.length) {
				return points.slice();
			}
	
			var sqTolerance = tolerance * tolerance;
	
			// stage 1: vertex reduction
			points = this._reducePoints(points, sqTolerance);
	
			// stage 2: Douglas-Peucker simplification
			points = this._simplifyDP(points, sqTolerance);
	
			return points;
		},
	
		// distance from a point to a segment between two points
		pointToSegmentDistance:  function (p, p1, p2) {
			return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
		},
	
		closestPointOnSegment: function (p, p1, p2) {
			return this._sqClosestPointOnSegment(p, p1, p2);
		},
	
		// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
		_simplifyDP: function (points, sqTolerance) {
	
			var len = points.length,
			    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
			    markers = new ArrayConstructor(len);
	
			markers[0] = markers[len - 1] = 1;
	
			this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);
	
			var i,
			    newPoints = [];
	
			for (i = 0; i < len; i++) {
				if (markers[i]) {
					newPoints.push(points[i]);
				}
			}
	
			return newPoints;
		},
	
		_simplifyDPStep: function (points, markers, sqTolerance, first, last) {
	
			var maxSqDist = 0,
			    index, i, sqDist;
	
			for (i = first + 1; i <= last - 1; i++) {
				sqDist = this._sqClosestPointOnSegment(points[i], points[first], points[last], true);
	
				if (sqDist > maxSqDist) {
					index = i;
					maxSqDist = sqDist;
				}
			}
	
			if (maxSqDist > sqTolerance) {
				markers[index] = 1;
	
				this._simplifyDPStep(points, markers, sqTolerance, first, index);
				this._simplifyDPStep(points, markers, sqTolerance, index, last);
			}
		},
	
		// reduce points that are too close to each other to a single point
		_reducePoints: function (points, sqTolerance) {
			var reducedPoints = [points[0]];
	
			for (var i = 1, prev = 0, len = points.length; i < len; i++) {
				if (this._sqDist(points[i], points[prev]) > sqTolerance) {
					reducedPoints.push(points[i]);
					prev = i;
				}
			}
			if (prev < len - 1) {
				reducedPoints.push(points[len - 1]);
			}
			return reducedPoints;
		},
	
		// Cohen-Sutherland line clipping algorithm.
		// Used to avoid rendering parts of a polyline that are not currently visible.
	
		clipSegment: function (a, b, bounds, useLastCode, round) {
			var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
			    codeB = this._getBitCode(b, bounds),
	
			    codeOut, p, newCode;
	
			// save 2nd code to avoid calculating it on the next segment
			this._lastCode = codeB;
	
			while (true) {
				// if a,b is inside the clip window (trivial accept)
				if (!(codeA | codeB)) {
					return [a, b];
				// if a,b is outside the clip window (trivial reject)
				} else if (codeA & codeB) {
					return false;
				// other cases
				} else {
					codeOut = codeA || codeB;
					p = this._getEdgeIntersection(a, b, codeOut, bounds, round);
					newCode = this._getBitCode(p, bounds);
	
					if (codeOut === codeA) {
						a = p;
						codeA = newCode;
					} else {
						b = p;
						codeB = newCode;
					}
				}
			}
		},
	
		_getEdgeIntersection: function (a, b, code, bounds, round) {
			var dx = b.x - a.x,
			    dy = b.y - a.y,
			    min = bounds.min,
			    max = bounds.max,
			    x, y;
	
			if (code & 8) { // top
				x = a.x + dx * (max.y - a.y) / dy;
				y = max.y;
	
			} else if (code & 4) { // bottom
				x = a.x + dx * (min.y - a.y) / dy;
				y = min.y;
	
			} else if (code & 2) { // right
				x = max.x;
				y = a.y + dy * (max.x - a.x) / dx;
	
			} else if (code & 1) { // left
				x = min.x;
				y = a.y + dy * (min.x - a.x) / dx;
			}
	
			return new L.Point(x, y, round);
		},
	
		_getBitCode: function (/*Point*/ p, bounds) {
			var code = 0;
	
			if (p.x < bounds.min.x) { // left
				code |= 1;
			} else if (p.x > bounds.max.x) { // right
				code |= 2;
			}
	
			if (p.y < bounds.min.y) { // bottom
				code |= 4;
			} else if (p.y > bounds.max.y) { // top
				code |= 8;
			}
	
			return code;
		},
	
		// square distance (to avoid unnecessary Math.sqrt calls)
		_sqDist: function (p1, p2) {
			var dx = p2.x - p1.x,
			    dy = p2.y - p1.y;
			return dx * dx + dy * dy;
		},
	
		// return closest point on segment or distance to that point
		_sqClosestPointOnSegment: function (p, p1, p2, sqDist) {
			var x = p1.x,
			    y = p1.y,
			    dx = p2.x - x,
			    dy = p2.y - y,
			    dot = dx * dx + dy * dy,
			    t;
	
			if (dot > 0) {
				t = ((p.x - x) * dx + (p.y - y) * dy) / dot;
	
				if (t > 1) {
					x = p2.x;
					y = p2.y;
				} else if (t > 0) {
					x += dx * t;
					y += dy * t;
				}
			}
	
			dx = p.x - x;
			dy = p.y - y;
	
			return sqDist ? dx * dx + dy * dy : new L.Point(x, y);
		}
	};
	
	
	/*
	 * L.Polyline implements polyline vector layer (a set of points connected with lines)
	 */
	
	L.Polyline = L.Path.extend({
	
		options: {
			// how much to simplify the polyline on each zoom level
			// more = better performance and smoother look, less = more accurate
			smoothFactor: 1.0
			// noClip: false
		},
	
		initialize: function (latlngs, options) {
			L.setOptions(this, options);
			this._setLatLngs(latlngs);
		},
	
		getLatLngs: function () {
			return this._latlngs;
		},
	
		setLatLngs: function (latlngs) {
			this._setLatLngs(latlngs);
			return this.redraw();
		},
	
		isEmpty: function () {
			return !this._latlngs.length;
		},
	
		closestLayerPoint: function (p) {
			var minDistance = Infinity,
			    minPoint = null,
			    closest = L.LineUtil._sqClosestPointOnSegment,
			    p1, p2;
	
			for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
				var points = this._parts[j];
	
				for (var i = 1, len = points.length; i < len; i++) {
					p1 = points[i - 1];
					p2 = points[i];
	
					var sqDist = closest(p, p1, p2, true);
	
					if (sqDist < minDistance) {
						minDistance = sqDist;
						minPoint = closest(p, p1, p2);
					}
				}
			}
			if (minPoint) {
				minPoint.distance = Math.sqrt(minDistance);
			}
			return minPoint;
		},
	
		getCenter: function () {
			var i, halfDist, segDist, dist, p1, p2, ratio,
			    points = this._rings[0],
			    len = points.length;
	
			if (!len) { return null; }
	
			// polyline centroid algorithm; only uses the first ring if there are multiple
	
			for (i = 0, halfDist = 0; i < len - 1; i++) {
				halfDist += points[i].distanceTo(points[i + 1]) / 2;
			}
	
			// The line is so small in the current view that all points are on the same pixel.
			if (halfDist === 0) {
				return this._map.layerPointToLatLng(points[0]);
			}
	
			for (i = 0, dist = 0; i < len - 1; i++) {
				p1 = points[i];
				p2 = points[i + 1];
				segDist = p1.distanceTo(p2);
				dist += segDist;
	
				if (dist > halfDist) {
					ratio = (dist - halfDist) / segDist;
					return this._map.layerPointToLatLng([
						p2.x - ratio * (p2.x - p1.x),
						p2.y - ratio * (p2.y - p1.y)
					]);
				}
			}
		},
	
		getBounds: function () {
			return this._bounds;
		},
	
		addLatLng: function (latlng, latlngs) {
			latlngs = latlngs || this._defaultShape();
			latlng = L.latLng(latlng);
			latlngs.push(latlng);
			this._bounds.extend(latlng);
			return this.redraw();
		},
	
		_setLatLngs: function (latlngs) {
			this._bounds = new L.LatLngBounds();
			this._latlngs = this._convertLatLngs(latlngs);
		},
	
		_defaultShape: function () {
			return L.Polyline._flat(this._latlngs) ? this._latlngs : this._latlngs[0];
		},
	
		// recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
		_convertLatLngs: function (latlngs) {
			var result = [],
			    flat = L.Polyline._flat(latlngs);
	
			for (var i = 0, len = latlngs.length; i < len; i++) {
				if (flat) {
					result[i] = L.latLng(latlngs[i]);
					this._bounds.extend(result[i]);
				} else {
					result[i] = this._convertLatLngs(latlngs[i]);
				}
			}
	
			return result;
		},
	
		_project: function () {
			this._rings = [];
			this._projectLatlngs(this._latlngs, this._rings);
	
			// project bounds as well to use later for Canvas hit detection/etc.
			var w = this._clickTolerance(),
				p = new L.Point(w, -w);
	
			if (this._bounds.isValid()) {
				this._pxBounds = new L.Bounds(
					this._map.latLngToLayerPoint(this._bounds.getSouthWest())._subtract(p),
					this._map.latLngToLayerPoint(this._bounds.getNorthEast())._add(p));
			}
		},
	
		// recursively turns latlngs into a set of rings with projected coordinates
		_projectLatlngs: function (latlngs, result) {
	
			var flat = latlngs[0] instanceof L.LatLng,
			    len = latlngs.length,
			    i, ring;
	
			if (flat) {
				ring = [];
				for (i = 0; i < len; i++) {
					ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
				}
				result.push(ring);
			} else {
				for (i = 0; i < len; i++) {
					this._projectLatlngs(latlngs[i], result);
				}
			}
		},
	
		// clip polyline by renderer bounds so that we have less to render for performance
		_clipPoints: function () {
			var bounds = this._renderer._bounds;
	
			this._parts = [];
			if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
				return;
			}
	
			if (this.options.noClip) {
				this._parts = this._rings;
				return;
			}
	
			var parts = this._parts,
			    i, j, k, len, len2, segment, points;
	
			for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
				points = this._rings[i];
	
				for (j = 0, len2 = points.length; j < len2 - 1; j++) {
					segment = L.LineUtil.clipSegment(points[j], points[j + 1], bounds, j, true);
	
					if (!segment) { continue; }
	
					parts[k] = parts[k] || [];
					parts[k].push(segment[0]);
	
					// if segment goes out of screen, or it's the last one, it's the end of the line part
					if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
						parts[k].push(segment[1]);
						k++;
					}
				}
			}
		},
	
		// simplify each clipped part of the polyline for performance
		_simplifyPoints: function () {
			var parts = this._parts,
				tolerance = this.options.smoothFactor;
	
			for (var i = 0, len = parts.length; i < len; i++) {
				parts[i] = L.LineUtil.simplify(parts[i], tolerance);
			}
		},
	
		_update: function () {
			if (!this._map) { return; }
	
			this._clipPoints();
			this._simplifyPoints();
			this._updatePath();
		},
	
		_updatePath: function () {
			this._renderer._updatePoly(this);
		}
	});
	
	L.polyline = function (latlngs, options) {
		return new L.Polyline(latlngs, options);
	};
	
	L.Polyline._flat = function (latlngs) {
		// true if it's a flat array of latlngs; false if nested
		return !L.Util.isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined');
	};
	
	
	/*
	 * L.PolyUtil contains utility functions for polygons (clipping, etc.).
	 */
	
	L.PolyUtil = {};
	
	/*
	 * Sutherland-Hodgeman polygon clipping algorithm.
	 * Used to avoid rendering parts of a polygon that are not currently visible.
	 */
	L.PolyUtil.clipPolygon = function (points, bounds, round) {
		var clippedPoints,
		    edges = [1, 4, 2, 8],
		    i, j, k,
		    a, b,
		    len, edge, p,
		    lu = L.LineUtil;
	
		for (i = 0, len = points.length; i < len; i++) {
			points[i]._code = lu._getBitCode(points[i], bounds);
		}
	
		// for each edge (left, bottom, right, top)
		for (k = 0; k < 4; k++) {
			edge = edges[k];
			clippedPoints = [];
	
			for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
				a = points[i];
				b = points[j];
	
				// if a is inside the clip window
				if (!(a._code & edge)) {
					// if b is outside the clip window (a->b goes out of screen)
					if (b._code & edge) {
						p = lu._getEdgeIntersection(b, a, edge, bounds, round);
						p._code = lu._getBitCode(p, bounds);
						clippedPoints.push(p);
					}
					clippedPoints.push(a);
	
				// else if b is inside the clip window (a->b enters the screen)
				} else if (!(b._code & edge)) {
					p = lu._getEdgeIntersection(b, a, edge, bounds, round);
					p._code = lu._getBitCode(p, bounds);
					clippedPoints.push(p);
				}
			}
			points = clippedPoints;
		}
	
		return points;
	};
	
	
	/*
	 * L.Polygon implements polygon vector layer (closed polyline with a fill inside).
	 */
	
	L.Polygon = L.Polyline.extend({
	
		options: {
			fill: true
		},
	
		isEmpty: function () {
			return !this._latlngs.length || !this._latlngs[0].length;
		},
	
		getCenter: function () {
			var i, j, p1, p2, f, area, x, y, center,
			    points = this._rings[0],
			    len = points.length;
	
			if (!len) { return null; }
	
			// polygon centroid algorithm; only uses the first ring if there are multiple
	
			area = x = y = 0;
	
			for (i = 0, j = len - 1; i < len; j = i++) {
				p1 = points[i];
				p2 = points[j];
	
				f = p1.y * p2.x - p2.y * p1.x;
				x += (p1.x + p2.x) * f;
				y += (p1.y + p2.y) * f;
				area += f * 3;
			}
	
			if (area === 0) {
				// Polygon is so small that all points are on same pixel.
				center = points[0];
			} else {
				center = [x / area, y / area];
			}
			return this._map.layerPointToLatLng(center);
		},
	
		_convertLatLngs: function (latlngs) {
			var result = L.Polyline.prototype._convertLatLngs.call(this, latlngs),
			    len = result.length;
	
			// remove last point if it equals first one
			if (len >= 2 && result[0] instanceof L.LatLng && result[0].equals(result[len - 1])) {
				result.pop();
			}
			return result;
		},
	
		_setLatLngs: function (latlngs) {
			L.Polyline.prototype._setLatLngs.call(this, latlngs);
			if (L.Polyline._flat(this._latlngs)) {
				this._latlngs = [this._latlngs];
			}
		},
	
		_defaultShape: function () {
			return L.Polyline._flat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
		},
	
		_clipPoints: function () {
			// polygons need a different clipping algorithm so we redefine that
	
			var bounds = this._renderer._bounds,
			    w = this.options.weight,
			    p = new L.Point(w, w);
	
			// increase clip padding by stroke width to avoid stroke on clip edges
			bounds = new L.Bounds(bounds.min.subtract(p), bounds.max.add(p));
	
			this._parts = [];
			if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
				return;
			}
	
			if (this.options.noClip) {
				this._parts = this._rings;
				return;
			}
	
			for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
				clipped = L.PolyUtil.clipPolygon(this._rings[i], bounds, true);
				if (clipped.length) {
					this._parts.push(clipped);
				}
			}
		},
	
		_updatePath: function () {
			this._renderer._updatePoly(this, true);
		}
	});
	
	L.polygon = function (latlngs, options) {
		return new L.Polygon(latlngs, options);
	};
	
	
	/*
	 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
	 */
	
	L.Rectangle = L.Polygon.extend({
		initialize: function (latLngBounds, options) {
			L.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
		},
	
		setBounds: function (latLngBounds) {
			this.setLatLngs(this._boundsToLatLngs(latLngBounds));
		},
	
		_boundsToLatLngs: function (latLngBounds) {
			latLngBounds = L.latLngBounds(latLngBounds);
			return [
				latLngBounds.getSouthWest(),
				latLngBounds.getNorthWest(),
				latLngBounds.getNorthEast(),
				latLngBounds.getSouthEast()
			];
		}
	});
	
	L.rectangle = function (latLngBounds, options) {
		return new L.Rectangle(latLngBounds, options);
	};
	
	
	/*
	 * L.CircleMarker is a circle overlay with a permanent pixel radius.
	 */
	
	L.CircleMarker = L.Path.extend({
	
		options: {
			fill: true,
			radius: 10
		},
	
		initialize: function (latlng, options) {
			L.setOptions(this, options);
			this._latlng = L.latLng(latlng);
			this._radius = this.options.radius;
		},
	
		setLatLng: function (latlng) {
			this._latlng = L.latLng(latlng);
			this.redraw();
			return this.fire('move', {latlng: this._latlng});
		},
	
		getLatLng: function () {
			return this._latlng;
		},
	
		setRadius: function (radius) {
			this.options.radius = this._radius = radius;
			return this.redraw();
		},
	
		getRadius: function () {
			return this._radius;
		},
	
		setStyle : function (options) {
			var radius = options && options.radius || this._radius;
			L.Path.prototype.setStyle.call(this, options);
			this.setRadius(radius);
			return this;
		},
	
		_project: function () {
			this._point = this._map.latLngToLayerPoint(this._latlng);
			this._updateBounds();
		},
	
		_updateBounds: function () {
			var r = this._radius,
			    r2 = this._radiusY || r,
			    w = this._clickTolerance(),
			    p = [r + w, r2 + w];
			this._pxBounds = new L.Bounds(this._point.subtract(p), this._point.add(p));
		},
	
		_update: function () {
			if (this._map) {
				this._updatePath();
			}
		},
	
		_updatePath: function () {
			this._renderer._updateCircle(this);
		},
	
		_empty: function () {
			return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
		}
	});
	
	L.circleMarker = function (latlng, options) {
		return new L.CircleMarker(latlng, options);
	};
	
	
	/*
	 * L.Circle is a circle overlay (with a certain radius in meters).
	 * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion)
	 */
	
	L.Circle = L.CircleMarker.extend({
	
		initialize: function (latlng, radius, options) {
			L.setOptions(this, options);
			this._latlng = L.latLng(latlng);
			this._mRadius = radius;
		},
	
		setRadius: function (radius) {
			this._mRadius = radius;
			return this.redraw();
		},
	
		getRadius: function () {
			return this._mRadius;
		},
	
		getBounds: function () {
			var half = [this._radius, this._radiusY];
	
			return new L.LatLngBounds(
				this._map.layerPointToLatLng(this._point.subtract(half)),
				this._map.layerPointToLatLng(this._point.add(half)));
		},
	
		setStyle: L.Path.prototype.setStyle,
	
		_project: function () {
	
			var lng = this._latlng.lng,
			    lat = this._latlng.lat,
			    map = this._map,
			    crs = map.options.crs;
	
			if (crs.distance === L.CRS.Earth.distance) {
				var d = Math.PI / 180,
				    latR = (this._mRadius / L.CRS.Earth.R) / d,
				    top = map.project([lat + latR, lng]),
				    bottom = map.project([lat - latR, lng]),
				    p = top.add(bottom).divideBy(2),
				    lat2 = map.unproject(p).lat,
				    lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
				            (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;
	
				this._point = p.subtract(map.getPixelOrigin());
				this._radius = isNaN(lngR) ? 0 : Math.max(Math.round(p.x - map.project([lat2, lng - lngR]).x), 1);
				this._radiusY = Math.max(Math.round(p.y - top.y), 1);
	
			} else {
				var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));
	
				this._point = map.latLngToLayerPoint(this._latlng);
				this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
			}
	
			this._updateBounds();
		}
	});
	
	L.circle = function (latlng, radius, options) {
		return new L.Circle(latlng, radius, options);
	};
	
	
	/*
	 * L.SVG renders vector layers with SVG. All SVG-specific code goes here.
	 */
	
	L.SVG = L.Renderer.extend({
	
		_initContainer: function () {
			this._container = L.SVG.create('svg');
	
			// makes it possible to click through svg root; we'll reset it back in individual paths
			this._container.setAttribute('pointer-events', 'none');
	
			this._rootGroup = L.SVG.create('g');
			this._container.appendChild(this._rootGroup);
		},
	
		_update: function () {
			if (this._map._animatingZoom && this._bounds) { return; }
	
			L.Renderer.prototype._update.call(this);
	
			var b = this._bounds,
			    size = b.getSize(),
			    container = this._container;
	
			// set size of svg-container if changed
			if (!this._svgSize || !this._svgSize.equals(size)) {
				this._svgSize = size;
				container.setAttribute('width', size.x);
				container.setAttribute('height', size.y);
			}
	
			// movement: update container viewBox so that we don't have to change coordinates of individual layers
			L.DomUtil.setPosition(container, b.min);
			container.setAttribute('viewBox', [b.min.x, b.min.y, size.x, size.y].join(' '));
		},
	
		// methods below are called by vector layers implementations
	
		_initPath: function (layer) {
			var path = layer._path = L.SVG.create('path');
	
			if (layer.options.className) {
				L.DomUtil.addClass(path, layer.options.className);
			}
	
			if (layer.options.interactive) {
				L.DomUtil.addClass(path, 'leaflet-interactive');
			}
	
			this._updateStyle(layer);
		},
	
		_addPath: function (layer) {
			this._rootGroup.appendChild(layer._path);
			layer.addInteractiveTarget(layer._path);
		},
	
		_removePath: function (layer) {
			L.DomUtil.remove(layer._path);
			layer.removeInteractiveTarget(layer._path);
		},
	
		_updatePath: function (layer) {
			layer._project();
			layer._update();
		},
	
		_updateStyle: function (layer) {
			var path = layer._path,
				options = layer.options;
	
			if (!path) { return; }
	
			if (options.stroke) {
				path.setAttribute('stroke', options.color);
				path.setAttribute('stroke-opacity', options.opacity);
				path.setAttribute('stroke-width', options.weight);
				path.setAttribute('stroke-linecap', options.lineCap);
				path.setAttribute('stroke-linejoin', options.lineJoin);
	
				if (options.dashArray) {
					path.setAttribute('stroke-dasharray', options.dashArray);
				} else {
					path.removeAttribute('stroke-dasharray');
				}
	
				if (options.dashOffset) {
					path.setAttribute('stroke-dashoffset', options.dashOffset);
				} else {
					path.removeAttribute('stroke-dashoffset');
				}
			} else {
				path.setAttribute('stroke', 'none');
			}
	
			if (options.fill) {
				path.setAttribute('fill', options.fillColor || options.color);
				path.setAttribute('fill-opacity', options.fillOpacity);
				path.setAttribute('fill-rule', options.fillRule || 'evenodd');
			} else {
				path.setAttribute('fill', 'none');
			}
	
			path.setAttribute('pointer-events', options.pointerEvents || (options.interactive ? 'visiblePainted' : 'none'));
		},
	
		_updatePoly: function (layer, closed) {
			this._setPath(layer, L.SVG.pointsToPath(layer._parts, closed));
		},
	
		_updateCircle: function (layer) {
			var p = layer._point,
			    r = layer._radius,
			    r2 = layer._radiusY || r,
			    arc = 'a' + r + ',' + r2 + ' 0 1,0 ';
	
			// drawing a circle with two half-arcs
			var d = layer._empty() ? 'M0 0' :
					'M' + (p.x - r) + ',' + p.y +
					arc + (r * 2) + ',0 ' +
					arc + (-r * 2) + ',0 ';
	
			this._setPath(layer, d);
		},
	
		_setPath: function (layer, path) {
			layer._path.setAttribute('d', path);
		},
	
		// SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
		_bringToFront: function (layer) {
			L.DomUtil.toFront(layer._path);
		},
	
		_bringToBack: function (layer) {
			L.DomUtil.toBack(layer._path);
		}
	});
	
	
	L.extend(L.SVG, {
		create: function (name) {
			return document.createElementNS('http://www.w3.org/2000/svg', name);
		},
	
		// generates SVG path string for multiple rings, with each ring turning into "M..L..L.." instructions
		pointsToPath: function (rings, closed) {
			var str = '',
				i, j, len, len2, points, p;
	
			for (i = 0, len = rings.length; i < len; i++) {
				points = rings[i];
	
				for (j = 0, len2 = points.length; j < len2; j++) {
					p = points[j];
					str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
				}
	
				// closes the ring for polygons; "x" is VML syntax
				str += closed ? (L.Browser.svg ? 'z' : 'x') : '';
			}
	
			// SVG complains about empty path strings
			return str || 'M0 0';
		}
	});
	
	L.Browser.svg = !!(document.createElementNS && L.SVG.create('svg').createSVGRect);
	
	L.svg = function (options) {
		return L.Browser.svg || L.Browser.vml ? new L.SVG(options) : null;
	};
	
	
	/*
	 * Vector rendering for IE7-8 through VML.
	 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
	 */
	
	L.Browser.vml = !L.Browser.svg && (function () {
		try {
			var div = document.createElement('div');
			div.innerHTML = '<v:shape adj="1"/>';
	
			var shape = div.firstChild;
			shape.style.behavior = 'url(#default#VML)';
	
			return shape && (typeof shape.adj === 'object');
	
		} catch (e) {
			return false;
		}
	}());
	
	// redefine some SVG methods to handle VML syntax which is similar but with some differences
	L.SVG.include(!L.Browser.vml ? {} : {
	
		_initContainer: function () {
			this._container = L.DomUtil.create('div', 'leaflet-vml-container');
		},
	
		_update: function () {
			if (this._map._animatingZoom) { return; }
			L.Renderer.prototype._update.call(this);
		},
	
		_initPath: function (layer) {
			var container = layer._container = L.SVG.create('shape');
	
			L.DomUtil.addClass(container, 'leaflet-vml-shape ' + (this.options.className || ''));
	
			container.coordsize = '1 1';
	
			layer._path = L.SVG.create('path');
			container.appendChild(layer._path);
	
			this._updateStyle(layer);
		},
	
		_addPath: function (layer) {
			var container = layer._container;
			this._container.appendChild(container);
	
			if (layer.options.interactive) {
				layer.addInteractiveTarget(container);
			}
		},
	
		_removePath: function (layer) {
			var container = layer._container;
			L.DomUtil.remove(container);
			layer.removeInteractiveTarget(container);
		},
	
		_updateStyle: function (layer) {
			var stroke = layer._stroke,
			    fill = layer._fill,
			    options = layer.options,
			    container = layer._container;
	
			container.stroked = !!options.stroke;
			container.filled = !!options.fill;
	
			if (options.stroke) {
				if (!stroke) {
					stroke = layer._stroke = L.SVG.create('stroke');
					container.appendChild(stroke);
				}
				stroke.weight = options.weight + 'px';
				stroke.color = options.color;
				stroke.opacity = options.opacity;
	
				if (options.dashArray) {
					stroke.dashStyle = L.Util.isArray(options.dashArray) ?
					    options.dashArray.join(' ') :
					    options.dashArray.replace(/( *, *)/g, ' ');
				} else {
					stroke.dashStyle = '';
				}
				stroke.endcap = options.lineCap.replace('butt', 'flat');
				stroke.joinstyle = options.lineJoin;
	
			} else if (stroke) {
				container.removeChild(stroke);
				layer._stroke = null;
			}
	
			if (options.fill) {
				if (!fill) {
					fill = layer._fill = L.SVG.create('fill');
					container.appendChild(fill);
				}
				fill.color = options.fillColor || options.color;
				fill.opacity = options.fillOpacity;
	
			} else if (fill) {
				container.removeChild(fill);
				layer._fill = null;
			}
		},
	
		_updateCircle: function (layer) {
			var p = layer._point.round(),
			    r = Math.round(layer._radius),
			    r2 = Math.round(layer._radiusY || r);
	
			this._setPath(layer, layer._empty() ? 'M0 0' :
					'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r2 + ' 0,' + (65535 * 360));
		},
	
		_setPath: function (layer, path) {
			layer._path.v = path;
		},
	
		_bringToFront: function (layer) {
			L.DomUtil.toFront(layer._container);
		},
	
		_bringToBack: function (layer) {
			L.DomUtil.toBack(layer._container);
		}
	});
	
	if (L.Browser.vml) {
		L.SVG.create = (function () {
			try {
				document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
				return function (name) {
					return document.createElement('<lvml:' + name + ' class="lvml">');
				};
			} catch (e) {
				return function (name) {
					return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
				};
			}
		})();
	}
	
	
	/*
	 * L.Canvas handles Canvas vector layers rendering and mouse events handling. All Canvas-specific code goes here.
	 */
	
	L.Canvas = L.Renderer.extend({
	
		onAdd: function () {
			L.Renderer.prototype.onAdd.call(this);
	
			this._layers = this._layers || {};
	
			// redraw vectors since canvas is cleared upon removal
			this._draw();
		},
	
		_initContainer: function () {
			var container = this._container = document.createElement('canvas');
	
			L.DomEvent
				.on(container, 'mousemove', this._onMouseMove, this)
				.on(container, 'click dblclick mousedown mouseup contextmenu', this._onClick, this)
				.on(container, 'mouseout', this._handleMouseOut, this);
	
			this._ctx = container.getContext('2d');
		},
	
		_update: function () {
			if (this._map._animatingZoom && this._bounds) { return; }
	
			L.Renderer.prototype._update.call(this);
	
			var b = this._bounds,
			    container = this._container,
			    size = b.getSize(),
			    m = L.Browser.retina ? 2 : 1;
	
			L.DomUtil.setPosition(container, b.min);
	
			// set canvas size (also clearing it); use double size on retina
			container.width = m * size.x;
			container.height = m * size.y;
			container.style.width = size.x + 'px';
			container.style.height = size.y + 'px';
	
			if (L.Browser.retina) {
				this._ctx.scale(2, 2);
			}
	
			// translate so we use the same path coordinates after canvas element moves
			this._ctx.translate(-b.min.x, -b.min.y);
		},
	
		_initPath: function (layer) {
			this._layers[L.stamp(layer)] = layer;
		},
	
		_addPath: L.Util.falseFn,
	
		_removePath: function (layer) {
			layer._removed = true;
			this._requestRedraw(layer);
		},
	
		_updatePath: function (layer) {
			this._redrawBounds = layer._pxBounds;
			this._draw(true);
			layer._project();
			layer._update();
			this._draw();
			this._redrawBounds = null;
		},
	
		_updateStyle: function (layer) {
			this._requestRedraw(layer);
		},
	
		_requestRedraw: function (layer) {
			if (!this._map) { return; }
	
			this._redrawBounds = this._redrawBounds || new L.Bounds();
			this._redrawBounds.extend(layer._pxBounds.min).extend(layer._pxBounds.max);
	
			this._redrawRequest = this._redrawRequest || L.Util.requestAnimFrame(this._redraw, this);
		},
	
		_redraw: function () {
			this._redrawRequest = null;
	
			this._draw(true); // clear layers in redraw bounds
			this._draw(); // draw layers
	
			this._redrawBounds = null;
		},
	
		_draw: function (clear) {
			this._clear = clear;
			var layer;
	
			for (var id in this._layers) {
				layer = this._layers[id];
				if (!this._redrawBounds || layer._pxBounds.intersects(this._redrawBounds)) {
					layer._updatePath();
				}
				if (clear && layer._removed) {
					delete layer._removed;
					delete this._layers[id];
				}
			}
		},
	
		_updatePoly: function (layer, closed) {
	
			var i, j, len2, p,
			    parts = layer._parts,
			    len = parts.length,
			    ctx = this._ctx;
	
			if (!len) { return; }
	
			ctx.beginPath();
	
			for (i = 0; i < len; i++) {
				for (j = 0, len2 = parts[i].length; j < len2; j++) {
					p = parts[i][j];
					ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
				}
				if (closed) {
					ctx.closePath();
				}
			}
	
			this._fillStroke(ctx, layer);
	
			// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
		},
	
		_updateCircle: function (layer) {
	
			if (layer._empty()) { return; }
	
			var p = layer._point,
			    ctx = this._ctx,
			    r = layer._radius,
			    s = (layer._radiusY || r) / r;
	
			if (s !== 1) {
				ctx.save();
				ctx.scale(1, s);
			}
	
			ctx.beginPath();
			ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);
	
			if (s !== 1) {
				ctx.restore();
			}
	
			this._fillStroke(ctx, layer);
		},
	
		_fillStroke: function (ctx, layer) {
			var clear = this._clear,
			    options = layer.options;
	
			ctx.globalCompositeOperation = clear ? 'destination-out' : 'source-over';
	
			if (options.fill) {
				ctx.globalAlpha = clear ? 1 : options.fillOpacity;
				ctx.fillStyle = options.fillColor || options.color;
				ctx.fill(options.fillRule || 'evenodd');
			}
	
			if (options.stroke && options.weight !== 0) {
				ctx.globalAlpha = clear ? 1 : options.opacity;
	
				// if clearing shape, do it with the previously drawn line width
				layer._prevWeight = ctx.lineWidth = clear ? layer._prevWeight + 1 : options.weight;
	
				ctx.strokeStyle = options.color;
				ctx.lineCap = options.lineCap;
				ctx.lineJoin = options.lineJoin;
				ctx.stroke();
			}
		},
	
		// Canvas obviously doesn't have mouse events for individual drawn objects,
		// so we emulate that by calculating what's under the mouse on mousemove/click manually
	
		_onClick: function (e) {
			var point = this._map.mouseEventToLayerPoint(e);
	
			for (var id in this._layers) {
				if (this._layers[id]._containsPoint(point)) {
					L.DomEvent._fakeStop(e);
					this._fireEvent(this._layers[id], e);
				}
			}
		},
	
		_onMouseMove: function (e) {
			if (!this._map || this._map._animatingZoom) { return; }
	
			var point = this._map.mouseEventToLayerPoint(e);
			this._handleMouseOut(e, point);
			this._handleMouseHover(e, point);
		},
	
	
		_handleMouseOut: function (e, point) {
			var layer = this._hoveredLayer;
			if (layer && (e.type === 'mouseout' || !layer._containsPoint(point))) {
				// if we're leaving the layer, fire mouseout
				L.DomUtil.removeClass(this._container, 'leaflet-interactive');
				this._fireEvent(layer, e, 'mouseout');
				this._hoveredLayer = null;
			}
		},
	
		_handleMouseHover: function (e, point) {
			var id, layer;
			if (!this._hoveredLayer) {
				for (id in this._layers) {
					layer = this._layers[id];
					if (layer.options.interactive && layer._containsPoint(point)) {
						L.DomUtil.addClass(this._container, 'leaflet-interactive'); // change cursor
						this._fireEvent(layer, e, 'mouseover');
						this._hoveredLayer = layer;
						break;
					}
				}
			}
			if (this._hoveredLayer) {
				this._fireEvent(this._hoveredLayer, e);
			}
		},
	
		_fireEvent: function (layer, e, type) {
			this._map._fireDOMEvent(e, type || e.type, [layer]);
		},
	
		// TODO _bringToFront & _bringToBack, pretty tricky
	
		_bringToFront: L.Util.falseFn,
		_bringToBack: L.Util.falseFn
	});
	
	L.Browser.canvas = (function () {
		return !!document.createElement('canvas').getContext;
	}());
	
	L.canvas = function (options) {
		return L.Browser.canvas ? new L.Canvas(options) : null;
	};
	
	L.Polyline.prototype._containsPoint = function (p, closed) {
		var i, j, k, len, len2, part,
		    w = this._clickTolerance();
	
		if (!this._pxBounds.contains(p)) { return false; }
	
		// hit detection for polylines
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];
	
			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				if (!closed && (j === 0)) { continue; }
	
				if (L.LineUtil.pointToSegmentDistance(p, part[k], part[j]) <= w) {
					return true;
				}
			}
		}
		return false;
	};
	
	L.Polygon.prototype._containsPoint = function (p) {
		var inside = false,
		    part, p1, p2, i, j, k, len, len2;
	
		if (!this._pxBounds.contains(p)) { return false; }
	
		// ray casting algorithm for detecting if point is in polygon
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];
	
			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				p1 = part[j];
				p2 = part[k];
	
				if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
					inside = !inside;
				}
			}
		}
	
		// also check if it's on polygon stroke
		return inside || L.Polyline.prototype._containsPoint.call(this, p, true);
	};
	
	L.CircleMarker.prototype._containsPoint = function (p) {
		return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
	};
	
	
	/*
	 * L.GeoJSON turns any GeoJSON data into a Leaflet layer.
	 */
	
	L.GeoJSON = L.FeatureGroup.extend({
	
		initialize: function (geojson, options) {
			L.setOptions(this, options);
	
			this._layers = {};
	
			if (geojson) {
				this.addData(geojson);
			}
		},
	
		addData: function (geojson) {
			var features = L.Util.isArray(geojson) ? geojson : geojson.features,
			    i, len, feature;
	
			if (features) {
				for (i = 0, len = features.length; i < len; i++) {
					// only add this if geometry or geometries are set and not null
					feature = features[i];
					if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
						this.addData(feature);
					}
				}
				return this;
			}
	
			var options = this.options;
	
			if (options.filter && !options.filter(geojson)) { return this; }
	
			var layer = L.GeoJSON.geometryToLayer(geojson, options);
			if (!layer) {
				return this;
			}
			layer.feature = L.GeoJSON.asFeature(geojson);
	
			layer.defaultOptions = layer.options;
			this.resetStyle(layer);
	
			if (options.onEachFeature) {
				options.onEachFeature(geojson, layer);
			}
	
			return this.addLayer(layer);
		},
	
		resetStyle: function (layer) {
			// reset any custom styles
			layer.options = layer.defaultOptions;
			this._setLayerStyle(layer, this.options.style);
			return this;
		},
	
		setStyle: function (style) {
			return this.eachLayer(function (layer) {
				this._setLayerStyle(layer, style);
			}, this);
		},
	
		_setLayerStyle: function (layer, style) {
			if (typeof style === 'function') {
				style = style(layer.feature);
			}
			if (layer.setStyle) {
				layer.setStyle(style);
			}
		}
	});
	
	L.extend(L.GeoJSON, {
		geometryToLayer: function (geojson, options) {
	
			var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
			    coords = geometry ? geometry.coordinates : null,
			    layers = [],
			    pointToLayer = options && options.pointToLayer,
			    coordsToLatLng = options && options.coordsToLatLng || this.coordsToLatLng,
			    latlng, latlngs, i, len;
	
			if (!coords && !geometry) {
				return null;
			}
	
			switch (geometry.type) {
			case 'Point':
				latlng = coordsToLatLng(coords);
				return pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);
	
			case 'MultiPoint':
				for (i = 0, len = coords.length; i < len; i++) {
					latlng = coordsToLatLng(coords[i]);
					layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng));
				}
				return new L.FeatureGroup(layers);
	
			case 'LineString':
			case 'MultiLineString':
				latlngs = this.coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, coordsToLatLng);
				return new L.Polyline(latlngs, options);
	
			case 'Polygon':
			case 'MultiPolygon':
				latlngs = this.coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, coordsToLatLng);
				return new L.Polygon(latlngs, options);
	
			case 'GeometryCollection':
				for (i = 0, len = geometry.geometries.length; i < len; i++) {
					var layer = this.geometryToLayer({
						geometry: geometry.geometries[i],
						type: 'Feature',
						properties: geojson.properties
					}, options);
	
					if (layer) {
						layers.push(layer);
					}
				}
				return new L.FeatureGroup(layers);
	
			default:
				throw new Error('Invalid GeoJSON object.');
			}
		},
	
		coordsToLatLng: function (coords) {
			return new L.LatLng(coords[1], coords[0], coords[2]);
		},
	
		coordsToLatLngs: function (coords, levelsDeep, coordsToLatLng) {
			var latlngs = [];
	
			for (var i = 0, len = coords.length, latlng; i < len; i++) {
				latlng = levelsDeep ?
				        this.coordsToLatLngs(coords[i], levelsDeep - 1, coordsToLatLng) :
				        (coordsToLatLng || this.coordsToLatLng)(coords[i]);
	
				latlngs.push(latlng);
			}
	
			return latlngs;
		},
	
		latLngToCoords: function (latlng) {
			return latlng.alt !== undefined ?
					[latlng.lng, latlng.lat, latlng.alt] :
					[latlng.lng, latlng.lat];
		},
	
		latLngsToCoords: function (latlngs, levelsDeep, closed) {
			var coords = [];
	
			for (var i = 0, len = latlngs.length; i < len; i++) {
				coords.push(levelsDeep ?
					L.GeoJSON.latLngsToCoords(latlngs[i], levelsDeep - 1, closed) :
					L.GeoJSON.latLngToCoords(latlngs[i]));
			}
	
			if (!levelsDeep && closed) {
				coords.push(coords[0]);
			}
	
			return coords;
		},
	
		getFeature: function (layer, newGeometry) {
			return layer.feature ?
					L.extend({}, layer.feature, {geometry: newGeometry}) :
					L.GeoJSON.asFeature(newGeometry);
		},
	
		asFeature: function (geoJSON) {
			if (geoJSON.type === 'Feature') {
				return geoJSON;
			}
	
			return {
				type: 'Feature',
				properties: {},
				geometry: geoJSON
			};
		}
	});
	
	var PointToGeoJSON = {
		toGeoJSON: function () {
			return L.GeoJSON.getFeature(this, {
				type: 'Point',
				coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
			});
		}
	};
	
	L.Marker.include(PointToGeoJSON);
	L.Circle.include(PointToGeoJSON);
	L.CircleMarker.include(PointToGeoJSON);
	
	L.Polyline.prototype.toGeoJSON = function () {
		var multi = !L.Polyline._flat(this._latlngs);
	
		var coords = L.GeoJSON.latLngsToCoords(this._latlngs, multi ? 1 : 0);
	
		return L.GeoJSON.getFeature(this, {
			type: (multi ? 'Multi' : '') + 'LineString',
			coordinates: coords
		});
	};
	
	L.Polygon.prototype.toGeoJSON = function () {
		var holes = !L.Polyline._flat(this._latlngs),
		    multi = holes && !L.Polyline._flat(this._latlngs[0]);
	
		var coords = L.GeoJSON.latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true);
	
		if (!holes) {
			coords = [coords];
		}
	
		return L.GeoJSON.getFeature(this, {
			type: (multi ? 'Multi' : '') + 'Polygon',
			coordinates: coords
		});
	};
	
	
	L.LayerGroup.include({
		toMultiPoint: function () {
			var coords = [];
	
			this.eachLayer(function (layer) {
				coords.push(layer.toGeoJSON().geometry.coordinates);
			});
	
			return L.GeoJSON.getFeature(this, {
				type: 'MultiPoint',
				coordinates: coords
			});
		},
	
		toGeoJSON: function () {
	
			var type = this.feature && this.feature.geometry && this.feature.geometry.type;
	
			if (type === 'MultiPoint') {
				return this.toMultiPoint();
			}
	
			var isGeometryCollection = type === 'GeometryCollection',
				jsons = [];
	
			this.eachLayer(function (layer) {
				if (layer.toGeoJSON) {
					var json = layer.toGeoJSON();
					jsons.push(isGeometryCollection ? json.geometry : L.GeoJSON.asFeature(json));
				}
			});
	
			if (isGeometryCollection) {
				return L.GeoJSON.getFeature(this, {
					geometries: jsons,
					type: 'GeometryCollection'
				});
			}
	
			return {
				type: 'FeatureCollection',
				features: jsons
			};
		}
	});
	
	L.geoJson = function (geojson, options) {
		return new L.GeoJSON(geojson, options);
	};
	
	
	/*
	 * L.DomEvent contains functions for working with DOM events.
	 * Inspired by John Resig, Dean Edwards and YUI addEvent implementations.
	 */
	
	var eventsKey = '_leaflet_events';
	
	L.DomEvent = {
	
		on: function (obj, types, fn, context) {
	
			if (typeof types === 'object') {
				for (var type in types) {
					this._on(obj, type, types[type], fn);
				}
			} else {
				types = L.Util.splitWords(types);
	
				for (var i = 0, len = types.length; i < len; i++) {
					this._on(obj, types[i], fn, context);
				}
			}
	
			return this;
		},
	
		off: function (obj, types, fn, context) {
	
			if (typeof types === 'object') {
				for (var type in types) {
					this._off(obj, type, types[type], fn);
				}
			} else {
				types = L.Util.splitWords(types);
	
				for (var i = 0, len = types.length; i < len; i++) {
					this._off(obj, types[i], fn, context);
				}
			}
	
			return this;
		},
	
		_on: function (obj, type, fn, context) {
			var id = type + L.stamp(fn) + (context ? '_' + L.stamp(context) : '');
	
			if (obj[eventsKey] && obj[eventsKey][id]) { return this; }
	
			var handler = function (e) {
				return fn.call(context || obj, e || window.event);
			};
	
			var originalHandler = handler;
	
			if (L.Browser.pointer && type.indexOf('touch') === 0) {
				this.addPointerListener(obj, type, handler, id);
	
			} else if (L.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
				this.addDoubleTapListener(obj, handler, id);
	
			} else if ('addEventListener' in obj) {
	
				if (type === 'mousewheel') {
					obj.addEventListener('DOMMouseScroll', handler, false);
					obj.addEventListener(type, handler, false);
	
				} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
					handler = function (e) {
						e = e || window.event;
						if (L.DomEvent._checkMouse(obj, e)) {
							originalHandler(e);
						}
					};
					obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);
	
				} else {
					if (type === 'click' && L.Browser.android) {
						handler = function (e) {
							return L.DomEvent._filterClick(e, originalHandler);
						};
					}
					obj.addEventListener(type, handler, false);
				}
	
			} else if ('attachEvent' in obj) {
				obj.attachEvent('on' + type, handler);
			}
	
			obj[eventsKey] = obj[eventsKey] || {};
			obj[eventsKey][id] = handler;
	
			return this;
		},
	
		_off: function (obj, type, fn, context) {
	
			var id = type + L.stamp(fn) + (context ? '_' + L.stamp(context) : ''),
			    handler = obj[eventsKey] && obj[eventsKey][id];
	
			if (!handler) { return this; }
	
			if (L.Browser.pointer && type.indexOf('touch') === 0) {
				this.removePointerListener(obj, type, id);
	
			} else if (L.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
				this.removeDoubleTapListener(obj, id);
	
			} else if ('removeEventListener' in obj) {
	
				if (type === 'mousewheel') {
					obj.removeEventListener('DOMMouseScroll', handler, false);
					obj.removeEventListener(type, handler, false);
	
				} else {
					obj.removeEventListener(
						type === 'mouseenter' ? 'mouseover' :
						type === 'mouseleave' ? 'mouseout' : type, handler, false);
				}
	
			} else if ('detachEvent' in obj) {
				obj.detachEvent('on' + type, handler);
			}
	
			obj[eventsKey][id] = null;
	
			return this;
		},
	
		stopPropagation: function (e) {
	
			if (e.stopPropagation) {
				e.stopPropagation();
			} else if (e.originalEvent) {  // In case of Leaflet event.
				e.originalEvent._stopped = true;
			} else {
				e.cancelBubble = true;
			}
			L.DomEvent._skipped(e);
	
			return this;
		},
	
		disableScrollPropagation: function (el) {
			return L.DomEvent.on(el, 'mousewheel MozMousePixelScroll', L.DomEvent.stopPropagation);
		},
	
		disableClickPropagation: function (el) {
			var stop = L.DomEvent.stopPropagation;
	
			L.DomEvent.on(el, L.Draggable.START.join(' '), stop);
	
			return L.DomEvent.on(el, {
				click: L.DomEvent._fakeStop,
				dblclick: stop
			});
		},
	
		preventDefault: function (e) {
	
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			return this;
		},
	
		stop: function (e) {
			return L.DomEvent
				.preventDefault(e)
				.stopPropagation(e);
		},
	
		getMousePosition: function (e, container) {
			if (!container) {
				return new L.Point(e.clientX, e.clientY);
			}
	
			var rect = container.getBoundingClientRect();
	
			return new L.Point(
				e.clientX - rect.left - container.clientLeft,
				e.clientY - rect.top - container.clientTop);
		},
	
		getWheelDelta: function (e) {
	
			var delta = 0;
	
			if (e.wheelDelta) {
				delta = e.wheelDelta / 120;
			}
			if (e.detail) {
				delta = -e.detail / 3;
			}
			return delta;
		},
	
		_skipEvents: {},
	
		_fakeStop: function (e) {
			// fakes stopPropagation by setting a special event flag, checked/reset with L.DomEvent._skipped(e)
			L.DomEvent._skipEvents[e.type] = true;
		},
	
		_skipped: function (e) {
			var skipped = this._skipEvents[e.type];
			// reset when checking, as it's only used in map container and propagates outside of the map
			this._skipEvents[e.type] = false;
			return skipped;
		},
	
		// check if element really left/entered the event target (for mouseenter/mouseleave)
		_checkMouse: function (el, e) {
	
			var related = e.relatedTarget;
	
			if (!related) { return true; }
	
			try {
				while (related && (related !== el)) {
					related = related.parentNode;
				}
			} catch (err) {
				return false;
			}
			return (related !== el);
		},
	
		// this is a horrible workaround for a bug in Android where a single touch triggers two click events
		_filterClick: function (e, handler) {
			var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
				elapsed = L.DomEvent._lastClick && (timeStamp - L.DomEvent._lastClick);
	
			// are they closer together than 500ms yet more than 100ms?
			// Android typically triggers them ~300ms apart while multiple listeners
			// on the same event should be triggered far faster;
			// or check if click is simulated on the element, and if it is, reject any non-simulated events
	
			if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
				L.DomEvent.stop(e);
				return;
			}
			L.DomEvent._lastClick = timeStamp;
	
			handler(e);
		}
	};
	
	L.DomEvent.addListener = L.DomEvent.on;
	L.DomEvent.removeListener = L.DomEvent.off;
	
	
	/*
	 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
	 */
	
	L.Draggable = L.Evented.extend({
	
		statics: {
			START: L.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
			END: {
				mousedown: 'mouseup',
				touchstart: 'touchend',
				pointerdown: 'touchend',
				MSPointerDown: 'touchend'
			},
			MOVE: {
				mousedown: 'mousemove',
				touchstart: 'touchmove',
				pointerdown: 'touchmove',
				MSPointerDown: 'touchmove'
			}
		},
	
		initialize: function (element, dragStartTarget, preventOutline) {
			this._element = element;
			this._dragStartTarget = dragStartTarget || element;
			this._preventOutline = preventOutline;
		},
	
		enable: function () {
			if (this._enabled) { return; }
	
			L.DomEvent.on(this._dragStartTarget, L.Draggable.START.join(' '), this._onDown, this);
	
			this._enabled = true;
		},
	
		disable: function () {
			if (!this._enabled) { return; }
	
			L.DomEvent.off(this._dragStartTarget, L.Draggable.START.join(' '), this._onDown, this);
	
			this._enabled = false;
			this._moved = false;
		},
	
		_onDown: function (e) {
			this._moved = false;
	
			if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }
	
			L.DomEvent.stopPropagation(e);
	
			if (this._preventOutline) {
				L.DomUtil.preventOutline(this._element);
			}
	
			if (L.DomUtil.hasClass(this._element, 'leaflet-zoom-anim')) { return; }
	
			L.DomUtil.disableImageDrag();
			L.DomUtil.disableTextSelection();
	
			if (this._moving) { return; }
	
			this.fire('down');
	
			var first = e.touches ? e.touches[0] : e;
	
			this._startPoint = new L.Point(first.clientX, first.clientY);
			this._startPos = this._newPos = L.DomUtil.getPosition(this._element);
	
			L.DomEvent
			    .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
			    .on(document, L.Draggable.END[e.type], this._onUp, this);
		},
	
		_onMove: function (e) {
			if (e.touches && e.touches.length > 1) {
				this._moved = true;
				return;
			}
	
			var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
			    newPoint = new L.Point(first.clientX, first.clientY),
			    offset = newPoint.subtract(this._startPoint);
	
			if (!offset.x && !offset.y) { return; }
			if (L.Browser.touch && Math.abs(offset.x) + Math.abs(offset.y) < 3) { return; }
	
			L.DomEvent.preventDefault(e);
	
			if (!this._moved) {
				this.fire('dragstart');
	
				this._moved = true;
				this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);
	
				L.DomUtil.addClass(document.body, 'leaflet-dragging');
	
				this._lastTarget = e.target || e.srcElement;
				L.DomUtil.addClass(this._lastTarget, 'leaflet-drag-target');
			}
	
			this._newPos = this._startPos.add(offset);
			this._moving = true;
	
			L.Util.cancelAnimFrame(this._animRequest);
			this._lastEvent = e;
			this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
		},
	
		_updatePosition: function () {
			var e = {originalEvent: this._lastEvent};
			this.fire('predrag', e);
			L.DomUtil.setPosition(this._element, this._newPos);
			this.fire('drag', e);
		},
	
		_onUp: function () {
			L.DomUtil.removeClass(document.body, 'leaflet-dragging');
	
			if (this._lastTarget) {
				L.DomUtil.removeClass(this._lastTarget, 'leaflet-drag-target');
				this._lastTarget = null;
			}
	
			for (var i in L.Draggable.MOVE) {
				L.DomEvent
				    .off(document, L.Draggable.MOVE[i], this._onMove, this)
				    .off(document, L.Draggable.END[i], this._onUp, this);
			}
	
			L.DomUtil.enableImageDrag();
			L.DomUtil.enableTextSelection();
	
			if (this._moved && this._moving) {
				// ensure drag is not fired after dragend
				L.Util.cancelAnimFrame(this._animRequest);
	
				this.fire('dragend', {
					distance: this._newPos.distanceTo(this._startPos)
				});
			}
	
			this._moving = false;
		}
	});
	
	
	/*
		L.Handler is a base class for handler classes that are used internally to inject
		interaction features like dragging to classes like Map and Marker.
	*/
	
	L.Handler = L.Class.extend({
		initialize: function (map) {
			this._map = map;
		},
	
		enable: function () {
			if (this._enabled) { return; }
	
			this._enabled = true;
			this.addHooks();
		},
	
		disable: function () {
			if (!this._enabled) { return; }
	
			this._enabled = false;
			this.removeHooks();
		},
	
		enabled: function () {
			return !!this._enabled;
		}
	});
	
	
	/*
	 * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
	 */
	
	L.Map.mergeOptions({
		dragging: true,
	
		inertia: !L.Browser.android23,
		inertiaDeceleration: 3400, // px/s^2
		inertiaMaxSpeed: Infinity, // px/s
		easeLinearity: 0.2,
	
		// TODO refactor, move to CRS
		worldCopyJump: false
	});
	
	L.Map.Drag = L.Handler.extend({
		addHooks: function () {
			if (!this._draggable) {
				var map = this._map;
	
				this._draggable = new L.Draggable(map._mapPane, map._container);
	
				this._draggable.on({
					down: this._onDown,
					dragstart: this._onDragStart,
					drag: this._onDrag,
					dragend: this._onDragEnd
				}, this);
	
				this._draggable.on('predrag', this._onPreDragLimit, this);
				if (map.options.worldCopyJump) {
					this._draggable.on('predrag', this._onPreDragWrap, this);
					map.on('zoomend', this._onZoomEnd, this);
	
					map.whenReady(this._onZoomEnd, this);
				}
			}
			L.DomUtil.addClass(this._map._container, 'leaflet-grab');
			this._draggable.enable();
		},
	
		removeHooks: function () {
			L.DomUtil.removeClass(this._map._container, 'leaflet-grab');
			this._draggable.disable();
		},
	
		moved: function () {
			return this._draggable && this._draggable._moved;
		},
	
		_onDown: function () {
			this._map.stop();
		},
	
		_onDragStart: function () {
			var map = this._map;
	
			if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
				var bounds = L.latLngBounds(this._map.options.maxBounds);
	
				this._offsetLimit = L.bounds(
					this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1),
					this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1)
						.add(this._map.getSize()));
	
				this._viscosity = Math.min(1.0, Math.max(0.0, this._map.options.maxBoundsViscosity));
			} else {
				this._offsetLimit = null;
			}
	
			map
			    .fire('movestart')
			    .fire('dragstart');
	
			if (map.options.inertia) {
				this._positions = [];
				this._times = [];
			}
		},
	
		_onDrag: function (e) {
			if (this._map.options.inertia) {
				var time = this._lastTime = +new Date(),
				    pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;
	
				this._positions.push(pos);
				this._times.push(time);
	
				if (time - this._times[0] > 50) {
					this._positions.shift();
					this._times.shift();
				}
			}
	
			this._map
			    .fire('move', e)
			    .fire('drag', e);
		},
	
		_onZoomEnd: function () {
			var pxCenter = this._map.getSize().divideBy(2),
			    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);
	
			this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
			this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
		},
	
		_viscousLimit: function(value, threshold) {
			return value - (value - threshold) * this._viscosity;
		},
	
		_onPreDragLimit: function () {
			if (!this._viscosity || !this._offsetLimit) { return; }
	
			var offset = this._draggable._newPos.subtract(this._draggable._startPos);
	
			var limit = this._offsetLimit;
			if (offset.x < limit.min.x) { offset.x = this._viscousLimit(offset.x, limit.min.x); }
			if (offset.y < limit.min.y) { offset.y = this._viscousLimit(offset.y, limit.min.y); }
			if (offset.x > limit.max.x) { offset.x = this._viscousLimit(offset.x, limit.max.x); }
			if (offset.y > limit.max.y) { offset.y = this._viscousLimit(offset.y, limit.max.y); }
	
			this._draggable._newPos = this._draggable._startPos.add(offset);
		},
	
		_onPreDragWrap: function () {
			// TODO refactor to be able to adjust map pane position after zoom
			var worldWidth = this._worldWidth,
			    halfWidth = Math.round(worldWidth / 2),
			    dx = this._initialWorldOffset,
			    x = this._draggable._newPos.x,
			    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
			    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
			    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;
	
			this._draggable._absPos = this._draggable._newPos.clone();
			this._draggable._newPos.x = newX;
		},
	
		_onDragEnd: function (e) {
			var map = this._map,
			    options = map.options,
	
			    noInertia = !options.inertia || this._times.length < 2;
	
			map.fire('dragend', e);
	
			if (noInertia) {
				map.fire('moveend');
	
			} else {
	
				var direction = this._lastPos.subtract(this._positions[0]),
				    duration = (this._lastTime - this._times[0]) / 1000,
				    ease = options.easeLinearity,
	
				    speedVector = direction.multiplyBy(ease / duration),
				    speed = speedVector.distanceTo([0, 0]),
	
				    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
				    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),
	
				    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
				    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();
	
				if (!offset.x && !offset.y) {
					map.fire('moveend');
	
				} else {
					offset = map._limitOffset(offset, map.options.maxBounds);
	
					L.Util.requestAnimFrame(function () {
						map.panBy(offset, {
							duration: decelerationDuration,
							easeLinearity: ease,
							noMoveStart: true,
							animate: true
						});
					});
				}
			}
		}
	});
	
	L.Map.addInitHook('addHandler', 'dragging', L.Map.Drag);
	
	
	/*
	 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
	 */
	
	L.Map.mergeOptions({
		doubleClickZoom: true
	});
	
	L.Map.DoubleClickZoom = L.Handler.extend({
		addHooks: function () {
			this._map.on('dblclick', this._onDoubleClick, this);
		},
	
		removeHooks: function () {
			this._map.off('dblclick', this._onDoubleClick, this);
		},
	
		_onDoubleClick: function (e) {
			var map = this._map,
			    oldZoom = map.getZoom(),
			    zoom = e.originalEvent.shiftKey ? Math.ceil(oldZoom) - 1 : Math.floor(oldZoom) + 1;
	
			if (map.options.doubleClickZoom === 'center') {
				map.setZoom(zoom);
			} else {
				map.setZoomAround(e.containerPoint, zoom);
			}
		}
	});
	
	L.Map.addInitHook('addHandler', 'doubleClickZoom', L.Map.DoubleClickZoom);
	
	
	/*
	 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
	 */
	
	L.Map.mergeOptions({
		scrollWheelZoom: true,
		wheelDebounceTime: 40
	});
	
	L.Map.ScrollWheelZoom = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(this._map._container, {
				mousewheel: this._onWheelScroll,
				MozMousePixelScroll: L.DomEvent.preventDefault
			}, this);
	
			this._delta = 0;
		},
	
		removeHooks: function () {
			L.DomEvent.off(this._map._container, {
				mousewheel: this._onWheelScroll,
				MozMousePixelScroll: L.DomEvent.preventDefault
			}, this);
		},
	
		_onWheelScroll: function (e) {
			var delta = L.DomEvent.getWheelDelta(e);
			var debounce = this._map.options.wheelDebounceTime;
	
			this._delta += delta;
			this._lastMousePos = this._map.mouseEventToContainerPoint(e);
	
			if (!this._startTime) {
				this._startTime = +new Date();
			}
	
			var left = Math.max(debounce - (+new Date() - this._startTime), 0);
	
			clearTimeout(this._timer);
			this._timer = setTimeout(L.bind(this._performZoom, this), left);
	
			L.DomEvent.stop(e);
		},
	
		_performZoom: function () {
			var map = this._map,
			    delta = this._delta,
			    zoom = map.getZoom();
	
			map.stop(); // stop panning and fly animations if any
	
			delta = delta > 0 ? Math.ceil(delta) : Math.floor(delta);
			delta = Math.max(Math.min(delta, 4), -4);
			delta = map._limitZoom(zoom + delta) - zoom;
	
			this._delta = 0;
			this._startTime = null;
	
			if (!delta) { return; }
	
			if (map.options.scrollWheelZoom === 'center') {
				map.setZoom(zoom + delta);
			} else {
				map.setZoomAround(this._lastMousePos, zoom + delta);
			}
		}
	});
	
	L.Map.addInitHook('addHandler', 'scrollWheelZoom', L.Map.ScrollWheelZoom);
	
	
	/*
	 * Extends the event handling code with double tap support for mobile browsers.
	 */
	
	L.extend(L.DomEvent, {
	
		_touchstart: L.Browser.msPointer ? 'MSPointerDown' : L.Browser.pointer ? 'pointerdown' : 'touchstart',
		_touchend: L.Browser.msPointer ? 'MSPointerUp' : L.Browser.pointer ? 'pointerup' : 'touchend',
	
		// inspired by Zepto touch code by Thomas Fuchs
		addDoubleTapListener: function (obj, handler, id) {
			var last, touch,
			    doubleTap = false,
			    delay = 250;
	
			function onTouchStart(e) {
				var count;
	
				if (L.Browser.pointer) {
					count = L.DomEvent._pointersCount;
				} else {
					count = e.touches.length;
				}
	
				if (count > 1) { return; }
	
				var now = Date.now(),
				    delta = now - (last || now);
	
				touch = e.touches ? e.touches[0] : e;
				doubleTap = (delta > 0 && delta <= delay);
				last = now;
			}
	
			function onTouchEnd() {
				if (doubleTap) {
					if (L.Browser.pointer) {
						// work around .type being readonly with MSPointer* events
						var newTouch = {},
							prop, i;
	
						for (i in touch) {
							prop = touch[i];
							newTouch[i] = prop && prop.bind ? prop.bind(touch) : prop;
						}
						touch = newTouch;
					}
					touch.type = 'dblclick';
					handler(touch);
					last = null;
				}
			}
	
			var pre = '_leaflet_',
			    touchstart = this._touchstart,
			    touchend = this._touchend;
	
			obj[pre + touchstart + id] = onTouchStart;
			obj[pre + touchend + id] = onTouchEnd;
	
			obj.addEventListener(touchstart, onTouchStart, false);
			obj.addEventListener(touchend, onTouchEnd, false);
			return this;
		},
	
		removeDoubleTapListener: function (obj, id) {
			var pre = '_leaflet_',
			    touchend = obj[pre + this._touchend + id];
	
			obj.removeEventListener(this._touchstart, obj[pre + this._touchstart + id], false);
			obj.removeEventListener(this._touchend, touchend, false);
	
			return this;
		}
	});
	
	
	/*
	 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
	 */
	
	L.extend(L.DomEvent, {
	
		POINTER_DOWN:   L.Browser.msPointer ? 'MSPointerDown'   : 'pointerdown',
		POINTER_MOVE:   L.Browser.msPointer ? 'MSPointerMove'   : 'pointermove',
		POINTER_UP:     L.Browser.msPointer ? 'MSPointerUp'     : 'pointerup',
		POINTER_CANCEL: L.Browser.msPointer ? 'MSPointerCancel' : 'pointercancel',
	
		_pointers: {},
		_pointersCount: 0,
	
		// Provides a touch events wrapper for (ms)pointer events.
		// ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890
	
		addPointerListener: function (obj, type, handler, id) {
	
			if (type === 'touchstart') {
				this._addPointerStart(obj, handler, id);
	
			} else if (type === 'touchmove') {
				this._addPointerMove(obj, handler, id);
	
			} else if (type === 'touchend') {
				this._addPointerEnd(obj, handler, id);
			}
	
			return this;
		},
	
		removePointerListener: function (obj, type, id) {
			var handler = obj['_leaflet_' + type + id];
	
			if (type === 'touchstart') {
				obj.removeEventListener(this.POINTER_DOWN, handler, false);
	
			} else if (type === 'touchmove') {
				obj.removeEventListener(this.POINTER_MOVE, handler, false);
	
			} else if (type === 'touchend') {
				obj.removeEventListener(this.POINTER_UP, handler, false);
				obj.removeEventListener(this.POINTER_CANCEL, handler, false);
			}
	
			return this;
		},
	
		_addPointerStart: function (obj, handler, id) {
			var onDown = L.bind(function (e) {
				L.DomEvent.preventDefault(e);
	
				this._handlePointer(e, handler);
			}, this);
	
			obj['_leaflet_touchstart' + id] = onDown;
			obj.addEventListener(this.POINTER_DOWN, onDown, false);
	
			// need to keep track of what pointers and how many are active to provide e.touches emulation
			if (!this._pointerDocListener) {
				var pointerUp = L.bind(this._globalPointerUp, this);
	
				// we listen documentElement as any drags that end by moving the touch off the screen get fired there
				document.documentElement.addEventListener(this.POINTER_DOWN, L.bind(this._globalPointerDown, this), true);
				document.documentElement.addEventListener(this.POINTER_MOVE, L.bind(this._globalPointerMove, this), true);
				document.documentElement.addEventListener(this.POINTER_UP, pointerUp, true);
				document.documentElement.addEventListener(this.POINTER_CANCEL, pointerUp, true);
	
				this._pointerDocListener = true;
			}
		},
	
		_globalPointerDown: function (e) {
			this._pointers[e.pointerId] = e;
			this._pointersCount++;
		},
	
		_globalPointerMove: function (e) {
			if (this._pointers[e.pointerId]) {
				this._pointers[e.pointerId] = e;
			}
		},
	
		_globalPointerUp: function (e) {
			delete this._pointers[e.pointerId];
			this._pointersCount--;
		},
	
		_handlePointer: function (e, handler) {
			e.touches = [];
			for (var i in this._pointers) {
				e.touches.push(this._pointers[i]);
			}
			e.changedTouches = [e];
	
			handler(e);
		},
	
		_addPointerMove: function (obj, handler, id) {
			var onMove = L.bind(function (e) {
				// don't fire touch moves when mouse isn't down
				if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) { return; }
	
				this._handlePointer(e, handler);
			}, this);
	
			obj['_leaflet_touchmove' + id] = onMove;
			obj.addEventListener(this.POINTER_MOVE, onMove, false);
		},
	
		_addPointerEnd: function (obj, handler, id) {
			var onUp = L.bind(function (e) {
				this._handlePointer(e, handler);
			}, this);
	
			obj['_leaflet_touchend' + id] = onUp;
			obj.addEventListener(this.POINTER_UP, onUp, false);
			obj.addEventListener(this.POINTER_CANCEL, onUp, false);
		}
	});
	
	
	/*
	 * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
	 */
	
	L.Map.mergeOptions({
		touchZoom: L.Browser.touch && !L.Browser.android23,
		bounceAtZoomLimits: true
	});
	
	L.Map.TouchZoom = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
		},
	
		removeHooks: function () {
			L.DomEvent.off(this._map._container, 'touchstart', this._onTouchStart, this);
		},
	
		_onTouchStart: function (e) {
			var map = this._map;
	
			if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }
	
			var p1 = map.mouseEventToContainerPoint(e.touches[0]),
			    p2 = map.mouseEventToContainerPoint(e.touches[1]);
	
			this._centerPoint = map.getSize()._divideBy(2);
			this._startLatLng = map.containerPointToLatLng(this._centerPoint);
			if (map.options.touchZoom !== 'center') {
				this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
			}
	
			this._startDist = p1.distanceTo(p2);
			this._startZoom = map.getZoom();
	
			this._moved = false;
			this._zooming = true;
	
			map.stop();
	
			L.DomEvent
			    .on(document, 'touchmove', this._onTouchMove, this)
			    .on(document, 'touchend', this._onTouchEnd, this);
	
			L.DomEvent.preventDefault(e);
		},
	
		_onTouchMove: function (e) {
			if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }
	
			var map = this._map,
			    p1 = map.mouseEventToContainerPoint(e.touches[0]),
			    p2 = map.mouseEventToContainerPoint(e.touches[1]),
			    scale = p1.distanceTo(p2) / this._startDist;
	
	
			this._zoom = map.getScaleZoom(scale, this._startZoom);
	
			if (map.options.touchZoom === 'center') {
				this._center = this._startLatLng;
				if (scale === 1) { return; }
			} else {
				// Get delta from pinch to center, so centerLatLng is delta applied to initial pinchLatLng
				var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
				if (scale === 1 && delta.x === 0 && delta.y === 0) { return; }
				this._center = map.unproject(map.project(this._pinchStartLatLng).subtract(delta));
			}
	
			if (!map.options.bounceAtZoomLimits) {
				if ((this._zoom <= map.getMinZoom() && scale < 1) ||
			        (this._zoom >= map.getMaxZoom() && scale > 1)) { return; }
			}
	
			if (!this._moved) {
				map._moveStart(true);
				this._moved = true;
			}
	
			L.Util.cancelAnimFrame(this._animRequest);
	
			var moveFn = L.bind(map._move, map, this._center, this._zoom, {pinch: true, round: false});
			this._animRequest = L.Util.requestAnimFrame(moveFn, this, true, map._container);
	
			L.DomEvent.preventDefault(e);
		},
	
		_onTouchEnd: function () {
			if (!this._moved || !this._zooming) {
				this._zooming = false;
				return;
			}
	
			this._zooming = false;
			L.Util.cancelAnimFrame(this._animRequest);
	
			L.DomEvent
			    .off(document, 'touchmove', this._onTouchMove)
			    .off(document, 'touchend', this._onTouchEnd);
	
			var zoom = this._zoom;
			zoom = this._map._limitZoom(zoom - this._startZoom > 0 ? Math.ceil(zoom) : Math.floor(zoom));
	
	
			this._map._animateZoom(this._center, zoom, true, true);
		}
	});
	
	L.Map.addInitHook('addHandler', 'touchZoom', L.Map.TouchZoom);
	
	
	/*
	 * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
	 */
	
	L.Map.mergeOptions({
		tap: true,
		tapTolerance: 15
	});
	
	L.Map.Tap = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(this._map._container, 'touchstart', this._onDown, this);
		},
	
		removeHooks: function () {
			L.DomEvent.off(this._map._container, 'touchstart', this._onDown, this);
		},
	
		_onDown: function (e) {
			if (!e.touches) { return; }
	
			L.DomEvent.preventDefault(e);
	
			this._fireClick = true;
	
			// don't simulate click or track longpress if more than 1 touch
			if (e.touches.length > 1) {
				this._fireClick = false;
				clearTimeout(this._holdTimeout);
				return;
			}
	
			var first = e.touches[0],
			    el = first.target;
	
			this._startPos = this._newPos = new L.Point(first.clientX, first.clientY);
	
			// if touching a link, highlight it
			if (el.tagName && el.tagName.toLowerCase() === 'a') {
				L.DomUtil.addClass(el, 'leaflet-active');
			}
	
			// simulate long hold but setting a timeout
			this._holdTimeout = setTimeout(L.bind(function () {
				if (this._isTapValid()) {
					this._fireClick = false;
					this._onUp();
					this._simulateEvent('contextmenu', first);
				}
			}, this), 1000);
	
			this._simulateEvent('mousedown', first);
	
			L.DomEvent.on(document, {
				touchmove: this._onMove,
				touchend: this._onUp
			}, this);
		},
	
		_onUp: function (e) {
			clearTimeout(this._holdTimeout);
	
			L.DomEvent.off(document, {
				touchmove: this._onMove,
				touchend: this._onUp
			}, this);
	
			if (this._fireClick && e && e.changedTouches) {
	
				var first = e.changedTouches[0],
				    el = first.target;
	
				if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
					L.DomUtil.removeClass(el, 'leaflet-active');
				}
	
				this._simulateEvent('mouseup', first);
	
				// simulate click if the touch didn't move too much
				if (this._isTapValid()) {
					this._simulateEvent('click', first);
				}
			}
		},
	
		_isTapValid: function () {
			return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
		},
	
		_onMove: function (e) {
			var first = e.touches[0];
			this._newPos = new L.Point(first.clientX, first.clientY);
		},
	
		_simulateEvent: function (type, e) {
			var simulatedEvent = document.createEvent('MouseEvents');
	
			simulatedEvent._simulated = true;
			e.target._simulatedClick = true;
	
			simulatedEvent.initMouseEvent(
			        type, true, true, window, 1,
			        e.screenX, e.screenY,
			        e.clientX, e.clientY,
			        false, false, false, false, 0, null);
	
			e.target.dispatchEvent(simulatedEvent);
		}
	});
	
	if (L.Browser.touch && !L.Browser.pointer) {
		L.Map.addInitHook('addHandler', 'tap', L.Map.Tap);
	}
	
	
	/*
	 * L.Handler.ShiftDragZoom is used to add shift-drag zoom interaction to the map
	  * (zoom to a selected bounding box), enabled by default.
	 */
	
	L.Map.mergeOptions({
		boxZoom: true
	});
	
	L.Map.BoxZoom = L.Handler.extend({
		initialize: function (map) {
			this._map = map;
			this._container = map._container;
			this._pane = map._panes.overlayPane;
		},
	
		addHooks: function () {
			L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
		},
	
		removeHooks: function () {
			L.DomEvent.off(this._container, 'mousedown', this._onMouseDown, this);
		},
	
		moved: function () {
			return this._moved;
		},
	
		_onMouseDown: function (e) {
			if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }
	
			this._moved = false;
	
			L.DomUtil.disableTextSelection();
			L.DomUtil.disableImageDrag();
	
			this._startPoint = this._map.mouseEventToContainerPoint(e);
	
			L.DomEvent.on(document, {
				contextmenu: L.DomEvent.stop,
				mousemove: this._onMouseMove,
				mouseup: this._onMouseUp,
				keydown: this._onKeyDown
			}, this);
		},
	
		_onMouseMove: function (e) {
			if (!this._moved) {
				this._moved = true;
	
				this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._container);
				L.DomUtil.addClass(this._container, 'leaflet-crosshair');
	
				this._map.fire('boxzoomstart');
			}
	
			this._point = this._map.mouseEventToContainerPoint(e);
	
			var bounds = new L.Bounds(this._point, this._startPoint),
			    size = bounds.getSize();
	
			L.DomUtil.setPosition(this._box, bounds.min);
	
			this._box.style.width  = size.x + 'px';
			this._box.style.height = size.y + 'px';
		},
	
		_finish: function () {
			if (this._moved) {
				L.DomUtil.remove(this._box);
				L.DomUtil.removeClass(this._container, 'leaflet-crosshair');
			}
	
			L.DomUtil.enableTextSelection();
			L.DomUtil.enableImageDrag();
	
			L.DomEvent.off(document, {
				contextmenu: L.DomEvent.stop,
				mousemove: this._onMouseMove,
				mouseup: this._onMouseUp,
				keydown: this._onKeyDown
			}, this);
		},
	
		_onMouseUp: function (e) {
			if ((e.which !== 1) && (e.button !== 1)) { return; }
	
			this._finish();
	
			if (!this._moved) { return; }
	
			var bounds = new L.LatLngBounds(
			        this._map.containerPointToLatLng(this._startPoint),
			        this._map.containerPointToLatLng(this._point));
	
			this._map
				.fitBounds(bounds)
				.fire('boxzoomend', {boxZoomBounds: bounds});
		},
	
		_onKeyDown: function (e) {
			if (e.keyCode === 27) {
				this._finish();
			}
		}
	});
	
	L.Map.addInitHook('addHandler', 'boxZoom', L.Map.BoxZoom);
	
	
	/*
	 * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
	 */
	
	L.Map.mergeOptions({
		keyboard: true,
		keyboardPanOffset: 80,
		keyboardZoomOffset: 1
	});
	
	L.Map.Keyboard = L.Handler.extend({
	
		keyCodes: {
			left:    [37],
			right:   [39],
			down:    [40],
			up:      [38],
			zoomIn:  [187, 107, 61, 171],
			zoomOut: [189, 109, 54, 173]
		},
	
		initialize: function (map) {
			this._map = map;
	
			this._setPanOffset(map.options.keyboardPanOffset);
			this._setZoomOffset(map.options.keyboardZoomOffset);
		},
	
		addHooks: function () {
			var container = this._map._container;
	
			// make the container focusable by tabbing
			if (container.tabIndex === -1) {
				container.tabIndex = '0';
			}
	
			L.DomEvent.on(container, {
				focus: this._onFocus,
				blur: this._onBlur,
				mousedown: this._onMouseDown
			}, this);
	
			this._map.on({
				focus: this._addHooks,
				blur: this._removeHooks
			}, this);
		},
	
		removeHooks: function () {
			this._removeHooks();
	
			L.DomEvent.off(this._map._container, {
				focus: this._onFocus,
				blur: this._onBlur,
				mousedown: this._onMouseDown
			}, this);
	
			this._map.off({
				focus: this._addHooks,
				blur: this._removeHooks
			}, this);
		},
	
		_onMouseDown: function () {
			if (this._focused) { return; }
	
			var body = document.body,
			    docEl = document.documentElement,
			    top = body.scrollTop || docEl.scrollTop,
			    left = body.scrollLeft || docEl.scrollLeft;
	
			this._map._container.focus();
	
			window.scrollTo(left, top);
		},
	
		_onFocus: function () {
			this._focused = true;
			this._map.fire('focus');
		},
	
		_onBlur: function () {
			this._focused = false;
			this._map.fire('blur');
		},
	
		_setPanOffset: function (pan) {
			var keys = this._panKeys = {},
			    codes = this.keyCodes,
			    i, len;
	
			for (i = 0, len = codes.left.length; i < len; i++) {
				keys[codes.left[i]] = [-1 * pan, 0];
			}
			for (i = 0, len = codes.right.length; i < len; i++) {
				keys[codes.right[i]] = [pan, 0];
			}
			for (i = 0, len = codes.down.length; i < len; i++) {
				keys[codes.down[i]] = [0, pan];
			}
			for (i = 0, len = codes.up.length; i < len; i++) {
				keys[codes.up[i]] = [0, -1 * pan];
			}
		},
	
		_setZoomOffset: function (zoom) {
			var keys = this._zoomKeys = {},
			    codes = this.keyCodes,
			    i, len;
	
			for (i = 0, len = codes.zoomIn.length; i < len; i++) {
				keys[codes.zoomIn[i]] = zoom;
			}
			for (i = 0, len = codes.zoomOut.length; i < len; i++) {
				keys[codes.zoomOut[i]] = -zoom;
			}
		},
	
		_addHooks: function () {
			L.DomEvent.on(document, 'keydown', this._onKeyDown, this);
		},
	
		_removeHooks: function () {
			L.DomEvent.off(document, 'keydown', this._onKeyDown, this);
		},
	
		_onKeyDown: function (e) {
			if (e.altKey || e.ctrlKey || e.metaKey) { return; }
	
			var key = e.keyCode,
			    map = this._map;
	
			if (key in this._panKeys) {
	
				if (map._panAnim && map._panAnim._inProgress) { return; }
	
				map.panBy(this._panKeys[key]);
	
				if (map.options.maxBounds) {
					map.panInsideBounds(map.options.maxBounds);
				}
	
			} else if (key in this._zoomKeys) {
				map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);
	
			} else if (key === 27) {
				map.closePopup();
	
			} else {
				return;
			}
	
			L.DomEvent.stop(e);
		}
	});
	
	L.Map.addInitHook('addHandler', 'keyboard', L.Map.Keyboard);
	
	
	/*
	 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
	 */
	
	L.Handler.MarkerDrag = L.Handler.extend({
		initialize: function (marker) {
			this._marker = marker;
		},
	
		addHooks: function () {
			var icon = this._marker._icon;
	
			if (!this._draggable) {
				this._draggable = new L.Draggable(icon, icon, true);
			}
	
			this._draggable.on({
				dragstart: this._onDragStart,
				drag: this._onDrag,
				dragend: this._onDragEnd
			}, this).enable();
	
			L.DomUtil.addClass(icon, 'leaflet-marker-draggable');
		},
	
		removeHooks: function () {
			this._draggable.off({
				dragstart: this._onDragStart,
				drag: this._onDrag,
				dragend: this._onDragEnd
			}, this).disable();
	
			if (this._marker._icon) {
				L.DomUtil.removeClass(this._marker._icon, 'leaflet-marker-draggable');
			}
		},
	
		moved: function () {
			return this._draggable && this._draggable._moved;
		},
	
		_onDragStart: function () {
			this._marker
			    .closePopup()
			    .fire('movestart')
			    .fire('dragstart');
		},
	
		_onDrag: function (e) {
			var marker = this._marker,
			    shadow = marker._shadow,
			    iconPos = L.DomUtil.getPosition(marker._icon),
			    latlng = marker._map.layerPointToLatLng(iconPos);
	
			// update shadow position
			if (shadow) {
				L.DomUtil.setPosition(shadow, iconPos);
			}
	
			marker._latlng = latlng;
			e.latlng = latlng;
	
			marker
			    .fire('move', e)
			    .fire('drag', e);
		},
	
		_onDragEnd: function (e) {
			this._marker
			    .fire('moveend')
			    .fire('dragend', e);
		}
	});
	
	
	/*
	 * L.Control is a base class for implementing map controls. Handles positioning.
	 * All other controls extend from this class.
	 */
	
	L.Control = L.Class.extend({
		options: {
			position: 'topright'
		},
	
		initialize: function (options) {
			L.setOptions(this, options);
		},
	
		getPosition: function () {
			return this.options.position;
		},
	
		setPosition: function (position) {
			var map = this._map;
	
			if (map) {
				map.removeControl(this);
			}
	
			this.options.position = position;
	
			if (map) {
				map.addControl(this);
			}
	
			return this;
		},
	
		getContainer: function () {
			return this._container;
		},
	
		addTo: function (map) {
			this.remove();
			this._map = map;
	
			var container = this._container = this.onAdd(map),
			    pos = this.getPosition(),
			    corner = map._controlCorners[pos];
	
			L.DomUtil.addClass(container, 'leaflet-control');
	
			if (pos.indexOf('bottom') !== -1) {
				corner.insertBefore(container, corner.firstChild);
			} else {
				corner.appendChild(container);
			}
	
			return this;
		},
	
		remove: function () {
			if (!this._map) {
				return this;
			}
	
			L.DomUtil.remove(this._container);
	
			if (this.onRemove) {
				this.onRemove(this._map);
			}
	
			this._map = null;
	
			return this;
		},
	
		_refocusOnMap: function (e) {
			// if map exists and event is not a keyboard event
			if (this._map && e && e.screenX > 0 && e.screenY > 0) {
				this._map.getContainer().focus();
			}
		}
	});
	
	L.control = function (options) {
		return new L.Control(options);
	};
	
	
	// adds control-related methods to L.Map
	
	L.Map.include({
		addControl: function (control) {
			control.addTo(this);
			return this;
		},
	
		removeControl: function (control) {
			control.remove();
			return this;
		},
	
		_initControlPos: function () {
			var corners = this._controlCorners = {},
			    l = 'leaflet-',
			    container = this._controlContainer =
			            L.DomUtil.create('div', l + 'control-container', this._container);
	
			function createCorner(vSide, hSide) {
				var className = l + vSide + ' ' + l + hSide;
	
				corners[vSide + hSide] = L.DomUtil.create('div', className, container);
			}
	
			createCorner('top', 'left');
			createCorner('top', 'right');
			createCorner('bottom', 'left');
			createCorner('bottom', 'right');
		},
	
		_clearControlPos: function () {
			L.DomUtil.remove(this._controlContainer);
		}
	});
	
	
	/*
	 * L.Control.Zoom is used for the default zoom buttons on the map.
	 */
	
	L.Control.Zoom = L.Control.extend({
		options: {
			position: 'topleft',
			zoomInText: '+',
			zoomInTitle: 'Zoom in',
			zoomOutText: '-',
			zoomOutTitle: 'Zoom out'
		},
	
		onAdd: function (map) {
			var zoomName = 'leaflet-control-zoom',
			    container = L.DomUtil.create('div', zoomName + ' leaflet-bar'),
			    options = this.options;
	
			this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
			        zoomName + '-in',  container, this._zoomIn);
			this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
			        zoomName + '-out', container, this._zoomOut);
	
			this._updateDisabled();
			map.on('zoomend zoomlevelschange', this._updateDisabled, this);
	
			return container;
		},
	
		onRemove: function (map) {
			map.off('zoomend zoomlevelschange', this._updateDisabled, this);
		},
	
		disable: function () {
			this._disabled = true;
			this._updateDisabled();
			return this;
		},
	
		enable: function () {
			this._disabled = false;
			this._updateDisabled();
			return this;
		},
	
		_zoomIn: function (e) {
			if (!this._disabled) {
				this._map.zoomIn(e.shiftKey ? 3 : 1);
			}
		},
	
		_zoomOut: function (e) {
			if (!this._disabled) {
				this._map.zoomOut(e.shiftKey ? 3 : 1);
			}
		},
	
		_createButton: function (html, title, className, container, fn) {
			var link = L.DomUtil.create('a', className, container);
			link.innerHTML = html;
			link.href = '#';
			link.title = title;
	
			L.DomEvent
			    .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
			    .on(link, 'click', L.DomEvent.stop)
			    .on(link, 'click', fn, this)
			    .on(link, 'click', this._refocusOnMap, this);
	
			return link;
		},
	
		_updateDisabled: function () {
			var map = this._map,
				className = 'leaflet-disabled';
	
			L.DomUtil.removeClass(this._zoomInButton, className);
			L.DomUtil.removeClass(this._zoomOutButton, className);
	
			if (this._disabled || map._zoom === map.getMinZoom()) {
				L.DomUtil.addClass(this._zoomOutButton, className);
			}
			if (this._disabled || map._zoom === map.getMaxZoom()) {
				L.DomUtil.addClass(this._zoomInButton, className);
			}
		}
	});
	
	L.Map.mergeOptions({
		zoomControl: true
	});
	
	L.Map.addInitHook(function () {
		if (this.options.zoomControl) {
			this.zoomControl = new L.Control.Zoom();
			this.addControl(this.zoomControl);
		}
	});
	
	L.control.zoom = function (options) {
		return new L.Control.Zoom(options);
	};
	
	
	/*
	 * L.Control.Attribution is used for displaying attribution on the map (added by default).
	 */
	
	L.Control.Attribution = L.Control.extend({
		options: {
			position: 'bottomright',
			prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
		},
	
		initialize: function (options) {
			L.setOptions(this, options);
	
			this._attributions = {};
		},
	
		onAdd: function (map) {
			this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
			if (L.DomEvent) {
				L.DomEvent.disableClickPropagation(this._container);
			}
	
			// TODO ugly, refactor
			for (var i in map._layers) {
				if (map._layers[i].getAttribution) {
					this.addAttribution(map._layers[i].getAttribution());
				}
			}
	
			this._update();
	
			return this._container;
		},
	
		setPrefix: function (prefix) {
			this.options.prefix = prefix;
			this._update();
			return this;
		},
	
		addAttribution: function (text) {
			if (!text) { return this; }
	
			if (!this._attributions[text]) {
				this._attributions[text] = 0;
			}
			this._attributions[text]++;
	
			this._update();
	
			return this;
		},
	
		removeAttribution: function (text) {
			if (!text) { return this; }
	
			if (this._attributions[text]) {
				this._attributions[text]--;
				this._update();
			}
	
			return this;
		},
	
		_update: function () {
			if (!this._map) { return; }
	
			var attribs = [];
	
			for (var i in this._attributions) {
				if (this._attributions[i]) {
					attribs.push(i);
				}
			}
	
			var prefixAndAttribs = [];
	
			if (this.options.prefix) {
				prefixAndAttribs.push(this.options.prefix);
			}
			if (attribs.length) {
				prefixAndAttribs.push(attribs.join(', '));
			}
	
			this._container.innerHTML = prefixAndAttribs.join(' | ');
		}
	});
	
	L.Map.mergeOptions({
		attributionControl: true
	});
	
	L.Map.addInitHook(function () {
		if (this.options.attributionControl) {
			this.attributionControl = (new L.Control.Attribution()).addTo(this);
		}
	});
	
	L.control.attribution = function (options) {
		return new L.Control.Attribution(options);
	};
	
	
	/*
	 * L.Control.Scale is used for displaying metric/imperial scale on the map.
	 */
	
	L.Control.Scale = L.Control.extend({
		options: {
			position: 'bottomleft',
			maxWidth: 100,
			metric: true,
			imperial: true
			// updateWhenIdle: false
		},
	
		onAdd: function (map) {
			var className = 'leaflet-control-scale',
			    container = L.DomUtil.create('div', className),
			    options = this.options;
	
			this._addScales(options, className + '-line', container);
	
			map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
			map.whenReady(this._update, this);
	
			return container;
		},
	
		onRemove: function (map) {
			map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		},
	
		_addScales: function (options, className, container) {
			if (options.metric) {
				this._mScale = L.DomUtil.create('div', className, container);
			}
			if (options.imperial) {
				this._iScale = L.DomUtil.create('div', className, container);
			}
		},
	
		_update: function () {
			var map = this._map,
			    y = map.getSize().y / 2;
	
			var maxMeters = map.distance(
					map.containerPointToLatLng([0, y]),
					map.containerPointToLatLng([this.options.maxWidth, y]));
	
			this._updateScales(maxMeters);
		},
	
		_updateScales: function (maxMeters) {
			if (this.options.metric && maxMeters) {
				this._updateMetric(maxMeters);
			}
			if (this.options.imperial && maxMeters) {
				this._updateImperial(maxMeters);
			}
		},
	
		_updateMetric: function (maxMeters) {
			var meters = this._getRoundNum(maxMeters),
			    label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';
	
			this._updateScale(this._mScale, label, meters / maxMeters);
		},
	
		_updateImperial: function (maxMeters) {
			var maxFeet = maxMeters * 3.2808399,
			    maxMiles, miles, feet;
	
			if (maxFeet > 5280) {
				maxMiles = maxFeet / 5280;
				miles = this._getRoundNum(maxMiles);
				this._updateScale(this._iScale, miles + ' mi', miles / maxMiles);
	
			} else {
				feet = this._getRoundNum(maxFeet);
				this._updateScale(this._iScale, feet + ' ft', feet / maxFeet);
			}
		},
	
		_updateScale: function (scale, text, ratio) {
			scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
			scale.innerHTML = text;
		},
	
		_getRoundNum: function (num) {
			var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
			    d = num / pow10;
	
			d = d >= 10 ? 10 :
			    d >= 5 ? 5 :
			    d >= 3 ? 3 :
			    d >= 2 ? 2 : 1;
	
			return pow10 * d;
		}
	});
	
	L.control.scale = function (options) {
		return new L.Control.Scale(options);
	};
	
	
	/*
	 * L.Control.Layers is a control to allow users to switch between different layers on the map.
	 */
	
	L.Control.Layers = L.Control.extend({
		options: {
			collapsed: true,
			position: 'topright',
			autoZIndex: true,
			hideSingleBase: false
		},
	
		initialize: function (baseLayers, overlays, options) {
			L.setOptions(this, options);
	
			this._layers = {};
			this._lastZIndex = 0;
			this._handlingClick = false;
	
			for (var i in baseLayers) {
				this._addLayer(baseLayers[i], i);
			}
	
			for (i in overlays) {
				this._addLayer(overlays[i], i, true);
			}
		},
	
		onAdd: function () {
			this._initLayout();
			this._update();
	
			return this._container;
		},
	
		addBaseLayer: function (layer, name) {
			this._addLayer(layer, name);
			return this._update();
		},
	
		addOverlay: function (layer, name) {
			this._addLayer(layer, name, true);
			return this._update();
		},
	
		removeLayer: function (layer) {
			layer.off('add remove', this._onLayerChange, this);
	
			delete this._layers[L.stamp(layer)];
			return this._update();
		},
	
		_initLayout: function () {
			var className = 'leaflet-control-layers',
			    container = this._container = L.DomUtil.create('div', className);
	
			// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
			container.setAttribute('aria-haspopup', true);
	
			if (!L.Browser.touch) {
				L.DomEvent
					.disableClickPropagation(container)
					.disableScrollPropagation(container);
			} else {
				L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
			}
	
			var form = this._form = L.DomUtil.create('form', className + '-list');
	
			if (this.options.collapsed) {
				if (!L.Browser.android) {
					L.DomEvent.on(container, {
						mouseenter: this._expand,
						mouseleave: this._collapse
					}, this);
				}
	
				var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
				link.href = '#';
				link.title = 'Layers';
	
				if (L.Browser.touch) {
					L.DomEvent
					    .on(link, 'click', L.DomEvent.stop)
					    .on(link, 'click', this._expand, this);
				} else {
					L.DomEvent.on(link, 'focus', this._expand, this);
				}
	
				// work around for Firefox Android issue https://github.com/Leaflet/Leaflet/issues/2033
				L.DomEvent.on(form, 'click', function () {
					setTimeout(L.bind(this._onInputClick, this), 0);
				}, this);
	
				this._map.on('click', this._collapse, this);
				// TODO keyboard accessibility
			} else {
				this._expand();
			}
	
			this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
			this._separator = L.DomUtil.create('div', className + '-separator', form);
			this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);
	
			container.appendChild(form);
		},
	
		_addLayer: function (layer, name, overlay) {
			layer.on('add remove', this._onLayerChange, this);
	
			var id = L.stamp(layer);
	
			this._layers[id] = {
				layer: layer,
				name: name,
				overlay: overlay
			};
	
			if (this.options.autoZIndex && layer.setZIndex) {
				this._lastZIndex++;
				layer.setZIndex(this._lastZIndex);
			}
		},
	
		_update: function () {
			if (!this._container) { return this; }
	
			L.DomUtil.empty(this._baseLayersList);
			L.DomUtil.empty(this._overlaysList);
	
			var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;
	
			for (i in this._layers) {
				obj = this._layers[i];
				this._addItem(obj);
				overlaysPresent = overlaysPresent || obj.overlay;
				baseLayersPresent = baseLayersPresent || !obj.overlay;
				baseLayersCount += !obj.overlay ? 1 : 0;
			}
	
			// Hide base layers section if there's only one layer.
			if (this.options.hideSingleBase) {
				baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
				this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
			}
	
			this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';
	
			return this;
		},
	
		_onLayerChange: function (e) {
			if (!this._handlingClick) {
				this._update();
			}
	
			var overlay = this._layers[L.stamp(e.target)].overlay;
	
			var type = overlay ?
				(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
				(e.type === 'add' ? 'baselayerchange' : null);
	
			if (type) {
				this._map.fire(type, e.target);
			}
		},
	
		// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
		_createRadioElement: function (name, checked) {
	
			var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
					name + '"' + (checked ? ' checked="checked"' : '') + '/>';
	
			var radioFragment = document.createElement('div');
			radioFragment.innerHTML = radioHtml;
	
			return radioFragment.firstChild;
		},
	
		_addItem: function (obj) {
			var label = document.createElement('label'),
			    checked = this._map.hasLayer(obj.layer),
			    input;
	
			if (obj.overlay) {
				input = document.createElement('input');
				input.type = 'checkbox';
				input.className = 'leaflet-control-layers-selector';
				input.defaultChecked = checked;
			} else {
				input = this._createRadioElement('leaflet-base-layers', checked);
			}
	
			input.layerId = L.stamp(obj.layer);
	
			L.DomEvent.on(input, 'click', this._onInputClick, this);
	
			var name = document.createElement('span');
			name.innerHTML = ' ' + obj.name;
	
			// Helps from preventing layer control flicker when checkboxes are disabled
			// https://github.com/Leaflet/Leaflet/issues/2771
			var holder = document.createElement('div');
	
			label.appendChild(holder);
			holder.appendChild(input);
			holder.appendChild(name);
	
			var container = obj.overlay ? this._overlaysList : this._baseLayersList;
			container.appendChild(label);
	
			return label;
		},
	
		_onInputClick: function () {
			var inputs = this._form.getElementsByTagName('input'),
			    input, layer, hasLayer;
			var addedLayers = [],
			    removedLayers = [];
	
			this._handlingClick = true;
	
			for (var i = 0, len = inputs.length; i < len; i++) {
				input = inputs[i];
				layer = this._layers[input.layerId].layer;
				hasLayer = this._map.hasLayer(layer);
	
				if (input.checked && !hasLayer) {
					addedLayers.push(layer);
	
				} else if (!input.checked && hasLayer) {
					removedLayers.push(layer);
				}
			}
	
			// Bugfix issue 2318: Should remove all old layers before readding new ones
			for (i = 0; i < removedLayers.length; i++) {
				this._map.removeLayer(removedLayers[i]);
			}
			for (i = 0; i < addedLayers.length; i++) {
				this._map.addLayer(addedLayers[i]);
			}
	
			this._handlingClick = false;
	
			this._refocusOnMap();
		},
	
		_expand: function () {
			L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
			var acceptableHeight = this._map._size.y - (this._container.offsetTop * 4);
			if (acceptableHeight < this._form.clientHeight)
			{
				L.DomUtil.addClass(this._form, 'leaflet-control-layers-scrollbar');
				this._form.style.height = acceptableHeight + 'px';
			}
		},
	
		_collapse: function () {
			L.DomUtil.removeClass(this._container, 'leaflet-control-layers-expanded');
		}
	});
	
	L.control.layers = function (baseLayers, overlays, options) {
		return new L.Control.Layers(baseLayers, overlays, options);
	};
	
	
	/*
	 * L.PosAnimation powers Leaflet pan animations internally.
	 */
	
	L.PosAnimation = L.Evented.extend({
	
		run: function (el, newPos, duration, easeLinearity) { // (HTMLElement, Point[, Number, Number])
			this.stop();
	
			this._el = el;
			this._inProgress = true;
			this._duration = duration || 0.25;
			this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);
	
			this._startPos = L.DomUtil.getPosition(el);
			this._offset = newPos.subtract(this._startPos);
			this._startTime = +new Date();
	
			this.fire('start');
	
			this._animate();
		},
	
		stop: function () {
			if (!this._inProgress) { return; }
	
			this._step(true);
			this._complete();
		},
	
		_animate: function () {
			// animation loop
			this._animId = L.Util.requestAnimFrame(this._animate, this);
			this._step();
		},
	
		_step: function (round) {
			var elapsed = (+new Date()) - this._startTime,
			    duration = this._duration * 1000;
	
			if (elapsed < duration) {
				this._runFrame(this._easeOut(elapsed / duration), round);
			} else {
				this._runFrame(1);
				this._complete();
			}
		},
	
		_runFrame: function (progress, round) {
			var pos = this._startPos.add(this._offset.multiplyBy(progress));
			if (round) {
				pos._round();
			}
			L.DomUtil.setPosition(this._el, pos);
	
			this.fire('step');
		},
	
		_complete: function () {
			L.Util.cancelAnimFrame(this._animId);
	
			this._inProgress = false;
			this.fire('end');
		},
	
		_easeOut: function (t) {
			return 1 - Math.pow(1 - t, this._easeOutPower);
		}
	});
	
	
	/*
	 * Extends L.Map to handle panning animations.
	 */
	
	L.Map.include({
	
		setView: function (center, zoom, options) {
	
			zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
			center = this._limitCenter(L.latLng(center), zoom, this.options.maxBounds);
			options = options || {};
	
			this.stop();
	
			if (this._loaded && !options.reset && options !== true) {
	
				if (options.animate !== undefined) {
					options.zoom = L.extend({animate: options.animate}, options.zoom);
					options.pan = L.extend({animate: options.animate}, options.pan);
				}
	
				// try animating pan or zoom
				var animated = (this._zoom !== zoom) ?
					this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
					this._tryAnimatedPan(center, options.pan);
	
				if (animated) {
					// prevent resize handler call, the view will refresh after animation anyway
					clearTimeout(this._sizeTimer);
					return this;
				}
			}
	
			// animation didn't start, just reset the map view
			this._resetView(center, zoom);
	
			return this;
		},
	
		panBy: function (offset, options) {
			offset = L.point(offset).round();
			options = options || {};
	
			if (!offset.x && !offset.y) {
				return this;
			}
			//If we pan too far then chrome gets issues with tiles
			// and makes them disappear or appear in the wrong place (slightly offset) #2602
			if (options.animate !== true && !this.getSize().contains(offset)) {
				this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
				return this;
			}
	
			if (!this._panAnim) {
				this._panAnim = new L.PosAnimation();
	
				this._panAnim.on({
					'step': this._onPanTransitionStep,
					'end': this._onPanTransitionEnd
				}, this);
			}
	
			// don't fire movestart if animating inertia
			if (!options.noMoveStart) {
				this.fire('movestart');
			}
	
			// animate pan unless animate: false specified
			if (options.animate !== false) {
				L.DomUtil.addClass(this._mapPane, 'leaflet-pan-anim');
	
				var newPos = this._getMapPanePos().subtract(offset);
				this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
			} else {
				this._rawPanBy(offset);
				this.fire('move').fire('moveend');
			}
	
			return this;
		},
	
		_onPanTransitionStep: function () {
			this.fire('move');
		},
	
		_onPanTransitionEnd: function () {
			L.DomUtil.removeClass(this._mapPane, 'leaflet-pan-anim');
			this.fire('moveend');
		},
	
		_tryAnimatedPan: function (center, options) {
			// difference between the new and current centers in pixels
			var offset = this._getCenterOffset(center)._floor();
	
			// don't animate too far unless animate: true specified in options
			if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }
	
			this.panBy(offset, options);
	
			return (options && options.animate) !== false;
		}
	});
	
	
	/*
	 * Extends L.Map to handle zoom animations.
	 */
	
	L.Map.mergeOptions({
		zoomAnimation: true,
		zoomAnimationThreshold: 4
	});
	
	var zoomAnimated = L.DomUtil.TRANSITION && L.Browser.any3d && !L.Browser.mobileOpera;
	
	if (zoomAnimated) {
	
		L.Map.addInitHook(function () {
			// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
			this._zoomAnimated = this.options.zoomAnimation;
	
			// zoom transitions run with the same duration for all layers, so if one of transitionend events
			// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
			if (this._zoomAnimated) {
	
				this._createAnimProxy();
	
				L.DomEvent.on(this._proxy, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
			}
		});
	}
	
	L.Map.include(!zoomAnimated ? {} : {
	
		_createAnimProxy: function () {
	
			var proxy = this._proxy = L.DomUtil.create('div', 'leaflet-proxy leaflet-zoom-animated');
			this._panes.mapPane.appendChild(proxy);
	
			this.on('zoomanim', function (e) {
				var prop = L.DomUtil.TRANSFORM,
					transform = proxy.style[prop];
	
				L.DomUtil.setTransform(proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));
	
				// workaround for case when transform is the same and so transitionend event is not fired
				if (transform === proxy.style[prop] && this._animatingZoom) {
					this._onZoomTransitionEnd();
				}
			}, this);
	
			this.on('load moveend', function () {
				var c = this.getCenter(),
					z = this.getZoom();
				L.DomUtil.setTransform(proxy, this.project(c, z), this.getZoomScale(z, 1));
			}, this);
		},
	
		_catchTransitionEnd: function (e) {
			if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
				this._onZoomTransitionEnd();
			}
		},
	
		_nothingToAnimate: function () {
			return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
		},
	
		_tryAnimatedZoom: function (center, zoom, options) {
	
			if (this._animatingZoom) { return true; }
	
			options = options || {};
	
			// don't animate if disabled, not supported or zoom difference is too large
			if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
			        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }
	
			// offset is the pixel coords of the zoom origin relative to the current center
			var scale = this.getZoomScale(zoom),
			    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);
	
			// don't animate if the zoom origin isn't within one screen from the current center, unless forced
			if (options.animate !== true && !this.getSize().contains(offset)) { return false; }
	
			L.Util.requestAnimFrame(function () {
				this
				    ._moveStart(true)
				    ._animateZoom(center, zoom, true);
			}, this);
	
			return true;
		},
	
		_animateZoom: function (center, zoom, startAnim, noUpdate) {
			if (startAnim) {
				this._animatingZoom = true;
	
				// remember what center/zoom to set after animation
				this._animateToCenter = center;
				this._animateToZoom = zoom;
	
				L.DomUtil.addClass(this._mapPane, 'leaflet-zoom-anim');
			}
	
			this.fire('zoomanim', {
				center: center,
				zoom: zoom,
				noUpdate: noUpdate
			});
		},
	
		_onZoomTransitionEnd: function () {
	
			this._animatingZoom = false;
	
			L.DomUtil.removeClass(this._mapPane, 'leaflet-zoom-anim');
	
			this
				._move(this._animateToCenter, this._animateToZoom)
				._moveEnd(true);
		}
	});
	
	
	
	L.Map.include({
		flyTo: function (targetCenter, targetZoom, options) {
	
			options = options || {};
			if (options.animate === false || !L.Browser.any3d) {
				return this.setView(targetCenter, targetZoom, options);
			}
	
			this.stop();
	
			var from = this.project(this.getCenter()),
			    to = this.project(targetCenter),
			    size = this.getSize(),
			    startZoom = this._zoom;
	
			targetCenter = L.latLng(targetCenter);
			targetZoom = targetZoom === undefined ? startZoom : targetZoom;
	
			var w0 = Math.max(size.x, size.y),
			    w1 = w0 * this.getZoomScale(startZoom, targetZoom),
			    u1 = to.distanceTo(from),
			    rho = 1.42,
			    rho2 = rho * rho;
	
			function r(i) {
				var b = (w1 * w1 - w0 * w0 + (i ? -1 : 1) * rho2 * rho2 * u1 * u1) / (2 * (i ? w1 : w0) * rho2 * u1);
				return Math.log(Math.sqrt(b * b + 1) - b);
			}
	
			function sinh(n) { return (Math.exp(n) - Math.exp(-n)) / 2; }
			function cosh(n) { return (Math.exp(n) + Math.exp(-n)) / 2; }
			function tanh(n) { return sinh(n) / cosh(n); }
	
			var r0 = r(0);
	
			function w(s) { return w0 * (cosh(r0) / cosh(r0 + rho * s)); }
			function u(s) { return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2; }
	
			function easeOut(t) { return 1 - Math.pow(1 - t, 1.5); }
	
			var start = Date.now(),
			    S = (r(1) - r0) / rho,
			    duration = options.duration ? 1000 * options.duration : 1000 * S * 0.8;
	
			function frame() {
				var t = (Date.now() - start) / duration,
				    s = easeOut(t) * S;
	
				if (t <= 1) {
					this._flyToFrame = L.Util.requestAnimFrame(frame, this);
	
					this._move(
						this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom),
						this.getScaleZoom(w0 / w(s), startZoom));
	
				} else {
					this
						._move(targetCenter, targetZoom)
						._moveEnd(true);
				}
			}
	
			this._moveStart(true);
	
			frame.call(this);
			return this;
		},
	
		flyToBounds: function(bounds, options) {
			var target = this._getBoundsCenterZoom(bounds, options);
			return this.flyTo(target.center, target.zoom, options);
		}
	});
	
	
	/*
	 * Provides L.Map with convenient shortcuts for using browser geolocation features.
	 */
	
	L.Map.include({
		_defaultLocateOptions: {
			timeout: 10000,
			watch: false
			// setView: false
			// maxZoom: <Number>
			// maximumAge: 0
			// enableHighAccuracy: false
		},
	
		locate: function (/*Object*/ options) {
	
			options = this._locateOptions = L.extend({}, this._defaultLocateOptions, options);
	
			if (!('geolocation' in navigator)) {
				this._handleGeolocationError({
					code: 0,
					message: 'Geolocation not supported.'
				});
				return this;
			}
	
			var onResponse = L.bind(this._handleGeolocationResponse, this),
				onError = L.bind(this._handleGeolocationError, this);
	
			if (options.watch) {
				this._locationWatchId =
				        navigator.geolocation.watchPosition(onResponse, onError, options);
			} else {
				navigator.geolocation.getCurrentPosition(onResponse, onError, options);
			}
			return this;
		},
	
		stopLocate: function () {
			if (navigator.geolocation) {
				navigator.geolocation.clearWatch(this._locationWatchId);
			}
			if (this._locateOptions) {
				this._locateOptions.setView = false;
			}
			return this;
		},
	
		_handleGeolocationError: function (error) {
			var c = error.code,
			    message = error.message ||
			            (c === 1 ? 'permission denied' :
			            (c === 2 ? 'position unavailable' : 'timeout'));
	
			if (this._locateOptions.setView && !this._loaded) {
				this.fitWorld();
			}
	
			this.fire('locationerror', {
				code: c,
				message: 'Geolocation error: ' + message + '.'
			});
		},
	
		_handleGeolocationResponse: function (pos) {
			var lat = pos.coords.latitude,
			    lng = pos.coords.longitude,
			    latlng = new L.LatLng(lat, lng),
			    bounds = latlng.toBounds(pos.coords.accuracy),
			    options = this._locateOptions;
	
			if (options.setView) {
				var zoom = this.getBoundsZoom(bounds);
				this.setView(latlng, options.maxZoom ? Math.min(zoom, options.maxZoom) : zoom);
			}
	
			var data = {
				latlng: latlng,
				bounds: bounds,
				timestamp: pos.timestamp
			};
	
			for (var i in pos.coords) {
				if (typeof pos.coords[i] === 'number') {
					data[i] = pos.coords[i];
				}
			}
	
			this.fire('locationfound', data);
		}
	});
	
	
	}(window, document));

/***/ },
/* 2 */
/*!*******************************************!*\
  !*** ./~/esri-leaflet/src/EsriLeaflet.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	var VERSION = '2.0.0-beta.5';
	
	// import base
	exports.VERSION = VERSION;
	
	var _Support = __webpack_require__(/*! ./Support */ 3);
	
	exports.Support = _Support.Support;
	
	var _Util = __webpack_require__(/*! ./Util */ 4);
	
	exports.Util = _Util.Util;
	
	var _Request = __webpack_require__(/*! ./Request */ 5);
	
	// export tasks
	exports.get = _Request.get;
	exports.post = _Request.post;
	exports.request = _Request.request;
	
	var _TasksTask = __webpack_require__(/*! ./Tasks/Task */ 6);
	
	exports.Task = _TasksTask.Task;
	exports.task = _TasksTask.task;
	
	var _TasksQuery = __webpack_require__(/*! ./Tasks/Query */ 7);
	
	exports.Query = _TasksQuery.Query;
	exports.query = _TasksQuery.query;
	
	var _TasksFind = __webpack_require__(/*! ./Tasks/Find */ 8);
	
	exports.Find = _TasksFind.Find;
	exports.find = _TasksFind.find;
	
	var _TasksIdentify = __webpack_require__(/*! ./Tasks/Identify */ 9);
	
	exports.Identify = _TasksIdentify.Identify;
	exports.identify = _TasksIdentify.identify;
	
	var _TasksIdentifyFeatures = __webpack_require__(/*! ./Tasks/IdentifyFeatures */ 10);
	
	exports.IdentifyFeatures = _TasksIdentifyFeatures.IdentifyFeatures;
	exports.identifyFeatures = _TasksIdentifyFeatures.identifyFeatures;
	
	var _TasksIdentifyImage = __webpack_require__(/*! ./Tasks/IdentifyImage */ 11);
	
	// export services
	exports.IdentifyImage = _TasksIdentifyImage.IdentifyImage;
	exports.identifyImage = _TasksIdentifyImage.identifyImage;
	
	var _ServicesService = __webpack_require__(/*! ./Services/Service */ 12);
	
	exports.Service = _ServicesService.Service;
	exports.service = _ServicesService.service;
	
	var _ServicesMapService = __webpack_require__(/*! ./Services/MapService */ 13);
	
	exports.MapService = _ServicesMapService.MapService;
	exports.mapService = _ServicesMapService.mapService;
	
	var _ServicesImageService = __webpack_require__(/*! ./Services/ImageService */ 14);
	
	exports.ImageService = _ServicesImageService.ImageService;
	exports.imageService = _ServicesImageService.imageService;
	
	var _ServicesFeatureLayerService = __webpack_require__(/*! ./Services/FeatureLayerService */ 15);
	
	// export layers
	exports.FeatureLayerService = _ServicesFeatureLayerService.FeatureLayerService;
	exports.featureLayerService = _ServicesFeatureLayerService.featureLayerService;
	
	var _LayersBasemapLayer = __webpack_require__(/*! ./Layers/BasemapLayer */ 16);
	
	exports.BasemapLayer = _LayersBasemapLayer.BasemapLayer;
	exports.basemapLayer = _LayersBasemapLayer.basemapLayer;
	
	var _LayersTiledMapLayer = __webpack_require__(/*! ./Layers/TiledMapLayer */ 18);
	
	exports.TiledMapLayer = _LayersTiledMapLayer.TiledMapLayer;
	exports.tiledMapLayer = _LayersTiledMapLayer.tiledMapLayer;
	
	var _LayersRasterLayer = __webpack_require__(/*! ./Layers/RasterLayer */ 19);
	
	exports.RasterLayer = _LayersRasterLayer.RasterLayer;
	
	var _LayersImageMapLayer = __webpack_require__(/*! ./Layers/ImageMapLayer */ 20);
	
	exports.ImageMapLayer = _LayersImageMapLayer.ImageMapLayer;
	exports.imageMapLayer = _LayersImageMapLayer.imageMapLayer;
	
	var _LayersDynamicMapLayer = __webpack_require__(/*! ./Layers/DynamicMapLayer */ 21);
	
	exports.DynamicMapLayer = _LayersDynamicMapLayer.DynamicMapLayer;
	exports.dynamicMapLayer = _LayersDynamicMapLayer.dynamicMapLayer;
	
	var _LayersFeatureLayerFeatureGrid = __webpack_require__(/*! ./Layers/FeatureLayer/FeatureGrid */ 22);
	
	exports.FeatureGrid = _LayersFeatureLayerFeatureGrid.FeatureGrid;
	
	var _LayersFeatureLayerFeatureManager = __webpack_require__(/*! ./Layers/FeatureLayer/FeatureManager */ 23);
	
	exports.FeatureManager = _LayersFeatureLayerFeatureManager.FeatureManager;
	
	var _LayersFeatureLayerFeatureLayer = __webpack_require__(/*! ./Layers/FeatureLayer/FeatureLayer */ 24);
	
	exports.FeatureLayer = _LayersFeatureLayerFeatureLayer.FeatureLayer;
	exports.featureLayer = _LayersFeatureLayerFeatureLayer.featureLayer;

/***/ },
/* 3 */
/*!***************************************!*\
  !*** ./~/esri-leaflet/src/Support.js ***!
  \***************************************/
/***/ function(module, exports) {

	exports.__esModule = true;
	var cors = window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest();
	exports.cors = cors;
	var pointerEvents = document.documentElement.style.pointerEvents === '';
	
	exports.pointerEvents = pointerEvents;
	var Support = {
	  cors: cors,
	  pointerEvents: pointerEvents
	};
	
	exports.Support = Support;
	exports.default = Support;

/***/ },
/* 4 */
/*!************************************!*\
  !*** ./~/esri-leaflet/src/Util.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.shallowClone = shallowClone;
	exports.extentToBounds = extentToBounds;
	exports.boundsToExtent = boundsToExtent;
	exports.arcgisToGeojson = arcgisToGeojson;
	exports.geojsonToArcGIS = geojsonToArcGIS;
	exports.responseToFeatureCollection = responseToFeatureCollection;
	exports.cleanUrl = cleanUrl;
	exports.isArcgisOnline = isArcgisOnline;
	exports.geojsonTypeToArcGIS = geojsonTypeToArcGIS;
	exports.warn = warn;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	// checks if 2 x,y points are equal
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	function pointsEqual(a, b) {
	  for (var i = 0; i < a.length; i++) {
	    if (a[i] !== b[i]) {
	      return false;
	    }
	  }
	  return true;
	}
	
	// checks if the first and last points of a ring are equal and closes the ring
	function closeRing(coordinates) {
	  if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
	    coordinates.push(coordinates[0]);
	  }
	  return coordinates;
	}
	
	// determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
	// or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
	// points-are-in-clockwise-order
	function ringIsClockwise(ringToTest) {
	  var total = 0;
	  var i = 0;
	  var rLength = ringToTest.length;
	  var pt1 = ringToTest[i];
	  var pt2;
	  for (i; i < rLength - 1; i++) {
	    pt2 = ringToTest[i + 1];
	    total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
	    pt1 = pt2;
	  }
	  return total >= 0;
	}
	
	// ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L504-L519
	function vertexIntersectsVertex(a1, a2, b1, b2) {
	  var uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
	  var ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
	  var uB = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);
	
	  if (uB !== 0) {
	    var ua = uaT / uB;
	    var ub = ubT / uB;
	
	    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
	      return true;
	    }
	  }
	
	  return false;
	}
	
	// ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L521-L531
	function arrayIntersectsArray(a, b) {
	  for (var i = 0; i < a.length - 1; i++) {
	    for (var j = 0; j < b.length - 1; j++) {
	      if (vertexIntersectsVertex(a[i], a[i + 1], b[j], b[j + 1])) {
	        return true;
	      }
	    }
	  }
	
	  return false;
	}
	
	// ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L470-L480
	function coordinatesContainPoint(coordinates, point) {
	  var contains = false;
	  for (var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
	    if ((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1] || coordinates[j][1] <= point[1] && point[1] < coordinates[i][1]) && point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0]) {
	      contains = !contains;
	    }
	  }
	  return contains;
	}
	
	// ported from terraformer-arcgis-parser.js https://github.com/Esri/terraformer-arcgis-parser/blob/master/terraformer-arcgis-parser.js#L106-L113
	function coordinatesContainCoordinates(outer, inner) {
	  var intersects = arrayIntersectsArray(outer, inner);
	  var contains = coordinatesContainPoint(outer, inner[0]);
	  if (!intersects && contains) {
	    return true;
	  }
	  return false;
	}
	
	// do any polygons in this array contain any other polygons in this array?
	// used for checking for holes in arcgis rings
	// ported from terraformer-arcgis-parser.js https://github.com/Esri/terraformer-arcgis-parser/blob/master/terraformer-arcgis-parser.js#L117-L172
	function convertRingsToGeoJSON(rings) {
	  var outerRings = [];
	  var holes = [];
	  var x; // iterator
	  var outerRing; // current outer ring being evaluated
	  var hole; // current hole being evaluated
	
	  // for each ring
	  for (var r = 0; r < rings.length; r++) {
	    var ring = closeRing(rings[r].slice(0));
	    if (ring.length < 4) {
	      continue;
	    }
	    // is this ring an outer ring? is it clockwise?
	    if (ringIsClockwise(ring)) {
	      var polygon = [ring];
	      outerRings.push(polygon); // push to outer rings
	    } else {
	        holes.push(ring); // counterclockwise push to holes
	      }
	  }
	
	  var uncontainedHoles = [];
	
	  // while there are holes left...
	  while (holes.length) {
	    // pop a hole off out stack
	    hole = holes.pop();
	
	    // loop over all outer rings and see if they contain our hole.
	    var contained = false;
	    for (x = outerRings.length - 1; x >= 0; x--) {
	      outerRing = outerRings[x][0];
	      if (coordinatesContainCoordinates(outerRing, hole)) {
	        // the hole is contained push it into our polygon
	        outerRings[x].push(hole);
	        contained = true;
	        break;
	      }
	    }
	
	    // ring is not contained in any outer ring
	    // sometimes this happens https://github.com/Esri/esri-leaflet/issues/320
	    if (!contained) {
	      uncontainedHoles.push(hole);
	    }
	  }
	
	  // if we couldn't match any holes using contains we can try intersects...
	  while (uncontainedHoles.length) {
	    // pop a hole off out stack
	    hole = uncontainedHoles.pop();
	
	    // loop over all outer rings and see if any intersect our hole.
	    var intersects = false;
	
	    for (x = outerRings.length - 1; x >= 0; x--) {
	      outerRing = outerRings[x][0];
	      if (arrayIntersectsArray(outerRing, hole)) {
	        // the hole is contained push it into our polygon
	        outerRings[x].push(hole);
	        intersects = true;
	        break;
	      }
	    }
	
	    if (!intersects) {
	      outerRings.push([hole.reverse()]);
	    }
	  }
	
	  if (outerRings.length === 1) {
	    return {
	      type: 'Polygon',
	      coordinates: outerRings[0]
	    };
	  } else {
	    return {
	      type: 'MultiPolygon',
	      coordinates: outerRings
	    };
	  }
	}
	
	// This function ensures that rings are oriented in the right directions
	// outer rings are clockwise, holes are counterclockwise
	// used for converting GeoJSON Polygons to ArcGIS Polygons
	function orientRings(poly) {
	  var output = [];
	  var polygon = poly.slice(0);
	  var outerRing = closeRing(polygon.shift().slice(0));
	  if (outerRing.length >= 4) {
	    if (!ringIsClockwise(outerRing)) {
	      outerRing.reverse();
	    }
	
	    output.push(outerRing);
	
	    for (var i = 0; i < polygon.length; i++) {
	      var hole = closeRing(polygon[i].slice(0));
	      if (hole.length >= 4) {
	        if (ringIsClockwise(hole)) {
	          hole.reverse();
	        }
	        output.push(hole);
	      }
	    }
	  }
	
	  return output;
	}
	
	// This function flattens holes in multipolygons to one array of polygons
	// used for converting GeoJSON Polygons to ArcGIS Polygons
	function flattenMultiPolygonRings(rings) {
	  var output = [];
	  for (var i = 0; i < rings.length; i++) {
	    var polygon = orientRings(rings[i]);
	    for (var x = polygon.length - 1; x >= 0; x--) {
	      var ring = polygon[x].slice(0);
	      output.push(ring);
	    }
	  }
	  return output;
	}
	
	// shallow object clone for feature properties and attributes
	// from http://jsperf.com/cloning-an-object/2
	
	function shallowClone(obj) {
	  var target = {};
	  for (var i in obj) {
	    if (obj.hasOwnProperty(i)) {
	      target[i] = obj[i];
	    }
	  }
	  return target;
	}
	
	// convert an extent (ArcGIS) to LatLngBounds (Leaflet)
	
	function extentToBounds(extent) {
	  var sw = _leaflet2.default.latLng(extent.ymin, extent.xmin);
	  var ne = _leaflet2.default.latLng(extent.ymax, extent.xmax);
	  return _leaflet2.default.latLngBounds(sw, ne);
	}
	
	// convert an LatLngBounds (Leaflet) to extent (ArcGIS)
	
	function boundsToExtent(bounds) {
	  bounds = _leaflet2.default.latLngBounds(bounds);
	  return {
	    'xmin': bounds.getSouthWest().lng,
	    'ymin': bounds.getSouthWest().lat,
	    'xmax': bounds.getNorthEast().lng,
	    'ymax': bounds.getNorthEast().lat,
	    'spatialReference': {
	      'wkid': 4326
	    }
	  };
	}
	
	function arcgisToGeojson(arcgis, idAttribute) {
	  var geojson = {};
	
	  if (typeof arcgis.x === 'number' && typeof arcgis.y === 'number') {
	    geojson.type = 'Point';
	    geojson.coordinates = [arcgis.x, arcgis.y];
	  }
	
	  if (arcgis.points) {
	    geojson.type = 'MultiPoint';
	    geojson.coordinates = arcgis.points.slice(0);
	  }
	
	  if (arcgis.paths) {
	    if (arcgis.paths.length === 1) {
	      geojson.type = 'LineString';
	      geojson.coordinates = arcgis.paths[0].slice(0);
	    } else {
	      geojson.type = 'MultiLineString';
	      geojson.coordinates = arcgis.paths.slice(0);
	    }
	  }
	
	  if (arcgis.rings) {
	    geojson = convertRingsToGeoJSON(arcgis.rings.slice(0));
	  }
	
	  if (arcgis.geometry || arcgis.attributes) {
	    geojson.type = 'Feature';
	    geojson.geometry = arcgis.geometry ? arcgisToGeojson(arcgis.geometry) : null;
	    geojson.properties = arcgis.attributes ? shallowClone(arcgis.attributes) : null;
	    if (arcgis.attributes) {
	      geojson.id = arcgis.attributes[idAttribute] || arcgis.attributes.OBJECTID || arcgis.attributes.FID;
	    }
	  }
	
	  return geojson;
	}
	
	// GeoJSON -> ArcGIS
	
	function geojsonToArcGIS(geojson, idAttribute) {
	  idAttribute = idAttribute || 'OBJECTID';
	  var spatialReference = { wkid: 4326 };
	  var result = {};
	  var i;
	
	  switch (geojson.type) {
	    case 'Point':
	      result.x = geojson.coordinates[0];
	      result.y = geojson.coordinates[1];
	      result.spatialReference = spatialReference;
	      break;
	    case 'MultiPoint':
	      result.points = geojson.coordinates.slice(0);
	      result.spatialReference = spatialReference;
	      break;
	    case 'LineString':
	      result.paths = [geojson.coordinates.slice(0)];
	      result.spatialReference = spatialReference;
	      break;
	    case 'MultiLineString':
	      result.paths = geojson.coordinates.slice(0);
	      result.spatialReference = spatialReference;
	      break;
	    case 'Polygon':
	      result.rings = orientRings(geojson.coordinates.slice(0));
	      result.spatialReference = spatialReference;
	      break;
	    case 'MultiPolygon':
	      result.rings = flattenMultiPolygonRings(geojson.coordinates.slice(0));
	      result.spatialReference = spatialReference;
	      break;
	    case 'Feature':
	      if (geojson.geometry) {
	        result.geometry = geojsonToArcGIS(geojson.geometry, idAttribute);
	      }
	      result.attributes = geojson.properties ? shallowClone(geojson.properties) : {};
	      if (geojson.id) {
	        result.attributes[idAttribute] = geojson.id;
	      }
	      break;
	    case 'FeatureCollection':
	      result = [];
	      for (i = 0; i < geojson.features.length; i++) {
	        result.push(geojsonToArcGIS(geojson.features[i], idAttribute));
	      }
	      break;
	    case 'GeometryCollection':
	      result = [];
	      for (i = 0; i < geojson.geometries.length; i++) {
	        result.push(geojsonToArcGIS(geojson.geometries[i], idAttribute));
	      }
	      break;
	  }
	
	  return result;
	}
	
	function responseToFeatureCollection(response, idAttribute) {
	  var objectIdField;
	
	  if (idAttribute) {
	    objectIdField = idAttribute;
	  } else if (response.objectIdFieldName) {
	    objectIdField = response.objectIdFieldName;
	  } else if (response.fields) {
	    for (var j = 0; j <= response.fields.length - 1; j++) {
	      if (response.fields[j].type === 'esriFieldTypeOID') {
	        objectIdField = response.fields[j].name;
	        break;
	      }
	    }
	  } else {
	    objectIdField = 'OBJECTID';
	  }
	
	  var featureCollection = {
	    type: 'FeatureCollection',
	    features: []
	  };
	  var features = response.features || response.results;
	  if (features.length) {
	    for (var i = features.length - 1; i >= 0; i--) {
	      featureCollection.features.push(arcgisToGeojson(features[i], objectIdField));
	    }
	  }
	
	  return featureCollection;
	}
	
	// trim url whitespace and add a trailing slash if needed
	
	function cleanUrl(url) {
	  // trim leading and trailing spaces, but not spaces inside the url
	  url = _leaflet2.default.Util.trim(url);
	
	  // add a trailing slash to the url if the user omitted it
	  if (url[url.length - 1] !== '/') {
	    url += '/';
	  }
	
	  return url;
	}
	
	function isArcgisOnline(url) {
	  /* hosted feature services can emit geojson natively.
	  our check for 'geojson' support will need to be revisted
	  once the functionality makes its way to ArcGIS Server*/
	  return /\.arcgis\.com.*?FeatureServer/g.test(url);
	}
	
	function geojsonTypeToArcGIS(geoJsonType) {
	  var arcgisGeometryType;
	  switch (geoJsonType) {
	    case 'Point':
	      arcgisGeometryType = 'esriGeometryPoint';
	      break;
	    case 'MultiPoint':
	      arcgisGeometryType = 'esriGeometryMultipoint';
	      break;
	    case 'LineString':
	      arcgisGeometryType = 'esriGeometryPolyline';
	      break;
	    case 'MultiLineString':
	      arcgisGeometryType = 'esriGeometryPolyline';
	      break;
	    case 'Polygon':
	      arcgisGeometryType = 'esriGeometryPolygon';
	      break;
	    case 'MultiPolygon':
	      arcgisGeometryType = 'esriGeometryPolygon';
	      break;
	  }
	
	  return arcgisGeometryType;
	}
	
	function warn() {
	  if (console && console.warn) {
	    console.warn.apply(console, arguments);
	  }
	}
	
	var Util = {
	  shallowClone: shallowClone,
	  warn: warn,
	  cleanUrl: cleanUrl,
	  isArcgisOnline: isArcgisOnline,
	  geojsonTypeToArcGIS: geojsonTypeToArcGIS,
	  responseToFeatureCollection: responseToFeatureCollection,
	  geojsonToArcGIS: geojsonToArcGIS,
	  arcgisToGeojson: arcgisToGeojson,
	  boundsToExtent: boundsToExtent,
	  extentToBounds: extentToBounds
	};
	
	exports.Util = Util;
	exports.default = Util;

/***/ },
/* 5 */
/*!***************************************!*\
  !*** ./~/esri-leaflet/src/Request.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.request = request;
	exports.jsonp = jsonp;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _Support = __webpack_require__(/*! ./Support */ 3);
	
	var _Support2 = _interopRequireDefault(_Support);
	
	var _Util = __webpack_require__(/*! ./Util */ 4);
	
	var callbacks = 0;
	
	function serialize(params) {
	  var data = '';
	
	  params.f = params.f || 'json';
	
	  for (var key in params) {
	    if (params.hasOwnProperty(key)) {
	      var param = params[key];
	      var type = Object.prototype.toString.call(param);
	      var value;
	
	      if (data.length) {
	        data += '&';
	      }
	
	      if (type === '[object Array]') {
	        value = Object.prototype.toString.call(param[0]) === '[object Object]' ? JSON.stringify(param) : param.join(',');
	      } else if (type === '[object Object]') {
	        value = JSON.stringify(param);
	      } else if (type === '[object Date]') {
	        value = param.valueOf();
	      } else {
	        value = param;
	      }
	
	      data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
	    }
	  }
	
	  return data;
	}
	
	function createRequest(callback, context) {
	  var httpRequest = new window.XMLHttpRequest();
	
	  httpRequest.onerror = function (e) {
	    httpRequest.onreadystatechange = _leaflet2.default.Util.falseFn;
	
	    callback.call(context, {
	      error: {
	        code: 500,
	        message: 'XMLHttpRequest error'
	      }
	    }, null);
	  };
	
	  httpRequest.onreadystatechange = function () {
	    var response;
	    var error;
	
	    if (httpRequest.readyState === 4) {
	      try {
	        response = JSON.parse(httpRequest.responseText);
	      } catch (e) {
	        response = null;
	        error = {
	          code: 500,
	          message: 'Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error.'
	        };
	      }
	
	      if (!error && response.error) {
	        error = response.error;
	        response = null;
	      }
	
	      httpRequest.onerror = _leaflet2.default.Util.falseFn;
	
	      callback.call(context, error, response);
	    }
	  };
	
	  return httpRequest;
	}
	
	function xmlHttpPost(url, params, callback, context) {
	  var httpRequest = createRequest(callback, context);
	  httpRequest.open('POST', url);
	  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	  httpRequest.send(serialize(params));
	
	  return httpRequest;
	}
	
	function xmlHttpGet(url, params, callback, context) {
	  var httpRequest = createRequest(callback, context);
	
	  httpRequest.open('GET', url + '?' + serialize(params), true);
	  httpRequest.send(null);
	
	  return httpRequest;
	}
	
	// AJAX handlers for CORS (modern browsers) or JSONP (older browsers)
	
	function request(url, params, callback, context) {
	  var paramString = serialize(params);
	  var httpRequest = createRequest(callback, context);
	  var requestLength = (url + '?' + paramString).length;
	
	  // request is less then 2000 characters and the browser supports CORS, make GET request with XMLHttpRequest
	  if (requestLength <= 2000 && _Support2.default.cors) {
	    httpRequest.open('GET', url + '?' + paramString);
	    httpRequest.send(null);
	
	    // request is less more then 2000 characters and the browser supports CORS, make POST request with XMLHttpRequest
	  } else if (requestLength > 2000 && _Support2.default.cors) {
	      httpRequest.open('POST', url);
	      httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	      httpRequest.send(paramString);
	
	      // request is less more then 2000 characters and the browser does not support CORS, make a JSONP request
	    } else if (requestLength <= 2000 && !_Support2.default.cors) {
	        return jsonp(url, params, callback, context);
	
	        // request is longer then 2000 characters and the browser does not support CORS, log a warning
	      } else {
	          _Util.warn('a request to ' + url + ' was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy http://esri.github.io/esri-leaflet/api-reference/request.html');
	          return;
	        }
	
	  return httpRequest;
	}
	
	function jsonp(url, params, callback, context) {
	  window._EsriLeafletCallbacks = window._EsriLeafletCallbacks || {};
	  var callbackId = 'c' + callbacks;
	
	  params.callback = 'window._EsriLeafletCallbacks.' + callbackId;
	
	  var script = _leaflet2.default.DomUtil.create('script', null, document.body);
	  script.type = 'text/javascript';
	  script.src = url + '?' + serialize(params);
	  script.id = callbackId;
	
	  window._EsriLeafletCallbacks[callbackId] = function (response) {
	    if (window._EsriLeafletCallbacks[callbackId] !== true) {
	      var error;
	      var responseType = Object.prototype.toString.call(response);
	
	      if (!(responseType === '[object Object]' || responseType === '[object Array]')) {
	        error = {
	          error: {
	            code: 500,
	            message: 'Expected array or object as JSONP response'
	          }
	        };
	        response = null;
	      }
	
	      if (!error && response.error) {
	        error = response;
	        response = null;
	      }
	
	      callback.call(context, error, response);
	      window._EsriLeafletCallbacks[callbackId] = true;
	    }
	  };
	
	  callbacks++;
	
	  return {
	    id: callbackId,
	    url: script.src,
	    abort: function () {
	      window._EsriLeafletCallbacks._callback[callbackId]({
	        code: 0,
	        message: 'Request aborted.'
	      });
	    }
	  };
	}
	
	var get = _Support2.default.cors ? xmlHttpGet : jsonp;
	get.CORS = xmlHttpGet;
	get.JSONP = jsonp;
	
	// choose the correct AJAX handler depending on CORS support
	exports.get = get;
	
	// always use XMLHttpRequest for posts
	exports.post = xmlHttpPost;
	
	// export the Request object to call the different handlers for debugging
	var Request = {
	  request: request,
	  get: get,
	  post: xmlHttpPost
	};
	
	exports.Request = Request;
	exports.default = Request;

/***/ },
/* 6 */
/*!******************************************!*\
  !*** ./~/esri-leaflet/src/Tasks/Task.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.task = task;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _Support = __webpack_require__(/*! ../Support */ 3);
	
	var _Util = __webpack_require__(/*! ../Util */ 4);
	
	var _Request = __webpack_require__(/*! ../Request */ 5);
	
	var _Request2 = _interopRequireDefault(_Request);
	
	var Task = _leaflet2.default.Class.extend({
	
	  options: {
	    proxy: false,
	    useCors: _Support.cors
	  },
	
	  // Generate a method for each methodName:paramName in the setters for this task.
	  generateSetter: function (param, context) {
	    return _leaflet2.default.Util.bind(function (value) {
	      this.params[param] = value;
	      return this;
	    }, context);
	  },
	
	  initialize: function (endpoint) {
	    // endpoint can be either a url (and options) for an ArcGIS Rest Service or an instance of EsriLeaflet.Service
	    if (endpoint.request && endpoint.options) {
	      this._service = endpoint;
	      _leaflet2.default.Util.setOptions(this, endpoint.options);
	    } else {
	      _leaflet2.default.Util.setOptions(this, endpoint);
	      this.options.url = _Util.cleanUrl(endpoint.url);
	    }
	
	    // clone default params into this object
	    this.params = _leaflet2.default.Util.extend({}, this.params || {});
	
	    // generate setter methods based on the setters object implimented a child class
	    if (this.setters) {
	      for (var setter in this.setters) {
	        var param = this.setters[setter];
	        this[setter] = this.generateSetter(param, this);
	      }
	    }
	  },
	
	  token: function (token) {
	    if (this._service) {
	      this._service.authenticate(token);
	    } else {
	      this.params.token = token;
	    }
	    return this;
	  },
	
	  request: function (callback, context) {
	    if (this._service) {
	      return this._service.request(this.path, this.params, callback, context);
	    }
	
	    return this._request('request', this.path, this.params, callback, context);
	  },
	
	  _request: function (method, path, params, callback, context) {
	    var url = this.options.proxy ? this.options.proxy + '?' + this.options.url + path : this.options.url + path;
	
	    if ((method === 'get' || method === 'request') && !this.options.useCors) {
	      return _Request2.default.get.JSONP(url, params, callback, context);
	    }
	
	    return _Request2.default[method](url, params, callback, context);
	  }
	});
	
	exports.Task = Task;
	
	function task(options) {
	  return new Task(options);
	}
	
	exports.default = task;

/***/ },
/* 7 */
/*!*******************************************!*\
  !*** ./~/esri-leaflet/src/Tasks/Query.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.query = query;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _Task = __webpack_require__(/*! ./Task */ 6);
	
	var _Util = __webpack_require__(/*! ../Util */ 4);
	
	var _Util2 = _interopRequireDefault(_Util);
	
	var Query = _Task.Task.extend({
	  setters: {
	    'offset': 'offset',
	    'limit': 'limit',
	    'fields': 'outFields',
	    'precision': 'geometryPrecision',
	    'featureIds': 'objectIds',
	    'returnGeometry': 'returnGeometry',
	    'token': 'token'
	  },
	
	  path: 'query',
	
	  params: {
	    returnGeometry: true,
	    where: '1=1',
	    outSr: 4326,
	    outFields: '*'
	  },
	
	  within: function (geometry) {
	    this._setGeometry(geometry);
	    this.params.spatialRel = 'esriSpatialRelContains'; // will make code read layer within geometry, to the api this will reads geometry contains layer
	    return this;
	  },
	
	  intersects: function (geometry) {
	    this._setGeometry(geometry);
	    this.params.spatialRel = 'esriSpatialRelIntersects';
	    return this;
	  },
	
	  contains: function (geometry) {
	    this._setGeometry(geometry);
	    this.params.spatialRel = 'esriSpatialRelWithin'; // will make code read layer contains geometry, to the api this will reads geometry within layer
	    return this;
	  },
	
	  crosses: function (geometry) {
	    this._setGeometry(geometry);
	    this.params.spatialRel = 'esriSpatialRelCrosses';
	    return this;
	  },
	
	  touches: function (geometry) {
	    this._setGeometry(geometry);
	    this.params.spatialRel = 'esriSpatialRelTouches';
	    return this;
	  },
	
	  overlaps: function (geometry) {
	    this._setGeometry(geometry);
	    this.params.spatialRel = 'esriSpatialRelOverlaps';
	    return this;
	  },
	
	  // only valid for Feature Services running on ArcGIS Server 10.3 or ArcGIS Online
	  nearby: function (latlng, radius) {
	    latlng = _leaflet2.default.latLng(latlng);
	    this.params.geometry = [latlng.lng, latlng.lat];
	    this.params.geometryType = 'esriGeometryPoint';
	    this.params.spatialRel = 'esriSpatialRelIntersects';
	    this.params.units = 'esriSRUnit_Meter';
	    this.params.distance = radius;
	    this.params.inSr = 4326;
	    return this;
	  },
	
	  where: function (string) {
	    // instead of converting double-quotes to single quotes, pass as is, and provide a more informative message if a 400 is encountered
	    this.params.where = string;
	    return this;
	  },
	
	  between: function (start, end) {
	    this.params.time = [start.valueOf(), end.valueOf()];
	    return this;
	  },
	
	  simplify: function (map, factor) {
	    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
	    this.params.maxAllowableOffset = mapWidth / map.getSize().y * factor;
	    return this;
	  },
	
	  orderBy: function (fieldName, order) {
	    order = order || 'ASC';
	    this.params.orderByFields = this.params.orderByFields ? this.params.orderByFields + ',' : '';
	    this.params.orderByFields += [fieldName, order].join(' ');
	    return this;
	  },
	
	  run: function (callback, context) {
	    this._cleanParams();
	
	    // if the service is hosted on arcgis online request geojson directly
	    if (_Util2.default.isArcgisOnline(this.options.url)) {
	      this.params.f = 'geojson';
	
	      return this.request(function (error, response) {
	        this._trapSQLerrors(error);
	        callback.call(context, error, response, response);
	      }, this);
	
	      // otherwise convert it in the callback then pass it on
	    } else {
	        return this.request(function (error, response) {
	          this._trapSQLerrors(error);
	          callback.call(context, error, response && _Util2.default.responseToFeatureCollection(response), response);
	        }, this);
	      }
	  },
	
	  count: function (callback, context) {
	    this._cleanParams();
	    this.params.returnCountOnly = true;
	    return this.request(function (error, response) {
	      callback.call(this, error, response && response.count, response);
	    }, context);
	  },
	
	  ids: function (callback, context) {
	    this._cleanParams();
	    this.params.returnIdsOnly = true;
	    return this.request(function (error, response) {
	      callback.call(this, error, response && response.objectIds, response);
	    }, context);
	  },
	
	  // only valid for Feature Services running on ArcGIS Server 10.3 or ArcGIS Online
	  bounds: function (callback, context) {
	    this._cleanParams();
	    this.params.returnExtentOnly = true;
	    return this.request(function (error, response) {
	      callback.call(context, error, response && response.extent && _Util2.default.extentToBounds(response.extent), response);
	    }, context);
	  },
	
	  // only valid for image services
	  pixelSize: function (point) {
	    point = _leaflet2.default.point(point);
	    this.params.pixelSize = [point.x, point.y];
	    return this;
	  },
	
	  // only valid for map services
	  layer: function (layer) {
	    this.path = layer + '/query';
	    return this;
	  },
	
	  _trapSQLerrors: function (error) {
	    if (error) {
	      if (error.code === '400') {
	        _Util2.default.warn('one common syntax error in query requests is encasing string values in double quotes instead of single quotes');
	      }
	    }
	  },
	
	  _cleanParams: function () {
	    delete this.params.returnIdsOnly;
	    delete this.params.returnExtentOnly;
	    delete this.params.returnCountOnly;
	  },
	
	  _setGeometry: function (geometry) {
	    this.params.inSr = 4326;
	
	    // convert bounds to extent and finish
	    if (geometry instanceof _leaflet2.default.LatLngBounds) {
	      // set geometry + geometryType
	      this.params.geometry = _Util2.default.boundsToExtent(geometry);
	      this.params.geometryType = 'esriGeometryEnvelope';
	      return;
	    }
	
	    // convert L.Marker > L.LatLng
	    if (geometry.getLatLng) {
	      geometry = geometry.getLatLng();
	    }
	
	    // convert L.LatLng to a geojson point and continue;
	    if (geometry instanceof _leaflet2.default.LatLng) {
	      geometry = {
	        type: 'Point',
	        coordinates: [geometry.lng, geometry.lat]
	      };
	    }
	
	    // handle L.GeoJSON, pull out the first geometry
	    if (geometry instanceof _leaflet2.default.GeoJSON) {
	      // reassign geometry to the GeoJSON value  (we are assuming that only one feature is present)
	      geometry = geometry.getLayers()[0].feature.geometry;
	      this.params.geometry = _Util2.default.geojsonToArcGIS(geometry);
	      this.params.geometryType = _Util2.default.geojsonTypeToArcGIS(geometry.type);
	    }
	
	    // Handle L.Polyline and L.Polygon
	    if (geometry.toGeoJSON) {
	      geometry = geometry.toGeoJSON();
	    }
	
	    // handle GeoJSON feature by pulling out the geometry
	    if (geometry.type === 'Feature') {
	      // get the geometry of the geojson feature
	      geometry = geometry.geometry;
	    }
	
	    // confirm that our GeoJSON is a point, line or polygon
	    if (geometry.type === 'Point' || geometry.type === 'LineString' || geometry.type === 'Polygon') {
	      this.params.geometry = _Util2.default.geojsonToArcGIS(geometry);
	      this.params.geometryType = _Util2.default.geojsonTypeToArcGIS(geometry.type);
	      return;
	    }
	
	    // warn the user if we havn't found a
	    /* global console */
	    _Util2.default.warn('invalid geometry passed to spatial query. Should be an L.LatLng, L.LatLngBounds or L.Marker or a GeoJSON Point Line or Polygon object');
	
	    return;
	  }
	});
	
	exports.Query = Query;
	
	function query(options) {
	  return new Query(options);
	}
	
	exports.default = query;

/***/ },
/* 8 */
/*!******************************************!*\
  !*** ./~/esri-leaflet/src/Tasks/Find.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.find = find;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Task = __webpack_require__(/*! ./Task */ 6);
	
	var _Util = __webpack_require__(/*! ../Util */ 4);
	
	var _Util2 = _interopRequireDefault(_Util);
	
	var Find = _Task.Task.extend({
	  setters: {
	    // method name > param name
	    'contains': 'contains',
	    'text': 'searchText',
	    'fields': 'searchFields', // denote an array or single string
	    'spatialReference': 'sr',
	    'sr': 'sr',
	    'layers': 'layers',
	    'returnGeometry': 'returnGeometry',
	    'maxAllowableOffset': 'maxAllowableOffset',
	    'precision': 'geometryPrecision',
	    'dynamicLayers': 'dynamicLayers',
	    'returnZ': 'returnZ',
	    'returnM': 'returnM',
	    'gdbVersion': 'gdbVersion',
	    'token': 'token'
	  },
	
	  path: 'find',
	
	  params: {
	    sr: 4326,
	    contains: true,
	    returnGeometry: true,
	    returnZ: true,
	    returnM: false
	  },
	
	  layerDefs: function (id, where) {
	    this.params.layerDefs = this.params.layerDefs ? this.params.layerDefs + ';' : '';
	    this.params.layerDefs += [id, where].join(':');
	    return this;
	  },
	
	  simplify: function (map, factor) {
	    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
	    this.params.maxAllowableOffset = mapWidth / map.getSize().y * factor;
	    return this;
	  },
	
	  run: function (callback, context) {
	    return this.request(function (error, response) {
	      callback.call(context, error, response && _Util2.default.responseToFeatureCollection(response), response);
	    }, context);
	  }
	});
	
	exports.Find = Find;
	
	function find(options) {
	  return new Find(options);
	}
	
	exports.default = find;

/***/ },
/* 9 */
/*!**********************************************!*\
  !*** ./~/esri-leaflet/src/Tasks/Identify.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.identify = identify;
	
	var _Task = __webpack_require__(/*! ./Task */ 6);
	
	var Identify = _Task.Task.extend({
	  path: 'identify',
	
	  between: function (start, end) {
	    this.params.time = [start.valueOf(), end.valueOf()];
	    return this;
	  }
	});
	
	exports.Identify = Identify;
	
	function identify(options) {
	  return new Identify(options);
	}
	
	exports.default = identify;

/***/ },
/* 10 */
/*!******************************************************!*\
  !*** ./~/esri-leaflet/src/Tasks/IdentifyFeatures.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.identifyFeatures = identifyFeatures;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _Identify = __webpack_require__(/*! ./Identify */ 9);
	
	var _Util = __webpack_require__(/*! ../Util */ 4);
	
	var _Util2 = _interopRequireDefault(_Util);
	
	var IdentifyFeatures = _Identify.Identify.extend({
	  setters: {
	    'layers': 'layers',
	    'precision': 'geometryPrecision',
	    'tolerance': 'tolerance',
	    'returnGeometry': 'returnGeometry'
	  },
	
	  params: {
	    sr: 4326,
	    layers: 'all',
	    tolerance: 3,
	    returnGeometry: true
	  },
	
	  on: function (map) {
	    var extent = _Util2.default.boundsToExtent(map.getBounds());
	    var size = map.getSize();
	    this.params.imageDisplay = [size.x, size.y, 96];
	    this.params.mapExtent = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
	    return this;
	  },
	
	  at: function (latlng) {
	    latlng = _leaflet2.default.latLng(latlng);
	    this.params.geometry = [latlng.lng, latlng.lat];
	    this.params.geometryType = 'esriGeometryPoint';
	    return this;
	  },
	
	  layerDef: function (id, where) {
	    this.params.layerDefs = this.params.layerDefs ? this.params.layerDefs + ';' : '';
	    this.params.layerDefs += [id, where].join(':');
	    return this;
	  },
	
	  simplify: function (map, factor) {
	    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
	    this.params.maxAllowableOffset = mapWidth / map.getSize().y * (1 - factor);
	    return this;
	  },
	
	  run: function (callback, context) {
	    return this.request(function (error, response) {
	      // immediately invoke with an error
	      if (error) {
	        callback.call(context, error, undefined, response);
	        return;
	
	        // ok no error lets just assume we have features...
	      } else {
	          var featureCollection = _Util2.default.responseToFeatureCollection(response);
	          response.results = response.results.reverse();
	          for (var i = 0; i < featureCollection.features.length; i++) {
	            var feature = featureCollection.features[i];
	            feature.layerId = response.results[i].layerId;
	          }
	          callback.call(context, undefined, featureCollection, response);
	        }
	    });
	  }
	});
	
	exports.IdentifyFeatures = IdentifyFeatures;
	
	function identifyFeatures(options) {
	  return new IdentifyFeatures(options);
	}
	
	exports.default = identifyFeatures;

/***/ },
/* 11 */
/*!***************************************************!*\
  !*** ./~/esri-leaflet/src/Tasks/IdentifyImage.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.identifyImage = identifyImage;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _Identify = __webpack_require__(/*! ./Identify */ 9);
	
	var _Util = __webpack_require__(/*! ../Util */ 4);
	
	var _Util2 = _interopRequireDefault(_Util);
	
	var IdentifyImage = _Identify.Identify.extend({
	  setters: {
	    'setMosaicRule': 'mosaicRule',
	    'setRenderingRule': 'renderingRule',
	    'setPixelSize': 'pixelSize',
	    'returnCatalogItems': 'returnCatalogItems',
	    'returnGeometry': 'returnGeometry'
	  },
	
	  params: {
	    returnGeometry: false
	  },
	
	  at: function (latlng) {
	    latlng = _leaflet2.default.latLng(latlng);
	    this.params.geometry = JSON.stringify({
	      x: latlng.lng,
	      y: latlng.lat,
	      spatialReference: {
	        wkid: 4326
	      }
	    });
	    this.params.geometryType = 'esriGeometryPoint';
	    return this;
	  },
	
	  getMosaicRule: function () {
	    return this.params.mosaicRule;
	  },
	
	  getRenderingRule: function () {
	    return this.params.renderingRule;
	  },
	
	  getPixelSize: function () {
	    return this.params.pixelSize;
	  },
	
	  run: function (callback, context) {
	    return this.request(function (error, response) {
	      callback.call(context, error, response && this._responseToGeoJSON(response), response);
	    }, this);
	  },
	
	  // get pixel data and return as geoJSON point
	  // populate catalog items (if any)
	  // merging in any catalogItemVisibilities as a propery of each feature
	  _responseToGeoJSON: function (response) {
	    var location = response.location;
	    var catalogItems = response.catalogItems;
	    var catalogItemVisibilities = response.catalogItemVisibilities;
	    var geoJSON = {
	      'pixel': {
	        'type': 'Feature',
	        'geometry': {
	          'type': 'Point',
	          'coordinates': [location.x, location.y]
	        },
	        'crs': {
	          'type': 'EPSG',
	          'properties': {
	            'code': location.spatialReference.wkid
	          }
	        },
	        'properties': {
	          'OBJECTID': response.objectId,
	          'name': response.name,
	          'value': response.value
	        },
	        'id': response.objectId
	      }
	    };
	
	    if (response.properties && response.properties.Values) {
	      geoJSON.pixel.properties.values = response.properties.Values;
	    }
	
	    if (catalogItems && catalogItems.features) {
	      geoJSON.catalogItems = _Util2.default.responseToFeatureCollection(catalogItems);
	      if (catalogItemVisibilities && catalogItemVisibilities.length === geoJSON.catalogItems.features.length) {
	        for (var i = catalogItemVisibilities.length - 1; i >= 0; i--) {
	          geoJSON.catalogItems.features[i].properties.catalogItemVisibility = catalogItemVisibilities[i];
	        }
	      }
	    }
	    return geoJSON;
	  }
	
	});
	
	exports.IdentifyImage = IdentifyImage;
	
	function identifyImage(params) {
	  return new IdentifyImage(params);
	}
	
	exports.default = identifyImage;

/***/ },
/* 12 */
/*!************************************************!*\
  !*** ./~/esri-leaflet/src/Services/Service.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.service = service;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _Support = __webpack_require__(/*! ../Support */ 3);
	
	var _Util = __webpack_require__(/*! ../Util */ 4);
	
	var _Request = __webpack_require__(/*! ../Request */ 5);
	
	var _Request2 = _interopRequireDefault(_Request);
	
	var Service = _leaflet2.default.Evented.extend({
	
	  options: {
	    proxy: false,
	    useCors: _Support.cors
	  },
	
	  initialize: function (options) {
	    options = options || {};
	    this._requestQueue = [];
	    this._authenticating = false;
	    _leaflet2.default.Util.setOptions(this, options);
	    this.options.url = _Util.cleanUrl(this.options.url);
	  },
	
	  get: function (path, params, callback, context) {
	    return this._request('get', path, params, callback, context);
	  },
	
	  post: function (path, params, callback, context) {
	    return this._request('post', path, params, callback, context);
	  },
	
	  request: function (path, params, callback, context) {
	    return this._request('request', path, params, callback, context);
	  },
	
	  metadata: function (callback, context) {
	    return this._request('get', '', {}, callback, context);
	  },
	
	  authenticate: function (token) {
	    this._authenticating = false;
	    this.options.token = token;
	    this._runQueue();
	    return this;
	  },
	
	  _request: function (method, path, params, callback, context) {
	    this.fire('requeststart', {
	      url: this.options.url + path,
	      params: params,
	      method: method
	    }, true);
	
	    var wrappedCallback = this._createServiceCallback(method, path, params, callback, context);
	
	    if (this.options.token) {
	      params.token = this.options.token;
	    }
	
	    if (this._authenticating) {
	      this._requestQueue.push([method, path, params, callback, context]);
	      return;
	    } else {
	      var url = this.options.proxy ? this.options.proxy + '?' + this.options.url + path : this.options.url + path;
	
	      if ((method === 'get' || method === 'request') && !this.options.useCors) {
	        return _Request2.default.get.JSONP(url, params, wrappedCallback);
	      } else {
	        return _Request2.default[method](url, params, wrappedCallback);
	      }
	    }
	  },
	
	  _createServiceCallback: function (method, path, params, callback, context) {
	    return _leaflet2.default.Util.bind(function (error, response) {
	      if (error && (error.code === 499 || error.code === 498)) {
	        this._authenticating = true;
	
	        this._requestQueue.push([method, path, params, callback, context]);
	
	        // fire an event for users to handle and re-authenticate
	        this.fire('authenticationrequired', {
	          authenticate: _leaflet2.default.Util.bind(this.authenticate, this)
	        }, true);
	
	        // if the user has access to a callback they can handle the auth error
	        error.authenticate = _leaflet2.default.Util.bind(this.authenticate, this);
	      }
	
	      callback.call(context, error, response);
	
	      if (error) {
	        this.fire('requesterror', {
	          url: this.options.url + path,
	          params: params,
	          message: error.message,
	          code: error.code,
	          method: method
	        }, true);
	      } else {
	        this.fire('requestsuccess', {
	          url: this.options.url + path,
	          params: params,
	          response: response,
	          method: method
	        }, true);
	      }
	
	      this.fire('requestend', {
	        url: this.options.url + path,
	        params: params,
	        method: method
	      }, true);
	    }, this);
	  },
	
	  _runQueue: function () {
	    for (var i = this._requestQueue.length - 1; i >= 0; i--) {
	      var request = this._requestQueue[i];
	      var method = request.shift();
	      this[method].apply(this, request);
	    }
	    this._requestQueue = [];
	  }
	});
	
	exports.Service = Service;
	
	function service(options) {
	  return new Service(options);
	}
	
	exports.default = service;

/***/ },
/* 13 */
/*!***************************************************!*\
  !*** ./~/esri-leaflet/src/Services/MapService.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.mapService = mapService;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Service = __webpack_require__(/*! ./Service */ 12);
	
	var _TasksIdentifyFeatures = __webpack_require__(/*! ../Tasks/IdentifyFeatures */ 10);
	
	var _TasksIdentifyFeatures2 = _interopRequireDefault(_TasksIdentifyFeatures);
	
	var _TasksQuery = __webpack_require__(/*! ../Tasks/Query */ 7);
	
	var _TasksQuery2 = _interopRequireDefault(_TasksQuery);
	
	var _TasksFind = __webpack_require__(/*! ../Tasks/Find */ 8);
	
	var _TasksFind2 = _interopRequireDefault(_TasksFind);
	
	var MapService = _Service.Service.extend({
	
	  identify: function () {
	    return _TasksIdentifyFeatures2.default(this);
	  },
	
	  find: function () {
	    return _TasksFind2.default(this);
	  },
	
	  query: function () {
	    return _TasksQuery2.default(this);
	  }
	
	});
	
	exports.MapService = MapService;
	
	function mapService(options) {
	  return new MapService(options);
	}
	
	exports.default = mapService;

/***/ },
/* 14 */
/*!*****************************************************!*\
  !*** ./~/esri-leaflet/src/Services/ImageService.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.imageService = imageService;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Service = __webpack_require__(/*! ./Service */ 12);
	
	var _TasksIdentifyImage = __webpack_require__(/*! ../Tasks/IdentifyImage */ 11);
	
	var _TasksIdentifyImage2 = _interopRequireDefault(_TasksIdentifyImage);
	
	var _TasksQuery = __webpack_require__(/*! ../Tasks/Query */ 7);
	
	var _TasksQuery2 = _interopRequireDefault(_TasksQuery);
	
	var ImageService = _Service.Service.extend({
	
	  query: function () {
	    return _TasksQuery2.default(this);
	  },
	
	  identify: function () {
	    return _TasksIdentifyImage2.default(this);
	  }
	});
	
	exports.ImageService = ImageService;
	
	function imageService(options) {
	  return new ImageService(options);
	}
	
	exports.default = imageService;

/***/ },
/* 15 */
/*!************************************************************!*\
  !*** ./~/esri-leaflet/src/Services/FeatureLayerService.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.featureLayerService = featureLayerService;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Service = __webpack_require__(/*! ./Service */ 12);
	
	var _TasksQuery = __webpack_require__(/*! ../Tasks/Query */ 7);
	
	var _TasksQuery2 = _interopRequireDefault(_TasksQuery);
	
	var _Util = __webpack_require__(/*! ../Util */ 4);
	
	var FeatureLayerService = _Service.Service.extend({
	
	  options: {
	    idAttribute: 'OBJECTID'
	  },
	
	  query: function () {
	    return _TasksQuery2.default(this);
	  },
	
	  addFeature: function (feature, callback, context) {
	    delete feature.id;
	
	    feature = _Util.geojsonToArcGIS(feature);
	
	    return this.post('addFeatures', {
	      features: [feature]
	    }, function (error, response) {
	      var result = response && response.addResults ? response.addResults[0] : undefined;
	      if (callback) {
	        callback.call(context, error || response.addResults[0].error, result);
	      }
	    }, context);
	  },
	
	  updateFeature: function (feature, callback, context) {
	    feature = _Util.geojsonToArcGIS(feature, this.options.idAttribute);
	
	    return this.post('updateFeatures', {
	      features: [feature]
	    }, function (error, response) {
	      var result = response && response.updateResults ? response.updateResults[0] : undefined;
	      if (callback) {
	        callback.call(context, error || response.updateResults[0].error, result);
	      }
	    }, context);
	  },
	
	  deleteFeature: function (id, callback, context) {
	    return this.post('deleteFeatures', {
	      objectIds: id
	    }, function (error, response) {
	      var result = response && response.deleteResults ? response.deleteResults[0] : undefined;
	      if (callback) {
	        callback.call(context, error || response.deleteResults[0].error, result);
	      }
	    }, context);
	  },
	
	  deleteFeatures: function (ids, callback, context) {
	    return this.post('deleteFeatures', {
	      objectIds: ids
	    }, function (error, response) {
	      // pass back the entire array
	      var result = response && response.deleteResults ? response.deleteResults : undefined;
	      if (callback) {
	        callback.call(context, error || response.deleteResults[0].error, result);
	      }
	    }, context);
	  }
	});
	
	exports.FeatureLayerService = FeatureLayerService;
	
	function featureLayerService(options) {
	  return new FeatureLayerService(options);
	}
	
	exports.default = featureLayerService;

/***/ },
/* 16 */
/*!***************************************************!*\
  !*** ./~/esri-leaflet/src/Layers/BasemapLayer.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.basemapLayer = basemapLayer;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _ControlsLogo = __webpack_require__(/*! ../Controls/Logo */ 17);
	
	var _ControlsLogo2 = _interopRequireDefault(_ControlsLogo);
	
	var _Request = __webpack_require__(/*! ../Request */ 5);
	
	var _Support = __webpack_require__(/*! ../Support */ 3);
	
	var tileProtocol = window.location.protocol !== 'https:' ? 'http:' : 'https:';
	
	var BasemapLayer = _leaflet2.default.TileLayer.extend({
	  statics: {
	    TILES: {
	      Streets: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
	        attributionUrl: 'https://static.arcgis.com/attribution/World_Street_Map',
	        options: {
	          hideLogo: false,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 19,
	          subdomains: ['server', 'services'],
	          attribution: 'Esri'
	        }
	      },
	      Topographic: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
	        attributionUrl: 'https://static.arcgis.com/attribution/World_Topo_Map',
	        options: {
	          hideLogo: false,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 19,
	          subdomains: ['server', 'services'],
	          attribution: 'Esri'
	        }
	      },
	      Oceans: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
	        attributionUrl: 'https://static.arcgis.com/attribution/Ocean_Basemap',
	        options: {
	          hideLogo: false,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 16,
	          subdomains: ['server', 'services'],
	          attribution: 'Esri'
	        }
	      },
	      OceansLabels: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: true,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 16,
	          subdomains: ['server', 'services'],
	          pane: _Support.pointerEvents ? 'esri-labels' : 'tilePane'
	        }
	      },
	      NationalGeographic: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: false,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 16,
	          subdomains: ['server', 'services'],
	          attribution: 'Esri'
	        }
	      },
	      DarkGray: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: false,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 16,
	          subdomains: ['server', 'services'],
	          attribution: 'Esri, DeLorme, HERE'
	        }
	      },
	      DarkGrayLabels: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: true,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 16,
	          subdomains: ['server', 'services'],
	          pane: _Support.pointerEvents ? 'esri-labels' : 'tilePane'
	        }
	      },
	      Gray: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: false,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 16,
	          subdomains: ['server', 'services'],
	          attribution: 'Esri, NAVTEQ, DeLorme'
	        }
	      },
	      GrayLabels: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: true,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 16,
	          subdomains: ['server', 'services'],
	          pane: _Support.pointerEvents ? 'esri-labels' : 'tilePane'
	        }
	      },
	      Imagery: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: false,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 19,
	          subdomains: ['server', 'services'],
	          attribution: 'Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
	        }
	      },
	      ImageryLabels: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: true,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 19,
	          subdomains: ['server', 'services'],
	          pane: _Support.pointerEvents ? 'esri-labels' : 'tilePane'
	        }
	      },
	      ImageryTransportation: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: true,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 19,
	          subdomains: ['server', 'services'],
	          pane: _Support.pointerEvents ? 'esri-labels' : 'tilePane'
	        }
	      },
	      ShadedRelief: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: false,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 13,
	          subdomains: ['server', 'services'],
	          attribution: 'Esri, NAVTEQ, DeLorme'
	        }
	      },
	      ShadedReliefLabels: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: true,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 12,
	          subdomains: ['server', 'services'],
	          pane: _Support.pointerEvents ? 'esri-labels' : 'tilePane'
	        }
	      },
	      Terrain: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: false,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 13,
	          subdomains: ['server', 'services'],
	          attribution: 'Esri, USGS, NOAA'
	        }
	      },
	      TerrainLabels: {
	        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}',
	        options: {
	          hideLogo: true,
	          logoPosition: 'bottomright',
	          minZoom: 1,
	          maxZoom: 13,
	          subdomains: ['server', 'services'],
	          pane: _Support.pointerEvents ? 'esri-labels' : 'tilePane'
	        }
	      }
	    }
	  },
	  initialize: function (key, options) {
	    var config;
	
	    // set the config variable with the appropriate config object
	    if (typeof key === 'object' && key.urlTemplate && key.options) {
	      config = key;
	    } else if (typeof key === 'string' && BasemapLayer.TILES[key]) {
	      config = BasemapLayer.TILES[key];
	    } else {
	      throw new Error('L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ShadedRelief", "ShadedReliefLabels", "Terrain" or "TerrainLabels"');
	    }
	
	    // merge passed options into the config options
	    var tileOptions = _leaflet2.default.Util.extend(config.options, options);
	
	    // call the initialize method on L.TileLayer to set everything up
	    _leaflet2.default.TileLayer.prototype.initialize.call(this, config.urlTemplate, _leaflet2.default.Util.setOptions(this, tileOptions));
	
	    // if this basemap requires dynamic attribution set it up
	    if (config.attributionUrl) {
	      this._getAttributionData(config.attributionUrl);
	    }
	
	    this._logo = _ControlsLogo2.default({
	      position: this.options.logoPosition
	    });
	  },
	  onAdd: function (map) {
	    if (!this.options.hideLogo && !map._hasEsriLogo) {
	      this._logo.addTo(map);
	      map._hasEsriLogo = true;
	    }
	
	    if (this.options.pane === 'esri-labels') {
	      this._initPane();
	    }
	
	    _leaflet2.default.TileLayer.prototype.onAdd.call(this, map);
	
	    map.on('moveend', this._updateMapAttribution, this);
	  },
	  onRemove: function (map) {
	    // check to make sure the logo hasn't already been removed
	    if (this._logo && this._logo._container) {
	      map.removeControl(this._logo);
	      map._hasEsriLogo = false;
	    }
	
	    _leaflet2.default.TileLayer.prototype.onRemove.call(this, map);
	
	    map.off('moveend', this._updateMapAttribution, this);
	  },
	  getAttribution: function () {
	    var attribution = '<span class="esri-attributions" style="line-height:14px; vertical-align: -3px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; display:inline-block;">' + this.options.attribution + '</span>';
	    return attribution;
	  },
	  _initPane: function () {
	    if (!this._map.getPane(this.options.pane)) {
	      var pane = this._map.createPane(this.options.pane);
	      pane.style.pointerEvents = 'none';
	      pane.style.zIndex = 500;
	    }
	  },
	  _getAttributionData: function (url) {
	    _Request.jsonp(url, {}, _leaflet2.default.Util.bind(function (error, attributions) {
	      if (error) {
	        return;
	      }
	      this._attributions = [];
	
	      for (var c = 0; c < attributions.contributors.length; c++) {
	        var contributor = attributions.contributors[c];
	        for (var i = 0; i < contributor.coverageAreas.length; i++) {
	          var coverageArea = contributor.coverageAreas[i];
	          var southWest = _leaflet2.default.latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
	          var northEast = _leaflet2.default.latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
	          this._attributions.push({
	            attribution: contributor.attribution,
	            score: coverageArea.score,
	            bounds: _leaflet2.default.latLngBounds(southWest, northEast),
	            minZoom: coverageArea.zoomMin,
	            maxZoom: coverageArea.zoomMax
	          });
	        }
	      }
	
	      this._attributions.sort(function (a, b) {
	        return b.score - a.score;
	      });
	
	      this._updateMapAttribution();
	    }, this));
	  },
	  _updateMapAttribution: function () {
	    if (this._map && this._map.attributionControl && this._attributions) {
	      var newAttributions = '';
	      var bounds = this._map.getBounds();
	      var zoom = this._map.getZoom();
	
	      for (var i = 0; i < this._attributions.length; i++) {
	        var attribution = this._attributions[i];
	        var text = attribution.attribution;
	        if (!newAttributions.match(text) && bounds.intersects(attribution.bounds) && zoom >= attribution.minZoom && zoom <= attribution.maxZoom) {
	          newAttributions += ', ' + text;
	        }
	      }
	      newAttributions = newAttributions.substr(2);
	      var attributionElement = this._map.attributionControl._container.querySelector('.esri-attributions');
	
	      attributionElement.innerHTML = newAttributions;
	      attributionElement.style.maxWidth = this._map.getSize().x * 0.65 + 'px';
	
	      this.fire('attributionupdated', {
	        attribution: newAttributions
	      });
	    }
	  }
	});
	
	exports.BasemapLayer = BasemapLayer;
	
	function basemapLayer(key, options) {
	  return new BasemapLayer(key, options);
	}
	
	exports.default = basemapLayer;

/***/ },
/* 17 */
/*!*********************************************!*\
  !*** ./~/esri-leaflet/src/Controls/Logo.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.default = logo;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var Logo = _leaflet2.default.Control.extend({
	  options: {
	    position: 'bottomright',
	    marginTop: 0,
	    marginLeft: 0,
	    marginBottom: 0,
	    marginRight: 0
	  },
	
	  onAdd: function () {
	    var div = _leaflet2.default.DomUtil.create('div', 'esri-leaflet-logo');
	    div.style.marginTop = this.options.marginTop;
	    div.style.marginLeft = this.options.marginLeft;
	    div.style.marginBottom = this.options.marginBottom;
	    div.style.marginRight = this.options.marginRight;
	    div.innerHTML = this._adjustLogo(this._map._size);
	
	    this._map.on('resize', function (e) {
	      div.innerHTML = this._adjustLogo(e.newSize);
	    }, this);
	
	    return div;
	  },
	
	  _adjustLogo: function (mapSize) {
	    if (mapSize.x <= 600 || mapSize.y <= 600) {
	      return '<a href="https://developers.arcgis.com" style="border: none;"><img src="https://js.arcgis.com/3.13/esri/images/map/logo-sm.png" alt="Powered by Esri" style="border: none;"></a>';
	    } else {
	      return '<a href="https://developers.arcgis.com" style="border: none;"><img src="https://js.arcgis.com/3.13/esri/images/map/logo-med.png" alt="Powered by Esri" style="border: none;"></a>';
	    }
	  }
	});
	
	exports.Logo = Logo;
	
	function logo(options) {
	  return new Logo(options);
	}

/***/ },
/* 18 */
/*!****************************************************!*\
  !*** ./~/esri-leaflet/src/Layers/TiledMapLayer.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.tiledMapLayer = tiledMapLayer;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _Util = __webpack_require__(/*! ../Util */ 4);
	
	var _ServicesMapService = __webpack_require__(/*! ../Services/MapService */ 13);
	
	var _ServicesMapService2 = _interopRequireDefault(_ServicesMapService);
	
	var TiledMapLayer = _leaflet2.default.TileLayer.extend({
	  options: {
	    zoomOffsetAllowance: 0.1,
	    correctZoomLevels: true
	  },
	
	  statics: {
	    MercatorZoomLevels: {
	      '0': 156543.03392799999,
	      '1': 78271.516963999893,
	      '2': 39135.758482000099,
	      '3': 19567.879240999901,
	      '4': 9783.9396204999593,
	      '5': 4891.9698102499797,
	      '6': 2445.9849051249898,
	      '7': 1222.9924525624899,
	      '8': 611.49622628138002,
	      '9': 305.74811314055802,
	      '10': 152.874056570411,
	      '11': 76.437028285073197,
	      '12': 38.218514142536598,
	      '13': 19.109257071268299,
	      '14': 9.5546285356341496,
	      '15': 4.7773142679493699,
	      '16': 2.38865713397468,
	      '17': 1.1943285668550501,
	      '18': 0.59716428355981699,
	      '19': 0.29858214164761698,
	      '20': 0.14929107082381,
	      '21': 0.07464553541191,
	      '22': 0.0373227677059525,
	      '23': 0.0186613838529763
	    }
	  },
	
	  initialize: function (options) {
	    options.url = _Util.cleanUrl(options.url);
	    options = _leaflet2.default.Util.setOptions(this, options);
	
	    // set the urls
	    this.tileUrl = options.url + 'tile/{z}/{y}/{x}';
	    this.service = _ServicesMapService2.default(options);
	    this.service.addEventParent(this);
	
	    // if this is looking at the AGO tiles subdomain insert the subdomain placeholder
	    if (this.tileUrl.match('://tiles.arcgisonline.com')) {
	      this.tileUrl = this.tileUrl.replace('://tiles.arcgisonline.com', '://tiles{s}.arcgisonline.com');
	      options.subdomains = ['1', '2', '3', '4'];
	    }
	
	    if (this.options.token) {
	      this.tileUrl += '?token=' + this.options.token;
	    }
	
	    // init layer by calling TileLayers initialize method
	    _leaflet2.default.TileLayer.prototype.initialize.call(this, this.tileUrl, options);
	  },
	
	  getTileUrl: function (tilePoint) {
	    return _leaflet2.default.Util.template(this.tileUrl, _leaflet2.default.extend({
	      s: this._getSubdomain(tilePoint),
	      z: this._lodMap[tilePoint.z] || tilePoint.z, // try lod map first, then just defualt to zoom level
	      x: tilePoint.x,
	      y: tilePoint.y
	    }, this.options));
	  },
	
	  onAdd: function (map) {
	    if (!this._lodMap && this.options.correctZoomLevels) {
	      this._lodMap = {}; // make sure we always have an lod map even if its empty
	      this.metadata(function (error, metadata) {
	        if (!error) {
	          var sr = metadata.spatialReference.latestWkid || metadata.spatialReference.wkid;
	
	          if (sr === 102100 || sr === 3857) {
	            // create the zoom level data
	            var arcgisLODs = metadata.tileInfo.lods;
	            var correctResolutions = TiledMapLayer.MercatorZoomLevels;
	
	            for (var i = 0; i < arcgisLODs.length; i++) {
	              var arcgisLOD = arcgisLODs[i];
	              for (var ci in correctResolutions) {
	                var correctRes = correctResolutions[ci];
	
	                if (this._withinPercentage(arcgisLOD.resolution, correctRes, this.options.zoomOffsetAllowance)) {
	                  this._lodMap[ci] = arcgisLOD.level;
	                  break;
	                }
	              }
	            }
	          } else {
	            _Util.warn('L.esri.TiledMapLayer is using a non-mercator spatial reference. Support may be available through Proj4Leaflet http://esri.github.io/esri-leaflet/examples/non-mercator-projection.html');
	          }
	        }
	
	        _leaflet2.default.TileLayer.prototype.onAdd.call(this, map);
	      }, this);
	    } else {
	      _leaflet2.default.TileLayer.prototype.onAdd.call(this, map);
	    }
	  },
	
	  metadata: function (callback, context) {
	    this.service.metadata(callback, context);
	    return this;
	  },
	
	  identify: function () {
	    return this.service.identify();
	  },
	
	  find: function () {
	    return this.service.find();
	  },
	
	  query: function () {
	    return this.service.query();
	  },
	
	  authenticate: function (token) {
	    var tokenQs = '?token=' + token;
	    this.tileUrl = this.options.token ? this.tileUrl.replace(/\?token=(.+)/g, tokenQs) : this.tileUrl + tokenQs;
	    this.options.token = token;
	    this.service.authenticate(token);
	    return this;
	  },
	
	  _withinPercentage: function (a, b, percentage) {
	    var diff = Math.abs(a / b - 1);
	    return diff < percentage;
	  }
	});
	
	exports.TiledMapLayer = TiledMapLayer;
	
	function tiledMapLayer(url, options) {
	  return new TiledMapLayer(url, options);
	}
	
	exports.default = tiledMapLayer;

/***/ },
/* 19 */
/*!**************************************************!*\
  !*** ./~/esri-leaflet/src/Layers/RasterLayer.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _Support = __webpack_require__(/*! ../Support */ 3);
	
	var RasterLayer = _leaflet2.default.Layer.extend({
	
	  options: {
	    opacity: 1,
	    position: 'front',
	    f: 'image',
	    useCors: _Support.cors,
	    attribution: null,
	    interactive: false,
	    alt: ''
	  },
	
	  onAdd: function (map) {
	    this._update = _leaflet2.default.Util.throttle(this._update, this.options.updateInterval, this);
	
	    if (map.options.crs && map.options.crs.code) {
	      var sr = map.options.crs.code.split(':')[1];
	      this.options.bboxSR = sr;
	      this.options.imageSR = sr;
	    }
	
	    map.on('moveend', this._update, this);
	
	    // if we had an image loaded and it matches the
	    // current bounds show the image otherwise remove it
	    if (this._currentImage && this._currentImage._bounds.equals(this._map.getBounds())) {
	      map.addLayer(this._currentImage);
	    } else if (this._currentImage) {
	      this._map.removeLayer(this._currentImage);
	      this._currentImage = null;
	    }
	
	    this._update();
	
	    if (this._popup) {
	      this._map.on('click', this._getPopupData, this);
	      this._map.on('dblclick', this._resetPopupState, this);
	    }
	  },
	
	  onRemove: function (map) {
	    if (this._currentImage) {
	      this._map.removeLayer(this._currentImage);
	    }
	
	    if (this._popup) {
	      this._map.off('click', this._getPopupData, this);
	      this._map.off('dblclick', this._resetPopupState, this);
	    }
	
	    this._map.off('moveend', this._update, this);
	  },
	
	  getEvents: function () {
	    return {
	      moveend: this._update
	    };
	  },
	
	  bindPopup: function (fn, popupOptions) {
	    this._shouldRenderPopup = false;
	    this._lastClick = false;
	    this._popup = _leaflet2.default.popup(popupOptions);
	    this._popupFunction = fn;
	    if (this._map) {
	      this._map.on('click', this._getPopupData, this);
	      this._map.on('dblclick', this._resetPopupState, this);
	    }
	    return this;
	  },
	
	  unbindPopup: function () {
	    if (this._map) {
	      this._map.closePopup(this._popup);
	      this._map.off('click', this._getPopupData, this);
	      this._map.off('dblclick', this._resetPopupState, this);
	    }
	    this._popup = false;
	    return this;
	  },
	
	  bringToFront: function () {
	    this.options.position = 'front';
	    if (this._currentImage) {
	      this._currentImage.bringToFront();
	    }
	    return this;
	  },
	
	  bringToBack: function () {
	    this.options.position = 'back';
	    if (this._currentImage) {
	      this._currentImage.bringToBack();
	    }
	    return this;
	  },
	
	  getAttribution: function () {
	    return this.options.attribution;
	  },
	
	  getOpacity: function () {
	    return this.options.opacity;
	  },
	
	  setOpacity: function (opacity) {
	    this.options.opacity = opacity;
	    this._currentImage.setOpacity(opacity);
	    return this;
	  },
	
	  getTimeRange: function () {
	    return [this.options.from, this.options.to];
	  },
	
	  setTimeRange: function (from, to) {
	    this.options.from = from;
	    this.options.to = to;
	    this._update();
	    return this;
	  },
	
	  metadata: function (callback, context) {
	    this.service.metadata(callback, context);
	    return this;
	  },
	
	  authenticate: function (token) {
	    this.service.authenticate(token);
	    return this;
	  },
	
	  _renderImage: function (url, bounds) {
	    if (this._map) {
	      // create a new image overlay and add it to the map
	      // to start loading the image
	      // opacity is 0 while the image is loading
	      var image = _leaflet2.default.imageOverlay(url, bounds, {
	        opacity: 0,
	        crossOrigin: this.options.useCors,
	        alt: this.options.alt,
	        pane: this.options.pane || this.getPane(),
	        interactive: this.options.interactive
	      }).addTo(this._map);
	
	      // once the image loads
	      image.once('load', function (e) {
	        if (this._map) {
	          var newImage = e.target;
	          var oldImage = this._currentImage;
	
	          // if the bounds of this image matches the bounds that
	          // _renderImage was called with and we have a map with the same bounds
	          // hide the old image if there is one and set the opacity
	          // of the new image otherwise remove the new image
	          if (newImage._bounds.equals(bounds) && newImage._bounds.equals(this._map.getBounds())) {
	            this._currentImage = newImage;
	
	            if (this.options.position === 'front') {
	              this.bringToFront();
	            } else {
	              this.bringToBack();
	            }
	
	            if (this._map && this._currentImage._map) {
	              this._currentImage.setOpacity(this.options.opacity);
	            } else {
	              this._currentImage._map.removeLayer(this._currentImage);
	            }
	
	            if (oldImage && this._map) {
	              this._map.removeLayer(oldImage);
	            }
	
	            if (oldImage && oldImage._map) {
	              oldImage._map.removeLayer(oldImage);
	            }
	          } else {
	            this._map.removeLayer(newImage);
	          }
	        }
	
	        this.fire('load', {
	          bounds: bounds
	        });
	      }, this);
	
	      this.fire('loading', {
	        bounds: bounds
	      });
	    }
	  },
	
	  _update: function () {
	    if (!this._map) {
	      return;
	    }
	
	    var zoom = this._map.getZoom();
	    var bounds = this._map.getBounds();
	
	    if (this._animatingZoom) {
	      return;
	    }
	
	    if (this._map._panTransition && this._map._panTransition._inProgress) {
	      return;
	    }
	
	    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
	      return;
	    }
	    var params = this._buildExportParams();
	
	    this._requestExport(params, bounds);
	  },
	
	  _renderPopup: function (latlng, error, results, response) {
	    latlng = _leaflet2.default.latLng(latlng);
	    if (this._shouldRenderPopup && this._lastClick.equals(latlng)) {
	      // add the popup to the map where the mouse was clicked at
	      var content = this._popupFunction(error, results, response);
	      if (content) {
	        this._popup.setLatLng(latlng).setContent(content).openOn(this._map);
	      }
	    }
	  },
	
	  _resetPopupState: function (e) {
	    this._shouldRenderPopup = false;
	    this._lastClick = e.latlng;
	  }
	});
	exports.RasterLayer = RasterLayer;

/***/ },
/* 20 */
/*!****************************************************!*\
  !*** ./~/esri-leaflet/src/Layers/ImageMapLayer.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.imageMapLayer = imageMapLayer;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _RasterLayer = __webpack_require__(/*! ./RasterLayer */ 19);
	
	var _Util = __webpack_require__(/*! ../Util */ 4);
	
	var _ServicesImageService = __webpack_require__(/*! ../Services/ImageService */ 14);
	
	var _ServicesImageService2 = _interopRequireDefault(_ServicesImageService);
	
	var ImageMapLayer = _RasterLayer.RasterLayer.extend({
	
	  options: {
	    updateInterval: 150,
	    format: 'jpgpng',
	    transparent: true,
	    f: 'json'
	  },
	
	  query: function () {
	    return this.service.query();
	  },
	
	  identify: function () {
	    return this.service.identify();
	  },
	
	  initialize: function (options) {
	    options.url = _Util.cleanUrl(options.url);
	    this.service = _ServicesImageService2.default(options);
	    this.service.addEventParent(this);
	
	    _leaflet2.default.Util.setOptions(this, options);
	  },
	
	  setPixelType: function (pixelType) {
	    this.options.pixelType = pixelType;
	    this._update();
	    return this;
	  },
	
	  getPixelType: function () {
	    return this.options.pixelType;
	  },
	
	  setBandIds: function (bandIds) {
	    if (_leaflet2.default.Util.isArray(bandIds)) {
	      this.options.bandIds = bandIds.join(',');
	    } else {
	      this.options.bandIds = bandIds.toString();
	    }
	    this._update();
	    return this;
	  },
	
	  getBandIds: function () {
	    return this.options.bandIds;
	  },
	
	  setNoData: function (noData, noDataInterpretation) {
	    if (_leaflet2.default.Util.isArray(noData)) {
	      this.options.noData = noData.join(',');
	    } else {
	      this.options.noData = noData.toString();
	    }
	    if (noDataInterpretation) {
	      this.options.noDataInterpretation = noDataInterpretation;
	    }
	    this._update();
	    return this;
	  },
	
	  getNoData: function () {
	    return this.options.noData;
	  },
	
	  getNoDataInterpretation: function () {
	    return this.options.noDataInterpretation;
	  },
	
	  setRenderingRule: function (renderingRule) {
	    this.options.renderingRule = renderingRule;
	    this._update();
	  },
	
	  getRenderingRule: function () {
	    return this.options.renderingRule;
	  },
	
	  setMosaicRule: function (mosaicRule) {
	    this.options.mosaicRule = mosaicRule;
	    this._update();
	  },
	
	  getMosaicRule: function () {
	    return this.options.mosaicRule;
	  },
	
	  _getPopupData: function (e) {
	    var callback = _leaflet2.default.Util.bind(function (error, results, response) {
	      if (error) {
	        return;
	      } // we really can't do anything here but authenticate or requesterror will fire
	      setTimeout(_leaflet2.default.Util.bind(function () {
	        this._renderPopup(e.latlng, error, results, response);
	      }, this), 300);
	    }, this);
	
	    var identifyRequest = this.identify().at(e.latlng);
	
	    // set mosaic rule for identify task if it is set for layer
	    if (this.options.mosaicRule) {
	      identifyRequest.setMosaicRule(this.options.mosaicRule);
	      // @TODO: force return catalog items too?
	    }
	
	    // @TODO: set rendering rule? Not sure,
	    // sometimes you want raw pixel values
	    // if (this.options.renderingRule) {
	    //   identifyRequest.setRenderingRule(this.options.renderingRule);
	    // }
	
	    identifyRequest.run(callback);
	
	    // set the flags to show the popup
	    this._shouldRenderPopup = true;
	    this._lastClick = e.latlng;
	  },
	
	  _buildExportParams: function () {
	    var bounds = this._map.getBounds();
	    var size = this._map.getSize();
	    var ne = this._map.options.crs.project(bounds._northEast);
	    var sw = this._map.options.crs.project(bounds._southWest);
	
	    var params = {
	      bbox: [sw.x, sw.y, ne.x, ne.y].join(','),
	      size: size.x + ',' + size.y,
	      format: this.options.format,
	      transparent: this.options.transparent,
	      bboxSR: this.options.bboxSR,
	      imageSR: this.options.imageSR
	    };
	
	    if (this.options.from && this.options.to) {
	      params.time = this.options.from.valueOf() + ',' + this.options.to.valueOf();
	    }
	
	    if (this.options.pixelType) {
	      params.pixelType = this.options.pixelType;
	    }
	
	    if (this.options.interpolation) {
	      params.interpolation = this.options.interpolation;
	    }
	
	    if (this.options.compressionQuality) {
	      params.compressionQuality = this.options.compressionQuality;
	    }
	
	    if (this.options.bandIds) {
	      params.bandIds = this.options.bandIds;
	    }
	
	    if (this.options.noData) {
	      params.noData = this.options.noData;
	    }
	
	    if (this.options.noDataInterpretation) {
	      params.noDataInterpretation = this.options.noDataInterpretation;
	    }
	
	    if (this.service.options.token) {
	      params.token = this.service.options.token;
	    }
	
	    if (this.options.renderingRule) {
	      params.renderingRule = JSON.stringify(this.options.renderingRule);
	    }
	
	    if (this.options.mosaicRule) {
	      params.mosaicRule = JSON.stringify(this.options.mosaicRule);
	    }
	
	    return params;
	  },
	
	  _requestExport: function (params, bounds) {
	    if (this.options.f === 'json') {
	      this.service.get('exportImage', params, function (error, response) {
	        if (error) {
	          return;
	        } // we really can't do anything here but authenticate or requesterror will fire
	        this._renderImage(response.href, bounds);
	      }, this);
	    } else {
	      params.f = 'image';
	      this._renderImage(this.options.url + 'exportImage' + _leaflet2.default.Util.getParamString(params), bounds);
	    }
	  }
	});
	
	exports.ImageMapLayer = ImageMapLayer;
	
	function imageMapLayer(url, options) {
	  return new ImageMapLayer(url, options);
	}
	
	exports.default = imageMapLayer;

/***/ },
/* 21 */
/*!******************************************************!*\
  !*** ./~/esri-leaflet/src/Layers/DynamicMapLayer.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.dynamicMapLayer = dynamicMapLayer;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _RasterLayer = __webpack_require__(/*! ./RasterLayer */ 19);
	
	var _Util = __webpack_require__(/*! ../Util */ 4);
	
	var _ServicesMapService = __webpack_require__(/*! ../Services/MapService */ 13);
	
	var _ServicesMapService2 = _interopRequireDefault(_ServicesMapService);
	
	var DynamicMapLayer = _RasterLayer.RasterLayer.extend({
	
	  options: {
	    updateInterval: 150,
	    layers: false,
	    layerDefs: false,
	    timeOptions: false,
	    format: 'png24',
	    transparent: true,
	    f: 'json'
	  },
	
	  initialize: function (options) {
	    options.url = _Util.cleanUrl(options.url);
	    this.service = _ServicesMapService2.default(options);
	    this.service.addEventParent(this);
	
	    if ((options.proxy || options.token) && options.f !== 'json') {
	      options.f = 'json';
	    }
	    _leaflet2.default.Util.setOptions(this, options);
	  },
	
	  getDynamicLayers: function () {
	    return this.options.dynamicLayers;
	  },
	
	  setDynamicLayers: function (dynamicLayers) {
	    this.options.dynamicLayers = dynamicLayers;
	    this._update();
	    return this;
	  },
	
	  getLayers: function () {
	    return this.options.layers;
	  },
	
	  setLayers: function (layers) {
	    this.options.layers = layers;
	    this._update();
	    return this;
	  },
	
	  getLayerDefs: function () {
	    return this.options.layerDefs;
	  },
	
	  setLayerDefs: function (layerDefs) {
	    this.options.layerDefs = layerDefs;
	    this._update();
	    return this;
	  },
	
	  getTimeOptions: function () {
	    return this.options.timeOptions;
	  },
	
	  setTimeOptions: function (timeOptions) {
	    this.options.timeOptions = timeOptions;
	    this._update();
	    return this;
	  },
	
	  query: function () {
	    return this.service.query();
	  },
	
	  identify: function () {
	    return this.service.identify();
	  },
	
	  find: function () {
	    return this.service.find();
	  },
	
	  _getPopupData: function (e) {
	    var callback = _leaflet2.default.Util.bind(function (error, featureCollection, response) {
	      if (error) {
	        return;
	      } // we really can't do anything here but authenticate or requesterror will fire
	      setTimeout(_leaflet2.default.Util.bind(function () {
	        this._renderPopup(e.latlng, error, featureCollection, response);
	      }, this), 300);
	    }, this);
	
	    var identifyRequest = this.identify().on(this._map).at(e.latlng);
	
	    if (this.options.layers) {
	      identifyRequest.layers('visible:' + this.options.layers.join(','));
	    } else {
	      identifyRequest.layers('visible');
	    }
	
	    identifyRequest.run(callback);
	
	    // set the flags to show the popup
	    this._shouldRenderPopup = true;
	    this._lastClick = e.latlng;
	  },
	
	  _buildExportParams: function () {
	    var bounds = this._map.getBounds();
	    var size = this._map.getSize();
	    var ne = this._map.options.crs.project(bounds._northEast);
	    var sw = this._map.options.crs.project(bounds._southWest);
	
	    // ensure that we don't ask ArcGIS Server for a taller image than we have actual map displaying
	    var top = this._map.latLngToLayerPoint(bounds._northEast);
	    var bottom = this._map.latLngToLayerPoint(bounds._southWest);
	
	    if (top.y > 0 || bottom.y < size.y) {
	      size.y = bottom.y - top.y;
	    }
	
	    var params = {
	      bbox: [sw.x, sw.y, ne.x, ne.y].join(','),
	      size: size.x + ',' + size.y,
	      dpi: 96,
	      format: this.options.format,
	      transparent: this.options.transparent,
	      bboxSR: this.options.bboxSR,
	      imageSR: this.options.imageSR
	    };
	
	    if (this.options.dynamicLayers) {
	      params.dynamicLayers = this.options.dynamicLayers;
	    }
	
	    if (this.options.layers) {
	      params.layers = 'show:' + this.options.layers.join(',');
	    }
	
	    if (this.options.layerDefs) {
	      params.layerDefs = JSON.stringify(this.options.layerDefs);
	    }
	
	    if (this.options.timeOptions) {
	      params.timeOptions = JSON.stringify(this.options.timeOptions);
	    }
	
	    if (this.options.from && this.options.to) {
	      params.time = this.options.from.valueOf() + ',' + this.options.to.valueOf();
	    }
	
	    if (this.service.options.token) {
	      params.token = this.service.options.token;
	    }
	
	    return params;
	  },
	
	  _requestExport: function (params, bounds) {
	    if (this.options.f === 'json') {
	      this.service.get('export', params, function (error, response) {
	        if (error) {
	          return;
	        } // we really can't do anything here but authenticate or requesterror will fire
	        this._renderImage(response.href, bounds);
	      }, this);
	    } else {
	      params.f = 'image';
	      this._renderImage(this.options.url + 'export' + _leaflet2.default.Util.getParamString(params), bounds);
	    }
	  }
	});
	
	exports.DynamicMapLayer = DynamicMapLayer;
	
	function dynamicMapLayer(url, options) {
	  return new DynamicMapLayer(url, options);
	}
	
	exports.default = dynamicMapLayer;

/***/ },
/* 22 */
/*!***************************************************************!*\
  !*** ./~/esri-leaflet/src/Layers/FeatureLayer/FeatureGrid.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var FeatureGrid = _leaflet2.default.Layer.extend({
	
	  options: {
	    cellSize: 512,
	    updateInterval: 150
	  },
	
	  initialize: function (options) {
	    options = _leaflet2.default.setOptions(this, options);
	    this._zooming = false;
	  },
	
	  onAdd: function (map) {
	    this._map = map;
	    this._update = _leaflet2.default.Util.throttle(this._update, this.options.updateInterval, this);
	    this._reset();
	    this._update();
	  },
	
	  onRemove: function () {
	    this._map.removeEventListener(this.getEvents(), this);
	    this._removeCells();
	  },
	
	  getEvents: function () {
	    var events = {
	      moveend: this._update,
	      zoomstart: this._zoomstart,
	      zoomend: this._reset
	    };
	
	    return events;
	  },
	
	  addTo: function (map) {
	    map.addLayer(this);
	    return this;
	  },
	
	  removeFrom: function (map) {
	    map.removeLayer(this);
	    return this;
	  },
	
	  _zoomstart: function () {
	    this._zooming = true;
	  },
	
	  _reset: function () {
	    this._removeCells();
	
	    this._cells = {};
	    this._activeCells = {};
	    this._cellsToLoad = 0;
	    this._cellsTotal = 0;
	    this._cellNumBounds = this._getCellNumBounds();
	
	    this._resetWrap();
	    this._zooming = false;
	  },
	
	  _resetWrap: function () {
	    var map = this._map;
	    var crs = map.options.crs;
	
	    if (crs.infinite) {
	      return;
	    }
	
	    var cellSize = this._getCellSize();
	
	    if (crs.wrapLng) {
	      this._wrapLng = [Math.floor(map.project([0, crs.wrapLng[0]]).x / cellSize), Math.ceil(map.project([0, crs.wrapLng[1]]).x / cellSize)];
	    }
	
	    if (crs.wrapLat) {
	      this._wrapLat = [Math.floor(map.project([crs.wrapLat[0], 0]).y / cellSize), Math.ceil(map.project([crs.wrapLat[1], 0]).y / cellSize)];
	    }
	  },
	
	  _getCellSize: function () {
	    return this.options.cellSize;
	  },
	
	  _update: function () {
	    if (!this._map) {
	      return;
	    }
	
	    var bounds = this._map.getPixelBounds();
	    var zoom = this._map.getZoom();
	    var cellSize = this._getCellSize();
	
	    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
	      return;
	    }
	
	    // cell coordinates range for the current view
	    var cellBounds = _leaflet2.default.bounds(bounds.min.divideBy(cellSize).floor(), bounds.max.divideBy(cellSize).floor());
	
	    this._removeOtherCells(cellBounds);
	    this._addCells(cellBounds);
	  },
	
	  _addCells: function (bounds) {
	    var queue = [];
	    var center = bounds.getCenter();
	    var zoom = this._map.getZoom();
	
	    var j, i, coords;
	    // create a queue of coordinates to load cells from
	    for (j = bounds.min.y; j <= bounds.max.y; j++) {
	      for (i = bounds.min.x; i <= bounds.max.x; i++) {
	        coords = _leaflet2.default.point(i, j);
	        coords.z = zoom;
	
	        if (this._isValidCell(coords)) {
	          queue.push(coords);
	        }
	      }
	    }
	
	    var cellsToLoad = queue.length;
	
	    if (cellsToLoad === 0) {
	      return;
	    }
	
	    this._cellsToLoad += cellsToLoad;
	    this._cellsTotal += cellsToLoad;
	
	    // sort cell queue to load cells in order of their distance to center
	    queue.sort(function (a, b) {
	      return a.distanceTo(center) - b.distanceTo(center);
	    });
	
	    for (i = 0; i < cellsToLoad; i++) {
	      this._addCell(queue[i]);
	    }
	  },
	
	  _isValidCell: function (coords) {
	    var crs = this._map.options.crs;
	
	    if (!crs.infinite) {
	      // don't load cell if it's out of bounds and not wrapped
	      var bounds = this._cellNumBounds;
	      if (!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x) || !crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y)) {
	        return false;
	      }
	    }
	
	    if (!this.options.bounds) {
	      return true;
	    }
	
	    // don't load cell if it doesn't intersect the bounds in options
	    var cellBounds = this._cellCoordsToBounds(coords);
	    return _leaflet2.default.latLngBounds(this.options.bounds).intersects(cellBounds);
	  },
	
	  // converts cell coordinates to its geographical bounds
	  _cellCoordsToBounds: function (coords) {
	    var map = this._map;
	    var cellSize = this.options.cellSize;
	    var nwPoint = coords.multiplyBy(cellSize);
	    var sePoint = nwPoint.add([cellSize, cellSize]);
	    var nw = map.wrapLatLng(map.unproject(nwPoint, coords.z));
	    var se = map.wrapLatLng(map.unproject(sePoint, coords.z));
	
	    return _leaflet2.default.latLngBounds(nw, se);
	  },
	
	  // converts cell coordinates to key for the cell cache
	  _cellCoordsToKey: function (coords) {
	    return coords.x + ':' + coords.y;
	  },
	
	  // converts cell cache key to coordiantes
	  _keyToCellCoords: function (key) {
	    var kArr = key.split(':');
	    var x = parseInt(kArr[0], 10);
	    var y = parseInt(kArr[1], 10);
	
	    return _leaflet2.default.point(x, y);
	  },
	
	  // remove any present cells that are off the specified bounds
	  _removeOtherCells: function (bounds) {
	    for (var key in this._cells) {
	      if (!bounds.contains(this._keyToCellCoords(key))) {
	        this._removeCell(key);
	      }
	    }
	  },
	
	  _removeCell: function (key) {
	    var cell = this._activeCells[key];
	
	    if (cell) {
	      delete this._activeCells[key];
	
	      if (this.cellLeave) {
	        this.cellLeave(cell.bounds, cell.coords);
	      }
	
	      this.fire('cellleave', {
	        bounds: cell.bounds,
	        coords: cell.coords
	      });
	    }
	  },
	
	  _removeCells: function () {
	    for (var key in this._cells) {
	      var bounds = this._cells[key].bounds;
	      var coords = this._cells[key].coords;
	
	      if (this.cellLeave) {
	        this.cellLeave(bounds, coords);
	      }
	
	      this.fire('cellleave', {
	        bounds: bounds,
	        coords: coords
	      });
	    }
	  },
	
	  _addCell: function (coords) {
	    // wrap cell coords if necessary (depending on CRS)
	    this._wrapCoords(coords);
	
	    // generate the cell key
	    var key = this._cellCoordsToKey(coords);
	
	    // get the cell from the cache
	    var cell = this._cells[key];
	    // if this cell should be shown as isnt active yet (enter)
	
	    if (cell && !this._activeCells[key]) {
	      if (this.cellEnter) {
	        this.cellEnter(cell.bounds, coords);
	      }
	
	      this.fire('cellenter', {
	        bounds: cell.bounds,
	        coords: coords
	      });
	
	      this._activeCells[key] = cell;
	    }
	
	    // if we dont have this cell in the cache yet (create)
	    if (!cell) {
	      cell = {
	        coords: coords,
	        bounds: this._cellCoordsToBounds(coords)
	      };
	
	      this._cells[key] = cell;
	      this._activeCells[key] = cell;
	
	      if (this.createCell) {
	        this.createCell(cell.bounds, coords);
	      }
	
	      this.fire('cellcreate', {
	        bounds: cell.bounds,
	        coords: coords
	      });
	    }
	  },
	
	  _wrapCoords: function (coords) {
	    coords.x = this._wrapLng ? _leaflet2.default.Util.wrapNum(coords.x, this._wrapLng) : coords.x;
	    coords.y = this._wrapLat ? _leaflet2.default.Util.wrapNum(coords.y, this._wrapLat) : coords.y;
	  },
	
	  // get the global cell coordinates range for the current zoom
	  _getCellNumBounds: function () {
	    var bounds = this._map.getPixelWorldBounds();
	    var size = this._getCellSize();
	
	    return bounds ? _leaflet2.default.bounds(bounds.min.divideBy(size).floor(), bounds.max.divideBy(size).ceil().subtract([1, 1])) : null;
	  }
	});
	exports.FeatureGrid = FeatureGrid;

/***/ },
/* 23 */
/*!******************************************************************!*\
  !*** ./~/esri-leaflet/src/Layers/FeatureLayer/FeatureManager.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _FeatureGrid = __webpack_require__(/*! ./FeatureGrid */ 22);
	
	var _ServicesFeatureLayerService = __webpack_require__(/*! ../../Services/FeatureLayerService */ 15);
	
	var _ServicesFeatureLayerService2 = _interopRequireDefault(_ServicesFeatureLayerService);
	
	var _Util = __webpack_require__(/*! ../../Util */ 4);
	
	var FeatureManager = _FeatureGrid.FeatureGrid.extend({
	  /**
	   * Options
	   */
	
	  options: {
	    attribution: null,
	    where: '1=1',
	    fields: ['*'],
	    from: false,
	    to: false,
	    timeField: false,
	    timeFilterMode: 'server',
	    simplifyFactor: 0,
	    precision: 6
	  },
	
	  /**
	   * Constructor
	   */
	
	  initialize: function (options) {
	    _FeatureGrid.FeatureGrid.prototype.initialize.call(this, options);
	
	    options.url = _Util.cleanUrl(options.url);
	    options = _leaflet2.default.setOptions(this, options);
	
	    this.service = _ServicesFeatureLayerService2.default(options);
	    this.service.addEventParent(this);
	
	    // use case insensitive regex to look for common fieldnames used for indexing
	    if (this.options.fields[0] !== '*') {
	      var oidCheck = false;
	      for (var i = 0; i < this.options.fields.length; i++) {
	        if (this.options.fields[i].match(/^(OBJECTID|FID|OID|ID)$/i)) {
	          oidCheck = true;
	        }
	      }
	      if (oidCheck === false) {
	        _Util.warn('no known esriFieldTypeOID field detected in fields Array.  Please add an attribute field containing unique IDs to ensure the layer can be drawn correctly.');
	      }
	    }
	
	    if (this.options.timeField.start && this.options.timeField.end) {
	      this._startTimeIndex = new BinarySearchIndex();
	      this._endTimeIndex = new BinarySearchIndex();
	    } else if (this.options.timeField) {
	      this._timeIndex = new BinarySearchIndex();
	    }
	
	    this._cache = {};
	    this._currentSnapshot = []; // cache of what layers should be active
	    this._activeRequests = 0;
	  },
	
	  /**
	   * Layer Interface
	   */
	
	  onAdd: function (map) {
	    return _FeatureGrid.FeatureGrid.prototype.onAdd.call(this, map);
	  },
	
	  onRemove: function (map) {
	    return _FeatureGrid.FeatureGrid.prototype.onRemove.call(this, map);
	  },
	
	  getAttribution: function () {
	    return this.options.attribution;
	  },
	
	  /**
	   * Feature Managment
	   */
	
	  createCell: function (bounds, coords) {
	    this._requestFeatures(bounds, coords);
	  },
	
	  _requestFeatures: function (bounds, coords, callback) {
	    this._activeRequests++;
	
	    // our first active request fires loading
	    if (this._activeRequests === 1) {
	      this.fire('loading', {
	        bounds: bounds
	      }, true);
	    }
	
	    return this._buildQuery(bounds).run(function (error, featureCollection, response) {
	      if (response && response.exceededTransferLimit) {
	        this.fire('drawlimitexceeded');
	      }
	
	      // no error, features
	      if (!error && featureCollection && featureCollection.features.length) {
	        // schedule adding features until the next animation frame
	        _leaflet2.default.Util.requestAnimFrame(_leaflet2.default.Util.bind(function () {
	          this._addFeatures(featureCollection.features, coords);
	          this._postProcessFeatures(bounds);
	        }, this));
	      }
	
	      // no error, no features
	      if (!error && featureCollection && !featureCollection.features.length) {
	        this._postProcessFeatures(bounds);
	      }
	
	      if (callback) {
	        callback.call(this, error, featureCollection);
	      }
	    }, this);
	  },
	
	  _postProcessFeatures: function (bounds) {
	    // deincriment the request counter now that we have processed features
	    this._activeRequests--;
	
	    // if there are no more active requests fire a load event for this view
	    if (this._activeRequests <= 0) {
	      this.fire('load', {
	        bounds: bounds
	      });
	    }
	  },
	
	  _cacheKey: function (coords) {
	    return coords.z + ':' + coords.x + ':' + coords.y;
	  },
	
	  _addFeatures: function (features, coords) {
	    var key = this._cacheKey(coords);
	    this._cache[key] = this._cache[key] || [];
	
	    for (var i = features.length - 1; i >= 0; i--) {
	      var id = features[i].id;
	      this._currentSnapshot.push(id);
	      this._cache[key].push(id);
	    }
	
	    if (this.options.timeField) {
	      this._buildTimeIndexes(features);
	    }
	
	    var zoom = this._map.getZoom();
	
	    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
	      return;
	    }
	
	    this.createLayers(features);
	  },
	
	  _buildQuery: function (bounds) {
	    var query = this.service.query().intersects(bounds).where(this.options.where).fields(this.options.fields).precision(this.options.precision);
	
	    if (this.options.simplifyFactor) {
	      query.simplify(this._map, this.options.simplifyFactor);
	    }
	
	    if (this.options.timeFilterMode === 'server' && this.options.from && this.options.to) {
	      query.between(this.options.from, this.options.to);
	    }
	
	    return query;
	  },
	
	  /**
	   * Where Methods
	   */
	
	  setWhere: function (where, callback, context) {
	    this.options.where = where && where.length ? where : '1=1';
	
	    var oldSnapshot = [];
	    var newSnapshot = [];
	    var pendingRequests = 0;
	    var requestError = null;
	    var requestCallback = _leaflet2.default.Util.bind(function (error, featureCollection) {
	      if (error) {
	        requestError = error;
	      }
	
	      if (featureCollection) {
	        for (var i = featureCollection.features.length - 1; i >= 0; i--) {
	          newSnapshot.push(featureCollection.features[i].id);
	        }
	      }
	
	      pendingRequests--;
	
	      if (pendingRequests <= 0) {
	        this._currentSnapshot = newSnapshot;
	        // schedule adding features until the next animation frame
	        _leaflet2.default.Util.requestAnimFrame(_leaflet2.default.Util.bind(function () {
	          this.removeLayers(oldSnapshot);
	          this.addLayers(newSnapshot);
	          if (callback) {
	            callback.call(context, requestError);
	          }
	        }, this));
	      }
	    }, this);
	
	    for (var i = this._currentSnapshot.length - 1; i >= 0; i--) {
	      oldSnapshot.push(this._currentSnapshot[i]);
	    }
	
	    for (var key in this._activeCells) {
	      pendingRequests++;
	      var coords = this._keyToCellCoords(key);
	      var bounds = this._cellCoordsToBounds(coords);
	      this._requestFeatures(bounds, key, requestCallback);
	    }
	
	    return this;
	  },
	
	  getWhere: function () {
	    return this.options.where;
	  },
	
	  /**
	   * Time Range Methods
	   */
	
	  getTimeRange: function () {
	    return [this.options.from, this.options.to];
	  },
	
	  setTimeRange: function (from, to, callback, context) {
	    var oldFrom = this.options.from;
	    var oldTo = this.options.to;
	    var pendingRequests = 0;
	    var requestError = null;
	    var requestCallback = _leaflet2.default.Util.bind(function (error) {
	      if (error) {
	        requestError = error;
	      }
	      this._filterExistingFeatures(oldFrom, oldTo, from, to);
	
	      pendingRequests--;
	
	      if (callback && pendingRequests <= 0) {
	        callback.call(context, requestError);
	      }
	    }, this);
	
	    this.options.from = from;
	    this.options.to = to;
	
	    this._filterExistingFeatures(oldFrom, oldTo, from, to);
	
	    if (this.options.timeFilterMode === 'server') {
	      for (var key in this._activeCells) {
	        pendingRequests++;
	        var coords = this._keyToCellCoords(key);
	        var bounds = this._cellCoordsToBounds(coords);
	        this._requestFeatures(bounds, key, requestCallback);
	      }
	    }
	
	    return this;
	  },
	
	  refresh: function () {
	    for (var key in this._activeCells) {
	      var coords = this._keyToCellCoords(key);
	      var bounds = this._cellCoordsToBounds(coords);
	      this._requestFeatures(bounds, key);
	    }
	
	    if (this.redraw) {
	      this.once('load', function () {
	        this.eachFeature(function (layer) {
	          this._redraw(layer.feature.id);
	        }, this);
	      }, this);
	    }
	  },
	
	  _filterExistingFeatures: function (oldFrom, oldTo, newFrom, newTo) {
	    var layersToRemove = oldFrom && oldTo ? this._getFeaturesInTimeRange(oldFrom, oldTo) : this._currentSnapshot;
	    var layersToAdd = this._getFeaturesInTimeRange(newFrom, newTo);
	
	    if (layersToAdd.indexOf) {
	      for (var i = 0; i < layersToAdd.length; i++) {
	        var shouldRemoveLayer = layersToRemove.indexOf(layersToAdd[i]);
	        if (shouldRemoveLayer >= 0) {
	          layersToRemove.splice(shouldRemoveLayer, 1);
	        }
	      }
	    }
	
	    // schedule adding features until the next animation frame
	    _leaflet2.default.Util.requestAnimFrame(_leaflet2.default.Util.bind(function () {
	      this.removeLayers(layersToRemove);
	      this.addLayers(layersToAdd);
	    }, this));
	  },
	
	  _getFeaturesInTimeRange: function (start, end) {
	    var ids = [];
	    var search;
	
	    if (this.options.timeField.start && this.options.timeField.end) {
	      var startTimes = this._startTimeIndex.between(start, end);
	      var endTimes = this._endTimeIndex.between(start, end);
	      search = startTimes.concat(endTimes);
	    } else {
	      search = this._timeIndex.between(start, end);
	    }
	
	    for (var i = search.length - 1; i >= 0; i--) {
	      ids.push(search[i].id);
	    }
	
	    return ids;
	  },
	
	  _buildTimeIndexes: function (geojson) {
	    var i;
	    var feature;
	    if (this.options.timeField.start && this.options.timeField.end) {
	      var startTimeEntries = [];
	      var endTimeEntries = [];
	      for (i = geojson.length - 1; i >= 0; i--) {
	        feature = geojson[i];
	        startTimeEntries.push({
	          id: feature.id,
	          value: new Date(feature.properties[this.options.timeField.start])
	        });
	        endTimeEntries.push({
	          id: feature.id,
	          value: new Date(feature.properties[this.options.timeField.end])
	        });
	      }
	      this._startTimeIndex.bulkAdd(startTimeEntries);
	      this._endTimeIndex.bulkAdd(endTimeEntries);
	    } else {
	      var timeEntries = [];
	      for (i = geojson.length - 1; i >= 0; i--) {
	        feature = geojson[i];
	        timeEntries.push({
	          id: feature.id,
	          value: new Date(feature.properties[this.options.timeField])
	        });
	      }
	
	      this._timeIndex.bulkAdd(timeEntries);
	    }
	  },
	
	  _featureWithinTimeRange: function (feature) {
	    if (!this.options.from || !this.options.to) {
	      return true;
	    }
	
	    var from = +this.options.from.valueOf();
	    var to = +this.options.to.valueOf();
	
	    if (typeof this.options.timeField === 'string') {
	      var date = +feature.properties[this.options.timeField];
	      return date >= from && date <= to;
	    }
	
	    if (this.options.timeField.start && this.options.timeField.end) {
	      var startDate = +feature.properties[this.options.timeField.start];
	      var endDate = +feature.properties[this.options.timeField.end];
	      return startDate >= from && startDate <= to || endDate >= from && endDate <= to;
	    }
	  },
	
	  /**
	   * Service Methods
	   */
	
	  authenticate: function (token) {
	    this.service.authenticate(token);
	    return this;
	  },
	
	  metadata: function (callback, context) {
	    this.service.metadata(callback, context);
	    return this;
	  },
	
	  query: function () {
	    return this.service.query();
	  },
	
	  _getMetadata: function (callback) {
	    if (this._metadata) {
	      var error;
	      callback(error, this._metadata);
	    } else {
	      this.metadata(_leaflet2.default.Util.bind(function (error, response) {
	        this._metadata = response;
	        callback(error, this._metadata);
	      }, this));
	    }
	  },
	
	  addFeature: function (feature, callback, context) {
	    this._getMetadata(_leaflet2.default.Util.bind(function (error, metadata) {
	      if (error) {
	        if (callback) {
	          callback.call(this, error, null);
	        }
	        return;
	      }
	
	      this.service.addFeature(feature, _leaflet2.default.Util.bind(function (error, response) {
	        if (!error) {
	          // assign ID from result to appropriate objectid field from service metadata
	          feature.properties[metadata.objectIdField] = response.objectId;
	
	          // we also need to update the geojson id for createLayers() to function
	          feature.id = response.objectId;
	          this.createLayers([feature]);
	        }
	
	        if (callback) {
	          callback.call(context, error, response);
	        }
	      }, this));
	    }, this));
	  },
	
	  updateFeature: function (feature, callback, context) {
	    this.service.updateFeature(feature, function (error, response) {
	      if (!error) {
	        this.removeLayers([feature.id], true);
	        this.createLayers([feature]);
	      }
	
	      if (callback) {
	        callback.call(context, error, response);
	      }
	    }, this);
	  },
	
	  deleteFeature: function (id, callback, context) {
	    this.service.deleteFeature(id, function (error, response) {
	      if (!error && response.objectId) {
	        this.removeLayers([response.objectId], true);
	      }
	      if (callback) {
	        callback.call(context, error, response);
	      }
	    }, this);
	  },
	
	  deleteFeatures: function (ids, callback, context) {
	    return this.service.deleteFeatures(ids, function (error, response) {
	      if (!error && response.length > 0) {
	        for (var i = 0; i < response.length; i++) {
	          this.removeLayers([response[i].objectId], true);
	        }
	      }
	      if (callback) {
	        callback.call(context, error, response);
	      }
	    }, this);
	  }
	});
	
	/**
	 * Temporal Binary Search Index
	 */
	
	exports.FeatureManager = FeatureManager;
	function BinarySearchIndex(values) {
	  this.values = values || [];
	}
	
	BinarySearchIndex.prototype._query = function (query) {
	  var minIndex = 0;
	  var maxIndex = this.values.length - 1;
	  var currentIndex;
	  var currentElement;
	
	  while (minIndex <= maxIndex) {
	    currentIndex = (minIndex + maxIndex) / 2 | 0;
	    currentElement = this.values[Math.round(currentIndex)];
	    if (+currentElement.value < +query) {
	      minIndex = currentIndex + 1;
	    } else if (+currentElement.value > +query) {
	      maxIndex = currentIndex - 1;
	    } else {
	      return currentIndex;
	    }
	  }
	
	  return ~maxIndex;
	};
	
	BinarySearchIndex.prototype.sort = function () {
	  this.values.sort(function (a, b) {
	    return +b.value - +a.value;
	  }).reverse();
	  this.dirty = false;
	};
	
	BinarySearchIndex.prototype.between = function (start, end) {
	  if (this.dirty) {
	    this.sort();
	  }
	
	  var startIndex = this._query(start);
	  var endIndex = this._query(end);
	
	  if (startIndex === 0 && endIndex === 0) {
	    return [];
	  }
	
	  startIndex = Math.abs(startIndex);
	  endIndex = endIndex < 0 ? Math.abs(endIndex) : endIndex + 1;
	
	  return this.values.slice(startIndex, endIndex);
	};
	
	BinarySearchIndex.prototype.bulkAdd = function (items) {
	  this.dirty = true;
	  this.values = this.values.concat(items);
	};

/***/ },
/* 24 */
/*!****************************************************************!*\
  !*** ./~/esri-leaflet/src/Layers/FeatureLayer/FeatureLayer.js ***!
  \****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.featureLayer = featureLayer;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _FeatureManager = __webpack_require__(/*! ./FeatureManager */ 23);
	
	var FeatureLayer = _FeatureManager.FeatureManager.extend({
	
	  options: {
	    cacheLayers: true
	  },
	
	  /**
	   * Constructor
	   */
	  initialize: function (options) {
	    _FeatureManager.FeatureManager.prototype.initialize.call(this, options);
	    this._originalStyle = this.options.style;
	    this._layers = {};
	  },
	
	  /**
	   * Layer Interface
	   */
	
	  onRemove: function (map) {
	    for (var i in this._layers) {
	      map.removeLayer(this._layers[i]);
	    }
	
	    return _FeatureManager.FeatureManager.prototype.onRemove.call(this, map);
	  },
	
	  createNewLayer: function (geojson) {
	    var layer = _leaflet2.default.GeoJSON.geometryToLayer(geojson, this.options);
	    layer.defaultOptions = layer.options;
	    return layer;
	  },
	
	  _updateLayer: function (layer, geojson) {
	    // convert the geojson coordinates into a Leaflet LatLng array/nested arrays
	    // pass it to setLatLngs to update layer geometries
	    var latlngs = [];
	    var coordsToLatLng = this.options.coordsToLatLng || _leaflet2.default.GeoJSON.coordsToLatLng;
	
	    // copy new attributes, if present
	    if (geojson.properties) {
	      layer.feature.properties = geojson.properties;
	    }
	
	    switch (geojson.geometry.type) {
	      case 'Point':
	        latlngs = _leaflet2.default.GeoJSON.coordsToLatLng(geojson.geometry.coordinates);
	        layer.setLatLng(latlngs);
	        break;
	      case 'LineString':
	        latlngs = _leaflet2.default.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 0, coordsToLatLng);
	        layer.setLatLngs(latlngs);
	        break;
	      case 'MultiLineString':
	        latlngs = _leaflet2.default.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 1, coordsToLatLng);
	        layer.setLatLngs(latlngs);
	        break;
	      case 'Polygon':
	        latlngs = _leaflet2.default.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 1, coordsToLatLng);
	        layer.setLatLngs(latlngs);
	        break;
	      case 'MultiPolygon':
	        latlngs = _leaflet2.default.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 2, coordsToLatLng);
	        layer.setLatLngs(latlngs);
	        break;
	    }
	  },
	
	  /**
	   * Feature Management Methods
	   */
	
	  createLayers: function (features) {
	    for (var i = features.length - 1; i >= 0; i--) {
	      var geojson = features[i];
	
	      var layer = this._layers[geojson.id];
	      var newLayer;
	
	      if (layer && !this._map.hasLayer(layer)) {
	        this._map.addLayer(layer);
	      }
	
	      // update geometry if neccessary
	      if (layer && this.options.simplifyFactor > 0 && (layer.setLatLngs || layer.setLatLng)) {
	        this._updateLayer(layer, geojson);
	      }
	
	      if (!layer) {
	        newLayer = this.createNewLayer(geojson);
	        newLayer.feature = geojson;
	
	        // bubble events from individual layers to the feature layer
	        newLayer.addEventParent(this);
	
	        if (this.options.onEachFeature) {
	          this.options.onEachFeature(newLayer.feature, newLayer);
	        }
	
	        // cache the layer
	        this._layers[newLayer.feature.id] = newLayer;
	
	        // style the layer
	        this.setFeatureStyle(newLayer.feature.id, this.options.style);
	
	        this.fire('createfeature', {
	          feature: newLayer.feature
	        }, true);
	
	        // add the layer if it is within the time bounds or our layer is not time enabled
	        if (!this.options.timeField || this.options.timeField && this._featureWithinTimeRange(geojson)) {
	          this._map.addLayer(newLayer);
	        }
	      }
	    }
	  },
	
	  addLayers: function (ids) {
	    for (var i = ids.length - 1; i >= 0; i--) {
	      var layer = this._layers[ids[i]];
	      if (layer) {
	        this.fire('addfeature', {
	          feature: layer.feature
	        }, true);
	        this._map.addLayer(layer);
	      }
	    }
	  },
	
	  removeLayers: function (ids, permanent) {
	    for (var i = ids.length - 1; i >= 0; i--) {
	      var id = ids[i];
	      var layer = this._layers[id];
	      if (layer) {
	        this.fire('removefeature', {
	          feature: layer.feature,
	          permanent: permanent
	        }, true);
	        this._map.removeLayer(layer);
	      }
	      if (layer && permanent) {
	        delete this._layers[id];
	      }
	    }
	  },
	
	  cellEnter: function (bounds, coords) {
	    if (!this._zooming && this._map) {
	      _leaflet2.default.Util.requestAnimFrame(_leaflet2.default.Util.bind(function () {
	        var cacheKey = this._cacheKey(coords);
	        var cellKey = this._cellCoordsToKey(coords);
	        var layers = this._cache[cacheKey];
	        if (this._activeCells[cellKey] && layers) {
	          this.addLayers(layers);
	        }
	      }, this));
	    }
	  },
	
	  cellLeave: function (bounds, coords) {
	    if (!this._zooming && this._map) {
	      _leaflet2.default.Util.requestAnimFrame(_leaflet2.default.Util.bind(function () {
	        var cacheKey = this._cacheKey(coords);
	        var cellKey = this._cellCoordsToKey(coords);
	        var layers = this._cache[cacheKey];
	        var mapBounds = this._map.getBounds();
	        if (!this._activeCells[cellKey] && layers) {
	          var removable = true;
	
	          for (var i = 0; i < layers.length; i++) {
	            var layer = this._layers[layers[i]];
	            if (layer && layer.getBounds && mapBounds.intersects(layer.getBounds())) {
	              removable = false;
	            }
	          }
	
	          if (removable) {
	            this.removeLayers(layers, !this.options.cacheLayers);
	          }
	
	          if (!this.options.cacheLayers && removable) {
	            delete this._cache[cacheKey];
	            delete this._cells[cellKey];
	            delete this._activeCells[cellKey];
	          }
	        }
	      }, this));
	    }
	  },
	
	  /**
	   * Styling Methods
	   */
	
	  resetStyle: function () {
	    this.options.style = this._originalStyle;
	    this.eachFeature(function (layer) {
	      this.resetFeatureStyle(layer.feature.id);
	    }, this);
	    return this;
	  },
	
	  setStyle: function (style) {
	    this.options.style = style;
	    this.eachFeature(function (layer) {
	      this.setFeatureStyle(layer.feature.id, style);
	    }, this);
	    return this;
	  },
	
	  resetFeatureStyle: function (id) {
	    var layer = this._layers[id];
	    var style = this._originalStyle || _leaflet2.default.Path.prototype.options;
	    if (layer) {
	      _leaflet2.default.Util.extend(layer.options, layer.defaultOptions);
	      this.setFeatureStyle(id, style);
	    }
	    return this;
	  },
	
	  setFeatureStyle: function (id, style) {
	    var layer = this._layers[id];
	    if (typeof style === 'function') {
	      style = style(layer.feature);
	    }
	    if (layer.setStyle) {
	      layer.setStyle(style);
	    }
	    return this;
	  },
	
	  /**
	   * Utility Methods
	   */
	
	  eachFeature: function (fn, context) {
	    for (var i in this._layers) {
	      fn.call(context, this._layers[i]);
	    }
	    return this;
	  },
	
	  getFeature: function (id) {
	    return this._layers[id];
	  },
	
	  bringToBack: function () {
	    this.eachFeature(function (layer) {
	      if (layer.bringToBack) {
	        layer.bringToBack();
	      }
	    });
	  },
	
	  bringToFront: function () {
	    this.eachFeature(function (layer) {
	      if (layer.bringToFront) {
	        layer.bringToFront();
	      }
	    });
	  },
	
	  redraw: function (id) {
	    if (id) {
	      this._redraw(id);
	    }
	    return this;
	  },
	
	  _redraw: function (id) {
	    var layer = this._layers[id];
	    var geojson = layer.feature;
	
	    // if this looks like a marker
	    if (layer && layer.setIcon && this.options.pointToLayer) {
	      // update custom symbology, if necessary
	      if (this.options.pointToLayer) {
	        var getIcon = this.options.pointToLayer(geojson, _leaflet2.default.latLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]));
	        var updatedIcon = getIcon.options.icon;
	        layer.setIcon(updatedIcon);
	      }
	    }
	
	    // looks like a vector marker (circleMarker)
	    if (layer && layer.setStyle && this.options.pointToLayer) {
	      var getStyle = this.options.pointToLayer(geojson, _leaflet2.default.latLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]));
	      var updatedStyle = getStyle.options;
	      this.setFeatureStyle(geojson.id, updatedStyle);
	    }
	
	    // looks like a path (polygon/polyline)
	    if (layer && layer.setStyle && this.options.style) {
	      this.resetStyle(geojson.id);
	    }
	  }
	});
	
	exports.FeatureLayer = FeatureLayer;
	
	function featureLayer(options) {
	  return new FeatureLayer(options);
	}
	
	exports.default = featureLayer;

/***/ },
/* 25 */
/*!*************************************************************!*\
  !*** ./~/esri-leaflet-geocoder/src/EsriLeafletGeocoding.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	var VERSION = '2.0.0-beta.3';
	exports.VERSION = VERSION;
	var WorldGeocodingServiceUrl = (window.location.protocol === 'https:' ? 'https:' : 'http:') + '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/';
	
	// import tasks
	exports.WorldGeocodingServiceUrl = WorldGeocodingServiceUrl;
	
	var _TasksGeocode = __webpack_require__(/*! ./Tasks/Geocode */ 26);
	
	exports.Geocode = _TasksGeocode.Geocode;
	exports.geocode = _TasksGeocode.geocode;
	
	var _TasksReverseGeocode = __webpack_require__(/*! ./Tasks/ReverseGeocode */ 27);
	
	exports.ReverseGeocode = _TasksReverseGeocode.ReverseGeocode;
	exports.reverseGeocode = _TasksReverseGeocode.reverseGeocode;
	
	var _TasksSuggest = __webpack_require__(/*! ./Tasks/Suggest */ 28);
	
	// import service
	exports.Suggest = _TasksSuggest.Suggest;
	exports.suggest = _TasksSuggest.suggest;
	
	var _ServicesGeocode = __webpack_require__(/*! ./Services/Geocode */ 29);
	
	// import control
	exports.GeocodeService = _ServicesGeocode.GeocodeService;
	exports.geocodeService = _ServicesGeocode.geocodeService;
	
	var _ControlsGeosearch = __webpack_require__(/*! ./Controls/Geosearch */ 30);
	
	// import providers
	exports.Geosearch = _ControlsGeosearch.Geosearch;
	exports.geosearch = _ControlsGeosearch.geosearch;
	
	var _ProvidersArcgisOnlineGeocoder = __webpack_require__(/*! ./Providers/ArcgisOnlineGeocoder */ 31);
	
	exports.ArcgisOnlineProvider = _ProvidersArcgisOnlineGeocoder.ArcgisOnlineProvider;
	exports.arcgisOnlineProvider = _ProvidersArcgisOnlineGeocoder.arcgisOnlineProvider;
	
	var _ProvidersFeatureLayer = __webpack_require__(/*! ./Providers/FeatureLayer */ 32);
	
	exports.FeatureLayerProvider = _ProvidersFeatureLayer.FeatureLayerProvider;
	exports.featureLayerProvider = _ProvidersFeatureLayer.featureLayerProvider;
	
	var _ProvidersMapService = __webpack_require__(/*! ./Providers/MapService */ 33);
	
	exports.MapServiceProvider = _ProvidersMapService.MapServiceProvider;
	exports.mapServiceProvider = _ProvidersMapService.mapServiceProvider;
	
	var _ProvidersGeocodeService = __webpack_require__(/*! ./Providers/GeocodeService */ 34);
	
	exports.GeocodeServiceProvider = _ProvidersGeocodeService.GeocodeServiceProvider;
	exports.geocodeServiceProvider = _ProvidersGeocodeService.geocodeServiceProvider;

/***/ },
/* 26 */
/*!******************************************************!*\
  !*** ./~/esri-leaflet-geocoder/src/Tasks/Geocode.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.geocode = geocode;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _esriLeaflet = __webpack_require__(/*! esri-leaflet */ 2);
	
	var _EsriLeafletGeocoding = __webpack_require__(/*! ../EsriLeafletGeocoding */ 25);
	
	var Geocode = _esriLeaflet.Task.extend({
	  path: 'find',
	
	  params: {
	    outSr: 4326,
	    forStorage: false,
	    outFields: '*',
	    maxLocations: 20
	  },
	
	  setters: {
	    'address': 'address',
	    'neighborhood': 'neighborhood',
	    'city': 'city',
	    'subregion': 'subregion',
	    'region': 'region',
	    'postal': 'postal',
	    'country': 'country',
	    'text': 'text',
	    'category': 'category',
	    'token': 'token',
	    'key': 'magicKey',
	    'fields': 'outFields',
	    'forStorage': 'forStorage',
	    'maxLocations': 'maxLocations'
	  },
	
	  initialize: function (options) {
	    options = options || {};
	    options.url = options.url || _EsriLeafletGeocoding.WorldGeocodingServiceUrl;
	    _esriLeaflet.Task.prototype.initialize.call(this, options);
	  },
	
	  within: function (bounds) {
	    bounds = _leaflet2.default.latLngBounds(bounds);
	    this.params.bbox = _esriLeaflet.Util.boundsToExtent(bounds);
	    return this;
	  },
	
	  nearby: function (latlng, radius) {
	    latlng = _leaflet2.default.latLng(latlng);
	    this.params.location = latlng.lng + ',' + latlng.lat;
	    this.params.distance = Math.min(Math.max(radius, 2000), 50000);
	    return this;
	  },
	
	  run: function (callback, context) {
	    this.path = this.params.text ? 'find' : 'findAddressCandidates';
	
	    if (this.path === 'findAddressCandidates' && this.params.bbox) {
	      this.params.searchExtent = this.params.bbox;
	      delete this.params.bbox;
	    }
	
	    return this.request(function (error, response) {
	      var processor = this.path === 'find' ? this._processFindResponse : this._processFindAddressCandidatesResponse;
	      var results = !error ? processor(response) : undefined;
	      callback.call(context, error, { results: results }, response);
	    }, this);
	  },
	
	  _processFindResponse: function (response) {
	    var results = [];
	
	    for (var i = 0; i < response.locations.length; i++) {
	      var location = response.locations[i];
	      var bounds;
	
	      if (location.extent) {
	        bounds = _esriLeaflet.Util.extentToBounds(location.extent);
	      }
	
	      results.push({
	        text: location.name,
	        bounds: bounds,
	        score: location.feature.attributes.Score,
	        latlng: _leaflet2.default.latLng(location.feature.geometry.y, location.feature.geometry.x),
	        properties: location.feature.attributes
	      });
	    }
	
	    return results;
	  },
	
	  _processFindAddressCandidatesResponse: function (response) {
	    var results = [];
	
	    for (var i = 0; i < response.candidates.length; i++) {
	      var candidate = response.candidates[i];
	      var bounds = _esriLeaflet.Util.extentToBounds(candidate.extent);
	
	      results.push({
	        text: candidate.address,
	        bounds: bounds,
	        score: candidate.score,
	        latlng: _leaflet2.default.latLng(candidate.location.y, candidate.location.x),
	        properties: candidate.attributes
	      });
	    }
	
	    return results;
	  }
	
	});
	
	exports.Geocode = Geocode;
	
	function geocode(options) {
	  return new Geocode(options);
	}
	
	exports.default = geocode;

/***/ },
/* 27 */
/*!*************************************************************!*\
  !*** ./~/esri-leaflet-geocoder/src/Tasks/ReverseGeocode.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.reverseGeocode = reverseGeocode;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _esriLeaflet = __webpack_require__(/*! esri-leaflet */ 2);
	
	var _EsriLeafletGeocoding = __webpack_require__(/*! ../EsriLeafletGeocoding */ 25);
	
	var ReverseGeocode = _esriLeaflet.Task.extend({
	  path: 'reverseGeocode',
	
	  params: {
	    outSR: 4326
	  },
	
	  setters: {
	    'distance': 'distance',
	    'language': 'language'
	  },
	
	  initialize: function (options) {
	    options = options || {};
	    options.url = options.url || _EsriLeafletGeocoding.WorldGeocodingServiceUrl;
	    _esriLeaflet.Task.prototype.initialize.call(this, options);
	  },
	
	  latlng: function (latlng) {
	    latlng = _leaflet2.default.latLng(latlng);
	    this.params.location = latlng.lng + ',' + latlng.lat;
	    return this;
	  },
	
	  run: function (callback, context) {
	    return this.request(function (error, response) {
	      var result;
	
	      if (!error) {
	        result = {
	          latlng: _leaflet2.default.latLng(response.location.y, response.location.x),
	          address: response.address
	        };
	      } else {
	        result = undefined;
	      }
	
	      callback.call(context, error, result, response);
	    }, this);
	  }
	});
	
	exports.ReverseGeocode = ReverseGeocode;
	
	function reverseGeocode(options) {
	  return new ReverseGeocode(options);
	}
	
	exports.default = reverseGeocode;

/***/ },
/* 28 */
/*!******************************************************!*\
  !*** ./~/esri-leaflet-geocoder/src/Tasks/Suggest.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.suggest = suggest;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _esriLeaflet = __webpack_require__(/*! esri-leaflet */ 2);
	
	var _EsriLeafletGeocoding = __webpack_require__(/*! ../EsriLeafletGeocoding */ 25);
	
	var Suggest = _esriLeaflet.Task.extend({
	  path: 'suggest',
	
	  params: {},
	
	  setters: {
	    text: 'text',
	    category: 'category'
	  },
	
	  initialize: function (options) {
	    options = options || {};
	    options.url = options.url || _EsriLeafletGeocoding.WorldGeocodingServiceUrl;
	    _esriLeaflet.Task.prototype.initialize.call(this, options);
	  },
	
	  within: function (bounds) {
	    bounds = _leaflet2.default.latLngBounds(bounds);
	    bounds = bounds.pad(0.5);
	    var center = bounds.getCenter();
	    var ne = bounds.getNorthWest();
	    this.params.location = center.lng + ',' + center.lat;
	    this.params.distance = Math.min(Math.max(center.distanceTo(ne), 2000), 50000);
	    this.params.searchExtent = _esriLeaflet.Util.boundsToExtent(bounds);
	    return this;
	  },
	
	  nearby: function (latlng, radius) {
	    latlng = _leaflet2.default.latLng(latlng);
	    this.params.location = latlng.lng + ',' + latlng.lat;
	    this.params.distance = Math.min(Math.max(radius, 2000), 50000);
	    return this;
	  },
	
	  run: function (callback, context) {
	    return this.request(function (error, response) {
	      callback.call(context, error, response, response);
	    }, this);
	  }
	
	});
	
	exports.Suggest = Suggest;
	
	function suggest(options) {
	  return new Suggest(options);
	}
	
	exports.default = suggest;

/***/ },
/* 29 */
/*!*********************************************************!*\
  !*** ./~/esri-leaflet-geocoder/src/Services/Geocode.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.geocodeService = geocodeService;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _esriLeaflet = __webpack_require__(/*! esri-leaflet */ 2);
	
	var _EsriLeafletGeocoding = __webpack_require__(/*! ../EsriLeafletGeocoding */ 25);
	
	var _TasksGeocode = __webpack_require__(/*! ../Tasks/Geocode */ 26);
	
	var _TasksGeocode2 = _interopRequireDefault(_TasksGeocode);
	
	var _TasksReverseGeocode = __webpack_require__(/*! ../Tasks/ReverseGeocode */ 27);
	
	var _TasksReverseGeocode2 = _interopRequireDefault(_TasksReverseGeocode);
	
	var _TasksSuggest = __webpack_require__(/*! ../Tasks/Suggest */ 28);
	
	var _TasksSuggest2 = _interopRequireDefault(_TasksSuggest);
	
	var GeocodeService = _esriLeaflet.Service.extend({
	  initialize: function (options) {
	    options = options || {};
	    options.url = options.url || _EsriLeafletGeocoding.WorldGeocodingServiceUrl;
	    _esriLeaflet.Service.prototype.initialize.call(this, options);
	    this._confirmSuggestSupport();
	  },
	
	  geocode: function () {
	    return _TasksGeocode2.default(this);
	  },
	
	  reverse: function () {
	    return _TasksReverseGeocode2.default(this);
	  },
	
	  suggest: function () {
	    // requires either the Esri World Geocoding Service or a 10.3 ArcGIS Server Geocoding Service that supports suggest.
	    return _TasksSuggest2.default(this);
	  },
	
	  _confirmSuggestSupport: function () {
	    this.metadata(function (error, response) {
	      if (error) {
	        return;
	      }
	      if (response.capabilities.includes('Suggest')) {
	        this.options.supportsSuggest = true;
	      } else {
	        this.options.supportsSuggest = false;
	      }
	    }, this);
	  }
	});
	
	exports.GeocodeService = GeocodeService;
	
	function geocodeService(options) {
	  return new GeocodeService(options);
	}
	
	exports.default = geocodeService;

/***/ },
/* 30 */
/*!***********************************************************!*\
  !*** ./~/esri-leaflet-geocoder/src/Controls/Geosearch.js ***!
  \***********************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.geosearch = geosearch;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var Geosearch = _leaflet2.default.Control.extend({
	  includes: _leaflet2.default.Mixin.Events,
	
	  options: {
	    position: 'topleft',
	    zoomToResult: true,
	    useMapBounds: 12,
	    collapseAfterResult: true,
	    expanded: false,
	    forStorage: false,
	    allowMultipleResults: true,
	    placeholder: 'Search for places or addresses',
	    title: 'Location Search'
	  },
	
	  initialize: function (options) {
	    if (!options || !options.providers || !options.providers.length) {
	      throw new Error('You must specificy at least one provider');
	    }
	
	    this._providers = options.providers;
	
	    // bubble each providers events to the control
	    for (var i = 0; i < this._providers.length; i++) {
	      this._providers[i].addEventParent(this);
	    }
	
	    this._pendingSuggestions = [];
	
	    _leaflet2.default.Control.prototype.initialize.call(options);
	  },
	
	  _geocode: function (text, key, provider) {
	    var activeRequests = 0;
	    var allResults = [];
	    var bounds;
	
	    var callback = _leaflet2.default.Util.bind(function (error, results) {
	      activeRequests--;
	      if (error) {
	        return;
	      }
	
	      if (results) {
	        allResults = allResults.concat(results);
	      }
	
	      if (activeRequests <= 0) {
	        bounds = this._boundsFromResults(allResults);
	
	        this.fire('results', {
	          results: allResults,
	          bounds: bounds,
	          latlng: bounds ? bounds.getCenter() : undefined,
	          text: text
	        });
	
	        if (this.options.zoomToResult && bounds) {
	          this._map.fitBounds(bounds);
	        }
	
	        _leaflet2.default.DomUtil.removeClass(this._input, 'geocoder-control-loading');
	
	        this.fire('load');
	
	        this.clear();
	
	        this._input.blur();
	      }
	    }, this);
	
	    if (key) {
	      activeRequests++;
	      provider.results(text, key, this._searchBounds(), callback);
	    } else {
	      for (var i = 0; i < this._providers.length; i++) {
	        activeRequests++;
	        this._providers[i].results(text, key, this._searchBounds(), callback);
	      }
	    }
	  },
	
	  _suggest: function (text) {
	    _leaflet2.default.DomUtil.addClass(this._input, 'geocoder-control-loading');
	    var activeRequests = this._providers.length;
	
	    var createCallback = _leaflet2.default.Util.bind(function (text, provider) {
	      return _leaflet2.default.Util.bind(function (error, suggestions) {
	        if (error) {
	          return;
	        }
	
	        var i;
	
	        activeRequests = activeRequests - 1;
	
	        if (this._input.value < 2) {
	          this._suggestions.innerHTML = '';
	          this._suggestions.style.display = 'none';
	          return;
	        }
	
	        if (suggestions) {
	          for (i = 0; i < suggestions.length; i++) {
	            suggestions[i].provider = provider;
	          }
	        }
	
	        if (provider._lastRender !== text && provider.nodes) {
	          for (i = 0; i < provider.nodes.length; i++) {
	            if (provider.nodes[i].parentElement) {
	              this._suggestions.removeChild(provider.nodes[i]);
	            }
	          }
	
	          provider.nodes = [];
	        }
	
	        if (suggestions.length && this._input.value === text) {
	          if (provider.nodes) {
	            for (var k = 0; k < provider.nodes.length; k++) {
	              if (provider.nodes[k].parentElement) {
	                this._suggestions.removeChild(provider.nodes[k]);
	              }
	            }
	          }
	
	          provider._lastRender = text;
	          provider.nodes = this._renderSuggestions(suggestions);
	        }
	
	        if (activeRequests === 0) {
	          _leaflet2.default.DomUtil.removeClass(this._input, 'geocoder-control-loading');
	        }
	      }, this);
	    }, this);
	
	    this._pendingSuggestions = [];
	
	    for (var i = 0; i < this._providers.length; i++) {
	      var provider = this._providers[i];
	      var request = provider.suggestions(text, this._searchBounds(), createCallback(text, provider));
	      this._pendingSuggestions.push(request);
	    }
	  },
	
	  _searchBounds: function () {
	    if (this.options.useMapBounds === false) {
	      return null;
	    }
	
	    if (this.options.useMapBounds === true) {
	      return this._map.getBounds();
	    }
	
	    if (this.options.useMapBounds <= this._map.getZoom()) {
	      return this._map.getBounds();
	    }
	
	    return null;
	  },
	
	  _renderSuggestions: function (suggestions) {
	    var currentGroup;
	    this._suggestions.style.display = 'block';
	
	    // set the maxHeight of the suggestions box to
	    // map height
	    // - suggestions offset (distance from top of suggestions to top of control)
	    // - control offset (distance from top of control to top of map)
	    // - 10 (extra padding)
	    this._suggestions.style.maxHeight = this._map.getSize().y - this._suggestions.offsetTop - this._wrapper.offsetTop - 10 + 'px';
	
	    var nodes = [];
	    var list;
	    var header;
	
	    for (var i = 0; i < suggestions.length; i++) {
	      var suggestion = suggestions[i];
	      if (!header && this._providers.length > 1 && currentGroup !== suggestion.provider.options.label) {
	        header = _leaflet2.default.DomUtil.create('span', 'geocoder-control-header', this._suggestions);
	        header.textContent = suggestion.provider.options.label;
	        header.innerText = suggestion.provider.options.label;
	        currentGroup = suggestion.provider.options.label;
	        nodes.push(header);
	      }
	
	      if (!list) {
	        list = _leaflet2.default.DomUtil.create('ul', 'geocoder-control-list', this._suggestions);
	      }
	
	      var suggestionItem = _leaflet2.default.DomUtil.create('li', 'geocoder-control-suggestion', list);
	
	      suggestionItem.innerHTML = suggestion.text;
	      suggestionItem.provider = suggestion.provider;
	      suggestionItem['data-magic-key'] = suggestion.magicKey;
	    }
	
	    nodes.push(list);
	
	    return nodes;
	  },
	
	  _boundsFromResults: function (results) {
	    if (!results.length) {
	      return;
	    }
	
	    var nullIsland = _leaflet2.default.latLngBounds([0, 0], [0, 0]);
	    var bounds = _leaflet2.default.latLngBounds();
	
	    for (var i = results.length - 1; i >= 0; i--) {
	      var result = results[i];
	
	      // make sure bounds are valid and not 0,0. sometimes bounds are incorrect or not present
	      if (result.bounds && result.bounds.isValid() && !result.bounds.equals(nullIsland)) {
	        bounds.extend(result.bounds);
	      }
	
	      // ensure that the bounds include the results center point
	      bounds.extend(result.latlng);
	    }
	
	    return bounds;
	  },
	
	  clear: function () {
	    this._suggestions.innerHTML = '';
	    this._suggestions.style.display = 'none';
	    this._input.value = '';
	
	    if (this.options.collapseAfterResult) {
	      this._input.placeholder = '';
	      _leaflet2.default.DomUtil.removeClass(this._wrapper, 'geocoder-control-expanded');
	    }
	
	    if (!this._map.scrollWheelZoom.enabled() && this._map.options.scrollWheelZoom) {
	      this._map.scrollWheelZoom.enable();
	    }
	  },
	
	  getAttribution: function () {
	    var attribution = this.options.attribution;
	
	    for (var i = 0; i < this._providers.length; i++) {
	      attribution += ' ' + this._providers[i].options.attribution;
	    }
	
	    return attribution;
	  },
	
	  onAdd: function (map) {
	    this._map = map;
	    this._wrapper = _leaflet2.default.DomUtil.create('div', 'geocoder-control ' + (this.options.expanded ? ' ' + 'geocoder-control-expanded' : ''));
	    this._input = _leaflet2.default.DomUtil.create('input', 'geocoder-control-input leaflet-bar', this._wrapper);
	    this._input.title = this.options.title;
	
	    this._suggestions = _leaflet2.default.DomUtil.create('div', 'geocoder-control-suggestions leaflet-bar', this._wrapper);
	
	    _leaflet2.default.DomEvent.addListener(this._input, 'focus', function (e) {
	      this._input.placeholder = this.options.placeholder;
	      _leaflet2.default.DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');
	    }, this);
	
	    _leaflet2.default.DomEvent.addListener(this._wrapper, 'click', function (e) {
	      _leaflet2.default.DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');
	      this._input.focus();
	    }, this);
	
	    _leaflet2.default.DomEvent.addListener(this._suggestions, 'mousedown', function (e) {
	      var suggestionItem = e.target || e.srcElement;
	      this._geocode(suggestionItem.innerHTML, suggestionItem['data-magic-key'], suggestionItem.provider);
	      this.clear();
	    }, this);
	
	    _leaflet2.default.DomEvent.addListener(this._input, 'blur', function (e) {
	      this.clear();
	    }, this);
	
	    _leaflet2.default.DomEvent.addListener(this._input, 'keydown', function (e) {
	      _leaflet2.default.DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');
	
	      var list = this._suggestions.querySelectorAll('.' + 'geocoder-control-suggestion');
	      var selected = this._suggestions.querySelectorAll('.' + 'geocoder-control-selected')[0];
	      var selectedPosition;
	
	      for (var i = 0; i < list.length; i++) {
	        if (list[i] === selected) {
	          selectedPosition = i;
	          break;
	        }
	      }
	
	      switch (e.keyCode) {
	        case 13:
	          if (selected) {
	            this._geocode(selected.innerHTML, selected['data-magic-key'], selected.provider);
	            this.clear();
	          } else if (this.options.allowMultipleResults) {
	            this._geocode(this._input.value, undefined);
	            this.clear();
	          } else {
	            _leaflet2.default.DomUtil.addClass(list[0], 'geocoder-control-selected');
	          }
	          _leaflet2.default.DomEvent.preventDefault(e);
	          break;
	        case 38:
	          if (selected) {
	            _leaflet2.default.DomUtil.removeClass(selected, 'geocoder-control-selected');
	          }
	
	          var previousItem = list[selectedPosition - 1];
	
	          if (selected && previousItem) {
	            _leaflet2.default.DomUtil.addClass(previousItem, 'geocoder-control-selected');
	          } else {
	            _leaflet2.default.DomUtil.addClass(list[list.length - 1], 'geocoder-control-selected');
	          }
	          _leaflet2.default.DomEvent.preventDefault(e);
	          break;
	        case 40:
	          if (selected) {
	            _leaflet2.default.DomUtil.removeClass(selected, 'geocoder-control-selected');
	          }
	
	          var nextItem = list[selectedPosition + 1];
	
	          if (selected && nextItem) {
	            _leaflet2.default.DomUtil.addClass(nextItem, 'geocoder-control-selected');
	          } else {
	            _leaflet2.default.DomUtil.addClass(list[0], 'geocoder-control-selected');
	          }
	          _leaflet2.default.DomEvent.preventDefault(e);
	          break;
	        default:
	          // when the input changes we should cancel all pending suggestion requests if possible to avoid result collisions
	          for (var x = 0; x < this._pendingSuggestions.length; x++) {
	            var request = this._pendingSuggestions[x];
	            if (request && request.abort && !request.id) {
	              request.abort();
	            }
	          }
	          break;
	      }
	    }, this);
	
	    _leaflet2.default.DomEvent.addListener(this._input, 'keyup', _leaflet2.default.Util.throttle(function (e) {
	      var key = e.which || e.keyCode;
	      var text = (e.target || e.srcElement).value;
	
	      // require at least 2 characters for suggestions
	      if (text.length < 2) {
	        this._suggestions.innerHTML = '';
	        this._suggestions.style.display = 'none';
	        _leaflet2.default.DomUtil.removeClass(this._input, 'geocoder-control-loading');
	        return;
	      }
	
	      // if this is the escape key it will clear the input so clear suggestions
	      if (key === 27) {
	        this._suggestions.innerHTML = '';
	        this._suggestions.style.display = 'none';
	        return;
	      }
	
	      // if this is NOT the up/down arrows or enter make a suggestion
	      if (key !== 13 && key !== 38 && key !== 40) {
	        if (this._input.value !== this._lastValue) {
	          this._lastValue = this._input.value;
	          this._suggest(text);
	        }
	      }
	    }, 50, this), this);
	
	    _leaflet2.default.DomEvent.disableClickPropagation(this._wrapper);
	
	    // when mouse moves over suggestions disable scroll wheel zoom if its enabled
	    _leaflet2.default.DomEvent.addListener(this._suggestions, 'mouseover', function (e) {
	      if (map.scrollWheelZoom.enabled() && map.options.scrollWheelZoom) {
	        map.scrollWheelZoom.disable();
	      }
	    });
	
	    // when mouse moves leaves suggestions enable scroll wheel zoom if its disabled
	    _leaflet2.default.DomEvent.addListener(this._suggestions, 'mouseout', function (e) {
	      if (!map.scrollWheelZoom.enabled() && map.options.scrollWheelZoom) {
	        map.scrollWheelZoom.enable();
	      }
	    });
	
	    return this._wrapper;
	  },
	
	  onRemove: function (map) {
	    map.attributionControl.removeAttribution('Geocoding by Esri');
	  }
	});
	
	exports.Geosearch = Geosearch;
	
	function geosearch(options) {
	  return new Geosearch(options);
	}
	
	exports.default = geosearch;

/***/ },
/* 31 */
/*!***********************************************************************!*\
  !*** ./~/esri-leaflet-geocoder/src/Providers/ArcgisOnlineGeocoder.js ***!
  \***********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.arcgisOnlineProvider = arcgisOnlineProvider;
	
	var _ServicesGeocode = __webpack_require__(/*! ../Services/Geocode */ 29);
	
	var ArcgisOnlineProvider = _ServicesGeocode.GeocodeService.extend({
	  options: {
	    label: 'Places and Addresses',
	    maxResults: 5,
	    attribution: '<a href="https://developers.arcgis.com/en/features/geocoding/">Geocoding by Esri</a>'
	  },
	
	  suggestions: function (text, bounds, callback) {
	    var request = this.suggest().text(text);
	
	    if (bounds) {
	      request.within(bounds);
	    }
	
	    return request.run(function (error, results, response) {
	      var suggestions = [];
	      if (!error) {
	        while (response.suggestions.length && suggestions.length <= this.options.maxResults - 1) {
	          var suggestion = response.suggestions.shift();
	          if (!suggestion.isCollection) {
	            suggestions.push({
	              text: suggestion.text,
	              magicKey: suggestion.magicKey
	            });
	          }
	        }
	      }
	      callback(error, suggestions);
	    }, this);
	  },
	
	  results: function (text, key, bounds, callback) {
	    var request = this.geocode().text(text);
	
	    if (key) {
	      request.key(key);
	    } else {
	      request.maxLocations(this.options.maxResults);
	    }
	
	    if (bounds) {
	      request.within(bounds);
	    }
	
	    if (this.options.forStorage) {
	      request.forStorage(true);
	    }
	
	    return request.run(function (error, response) {
	      callback(error, response.results);
	    }, this);
	  }
	});
	
	exports.ArcgisOnlineProvider = ArcgisOnlineProvider;
	
	function arcgisOnlineProvider(options) {
	  return new ArcgisOnlineProvider(options);
	}
	
	exports.default = arcgisOnlineProvider;

/***/ },
/* 32 */
/*!***************************************************************!*\
  !*** ./~/esri-leaflet-geocoder/src/Providers/FeatureLayer.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.featureLayerProvider = featureLayerProvider;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _esriLeaflet = __webpack_require__(/*! esri-leaflet */ 2);
	
	var FeatureLayerProvider = _esriLeaflet.FeatureLayerService.extend({
	  options: {
	    label: 'Feature Layer',
	    maxResults: 5,
	    bufferRadius: 1000,
	    formatSuggestion: function (feature) {
	      return feature.properties[this.options.searchFields[0]];
	    }
	  },
	
	  initialize: function (options) {
	    _esriLeaflet.FeatureLayerService.prototype.initialize.call(this, options);
	    if (typeof this.options.searchFields === 'string') {
	      this.options.searchFields = [this.options.searchFields];
	    }
	  },
	
	  suggestions: function (text, bounds, callback) {
	    var query = this.query().where(this._buildQuery(text)).returnGeometry(false);
	
	    if (bounds) {
	      query.intersects(bounds);
	    }
	
	    if (this.options.idField) {
	      query.fields([this.options.idField].concat(this.options.searchFields));
	    }
	
	    var request = query.run(function (error, results, raw) {
	      if (error) {
	        callback(error, []);
	      } else {
	        this.options.idField = raw.objectIdFieldName;
	        var suggestions = [];
	        var count = Math.min(results.features.length, this.options.maxResults);
	        for (var i = 0; i < count; i++) {
	          var feature = results.features[i];
	          suggestions.push({
	            text: this.options.formatSuggestion.call(this, feature),
	            magicKey: feature.id
	          });
	        }
	        callback(error, suggestions.slice(0, this.options.maxResults).reverse());
	      }
	    }, this);
	
	    return request;
	  },
	
	  results: function (text, key, bounds, callback) {
	    var query = this.query();
	
	    if (key) {
	      query.featureIds([key]);
	    } else {
	      query.where(this._buildQuery(text));
	    }
	
	    if (bounds) {
	      query.within(bounds);
	    }
	
	    return query.run(_leaflet2.default.Util.bind(function (error, features) {
	      var results = [];
	      for (var i = 0; i < features.features.length; i++) {
	        var feature = features.features[i];
	        if (feature) {
	          var bounds = this._featureBounds(feature);
	
	          var result = {
	            latlng: bounds.getCenter(),
	            bounds: bounds,
	            text: this.options.formatSuggestion.call(this, feature),
	            properties: feature.properties
	          };
	
	          results.push(result);
	        }
	      }
	      callback(error, results);
	    }, this));
	  },
	
	  _buildQuery: function (text) {
	    var queryString = [];
	
	    for (var i = this.options.searchFields.length - 1; i >= 0; i--) {
	      var field = this.options.searchFields[i];
	      queryString.push(field + ' LIKE \'%' + text + '%\'');
	    }
	
	    return queryString.join(' OR ');
	  },
	
	  _featureBounds: function (feature) {
	    var geojson = _leaflet2.default.geoJson(feature);
	    if (feature.geometry.type === 'Point') {
	      var center = geojson.getBounds().getCenter();
	      var lngRadius = this.options.bufferRadius / 40075017 * 360 / Math.cos(180 / Math.PI * center.lat);
	      var latRadius = this.options.bufferRadius / 40075017 * 360;
	      return _leaflet2.default.latLngBounds([center.lat - latRadius, center.lng - lngRadius], [center.lat + latRadius, center.lng + lngRadius]);
	    } else {
	      return geojson.getBounds();
	    }
	  }
	});
	
	exports.FeatureLayerProvider = FeatureLayerProvider;
	
	function featureLayerProvider(options) {
	  return new FeatureLayerProvider(options);
	}
	
	exports.default = featureLayerProvider;

/***/ },
/* 33 */
/*!*************************************************************!*\
  !*** ./~/esri-leaflet-geocoder/src/Providers/MapService.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.mapServiceProvider = mapServiceProvider;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _leaflet = __webpack_require__(/*! leaflet */ 1);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	var _esriLeaflet = __webpack_require__(/*! esri-leaflet */ 2);
	
	var MapServiceProvider = _esriLeaflet.MapService.extend({
	  options: {
	    layers: [0],
	    label: 'Map Service',
	    bufferRadius: 1000,
	    maxResults: 5,
	    formatSuggestion: function (feature) {
	      return feature.properties[feature.displayFieldName] + ' <small>' + feature.layerName + '</small>';
	    }
	  },
	
	  initialize: function (options) {
	    _esriLeaflet.MapService.prototype.initialize.call(this, options);
	    this._getIdFields();
	  },
	
	  suggestions: function (text, bounds, callback) {
	    var request = this.find().text(text).fields(this.options.searchFields).returnGeometry(false).layers(this.options.layers);
	
	    return request.run(function (error, results, raw) {
	      var suggestions = [];
	      if (!error) {
	        var count = Math.min(this.options.maxResults, results.features.length);
	        raw.results = raw.results.reverse();
	        for (var i = 0; i < count; i++) {
	          var feature = results.features[i];
	          var result = raw.results[i];
	          var layer = result.layerId;
	          var idField = this._idFields[layer];
	          feature.layerId = layer;
	          feature.layerName = this._layerNames[layer];
	          feature.displayFieldName = this._displayFields[layer];
	          if (idField) {
	            suggestions.push({
	              text: this.options.formatSuggestion.call(this, feature),
	              magicKey: result.attributes[idField] + ':' + layer
	            });
	          }
	        }
	      }
	      callback(error, suggestions.reverse());
	    }, this);
	  },
	
	  results: function (text, key, bounds, callback) {
	    var results = [];
	    var request;
	
	    if (key) {
	      var featureId = key.split(':')[0];
	      var layer = key.split(':')[1];
	      request = this.query().layer(layer).featureIds(featureId);
	    } else {
	      request = this.find().text(text).fields(this.options.searchFields).contains(false).layers(this.options.layers);
	    }
	
	    return request.run(function (error, features, response) {
	      if (!error) {
	        if (response.results) {
	          response.results = response.results.reverse();
	        }
	        for (var i = 0; i < features.features.length; i++) {
	          var feature = features.features[i];
	          layer = layer ? layer : response.results[i].layerId;
	          if (feature && layer !== undefined) {
	            var bounds = this._featureBounds(feature);
	            feature.layerId = layer;
	            feature.layerName = this._layerNames[layer];
	            feature.displayFieldName = this._displayFields[layer];
	            var result = {
	              latlng: bounds.getCenter(),
	              bounds: bounds,
	              text: this.options.formatSuggestion.call(this, feature),
	              properties: feature.properties
	            };
	            results.push(result);
	          }
	        }
	      }
	      callback(error, results.reverse());
	    }, this);
	  },
	
	  _featureBounds: function (feature) {
	    var geojson = _leaflet2.default.geoJson(feature);
	    if (feature.geometry.type === 'Point') {
	      var center = geojson.getBounds().getCenter();
	      var lngRadius = this.options.bufferRadius / 40075017 * 360 / Math.cos(180 / Math.PI * center.lat);
	      var latRadius = this.options.bufferRadius / 40075017 * 360;
	      return _leaflet2.default.latLngBounds([center.lat - latRadius, center.lng - lngRadius], [center.lat + latRadius, center.lng + lngRadius]);
	    } else {
	      return geojson.getBounds();
	    }
	  },
	
	  _layerMetadataCallback: function (layerid) {
	    return _leaflet2.default.Util.bind(function (error, metadata) {
	      if (error) {
	        return;
	      }
	      this._displayFields[layerid] = metadata.displayField;
	      this._layerNames[layerid] = metadata.name;
	      for (var i = 0; i < metadata.fields.length; i++) {
	        var field = metadata.fields[i];
	        if (field.type === 'esriFieldTypeOID') {
	          this._idFields[layerid] = field.name;
	          break;
	        }
	      }
	    }, this);
	  },
	
	  _getIdFields: function () {
	    this._idFields = {};
	    this._displayFields = {};
	    this._layerNames = {};
	    for (var i = 0; i < this.options.layers.length; i++) {
	      var layer = this.options.layers[i];
	      this.get(layer, {}, this._layerMetadataCallback(layer));
	    }
	  }
	});
	
	exports.MapServiceProvider = MapServiceProvider;
	
	function mapServiceProvider(options) {
	  return new MapServiceProvider(options);
	}
	
	exports.default = mapServiceProvider;

/***/ },
/* 34 */
/*!*****************************************************************!*\
  !*** ./~/esri-leaflet-geocoder/src/Providers/GeocodeService.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.__esModule = true;
	exports.geocodeServiceProvider = geocodeServiceProvider;
	
	var _ServicesGeocode = __webpack_require__(/*! ../Services/Geocode */ 29);
	
	var GeocodeServiceProvider = _ServicesGeocode.GeocodeService.extend({
	  options: {
	    label: 'Geocode Server',
	    maxResults: 5
	  },
	
	  suggestions: function (text, bounds, callback) {
	
	    if (this.options.supportsSuggest) {
	      var request = this.suggest().text(text);
	      if (bounds) {
	        request.within(bounds);
	      }
	
	      return request.run(function (error, results, response) {
	        var suggestions = [];
	        if (!error) {
	          while (response.suggestions.length && suggestions.length <= this.options.maxResults - 1) {
	            var suggestion = response.suggestions.shift();
	            if (!suggestion.isCollection) {
	              suggestions.push({
	                text: suggestion.text,
	                magicKey: suggestion.magicKey
	              });
	            }
	          }
	        }
	        callback(error, suggestions);
	      }, this);
	    } else {
	      callback(undefined, []);
	      return false;
	    }
	  },
	
	  results: function (text, key, bounds, callback) {
	    var request = this.geocode().text(text);
	
	    request.maxLocations(this.options.maxResults);
	
	    if (bounds) {
	      request.within(bounds);
	    }
	
	    return request.run(function (error, response) {
	      callback(error, response.results);
	    }, this);
	  }
	});
	
	exports.GeocodeServiceProvider = GeocodeServiceProvider;
	
	function geocodeServiceProvider(options) {
	  return new GeocodeServiceProvider(options);
	}
	
	exports.default = geocodeServiceProvider;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map