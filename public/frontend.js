//#region node_modules/.pnpm/htmx.org@2.0.10/node_modules/htmx.org/dist/htmx.esm.js
var htmx = (function() {
	"use strict";
	const htmx = {
		/** @type {typeof onLoadHelper} */
		onLoad: null,
		/** @type {typeof processNode} */
		process: null,
		/** @type {typeof addEventListenerImpl} */
		on: null,
		/** @type {typeof removeEventListenerImpl} */
		off: null,
		/** @type {typeof triggerEvent} */
		trigger: null,
		/** @type {typeof ajaxHelper} */
		ajax: null,
		/** @type {typeof find} */
		find: null,
		/** @type {typeof findAll} */
		findAll: null,
		/** @type {typeof closest} */
		closest: null,
		/**
		* Returns the input values that would resolve for a given element via the htmx value resolution mechanism
		*
		* @see https://htmx.org/api/#values
		*
		* @param {Element} elt the element to resolve values on
		* @param {HttpVerb} type the request type (e.g. **get** or **post**) non-GET's will include the enclosing form of the element. Defaults to **post**
		* @returns {Object}
		*/
		values: function(elt, type) {
			return getInputValues(elt, type || "post").values;
		},
		/** @type {typeof removeElement} */
		remove: null,
		/** @type {typeof addClassToElement} */
		addClass: null,
		/** @type {typeof removeClassFromElement} */
		removeClass: null,
		/** @type {typeof toggleClassOnElement} */
		toggleClass: null,
		/** @type {typeof takeClassForElement} */
		takeClass: null,
		/** @type {typeof swap} */
		swap: null,
		/** @type {typeof defineExtension} */
		defineExtension: null,
		/** @type {typeof removeExtension} */
		removeExtension: null,
		/** @type {typeof logAll} */
		logAll: null,
		/** @type {typeof logNone} */
		logNone: null,
		/**
		* The logger htmx uses to log with
		*
		* @see https://htmx.org/api/#logger
		*/
		logger: null,
		/**
		* A property holding the configuration htmx uses at runtime.
		*
		* Note that using a [meta tag](https://htmx.org/docs/#config) is the preferred mechanism for setting these properties.
		*
		* @see https://htmx.org/api/#config
		*/
		config: {
			/**
			* Whether to use history.
			* @type boolean
			* @default true
			*/
			historyEnabled: true,
			/**
			* The number of pages to keep in **sessionStorage** for history support.
			* @type number
			* @default 10
			*/
			historyCacheSize: 10,
			/**
			* @type boolean
			* @default false
			*/
			refreshOnHistoryMiss: false,
			/**
			* The default swap style to use if **[hx-swap](https://htmx.org/attributes/hx-swap)** is omitted.
			* @type HtmxSwapStyle
			* @default 'innerHTML'
			*/
			defaultSwapStyle: "innerHTML",
			/**
			* The default delay between receiving a response from the server and doing the swap.
			* @type number
			* @default 0
			*/
			defaultSwapDelay: 0,
			/**
			* The default delay between completing the content swap and settling attributes.
			* @type number
			* @default 20
			*/
			defaultSettleDelay: 20,
			/**
			* If true, htmx will inject a small amount of CSS into the page to make indicators invisible unless the **htmx-indicator** class is present.
			* @type boolean
			* @default true
			*/
			includeIndicatorStyles: true,
			/**
			* The class to place on indicators when a request is in flight.
			* @type string
			* @default 'htmx-indicator'
			*/
			indicatorClass: "htmx-indicator",
			/**
			* The class to place on triggering elements when a request is in flight.
			* @type string
			* @default 'htmx-request'
			*/
			requestClass: "htmx-request",
			/**
			* The class to temporarily place on elements that htmx has added to the DOM.
			* @type string
			* @default 'htmx-added'
			*/
			addedClass: "htmx-added",
			/**
			* The class to place on target elements when htmx is in the settling phase.
			* @type string
			* @default 'htmx-settling'
			*/
			settlingClass: "htmx-settling",
			/**
			* The class to place on target elements when htmx is in the swapping phase.
			* @type string
			* @default 'htmx-swapping'
			*/
			swappingClass: "htmx-swapping",
			/**
			* Allows the use of eval-like functionality in htmx, to enable **hx-vars**, trigger conditions & script tag evaluation. Can be set to **false** for CSP compatibility.
			* @type boolean
			* @default true
			*/
			allowEval: true,
			/**
			* If set to false, disables the interpretation of script tags.
			* @type boolean
			* @default true
			*/
			allowScriptTags: true,
			/**
			* If set, the nonce will be added to inline scripts.
			* @type string
			* @default ''
			*/
			inlineScriptNonce: "",
			/**
			* If set, the nonce will be added to inline styles.
			* @type string
			* @default ''
			*/
			inlineStyleNonce: "",
			/**
			* The attributes to settle during the settling phase.
			* @type string[]
			* @default ['class', 'style', 'width', 'height']
			*/
			attributesToSettle: [
				"class",
				"style",
				"width",
				"height"
			],
			/**
			* Allow cross-site Access-Control requests using credentials such as cookies, authorization headers or TLS client certificates.
			* @type boolean
			* @default false
			*/
			withCredentials: false,
			/**
			* @type number
			* @default 0
			*/
			timeout: 0,
			/**
			* The default implementation of **getWebSocketReconnectDelay** for reconnecting after unexpected connection loss by the event code **Abnormal Closure**, **Service Restart** or **Try Again Later**.
			* @type {'full-jitter' | ((retryCount:number) => number)}
			* @default "full-jitter"
			*/
			wsReconnectDelay: "full-jitter",
			/**
			* The type of binary data being received over the WebSocket connection
			* @type BinaryType
			* @default 'blob'
			*/
			wsBinaryType: "blob",
			/**
			* @type string
			* @default '[hx-disable], [data-hx-disable]'
			*/
			disableSelector: "[hx-disable], [data-hx-disable]",
			/**
			* @type {'auto' | 'instant' | 'smooth'}
			* @default 'instant'
			*/
			scrollBehavior: "instant",
			/**
			* If the focused element should be scrolled into view.
			* @type boolean
			* @default false
			*/
			defaultFocusScroll: false,
			/**
			* If set to true htmx will include a cache-busting parameter in GET requests to avoid caching partial responses by the browser
			* @type boolean
			* @default false
			*/
			getCacheBusterParam: false,
			/**
			* If set to true, htmx will use the View Transition API when swapping in new content.
			* @type boolean
			* @default false
			*/
			globalViewTransitions: false,
			/**
			* htmx will format requests with these methods by encoding their parameters in the URL, not the request body
			* @type {(HttpVerb)[]}
			* @default ['get', 'delete']
			*/
			methodsThatUseUrlParams: ["get", "delete"],
			/**
			* If set to true, disables htmx-based requests to non-origin hosts.
			* @type boolean
			* @default false
			*/
			selfRequestsOnly: true,
			/**
			* If set to true htmx will not update the title of the document when a title tag is found in new content
			* @type boolean
			* @default false
			*/
			ignoreTitle: false,
			/**
			* Whether the target of a boosted element is scrolled into the viewport.
			* @type boolean
			* @default true
			*/
			scrollIntoViewOnBoost: true,
			/**
			* The cache to store evaluated trigger specifications into.
			* You may define a simple object to use a never-clearing cache, or implement your own system using a [proxy object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
			* @type {Object|null}
			* @default null
			*/
			triggerSpecsCache: null,
			/** @type boolean */
			disableInheritance: false,
			/** @type HtmxResponseHandlingConfig[] */
			responseHandling: [
				{
					code: "204",
					swap: false
				},
				{
					code: "[23]..",
					swap: true
				},
				{
					code: "[45]..",
					swap: false,
					error: true
				}
			],
			/**
			* Whether to process OOB swaps on elements that are nested within the main response element.
			* @type boolean
			* @default true
			*/
			allowNestedOobSwaps: true,
			/**
			* Whether to treat history cache miss full page reload requests as a "HX-Request" by returning this response header
			* This should always be disabled when using HX-Request header to optionally return partial responses
			* @type boolean
			* @default true
			*/
			historyRestoreAsHxRequest: true,
			/**
			* Whether to report input validation errors to the end user and update focus to the first input that fails validation.
			* This should always be enabled as this matches default browser form submit behaviour
			* @type boolean
			* @default false
			*/
			reportValidityOfForms: false
		},
		/** @type {typeof parseInterval} */
		parseInterval: null,
		/**
		* proxy of window.location used for page reload functions
		* @type location
		*/
		location,
		/** @type {typeof internalEval} */
		_: null,
		version: "2.0.10"
	};
	htmx.onLoad = onLoadHelper;
	htmx.process = processNode;
	htmx.on = addEventListenerImpl;
	htmx.off = removeEventListenerImpl;
	htmx.trigger = triggerEvent;
	htmx.ajax = ajaxHelper;
	htmx.find = find;
	htmx.findAll = findAll;
	htmx.closest = closest;
	htmx.remove = removeElement;
	htmx.addClass = addClassToElement;
	htmx.removeClass = removeClassFromElement;
	htmx.toggleClass = toggleClassOnElement;
	htmx.takeClass = takeClassForElement;
	htmx.swap = swap;
	htmx.defineExtension = defineExtension;
	htmx.removeExtension = removeExtension;
	htmx.logAll = logAll;
	htmx.logNone = logNone;
	htmx.parseInterval = parseInterval;
	htmx._ = internalEval;
	const internalAPI = {
		addTriggerHandler,
		bodyContains,
		canAccessLocalStorage,
		findThisElement,
		filterValues,
		swap,
		hasAttribute,
		getAttributeValue,
		getClosestAttributeValue,
		getClosestMatch,
		getExpressionVars,
		getHeaders,
		getInputValues,
		getInternalData,
		getSwapSpecification,
		getTriggerSpecs,
		getTarget,
		makeFragment,
		mergeObjects,
		makeSettleInfo,
		oobSwap,
		querySelectorExt,
		settleImmediately,
		shouldCancel,
		triggerEvent,
		triggerErrorEvent,
		withExtensions
	};
	const VERBS = [
		"get",
		"post",
		"put",
		"delete",
		"patch"
	];
	const VERB_SELECTOR = VERBS.map(function(verb) {
		return "[hx-" + verb + "], [data-hx-" + verb + "]";
	}).join(", ");
	/**
	* Parses an interval string consistent with the way htmx does. Useful for plugins that have timing-related attributes.
	*
	* Caution: Accepts an int followed by either **s** or **ms**. All other values use **parseFloat**
	*
	* @see https://htmx.org/api/#parseInterval
	*
	* @param {string} str timing string
	* @returns {number|undefined}
	*/
	function parseInterval(str) {
		if (str == void 0) return;
		let interval = NaN;
		if (str.slice(-2) == "ms") interval = parseFloat(str.slice(0, -2));
		else if (str.slice(-1) == "s") interval = parseFloat(str.slice(0, -1)) * 1e3;
		else if (str.slice(-1) == "m") interval = parseFloat(str.slice(0, -1)) * 1e3 * 60;
		else interval = parseFloat(str);
		return isNaN(interval) ? void 0 : interval;
	}
	/**
	* @param {Node} elt
	* @param {string} name
	* @returns {(string | null)}
	*/
	function getRawAttribute(elt, name) {
		return elt instanceof Element && elt.getAttribute(name);
	}
	/**
	* @param {Element} elt
	* @param {string} qualifiedName
	* @returns {boolean}
	*/
	function hasAttribute(elt, qualifiedName) {
		return !!elt.hasAttribute && (elt.hasAttribute(qualifiedName) || elt.hasAttribute("data-" + qualifiedName));
	}
	/**
	*
	* @param {Node} elt
	* @param {string} qualifiedName
	* @returns {(string | null)}
	*/
	function getAttributeValue(elt, qualifiedName) {
		return getRawAttribute(elt, qualifiedName) || getRawAttribute(elt, "data-" + qualifiedName);
	}
	/**
	* @param {Node} elt
	* @returns {Node | null}
	*/
	function parentElt(elt) {
		const parent = elt.parentElement;
		if (!parent && elt.parentNode instanceof ShadowRoot) return elt.parentNode;
		return parent;
	}
	/**
	* @returns {Document}
	*/
	function getDocument() {
		return document;
	}
	/**
	* @param {Node} elt
	* @param {boolean} global
	* @returns {Node|Document}
	*/
	function getRootNode(elt, global) {
		return elt.getRootNode ? elt.getRootNode({ composed: global }) : getDocument();
	}
	/**
	* @param {Node} elt
	* @param {(e:Node) => boolean} condition
	* @returns {Node | null}
	*/
	function getClosestMatch(elt, condition) {
		while (elt && !condition(elt)) elt = parentElt(elt);
		return elt || null;
	}
	/**
	* @param {Element} initialElement
	* @param {Element} ancestor
	* @param {string} attributeName
	* @returns {string|null}
	*/
	function getAttributeValueWithDisinheritance(initialElement, ancestor, attributeName) {
		const attributeValue = getAttributeValue(ancestor, attributeName);
		const disinherit = getAttributeValue(ancestor, "hx-disinherit");
		var inherit = getAttributeValue(ancestor, "hx-inherit");
		if (initialElement !== ancestor) {
			if (htmx.config.disableInheritance) if (inherit && (inherit === "*" || inherit.split(" ").indexOf(attributeName) >= 0)) return attributeValue;
			else return null;
			if (disinherit && (disinherit === "*" || disinherit.split(" ").indexOf(attributeName) >= 0)) return "unset";
		}
		return attributeValue;
	}
	/**
	* @param {Element} elt
	* @param {string} attributeName
	* @returns {string | null}
	*/
	function getClosestAttributeValue(elt, attributeName) {
		let closestAttr = null;
		getClosestMatch(elt, function(e) {
			return !!(closestAttr = getAttributeValueWithDisinheritance(elt, asElement(e), attributeName));
		});
		if (closestAttr !== "unset") return closestAttr;
	}
	/**
	* @param {Node} elt
	* @param {string} selector
	* @returns {boolean}
	*/
	function matches(elt, selector) {
		return elt instanceof Element && elt.matches(selector);
	}
	/**
	* @param {string} str
	* @returns {string}
	*/
	function getStartTag(str) {
		const match = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i.exec(str);
		if (match) return match[1].toLowerCase();
		else return "";
	}
	/**
	* @param {string} resp
	* @returns {Document}
	*/
	function parseHTML(resp) {
		if ("parseHTMLUnsafe" in Document) return Document.parseHTMLUnsafe(resp);
		return new DOMParser().parseFromString(resp, "text/html");
	}
	/**
	* @param {DocumentFragment} fragment
	* @param {Node} elt
	*/
	function takeChildrenFor(fragment, elt) {
		while (elt.childNodes.length > 0) fragment.append(elt.childNodes[0]);
	}
	/**
	* @param {HTMLScriptElement} script
	* @returns {HTMLScriptElement}
	*/
	function duplicateScript(script) {
		const newScript = getDocument().createElement("script");
		forEach(script.attributes, function(attr) {
			newScript.setAttribute(attr.name, attr.value);
		});
		newScript.textContent = script.textContent;
		newScript.async = false;
		if (htmx.config.inlineScriptNonce) newScript.nonce = htmx.config.inlineScriptNonce;
		return newScript;
	}
	/**
	* @param {HTMLScriptElement} script
	* @returns {boolean}
	*/
	function isJavaScriptScriptNode(script) {
		return script.matches("script") && (script.type === "text/javascript" || script.type === "module" || script.type === "");
	}
	/**
	* we have to make new copies of script tags that we are going to insert because
	* SOME browsers (not saying who, but it involves an element and an animal) don't
	* execute scripts created in <template> tags when they are inserted into the DOM
	* and all the others do lmao
	* @param {DocumentFragment} fragment
	*/
	function normalizeScriptTags(fragment) {
		Array.from(fragment.querySelectorAll("script")).forEach(
			/** @param {HTMLScriptElement} script */
			(script) => {
				if (isJavaScriptScriptNode(script)) {
					const newScript = duplicateScript(script);
					const parent = script.parentNode;
					try {
						parent.insertBefore(newScript, script);
					} catch (e) {
						logError(e);
					} finally {
						script.remove();
					}
				}
			}
		);
	}
	/**
	* @typedef {DocumentFragment & {title?: string}} DocumentFragmentWithTitle
	* @description  a document fragment representing the response HTML, including
	* a `title` property for any title information found
	*/
	/**
	* @param {string} response HTML
	* @returns {DocumentFragmentWithTitle}
	*/
	function makeFragment(response) {
		const responseWithNoHead = response.replace(/<head(\s[^>]*)?>[\s\S]*?<\/head>/i, "");
		const startTag = getStartTag(responseWithNoHead);
		/** @type DocumentFragmentWithTitle */
		let fragment;
		if (startTag === "html") {
			fragment = new DocumentFragment();
			const doc = parseHTML(response);
			takeChildrenFor(fragment, doc.body);
			fragment.title = doc.title;
		} else if (startTag === "body") {
			fragment = new DocumentFragment();
			const doc = parseHTML(responseWithNoHead);
			takeChildrenFor(fragment, doc.body);
			fragment.title = doc.title;
		} else {
			const doc = parseHTML("<body><template class=\"internal-htmx-wrapper\">" + responseWithNoHead + "</template></body>");
			fragment = doc.querySelector("template").content;
			fragment.title = doc.title;
			var titleElement = fragment.querySelector("title");
			if (titleElement && titleElement.parentNode === fragment) {
				titleElement.remove();
				fragment.title = titleElement.innerText;
			}
		}
		if (fragment) if (htmx.config.allowScriptTags) normalizeScriptTags(fragment);
		else fragment.querySelectorAll("script").forEach((script) => script.remove());
		return fragment;
	}
	/**
	* @param {Function} func
	*/
	function maybeCall(func) {
		if (func) func();
	}
	/**
	* @param {any} o
	* @param {string} type
	* @returns
	*/
	function isType(o, type) {
		return Object.prototype.toString.call(o) === "[object " + type + "]";
	}
	/**
	* @param {*} o
	* @returns {o is Function}
	*/
	function isFunction(o) {
		return typeof o === "function";
	}
	/**
	* @param {*} o
	* @returns {o is Object}
	*/
	function isRawObject(o) {
		return isType(o, "Object");
	}
	/**
	* @typedef {Object} OnHandler
	* @property {(keyof HTMLElementEventMap)|string} event
	* @property {EventListener} listener
	*/
	/**
	* @typedef {Object} ListenerInfo
	* @property {string} trigger
	* @property {EventListener} listener
	* @property {EventTarget} on
	*/
	/**
	* @typedef {Object} HtmxNodeInternalData
	* Element data
	* @property {number} [initHash]
	* @property {boolean} [boosted]
	* @property {OnHandler[]} [onHandlers]
	* @property {number} [timeout]
	* @property {ListenerInfo[]} [listenerInfos]
	* @property {boolean} [cancelled]
	* @property {boolean} [triggeredOnce]
	* @property {number} [delayed]
	* @property {number|null} [throttle]
	* @property {WeakMap<HtmxTriggerSpecification,WeakMap<EventTarget,string>>} [lastValue]
	* @property {boolean} [loaded]
	* @property {string} [path]
	* @property {string} [verb]
	* @property {boolean} [polling]
	* @property {HTMLButtonElement|HTMLInputElement|null} [lastButtonClicked]
	* @property {number} [requestCount]
	* @property {XMLHttpRequest} [xhr]
	* @property {(() => void)[]} [queuedRequests]
	* @property {boolean} [abortable]
	* @property {boolean} [firstInitCompleted]
	*
	* Event data
	* @property {HtmxTriggerSpecification} [triggerSpec]
	* @property {EventTarget[]} [handledFor]
	*/
	/**
	* getInternalData retrieves "private" data stored by htmx within an element
	* @param {EventTarget|Event} elt
	* @returns {HtmxNodeInternalData}
	*/
	function getInternalData(elt) {
		const dataProp = "htmx-internal-data";
		let data = elt[dataProp];
		if (!data) data = elt[dataProp] = {};
		return data;
	}
	/**
	* toArray converts an ArrayLike object into a real array.
	* @template T
	* @param {ArrayLike<T>} arr
	* @returns {T[]}
	*/
	function toArray(arr) {
		const returnArr = [];
		if (arr) for (let i = 0; i < arr.length; i++) returnArr.push(arr[i]);
		return returnArr;
	}
	/**
	* @template T
	* @param {T[]|NamedNodeMap|HTMLCollection|HTMLFormControlsCollection|ArrayLike<T>} arr
	* @param {(T) => void} func
	*/
	function forEach(arr, func) {
		if (arr) for (let i = 0; i < arr.length; i++) func(arr[i]);
	}
	/**
	* @param {Element} el
	* @returns {boolean}
	*/
	function isScrolledIntoView(el) {
		const rect = el.getBoundingClientRect();
		const elemTop = rect.top;
		const elemBottom = rect.bottom;
		return elemTop < window.innerHeight && elemBottom >= 0;
	}
	/**
	* Checks whether the element is in the document (includes shadow roots).
	* This function this is a slight misnomer; it will return true even for elements in the head.
	*
	* @param {Node} elt
	* @returns {boolean}
	*/
	function bodyContains(elt) {
		return elt.getRootNode({ composed: true }) === document;
	}
	/**
	* @param {string} trigger
	* @returns {string[]}
	*/
	function splitOnWhitespace(trigger) {
		return trigger.trim().split(/\s+/);
	}
	/**
	* mergeObjects takes all the keys from
	* obj2 and duplicates them into obj1
	* @template T1
	* @template T2
	* @param {T1} obj1
	* @param {T2} obj2
	* @returns {T1 & T2}
	*/
	function mergeObjects(obj1, obj2) {
		for (const key in obj2) if (obj2.hasOwnProperty(key)) obj1[key] = obj2[key];
		return obj1;
	}
	/**
	* @param {string} jString
	* @returns {any|null}
	*/
	function parseJSON(jString) {
		try {
			return JSON.parse(jString);
		} catch (error) {
			logError(error);
			return null;
		}
	}
	/**
	* @returns {boolean}
	*/
	function canAccessLocalStorage() {
		const test = "htmx:sessionStorageTest";
		try {
			sessionStorage.setItem(test, test);
			sessionStorage.removeItem(test);
			return true;
		} catch (e) {
			return false;
		}
	}
	/**
	* @param {string} path
	* @returns {string}
	*/
	function normalizePath(path) {
		try {
			const url = new URL(path, window.location.href);
			path = url.pathname + url.search;
		} catch (e) {}
		if (path != "/") path = path.replace(/\/+$/, "");
		return path;
	}
	/**
	* @param {string} str
	* @returns {any}
	*/
	function internalEval(str) {
		return maybeEval(getDocument().body, function() {
			return eval(str);
		});
	}
	/**
	* Adds a callback for the **htmx:load** event. This can be used to process new content, for example initializing the content with a javascript library
	*
	* @see https://htmx.org/api/#onLoad
	*
	* @param {(elt: Node) => void} callback the callback to call on newly loaded content
	* @returns {EventListener}
	*/
	function onLoadHelper(callback) {
		return htmx.on(
			"htmx:load",
			/** @param {CustomEvent} evt */
			function(evt) {
				callback(evt.detail.elt);
			}
		);
	}
	/**
	* Log all htmx events, useful for debugging.
	*
	* @see https://htmx.org/api/#logAll
	*/
	function logAll() {
		htmx.logger = function(elt, event, data) {
			if (console) console.log(event, elt, data);
		};
	}
	function logNone() {
		htmx.logger = null;
	}
	/**
	* Finds an element matching the selector
	*
	* @see https://htmx.org/api/#find
	*
	* @param {ParentNode|string} eltOrSelector  the root element to find the matching element in, inclusive | the selector to match
	* @param {string} [selector] the selector to match
	* @returns {Element|null}
	*/
	function find(eltOrSelector, selector) {
		if (typeof eltOrSelector !== "string") return eltOrSelector.querySelector(selector);
		else return find(getDocument(), eltOrSelector);
	}
	/**
	* Finds all elements matching the selector
	*
	* @see https://htmx.org/api/#findAll
	*
	* @param {ParentNode|string} eltOrSelector the root element to find the matching elements in, inclusive | the selector to match
	* @param {string} [selector] the selector to match
	* @returns {NodeListOf<Element>}
	*/
	function findAll(eltOrSelector, selector) {
		if (typeof eltOrSelector !== "string") return eltOrSelector.querySelectorAll(selector);
		else return findAll(getDocument(), eltOrSelector);
	}
	/**
	* @returns Window
	*/
	function getWindow() {
		return window;
	}
	/**
	* Removes an element from the DOM
	*
	* @see https://htmx.org/api/#remove
	*
	* @param {Node} elt
	* @param {number} [delay]
	*/
	function removeElement(elt, delay) {
		elt = resolveTarget(elt);
		if (delay) getWindow().setTimeout(function() {
			removeElement(elt);
			elt = null;
		}, delay);
		else parentElt(elt).removeChild(elt);
	}
	/**
	* @param {any} elt
	* @return {Element|null}
	*/
	function asElement(elt) {
		return elt instanceof Element ? elt : null;
	}
	/**
	* @param {any} elt
	* @return {HTMLElement|null}
	*/
	function asHtmlElement(elt) {
		return elt instanceof HTMLElement ? elt : null;
	}
	/**
	* @param {any} value
	* @return {string|null}
	*/
	function asString(value) {
		return typeof value === "string" ? value : null;
	}
	/**
	* @param {EventTarget} elt
	* @return {ParentNode|null}
	*/
	function asParentNode(elt) {
		return elt instanceof Element || elt instanceof Document || elt instanceof DocumentFragment ? elt : null;
	}
	/**
	* This method adds a class to the given element.
	*
	* @see https://htmx.org/api/#addClass
	*
	* @param {Element|string} elt the element to add the class to
	* @param {string} clazz the class to add
	* @param {number} [delay] the delay (in milliseconds) before class is added
	*/
	function addClassToElement(elt, clazz, delay) {
		elt = asElement(resolveTarget(elt));
		if (!elt) return;
		if (delay) getWindow().setTimeout(function() {
			addClassToElement(elt, clazz);
			elt = null;
		}, delay);
		else elt.classList && elt.classList.add(clazz);
	}
	/**
	* Removes a class from the given element
	*
	* @see https://htmx.org/api/#removeClass
	*
	* @param {Node|string} node element to remove the class from
	* @param {string} clazz the class to remove
	* @param {number} [delay] the delay (in milliseconds before class is removed)
	*/
	function removeClassFromElement(node, clazz, delay) {
		let elt = asElement(resolveTarget(node));
		if (!elt) return;
		if (delay) getWindow().setTimeout(function() {
			removeClassFromElement(elt, clazz);
			elt = null;
		}, delay);
		else if (elt.classList) {
			elt.classList.remove(clazz);
			if (elt.classList.length === 0) elt.removeAttribute("class");
		}
	}
	/**
	* Toggles the given class on an element
	*
	* @see https://htmx.org/api/#toggleClass
	*
	* @param {Element|string} elt the element to toggle the class on
	* @param {string} clazz the class to toggle
	*/
	function toggleClassOnElement(elt, clazz) {
		elt = resolveTarget(elt);
		elt.classList.toggle(clazz);
	}
	/**
	* Takes the given class from its siblings, so that among its siblings, only the given element will have the class.
	*
	* @see https://htmx.org/api/#takeClass
	*
	* @param {Node|string} elt the element that will take the class
	* @param {string} clazz the class to take
	*/
	function takeClassForElement(elt, clazz) {
		elt = resolveTarget(elt);
		forEach(elt.parentElement.children, function(child) {
			removeClassFromElement(child, clazz);
		});
		addClassToElement(asElement(elt), clazz);
	}
	/**
	* Finds the closest matching element in the given elements parentage, inclusive of the element
	*
	* @see https://htmx.org/api/#closest
	*
	* @param {Element|string} elt the element to find the selector from
	* @param {string} selector the selector to find
	* @returns {Element|null}
	*/
	function closest(elt, selector) {
		elt = asElement(resolveTarget(elt));
		if (elt) return elt.closest(selector);
		return null;
	}
	/**
	* @param {string} str
	* @param {string} prefix
	* @returns {boolean}
	*/
	function startsWith(str, prefix) {
		return str.substring(0, prefix.length) === prefix;
	}
	/**
	* @param {string} str
	* @param {string} suffix
	* @returns {boolean}
	*/
	function endsWith(str, suffix) {
		return str.substring(str.length - suffix.length) === suffix;
	}
	/**
	* @param {string} selector
	* @returns {string}
	*/
	function normalizeSelector(selector) {
		const trimmedSelector = selector.trim();
		if (startsWith(trimmedSelector, "<") && endsWith(trimmedSelector, "/>")) return trimmedSelector.substring(1, trimmedSelector.length - 2);
		else return trimmedSelector;
	}
	/**
	* @param {Node|Element|Document|string} elt
	* @param {string} selector
	* @param {boolean=} global
	* @returns {(Node|Window)[]}
	*/
	function querySelectorAllExt(elt, selector, global) {
		if (selector.indexOf("global ") === 0) return querySelectorAllExt(elt, selector.slice(7), true);
		elt = resolveTarget(elt);
		const parts = [];
		{
			let chevronsCount = 0;
			let offset = 0;
			for (let i = 0; i < selector.length; i++) {
				const char = selector[i];
				if (char === "," && chevronsCount === 0) {
					parts.push(selector.substring(offset, i));
					offset = i + 1;
					continue;
				}
				if (char === "<") chevronsCount++;
				else if (char === "/" && i < selector.length - 1 && selector[i + 1] === ">") chevronsCount--;
			}
			if (offset < selector.length) parts.push(selector.substring(offset));
		}
		const result = [];
		const unprocessedParts = [];
		while (parts.length > 0) {
			const selector = normalizeSelector(parts.shift());
			let item;
			if (selector.indexOf("closest ") === 0) item = closest(asElement(elt), normalizeSelector(selector.slice(8)));
			else if (selector.indexOf("find ") === 0) item = find(asParentNode(elt), normalizeSelector(selector.slice(5)));
			else if (selector === "next" || selector === "nextElementSibling") item = asElement(elt).nextElementSibling;
			else if (selector.indexOf("next ") === 0) item = scanForwardQuery(elt, normalizeSelector(selector.slice(5)), !!global);
			else if (selector === "previous" || selector === "previousElementSibling") item = asElement(elt).previousElementSibling;
			else if (selector.indexOf("previous ") === 0) item = scanBackwardsQuery(elt, normalizeSelector(selector.slice(9)), !!global);
			else if (selector === "document") item = document;
			else if (selector === "window") item = window;
			else if (selector === "body") item = document.body;
			else if (selector === "root") item = getRootNode(elt, !!global);
			else if (selector === "host") item = elt.getRootNode().host;
			else unprocessedParts.push(selector);
			if (item) result.push(item);
		}
		if (unprocessedParts.length > 0) {
			const standardSelector = unprocessedParts.join(",");
			const rootNode = asParentNode(getRootNode(elt, !!global));
			result.push(...toArray(rootNode.querySelectorAll(standardSelector)));
		}
		return result;
	}
	/**
	* @param {Node} start
	* @param {string} match
	* @param {boolean} global
	* @returns {Element}
	*/
	var scanForwardQuery = function(start, match, global) {
		const results = asParentNode(getRootNode(start, global)).querySelectorAll(match);
		for (let i = 0; i < results.length; i++) {
			const elt = results[i];
			if (elt.compareDocumentPosition(start) === Node.DOCUMENT_POSITION_PRECEDING) return elt;
		}
	};
	/**
	* @param {Node} start
	* @param {string} match
	* @param {boolean} global
	* @returns {Element}
	*/
	var scanBackwardsQuery = function(start, match, global) {
		const results = asParentNode(getRootNode(start, global)).querySelectorAll(match);
		for (let i = results.length - 1; i >= 0; i--) {
			const elt = results[i];
			if (elt.compareDocumentPosition(start) === Node.DOCUMENT_POSITION_FOLLOWING) return elt;
		}
	};
	/**
	* @param {Node|string} eltOrSelector
	* @param {string=} selector
	* @returns {Node|Window}
	*/
	function querySelectorExt(eltOrSelector, selector) {
		if (typeof eltOrSelector !== "string") return querySelectorAllExt(eltOrSelector, selector)[0];
		else return querySelectorAllExt(getDocument().body, eltOrSelector)[0];
	}
	/**
	* @template {EventTarget} T
	* @param {T|string} eltOrSelector
	* @param {T} [context]
	* @returns {Element|T|null}
	*/
	function resolveTarget(eltOrSelector, context) {
		if (typeof eltOrSelector === "string") return find(asParentNode(context) || document, eltOrSelector);
		else return eltOrSelector;
	}
	/**
	* @typedef {keyof HTMLElementEventMap|string} AnyEventName
	*/
	/**
	* @typedef {Object} EventArgs
	* @property {EventTarget} target
	* @property {AnyEventName} event
	* @property {EventListener} listener
	* @property {Object|boolean} options
	*/
	/**
	* @param {EventTarget|AnyEventName} arg1
	* @param {AnyEventName|EventListener} arg2
	* @param {EventListener|Object|boolean} [arg3]
	* @param {Object|boolean} [arg4]
	* @returns {EventArgs}
	*/
	function processEventArgs(arg1, arg2, arg3, arg4) {
		if (isFunction(arg2)) return {
			target: getDocument().body,
			event: asString(arg1),
			listener: arg2,
			options: arg3
		};
		else return {
			target: resolveTarget(arg1),
			event: asString(arg2),
			listener: arg3,
			options: arg4
		};
	}
	/**
	* Adds an event listener to an element
	*
	* @see https://htmx.org/api/#on
	*
	* @param {EventTarget|string} arg1 the element to add the listener to | the event name to add the listener for
	* @param {string|EventListener} arg2 the event name to add the listener for | the listener to add
	* @param {EventListener|Object|boolean} [arg3] the listener to add | options to add
	* @param {Object|boolean} [arg4] options to add
	* @returns {EventListener}
	*/
	function addEventListenerImpl(arg1, arg2, arg3, arg4) {
		ready(function() {
			const eventArgs = processEventArgs(arg1, arg2, arg3, arg4);
			eventArgs.target.addEventListener(eventArgs.event, eventArgs.listener, eventArgs.options);
		});
		return isFunction(arg2) ? arg2 : arg3;
	}
	/**
	* Removes an event listener from an element
	*
	* @see https://htmx.org/api/#off
	*
	* @param {EventTarget|string} arg1 the element to remove the listener from | the event name to remove the listener from
	* @param {string|EventListener} arg2 the event name to remove the listener from | the listener to remove
	* @param {EventListener} [arg3] the listener to remove
	* @returns {EventListener}
	*/
	function removeEventListenerImpl(arg1, arg2, arg3) {
		ready(function() {
			const eventArgs = processEventArgs(arg1, arg2, arg3);
			eventArgs.target.removeEventListener(eventArgs.event, eventArgs.listener);
		});
		return isFunction(arg2) ? arg2 : arg3;
	}
	const DUMMY_ELT = getDocument().createElement("output");
	/**
	* @param {Element} elt
	* @param {string} attrName
	* @returns {(Node|Window)[]}
	*/
	function findAttributeTargets(elt, attrName) {
		const attrTarget = getClosestAttributeValue(elt, attrName);
		if (attrTarget) if (attrTarget === "this") return [findThisElement(elt, attrName)];
		else {
			const result = querySelectorAllExt(elt, attrTarget);
			if (/(^|,)(\s*)inherit(\s*)($|,)/.test(attrTarget)) {
				const eltToInheritFrom = asElement(getClosestMatch(elt, function(parent) {
					return parent !== elt && hasAttribute(asElement(parent), attrName);
				}));
				if (eltToInheritFrom) result.push(...findAttributeTargets(eltToInheritFrom, attrName));
			}
			if (result.length === 0) {
				logError("The selector \"" + attrTarget + "\" on " + attrName + " returned no matches!");
				return [DUMMY_ELT];
			} else return result;
		}
	}
	/**
	* @param {Element} elt
	* @param {string} attribute
	* @returns {Element|null}
	*/
	function findThisElement(elt, attribute) {
		return asElement(getClosestMatch(elt, function(elt) {
			return getAttributeValue(asElement(elt), attribute) != null;
		}));
	}
	/**
	* @param {Element} elt
	* @returns {Node|Window|null}
	*/
	function getTarget(elt) {
		const targetStr = getClosestAttributeValue(elt, "hx-target");
		if (targetStr) if (targetStr === "this") return findThisElement(elt, "hx-target");
		else return querySelectorExt(elt, targetStr);
		else if (getInternalData(elt).boosted) return getDocument().body;
		else return elt;
	}
	/**
	* @param {string} name
	* @returns {boolean}
	*/
	function shouldSettleAttribute(name) {
		return htmx.config.attributesToSettle.includes(name);
	}
	/**
	* @param {Element} mergeTo
	* @param {Element} mergeFrom
	*/
	function cloneAttributes(mergeTo, mergeFrom) {
		forEach(Array.from(mergeTo.attributes), function(attr) {
			if (!mergeFrom.hasAttribute(attr.name) && shouldSettleAttribute(attr.name)) mergeTo.removeAttribute(attr.name);
		});
		forEach(mergeFrom.attributes, function(attr) {
			if (shouldSettleAttribute(attr.name)) mergeTo.setAttribute(attr.name, attr.value);
		});
	}
	/**
	* @param {HtmxSwapStyle} swapStyle
	* @param {Element} target
	* @returns {boolean}
	*/
	function isInlineSwap(swapStyle, target) {
		const extensions = getExtensions(target);
		for (let i = 0; i < extensions.length; i++) {
			const extension = extensions[i];
			try {
				if (extension.isInlineSwap(swapStyle)) return true;
			} catch (e) {
				logError(e);
			}
		}
		return swapStyle === "outerHTML";
	}
	/**
	* @param {string} oobValue
	* @param {Element} oobElement
	* @param {HtmxSettleInfo} settleInfo
	* @param {Node|Document} [rootNode]
	* @returns
	*/
	function oobSwap(oobValue, oobElement, settleInfo, rootNode) {
		rootNode = rootNode || getDocument();
		let selector = "#" + CSS.escape(getRawAttribute(oobElement, "id"));
		/** @type HtmxSwapStyle */
		let swapStyle = "outerHTML";
		if (oobValue === "true") {} else if (oobValue.indexOf(":") > 0) {
			swapStyle = oobValue.substring(0, oobValue.indexOf(":"));
			selector = oobValue.substring(oobValue.indexOf(":") + 1);
		} else swapStyle = oobValue;
		oobElement.removeAttribute("hx-swap-oob");
		oobElement.removeAttribute("data-hx-swap-oob");
		const targets = querySelectorAllExt(rootNode, selector, false);
		if (targets.length) {
			forEach(targets, function(target) {
				let fragment;
				const oobElementClone = oobElement.cloneNode(true);
				fragment = getDocument().createDocumentFragment();
				fragment.appendChild(oobElementClone);
				if (!isInlineSwap(swapStyle, target)) fragment = asParentNode(oobElementClone);
				const beforeSwapDetails = {
					shouldSwap: true,
					target,
					fragment
				};
				if (!triggerEvent(target, "htmx:oobBeforeSwap", beforeSwapDetails)) return;
				target = beforeSwapDetails.target;
				if (beforeSwapDetails.shouldSwap) {
					handlePreservedElements(fragment);
					swapWithStyle(swapStyle, target, target, fragment, settleInfo);
					restorePreservedElements();
				}
				forEach(settleInfo.elts, function(elt) {
					triggerEvent(elt, "htmx:oobAfterSwap", beforeSwapDetails);
				});
			});
			oobElement.parentNode.removeChild(oobElement);
		} else {
			oobElement.parentNode.removeChild(oobElement);
			triggerErrorEvent(getDocument().body, "htmx:oobErrorNoTarget", {
				content: oobElement,
				target: selector
			});
		}
		return oobValue;
	}
	function restorePreservedElements() {
		const pantry = find("#--htmx-preserve-pantry--");
		if (pantry) {
			for (const preservedElt of [...pantry.children]) {
				const existingElement = find("#" + preservedElt.id);
				existingElement.parentNode.moveBefore(preservedElt, existingElement);
				existingElement.remove();
			}
			pantry.remove();
		}
	}
	/**
	* @param {DocumentFragment|ParentNode} fragment
	*/
	function handlePreservedElements(fragment) {
		forEach(findAll(fragment, "[hx-preserve], [data-hx-preserve]"), function(preservedElt) {
			const id = getAttributeValue(preservedElt, "id");
			const existingElement = getDocument().getElementById(id);
			if (existingElement != null) if (preservedElt.moveBefore) {
				let pantry = find("#--htmx-preserve-pantry--");
				if (pantry == null) {
					getDocument().body.insertAdjacentHTML("afterend", "<div id='--htmx-preserve-pantry--'></div>");
					pantry = find("#--htmx-preserve-pantry--");
				}
				pantry.moveBefore(existingElement, null);
			} else preservedElt.parentNode.replaceChild(existingElement, preservedElt);
		});
	}
	/**
	* @param {Node} parentNode
	* @param {ParentNode} fragment
	* @param {HtmxSettleInfo} settleInfo
	*/
	function handleAttributes(parentNode, fragment, settleInfo) {
		forEach(fragment.querySelectorAll("[id]"), function(newNode) {
			const id = getRawAttribute(newNode, "id");
			if (id && id.length > 0) {
				const parentElt = asParentNode(parentNode);
				const oldNode = parentElt && parentElt.querySelector(CSS.escape(newNode.tagName) + "#" + CSS.escape(id));
				if (oldNode && oldNode !== parentElt) {
					const newAttributes = newNode.cloneNode();
					cloneAttributes(newNode, oldNode);
					settleInfo.tasks.push(function() {
						cloneAttributes(newNode, newAttributes);
					});
				}
			}
		});
	}
	/**
	* @param {Node} child
	* @returns {HtmxSettleTask}
	*/
	function makeAjaxLoadTask(child) {
		return function() {
			removeClassFromElement(child, htmx.config.addedClass);
			processNode(asElement(child));
			processFocus(asParentNode(child));
			triggerEvent(child, "htmx:load");
		};
	}
	/**
	* @param {ParentNode} child
	*/
	function processFocus(child) {
		const autofocus = "[autofocus]";
		const autoFocusedElt = asHtmlElement(matches(child, autofocus) ? child : child.querySelector(autofocus));
		if (autoFocusedElt != null) autoFocusedElt.focus();
	}
	/**
	* @param {Node} parentNode
	* @param {Node} insertBefore
	* @param {ParentNode} fragment
	* @param {HtmxSettleInfo} settleInfo
	*/
	function insertNodesBefore(parentNode, insertBefore, fragment, settleInfo) {
		handleAttributes(parentNode, fragment, settleInfo);
		while (fragment.childNodes.length > 0) {
			const child = fragment.firstChild;
			addClassToElement(asElement(child), htmx.config.addedClass);
			parentNode.insertBefore(child, insertBefore);
			if (child.nodeType !== Node.TEXT_NODE && child.nodeType !== Node.COMMENT_NODE) settleInfo.tasks.push(makeAjaxLoadTask(child));
		}
	}
	/**
	* based on https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0,
	* derived from Java's string hashcode implementation
	* @param {string} string
	* @param {number} hash
	* @returns {number}
	*/
	function stringHash(string, hash) {
		let char = 0;
		while (char < string.length) hash = (hash << 5) - hash + string.charCodeAt(char++) | 0;
		return hash;
	}
	/**
	* @param {Element} elt
	* @returns {number}
	*/
	function attributeHash(elt) {
		let hash = 0;
		for (let i = 0; i < elt.attributes.length; i++) {
			const attribute = elt.attributes[i];
			if (attribute.value) {
				hash = stringHash(attribute.name, hash);
				hash = stringHash(attribute.value, hash);
			}
		}
		return hash;
	}
	/**
	* @param {EventTarget} elt
	*/
	function deInitOnHandlers(elt) {
		const internalData = getInternalData(elt);
		if (internalData.onHandlers) {
			for (let i = 0; i < internalData.onHandlers.length; i++) {
				const handlerInfo = internalData.onHandlers[i];
				removeEventListenerImpl(elt, handlerInfo.event, handlerInfo.listener);
			}
			delete internalData.onHandlers;
		}
	}
	/**
	* @param {Node} element
	*/
	function deInitNode(element) {
		const internalData = getInternalData(element);
		if (internalData.timeout) clearTimeout(internalData.timeout);
		if (internalData.listenerInfos) forEach(internalData.listenerInfos, function(info) {
			if (info.on) removeEventListenerImpl(info.on, info.trigger, info.listener);
		});
		deInitOnHandlers(element);
		forEach(Object.keys(internalData), function(key) {
			if (key !== "firstInitCompleted") delete internalData[key];
		});
	}
	/**
	* @param {Node} element
	*/
	function cleanUpElement(element) {
		triggerEvent(element, "htmx:beforeCleanupElement");
		deInitNode(element);
		forEach(element.children, function(child) {
			cleanUpElement(child);
		});
	}
	/**
	* @param {Element} target
	* @param {ParentNode} fragment
	* @param {HtmxSettleInfo} settleInfo
	*/
	function swapOuterHTML(target, fragment, settleInfo) {
		if (target.tagName === "BODY") return swapInnerHTML(target, fragment, settleInfo);
		/** @type {Node} */
		let newElt;
		const eltBeforeNewContent = target.previousSibling;
		const parentNode = parentElt(target);
		if (!parentNode) return;
		insertNodesBefore(parentNode, target, fragment, settleInfo);
		if (eltBeforeNewContent == null) newElt = parentNode.firstChild;
		else newElt = eltBeforeNewContent.nextSibling;
		settleInfo.elts = settleInfo.elts.filter(function(e) {
			return e !== target;
		});
		while (newElt && newElt !== target) {
			if (newElt instanceof Element) settleInfo.elts.push(newElt);
			newElt = newElt.nextSibling;
		}
		cleanUpElement(target);
		target.remove();
	}
	/**
	* @param {Element} target
	* @param {ParentNode} fragment
	* @param {HtmxSettleInfo} settleInfo
	*/
	function swapAfterBegin(target, fragment, settleInfo) {
		return insertNodesBefore(target, target.firstChild, fragment, settleInfo);
	}
	/**
	* @param {Element} target
	* @param {ParentNode} fragment
	* @param {HtmxSettleInfo} settleInfo
	*/
	function swapBeforeBegin(target, fragment, settleInfo) {
		return insertNodesBefore(parentElt(target), target, fragment, settleInfo);
	}
	/**
	* @param {Element} target
	* @param {ParentNode} fragment
	* @param {HtmxSettleInfo} settleInfo
	*/
	function swapBeforeEnd(target, fragment, settleInfo) {
		return insertNodesBefore(target, null, fragment, settleInfo);
	}
	/**
	* @param {Element} target
	* @param {ParentNode} fragment
	* @param {HtmxSettleInfo} settleInfo
	*/
	function swapAfterEnd(target, fragment, settleInfo) {
		return insertNodesBefore(parentElt(target), target.nextSibling, fragment, settleInfo);
	}
	/**
	* @param {Element} target
	*/
	function swapDelete(target) {
		cleanUpElement(target);
		const parent = parentElt(target);
		if (parent) return parent.removeChild(target);
	}
	/**
	* @param {Element} target
	* @param {ParentNode} fragment
	* @param {HtmxSettleInfo} settleInfo
	*/
	function swapInnerHTML(target, fragment, settleInfo) {
		const firstChild = target.firstChild;
		insertNodesBefore(target, firstChild, fragment, settleInfo);
		if (firstChild) {
			while (firstChild.nextSibling) {
				cleanUpElement(firstChild.nextSibling);
				target.removeChild(firstChild.nextSibling);
			}
			cleanUpElement(firstChild);
			target.removeChild(firstChild);
		}
	}
	/**
	* @param {HtmxSwapStyle} swapStyle
	* @param {Element} elt
	* @param {Element} target
	* @param {ParentNode} fragment
	* @param {HtmxSettleInfo} settleInfo
	*/
	function swapWithStyle(swapStyle, elt, target, fragment, settleInfo) {
		switch (swapStyle) {
			case "none": return;
			case "outerHTML":
				swapOuterHTML(target, fragment, settleInfo);
				return;
			case "afterbegin":
				swapAfterBegin(target, fragment, settleInfo);
				return;
			case "beforebegin":
				swapBeforeBegin(target, fragment, settleInfo);
				return;
			case "beforeend":
				swapBeforeEnd(target, fragment, settleInfo);
				return;
			case "afterend":
				swapAfterEnd(target, fragment, settleInfo);
				return;
			case "delete":
				swapDelete(target);
				return;
			default:
				var extensions = getExtensions(elt);
				for (let i = 0; i < extensions.length; i++) {
					const ext = extensions[i];
					try {
						const newElements = ext.handleSwap(swapStyle, target, fragment, settleInfo);
						if (newElements) {
							if (Array.isArray(newElements)) for (let j = 0; j < newElements.length; j++) {
								const child = newElements[j];
								if (child.nodeType !== Node.TEXT_NODE && child.nodeType !== Node.COMMENT_NODE) settleInfo.tasks.push(makeAjaxLoadTask(child));
							}
							return;
						}
					} catch (e) {
						logError(e);
					}
				}
				if (swapStyle === "innerHTML") swapInnerHTML(target, fragment, settleInfo);
				else swapWithStyle(htmx.config.defaultSwapStyle, elt, target, fragment, settleInfo);
		}
	}
	/**
	* @param {DocumentFragment} fragment
	* @param {HtmxSettleInfo} settleInfo
	* @param {Node|Document} [rootNode]
	*/
	function findAndSwapOobElements(fragment, settleInfo, rootNode) {
		var oobElts = findAll(fragment, "[hx-swap-oob], [data-hx-swap-oob]");
		forEach(oobElts, function(oobElement) {
			if (htmx.config.allowNestedOobSwaps || oobElement.parentElement === null) {
				const oobValue = getAttributeValue(oobElement, "hx-swap-oob");
				if (oobValue != null) oobSwap(oobValue, oobElement, settleInfo, rootNode);
			} else {
				oobElement.removeAttribute("hx-swap-oob");
				oobElement.removeAttribute("data-hx-swap-oob");
			}
		});
		return oobElts.length > 0;
	}
	/**
	* Implements complete swapping pipeline, including: delay, view transitions, focus and selection preservation,
	* title updates, scroll, OOB swapping, normal swapping and settling
	* @param {string|Element} target
	* @param {string} content
	* @param {HtmxSwapSpecification} swapSpec
	* @param {SwapOptions} [swapOptions]
	*/
	function swap(target, content, swapSpec, swapOptions) {
		if (!swapOptions) swapOptions = {};
		let settleResolve = null;
		let settleReject = null;
		let doSwap = function() {
			maybeCall(swapOptions.beforeSwapCallback);
			target = resolveTarget(target);
			const rootNode = swapOptions.contextElement ? getRootNode(swapOptions.contextElement, false) : getDocument();
			const activeElt = document.activeElement;
			let selectionInfo = {};
			selectionInfo = {
				elt: activeElt,
				start: activeElt ? activeElt.selectionStart : null,
				end: activeElt ? activeElt.selectionEnd : null
			};
			const settleInfo = makeSettleInfo(target);
			if (swapSpec.swapStyle === "textContent") target.textContent = content;
			else {
				let fragment = makeFragment(content);
				settleInfo.title = swapOptions.title || fragment.title;
				if (swapOptions.historyRequest) fragment = fragment.querySelector("[hx-history-elt],[data-hx-history-elt]") || fragment;
				if (swapOptions.selectOOB) {
					const oobSelectValues = swapOptions.selectOOB.split(",");
					for (let i = 0; i < oobSelectValues.length; i++) {
						const oobSelectValue = oobSelectValues[i].split(":", 2);
						let id = oobSelectValue[0].trim();
						if (id.indexOf("#") === 0) id = id.substring(1);
						const oobValue = oobSelectValue[1] || "true";
						const oobElement = fragment.querySelector("#" + id);
						if (oobElement) oobSwap(oobValue, oobElement, settleInfo, rootNode);
					}
				}
				findAndSwapOobElements(fragment, settleInfo, rootNode);
				forEach(
					findAll(fragment, "template"),
					/** @param {HTMLTemplateElement} template */
					function(template) {
						if (template.content && findAndSwapOobElements(template.content, settleInfo, rootNode)) template.remove();
					}
				);
				if (swapOptions.select) {
					const newFragment = getDocument().createDocumentFragment();
					forEach(fragment.querySelectorAll(swapOptions.select), function(node) {
						newFragment.appendChild(node);
					});
					fragment = newFragment;
				}
				handlePreservedElements(fragment);
				swapWithStyle(swapSpec.swapStyle, swapOptions.contextElement, target, fragment, settleInfo);
				restorePreservedElements();
			}
			if (selectionInfo.elt && !bodyContains(selectionInfo.elt) && getRawAttribute(selectionInfo.elt, "id")) {
				const newActiveElt = document.getElementById(getRawAttribute(selectionInfo.elt, "id"));
				const focusOptions = { preventScroll: swapSpec.focusScroll !== void 0 ? !swapSpec.focusScroll : !htmx.config.defaultFocusScroll };
				if (newActiveElt) {
					if (selectionInfo.start && newActiveElt.setSelectionRange) try {
						newActiveElt.setSelectionRange(selectionInfo.start, selectionInfo.end);
					} catch (e) {}
					newActiveElt.focus(focusOptions);
				}
			}
			removeClassFromElement(target, htmx.config.swappingClass);
			forEach(settleInfo.elts, function(elt) {
				if (elt.classList) addClassToElement(elt, htmx.config.settlingClass);
				triggerEvent(elt, "htmx:afterSwap", swapOptions.eventInfo);
			});
			maybeCall(swapOptions.afterSwapCallback);
			if (!swapSpec.ignoreTitle) handleTitle(settleInfo.title);
			const doSettle = function() {
				forEach(settleInfo.tasks, function(task) {
					task.call();
				});
				forEach(settleInfo.elts, function(elt) {
					if (elt.classList) removeClassFromElement(elt, htmx.config.settlingClass);
					triggerEvent(elt, "htmx:afterSettle", swapOptions.eventInfo);
				});
				if (swapOptions.anchor) {
					const anchorTarget = asElement(resolveTarget("#" + swapOptions.anchor));
					if (anchorTarget) anchorTarget.scrollIntoView({
						block: "start",
						behavior: "auto"
					});
				}
				updateScrollState(settleInfo.elts, swapSpec);
				maybeCall(swapOptions.afterSettleCallback);
				maybeCall(settleResolve);
			};
			if (swapSpec.settleDelay > 0) getWindow().setTimeout(doSettle, swapSpec.settleDelay);
			else doSettle();
		};
		let shouldTransition = htmx.config.globalViewTransitions;
		if (swapSpec.hasOwnProperty("transition")) shouldTransition = swapSpec.transition;
		const elt = swapOptions.contextElement || getDocument();
		if (shouldTransition && triggerEvent(elt, "htmx:beforeTransition", swapOptions.eventInfo) && typeof Promise !== "undefined" && document.startViewTransition) {
			const settlePromise = new Promise(function(_resolve, _reject) {
				settleResolve = _resolve;
				settleReject = _reject;
			});
			const innerDoSwap = doSwap;
			doSwap = function() {
				document.startViewTransition(function() {
					innerDoSwap();
					return settlePromise;
				});
			};
		}
		try {
			if (swapSpec?.swapDelay && swapSpec.swapDelay > 0) getWindow().setTimeout(doSwap, swapSpec.swapDelay);
			else doSwap();
		} catch (e) {
			triggerErrorEvent(elt, "htmx:swapError", swapOptions.eventInfo);
			maybeCall(settleReject);
			throw e;
		}
	}
	/**
	* @param {XMLHttpRequest} xhr
	* @param {string} header
	* @param {EventTarget} elt
	*/
	function handleTriggerHeader(xhr, header, elt) {
		const triggerBody = xhr.getResponseHeader(header);
		if (triggerBody.indexOf("{") === 0) {
			const triggers = parseJSON(triggerBody);
			for (const eventName in triggers) if (triggers.hasOwnProperty(eventName)) {
				let detail = triggers[eventName];
				if (isRawObject(detail)) elt = detail.target !== void 0 ? detail.target : elt;
				else detail = { value: detail };
				triggerEvent(elt, eventName, detail);
			}
		} else {
			const eventNames = triggerBody.split(",");
			for (let i = 0; i < eventNames.length; i++) triggerEvent(elt, eventNames[i].trim(), []);
		}
	}
	const WHITESPACE = /\s/;
	const WHITESPACE_OR_COMMA = /[\s,]/;
	const SYMBOL_START = /[_$a-zA-Z]/;
	const SYMBOL_CONT = /[_$a-zA-Z0-9]/;
	const STRINGISH_START = [
		"\"",
		"'",
		"/"
	];
	const NOT_WHITESPACE = /[^\s]/;
	const COMBINED_SELECTOR_START = /[{(]/;
	const COMBINED_SELECTOR_END = /[})]/;
	/**
	* @param {string} str
	* @returns {string[]}
	*/
	function tokenizeString(str) {
		/** @type string[] */
		const tokens = [];
		let position = 0;
		while (position < str.length) {
			if (SYMBOL_START.exec(str.charAt(position))) {
				var startPosition = position;
				while (SYMBOL_CONT.exec(str.charAt(position + 1))) position++;
				tokens.push(str.substring(startPosition, position + 1));
			} else if (STRINGISH_START.indexOf(str.charAt(position)) !== -1) {
				const startChar = str.charAt(position);
				var startPosition = position;
				position++;
				while (position < str.length && str.charAt(position) !== startChar) {
					if (str.charAt(position) === "\\") position++;
					position++;
				}
				tokens.push(str.substring(startPosition, position + 1));
			} else {
				const symbol = str.charAt(position);
				tokens.push(symbol);
			}
			position++;
		}
		return tokens;
	}
	/**
	* @param {string} token
	* @param {string|null} last
	* @param {string} paramName
	* @returns {boolean}
	*/
	function isPossibleRelativeReference(token, last, paramName) {
		return SYMBOL_START.exec(token.charAt(0)) && token !== "true" && token !== "false" && token !== "this" && token !== paramName && last !== ".";
	}
	/**
	* @param {EventTarget|string} elt
	* @param {string[]} tokens
	* @param {string} paramName
	* @returns {ConditionalFunction|null}
	*/
	function maybeGenerateConditional(elt, tokens, paramName) {
		if (tokens[0] === "[") {
			tokens.shift();
			let bracketCount = 1;
			let conditionalSource = " return (function(" + paramName + "){ return (";
			let last = null;
			while (tokens.length > 0) {
				const token = tokens[0];
				if (token === "]") {
					bracketCount--;
					if (bracketCount === 0) {
						if (last === null) conditionalSource = conditionalSource + "true";
						tokens.shift();
						conditionalSource += ")})";
						try {
							const conditionFunction = maybeEval(elt, function() {
								return Function(conditionalSource)();
							}, function() {
								return true;
							});
							conditionFunction.source = conditionalSource;
							return conditionFunction;
						} catch (e) {
							triggerErrorEvent(getDocument().body, "htmx:syntax:error", {
								error: e,
								source: conditionalSource
							});
							return null;
						}
					}
				} else if (token === "[") bracketCount++;
				if (isPossibleRelativeReference(token, last, paramName)) conditionalSource += "((" + paramName + "." + token + ") ? (" + paramName + "." + token + ") : (window." + token + "))";
				else conditionalSource = conditionalSource + token;
				last = tokens.shift();
			}
		}
	}
	/**
	* @param {string[]} tokens
	* @param {RegExp} match
	* @returns {string}
	*/
	function consumeUntil(tokens, match) {
		let result = "";
		while (tokens.length > 0 && !match.test(tokens[0])) result += tokens.shift();
		return result;
	}
	/**
	* @param {string[]} tokens
	* @returns {string}
	*/
	function consumeCSSSelector(tokens) {
		let result;
		if (tokens.length > 0 && COMBINED_SELECTOR_START.test(tokens[0])) {
			tokens.shift();
			result = consumeUntil(tokens, COMBINED_SELECTOR_END).trim();
			tokens.shift();
		} else result = consumeUntil(tokens, WHITESPACE_OR_COMMA);
		return result;
	}
	const INPUT_SELECTOR = "input, textarea, select";
	/**
	* @param {Element} elt
	* @param {string} explicitTrigger
	* @param {Object} cache for trigger specs
	* @returns {HtmxTriggerSpecification[]}
	*/
	function parseAndCacheTrigger(elt, explicitTrigger, cache) {
		/** @type HtmxTriggerSpecification[] */
		const triggerSpecs = [];
		const tokens = tokenizeString(explicitTrigger);
		do {
			consumeUntil(tokens, NOT_WHITESPACE);
			const initialLength = tokens.length;
			const trigger = consumeUntil(tokens, /[,\[\s]/);
			if (trigger !== "") if (trigger === "every") {
				/** @type HtmxTriggerSpecification */
				const every = { trigger: "every" };
				consumeUntil(tokens, NOT_WHITESPACE);
				every.pollInterval = parseInterval(consumeUntil(tokens, /[,\[\s]/));
				consumeUntil(tokens, NOT_WHITESPACE);
				var eventFilter = maybeGenerateConditional(elt, tokens, "event");
				if (eventFilter) every.eventFilter = eventFilter;
				triggerSpecs.push(every);
			} else {
				/** @type HtmxTriggerSpecification */
				const triggerSpec = { trigger };
				var eventFilter = maybeGenerateConditional(elt, tokens, "event");
				if (eventFilter) triggerSpec.eventFilter = eventFilter;
				consumeUntil(tokens, NOT_WHITESPACE);
				while (tokens.length > 0 && tokens[0] !== ",") {
					const token = tokens.shift();
					if (token === "changed") triggerSpec.changed = true;
					else if (token === "once") triggerSpec.once = true;
					else if (token === "consume") triggerSpec.consume = true;
					else if (token === "delay" && tokens[0] === ":") {
						tokens.shift();
						triggerSpec.delay = parseInterval(consumeUntil(tokens, WHITESPACE_OR_COMMA));
					} else if (token === "from" && tokens[0] === ":") {
						tokens.shift();
						if (COMBINED_SELECTOR_START.test(tokens[0])) var from_arg = consumeCSSSelector(tokens);
						else {
							var from_arg = consumeUntil(tokens, WHITESPACE_OR_COMMA);
							if (from_arg === "closest" || from_arg === "find" || from_arg === "next" || from_arg === "previous") {
								tokens.shift();
								const selector = consumeCSSSelector(tokens);
								if (selector.length > 0) from_arg += " " + selector;
							}
						}
						triggerSpec.from = from_arg;
					} else if (token === "target" && tokens[0] === ":") {
						tokens.shift();
						triggerSpec.target = consumeCSSSelector(tokens);
					} else if (token === "throttle" && tokens[0] === ":") {
						tokens.shift();
						triggerSpec.throttle = parseInterval(consumeUntil(tokens, WHITESPACE_OR_COMMA));
					} else if (token === "queue" && tokens[0] === ":") {
						tokens.shift();
						triggerSpec.queue = consumeUntil(tokens, WHITESPACE_OR_COMMA);
					} else if (token === "root" && tokens[0] === ":") {
						tokens.shift();
						triggerSpec[token] = consumeCSSSelector(tokens);
					} else if (token === "threshold" && tokens[0] === ":") {
						tokens.shift();
						triggerSpec[token] = consumeUntil(tokens, WHITESPACE_OR_COMMA);
					} else triggerErrorEvent(elt, "htmx:syntax:error", { token: tokens.shift() });
					consumeUntil(tokens, NOT_WHITESPACE);
				}
				triggerSpecs.push(triggerSpec);
			}
			if (tokens.length === initialLength) triggerErrorEvent(elt, "htmx:syntax:error", { token: tokens.shift() });
			consumeUntil(tokens, NOT_WHITESPACE);
		} while (tokens[0] === "," && tokens.shift());
		if (cache) cache[explicitTrigger] = triggerSpecs;
		return triggerSpecs;
	}
	/**
	* @param {Element} elt
	* @returns {HtmxTriggerSpecification[]}
	*/
	function getTriggerSpecs(elt) {
		const explicitTrigger = getAttributeValue(elt, "hx-trigger");
		let triggerSpecs = [];
		if (explicitTrigger) {
			const cache = htmx.config.triggerSpecsCache;
			triggerSpecs = cache && cache[explicitTrigger] || parseAndCacheTrigger(elt, explicitTrigger, cache);
		}
		if (triggerSpecs.length > 0) return triggerSpecs;
		else if (matches(elt, "form")) return [{ trigger: "submit" }];
		else if (matches(elt, "input[type=\"button\"], input[type=\"submit\"]")) return [{ trigger: "click" }];
		else if (matches(elt, INPUT_SELECTOR)) return [{ trigger: "change" }];
		else return [{ trigger: "click" }];
	}
	/**
	* @param {Element} elt
	*/
	function cancelPolling(elt) {
		getInternalData(elt).cancelled = true;
	}
	/**
	* @param {Element} elt
	* @param {TriggerHandler} handler
	* @param {HtmxTriggerSpecification} spec
	*/
	function processPolling(elt, handler, spec) {
		const nodeData = getInternalData(elt);
		nodeData.timeout = getWindow().setTimeout(function() {
			if (bodyContains(elt) && nodeData.cancelled !== true) {
				if (!maybeFilterEvent(spec, elt, makeEvent("hx:poll:trigger", {
					triggerSpec: spec,
					target: elt
				}))) handler(elt);
				processPolling(elt, handler, spec);
			}
		}, spec.pollInterval);
	}
	/**
	* @param {HTMLAnchorElement} elt
	* @returns {boolean}
	*/
	function isLocalLink(elt) {
		return location.hostname === elt.hostname && getRawAttribute(elt, "href") && getRawAttribute(elt, "href").indexOf("#") !== 0;
	}
	/**
	* @param {Element} elt
	*/
	function eltIsDisabled(elt) {
		return closest(elt, htmx.config.disableSelector);
	}
	/**
	* @param {Element} elt
	* @param {HtmxNodeInternalData} nodeData
	* @param {HtmxTriggerSpecification[]} triggerSpecs
	*/
	function boostElement(elt, nodeData, triggerSpecs) {
		if (elt instanceof HTMLAnchorElement && isLocalLink(elt) && (elt.target === "" || elt.target === "_self") || elt.tagName === "FORM" && String(getRawAttribute(elt, "method")).toLowerCase() !== "dialog") {
			nodeData.boosted = true;
			let verb, path;
			if (elt.tagName === "A") {
				verb = "get";
				path = getRawAttribute(elt, "href");
			} else {
				const rawAttribute = getRawAttribute(elt, "method");
				verb = rawAttribute ? rawAttribute.toLowerCase() : "get";
				path = getRawAttribute(elt, "action");
				if (path == null || path === "") path = location.href;
				if (verb === "get" && path.includes("?")) path = path.replace(/\?[^#]+/, "");
			}
			triggerSpecs.forEach(function(triggerSpec) {
				addEventListener(elt, function(node, evt) {
					const elt = asElement(node);
					if (eltIsDisabled(elt)) {
						cleanUpElement(elt);
						return;
					}
					issueAjaxRequest(verb, path, elt, evt);
				}, nodeData, triggerSpec, true);
			});
		}
	}
	/**
	* @param {Event} evt
	* @param {Element} elt
	* @returns {boolean}
	*/
	function shouldCancel(evt, elt) {
		if (evt.type === "submit" && elt.tagName === "FORM") return true;
		else if (evt.type === "click") {
			const btn = elt.closest("input[type=\"submit\"], button");
			if (btn && btn.form && btn.type === "submit") return true;
			const link = elt.closest("a");
			if (link && link.href && !/^#.+/.test(link.getAttribute("href"))) return true;
		}
		return false;
	}
	/**
	* @param {Node} elt
	* @param {Event|MouseEvent|KeyboardEvent|TouchEvent} evt
	* @returns {boolean}
	*/
	function ignoreBoostedAnchorCtrlClick(elt, evt) {
		return getInternalData(elt).boosted && elt instanceof HTMLAnchorElement && evt.type === "click" && (evt.ctrlKey || evt.metaKey);
	}
	/**
	* @param {HtmxTriggerSpecification} triggerSpec
	* @param {Node} elt
	* @param {Event} evt
	* @returns {boolean}
	*/
	function maybeFilterEvent(triggerSpec, elt, evt) {
		const eventFilter = triggerSpec.eventFilter;
		if (eventFilter) try {
			return eventFilter.call(elt, evt) !== true;
		} catch (e) {
			const source = eventFilter.source;
			triggerErrorEvent(getDocument().body, "htmx:eventFilter:error", {
				error: e,
				source
			});
			return true;
		}
		return false;
	}
	/**
	* @param {Element} elt
	* @param {TriggerHandler} handler
	* @param {HtmxNodeInternalData} nodeData
	* @param {HtmxTriggerSpecification} triggerSpec
	* @param {boolean} [explicitCancel]
	*/
	function addEventListener(elt, handler, nodeData, triggerSpec, explicitCancel) {
		const elementData = getInternalData(elt);
		/** @type {(Node|Window)[]} */
		let eltsToListenOn;
		if (triggerSpec.from) eltsToListenOn = querySelectorAllExt(elt, triggerSpec.from);
		else eltsToListenOn = [elt];
		if (triggerSpec.changed) {
			if (!("lastValue" in elementData)) elementData.lastValue = /* @__PURE__ */ new WeakMap();
			eltsToListenOn.forEach(function(eltToListenOn) {
				if (!elementData.lastValue.has(triggerSpec)) elementData.lastValue.set(triggerSpec, /* @__PURE__ */ new WeakMap());
				elementData.lastValue.get(triggerSpec).set(eltToListenOn, eltToListenOn.value);
			});
		}
		forEach(eltsToListenOn, function(eltToListenOn) {
			/** @type EventListener */
			const eventListener = function(evt) {
				if (!bodyContains(elt)) {
					eltToListenOn.removeEventListener(triggerSpec.trigger, eventListener);
					return;
				}
				if (ignoreBoostedAnchorCtrlClick(elt, evt)) return;
				if (explicitCancel || shouldCancel(evt, eltToListenOn)) evt.preventDefault();
				if (maybeFilterEvent(triggerSpec, elt, evt)) return;
				const eventData = getInternalData(evt);
				eventData.triggerSpec = triggerSpec;
				if (eventData.handledFor == null) eventData.handledFor = [];
				if (eventData.handledFor.indexOf(elt) < 0) {
					eventData.handledFor.push(elt);
					if (triggerSpec.consume) evt.stopPropagation();
					if (triggerSpec.target && evt.target) {
						if (!matches(asElement(evt.target), triggerSpec.target)) return;
					}
					if (triggerSpec.once) if (elementData.triggeredOnce) return;
					else elementData.triggeredOnce = true;
					if (triggerSpec.changed) {
						const node = evt.target;
						const value = node.value;
						const lastValue = elementData.lastValue.get(triggerSpec);
						if (lastValue.has(node) && lastValue.get(node) === value) return;
						lastValue.set(node, value);
					}
					if (elementData.delayed) clearTimeout(elementData.delayed);
					if (elementData.throttle) return;
					if (triggerSpec.throttle > 0) {
						if (!elementData.throttle) {
							triggerEvent(elt, "htmx:trigger");
							handler(elt, evt);
							elementData.throttle = getWindow().setTimeout(function() {
								elementData.throttle = null;
							}, triggerSpec.throttle);
						}
					} else if (triggerSpec.delay > 0) elementData.delayed = getWindow().setTimeout(function() {
						triggerEvent(elt, "htmx:trigger");
						handler(elt, evt);
					}, triggerSpec.delay);
					else {
						triggerEvent(elt, "htmx:trigger");
						handler(elt, evt);
					}
				}
			};
			if (nodeData.listenerInfos == null) nodeData.listenerInfos = [];
			nodeData.listenerInfos.push({
				trigger: triggerSpec.trigger,
				listener: eventListener,
				on: eltToListenOn
			});
			eltToListenOn.addEventListener(triggerSpec.trigger, eventListener);
		});
	}
	let windowIsScrolling = false;
	let scrollHandler = null;
	function initScrollHandler() {
		if (!scrollHandler) {
			scrollHandler = function() {
				windowIsScrolling = true;
			};
			window.addEventListener("scroll", scrollHandler);
			window.addEventListener("resize", scrollHandler);
			setInterval(function() {
				if (windowIsScrolling) {
					windowIsScrolling = false;
					forEach(getDocument().querySelectorAll("[hx-trigger*='revealed'],[data-hx-trigger*='revealed']"), function(elt) {
						maybeReveal(elt);
					});
				}
			}, 200);
		}
	}
	/**
	* @param {Element} elt
	*/
	function maybeReveal(elt) {
		if (!hasAttribute(elt, "data-hx-revealed") && isScrolledIntoView(elt)) {
			elt.setAttribute("data-hx-revealed", "true");
			if (getInternalData(elt).initHash) triggerEvent(elt, "revealed");
			else elt.addEventListener("htmx:afterProcessNode", function() {
				triggerEvent(elt, "revealed");
			}, { once: true });
		}
	}
	/**
	* @param {Element} elt
	* @param {TriggerHandler} handler
	* @param {HtmxNodeInternalData} nodeData
	* @param {number} delay
	*/
	function loadImmediately(elt, handler, nodeData, delay) {
		const load = function() {
			if (!nodeData.loaded) {
				nodeData.loaded = true;
				triggerEvent(elt, "htmx:trigger");
				handler(elt);
			}
		};
		if (delay > 0) getWindow().setTimeout(load, delay);
		else load();
	}
	/**
	* @param {Element} elt
	* @param {HtmxNodeInternalData} nodeData
	* @param {HtmxTriggerSpecification[]} triggerSpecs
	* @returns {boolean}
	*/
	function processVerbs(elt, nodeData, triggerSpecs) {
		let explicitAction = false;
		forEach(VERBS, function(verb) {
			if (hasAttribute(elt, "hx-" + verb)) {
				const path = getAttributeValue(elt, "hx-" + verb);
				explicitAction = true;
				nodeData.path = path;
				nodeData.verb = verb;
				triggerSpecs.forEach(function(triggerSpec) {
					addTriggerHandler(elt, triggerSpec, nodeData, function(node, evt) {
						const elt = asElement(node);
						if (eltIsDisabled(elt)) {
							cleanUpElement(elt);
							return;
						}
						issueAjaxRequest(verb, path, elt, evt);
					});
				});
			}
		});
		return explicitAction;
	}
	/**
	* @callback TriggerHandler
	* @param {Element} elt
	* @param {Event} [evt]
	*/
	/**
	* @param {Element} elt
	* @param {HtmxTriggerSpecification} triggerSpec
	* @param {HtmxNodeInternalData} nodeData
	* @param {TriggerHandler} handler
	*/
	function addTriggerHandler(elt, triggerSpec, nodeData, handler) {
		if (triggerSpec.trigger === "revealed") {
			initScrollHandler();
			addEventListener(elt, handler, nodeData, triggerSpec);
			maybeReveal(asElement(elt));
		} else if (triggerSpec.trigger === "intersect") {
			const observerOptions = {};
			if (triggerSpec.root) observerOptions.root = querySelectorExt(elt, triggerSpec.root);
			if (triggerSpec.threshold) observerOptions.threshold = parseFloat(triggerSpec.threshold);
			new IntersectionObserver(function(entries) {
				for (let i = 0; i < entries.length; i++) if (entries[i].isIntersecting) {
					triggerEvent(elt, "intersect");
					break;
				}
			}, observerOptions).observe(asElement(elt));
			addEventListener(asElement(elt), handler, nodeData, triggerSpec);
		} else if (!nodeData.firstInitCompleted && triggerSpec.trigger === "load") {
			if (!maybeFilterEvent(triggerSpec, elt, makeEvent("load", { elt }))) loadImmediately(asElement(elt), handler, nodeData, triggerSpec.delay);
		} else if (triggerSpec.pollInterval > 0) {
			nodeData.polling = true;
			processPolling(asElement(elt), handler, triggerSpec);
		} else addEventListener(elt, handler, nodeData, triggerSpec);
	}
	/**
	* @param {Node} node
	* @returns {boolean}
	*/
	function shouldProcessHxOn(node) {
		const elt = asElement(node);
		if (!elt) return false;
		const attributes = elt.attributes;
		for (let j = 0; j < attributes.length; j++) {
			const attrName = attributes[j].name;
			if (startsWith(attrName, "hx-on:") || startsWith(attrName, "data-hx-on:") || startsWith(attrName, "hx-on-") || startsWith(attrName, "data-hx-on-")) return true;
		}
		return false;
	}
	/**
	* @param {Node} elt
	* @returns {Element[]}
	*/
	const HX_ON_QUERY = new XPathEvaluator().createExpression(".//*[@*[ starts-with(name(), \"hx-on:\") or starts-with(name(), \"data-hx-on:\") or starts-with(name(), \"hx-on-\") or starts-with(name(), \"data-hx-on-\") ]]");
	function processHXOnRoot(elt, elements) {
		if (shouldProcessHxOn(elt)) elements.push(asElement(elt));
		const iter = HX_ON_QUERY.evaluate(elt);
		let node = null;
		while (node = iter.iterateNext()) elements.push(asElement(node));
	}
	function findHxOnWildcardElements(elt) {
		/** @type {Element[]} */
		const elements = [];
		if (elt instanceof DocumentFragment) for (const child of elt.childNodes) processHXOnRoot(child, elements);
		else processHXOnRoot(elt, elements);
		return elements;
	}
	/**
	* @param {Element} elt
	* @returns {NodeListOf<Element>|[]}
	*/
	function findElementsToProcess(elt) {
		if (elt.querySelectorAll) {
			const boostedSelector = ", [hx-boost] a, [data-hx-boost] a, a[hx-boost], a[data-hx-boost]";
			const extensionSelectors = [];
			for (const e in extensions) {
				const extension = extensions[e];
				if (extension.getSelectors) {
					var selectors = extension.getSelectors();
					if (selectors) extensionSelectors.push(selectors);
				}
			}
			return elt.querySelectorAll(VERB_SELECTOR + ", [hx-boost] a, [data-hx-boost] a, a[hx-boost], a[data-hx-boost], form, [type='submit'], [hx-ext], [data-hx-ext], [hx-trigger], [data-hx-trigger]" + extensionSelectors.flat().map((s) => ", " + s).join(""));
		} else return [];
	}
	/**
	* Handle submit buttons/inputs that have the form attribute set
	* see https://developer.mozilla.org/docs/Web/HTML/Element/button
	* @param {Event} evt
	*/
	function maybeSetLastButtonClicked(evt) {
		const elt = getTargetButton(evt.target);
		const internalData = getRelatedFormData(evt);
		if (internalData) internalData.lastButtonClicked = elt;
	}
	/**
	* @param {Event} evt
	*/
	function maybeUnsetLastButtonClicked(evt) {
		const internalData = getRelatedFormData(evt);
		if (internalData) internalData.lastButtonClicked = null;
	}
	/**
	* @param {EventTarget} target
	* @returns {HTMLButtonElement|HTMLInputElement|null}
	*/
	function getTargetButton(target) {
		return closest(asElement(target), "button, input[type='submit']");
	}
	/**
	* @param {Element} elt
	* @returns {HTMLFormElement|null}
	*/
	function getRelatedForm(elt) {
		return elt.form || closest(elt, "form");
	}
	/**
	* @param {Event} evt
	* @returns {HtmxNodeInternalData|undefined}
	*/
	function getRelatedFormData(evt) {
		const elt = getTargetButton(evt.target);
		if (!elt) return;
		const form = getRelatedForm(elt);
		if (!form) return;
		return getInternalData(form);
	}
	/**
	* @param {EventTarget} elt
	*/
	function initButtonTracking(elt) {
		elt.addEventListener("click", maybeSetLastButtonClicked);
		elt.addEventListener("focusin", maybeSetLastButtonClicked);
		elt.addEventListener("focusout", maybeUnsetLastButtonClicked);
	}
	/**
	* @param {Element} elt
	* @param {string} eventName
	* @param {string} code
	*/
	function addHxOnEventHandler(elt, eventName, code) {
		const nodeData = getInternalData(elt);
		if (!Array.isArray(nodeData.onHandlers)) nodeData.onHandlers = [];
		let func;
		/** @type EventListener */
		const listener = function(e) {
			maybeEval(elt, function() {
				if (eltIsDisabled(elt)) return;
				if (!func) func = new Function("event", code);
				func.call(elt, e);
			});
		};
		elt.addEventListener(eventName, listener);
		nodeData.onHandlers.push({
			event: eventName,
			listener
		});
	}
	/**
	* @param {Element} elt
	*/
	function processHxOnWildcard(elt) {
		deInitOnHandlers(elt);
		for (let i = 0; i < elt.attributes.length; i++) {
			const name = elt.attributes[i].name;
			const value = elt.attributes[i].value;
			if (startsWith(name, "hx-on") || startsWith(name, "data-hx-on")) {
				const afterOnPosition = name.indexOf("-on") + 3;
				const nextChar = name.slice(afterOnPosition, afterOnPosition + 1);
				if (nextChar === "-" || nextChar === ":") {
					let eventName = name.slice(afterOnPosition + 1);
					if (startsWith(eventName, ":")) eventName = "htmx" + eventName;
					else if (startsWith(eventName, "-")) eventName = "htmx:" + eventName.slice(1);
					else if (startsWith(eventName, "htmx-")) eventName = "htmx:" + eventName.slice(5);
					addHxOnEventHandler(elt, eventName, value);
				}
			}
		}
	}
	/**
	* @param {Element|HTMLInputElement} elt
	*/
	function initNode(elt) {
		triggerEvent(elt, "htmx:beforeProcessNode");
		const nodeData = getInternalData(elt);
		const triggerSpecs = getTriggerSpecs(elt);
		if (!processVerbs(elt, nodeData, triggerSpecs)) {
			if (getClosestAttributeValue(elt, "hx-boost") === "true") boostElement(elt, nodeData, triggerSpecs);
			else if (hasAttribute(elt, "hx-trigger")) triggerSpecs.forEach(function(triggerSpec) {
				addTriggerHandler(elt, triggerSpec, nodeData, function() {});
			});
		}
		if (elt.tagName === "FORM" || getRawAttribute(elt, "type") === "submit" && hasAttribute(elt, "form")) initButtonTracking(elt);
		nodeData.firstInitCompleted = true;
		triggerEvent(elt, "htmx:afterProcessNode");
	}
	/**
	* @param {Element} elt
	* @returns {boolean}
	*/
	function maybeDeInitAndHash(elt) {
		if (!(elt instanceof Element)) return false;
		const nodeData = getInternalData(elt);
		const hash = attributeHash(elt);
		if (nodeData.initHash !== hash) {
			deInitNode(elt);
			nodeData.initHash = hash;
			return true;
		}
		return false;
	}
	/**
	* Processes new content, enabling htmx behavior. This can be useful if you have content that is added to the DOM outside of the normal htmx request cycle but still want htmx attributes to work.
	*
	* @see https://htmx.org/api/#process
	*
	* @param {Element|string} elt element to process
	*/
	function processNode(elt) {
		elt = resolveTarget(elt);
		if (eltIsDisabled(elt)) {
			cleanUpElement(elt);
			return;
		}
		const elementsToInit = [];
		if (maybeDeInitAndHash(elt)) elementsToInit.push(elt);
		forEach(findElementsToProcess(elt), function(child) {
			if (eltIsDisabled(child)) {
				cleanUpElement(child);
				return;
			}
			if (maybeDeInitAndHash(child)) elementsToInit.push(child);
		});
		forEach(findHxOnWildcardElements(elt), processHxOnWildcard);
		forEach(elementsToInit, initNode);
	}
	/**
	* @param {string} str
	* @returns {string}
	*/
	function kebabEventName(str) {
		return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
	}
	/**
	* @param {string} eventName
	* @param {any} detail
	* @returns {CustomEvent}
	*/
	function makeEvent(eventName, detail) {
		return new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			composed: true,
			detail
		});
	}
	/**
	* @param {EventTarget|string} elt
	* @param {string} eventName
	* @param {any=} detail
	*/
	function triggerErrorEvent(elt, eventName, detail) {
		triggerEvent(elt, eventName, mergeObjects({ error: eventName }, detail));
	}
	/**
	* @param {string} eventName
	* @returns {boolean}
	*/
	function ignoreEventForLogging(eventName) {
		return eventName === "htmx:afterProcessNode";
	}
	/**
	* `withExtensions` locates all active extensions for a provided element, then
	* executes the provided function using each of the active extensions. You can filter
	* the element's extensions by giving it a list of extensions to ignore. It should
	* be called internally at every extendable execution point in htmx.
	*
	* @param {Element} elt
	* @param {(extension:HtmxExtension) => void} toDo
	* @param {string[]=} extensionsToIgnore
	* @returns void
	*/
	function withExtensions(elt, toDo, extensionsToIgnore) {
		forEach(getExtensions(elt, [], extensionsToIgnore), function(extension) {
			try {
				toDo(extension);
			} catch (e) {
				logError(e);
			}
		});
	}
	function logError(msg) {
		console.error(msg);
	}
	/**
	* Triggers a given event on an element
	*
	* @see https://htmx.org/api/#trigger
	*
	* @param {EventTarget|string} elt the element to trigger the event on
	* @param {string} eventName the name of the event to trigger
	* @param {any=} detail details for the event
	* @returns {boolean}
	*/
	function triggerEvent(elt, eventName, detail) {
		elt = resolveTarget(elt);
		if (detail == null) detail = {};
		detail.elt = elt;
		const event = makeEvent(eventName, detail);
		if (htmx.logger && !ignoreEventForLogging(eventName)) htmx.logger(elt, eventName, detail);
		if (detail.error) {
			logError(detail.error + (detail.target ? ", " + detail.target : ""));
			triggerEvent(elt, "htmx:error", { errorInfo: detail });
		}
		let eventResult = elt.dispatchEvent(event);
		const kebabName = kebabEventName(eventName);
		if (eventResult && kebabName !== eventName) {
			const kebabedEvent = makeEvent(kebabName, event.detail);
			eventResult = eventResult && elt.dispatchEvent(kebabedEvent);
		}
		withExtensions(asElement(elt), function(extension) {
			eventResult = eventResult && extension.onEvent(eventName, event) !== false && !event.defaultPrevented;
		});
		return eventResult;
	}
	let currentPathForHistory;
	/**
	* @param {string} path
	*/
	function setCurrentPathForHistory(path) {
		currentPathForHistory = path;
		if (canAccessLocalStorage()) sessionStorage.setItem("htmx-current-path-for-history", path);
	}
	setCurrentPathForHistory(location.pathname + location.search);
	/**
	* @returns {Element}
	*/
	function getHistoryElement() {
		return getDocument().querySelector("[hx-history-elt],[data-hx-history-elt]") || getDocument().body;
	}
	/**
	* @param {string} url
	* @param {Element} rootElt
	*/
	function saveToHistoryCache(url, rootElt) {
		if (!canAccessLocalStorage()) return;
		const innerHTML = cleanInnerHtmlForHistory(rootElt);
		const title = getDocument().title;
		const scroll = window.scrollY;
		if (htmx.config.historyCacheSize <= 0) {
			sessionStorage.removeItem("htmx-history-cache");
			return;
		}
		url = normalizePath(url);
		const historyCache = parseJSON(sessionStorage.getItem("htmx-history-cache")) || [];
		for (let i = 0; i < historyCache.length; i++) if (historyCache[i].url === url) {
			historyCache.splice(i, 1);
			break;
		}
		/** @type HtmxHistoryItem */
		const newHistoryItem = {
			url,
			content: innerHTML,
			title,
			scroll
		};
		triggerEvent(getDocument().body, "htmx:historyItemCreated", {
			item: newHistoryItem,
			cache: historyCache
		});
		historyCache.push(newHistoryItem);
		while (historyCache.length > htmx.config.historyCacheSize) historyCache.shift();
		while (historyCache.length > 0) try {
			sessionStorage.setItem("htmx-history-cache", JSON.stringify(historyCache));
			break;
		} catch (e) {
			triggerErrorEvent(getDocument().body, "htmx:historyCacheError", {
				cause: e,
				cache: historyCache
			});
			historyCache.shift();
		}
	}
	/**
	* @typedef {Object} HtmxHistoryItem
	* @property {string} url
	* @property {string} content
	* @property {string} title
	* @property {number} scroll
	*/
	/**
	* @param {string} url
	* @returns {HtmxHistoryItem|null}
	*/
	function getCachedHistory(url) {
		if (!canAccessLocalStorage()) return null;
		url = normalizePath(url);
		const historyCache = parseJSON(sessionStorage.getItem("htmx-history-cache")) || [];
		for (let i = 0; i < historyCache.length; i++) if (historyCache[i].url === url) return historyCache[i];
		return null;
	}
	/**
	* @param {Element} elt
	* @returns {string}
	*/
	function cleanInnerHtmlForHistory(elt) {
		const className = htmx.config.requestClass;
		const clone = elt.cloneNode(true);
		forEach(findAll(clone, "." + className), function(child) {
			removeClassFromElement(child, className);
		});
		forEach(findAll(clone, "[data-disabled-by-htmx]"), function(child) {
			child.removeAttribute("disabled");
		});
		return clone.innerHTML;
	}
	function saveCurrentPageToHistory() {
		const elt = getHistoryElement();
		let path = currentPathForHistory;
		if (canAccessLocalStorage()) path = sessionStorage.getItem("htmx-current-path-for-history");
		path = path || location.pathname + location.search;
		if (!getDocument().querySelector("[hx-history=\"false\" i],[data-hx-history=\"false\" i]")) {
			triggerEvent(getDocument().body, "htmx:beforeHistorySave", {
				path,
				historyElt: elt
			});
			saveToHistoryCache(path, elt);
		}
		if (htmx.config.historyEnabled) history.replaceState({ htmx: true }, getDocument().title, location.href);
	}
	/**
	* @param {string} path
	*/
	function pushUrlIntoHistory(path) {
		if (htmx.config.getCacheBusterParam) {
			path = path.replace(/org\.htmx\.cache-buster=[^&]*&?/, "");
			if (endsWith(path, "&") || endsWith(path, "?")) path = path.slice(0, -1);
		}
		if (htmx.config.historyEnabled) history.pushState({ htmx: true }, "", path);
		setCurrentPathForHistory(path);
	}
	/**
	* @param {string} path
	*/
	function replaceUrlInHistory(path) {
		if (htmx.config.historyEnabled) history.replaceState({ htmx: true }, "", path);
		setCurrentPathForHistory(path);
	}
	/**
	* @param {HtmxSettleTask[]} tasks
	*/
	function settleImmediately(tasks) {
		forEach(tasks, function(task) {
			task.call(void 0);
		});
	}
	/**
	* @param {string} path
	*/
	function loadHistoryFromServer(path) {
		const request = new XMLHttpRequest();
		const swapSpec = {
			swapStyle: "innerHTML",
			swapDelay: 0,
			settleDelay: 0
		};
		const details = {
			path,
			xhr: request,
			historyElt: getHistoryElement(),
			swapSpec
		};
		request.open("GET", path, true);
		if (htmx.config.historyRestoreAsHxRequest) request.setRequestHeader("HX-Request", "true");
		request.setRequestHeader("HX-History-Restore-Request", "true");
		request.setRequestHeader("HX-Current-URL", location.href);
		request.onload = function() {
			if (this.status >= 200 && this.status < 400) {
				details.response = this.response;
				triggerEvent(getDocument().body, "htmx:historyCacheMissLoad", details);
				swap(details.historyElt, details.response, swapSpec, {
					contextElement: details.historyElt,
					historyRequest: true
				});
				setCurrentPathForHistory(details.path);
				triggerEvent(getDocument().body, "htmx:historyRestore", {
					path,
					cacheMiss: true,
					serverResponse: details.response
				});
			} else triggerErrorEvent(getDocument().body, "htmx:historyCacheMissLoadError", details);
		};
		if (triggerEvent(getDocument().body, "htmx:historyCacheMiss", details)) request.send();
	}
	/**
	* @param {string} [path]
	*/
	function restoreHistory(path) {
		saveCurrentPageToHistory();
		path = path || location.pathname + location.search;
		const cached = getCachedHistory(path);
		if (cached) {
			const swapSpec = {
				swapStyle: "innerHTML",
				swapDelay: 0,
				settleDelay: 0,
				scroll: cached.scroll
			};
			const details = {
				path,
				item: cached,
				historyElt: getHistoryElement(),
				swapSpec
			};
			if (triggerEvent(getDocument().body, "htmx:historyCacheHit", details)) {
				swap(details.historyElt, cached.content, swapSpec, {
					contextElement: details.historyElt,
					title: cached.title
				});
				setCurrentPathForHistory(details.path);
				triggerEvent(getDocument().body, "htmx:historyRestore", details);
			}
		} else if (htmx.config.refreshOnHistoryMiss) htmx.location.reload(true);
		else loadHistoryFromServer(path);
	}
	/**
	* @param {Element} elt
	* @returns {Element[]}
	*/
	function addRequestIndicatorClasses(elt) {
		let indicators = findAttributeTargets(elt, "hx-indicator");
		if (indicators == null) indicators = [elt];
		forEach(indicators, function(ic) {
			const internalData = getInternalData(ic);
			internalData.requestCount = (internalData.requestCount || 0) + 1;
			addClassToElement(ic, htmx.config.requestClass);
		});
		return indicators;
	}
	/**
	* @param {Element} elt
	* @returns {Element[]}
	*/
	function disableElements(elt) {
		let disabledElts = findAttributeTargets(elt, "hx-disabled-elt");
		if (disabledElts == null) disabledElts = [];
		forEach(disabledElts, function(disabledElement) {
			const internalData = getInternalData(disabledElement);
			internalData.requestCount = (internalData.requestCount || 0) + 1;
			if (!disabledElement.hasAttribute("disabled")) {
				disabledElement.setAttribute("disabled", "");
				disabledElement.setAttribute("data-disabled-by-htmx", "");
			}
		});
		return disabledElts;
	}
	/**
	* @param {Element[]} indicators
	* @param {Element[]} disabled
	*/
	function removeRequestIndicators(indicators, disabled) {
		forEach(indicators.concat(disabled), function(ele) {
			const internalData = getInternalData(ele);
			internalData.requestCount = (internalData.requestCount || 1) - 1;
		});
		forEach(indicators, function(ic) {
			if (getInternalData(ic).requestCount === 0) removeClassFromElement(ic, htmx.config.requestClass);
		});
		forEach(disabled, function(disabledElement) {
			if (getInternalData(disabledElement).requestCount === 0 && disabledElement.hasAttribute("data-disabled-by-htmx")) {
				disabledElement.removeAttribute("disabled");
				disabledElement.removeAttribute("data-disabled-by-htmx");
			}
		});
	}
	/**
	* @param {Element[]} processed
	* @param {Element} elt
	* @returns {boolean}
	*/
	function haveSeenNode(processed, elt) {
		for (let i = 0; i < processed.length; i++) if (processed[i].isSameNode(elt)) return true;
		return false;
	}
	/**
	* @param {Element} element
	* @return {boolean}
	*/
	function shouldInclude(element) {
		const elt = element;
		if (elt.name === "" || elt.name == null || elt.disabled || closest(elt, "fieldset[disabled]")) return false;
		if (elt.type === "button" || elt.type === "submit" || elt.tagName === "image" || elt.tagName === "reset" || elt.tagName === "file") return false;
		if (elt.type === "checkbox" || elt.type === "radio") return elt.checked;
		return true;
	}
	/**
	* @param {string} name
	* @param {string|Array|FormDataEntryValue} value
	* @param {FormData} formData */
	function addValueToFormData(name, value, formData) {
		if (name != null && value != null) if (Array.isArray(value)) value.forEach(function(v) {
			formData.append(name, v);
		});
		else formData.append(name, value);
	}
	/**
	* @param {string} name
	* @param {string|Array} value
	* @param {FormData} formData */
	function removeValueFromFormData(name, value, formData) {
		if (name != null && value != null) {
			let values = formData.getAll(name);
			if (Array.isArray(value)) values = values.filter((v) => value.indexOf(v) < 0);
			else values = values.filter((v) => v !== value);
			formData.delete(name);
			forEach(values, (v) => formData.append(name, v));
		}
	}
	/**
	* @param {Element} elt
	* @returns {string|Array}
	*/
	function getValueFromInput(elt) {
		if (elt instanceof HTMLSelectElement && elt.multiple) return toArray(elt.querySelectorAll("option:checked")).map(function(e) {
			return e.value;
		});
		if (elt instanceof HTMLInputElement && elt.files) return toArray(elt.files);
		return elt.value;
	}
	/**
	* @param {Element[]} processed
	* @param {FormData} formData
	* @param {HtmxElementValidationError[]} errors
	* @param {Element|HTMLInputElement|HTMLSelectElement|HTMLFormElement} elt
	* @param {boolean} validate
	*/
	function processInputValue(processed, formData, errors, elt, validate) {
		if (elt == null || haveSeenNode(processed, elt)) return;
		else processed.push(elt);
		if (shouldInclude(elt)) {
			addValueToFormData(getRawAttribute(elt, "name"), getValueFromInput(elt), formData);
			if (validate) validateElement(elt, errors);
		}
		if (elt instanceof HTMLFormElement) {
			forEach(elt.elements, function(input) {
				if (processed.indexOf(input) >= 0) removeValueFromFormData(input.name, getValueFromInput(input), formData);
				else processed.push(input);
				if (validate) validateElement(input, errors);
			});
			new FormData(elt).forEach(function(value, name) {
				if (value instanceof File && value.name === "") return;
				addValueToFormData(name, value, formData);
			});
		}
	}
	/**
	* @param {Element} elt
	* @param {HtmxElementValidationError[]} errors
	*/
	function validateElement(elt, errors) {
		const element = elt;
		if (element.willValidate) {
			triggerEvent(element, "htmx:validation:validate");
			if (!element.checkValidity()) {
				if (triggerEvent(element, "htmx:validation:failed", {
					message: element.validationMessage,
					validity: element.validity
				}) && !errors.length && htmx.config.reportValidityOfForms) element.reportValidity();
				errors.push({
					elt: element,
					message: element.validationMessage,
					validity: element.validity
				});
			}
		}
	}
	/**
	* Override values in the one FormData with those from another.
	* @param {FormData} receiver the formdata that will be mutated
	* @param {FormData} donor the formdata that will provide the overriding values
	* @returns {FormData} the {@linkcode receiver}
	*/
	function overrideFormData(receiver, donor) {
		for (const key of donor.keys()) receiver.delete(key);
		donor.forEach(function(value, key) {
			receiver.append(key, value);
		});
		return receiver;
	}
	/**
	* @param {Element|HTMLFormElement} elt
	* @param {HttpVerb} verb
	* @returns {{errors: HtmxElementValidationError[], formData: FormData, values: Object}}
	*/
	function getInputValues(elt, verb) {
		/** @type Element[] */
		const processed = [];
		const formData = new FormData();
		const priorityFormData = new FormData();
		/** @type HtmxElementValidationError[] */
		const errors = [];
		const internalData = getInternalData(elt);
		if (internalData.lastButtonClicked && !bodyContains(internalData.lastButtonClicked)) internalData.lastButtonClicked = null;
		let validate = elt instanceof HTMLFormElement && elt.noValidate !== true || getAttributeValue(elt, "hx-validate") === "true";
		if (internalData.lastButtonClicked) validate = validate && internalData.lastButtonClicked.formNoValidate !== true;
		if (verb !== "get") processInputValue(processed, priorityFormData, errors, getRelatedForm(elt), validate);
		processInputValue(processed, formData, errors, elt, validate);
		if (internalData.lastButtonClicked || elt.tagName === "BUTTON" || elt.tagName === "INPUT" && getRawAttribute(elt, "type") === "submit") {
			const button = internalData.lastButtonClicked || elt;
			addValueToFormData(getRawAttribute(button, "name"), button.value, priorityFormData);
		}
		forEach(findAttributeTargets(elt, "hx-include"), function(node) {
			processInputValue(processed, formData, errors, asElement(node), validate);
			if (!matches(node, "form")) forEach(asParentNode(node).querySelectorAll(INPUT_SELECTOR), function(descendant) {
				processInputValue(processed, formData, errors, descendant, validate);
			});
		});
		overrideFormData(formData, priorityFormData);
		return {
			errors,
			formData,
			values: formDataProxy(formData)
		};
	}
	/**
	* @param {string} returnStr
	* @param {string} name
	* @param {any} realValue
	* @returns {string}
	*/
	function appendParam(returnStr, name, realValue) {
		if (returnStr !== "") returnStr += "&";
		if (String(realValue) === "[object Object]") realValue = JSON.stringify(realValue);
		const s = encodeURIComponent(realValue);
		returnStr += encodeURIComponent(name) + "=" + s;
		return returnStr;
	}
	/**
	* @param {FormData|Object} values
	* @returns string
	*/
	function urlEncode(values) {
		values = formDataFromObject(values);
		let returnStr = "";
		values.forEach(function(value, key) {
			returnStr = appendParam(returnStr, key, value);
		});
		return returnStr;
	}
	/**
	* @param {Element} elt
	* @param {Element} target
	* @param {string} prompt
	* @returns {HtmxHeaderSpecification}
	*/
	function getHeaders(elt, target, prompt) {
		/** @type HtmxHeaderSpecification */
		const headers = {
			"HX-Request": "true",
			"HX-Trigger": getRawAttribute(elt, "id"),
			"HX-Trigger-Name": getRawAttribute(elt, "name"),
			"HX-Target": getAttributeValue(target, "id"),
			"HX-Current-URL": location.href
		};
		getValuesForElement(elt, "hx-headers", false, headers);
		if (prompt !== void 0) headers["HX-Prompt"] = prompt;
		if (getInternalData(elt).boosted) headers["HX-Boosted"] = "true";
		return headers;
	}
	/**
	* filterValues takes an object containing form input values
	* and returns a new object that only contains keys that are
	* specified by the closest "hx-params" attribute
	* @param {FormData} inputValues
	* @param {Element} elt
	* @returns {FormData}
	*/
	function filterValues(inputValues, elt) {
		const paramsValue = getClosestAttributeValue(elt, "hx-params");
		if (paramsValue) if (paramsValue === "none") return new FormData();
		else if (paramsValue === "*") return inputValues;
		else if (paramsValue.indexOf("not ") === 0) {
			forEach(paramsValue.slice(4).split(","), function(name) {
				name = name.trim();
				inputValues.delete(name);
			});
			return inputValues;
		} else {
			const newValues = new FormData();
			forEach(paramsValue.split(","), function(name) {
				name = name.trim();
				if (inputValues.has(name)) inputValues.getAll(name).forEach(function(value) {
					newValues.append(name, value);
				});
			});
			return newValues;
		}
		else return inputValues;
	}
	/**
	* @param {Element} elt
	* @return {boolean}
	*/
	function isAnchorLink(elt) {
		return !!getRawAttribute(elt, "href") && getRawAttribute(elt, "href").indexOf("#") >= 0;
	}
	/**
	* @param {Element} elt
	* @param {HtmxSwapStyle} [swapInfoOverride]
	* @returns {HtmxSwapSpecification}
	*/
	function getSwapSpecification(elt, swapInfoOverride) {
		const swapInfo = swapInfoOverride || getClosestAttributeValue(elt, "hx-swap");
		/** @type HtmxSwapSpecification */
		const swapSpec = {
			swapStyle: getInternalData(elt).boosted ? "innerHTML" : htmx.config.defaultSwapStyle,
			swapDelay: htmx.config.defaultSwapDelay,
			settleDelay: htmx.config.defaultSettleDelay
		};
		if (htmx.config.scrollIntoViewOnBoost && getInternalData(elt).boosted && !isAnchorLink(elt)) swapSpec.show = "top";
		if (swapInfo) {
			const split = splitOnWhitespace(swapInfo);
			if (split.length > 0) for (let i = 0; i < split.length; i++) {
				const value = split[i];
				if (value.indexOf("swap:") === 0) swapSpec.swapDelay = parseInterval(value.slice(5));
				else if (value.indexOf("settle:") === 0) swapSpec.settleDelay = parseInterval(value.slice(7));
				else if (value.indexOf("transition:") === 0) swapSpec.transition = value.slice(11) === "true";
				else if (value.indexOf("ignoreTitle:") === 0) swapSpec.ignoreTitle = value.slice(12) === "true";
				else if (value.indexOf("scroll:") === 0) {
					var splitSpec = value.slice(7).split(":");
					const scrollVal = splitSpec.pop();
					var selectorVal = splitSpec.length > 0 ? splitSpec.join(":") : null;
					swapSpec.scroll = scrollVal;
					swapSpec.scrollTarget = selectorVal;
				} else if (value.indexOf("show:") === 0) {
					var splitSpec = value.slice(5).split(":");
					const showVal = splitSpec.pop();
					var selectorVal = splitSpec.length > 0 ? splitSpec.join(":") : null;
					swapSpec.show = showVal;
					swapSpec.showTarget = selectorVal;
				} else if (value.indexOf("focus-scroll:") === 0) swapSpec.focusScroll = value.slice(13) == "true";
				else if (i == 0) swapSpec.swapStyle = value;
				else logError("Unknown modifier in hx-swap: " + value);
			}
		}
		return swapSpec;
	}
	/**
	* @param {Element} elt
	* @return {boolean}
	*/
	function usesFormData(elt) {
		return getClosestAttributeValue(elt, "hx-encoding") === "multipart/form-data" || matches(elt, "form") && getRawAttribute(elt, "enctype") === "multipart/form-data";
	}
	/**
	* @param {XMLHttpRequest} xhr
	* @param {Element} elt
	* @param {FormData} filteredParameters
	* @returns {*|string|null}
	*/
	function encodeParamsForBody(xhr, elt, filteredParameters) {
		let encodedParameters = null;
		withExtensions(elt, function(extension) {
			if (encodedParameters == null) encodedParameters = extension.encodeParameters(xhr, filteredParameters, elt);
		});
		if (encodedParameters != null) return encodedParameters;
		else if (usesFormData(elt)) return overrideFormData(new FormData(), formDataFromObject(filteredParameters));
		else return urlEncode(filteredParameters);
	}
	/**
	*
	* @param {Element} target
	* @returns {HtmxSettleInfo}
	*/
	function makeSettleInfo(target) {
		return {
			tasks: [],
			elts: [target]
		};
	}
	/**
	* @param {Element[]} content
	* @param {HtmxSwapSpecification} swapSpec
	*/
	function updateScrollState(content, swapSpec) {
		const first = content[0];
		const last = content[content.length - 1];
		if (swapSpec.scroll) {
			var target = null;
			if (swapSpec.scrollTarget) target = asElement(querySelectorExt(first, swapSpec.scrollTarget));
			if (swapSpec.scroll === "top" && (first || target)) {
				target = target || first;
				target.scrollTop = 0;
			}
			if (swapSpec.scroll === "bottom" && (last || target)) {
				target = target || last;
				target.scrollTop = target.scrollHeight;
			}
			if (typeof swapSpec.scroll === "number") getWindow().setTimeout(function() {
				window.scrollTo(0, swapSpec.scroll);
			}, 0);
		}
		if (swapSpec.show) {
			var target = null;
			if (swapSpec.showTarget) {
				let targetStr = swapSpec.showTarget;
				if (swapSpec.showTarget === "window") targetStr = "body";
				target = asElement(querySelectorExt(first, targetStr));
			}
			if (swapSpec.show === "top" && (first || target)) {
				target = target || first;
				target.scrollIntoView({
					block: "start",
					behavior: htmx.config.scrollBehavior
				});
			}
			if (swapSpec.show === "bottom" && (last || target)) {
				target = target || last;
				target.scrollIntoView({
					block: "end",
					behavior: htmx.config.scrollBehavior
				});
			}
		}
	}
	/**
	* @param {Element} elt
	* @param {string} attr
	* @param {boolean=} evalAsDefault
	* @param {Object=} values
	* @param {Event=} event
	* @returns {Object}
	*/
	function getValuesForElement(elt, attr, evalAsDefault, values, event) {
		if (values == null) values = {};
		if (elt == null) return values;
		const attributeValue = getAttributeValue(elt, attr);
		if (attributeValue) {
			let str = attributeValue.trim();
			let evaluateValue = evalAsDefault;
			if (str === "unset") return null;
			if (str.indexOf("javascript:") === 0) {
				str = str.slice(11);
				evaluateValue = true;
			} else if (str.indexOf("js:") === 0) {
				str = str.slice(3);
				evaluateValue = true;
			}
			if (str.indexOf("{") !== 0) str = "{" + str + "}";
			let varsValues;
			if (evaluateValue) varsValues = maybeEval(elt, function() {
				if (event) return Function("event", "return (" + str + ")").call(elt, event);
				else return Function("return (" + str + ")").call(elt);
			}, {});
			else varsValues = parseJSON(str);
			for (const key in varsValues) if (varsValues.hasOwnProperty(key)) {
				if (values[key] == null) values[key] = varsValues[key];
			}
		}
		return getValuesForElement(asElement(parentElt(elt)), attr, evalAsDefault, values, event);
	}
	/**
	* @param {EventTarget|string} elt
	* @param {() => any} toEval
	* @param {any=} defaultVal
	* @returns {any}
	*/
	function maybeEval(elt, toEval, defaultVal) {
		if (htmx.config.allowEval) return toEval();
		else {
			triggerErrorEvent(elt, "htmx:evalDisallowedError");
			return defaultVal;
		}
	}
	/**
	* @param {Element} elt
	* @param {Event=} event
	* @param {*?=} expressionVars
	* @returns
	*/
	function getHXVarsForElement(elt, event, expressionVars) {
		return getValuesForElement(elt, "hx-vars", true, expressionVars, event);
	}
	/**
	* @param {Element} elt
	* @param {Event=} event
	* @param {*?=} expressionVars
	* @returns
	*/
	function getHXValsForElement(elt, event, expressionVars) {
		return getValuesForElement(elt, "hx-vals", false, expressionVars, event);
	}
	/**
	* @param {Element} elt
	* @param {Event=} event
	* @returns {FormData}
	*/
	function getExpressionVars(elt, event) {
		return mergeObjects(getHXVarsForElement(elt, event), getHXValsForElement(elt, event));
	}
	/**
	* @param {XMLHttpRequest} xhr
	* @param {string} header
	* @param {string|null} headerValue
	*/
	function safelySetHeaderValue(xhr, header, headerValue) {
		if (headerValue !== null) try {
			xhr.setRequestHeader(header, headerValue);
		} catch (e) {
			xhr.setRequestHeader(header, encodeURIComponent(headerValue));
			xhr.setRequestHeader(header + "-URI-AutoEncoded", "true");
		}
	}
	/**
	* @param {XMLHttpRequest} xhr
	* @return {string}
	*/
	function getPathFromResponse(xhr) {
		if (xhr.responseURL) try {
			const url = new URL(xhr.responseURL);
			return url.pathname + url.search;
		} catch (e) {
			triggerErrorEvent(getDocument().body, "htmx:badResponseUrl", { url: xhr.responseURL });
		}
	}
	/**
	* @param {XMLHttpRequest} xhr
	* @param {RegExp} regexp
	* @return {boolean}
	*/
	function hasHeader(xhr, regexp) {
		return regexp.test(xhr.getAllResponseHeaders());
	}
	/**
	* Issues an htmx-style AJAX request
	*
	* @see https://htmx.org/api/#ajax
	*
	* @param {HttpVerb} verb
	* @param {string} path the URL path to make the AJAX
	* @param {Element|string|HtmxAjaxHelperContext} context the element to target (defaults to the **body**) | a selector for the target | a context object that contains any of the following
	* @return {Promise<void>} Promise that resolves immediately if no request is sent, or when the request is complete
	*/
	function ajaxHelper(verb, path, context) {
		verb = verb.toLowerCase();
		if (context) if (context instanceof Element || typeof context === "string") return issueAjaxRequest(verb, path, null, null, {
			targetOverride: resolveTarget(context) || DUMMY_ELT,
			returnPromise: true
		});
		else {
			let resolvedTarget = resolveTarget(context.target);
			if (context.target && !resolvedTarget || context.source && !resolvedTarget && !resolveTarget(context.source)) resolvedTarget = DUMMY_ELT;
			return issueAjaxRequest(verb, path, resolveTarget(context.source), context.event, {
				handler: context.handler,
				headers: context.headers,
				values: context.values,
				targetOverride: resolvedTarget,
				swapOverride: context.swap,
				select: context.select,
				returnPromise: true,
				push: context.push,
				replace: context.replace,
				selectOOB: context.selectOOB
			});
		}
		else return issueAjaxRequest(verb, path, null, null, { returnPromise: true });
	}
	/**
	* @param {Element} elt
	* @return {Element[]}
	*/
	function hierarchyForElt(elt) {
		const arr = [];
		while (elt) {
			arr.push(elt);
			elt = elt.parentElement;
		}
		return arr;
	}
	/**
	* @param {Element} elt
	* @param {string} path
	* @param {HtmxRequestConfig} requestConfig
	* @return {boolean}
	*/
	function verifyPath(elt, path, requestConfig) {
		const url = new URL(path, location.protocol !== "about:" ? location.href : window.origin);
		const sameHost = (location.protocol !== "about:" ? location.origin : window.origin) === url.origin;
		if (htmx.config.selfRequestsOnly) {
			if (!sameHost) return false;
		}
		return triggerEvent(elt, "htmx:validateUrl", mergeObjects({
			url,
			sameHost
		}, requestConfig));
	}
	/**
	* @param {Object|FormData} obj
	* @return {FormData}
	*/
	function formDataFromObject(obj) {
		if (obj instanceof FormData) return obj;
		const formData = new FormData();
		for (const key in obj) if (obj.hasOwnProperty(key)) if (obj[key] && typeof obj[key].forEach === "function") obj[key].forEach(function(v) {
			formData.append(key, v);
		});
		else if (typeof obj[key] === "object" && !(obj[key] instanceof Blob)) formData.append(key, JSON.stringify(obj[key]));
		else formData.append(key, obj[key]);
		return formData;
	}
	/**
	* @param {FormData} formData
	* @param {string} name
	* @param {Array} array
	* @returns {Array}
	*/
	function formDataArrayProxy(formData, name, array) {
		return new Proxy(array, {
			get: function(target, key) {
				if (typeof key === "number") return target[key];
				if (key === "length") return target.length;
				if (key === "push") return function(value) {
					target.push(value);
					formData.append(name, value);
				};
				if (typeof target[key] === "function") return function() {
					target[key].apply(target, arguments);
					formData.delete(name);
					target.forEach(function(v) {
						formData.append(name, v);
					});
				};
				if (target[key] && target[key].length === 1) return target[key][0];
				else return target[key];
			},
			set: function(target, index, value) {
				target[index] = value;
				formData.delete(name);
				target.forEach(function(v) {
					formData.append(name, v);
				});
				return true;
			}
		});
	}
	/**
	* @param {FormData} formData
	* @returns {Object}
	*/
	function formDataProxy(formData) {
		return new Proxy(formData, {
			get: function(target, name) {
				if (typeof name === "symbol") {
					const result = Reflect.get(target, name);
					if (typeof result === "function") return function() {
						return result.apply(formData, arguments);
					};
					else return result;
				}
				if (name === "toJSON") return () => Object.fromEntries(formData);
				if (name in target) {
					if (typeof target[name] === "function") return function() {
						return formData[name].apply(formData, arguments);
					};
				}
				const array = formData.getAll(name);
				if (array.length === 0) return;
				else if (array.length === 1) return array[0];
				else return formDataArrayProxy(target, name, array);
			},
			set: function(target, name, value) {
				if (typeof name !== "string") return false;
				target.delete(name);
				if (value && typeof value.forEach === "function") value.forEach(function(v) {
					target.append(name, v);
				});
				else if (typeof value === "object" && !(value instanceof Blob)) target.append(name, JSON.stringify(value));
				else target.append(name, value);
				return true;
			},
			deleteProperty: function(target, name) {
				if (typeof name === "string") target.delete(name);
				return true;
			},
			ownKeys: function(target) {
				return Reflect.ownKeys(Object.fromEntries(target));
			},
			getOwnPropertyDescriptor: function(target, prop) {
				return Reflect.getOwnPropertyDescriptor(Object.fromEntries(target), prop);
			}
		});
	}
	/**
	* @param {HttpVerb} verb
	* @param {string} path
	* @param {Element} elt
	* @param {Event} event
	* @param {HtmxAjaxEtc} [etc]
	* @param {boolean} [confirmed]
	* @return {Promise<void>}
	*/
	function issueAjaxRequest(verb, path, elt, event, etc, confirmed) {
		let resolve = null;
		let reject = null;
		etc = etc != null ? etc : {};
		if (etc.returnPromise && typeof Promise !== "undefined") var promise = new Promise(function(_resolve, _reject) {
			resolve = _resolve;
			reject = _reject;
		});
		if (elt == null) elt = getDocument().body;
		const responseHandler = etc.handler || handleAjaxResponse;
		const select = etc.select || null;
		if (!bodyContains(elt)) {
			maybeCall(resolve);
			return promise;
		}
		const target = etc.targetOverride || asElement(getTarget(elt));
		if (target == null || target == DUMMY_ELT) {
			triggerErrorEvent(elt, "htmx:targetError", { target: getClosestAttributeValue(elt, "hx-target") });
			maybeCall(reject);
			return promise;
		}
		let eltData = getInternalData(elt);
		const submitter = eltData.lastButtonClicked;
		if (submitter) {
			const buttonPath = getRawAttribute(submitter, "formaction");
			if (buttonPath != null) path = buttonPath;
			const buttonVerb = getRawAttribute(submitter, "formmethod");
			if (buttonVerb != null) if (VERBS.includes(buttonVerb.toLowerCase())) verb = buttonVerb;
			else {
				maybeCall(resolve);
				return promise;
			}
		}
		const confirmQuestion = getClosestAttributeValue(elt, "hx-confirm");
		if (confirmed === void 0) {
			const issueRequest = function(skipConfirmation) {
				return issueAjaxRequest(verb, path, elt, event, etc, !!skipConfirmation);
			};
			if (triggerEvent(elt, "htmx:confirm", {
				target,
				elt,
				path,
				verb,
				triggeringEvent: event,
				etc,
				issueRequest,
				question: confirmQuestion
			}) === false) {
				maybeCall(resolve);
				return promise;
			}
		}
		let syncElt = elt;
		let syncStrategy = getClosestAttributeValue(elt, "hx-sync");
		let queueStrategy = null;
		let abortable = false;
		if (syncStrategy) {
			const syncStrings = syncStrategy.split(":");
			const selector = syncStrings[0].trim();
			if (selector === "this") syncElt = findThisElement(elt, "hx-sync");
			else syncElt = asElement(querySelectorExt(elt, selector));
			syncStrategy = (syncStrings[1] || "drop").trim();
			eltData = getInternalData(syncElt);
			if (syncStrategy === "drop" && eltData.xhr && eltData.abortable !== true) {
				maybeCall(resolve);
				return promise;
			} else if (syncStrategy === "abort") if (eltData.xhr) {
				maybeCall(resolve);
				return promise;
			} else abortable = true;
			else if (syncStrategy === "replace") triggerEvent(syncElt, "htmx:abort");
			else if (syncStrategy.indexOf("queue") === 0) queueStrategy = (syncStrategy.split(" ")[1] || "last").trim();
		}
		if (eltData.xhr) if (eltData.abortable) triggerEvent(syncElt, "htmx:abort");
		else {
			if (queueStrategy == null) {
				if (event) {
					const eventData = getInternalData(event);
					if (eventData && eventData.triggerSpec && eventData.triggerSpec.queue) queueStrategy = eventData.triggerSpec.queue;
				}
				if (queueStrategy == null) queueStrategy = "last";
			}
			if (eltData.queuedRequests == null) eltData.queuedRequests = [];
			if (queueStrategy === "first" && eltData.queuedRequests.length === 0) eltData.queuedRequests.push(function() {
				issueAjaxRequest(verb, path, elt, event, etc);
			});
			else if (queueStrategy === "all") eltData.queuedRequests.push(function() {
				issueAjaxRequest(verb, path, elt, event, etc);
			});
			else if (queueStrategy === "last") {
				eltData.queuedRequests = [];
				eltData.queuedRequests.push(function() {
					issueAjaxRequest(verb, path, elt, event, etc);
				});
			}
			maybeCall(resolve);
			return promise;
		}
		const xhr = new XMLHttpRequest();
		eltData.xhr = xhr;
		eltData.abortable = abortable;
		const endRequestLock = function() {
			eltData.xhr = null;
			eltData.abortable = false;
			if (eltData.queuedRequests != null && eltData.queuedRequests.length > 0) eltData.queuedRequests.shift()();
		};
		const promptQuestion = getClosestAttributeValue(elt, "hx-prompt");
		if (promptQuestion) {
			var promptResponse = prompt(promptQuestion);
			if (promptResponse === null || !triggerEvent(elt, "htmx:prompt", {
				prompt: promptResponse,
				target
			})) {
				maybeCall(resolve);
				endRequestLock();
				return promise;
			}
		}
		if (confirmQuestion && !confirmed) {
			if (!confirm(confirmQuestion)) {
				maybeCall(resolve);
				endRequestLock();
				return promise;
			}
		}
		let headers = getHeaders(elt, target, promptResponse);
		if (verb !== "get" && !usesFormData(elt)) headers["Content-Type"] = "application/x-www-form-urlencoded";
		if (etc.headers) headers = mergeObjects(headers, etc.headers);
		const results = getInputValues(elt, verb);
		let errors = results.errors;
		const rawFormData = results.formData;
		if (etc.values) overrideFormData(rawFormData, formDataFromObject(etc.values));
		const allFormData = overrideFormData(rawFormData, formDataFromObject(getExpressionVars(elt, event)));
		let filteredFormData = filterValues(allFormData, elt);
		if (htmx.config.getCacheBusterParam && verb === "get") filteredFormData.set("org.htmx.cache-buster", getRawAttribute(target, "id") || "true");
		if (path == null || path === "") path = location.href;
		/**
		* @type {Object}
		* @property {boolean} [credentials]
		* @property {number} [timeout]
		* @property {boolean} [noHeaders]
		*/
		const requestAttrValues = getValuesForElement(elt, "hx-request");
		const eltIsBoosted = getInternalData(elt).boosted;
		let useUrlParams = htmx.config.methodsThatUseUrlParams.indexOf(verb) >= 0;
		/** @type HtmxRequestConfig */
		const requestConfig = {
			boosted: eltIsBoosted,
			useUrlParams,
			formData: filteredFormData,
			parameters: formDataProxy(filteredFormData),
			unfilteredFormData: allFormData,
			unfilteredParameters: formDataProxy(allFormData),
			headers,
			elt,
			target,
			verb,
			errors,
			withCredentials: etc.credentials || requestAttrValues.credentials || htmx.config.withCredentials,
			timeout: etc.timeout || requestAttrValues.timeout || htmx.config.timeout,
			path,
			triggeringEvent: event
		};
		if (!triggerEvent(elt, "htmx:configRequest", requestConfig)) {
			maybeCall(resolve);
			endRequestLock();
			return promise;
		}
		path = requestConfig.path;
		verb = requestConfig.verb;
		headers = requestConfig.headers;
		filteredFormData = formDataFromObject(requestConfig.parameters);
		errors = requestConfig.errors;
		useUrlParams = requestConfig.useUrlParams;
		if (errors && errors.length > 0) {
			triggerEvent(elt, "htmx:validation:halted", requestConfig);
			maybeCall(resolve);
			endRequestLock();
			return promise;
		}
		const splitPath = path.split("#");
		const pathNoAnchor = splitPath[0];
		const anchor = splitPath[1];
		let finalPath = path;
		if (useUrlParams) {
			finalPath = pathNoAnchor;
			if (!filteredFormData.keys().next().done) {
				if (finalPath.indexOf("?") < 0) finalPath += "?";
				else finalPath += "&";
				finalPath += urlEncode(filteredFormData);
				if (anchor) finalPath += "#" + anchor;
			}
		}
		if (!verifyPath(elt, finalPath, requestConfig)) {
			triggerErrorEvent(elt, "htmx:invalidPath", requestConfig);
			maybeCall(reject);
			endRequestLock();
			return promise;
		}
		xhr.open(verb.toUpperCase(), finalPath, true);
		xhr.overrideMimeType("text/html");
		xhr.withCredentials = requestConfig.withCredentials;
		xhr.timeout = requestConfig.timeout;
		if (requestAttrValues.noHeaders) {} else for (const header in headers) if (headers.hasOwnProperty(header)) {
			const headerValue = headers[header];
			safelySetHeaderValue(xhr, header, headerValue);
		}
		/** @type {HtmxResponseInfo} */
		const responseInfo = {
			xhr,
			target,
			requestConfig,
			etc,
			boosted: eltIsBoosted,
			select,
			pathInfo: {
				requestPath: path,
				finalRequestPath: finalPath,
				responsePath: null,
				anchor
			}
		};
		xhr.onload = function() {
			try {
				const hierarchy = hierarchyForElt(elt);
				responseInfo.pathInfo.responsePath = getPathFromResponse(xhr);
				responseHandler(elt, responseInfo);
				if (responseInfo.keepIndicators !== true) removeRequestIndicators(indicators, disableElts);
				triggerEvent(elt, "htmx:afterRequest", responseInfo);
				triggerEvent(elt, "htmx:afterOnLoad", responseInfo);
				if (!bodyContains(elt)) {
					let secondaryTriggerElt = null;
					while (hierarchy.length > 0 && secondaryTriggerElt == null) {
						const parentEltInHierarchy = hierarchy.shift();
						if (bodyContains(parentEltInHierarchy)) secondaryTriggerElt = parentEltInHierarchy;
					}
					if (secondaryTriggerElt) {
						triggerEvent(secondaryTriggerElt, "htmx:afterRequest", responseInfo);
						triggerEvent(secondaryTriggerElt, "htmx:afterOnLoad", responseInfo);
					}
				}
				maybeCall(resolve);
			} catch (e) {
				triggerErrorEvent(elt, "htmx:onLoadError", mergeObjects({ error: e }, responseInfo));
				throw e;
			} finally {
				endRequestLock();
			}
		};
		xhr.onerror = function() {
			removeRequestIndicators(indicators, disableElts);
			triggerErrorEvent(elt, "htmx:afterRequest", responseInfo);
			triggerErrorEvent(elt, "htmx:sendError", responseInfo);
			maybeCall(reject);
			endRequestLock();
		};
		xhr.onabort = function() {
			removeRequestIndicators(indicators, disableElts);
			triggerErrorEvent(elt, "htmx:afterRequest", responseInfo);
			triggerErrorEvent(elt, "htmx:sendAbort", responseInfo);
			maybeCall(reject);
			endRequestLock();
		};
		xhr.ontimeout = function() {
			removeRequestIndicators(indicators, disableElts);
			triggerErrorEvent(elt, "htmx:afterRequest", responseInfo);
			triggerErrorEvent(elt, "htmx:timeout", responseInfo);
			maybeCall(reject);
			endRequestLock();
		};
		if (!triggerEvent(elt, "htmx:beforeRequest", responseInfo)) {
			maybeCall(resolve);
			endRequestLock();
			return promise;
		}
		var indicators = addRequestIndicatorClasses(elt);
		var disableElts = disableElements(elt);
		forEach([
			"loadstart",
			"loadend",
			"progress",
			"abort"
		], function(eventName) {
			forEach([xhr, xhr.upload], function(target) {
				target.addEventListener(eventName, function(event) {
					triggerEvent(elt, "htmx:xhr:" + eventName, {
						lengthComputable: event.lengthComputable,
						loaded: event.loaded,
						total: event.total
					});
				});
			});
		});
		triggerEvent(elt, "htmx:beforeSend", responseInfo);
		const params = useUrlParams ? null : encodeParamsForBody(xhr, elt, filteredFormData);
		xhr.send(params);
		return promise;
	}
	/**
	* @typedef {Object} HtmxHistoryUpdate
	* @property {string|null} [type]
	* @property {string|null} [path]
	*/
	/**
	* @param {Element} elt
	* @param {HtmxResponseInfo} responseInfo
	* @return {HtmxHistoryUpdate}
	*/
	function determineHistoryUpdates(elt, responseInfo) {
		const xhr = responseInfo.xhr;
		let pathFromHeaders = null;
		let typeFromHeaders = null;
		if (hasHeader(xhr, /HX-Push:/i)) {
			pathFromHeaders = xhr.getResponseHeader("HX-Push");
			typeFromHeaders = "push";
		} else if (hasHeader(xhr, /HX-Push-Url:/i)) {
			pathFromHeaders = xhr.getResponseHeader("HX-Push-Url");
			typeFromHeaders = "push";
		} else if (hasHeader(xhr, /HX-Replace-Url:/i)) {
			pathFromHeaders = xhr.getResponseHeader("HX-Replace-Url");
			typeFromHeaders = "replace";
		}
		if (pathFromHeaders) if (pathFromHeaders === "false") return {};
		else return {
			type: typeFromHeaders,
			path: pathFromHeaders
		};
		const requestPath = responseInfo.pathInfo.finalRequestPath;
		const responsePath = responseInfo.pathInfo.responsePath;
		let pushUrl = responseInfo.etc.push || getClosestAttributeValue(elt, "hx-push-url");
		let replaceUrl = responseInfo.etc.replace || getClosestAttributeValue(elt, "hx-replace-url");
		if (pushUrl === "false") pushUrl = null;
		if (replaceUrl === "false") replaceUrl = null;
		const elementIsBoosted = getInternalData(elt).boosted;
		let saveType = null;
		let path = null;
		if (pushUrl) {
			saveType = "push";
			path = pushUrl;
		} else if (replaceUrl) {
			saveType = "replace";
			path = replaceUrl;
		} else if (elementIsBoosted) {
			saveType = "push";
			path = responsePath || requestPath;
		}
		if (path) {
			if (path === "true") path = responsePath || requestPath;
			if (responseInfo.pathInfo.anchor && path.indexOf("#") === -1) path = path + "#" + responseInfo.pathInfo.anchor;
			return {
				type: saveType,
				path
			};
		} else return {};
	}
	/**
	* @param {HtmxResponseHandlingConfig} responseHandlingConfig
	* @param {number} status
	* @return {boolean}
	*/
	function codeMatches(responseHandlingConfig, status) {
		return new RegExp(responseHandlingConfig.code).test(status.toString(10));
	}
	/**
	* @param {XMLHttpRequest} xhr
	* @return {HtmxResponseHandlingConfig}
	*/
	function resolveResponseHandling(xhr) {
		for (var i = 0; i < htmx.config.responseHandling.length; i++) {
			/** @type HtmxResponseHandlingConfig */
			var responseHandlingElement = htmx.config.responseHandling[i];
			if (codeMatches(responseHandlingElement, xhr.status)) return responseHandlingElement;
		}
		return { swap: false };
	}
	/**
	* @param {string} title
	*/
	function handleTitle(title) {
		if (title) {
			const titleElt = find("title");
			if (titleElt) titleElt.textContent = title;
			else window.document.title = title;
		}
	}
	/**
	* Resove the Retarget selector and throw if not found
	* @param {Element} elt
	* @param {String} target
	* @returns {Element}
	*/
	function resolveRetarget(elt, target) {
		if (target === "this") return elt;
		const resolvedTarget = asElement(querySelectorExt(elt, target));
		if (resolvedTarget == null) {
			triggerErrorEvent(elt, "htmx:targetError", { target });
			throw new Error(`Invalid re-target ${target}`);
		}
		return resolvedTarget;
	}
	/**
	* @param {Element} elt
	* @param {HtmxResponseInfo} responseInfo
	*/
	function handleAjaxResponse(elt, responseInfo) {
		const xhr = responseInfo.xhr;
		let target = responseInfo.target;
		const etc = responseInfo.etc;
		const responseInfoSelect = responseInfo.select;
		if (!triggerEvent(elt, "htmx:beforeOnLoad", responseInfo)) return;
		if (hasHeader(xhr, /HX-Trigger:/i)) handleTriggerHeader(xhr, "HX-Trigger", elt);
		if (hasHeader(xhr, /HX-Location:/i)) {
			let redirectPath = xhr.getResponseHeader("HX-Location");
			/** @type {HtmxAjaxHelperContext&{path?:string}} */
			var redirectSwapSpec = {};
			if (redirectPath.indexOf("{") === 0) {
				redirectSwapSpec = parseJSON(redirectPath);
				redirectPath = redirectSwapSpec.path;
				delete redirectSwapSpec.path;
			}
			redirectSwapSpec.push = redirectSwapSpec.push ?? "true";
			ajaxHelper("get", redirectPath, redirectSwapSpec);
			return;
		}
		const shouldRefresh = hasHeader(xhr, /HX-Refresh:/i) && xhr.getResponseHeader("HX-Refresh") === "true";
		if (hasHeader(xhr, /HX-Redirect:/i)) {
			responseInfo.keepIndicators = true;
			htmx.location.href = xhr.getResponseHeader("HX-Redirect");
			shouldRefresh && htmx.location.reload();
			return;
		}
		if (shouldRefresh) {
			responseInfo.keepIndicators = true;
			htmx.location.reload();
			return;
		}
		const historyUpdate = determineHistoryUpdates(elt, responseInfo);
		const responseHandling = resolveResponseHandling(xhr);
		const shouldSwap = responseHandling.swap;
		let isError = !!responseHandling.error;
		let ignoreTitle = htmx.config.ignoreTitle || responseHandling.ignoreTitle;
		let selectOverride = responseHandling.select;
		if (responseHandling.target) responseInfo.target = resolveRetarget(elt, responseHandling.target);
		var swapOverride = etc.swapOverride;
		if (swapOverride == null && responseHandling.swapOverride) swapOverride = responseHandling.swapOverride;
		if (hasHeader(xhr, /HX-Retarget:/i)) responseInfo.target = resolveRetarget(elt, xhr.getResponseHeader("HX-Retarget"));
		if (hasHeader(xhr, /HX-Reswap:/i)) swapOverride = xhr.getResponseHeader("HX-Reswap");
		var serverResponse = xhr.response;
		/** @type HtmxBeforeSwapDetails */
		var beforeSwapDetails = mergeObjects({
			shouldSwap,
			serverResponse,
			isError,
			ignoreTitle,
			selectOverride,
			swapOverride
		}, responseInfo);
		if (responseHandling.event && !triggerEvent(target, responseHandling.event, beforeSwapDetails)) return;
		if (!triggerEvent(target, "htmx:beforeSwap", beforeSwapDetails)) return;
		target = beforeSwapDetails.target;
		serverResponse = beforeSwapDetails.serverResponse;
		isError = beforeSwapDetails.isError;
		ignoreTitle = beforeSwapDetails.ignoreTitle;
		selectOverride = beforeSwapDetails.selectOverride;
		swapOverride = beforeSwapDetails.swapOverride;
		responseInfo.target = target;
		responseInfo.failed = isError;
		responseInfo.successful = !isError;
		if (beforeSwapDetails.shouldSwap) {
			if (xhr.status === 286) cancelPolling(elt);
			withExtensions(elt, function(extension) {
				serverResponse = extension.transformResponse(serverResponse, xhr, elt);
			});
			if (historyUpdate.type) saveCurrentPageToHistory();
			var swapSpec = getSwapSpecification(elt, swapOverride);
			if (!swapSpec.hasOwnProperty("ignoreTitle")) swapSpec.ignoreTitle = ignoreTitle;
			addClassToElement(target, htmx.config.swappingClass);
			if (responseInfoSelect) selectOverride = responseInfoSelect;
			if (hasHeader(xhr, /HX-Reselect:/i)) selectOverride = xhr.getResponseHeader("HX-Reselect");
			const selectOOB = etc.selectOOB || getClosestAttributeValue(elt, "hx-select-oob");
			const select = getClosestAttributeValue(elt, "hx-select");
			swap(target, serverResponse, swapSpec, {
				select: selectOverride === "unset" ? null : selectOverride || select,
				selectOOB,
				eventInfo: responseInfo,
				anchor: responseInfo.pathInfo.anchor,
				contextElement: elt,
				afterSwapCallback: function() {
					if (hasHeader(xhr, /HX-Trigger-After-Swap:/i)) {
						let finalElt = elt;
						if (!bodyContains(elt)) finalElt = getDocument().body;
						handleTriggerHeader(xhr, "HX-Trigger-After-Swap", finalElt);
					}
				},
				afterSettleCallback: function() {
					if (hasHeader(xhr, /HX-Trigger-After-Settle:/i)) {
						let finalElt = elt;
						if (!bodyContains(elt)) finalElt = getDocument().body;
						handleTriggerHeader(xhr, "HX-Trigger-After-Settle", finalElt);
					}
				},
				beforeSwapCallback: function() {
					if (historyUpdate.type) {
						triggerEvent(getDocument().body, "htmx:beforeHistoryUpdate", mergeObjects({ history: historyUpdate }, responseInfo));
						if (historyUpdate.type === "push") {
							pushUrlIntoHistory(historyUpdate.path);
							triggerEvent(getDocument().body, "htmx:pushedIntoHistory", { path: historyUpdate.path });
						} else {
							replaceUrlInHistory(historyUpdate.path);
							triggerEvent(getDocument().body, "htmx:replacedInHistory", { path: historyUpdate.path });
						}
					}
				}
			});
		}
		if (isError) triggerErrorEvent(elt, "htmx:responseError", mergeObjects({ error: "Response Status Error Code " + xhr.status + " from " + responseInfo.pathInfo.requestPath }, responseInfo));
	}
	/** @type {Object<string, HtmxExtension>} */
	const extensions = {};
	/**
	* extensionBase defines the default functions for all extensions.
	* @returns {HtmxExtension}
	*/
	function extensionBase() {
		return {
			init: function(api) {
				return null;
			},
			getSelectors: function() {
				return null;
			},
			onEvent: function(name, evt) {
				return true;
			},
			transformResponse: function(text, xhr, elt) {
				return text;
			},
			isInlineSwap: function(swapStyle) {
				return false;
			},
			handleSwap: function(swapStyle, target, fragment, settleInfo) {
				return false;
			},
			encodeParameters: function(xhr, parameters, elt) {
				return null;
			}
		};
	}
	/**
	* defineExtension initializes the extension and adds it to the htmx registry
	*
	* @see https://htmx.org/api/#defineExtension
	*
	* @param {string} name the extension name
	* @param {Partial<HtmxExtension>} extension the extension definition
	*/
	function defineExtension(name, extension) {
		if (extension.init) extension.init(internalAPI);
		extensions[name] = mergeObjects(extensionBase(), extension);
	}
	/**
	* removeExtension removes an extension from the htmx registry
	*
	* @see https://htmx.org/api/#removeExtension
	*
	* @param {string} name
	*/
	function removeExtension(name) {
		delete extensions[name];
	}
	/**
	* getExtensions searches up the DOM tree to return all extensions that can be applied to a given element
	*
	* @param {Element} elt
	* @param {HtmxExtension[]=} extensionsToReturn
	* @param {string[]=} extensionsToIgnore
	* @returns {HtmxExtension[]}
	*/
	function getExtensions(elt, extensionsToReturn, extensionsToIgnore) {
		if (extensionsToReturn == void 0) extensionsToReturn = [];
		if (elt == void 0) return extensionsToReturn;
		if (extensionsToIgnore == void 0) extensionsToIgnore = [];
		const extensionsForElement = getAttributeValue(elt, "hx-ext");
		if (extensionsForElement) forEach(extensionsForElement.split(","), function(extensionName) {
			extensionName = extensionName.replace(/ /g, "");
			if (extensionName.slice(0, 7) == "ignore:") {
				extensionsToIgnore.push(extensionName.slice(7));
				return;
			}
			if (extensionsToIgnore.indexOf(extensionName) < 0) {
				const extension = extensions[extensionName];
				if (extension && extensionsToReturn.indexOf(extension) < 0) extensionsToReturn.push(extension);
			}
		});
		return getExtensions(asElement(parentElt(elt)), extensionsToReturn, extensionsToIgnore);
	}
	var isReady = false;
	getDocument().addEventListener("DOMContentLoaded", function() {
		isReady = true;
	});
	/**
	* Execute a function now if DOMContentLoaded has fired, otherwise listen for it.
	*
	* This function uses isReady because there is no reliable way to ask the browser whether
	* the DOMContentLoaded event has already been fired; there's a gap between DOMContentLoaded
	* firing and readystate=complete.
	*/
	function ready(fn) {
		if (isReady || getDocument().readyState === "complete") fn();
		else getDocument().addEventListener("DOMContentLoaded", fn);
	}
	function insertIndicatorStyles() {
		if (htmx.config.includeIndicatorStyles !== false) {
			const nonceAttribute = htmx.config.inlineStyleNonce ? ` nonce="${htmx.config.inlineStyleNonce}"` : "";
			const indicator = htmx.config.indicatorClass;
			const request = htmx.config.requestClass;
			getDocument().head.insertAdjacentHTML("beforeend", `<style${nonceAttribute}>.${indicator}{opacity:0;visibility: hidden} .${request} .${indicator}, .${request}.${indicator}{opacity:1;visibility: visible;transition: opacity 200ms ease-in}</style>`);
		}
	}
	function getMetaConfig() {
		/** @type HTMLMetaElement */
		const element = getDocument().querySelector("meta[name=\"htmx-config\"]");
		if (element) return parseJSON(element.content);
		else return null;
	}
	function mergeMetaConfig() {
		const metaConfig = getMetaConfig();
		if (metaConfig) htmx.config = mergeObjects(htmx.config, metaConfig);
	}
	ready(function() {
		mergeMetaConfig();
		insertIndicatorStyles();
		let body = getDocument().body;
		processNode(body);
		const restoredElts = getDocument().querySelectorAll("[hx-trigger='restored'],[data-hx-trigger='restored']");
		body.addEventListener("htmx:abort", function(evt) {
			const internalData = getInternalData(evt.detail.elt || evt.target);
			if (internalData && internalData.xhr) internalData.xhr.abort();
		});
		/** @type {(ev: PopStateEvent) => any} */
		const originalPopstate = window.onpopstate ? window.onpopstate.bind(window) : null;
		/** @type {(ev: PopStateEvent) => any} */
		window.onpopstate = function(event) {
			if (event.state && event.state.htmx) {
				restoreHistory();
				forEach(restoredElts, function(elt) {
					triggerEvent(elt, "htmx:restored", {
						document: getDocument(),
						triggerEvent
					});
				});
			} else if (originalPopstate) originalPopstate(event);
		};
		getWindow().setTimeout(function() {
			triggerEvent(body, "htmx:load", {});
			body = null;
		}, 0);
	});
	return htmx;
})();
//#endregion
//#region resources/js/frontend.js
document.addEventListener("DOMContentLoaded", function() {
	htmx.config.selfRequestsOnly = false;
	initReviewModal();
});
function initReviewModal() {
	const modal = document.getElementById("ypg-review-modal");
	if (!modal) return;
	enableDrag(modal);
	const closeButton = modal.querySelector(".ypg-close-modal");
	if (closeButton) closeButton.addEventListener("click", function() {
		modal.classList.add("closed");
	});
	window.addEventListener("resize", function() {
		reposition(modal);
	});
}
/**
* Handles element repositioning (through dragging)
* @param {HTMLElement} element
* @param {Event}       event
*/
function reposition(element, event) {
	let newLeft = element.offsetLeft;
	let newTop = element.offsetTop;
	if (event) {
		const deltaX = element._prevX - event.clientX;
		const deltaY = element._prevY - event.clientY;
		newLeft = element.offsetLeft - deltaX;
		newTop = element.offsetTop - deltaY;
		element._prevX = event.clientX;
		element._prevY = event.clientY;
	}
	const rect = element.getBoundingClientRect();
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	if (rect.right > vw) newLeft = vw - rect.width;
	if (rect.bottom > vh) newTop = vh - rect.height;
	if (rect.left < 0) newLeft = 0;
	if (rect.top < 0) newTop = 0;
	element.style.left = newLeft + "px";
	element.style.top = newTop + "px";
	element.style.right = "auto";
}
/**
* Handles drag functionality on an element
* @param {HTMLElement} element
*/
function enableDrag(element) {
	let isDragging = false;
	element.style.cursor = "grab";
	element.addEventListener("mousedown", initDragging);
	function initDragging(event) {
		if (event.target.closest("button, input, textarea, a, select")) return;
		event.preventDefault();
		isDragging = true;
		element._prevX = event.clientX;
		element._prevY = event.clientY;
		document.addEventListener("mousemove", startDragging);
		document.addEventListener("mouseup", stopDragging);
		element.style.cursor = "grabbing";
	}
	function startDragging(event) {
		if (!isDragging) return;
		event.preventDefault();
		reposition(element, event);
	}
	function stopDragging() {
		if (!isDragging) return;
		isDragging = false;
		element.style.cursor = "grab";
		document.removeEventListener("mousemove", startDragging);
		document.removeEventListener("mouseup", stopDragging);
	}
}
//#endregion

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQuanMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2h0bXgub3JnQDIuMC4xMC9ub2RlX21vZHVsZXMvaHRteC5vcmcvZGlzdC9odG14LmVzbS5qcyIsIi4uL3Jlc291cmNlcy9qcy9mcm9udGVuZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaHRteCA9IChmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnXG5cbiAgLy8gUHVibGljIEFQSVxuICBjb25zdCBodG14ID0ge1xuICAgIC8vIFRzYyBtYWRuZXNzIGhlcmUsIGFzc2lnbmluZyB0aGUgZnVuY3Rpb25zIGRpcmVjdGx5IHJlc3VsdHMgaW4gYW4gaW52YWxpZCBUeXBlU2NyaXB0IG91dHB1dCwgYnV0IHJlYXNzaWduaW5nIGlzIGZpbmVcbiAgICAvKiBFdmVudCBwcm9jZXNzaW5nICovXG4gICAgLyoqIEB0eXBlIHt0eXBlb2Ygb25Mb2FkSGVscGVyfSAqL1xuICAgIG9uTG9hZDogbnVsbCxcbiAgICAvKiogQHR5cGUge3R5cGVvZiBwcm9jZXNzTm9kZX0gKi9cbiAgICBwcm9jZXNzOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIGFkZEV2ZW50TGlzdGVuZXJJbXBsfSAqL1xuICAgIG9uOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIHJlbW92ZUV2ZW50TGlzdGVuZXJJbXBsfSAqL1xuICAgIG9mZjogbnVsbCxcbiAgICAvKiogQHR5cGUge3R5cGVvZiB0cmlnZ2VyRXZlbnR9ICovXG4gICAgdHJpZ2dlcjogbnVsbCxcbiAgICAvKiogQHR5cGUge3R5cGVvZiBhamF4SGVscGVyfSAqL1xuICAgIGFqYXg6IG51bGwsXG4gICAgLyogRE9NIHF1ZXJ5aW5nIGhlbHBlcnMgKi9cbiAgICAvKiogQHR5cGUge3R5cGVvZiBmaW5kfSAqL1xuICAgIGZpbmQ6IG51bGwsXG4gICAgLyoqIEB0eXBlIHt0eXBlb2YgZmluZEFsbH0gKi9cbiAgICBmaW5kQWxsOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIGNsb3Nlc3R9ICovXG4gICAgY2xvc2VzdDogbnVsbCxcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBpbnB1dCB2YWx1ZXMgdGhhdCB3b3VsZCByZXNvbHZlIGZvciBhIGdpdmVuIGVsZW1lbnQgdmlhIHRoZSBodG14IHZhbHVlIHJlc29sdXRpb24gbWVjaGFuaXNtXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyN2YWx1ZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0IHRoZSBlbGVtZW50IHRvIHJlc29sdmUgdmFsdWVzIG9uXG4gICAgICogQHBhcmFtIHtIdHRwVmVyYn0gdHlwZSB0aGUgcmVxdWVzdCB0eXBlIChlLmcuICoqZ2V0Kiogb3IgKipwb3N0KiopIG5vbi1HRVQncyB3aWxsIGluY2x1ZGUgdGhlIGVuY2xvc2luZyBmb3JtIG9mIHRoZSBlbGVtZW50LiBEZWZhdWx0cyB0byAqKnBvc3QqKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICovXG4gICAgdmFsdWVzOiBmdW5jdGlvbihlbHQsIHR5cGUpIHtcbiAgICAgIGNvbnN0IGlucHV0VmFsdWVzID0gZ2V0SW5wdXRWYWx1ZXMoZWx0LCB0eXBlIHx8ICdwb3N0JylcbiAgICAgIHJldHVybiBpbnB1dFZhbHVlcy52YWx1ZXNcbiAgICB9LFxuICAgIC8qIERPTSBtYW5pcHVsYXRpb24gaGVscGVycyAqL1xuICAgIC8qKiBAdHlwZSB7dHlwZW9mIHJlbW92ZUVsZW1lbnR9ICovXG4gICAgcmVtb3ZlOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIGFkZENsYXNzVG9FbGVtZW50fSAqL1xuICAgIGFkZENsYXNzOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIHJlbW92ZUNsYXNzRnJvbUVsZW1lbnR9ICovXG4gICAgcmVtb3ZlQ2xhc3M6IG51bGwsXG4gICAgLyoqIEB0eXBlIHt0eXBlb2YgdG9nZ2xlQ2xhc3NPbkVsZW1lbnR9ICovXG4gICAgdG9nZ2xlQ2xhc3M6IG51bGwsXG4gICAgLyoqIEB0eXBlIHt0eXBlb2YgdGFrZUNsYXNzRm9yRWxlbWVudH0gKi9cbiAgICB0YWtlQ2xhc3M6IG51bGwsXG4gICAgLyoqIEB0eXBlIHt0eXBlb2Ygc3dhcH0gKi9cbiAgICBzd2FwOiBudWxsLFxuICAgIC8qIEV4dGVuc2lvbiBlbnRyeXBvaW50cyAqL1xuICAgIC8qKiBAdHlwZSB7dHlwZW9mIGRlZmluZUV4dGVuc2lvbn0gKi9cbiAgICBkZWZpbmVFeHRlbnNpb246IG51bGwsXG4gICAgLyoqIEB0eXBlIHt0eXBlb2YgcmVtb3ZlRXh0ZW5zaW9ufSAqL1xuICAgIHJlbW92ZUV4dGVuc2lvbjogbnVsbCxcbiAgICAvKiBEZWJ1Z2dpbmcgKi9cbiAgICAvKiogQHR5cGUge3R5cGVvZiBsb2dBbGx9ICovXG4gICAgbG9nQWxsOiBudWxsLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIGxvZ05vbmV9ICovXG4gICAgbG9nTm9uZTogbnVsbCxcbiAgICAvKiBEZWJ1Z2dpbmcgKi9cbiAgICAvKipcbiAgICAgKiBUaGUgbG9nZ2VyIGh0bXggdXNlcyB0byBsb2cgd2l0aFxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jbG9nZ2VyXG4gICAgICovXG4gICAgbG9nZ2VyOiBudWxsLFxuICAgIC8qKlxuICAgICAqIEEgcHJvcGVydHkgaG9sZGluZyB0aGUgY29uZmlndXJhdGlvbiBodG14IHVzZXMgYXQgcnVudGltZS5cbiAgICAgKlxuICAgICAqIE5vdGUgdGhhdCB1c2luZyBhIFttZXRhIHRhZ10oaHR0cHM6Ly9odG14Lm9yZy9kb2NzLyNjb25maWcpIGlzIHRoZSBwcmVmZXJyZWQgbWVjaGFuaXNtIGZvciBzZXR0aW5nIHRoZXNlIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyNjb25maWdcbiAgICAgKi9cbiAgICBjb25maWc6IHtcbiAgICAgIC8qKlxuICAgICAgICogV2hldGhlciB0byB1c2UgaGlzdG9yeS5cbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAqL1xuICAgICAgaGlzdG9yeUVuYWJsZWQ6IHRydWUsXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBudW1iZXIgb2YgcGFnZXMgdG8ga2VlcCBpbiAqKnNlc3Npb25TdG9yYWdlKiogZm9yIGhpc3Rvcnkgc3VwcG9ydC5cbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICogQGRlZmF1bHQgMTBcbiAgICAgICAqL1xuICAgICAgaGlzdG9yeUNhY2hlU2l6ZTogMTAsXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgKi9cbiAgICAgIHJlZnJlc2hPbkhpc3RvcnlNaXNzOiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGRlZmF1bHQgc3dhcCBzdHlsZSB0byB1c2UgaWYgKipbaHgtc3dhcF0oaHR0cHM6Ly9odG14Lm9yZy9hdHRyaWJ1dGVzL2h4LXN3YXApKiogaXMgb21pdHRlZC5cbiAgICAgICAqIEB0eXBlIEh0bXhTd2FwU3R5bGVcbiAgICAgICAqIEBkZWZhdWx0ICdpbm5lckhUTUwnXG4gICAgICAgKi9cbiAgICAgIGRlZmF1bHRTd2FwU3R5bGU6ICdpbm5lckhUTUwnLFxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZGVmYXVsdCBkZWxheSBiZXR3ZWVuIHJlY2VpdmluZyBhIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBhbmQgZG9pbmcgdGhlIHN3YXAuXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAqL1xuICAgICAgZGVmYXVsdFN3YXBEZWxheTogMCxcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGRlZmF1bHQgZGVsYXkgYmV0d2VlbiBjb21wbGV0aW5nIHRoZSBjb250ZW50IHN3YXAgYW5kIHNldHRsaW5nIGF0dHJpYnV0ZXMuXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqIEBkZWZhdWx0IDIwXG4gICAgICAgKi9cbiAgICAgIGRlZmF1bHRTZXR0bGVEZWxheTogMjAsXG4gICAgICAvKipcbiAgICAgICAqIElmIHRydWUsIGh0bXggd2lsbCBpbmplY3QgYSBzbWFsbCBhbW91bnQgb2YgQ1NTIGludG8gdGhlIHBhZ2UgdG8gbWFrZSBpbmRpY2F0b3JzIGludmlzaWJsZSB1bmxlc3MgdGhlICoqaHRteC1pbmRpY2F0b3IqKiBjbGFzcyBpcyBwcmVzZW50LlxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICovXG4gICAgICBpbmNsdWRlSW5kaWNhdG9yU3R5bGVzOiB0cnVlLFxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgY2xhc3MgdG8gcGxhY2Ugb24gaW5kaWNhdG9ycyB3aGVuIGEgcmVxdWVzdCBpcyBpbiBmbGlnaHQuXG4gICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAqIEBkZWZhdWx0ICdodG14LWluZGljYXRvcidcbiAgICAgICAqL1xuICAgICAgaW5kaWNhdG9yQ2xhc3M6ICdodG14LWluZGljYXRvcicsXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBjbGFzcyB0byBwbGFjZSBvbiB0cmlnZ2VyaW5nIGVsZW1lbnRzIHdoZW4gYSByZXF1ZXN0IGlzIGluIGZsaWdodC5cbiAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICogQGRlZmF1bHQgJ2h0bXgtcmVxdWVzdCdcbiAgICAgICAqL1xuICAgICAgcmVxdWVzdENsYXNzOiAnaHRteC1yZXF1ZXN0JyxcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGNsYXNzIHRvIHRlbXBvcmFyaWx5IHBsYWNlIG9uIGVsZW1lbnRzIHRoYXQgaHRteCBoYXMgYWRkZWQgdG8gdGhlIERPTS5cbiAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICogQGRlZmF1bHQgJ2h0bXgtYWRkZWQnXG4gICAgICAgKi9cbiAgICAgIGFkZGVkQ2xhc3M6ICdodG14LWFkZGVkJyxcbiAgICAgIC8qKlxuICAgICAgICogVGhlIGNsYXNzIHRvIHBsYWNlIG9uIHRhcmdldCBlbGVtZW50cyB3aGVuIGh0bXggaXMgaW4gdGhlIHNldHRsaW5nIHBoYXNlLlxuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKiBAZGVmYXVsdCAnaHRteC1zZXR0bGluZydcbiAgICAgICAqL1xuICAgICAgc2V0dGxpbmdDbGFzczogJ2h0bXgtc2V0dGxpbmcnLFxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgY2xhc3MgdG8gcGxhY2Ugb24gdGFyZ2V0IGVsZW1lbnRzIHdoZW4gaHRteCBpcyBpbiB0aGUgc3dhcHBpbmcgcGhhc2UuXG4gICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAqIEBkZWZhdWx0ICdodG14LXN3YXBwaW5nJ1xuICAgICAgICovXG4gICAgICBzd2FwcGluZ0NsYXNzOiAnaHRteC1zd2FwcGluZycsXG4gICAgICAvKipcbiAgICAgICAqIEFsbG93cyB0aGUgdXNlIG9mIGV2YWwtbGlrZSBmdW5jdGlvbmFsaXR5IGluIGh0bXgsIHRvIGVuYWJsZSAqKmh4LXZhcnMqKiwgdHJpZ2dlciBjb25kaXRpb25zICYgc2NyaXB0IHRhZyBldmFsdWF0aW9uLiBDYW4gYmUgc2V0IHRvICoqZmFsc2UqKiBmb3IgQ1NQIGNvbXBhdGliaWxpdHkuXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgKi9cbiAgICAgIGFsbG93RXZhbDogdHJ1ZSxcbiAgICAgIC8qKlxuICAgICAgICogSWYgc2V0IHRvIGZhbHNlLCBkaXNhYmxlcyB0aGUgaW50ZXJwcmV0YXRpb24gb2Ygc2NyaXB0IHRhZ3MuXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgKi9cbiAgICAgIGFsbG93U2NyaXB0VGFnczogdHJ1ZSxcbiAgICAgIC8qKlxuICAgICAgICogSWYgc2V0LCB0aGUgbm9uY2Ugd2lsbCBiZSBhZGRlZCB0byBpbmxpbmUgc2NyaXB0cy5cbiAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICogQGRlZmF1bHQgJydcbiAgICAgICAqL1xuICAgICAgaW5saW5lU2NyaXB0Tm9uY2U6ICcnLFxuICAgICAgLyoqXG4gICAgICAgKiBJZiBzZXQsIHRoZSBub25jZSB3aWxsIGJlIGFkZGVkIHRvIGlubGluZSBzdHlsZXMuXG4gICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAqIEBkZWZhdWx0ICcnXG4gICAgICAgKi9cbiAgICAgIGlubGluZVN0eWxlTm9uY2U6ICcnLFxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgYXR0cmlidXRlcyB0byBzZXR0bGUgZHVyaW5nIHRoZSBzZXR0bGluZyBwaGFzZS5cbiAgICAgICAqIEB0eXBlIHN0cmluZ1tdXG4gICAgICAgKiBAZGVmYXVsdCBbJ2NsYXNzJywgJ3N0eWxlJywgJ3dpZHRoJywgJ2hlaWdodCddXG4gICAgICAgKi9cbiAgICAgIGF0dHJpYnV0ZXNUb1NldHRsZTogWydjbGFzcycsICdzdHlsZScsICd3aWR0aCcsICdoZWlnaHQnXSxcbiAgICAgIC8qKlxuICAgICAgICogQWxsb3cgY3Jvc3Mtc2l0ZSBBY2Nlc3MtQ29udHJvbCByZXF1ZXN0cyB1c2luZyBjcmVkZW50aWFscyBzdWNoIGFzIGNvb2tpZXMsIGF1dGhvcml6YXRpb24gaGVhZGVycyBvciBUTFMgY2xpZW50IGNlcnRpZmljYXRlcy5cbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgKi9cbiAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICovXG4gICAgICB0aW1lb3V0OiAwLFxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiAqKmdldFdlYlNvY2tldFJlY29ubmVjdERlbGF5KiogZm9yIHJlY29ubmVjdGluZyBhZnRlciB1bmV4cGVjdGVkIGNvbm5lY3Rpb24gbG9zcyBieSB0aGUgZXZlbnQgY29kZSAqKkFibm9ybWFsIENsb3N1cmUqKiwgKipTZXJ2aWNlIFJlc3RhcnQqKiBvciAqKlRyeSBBZ2FpbiBMYXRlcioqLlxuICAgICAgICogQHR5cGUgeydmdWxsLWppdHRlcicgfCAoKHJldHJ5Q291bnQ6bnVtYmVyKSA9PiBudW1iZXIpfVxuICAgICAgICogQGRlZmF1bHQgXCJmdWxsLWppdHRlclwiXG4gICAgICAgKi9cbiAgICAgIHdzUmVjb25uZWN0RGVsYXk6ICdmdWxsLWppdHRlcicsXG4gICAgICAvKipcbiAgICAgICAqIFRoZSB0eXBlIG9mIGJpbmFyeSBkYXRhIGJlaW5nIHJlY2VpdmVkIG92ZXIgdGhlIFdlYlNvY2tldCBjb25uZWN0aW9uXG4gICAgICAgKiBAdHlwZSBCaW5hcnlUeXBlXG4gICAgICAgKiBAZGVmYXVsdCAnYmxvYidcbiAgICAgICAqL1xuICAgICAgd3NCaW5hcnlUeXBlOiAnYmxvYicsXG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICogQGRlZmF1bHQgJ1toeC1kaXNhYmxlXSwgW2RhdGEtaHgtZGlzYWJsZV0nXG4gICAgICAgKi9cbiAgICAgIGRpc2FibGVTZWxlY3RvcjogJ1toeC1kaXNhYmxlXSwgW2RhdGEtaHgtZGlzYWJsZV0nLFxuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZSB7J2F1dG8nIHwgJ2luc3RhbnQnIHwgJ3Ntb290aCd9XG4gICAgICAgKiBAZGVmYXVsdCAnaW5zdGFudCdcbiAgICAgICAqL1xuICAgICAgc2Nyb2xsQmVoYXZpb3I6ICdpbnN0YW50JyxcbiAgICAgIC8qKlxuICAgICAgICogSWYgdGhlIGZvY3VzZWQgZWxlbWVudCBzaG91bGQgYmUgc2Nyb2xsZWQgaW50byB2aWV3LlxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAqL1xuICAgICAgZGVmYXVsdEZvY3VzU2Nyb2xsOiBmYWxzZSxcbiAgICAgIC8qKlxuICAgICAgICogSWYgc2V0IHRvIHRydWUgaHRteCB3aWxsIGluY2x1ZGUgYSBjYWNoZS1idXN0aW5nIHBhcmFtZXRlciBpbiBHRVQgcmVxdWVzdHMgdG8gYXZvaWQgY2FjaGluZyBwYXJ0aWFsIHJlc3BvbnNlcyBieSB0aGUgYnJvd3NlclxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAqL1xuICAgICAgZ2V0Q2FjaGVCdXN0ZXJQYXJhbTogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIElmIHNldCB0byB0cnVlLCBodG14IHdpbGwgdXNlIHRoZSBWaWV3IFRyYW5zaXRpb24gQVBJIHdoZW4gc3dhcHBpbmcgaW4gbmV3IGNvbnRlbnQuXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICovXG4gICAgICBnbG9iYWxWaWV3VHJhbnNpdGlvbnM6IGZhbHNlLFxuICAgICAgLyoqXG4gICAgICAgKiBodG14IHdpbGwgZm9ybWF0IHJlcXVlc3RzIHdpdGggdGhlc2UgbWV0aG9kcyBieSBlbmNvZGluZyB0aGVpciBwYXJhbWV0ZXJzIGluIHRoZSBVUkwsIG5vdCB0aGUgcmVxdWVzdCBib2R5XG4gICAgICAgKiBAdHlwZSB7KEh0dHBWZXJiKVtdfVxuICAgICAgICogQGRlZmF1bHQgWydnZXQnLCAnZGVsZXRlJ11cbiAgICAgICAqL1xuICAgICAgbWV0aG9kc1RoYXRVc2VVcmxQYXJhbXM6IFsnZ2V0JywgJ2RlbGV0ZSddLFxuICAgICAgLyoqXG4gICAgICAgKiBJZiBzZXQgdG8gdHJ1ZSwgZGlzYWJsZXMgaHRteC1iYXNlZCByZXF1ZXN0cyB0byBub24tb3JpZ2luIGhvc3RzLlxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAqL1xuICAgICAgc2VsZlJlcXVlc3RzT25seTogdHJ1ZSxcbiAgICAgIC8qKlxuICAgICAgICogSWYgc2V0IHRvIHRydWUgaHRteCB3aWxsIG5vdCB1cGRhdGUgdGhlIHRpdGxlIG9mIHRoZSBkb2N1bWVudCB3aGVuIGEgdGl0bGUgdGFnIGlzIGZvdW5kIGluIG5ldyBjb250ZW50XG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICovXG4gICAgICBpZ25vcmVUaXRsZTogZmFsc2UsXG4gICAgICAvKipcbiAgICAgICAqIFdoZXRoZXIgdGhlIHRhcmdldCBvZiBhIGJvb3N0ZWQgZWxlbWVudCBpcyBzY3JvbGxlZCBpbnRvIHRoZSB2aWV3cG9ydC5cbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAqL1xuICAgICAgc2Nyb2xsSW50b1ZpZXdPbkJvb3N0OiB0cnVlLFxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgY2FjaGUgdG8gc3RvcmUgZXZhbHVhdGVkIHRyaWdnZXIgc3BlY2lmaWNhdGlvbnMgaW50by5cbiAgICAgICAqIFlvdSBtYXkgZGVmaW5lIGEgc2ltcGxlIG9iamVjdCB0byB1c2UgYSBuZXZlci1jbGVhcmluZyBjYWNoZSwgb3IgaW1wbGVtZW50IHlvdXIgb3duIHN5c3RlbSB1c2luZyBhIFtwcm94eSBvYmplY3RdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1Byb3h5KVxuICAgICAgICogQHR5cGUge09iamVjdHxudWxsfVxuICAgICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAgICovXG4gICAgICB0cmlnZ2VyU3BlY3NDYWNoZTogbnVsbCxcbiAgICAgIC8qKiBAdHlwZSBib29sZWFuICovXG4gICAgICBkaXNhYmxlSW5oZXJpdGFuY2U6IGZhbHNlLFxuICAgICAgLyoqIEB0eXBlIEh0bXhSZXNwb25zZUhhbmRsaW5nQ29uZmlnW10gKi9cbiAgICAgIHJlc3BvbnNlSGFuZGxpbmc6IFtcbiAgICAgICAgeyBjb2RlOiAnMjA0Jywgc3dhcDogZmFsc2UgfSxcbiAgICAgICAgeyBjb2RlOiAnWzIzXS4uJywgc3dhcDogdHJ1ZSB9LFxuICAgICAgICB7IGNvZGU6ICdbNDVdLi4nLCBzd2FwOiBmYWxzZSwgZXJyb3I6IHRydWUgfVxuICAgICAgXSxcbiAgICAgIC8qKlxuICAgICAgICogV2hldGhlciB0byBwcm9jZXNzIE9PQiBzd2FwcyBvbiBlbGVtZW50cyB0aGF0IGFyZSBuZXN0ZWQgd2l0aGluIHRoZSBtYWluIHJlc3BvbnNlIGVsZW1lbnQuXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgKi9cbiAgICAgIGFsbG93TmVzdGVkT29iU3dhcHM6IHRydWUsXG4gICAgICAvKipcbiAgICAgICAqIFdoZXRoZXIgdG8gdHJlYXQgaGlzdG9yeSBjYWNoZSBtaXNzIGZ1bGwgcGFnZSByZWxvYWQgcmVxdWVzdHMgYXMgYSBcIkhYLVJlcXVlc3RcIiBieSByZXR1cm5pbmcgdGhpcyByZXNwb25zZSBoZWFkZXJcbiAgICAgICAqIFRoaXMgc2hvdWxkIGFsd2F5cyBiZSBkaXNhYmxlZCB3aGVuIHVzaW5nIEhYLVJlcXVlc3QgaGVhZGVyIHRvIG9wdGlvbmFsbHkgcmV0dXJuIHBhcnRpYWwgcmVzcG9uc2VzXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgKi9cbiAgICAgIGhpc3RvcnlSZXN0b3JlQXNIeFJlcXVlc3Q6IHRydWUsXG4gICAgICAvKipcbiAgICAgICAqIFdoZXRoZXIgdG8gcmVwb3J0IGlucHV0IHZhbGlkYXRpb24gZXJyb3JzIHRvIHRoZSBlbmQgdXNlciBhbmQgdXBkYXRlIGZvY3VzIHRvIHRoZSBmaXJzdCBpbnB1dCB0aGF0IGZhaWxzIHZhbGlkYXRpb24uXG4gICAgICAgKiBUaGlzIHNob3VsZCBhbHdheXMgYmUgZW5hYmxlZCBhcyB0aGlzIG1hdGNoZXMgZGVmYXVsdCBicm93c2VyIGZvcm0gc3VibWl0IGJlaGF2aW91clxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAqL1xuICAgICAgcmVwb3J0VmFsaWRpdHlPZkZvcm1zOiBmYWxzZVxuICAgIH0sXG4gICAgLyoqIEB0eXBlIHt0eXBlb2YgcGFyc2VJbnRlcnZhbH0gKi9cbiAgICBwYXJzZUludGVydmFsOiBudWxsLFxuICAgIC8qKlxuICAgICAqIHByb3h5IG9mIHdpbmRvdy5sb2NhdGlvbiB1c2VkIGZvciBwYWdlIHJlbG9hZCBmdW5jdGlvbnNcbiAgICAgKiBAdHlwZSBsb2NhdGlvblxuICAgICAqL1xuICAgIGxvY2F0aW9uLFxuICAgIC8qKiBAdHlwZSB7dHlwZW9mIGludGVybmFsRXZhbH0gKi9cbiAgICBfOiBudWxsLFxuICAgIHZlcnNpb246ICcyLjAuMTAnXG4gIH1cbiAgLy8gVHNjIG1hZG5lc3MgcGFydCAyXG4gIGh0bXgub25Mb2FkID0gb25Mb2FkSGVscGVyXG4gIGh0bXgucHJvY2VzcyA9IHByb2Nlc3NOb2RlXG4gIGh0bXgub24gPSBhZGRFdmVudExpc3RlbmVySW1wbFxuICBodG14Lm9mZiA9IHJlbW92ZUV2ZW50TGlzdGVuZXJJbXBsXG4gIGh0bXgudHJpZ2dlciA9IHRyaWdnZXJFdmVudFxuICBodG14LmFqYXggPSBhamF4SGVscGVyXG4gIGh0bXguZmluZCA9IGZpbmRcbiAgaHRteC5maW5kQWxsID0gZmluZEFsbFxuICBodG14LmNsb3Nlc3QgPSBjbG9zZXN0XG4gIGh0bXgucmVtb3ZlID0gcmVtb3ZlRWxlbWVudFxuICBodG14LmFkZENsYXNzID0gYWRkQ2xhc3NUb0VsZW1lbnRcbiAgaHRteC5yZW1vdmVDbGFzcyA9IHJlbW92ZUNsYXNzRnJvbUVsZW1lbnRcbiAgaHRteC50b2dnbGVDbGFzcyA9IHRvZ2dsZUNsYXNzT25FbGVtZW50XG4gIGh0bXgudGFrZUNsYXNzID0gdGFrZUNsYXNzRm9yRWxlbWVudFxuICBodG14LnN3YXAgPSBzd2FwXG4gIGh0bXguZGVmaW5lRXh0ZW5zaW9uID0gZGVmaW5lRXh0ZW5zaW9uXG4gIGh0bXgucmVtb3ZlRXh0ZW5zaW9uID0gcmVtb3ZlRXh0ZW5zaW9uXG4gIGh0bXgubG9nQWxsID0gbG9nQWxsXG4gIGh0bXgubG9nTm9uZSA9IGxvZ05vbmVcbiAgaHRteC5wYXJzZUludGVydmFsID0gcGFyc2VJbnRlcnZhbFxuICBodG14Ll8gPSBpbnRlcm5hbEV2YWxcblxuICBjb25zdCBpbnRlcm5hbEFQSSA9IHtcbiAgICBhZGRUcmlnZ2VySGFuZGxlcixcbiAgICBib2R5Q29udGFpbnMsXG4gICAgY2FuQWNjZXNzTG9jYWxTdG9yYWdlLFxuICAgIGZpbmRUaGlzRWxlbWVudCxcbiAgICBmaWx0ZXJWYWx1ZXMsXG4gICAgc3dhcCxcbiAgICBoYXNBdHRyaWJ1dGUsXG4gICAgZ2V0QXR0cmlidXRlVmFsdWUsXG4gICAgZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlLFxuICAgIGdldENsb3Nlc3RNYXRjaCxcbiAgICBnZXRFeHByZXNzaW9uVmFycyxcbiAgICBnZXRIZWFkZXJzLFxuICAgIGdldElucHV0VmFsdWVzLFxuICAgIGdldEludGVybmFsRGF0YSxcbiAgICBnZXRTd2FwU3BlY2lmaWNhdGlvbixcbiAgICBnZXRUcmlnZ2VyU3BlY3MsXG4gICAgZ2V0VGFyZ2V0LFxuICAgIG1ha2VGcmFnbWVudCxcbiAgICBtZXJnZU9iamVjdHMsXG4gICAgbWFrZVNldHRsZUluZm8sXG4gICAgb29iU3dhcCxcbiAgICBxdWVyeVNlbGVjdG9yRXh0LFxuICAgIHNldHRsZUltbWVkaWF0ZWx5LFxuICAgIHNob3VsZENhbmNlbCxcbiAgICB0cmlnZ2VyRXZlbnQsXG4gICAgdHJpZ2dlckVycm9yRXZlbnQsXG4gICAgd2l0aEV4dGVuc2lvbnNcbiAgfVxuXG4gIGNvbnN0IFZFUkJTID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnZGVsZXRlJywgJ3BhdGNoJ11cbiAgY29uc3QgVkVSQl9TRUxFQ1RPUiA9IFZFUkJTLm1hcChmdW5jdGlvbih2ZXJiKSB7XG4gICAgcmV0dXJuICdbaHgtJyArIHZlcmIgKyAnXSwgW2RhdGEtaHgtJyArIHZlcmIgKyAnXSdcbiAgfSkuam9pbignLCAnKVxuXG4gIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFV0aWxpdGllc1xuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICAgKiBQYXJzZXMgYW4gaW50ZXJ2YWwgc3RyaW5nIGNvbnNpc3RlbnQgd2l0aCB0aGUgd2F5IGh0bXggZG9lcy4gVXNlZnVsIGZvciBwbHVnaW5zIHRoYXQgaGF2ZSB0aW1pbmctcmVsYXRlZCBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBDYXV0aW9uOiBBY2NlcHRzIGFuIGludCBmb2xsb3dlZCBieSBlaXRoZXIgKipzKiogb3IgKiptcyoqLiBBbGwgb3RoZXIgdmFsdWVzIHVzZSAqKnBhcnNlRmxvYXQqKlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyNwYXJzZUludGVydmFsXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgdGltaW5nIHN0cmluZ1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfHVuZGVmaW5lZH1cbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlSW50ZXJ2YWwoc3RyKSB7XG4gICAgaWYgKHN0ciA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBsZXQgaW50ZXJ2YWwgPSBOYU5cbiAgICBpZiAoc3RyLnNsaWNlKC0yKSA9PSAnbXMnKSB7XG4gICAgICBpbnRlcnZhbCA9IHBhcnNlRmxvYXQoc3RyLnNsaWNlKDAsIC0yKSlcbiAgICB9IGVsc2UgaWYgKHN0ci5zbGljZSgtMSkgPT0gJ3MnKSB7XG4gICAgICBpbnRlcnZhbCA9IHBhcnNlRmxvYXQoc3RyLnNsaWNlKDAsIC0xKSkgKiAxMDAwXG4gICAgfSBlbHNlIGlmIChzdHIuc2xpY2UoLTEpID09ICdtJykge1xuICAgICAgaW50ZXJ2YWwgPSBwYXJzZUZsb2F0KHN0ci5zbGljZSgwLCAtMSkpICogMTAwMCAqIDYwXG4gICAgfSBlbHNlIHtcbiAgICAgIGludGVydmFsID0gcGFyc2VGbG9hdChzdHIpXG4gICAgfVxuICAgIHJldHVybiBpc05hTihpbnRlcnZhbCkgPyB1bmRlZmluZWQgOiBpbnRlcnZhbFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gZWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEByZXR1cm5zIHsoc3RyaW5nIHwgbnVsbCl9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRSYXdBdHRyaWJ1dGUoZWx0LCBuYW1lKSB7XG4gICAgcmV0dXJuIGVsdCBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgZWx0LmdldEF0dHJpYnV0ZShuYW1lKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBxdWFsaWZpZWROYW1lXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgLy8gcmVzb2x2ZSB3aXRoIGJvdGggaHggYW5kIGRhdGEtaHggcHJlZml4ZXNcbiAgZnVuY3Rpb24gaGFzQXR0cmlidXRlKGVsdCwgcXVhbGlmaWVkTmFtZSkge1xuICAgIHJldHVybiAhIWVsdC5oYXNBdHRyaWJ1dGUgJiYgKGVsdC5oYXNBdHRyaWJ1dGUocXVhbGlmaWVkTmFtZSkgfHxcbiAgICAgIGVsdC5oYXNBdHRyaWJ1dGUoJ2RhdGEtJyArIHF1YWxpZmllZE5hbWUpKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gZWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBxdWFsaWZpZWROYW1lXG4gICAqIEByZXR1cm5zIHsoc3RyaW5nIHwgbnVsbCl9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRBdHRyaWJ1dGVWYWx1ZShlbHQsIHF1YWxpZmllZE5hbWUpIHtcbiAgICByZXR1cm4gZ2V0UmF3QXR0cmlidXRlKGVsdCwgcXVhbGlmaWVkTmFtZSkgfHwgZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ2RhdGEtJyArIHF1YWxpZmllZE5hbWUpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBlbHRcbiAgICogQHJldHVybnMge05vZGUgfCBudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gcGFyZW50RWx0KGVsdCkge1xuICAgIGNvbnN0IHBhcmVudCA9IGVsdC5wYXJlbnRFbGVtZW50XG4gICAgaWYgKCFwYXJlbnQgJiYgZWx0LnBhcmVudE5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSByZXR1cm4gZWx0LnBhcmVudE5vZGVcbiAgICByZXR1cm4gcGFyZW50XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge0RvY3VtZW50fVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0RG9jdW1lbnQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBlbHRcbiAgICogQHBhcmFtIHtib29sZWFufSBnbG9iYWxcbiAgICogQHJldHVybnMge05vZGV8RG9jdW1lbnR9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRSb290Tm9kZShlbHQsIGdsb2JhbCkge1xuICAgIHJldHVybiBlbHQuZ2V0Um9vdE5vZGUgPyBlbHQuZ2V0Um9vdE5vZGUoeyBjb21wb3NlZDogZ2xvYmFsIH0pIDogZ2V0RG9jdW1lbnQoKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gZWx0XG4gICAqIEBwYXJhbSB7KGU6Tm9kZSkgPT4gYm9vbGVhbn0gY29uZGl0aW9uXG4gICAqIEByZXR1cm5zIHtOb2RlIHwgbnVsbH1cbiAgICovXG4gIGZ1bmN0aW9uIGdldENsb3Nlc3RNYXRjaChlbHQsIGNvbmRpdGlvbikge1xuICAgIHdoaWxlIChlbHQgJiYgIWNvbmRpdGlvbihlbHQpKSB7XG4gICAgICBlbHQgPSBwYXJlbnRFbHQoZWx0KVxuICAgIH1cblxuICAgIHJldHVybiBlbHQgfHwgbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gaW5pdGlhbEVsZW1lbnRcbiAgICogQHBhcmFtIHtFbGVtZW50fSBhbmNlc3RvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlTmFtZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRBdHRyaWJ1dGVWYWx1ZVdpdGhEaXNpbmhlcml0YW5jZShpbml0aWFsRWxlbWVudCwgYW5jZXN0b3IsIGF0dHJpYnV0ZU5hbWUpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVWYWx1ZSA9IGdldEF0dHJpYnV0ZVZhbHVlKGFuY2VzdG9yLCBhdHRyaWJ1dGVOYW1lKVxuICAgIGNvbnN0IGRpc2luaGVyaXQgPSBnZXRBdHRyaWJ1dGVWYWx1ZShhbmNlc3RvciwgJ2h4LWRpc2luaGVyaXQnKVxuICAgIHZhciBpbmhlcml0ID0gZ2V0QXR0cmlidXRlVmFsdWUoYW5jZXN0b3IsICdoeC1pbmhlcml0JylcbiAgICBpZiAoaW5pdGlhbEVsZW1lbnQgIT09IGFuY2VzdG9yKSB7XG4gICAgICBpZiAoaHRteC5jb25maWcuZGlzYWJsZUluaGVyaXRhbmNlKSB7XG4gICAgICAgIGlmIChpbmhlcml0ICYmIChpbmhlcml0ID09PSAnKicgfHwgaW5oZXJpdC5zcGxpdCgnICcpLmluZGV4T2YoYXR0cmlidXRlTmFtZSkgPj0gMCkpIHtcbiAgICAgICAgICByZXR1cm4gYXR0cmlidXRlVmFsdWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGlzaW5oZXJpdCAmJiAoZGlzaW5oZXJpdCA9PT0gJyonIHx8IGRpc2luaGVyaXQuc3BsaXQoJyAnKS5pbmRleE9mKGF0dHJpYnV0ZU5hbWUpID49IDApKSB7XG4gICAgICAgIHJldHVybiAndW5zZXQnXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhdHRyaWJ1dGVWYWx1ZVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVOYW1lXG4gICAqIEByZXR1cm5zIHtzdHJpbmcgfCBudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgYXR0cmlidXRlTmFtZSkge1xuICAgIGxldCBjbG9zZXN0QXR0ciA9IG51bGxcbiAgICBnZXRDbG9zZXN0TWF0Y2goZWx0LCBmdW5jdGlvbihlKSB7XG4gICAgICByZXR1cm4gISEoY2xvc2VzdEF0dHIgPSBnZXRBdHRyaWJ1dGVWYWx1ZVdpdGhEaXNpbmhlcml0YW5jZShlbHQsIGFzRWxlbWVudChlKSwgYXR0cmlidXRlTmFtZSkpXG4gICAgfSlcbiAgICBpZiAoY2xvc2VzdEF0dHIgIT09ICd1bnNldCcpIHtcbiAgICAgIHJldHVybiBjbG9zZXN0QXR0clxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IGVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBtYXRjaGVzKGVsdCwgc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gZWx0IGluc3RhbmNlb2YgRWxlbWVudCAmJiBlbHQubWF0Y2hlcyhzZWxlY3RvcilcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRTdGFydFRhZyhzdHIpIHtcbiAgICBjb25zdCB0YWdNYXRjaGVyID0gLzwoW2Etel1bXlxcL1xcMD5cXHgyMFxcdFxcclxcblxcZl0qKS9pXG4gICAgY29uc3QgbWF0Y2ggPSB0YWdNYXRjaGVyLmV4ZWMoc3RyKVxuICAgIGlmIChtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hdGNoWzFdLnRvTG93ZXJDYXNlKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXNwXG4gICAqIEByZXR1cm5zIHtEb2N1bWVudH1cbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlSFRNTChyZXNwKSB7XG4gICAgaWYgKCdwYXJzZUhUTUxVbnNhZmUnIGluIERvY3VtZW50KSB7XG4gICAgICByZXR1cm4gRG9jdW1lbnQucGFyc2VIVE1MVW5zYWZlKHJlc3ApXG4gICAgfVxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKVxuICAgIHJldHVybiBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlc3AsICd0ZXh0L2h0bWwnKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gZnJhZ21lbnRcbiAgICogQHBhcmFtIHtOb2RlfSBlbHRcbiAgICovXG4gIGZ1bmN0aW9uIHRha2VDaGlsZHJlbkZvcihmcmFnbWVudCwgZWx0KSB7XG4gICAgd2hpbGUgKGVsdC5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZyYWdtZW50LmFwcGVuZChlbHQuY2hpbGROb2Rlc1swXSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MU2NyaXB0RWxlbWVudH0gc2NyaXB0XG4gICAqIEByZXR1cm5zIHtIVE1MU2NyaXB0RWxlbWVudH1cbiAgICovXG4gIGZ1bmN0aW9uIGR1cGxpY2F0ZVNjcmlwdChzY3JpcHQpIHtcbiAgICBjb25zdCBuZXdTY3JpcHQgPSBnZXREb2N1bWVudCgpLmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gICAgZm9yRWFjaChzY3JpcHQuYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cikge1xuICAgICAgbmV3U2NyaXB0LnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGF0dHIudmFsdWUpXG4gICAgfSlcbiAgICBuZXdTY3JpcHQudGV4dENvbnRlbnQgPSBzY3JpcHQudGV4dENvbnRlbnRcbiAgICBuZXdTY3JpcHQuYXN5bmMgPSBmYWxzZVxuICAgIGlmIChodG14LmNvbmZpZy5pbmxpbmVTY3JpcHROb25jZSkge1xuICAgICAgbmV3U2NyaXB0Lm5vbmNlID0gaHRteC5jb25maWcuaW5saW5lU2NyaXB0Tm9uY2VcbiAgICB9XG4gICAgcmV0dXJuIG5ld1NjcmlwdFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTFNjcmlwdEVsZW1lbnR9IHNjcmlwdFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIGlzSmF2YVNjcmlwdFNjcmlwdE5vZGUoc2NyaXB0KSB7XG4gICAgcmV0dXJuIHNjcmlwdC5tYXRjaGVzKCdzY3JpcHQnKSAmJiAoc2NyaXB0LnR5cGUgPT09ICd0ZXh0L2phdmFzY3JpcHQnIHx8IHNjcmlwdC50eXBlID09PSAnbW9kdWxlJyB8fCBzY3JpcHQudHlwZSA9PT0gJycpXG4gIH1cblxuICAvKipcbiAgICogd2UgaGF2ZSB0byBtYWtlIG5ldyBjb3BpZXMgb2Ygc2NyaXB0IHRhZ3MgdGhhdCB3ZSBhcmUgZ29pbmcgdG8gaW5zZXJ0IGJlY2F1c2VcbiAgICogU09NRSBicm93c2VycyAobm90IHNheWluZyB3aG8sIGJ1dCBpdCBpbnZvbHZlcyBhbiBlbGVtZW50IGFuZCBhbiBhbmltYWwpIGRvbid0XG4gICAqIGV4ZWN1dGUgc2NyaXB0cyBjcmVhdGVkIGluIDx0ZW1wbGF0ZT4gdGFncyB3aGVuIHRoZXkgYXJlIGluc2VydGVkIGludG8gdGhlIERPTVxuICAgKiBhbmQgYWxsIHRoZSBvdGhlcnMgZG8gbG1hb1xuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IGZyYWdtZW50XG4gICAqL1xuICBmdW5jdGlvbiBub3JtYWxpemVTY3JpcHRUYWdzKGZyYWdtZW50KSB7XG4gICAgQXJyYXkuZnJvbShmcmFnbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHQnKSkuZm9yRWFjaCgvKiogQHBhcmFtIHtIVE1MU2NyaXB0RWxlbWVudH0gc2NyaXB0ICovIChzY3JpcHQpID0+IHtcbiAgICAgIGlmIChpc0phdmFTY3JpcHRTY3JpcHROb2RlKHNjcmlwdCkpIHtcbiAgICAgICAgY29uc3QgbmV3U2NyaXB0ID0gZHVwbGljYXRlU2NyaXB0KHNjcmlwdClcbiAgICAgICAgY29uc3QgcGFyZW50ID0gc2NyaXB0LnBhcmVudE5vZGVcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5ld1NjcmlwdCwgc2NyaXB0KVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgbG9nRXJyb3IoZSlcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBzY3JpcHQucmVtb3ZlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYge0RvY3VtZW50RnJhZ21lbnQgJiB7dGl0bGU/OiBzdHJpbmd9fSBEb2N1bWVudEZyYWdtZW50V2l0aFRpdGxlXG4gICAqIEBkZXNjcmlwdGlvbiAgYSBkb2N1bWVudCBmcmFnbWVudCByZXByZXNlbnRpbmcgdGhlIHJlc3BvbnNlIEhUTUwsIGluY2x1ZGluZ1xuICAgKiBhIGB0aXRsZWAgcHJvcGVydHkgZm9yIGFueSB0aXRsZSBpbmZvcm1hdGlvbiBmb3VuZFxuICAgKi9cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlIEhUTUxcbiAgICogQHJldHVybnMge0RvY3VtZW50RnJhZ21lbnRXaXRoVGl0bGV9XG4gICAqL1xuICBmdW5jdGlvbiBtYWtlRnJhZ21lbnQocmVzcG9uc2UpIHtcbiAgICAvLyBzdHJpcCBoZWFkIHRhZyB0byBkZXRlcm1pbmUgc2hhcGUgb2YgcmVzcG9uc2Ugd2UgYXJlIGRlYWxpbmcgd2l0aFxuICAgIGNvbnN0IHJlc3BvbnNlV2l0aE5vSGVhZCA9IHJlc3BvbnNlLnJlcGxhY2UoLzxoZWFkKFxcc1tePl0qKT8+W1xcc1xcU10qPzxcXC9oZWFkPi9pLCAnJylcbiAgICBjb25zdCBzdGFydFRhZyA9IGdldFN0YXJ0VGFnKHJlc3BvbnNlV2l0aE5vSGVhZClcbiAgICAvKiogQHR5cGUgRG9jdW1lbnRGcmFnbWVudFdpdGhUaXRsZSAqL1xuICAgIGxldCBmcmFnbWVudFxuICAgIGlmIChzdGFydFRhZyA9PT0gJ2h0bWwnKSB7XG4gICAgICAvLyBpZiBpdCBpcyBhIGZ1bGwgZG9jdW1lbnQsIHBhcnNlIGl0IGFuZCByZXR1cm4gdGhlIGJvZHlcbiAgICAgIGZyYWdtZW50ID0gLyoqIEB0eXBlIERvY3VtZW50RnJhZ21lbnRXaXRoVGl0bGUgKi8gKG5ldyBEb2N1bWVudEZyYWdtZW50KCkpXG4gICAgICBjb25zdCBkb2MgPSBwYXJzZUhUTUwocmVzcG9uc2UpXG4gICAgICB0YWtlQ2hpbGRyZW5Gb3IoZnJhZ21lbnQsIGRvYy5ib2R5KVxuICAgICAgZnJhZ21lbnQudGl0bGUgPSBkb2MudGl0bGVcbiAgICB9IGVsc2UgaWYgKHN0YXJ0VGFnID09PSAnYm9keScpIHtcbiAgICAgIC8vIHBhcnNlIGJvZHkgdy9vIHdyYXBwaW5nIGluIHRlbXBsYXRlXG4gICAgICBmcmFnbWVudCA9IC8qKiBAdHlwZSBEb2N1bWVudEZyYWdtZW50V2l0aFRpdGxlICovIChuZXcgRG9jdW1lbnRGcmFnbWVudCgpKVxuICAgICAgY29uc3QgZG9jID0gcGFyc2VIVE1MKHJlc3BvbnNlV2l0aE5vSGVhZClcbiAgICAgIHRha2VDaGlsZHJlbkZvcihmcmFnbWVudCwgZG9jLmJvZHkpXG4gICAgICBmcmFnbWVudC50aXRsZSA9IGRvYy50aXRsZVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvdGhlcndpc2Ugd2UgaGF2ZSBub24tYm9keSBwYXJ0aWFsIEhUTUwgY29udGVudCwgc28gd3JhcCBpdCBpbiBhIHRlbXBsYXRlIHRvIG1heGltaXplIHBhcnNpbmcgZmxleGliaWxpdHlcbiAgICAgIGNvbnN0IGRvYyA9IHBhcnNlSFRNTCgnPGJvZHk+PHRlbXBsYXRlIGNsYXNzPVwiaW50ZXJuYWwtaHRteC13cmFwcGVyXCI+JyArIHJlc3BvbnNlV2l0aE5vSGVhZCArICc8L3RlbXBsYXRlPjwvYm9keT4nKVxuICAgICAgZnJhZ21lbnQgPSAvKiogQHR5cGUgRG9jdW1lbnRGcmFnbWVudFdpdGhUaXRsZSAqLyAoZG9jLnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJykuY29udGVudClcbiAgICAgIC8vIGV4dHJhY3QgdGl0bGUgaW50byBmcmFnbWVudCBmb3IgbGF0ZXIgcHJvY2Vzc2luZ1xuICAgICAgZnJhZ21lbnQudGl0bGUgPSBkb2MudGl0bGVcblxuICAgICAgLy8gZm9yIGxlZ2FjeSByZWFzb25zIHdlIHN1cHBvcnQgYSB0aXRsZSB0YWcgYXQgdGhlIHJvb3QgbGV2ZWwgb2Ygbm9uLWJvZHkgcmVzcG9uc2VzLCBzbyB3ZSBuZWVkIHRvIGhhbmRsZSBpdFxuICAgICAgdmFyIHRpdGxlRWxlbWVudCA9IGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RpdGxlJylcbiAgICAgIGlmICh0aXRsZUVsZW1lbnQgJiYgdGl0bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IGZyYWdtZW50KSB7XG4gICAgICAgIHRpdGxlRWxlbWVudC5yZW1vdmUoKVxuICAgICAgICBmcmFnbWVudC50aXRsZSA9IHRpdGxlRWxlbWVudC5pbm5lclRleHRcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZyYWdtZW50KSB7XG4gICAgICBpZiAoaHRteC5jb25maWcuYWxsb3dTY3JpcHRUYWdzKSB7XG4gICAgICAgIG5vcm1hbGl6ZVNjcmlwdFRhZ3MoZnJhZ21lbnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZW1vdmUgYWxsIHNjcmlwdCB0YWdzIGlmIHNjcmlwdHMgYXJlIGRpc2FibGVkXG4gICAgICAgIGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdCcpLmZvckVhY2goKHNjcmlwdCkgPT4gc2NyaXB0LnJlbW92ZSgpKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZnJhZ21lbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jXG4gICAqL1xuICBmdW5jdGlvbiBtYXliZUNhbGwoZnVuYykge1xuICAgIGlmIChmdW5jKSB7XG4gICAgICBmdW5jKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IG9cbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICogQHJldHVybnNcbiAgICovXG4gIGZ1bmN0aW9uIGlzVHlwZShvLCB0eXBlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgJyArIHR5cGUgKyAnXSdcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyp9IG9cbiAgICogQHJldHVybnMge28gaXMgRnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBpc0Z1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdHlwZW9mIG8gPT09ICdmdW5jdGlvbidcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyp9IG9cbiAgICogQHJldHVybnMge28gaXMgT2JqZWN0fVxuICAgKi9cbiAgZnVuY3Rpb24gaXNSYXdPYmplY3Qobykge1xuICAgIHJldHVybiBpc1R5cGUobywgJ09iamVjdCcpXG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gT25IYW5kbGVyXG4gICAqIEBwcm9wZXJ0eSB7KGtleW9mIEhUTUxFbGVtZW50RXZlbnRNYXApfHN0cmluZ30gZXZlbnRcbiAgICogQHByb3BlcnR5IHtFdmVudExpc3RlbmVyfSBsaXN0ZW5lclxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gTGlzdGVuZXJJbmZvXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0cmlnZ2VyXG4gICAqIEBwcm9wZXJ0eSB7RXZlbnRMaXN0ZW5lcn0gbGlzdGVuZXJcbiAgICogQHByb3BlcnR5IHtFdmVudFRhcmdldH0gb25cbiAgICovXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IEh0bXhOb2RlSW50ZXJuYWxEYXRhXG4gICAqIEVsZW1lbnQgZGF0YVxuICAgKiBAcHJvcGVydHkge251bWJlcn0gW2luaXRIYXNoXVxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFtib29zdGVkXVxuICAgKiBAcHJvcGVydHkge09uSGFuZGxlcltdfSBbb25IYW5kbGVyc11cbiAgICogQHByb3BlcnR5IHtudW1iZXJ9IFt0aW1lb3V0XVxuICAgKiBAcHJvcGVydHkge0xpc3RlbmVySW5mb1tdfSBbbGlzdGVuZXJJbmZvc11cbiAgICogQHByb3BlcnR5IHtib29sZWFufSBbY2FuY2VsbGVkXVxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFt0cmlnZ2VyZWRPbmNlXVxuICAgKiBAcHJvcGVydHkge251bWJlcn0gW2RlbGF5ZWRdXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfG51bGx9IFt0aHJvdHRsZV1cbiAgICogQHByb3BlcnR5IHtXZWFrTWFwPEh0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbixXZWFrTWFwPEV2ZW50VGFyZ2V0LHN0cmluZz4+fSBbbGFzdFZhbHVlXVxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFtsb2FkZWRdXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbcGF0aF1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IFt2ZXJiXVxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFtwb2xsaW5nXVxuICAgKiBAcHJvcGVydHkge0hUTUxCdXR0b25FbGVtZW50fEhUTUxJbnB1dEVsZW1lbnR8bnVsbH0gW2xhc3RCdXR0b25DbGlja2VkXVxuICAgKiBAcHJvcGVydHkge251bWJlcn0gW3JlcXVlc3RDb3VudF1cbiAgICogQHByb3BlcnR5IHtYTUxIdHRwUmVxdWVzdH0gW3hocl1cbiAgICogQHByb3BlcnR5IHsoKCkgPT4gdm9pZClbXX0gW3F1ZXVlZFJlcXVlc3RzXVxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFthYm9ydGFibGVdXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2ZpcnN0SW5pdENvbXBsZXRlZF1cbiAgICpcbiAgICogRXZlbnQgZGF0YVxuICAgKiBAcHJvcGVydHkge0h0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbn0gW3RyaWdnZXJTcGVjXVxuICAgKiBAcHJvcGVydHkge0V2ZW50VGFyZ2V0W119IFtoYW5kbGVkRm9yXVxuICAgKi9cblxuICAvKipcbiAgICogZ2V0SW50ZXJuYWxEYXRhIHJldHJpZXZlcyBcInByaXZhdGVcIiBkYXRhIHN0b3JlZCBieSBodG14IHdpdGhpbiBhbiBlbGVtZW50XG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RXZlbnR9IGVsdFxuICAgKiBAcmV0dXJucyB7SHRteE5vZGVJbnRlcm5hbERhdGF9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJbnRlcm5hbERhdGEoZWx0KSB7XG4gICAgY29uc3QgZGF0YVByb3AgPSAnaHRteC1pbnRlcm5hbC1kYXRhJ1xuICAgIGxldCBkYXRhID0gZWx0W2RhdGFQcm9wXVxuICAgIGlmICghZGF0YSkge1xuICAgICAgZGF0YSA9IGVsdFtkYXRhUHJvcF0gPSB7fVxuICAgIH1cbiAgICByZXR1cm4gZGF0YVxuICB9XG5cbiAgLyoqXG4gICAqIHRvQXJyYXkgY29udmVydHMgYW4gQXJyYXlMaWtlIG9iamVjdCBpbnRvIGEgcmVhbCBhcnJheS5cbiAgICogQHRlbXBsYXRlIFRcbiAgICogQHBhcmFtIHtBcnJheUxpa2U8VD59IGFyclxuICAgKiBAcmV0dXJucyB7VFtdfVxuICAgKi9cbiAgZnVuY3Rpb24gdG9BcnJheShhcnIpIHtcbiAgICBjb25zdCByZXR1cm5BcnIgPSBbXVxuICAgIGlmIChhcnIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJldHVybkFyci5wdXNoKGFycltpXSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldHVybkFyclxuICB9XG5cbiAgLyoqXG4gICAqIEB0ZW1wbGF0ZSBUXG4gICAqIEBwYXJhbSB7VFtdfE5hbWVkTm9kZU1hcHxIVE1MQ29sbGVjdGlvbnxIVE1MRm9ybUNvbnRyb2xzQ29sbGVjdGlvbnxBcnJheUxpa2U8VD59IGFyclxuICAgKiBAcGFyYW0geyhUKSA9PiB2b2lkfSBmdW5jXG4gICAqL1xuICBmdW5jdGlvbiBmb3JFYWNoKGFyciwgZnVuYykge1xuICAgIGlmIChhcnIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZ1bmMoYXJyW2ldKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gaXNTY3JvbGxlZEludG9WaWV3KGVsKSB7XG4gICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgY29uc3QgZWxlbVRvcCA9IHJlY3QudG9wXG4gICAgY29uc3QgZWxlbUJvdHRvbSA9IHJlY3QuYm90dG9tXG4gICAgcmV0dXJuIGVsZW1Ub3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgJiYgZWxlbUJvdHRvbSA+PSAwXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaW4gdGhlIGRvY3VtZW50IChpbmNsdWRlcyBzaGFkb3cgcm9vdHMpLlxuICAgKiBUaGlzIGZ1bmN0aW9uIHRoaXMgaXMgYSBzbGlnaHQgbWlzbm9tZXI7IGl0IHdpbGwgcmV0dXJuIHRydWUgZXZlbiBmb3IgZWxlbWVudHMgaW4gdGhlIGhlYWQuXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZX0gZWx0XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gYm9keUNvbnRhaW5zKGVsdCkge1xuICAgIHJldHVybiBlbHQuZ2V0Um9vdE5vZGUoeyBjb21wb3NlZDogdHJ1ZSB9KSA9PT0gZG9jdW1lbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJpZ2dlclxuICAgKiBAcmV0dXJucyB7c3RyaW5nW119XG4gICAqL1xuICBmdW5jdGlvbiBzcGxpdE9uV2hpdGVzcGFjZSh0cmlnZ2VyKSB7XG4gICAgcmV0dXJuIHRyaWdnZXIudHJpbSgpLnNwbGl0KC9cXHMrLylcbiAgfVxuXG4gIC8qKlxuICAgKiBtZXJnZU9iamVjdHMgdGFrZXMgYWxsIHRoZSBrZXlzIGZyb21cbiAgICogb2JqMiBhbmQgZHVwbGljYXRlcyB0aGVtIGludG8gb2JqMVxuICAgKiBAdGVtcGxhdGUgVDFcbiAgICogQHRlbXBsYXRlIFQyXG4gICAqIEBwYXJhbSB7VDF9IG9iajFcbiAgICogQHBhcmFtIHtUMn0gb2JqMlxuICAgKiBAcmV0dXJucyB7VDEgJiBUMn1cbiAgICovXG4gIGZ1bmN0aW9uIG1lcmdlT2JqZWN0cyhvYmoxLCBvYmoyKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqMikge1xuICAgICAgaWYgKG9iajIuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAvLyBAdHMtaWdub3JlIHRzYyBkb2Vzbid0IHNlZW0gdG8gcHJvcGVybHkgaGFuZGxlIHR5cGVzIG1lcmdpbmdcbiAgICAgICAgb2JqMVtrZXldID0gb2JqMltrZXldXG4gICAgICB9XG4gICAgfVxuICAgIC8vIEB0cy1pZ25vcmUgdHNjIGRvZXNuJ3Qgc2VlbSB0byBwcm9wZXJseSBoYW5kbGUgdHlwZXMgbWVyZ2luZ1xuICAgIHJldHVybiBvYmoxXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGpTdHJpbmdcbiAgICogQHJldHVybnMge2FueXxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2VKU09OKGpTdHJpbmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoalN0cmluZylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nRXJyb3IoZXJyb3IpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIGNhbkFjY2Vzc0xvY2FsU3RvcmFnZSgpIHtcbiAgICBjb25zdCB0ZXN0ID0gJ2h0bXg6c2Vzc2lvblN0b3JhZ2VUZXN0J1xuICAgIHRyeSB7XG4gICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHRlc3QsIHRlc3QpXG4gICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKHRlc3QpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gbm9ybWFsaXplUGF0aChwYXRoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocGF0aCwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG4gICAgICBwYXRoID0gdXJsLnBhdGhuYW1lICsgdXJsLnNlYXJjaFxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIGZhbGxiYWNrIGZvciBtYWxmb3JtZWQgVVJMc1xuICAgIH1cbiAgICAvLyByZW1vdmUgdHJhaWxpbmcgc2xhc2gsIHVubGVzcyBpbmRleCBwYWdlXG4gICAgaWYgKHBhdGggIT0gJy8nKSB7XG4gICAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8rJC8sICcnKVxuICAgIH1cbiAgICByZXR1cm4gcGF0aFxuICB9XG5cbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIHB1YmxpYyBBUElcbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICogQHJldHVybnMge2FueX1cbiAgICovXG4gIGZ1bmN0aW9uIGludGVybmFsRXZhbChzdHIpIHtcbiAgICByZXR1cm4gbWF5YmVFdmFsKGdldERvY3VtZW50KCkuYm9keSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXZhbChzdHIpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY2FsbGJhY2sgZm9yIHRoZSAqKmh0bXg6bG9hZCoqIGV2ZW50LiBUaGlzIGNhbiBiZSB1c2VkIHRvIHByb2Nlc3MgbmV3IGNvbnRlbnQsIGZvciBleGFtcGxlIGluaXRpYWxpemluZyB0aGUgY29udGVudCB3aXRoIGEgamF2YXNjcmlwdCBsaWJyYXJ5XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI29uTG9hZFxuICAgKlxuICAgKiBAcGFyYW0geyhlbHQ6IE5vZGUpID0+IHZvaWR9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayB0byBjYWxsIG9uIG5ld2x5IGxvYWRlZCBjb250ZW50XG4gICAqIEByZXR1cm5zIHtFdmVudExpc3RlbmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gb25Mb2FkSGVscGVyKGNhbGxiYWNrKSB7XG4gICAgY29uc3QgdmFsdWUgPSBodG14Lm9uKCdodG14OmxvYWQnLCAvKiogQHBhcmFtIHtDdXN0b21FdmVudH0gZXZ0ICovIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgY2FsbGJhY2soZXZ0LmRldGFpbC5lbHQpXG4gICAgfSlcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2cgYWxsIGh0bXggZXZlbnRzLCB1c2VmdWwgZm9yIGRlYnVnZ2luZy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jbG9nQWxsXG4gICAqL1xuICBmdW5jdGlvbiBsb2dBbGwoKSB7XG4gICAgaHRteC5sb2dnZXIgPSBmdW5jdGlvbihlbHQsIGV2ZW50LCBkYXRhKSB7XG4gICAgICBpZiAoY29uc29sZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCwgZWx0LCBkYXRhKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGxvZ05vbmUoKSB7XG4gICAgaHRteC5sb2dnZXIgPSBudWxsXG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW4gZWxlbWVudCBtYXRjaGluZyB0aGUgc2VsZWN0b3JcbiAgICpcbiAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jZmluZFxuICAgKlxuICAgKiBAcGFyYW0ge1BhcmVudE5vZGV8c3RyaW5nfSBlbHRPclNlbGVjdG9yICB0aGUgcm9vdCBlbGVtZW50IHRvIGZpbmQgdGhlIG1hdGNoaW5nIGVsZW1lbnQgaW4sIGluY2x1c2l2ZSB8IHRoZSBzZWxlY3RvciB0byBtYXRjaFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3NlbGVjdG9yXSB0aGUgc2VsZWN0b3IgdG8gbWF0Y2hcbiAgICogQHJldHVybnMge0VsZW1lbnR8bnVsbH1cbiAgICovXG4gIGZ1bmN0aW9uIGZpbmQoZWx0T3JTZWxlY3Rvciwgc2VsZWN0b3IpIHtcbiAgICBpZiAodHlwZW9mIGVsdE9yU2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZWx0T3JTZWxlY3Rvci5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmluZChnZXREb2N1bWVudCgpLCBlbHRPclNlbGVjdG9yKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbGwgZWxlbWVudHMgbWF0Y2hpbmcgdGhlIHNlbGVjdG9yXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI2ZpbmRBbGxcbiAgICpcbiAgICogQHBhcmFtIHtQYXJlbnROb2RlfHN0cmluZ30gZWx0T3JTZWxlY3RvciB0aGUgcm9vdCBlbGVtZW50IHRvIGZpbmQgdGhlIG1hdGNoaW5nIGVsZW1lbnRzIGluLCBpbmNsdXNpdmUgfCB0aGUgc2VsZWN0b3IgdG8gbWF0Y2hcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtzZWxlY3Rvcl0gdGhlIHNlbGVjdG9yIHRvIG1hdGNoXG4gICAqIEByZXR1cm5zIHtOb2RlTGlzdE9mPEVsZW1lbnQ+fVxuICAgKi9cbiAgZnVuY3Rpb24gZmluZEFsbChlbHRPclNlbGVjdG9yLCBzZWxlY3Rvcikge1xuICAgIGlmICh0eXBlb2YgZWx0T3JTZWxlY3RvciAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBlbHRPclNlbGVjdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaW5kQWxsKGdldERvY3VtZW50KCksIGVsdE9yU2VsZWN0b3IpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIFdpbmRvd1xuICAgKi9cbiAgZnVuY3Rpb24gZ2V0V2luZG93KCkge1xuICAgIHJldHVybiB3aW5kb3dcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIGVsZW1lbnQgZnJvbSB0aGUgRE9NXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI3JlbW92ZVxuICAgKlxuICAgKiBAcGFyYW0ge05vZGV9IGVsdFxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RlbGF5XVxuICAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudChlbHQsIGRlbGF5KSB7XG4gICAgZWx0ID0gcmVzb2x2ZVRhcmdldChlbHQpXG4gICAgaWYgKGRlbGF5KSB7XG4gICAgICBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZW1vdmVFbGVtZW50KGVsdClcbiAgICAgICAgZWx0ID0gbnVsbFxuICAgICAgfSwgZGVsYXkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsdChlbHQpLnJlbW92ZUNoaWxkKGVsdClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IGVsdFxuICAgKiBAcmV0dXJuIHtFbGVtZW50fG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiBhc0VsZW1lbnQoZWx0KSB7XG4gICAgcmV0dXJuIGVsdCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbHQgOiBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IGVsdFxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudHxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gYXNIdG1sRWxlbWVudChlbHQpIHtcbiAgICByZXR1cm4gZWx0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyBlbHQgOiBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ3xudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gYXNTdHJpbmcodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IGVsdFxuICAgKiBAcmV0dXJuIHtQYXJlbnROb2RlfG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiBhc1BhcmVudE5vZGUoZWx0KSB7XG4gICAgcmV0dXJuIGVsdCBpbnN0YW5jZW9mIEVsZW1lbnQgfHwgZWx0IGluc3RhbmNlb2YgRG9jdW1lbnQgfHwgZWx0IGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCA/IGVsdCA6IG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBhZGRzIGEgY2xhc3MgdG8gdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI2FkZENsYXNzXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxzdHJpbmd9IGVsdCB0aGUgZWxlbWVudCB0byBhZGQgdGhlIGNsYXNzIHRvXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGF6eiB0aGUgY2xhc3MgdG8gYWRkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZGVsYXldIHRoZSBkZWxheSAoaW4gbWlsbGlzZWNvbmRzKSBiZWZvcmUgY2xhc3MgaXMgYWRkZWRcbiAgICovXG4gIGZ1bmN0aW9uIGFkZENsYXNzVG9FbGVtZW50KGVsdCwgY2xhenosIGRlbGF5KSB7XG4gICAgZWx0ID0gYXNFbGVtZW50KHJlc29sdmVUYXJnZXQoZWx0KSlcbiAgICBpZiAoIWVsdCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChkZWxheSkge1xuICAgICAgZ2V0V2luZG93KCkuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkQ2xhc3NUb0VsZW1lbnQoZWx0LCBjbGF6eilcbiAgICAgICAgZWx0ID0gbnVsbFxuICAgICAgfSwgZGVsYXkpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVsdC5jbGFzc0xpc3QgJiYgZWx0LmNsYXNzTGlzdC5hZGQoY2xhenopXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjbGFzcyBmcm9tIHRoZSBnaXZlbiBlbGVtZW50XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI3JlbW92ZUNsYXNzXG4gICAqXG4gICAqIEBwYXJhbSB7Tm9kZXxzdHJpbmd9IG5vZGUgZWxlbWVudCB0byByZW1vdmUgdGhlIGNsYXNzIGZyb21cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXp6IHRoZSBjbGFzcyB0byByZW1vdmVcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtkZWxheV0gdGhlIGRlbGF5IChpbiBtaWxsaXNlY29uZHMgYmVmb3JlIGNsYXNzIGlzIHJlbW92ZWQpXG4gICAqL1xuICBmdW5jdGlvbiByZW1vdmVDbGFzc0Zyb21FbGVtZW50KG5vZGUsIGNsYXp6LCBkZWxheSkge1xuICAgIGxldCBlbHQgPSBhc0VsZW1lbnQocmVzb2x2ZVRhcmdldChub2RlKSlcbiAgICBpZiAoIWVsdCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChkZWxheSkge1xuICAgICAgZ2V0V2luZG93KCkuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcmVtb3ZlQ2xhc3NGcm9tRWxlbWVudChlbHQsIGNsYXp6KVxuICAgICAgICBlbHQgPSBudWxsXG4gICAgICB9LCBkZWxheSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGVsdC5jbGFzc0xpc3QpIHtcbiAgICAgICAgZWx0LmNsYXNzTGlzdC5yZW1vdmUoY2xhenopXG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBubyBjbGFzc2VzIGxlZnQsIHJlbW92ZSB0aGUgY2xhc3MgYXR0cmlidXRlXG4gICAgICAgIGlmIChlbHQuY2xhc3NMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGVsdC5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBnaXZlbiBjbGFzcyBvbiBhbiBlbGVtZW50XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI3RvZ2dsZUNsYXNzXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxzdHJpbmd9IGVsdCB0aGUgZWxlbWVudCB0byB0b2dnbGUgdGhlIGNsYXNzIG9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGF6eiB0aGUgY2xhc3MgdG8gdG9nZ2xlXG4gICAqL1xuICBmdW5jdGlvbiB0b2dnbGVDbGFzc09uRWxlbWVudChlbHQsIGNsYXp6KSB7XG4gICAgZWx0ID0gcmVzb2x2ZVRhcmdldChlbHQpXG4gICAgZWx0LmNsYXNzTGlzdC50b2dnbGUoY2xhenopXG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIGdpdmVuIGNsYXNzIGZyb20gaXRzIHNpYmxpbmdzLCBzbyB0aGF0IGFtb25nIGl0cyBzaWJsaW5ncywgb25seSB0aGUgZ2l2ZW4gZWxlbWVudCB3aWxsIGhhdmUgdGhlIGNsYXNzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyN0YWtlQ2xhc3NcbiAgICpcbiAgICogQHBhcmFtIHtOb2RlfHN0cmluZ30gZWx0IHRoZSBlbGVtZW50IHRoYXQgd2lsbCB0YWtlIHRoZSBjbGFzc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhenogdGhlIGNsYXNzIHRvIHRha2VcbiAgICovXG4gIGZ1bmN0aW9uIHRha2VDbGFzc0ZvckVsZW1lbnQoZWx0LCBjbGF6eikge1xuICAgIGVsdCA9IHJlc29sdmVUYXJnZXQoZWx0KVxuICAgIGZvckVhY2goZWx0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICByZW1vdmVDbGFzc0Zyb21FbGVtZW50KGNoaWxkLCBjbGF6eilcbiAgICB9KVxuICAgIGFkZENsYXNzVG9FbGVtZW50KGFzRWxlbWVudChlbHQpLCBjbGF6eilcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUgY2xvc2VzdCBtYXRjaGluZyBlbGVtZW50IGluIHRoZSBnaXZlbiBlbGVtZW50cyBwYXJlbnRhZ2UsIGluY2x1c2l2ZSBvZiB0aGUgZWxlbWVudFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyNjbG9zZXN0XG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudHxzdHJpbmd9IGVsdCB0aGUgZWxlbWVudCB0byBmaW5kIHRoZSBzZWxlY3RvciBmcm9tXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciB0aGUgc2VsZWN0b3IgdG8gZmluZFxuICAgKiBAcmV0dXJucyB7RWxlbWVudHxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gY2xvc2VzdChlbHQsIHNlbGVjdG9yKSB7XG4gICAgZWx0ID0gYXNFbGVtZW50KHJlc29sdmVUYXJnZXQoZWx0KSlcbiAgICBpZiAoZWx0KSB7XG4gICAgICByZXR1cm4gZWx0LmNsb3Nlc3Qoc2VsZWN0b3IpXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gc3RhcnRzV2l0aChzdHIsIHByZWZpeCkge1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKDAsIHByZWZpeC5sZW5ndGgpID09PSBwcmVmaXhcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWZmaXhcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBlbmRzV2l0aChzdHIsIHN1ZmZpeCkge1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKHN0ci5sZW5ndGggLSBzdWZmaXgubGVuZ3RoKSA9PT0gc3VmZml4XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBub3JtYWxpemVTZWxlY3RvcihzZWxlY3Rvcikge1xuICAgIGNvbnN0IHRyaW1tZWRTZWxlY3RvciA9IHNlbGVjdG9yLnRyaW0oKVxuICAgIGlmIChzdGFydHNXaXRoKHRyaW1tZWRTZWxlY3RvciwgJzwnKSAmJiBlbmRzV2l0aCh0cmltbWVkU2VsZWN0b3IsICcvPicpKSB7XG4gICAgICByZXR1cm4gdHJpbW1lZFNlbGVjdG9yLnN1YnN0cmluZygxLCB0cmltbWVkU2VsZWN0b3IubGVuZ3RoIC0gMilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRyaW1tZWRTZWxlY3RvclxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV8RWxlbWVudHxEb2N1bWVudHxzdHJpbmd9IGVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtib29sZWFuPX0gZ2xvYmFsXG4gICAqIEByZXR1cm5zIHsoTm9kZXxXaW5kb3cpW119XG4gICAqL1xuICBmdW5jdGlvbiBxdWVyeVNlbGVjdG9yQWxsRXh0KGVsdCwgc2VsZWN0b3IsIGdsb2JhbCkge1xuICAgIGlmIChzZWxlY3Rvci5pbmRleE9mKCdnbG9iYWwgJykgPT09IDApIHtcbiAgICAgIHJldHVybiBxdWVyeVNlbGVjdG9yQWxsRXh0KGVsdCwgc2VsZWN0b3Iuc2xpY2UoNyksIHRydWUpXG4gICAgfVxuXG4gICAgZWx0ID0gcmVzb2x2ZVRhcmdldChlbHQpXG5cbiAgICBjb25zdCBwYXJ0cyA9IFtdXG4gICAge1xuICAgICAgbGV0IGNoZXZyb25zQ291bnQgPSAwXG4gICAgICBsZXQgb2Zmc2V0ID0gMFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Rvci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjaGFyID0gc2VsZWN0b3JbaV1cbiAgICAgICAgaWYgKGNoYXIgPT09ICcsJyAmJiBjaGV2cm9uc0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgcGFydHMucHVzaChzZWxlY3Rvci5zdWJzdHJpbmcob2Zmc2V0LCBpKSlcbiAgICAgICAgICBvZmZzZXQgPSBpICsgMVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYXIgPT09ICc8Jykge1xuICAgICAgICAgIGNoZXZyb25zQ291bnQrK1xuICAgICAgICB9IGVsc2UgaWYgKGNoYXIgPT09ICcvJyAmJiBpIDwgc2VsZWN0b3IubGVuZ3RoIC0gMSAmJiBzZWxlY3RvcltpICsgMV0gPT09ICc+Jykge1xuICAgICAgICAgIGNoZXZyb25zQ291bnQtLVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAob2Zmc2V0IDwgc2VsZWN0b3IubGVuZ3RoKSB7XG4gICAgICAgIHBhcnRzLnB1c2goc2VsZWN0b3Iuc3Vic3RyaW5nKG9mZnNldCkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gW11cbiAgICBjb25zdCB1bnByb2Nlc3NlZFBhcnRzID0gW11cbiAgICB3aGlsZSAocGFydHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc2VsZWN0b3IgPSBub3JtYWxpemVTZWxlY3RvcihwYXJ0cy5zaGlmdCgpKVxuICAgICAgbGV0IGl0ZW1cbiAgICAgIGlmIChzZWxlY3Rvci5pbmRleE9mKCdjbG9zZXN0ICcpID09PSAwKSB7XG4gICAgICAgIGl0ZW0gPSBjbG9zZXN0KGFzRWxlbWVudChlbHQpLCBub3JtYWxpemVTZWxlY3RvcihzZWxlY3Rvci5zbGljZSg4KSkpXG4gICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yLmluZGV4T2YoJ2ZpbmQgJykgPT09IDApIHtcbiAgICAgICAgaXRlbSA9IGZpbmQoYXNQYXJlbnROb2RlKGVsdCksIG5vcm1hbGl6ZVNlbGVjdG9yKHNlbGVjdG9yLnNsaWNlKDUpKSlcbiAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3IgPT09ICduZXh0JyB8fCBzZWxlY3RvciA9PT0gJ25leHRFbGVtZW50U2libGluZycpIHtcbiAgICAgICAgaXRlbSA9IGFzRWxlbWVudChlbHQpLm5leHRFbGVtZW50U2libGluZ1xuICAgICAgfSBlbHNlIGlmIChzZWxlY3Rvci5pbmRleE9mKCduZXh0ICcpID09PSAwKSB7XG4gICAgICAgIGl0ZW0gPSBzY2FuRm9yd2FyZFF1ZXJ5KGVsdCwgbm9ybWFsaXplU2VsZWN0b3Ioc2VsZWN0b3Iuc2xpY2UoNSkpLCAhIWdsb2JhbClcbiAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3IgPT09ICdwcmV2aW91cycgfHwgc2VsZWN0b3IgPT09ICdwcmV2aW91c0VsZW1lbnRTaWJsaW5nJykge1xuICAgICAgICBpdGVtID0gYXNFbGVtZW50KGVsdCkucHJldmlvdXNFbGVtZW50U2libGluZ1xuICAgICAgfSBlbHNlIGlmIChzZWxlY3Rvci5pbmRleE9mKCdwcmV2aW91cyAnKSA9PT0gMCkge1xuICAgICAgICBpdGVtID0gc2NhbkJhY2t3YXJkc1F1ZXJ5KGVsdCwgbm9ybWFsaXplU2VsZWN0b3Ioc2VsZWN0b3Iuc2xpY2UoOSkpLCAhIWdsb2JhbClcbiAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3IgPT09ICdkb2N1bWVudCcpIHtcbiAgICAgICAgaXRlbSA9IGRvY3VtZW50XG4gICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yID09PSAnd2luZG93Jykge1xuICAgICAgICBpdGVtID0gd2luZG93XG4gICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yID09PSAnYm9keScpIHtcbiAgICAgICAgaXRlbSA9IGRvY3VtZW50LmJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3IgPT09ICdyb290Jykge1xuICAgICAgICBpdGVtID0gZ2V0Um9vdE5vZGUoZWx0LCAhIWdsb2JhbClcbiAgICAgIH0gZWxzZSBpZiAoc2VsZWN0b3IgPT09ICdob3N0Jykge1xuICAgICAgICBpdGVtID0gKC8qKiBAdHlwZSBTaGFkb3dSb290ICovKGVsdC5nZXRSb290Tm9kZSgpKSkuaG9zdFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdW5wcm9jZXNzZWRQYXJ0cy5wdXNoKHNlbGVjdG9yKVxuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbSkge1xuICAgICAgICByZXN1bHQucHVzaChpdGVtKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1bnByb2Nlc3NlZFBhcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHN0YW5kYXJkU2VsZWN0b3IgPSB1bnByb2Nlc3NlZFBhcnRzLmpvaW4oJywnKVxuICAgICAgY29uc3Qgcm9vdE5vZGUgPSBhc1BhcmVudE5vZGUoZ2V0Um9vdE5vZGUoZWx0LCAhIWdsb2JhbCkpXG4gICAgICByZXN1bHQucHVzaCguLi50b0FycmF5KHJvb3ROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc3RhbmRhcmRTZWxlY3RvcikpKVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IHN0YXJ0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXRjaFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGdsb2JhbFxuICAgKiBAcmV0dXJucyB7RWxlbWVudH1cbiAgICovXG4gIHZhciBzY2FuRm9yd2FyZFF1ZXJ5ID0gZnVuY3Rpb24oc3RhcnQsIG1hdGNoLCBnbG9iYWwpIHtcbiAgICBjb25zdCByZXN1bHRzID0gYXNQYXJlbnROb2RlKGdldFJvb3ROb2RlKHN0YXJ0LCBnbG9iYWwpKS5xdWVyeVNlbGVjdG9yQWxsKG1hdGNoKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZWx0ID0gcmVzdWx0c1tpXVxuICAgICAgaWYgKGVsdC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihzdGFydCkgPT09IE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fUFJFQ0VESU5HKSB7XG4gICAgICAgIHJldHVybiBlbHRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBzdGFydFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2hcbiAgICogQHBhcmFtIHtib29sZWFufSBnbG9iYWxcbiAgICogQHJldHVybnMge0VsZW1lbnR9XG4gICAqL1xuICB2YXIgc2NhbkJhY2t3YXJkc1F1ZXJ5ID0gZnVuY3Rpb24oc3RhcnQsIG1hdGNoLCBnbG9iYWwpIHtcbiAgICBjb25zdCByZXN1bHRzID0gYXNQYXJlbnROb2RlKGdldFJvb3ROb2RlKHN0YXJ0LCBnbG9iYWwpKS5xdWVyeVNlbGVjdG9yQWxsKG1hdGNoKVxuICAgIGZvciAobGV0IGkgPSByZXN1bHRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBlbHQgPSByZXN1bHRzW2ldXG4gICAgICBpZiAoZWx0LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHN0YXJ0KSA9PT0gTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9GT0xMT1dJTkcpIHtcbiAgICAgICAgcmV0dXJuIGVsdFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV8c3RyaW5nfSBlbHRPclNlbGVjdG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc2VsZWN0b3JcbiAgICogQHJldHVybnMge05vZGV8V2luZG93fVxuICAgKi9cbiAgZnVuY3Rpb24gcXVlcnlTZWxlY3RvckV4dChlbHRPclNlbGVjdG9yLCBzZWxlY3Rvcikge1xuICAgIGlmICh0eXBlb2YgZWx0T3JTZWxlY3RvciAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBxdWVyeVNlbGVjdG9yQWxsRXh0KGVsdE9yU2VsZWN0b3IsIHNlbGVjdG9yKVswXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcXVlcnlTZWxlY3RvckFsbEV4dChnZXREb2N1bWVudCgpLmJvZHksIGVsdE9yU2VsZWN0b3IpWzBdXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEB0ZW1wbGF0ZSB7RXZlbnRUYXJnZXR9IFRcbiAgICogQHBhcmFtIHtUfHN0cmluZ30gZWx0T3JTZWxlY3RvclxuICAgKiBAcGFyYW0ge1R9IFtjb250ZXh0XVxuICAgKiBAcmV0dXJucyB7RWxlbWVudHxUfG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiByZXNvbHZlVGFyZ2V0KGVsdE9yU2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAodHlwZW9mIGVsdE9yU2VsZWN0b3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZmluZChhc1BhcmVudE5vZGUoY29udGV4dCkgfHwgZG9jdW1lbnQsIGVsdE9yU2VsZWN0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbHRPclNlbGVjdG9yXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtrZXlvZiBIVE1MRWxlbWVudEV2ZW50TWFwfHN0cmluZ30gQW55RXZlbnROYW1lXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBFdmVudEFyZ3NcbiAgICogQHByb3BlcnR5IHtFdmVudFRhcmdldH0gdGFyZ2V0XG4gICAqIEBwcm9wZXJ0eSB7QW55RXZlbnROYW1lfSBldmVudFxuICAgKiBAcHJvcGVydHkge0V2ZW50TGlzdGVuZXJ9IGxpc3RlbmVyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fGJvb2xlYW59IG9wdGlvbnNcbiAgICovXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8QW55RXZlbnROYW1lfSBhcmcxXG4gICAqIEBwYXJhbSB7QW55RXZlbnROYW1lfEV2ZW50TGlzdGVuZXJ9IGFyZzJcbiAgICogQHBhcmFtIHtFdmVudExpc3RlbmVyfE9iamVjdHxib29sZWFufSBbYXJnM11cbiAgICogQHBhcmFtIHtPYmplY3R8Ym9vbGVhbn0gW2FyZzRdXG4gICAqIEByZXR1cm5zIHtFdmVudEFyZ3N9XG4gICAqL1xuICBmdW5jdGlvbiBwcm9jZXNzRXZlbnRBcmdzKGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihhcmcyKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiBnZXREb2N1bWVudCgpLmJvZHksXG4gICAgICAgIGV2ZW50OiBhc1N0cmluZyhhcmcxKSxcbiAgICAgICAgbGlzdGVuZXI6IGFyZzIsXG4gICAgICAgIG9wdGlvbnM6IGFyZzNcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiByZXNvbHZlVGFyZ2V0KGFyZzEpLFxuICAgICAgICBldmVudDogYXNTdHJpbmcoYXJnMiksXG4gICAgICAgIGxpc3RlbmVyOiBhcmczLFxuICAgICAgICBvcHRpb25zOiBhcmc0XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gYW4gZWxlbWVudFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyNvblxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fHN0cmluZ30gYXJnMSB0aGUgZWxlbWVudCB0byBhZGQgdGhlIGxpc3RlbmVyIHRvIHwgdGhlIGV2ZW50IG5hbWUgdG8gYWRkIHRoZSBsaXN0ZW5lciBmb3JcbiAgICogQHBhcmFtIHtzdHJpbmd8RXZlbnRMaXN0ZW5lcn0gYXJnMiB0aGUgZXZlbnQgbmFtZSB0byBhZGQgdGhlIGxpc3RlbmVyIGZvciB8IHRoZSBsaXN0ZW5lciB0byBhZGRcbiAgICogQHBhcmFtIHtFdmVudExpc3RlbmVyfE9iamVjdHxib29sZWFufSBbYXJnM10gdGhlIGxpc3RlbmVyIHRvIGFkZCB8IG9wdGlvbnMgdG8gYWRkXG4gICAqIEBwYXJhbSB7T2JqZWN0fGJvb2xlYW59IFthcmc0XSBvcHRpb25zIHRvIGFkZFxuICAgKiBAcmV0dXJucyB7RXZlbnRMaXN0ZW5lcn1cbiAgICovXG4gIGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJJbXBsKGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpIHtcbiAgICByZWFkeShmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGV2ZW50QXJncyA9IHByb2Nlc3NFdmVudEFyZ3MoYXJnMSwgYXJnMiwgYXJnMywgYXJnNClcbiAgICAgIGV2ZW50QXJncy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudEFyZ3MuZXZlbnQsIGV2ZW50QXJncy5saXN0ZW5lciwgZXZlbnRBcmdzLm9wdGlvbnMpXG4gICAgfSlcbiAgICBjb25zdCBiID0gaXNGdW5jdGlvbihhcmcyKVxuICAgIHJldHVybiBiID8gYXJnMiA6IGFyZzNcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuIGV2ZW50IGxpc3RlbmVyIGZyb20gYW4gZWxlbWVudFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vaHRteC5vcmcvYXBpLyNvZmZcbiAgICpcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldHxzdHJpbmd9IGFyZzEgdGhlIGVsZW1lbnQgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tIHwgdGhlIGV2ZW50IG5hbWUgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tXG4gICAqIEBwYXJhbSB7c3RyaW5nfEV2ZW50TGlzdGVuZXJ9IGFyZzIgdGhlIGV2ZW50IG5hbWUgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tIHwgdGhlIGxpc3RlbmVyIHRvIHJlbW92ZVxuICAgKiBAcGFyYW0ge0V2ZW50TGlzdGVuZXJ9IFthcmczXSB0aGUgbGlzdGVuZXIgdG8gcmVtb3ZlXG4gICAqIEByZXR1cm5zIHtFdmVudExpc3RlbmVyfVxuICAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lckltcGwoYXJnMSwgYXJnMiwgYXJnMykge1xuICAgIHJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZXZlbnRBcmdzID0gcHJvY2Vzc0V2ZW50QXJncyhhcmcxLCBhcmcyLCBhcmczKVxuICAgICAgZXZlbnRBcmdzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50QXJncy5ldmVudCwgZXZlbnRBcmdzLmxpc3RlbmVyKVxuICAgIH0pXG4gICAgcmV0dXJuIGlzRnVuY3Rpb24oYXJnMikgPyBhcmcyIDogYXJnM1xuICB9XG5cbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTm9kZSBwcm9jZXNzaW5nXG4gIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgY29uc3QgRFVNTVlfRUxUID0gZ2V0RG9jdW1lbnQoKS5jcmVhdGVFbGVtZW50KCdvdXRwdXQnKSAvLyBkdW1teSBlbGVtZW50IGZvciBiYWQgc2VsZWN0b3JzXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0ck5hbWVcbiAgICogQHJldHVybnMgeyhOb2RlfFdpbmRvdylbXX1cbiAgICovXG4gIGZ1bmN0aW9uIGZpbmRBdHRyaWJ1dGVUYXJnZXRzKGVsdCwgYXR0ck5hbWUpIHtcbiAgICBjb25zdCBhdHRyVGFyZ2V0ID0gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgYXR0ck5hbWUpXG4gICAgaWYgKGF0dHJUYXJnZXQpIHtcbiAgICAgIGlmIChhdHRyVGFyZ2V0ID09PSAndGhpcycpIHtcbiAgICAgICAgcmV0dXJuIFtmaW5kVGhpc0VsZW1lbnQoZWx0LCBhdHRyTmFtZSldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBxdWVyeVNlbGVjdG9yQWxsRXh0KGVsdCwgYXR0clRhcmdldClcbiAgICAgICAgLy8gZmluZCBgaW5oZXJpdGAgd2hvbGUgd29yZCBpbiB2YWx1ZSwgbWFrZSBzdXJlIGl0J3Mgc3Vycm91bmRlZCBieSBjb21tYXMgb3IgaXMgYXQgdGhlIHN0YXJ0L2VuZCBvZiBzdHJpbmdcbiAgICAgICAgY29uc3Qgc2hvdWxkSW5oZXJpdCA9IC8oXnwsKShcXHMqKWluaGVyaXQoXFxzKikoJHwsKS8udGVzdChhdHRyVGFyZ2V0KVxuICAgICAgICBpZiAoc2hvdWxkSW5oZXJpdCkge1xuICAgICAgICAgIGNvbnN0IGVsdFRvSW5oZXJpdEZyb20gPSBhc0VsZW1lbnQoZ2V0Q2xvc2VzdE1hdGNoKGVsdCwgZnVuY3Rpb24ocGFyZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50ICE9PSBlbHQgJiYgaGFzQXR0cmlidXRlKGFzRWxlbWVudChwYXJlbnQpLCBhdHRyTmFtZSlcbiAgICAgICAgICB9KSlcbiAgICAgICAgICBpZiAoZWx0VG9Jbmhlcml0RnJvbSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goLi4uZmluZEF0dHJpYnV0ZVRhcmdldHMoZWx0VG9Jbmhlcml0RnJvbSwgYXR0ck5hbWUpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGxvZ0Vycm9yKCdUaGUgc2VsZWN0b3IgXCInICsgYXR0clRhcmdldCArICdcIiBvbiAnICsgYXR0ck5hbWUgKyAnIHJldHVybmVkIG5vIG1hdGNoZXMhJylcbiAgICAgICAgICByZXR1cm4gW0RVTU1ZX0VMVF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZVxuICAgKiBAcmV0dXJucyB7RWxlbWVudHxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gZmluZFRoaXNFbGVtZW50KGVsdCwgYXR0cmlidXRlKSB7XG4gICAgcmV0dXJuIGFzRWxlbWVudChnZXRDbG9zZXN0TWF0Y2goZWx0LCBmdW5jdGlvbihlbHQpIHtcbiAgICAgIHJldHVybiBnZXRBdHRyaWJ1dGVWYWx1ZShhc0VsZW1lbnQoZWx0KSwgYXR0cmlidXRlKSAhPSBudWxsXG4gICAgfSkpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHJldHVybnMge05vZGV8V2luZG93fG51bGx9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRUYXJnZXQoZWx0KSB7XG4gICAgY29uc3QgdGFyZ2V0U3RyID0gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXRhcmdldCcpXG4gICAgaWYgKHRhcmdldFN0cikge1xuICAgICAgaWYgKHRhcmdldFN0ciA9PT0gJ3RoaXMnKSB7XG4gICAgICAgIHJldHVybiBmaW5kVGhpc0VsZW1lbnQoZWx0LCAnaHgtdGFyZ2V0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBxdWVyeVNlbGVjdG9yRXh0KGVsdCwgdGFyZ2V0U3RyKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGVsdClcbiAgICAgIGlmIChkYXRhLmJvb3N0ZWQpIHtcbiAgICAgICAgcmV0dXJuIGdldERvY3VtZW50KCkuYm9keVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVsdFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIHNob3VsZFNldHRsZUF0dHJpYnV0ZShuYW1lKSB7XG4gICAgcmV0dXJuIGh0bXguY29uZmlnLmF0dHJpYnV0ZXNUb1NldHRsZS5pbmNsdWRlcyhuYW1lKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gbWVyZ2VUb1xuICAgKiBAcGFyYW0ge0VsZW1lbnR9IG1lcmdlRnJvbVxuICAgKi9cbiAgZnVuY3Rpb24gY2xvbmVBdHRyaWJ1dGVzKG1lcmdlVG8sIG1lcmdlRnJvbSkge1xuICAgIGZvckVhY2goQXJyYXkuZnJvbShtZXJnZVRvLmF0dHJpYnV0ZXMpLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICBpZiAoIW1lcmdlRnJvbS5oYXNBdHRyaWJ1dGUoYXR0ci5uYW1lKSAmJiBzaG91bGRTZXR0bGVBdHRyaWJ1dGUoYXR0ci5uYW1lKSkge1xuICAgICAgICBtZXJnZVRvLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpXG4gICAgICB9XG4gICAgfSlcbiAgICBmb3JFYWNoKG1lcmdlRnJvbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICBpZiAoc2hvdWxkU2V0dGxlQXR0cmlidXRlKGF0dHIubmFtZSkpIHtcbiAgICAgICAgbWVyZ2VUby5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtIdG14U3dhcFN0eWxlfSBzd2FwU3R5bGVcbiAgICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBpc0lubGluZVN3YXAoc3dhcFN0eWxlLCB0YXJnZXQpIHtcbiAgICBjb25zdCBleHRlbnNpb25zID0gZ2V0RXh0ZW5zaW9ucyh0YXJnZXQpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleHRlbnNpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBleHRlbnNpb24gPSBleHRlbnNpb25zW2ldXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZXh0ZW5zaW9uLmlzSW5saW5lU3dhcChzd2FwU3R5bGUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dFcnJvcihlKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3dhcFN0eWxlID09PSAnb3V0ZXJIVE1MJ1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvb2JWYWx1ZVxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IG9vYkVsZW1lbnRcbiAgICogQHBhcmFtIHtIdG14U2V0dGxlSW5mb30gc2V0dGxlSW5mb1xuICAgKiBAcGFyYW0ge05vZGV8RG9jdW1lbnR9IFtyb290Tm9kZV1cbiAgICogQHJldHVybnNcbiAgICovXG4gIGZ1bmN0aW9uIG9vYlN3YXAob29iVmFsdWUsIG9vYkVsZW1lbnQsIHNldHRsZUluZm8sIHJvb3ROb2RlKSB7XG4gICAgcm9vdE5vZGUgPSByb290Tm9kZSB8fCBnZXREb2N1bWVudCgpXG4gICAgbGV0IHNlbGVjdG9yID0gJyMnICsgQ1NTLmVzY2FwZShnZXRSYXdBdHRyaWJ1dGUob29iRWxlbWVudCwgJ2lkJykpXG4gICAgLyoqIEB0eXBlIEh0bXhTd2FwU3R5bGUgKi9cbiAgICBsZXQgc3dhcFN0eWxlID0gJ291dGVySFRNTCdcbiAgICBpZiAob29iVmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgLy8gZG8gbm90aGluZ1xuICAgIH0gZWxzZSBpZiAob29iVmFsdWUuaW5kZXhPZignOicpID4gMCkge1xuICAgICAgc3dhcFN0eWxlID0gb29iVmFsdWUuc3Vic3RyaW5nKDAsIG9vYlZhbHVlLmluZGV4T2YoJzonKSlcbiAgICAgIHNlbGVjdG9yID0gb29iVmFsdWUuc3Vic3RyaW5nKG9vYlZhbHVlLmluZGV4T2YoJzonKSArIDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIHN3YXBTdHlsZSA9IG9vYlZhbHVlXG4gICAgfVxuICAgIG9vYkVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdoeC1zd2FwLW9vYicpXG4gICAgb29iRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaHgtc3dhcC1vb2InKVxuXG4gICAgY29uc3QgdGFyZ2V0cyA9IHF1ZXJ5U2VsZWN0b3JBbGxFeHQocm9vdE5vZGUsIHNlbGVjdG9yLCBmYWxzZSlcbiAgICBpZiAodGFyZ2V0cy5sZW5ndGgpIHtcbiAgICAgIGZvckVhY2goXG4gICAgICAgIHRhcmdldHMsXG4gICAgICAgIGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgICAgIGxldCBmcmFnbWVudFxuICAgICAgICAgIGNvbnN0IG9vYkVsZW1lbnRDbG9uZSA9IG9vYkVsZW1lbnQuY2xvbmVOb2RlKHRydWUpXG4gICAgICAgICAgZnJhZ21lbnQgPSBnZXREb2N1bWVudCgpLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKG9vYkVsZW1lbnRDbG9uZSlcbiAgICAgICAgICBpZiAoIWlzSW5saW5lU3dhcChzd2FwU3R5bGUsIHRhcmdldCkpIHtcbiAgICAgICAgICAgIGZyYWdtZW50ID0gYXNQYXJlbnROb2RlKG9vYkVsZW1lbnRDbG9uZSkgLy8gaWYgdGhpcyBpcyBub3QgYW4gaW5saW5lIHN3YXAsIHdlIHVzZSB0aGUgY29udGVudCBvZiB0aGUgbm9kZSwgbm90IHRoZSBub2RlIGl0c2VsZlxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGJlZm9yZVN3YXBEZXRhaWxzID0geyBzaG91bGRTd2FwOiB0cnVlLCB0YXJnZXQsIGZyYWdtZW50IH1cbiAgICAgICAgICBpZiAoIXRyaWdnZXJFdmVudCh0YXJnZXQsICdodG14Om9vYkJlZm9yZVN3YXAnLCBiZWZvcmVTd2FwRGV0YWlscykpIHJldHVyblxuXG4gICAgICAgICAgdGFyZ2V0ID0gYmVmb3JlU3dhcERldGFpbHMudGFyZ2V0IC8vIGFsbG93IHJlLXRhcmdldGluZ1xuICAgICAgICAgIGlmIChiZWZvcmVTd2FwRGV0YWlscy5zaG91bGRTd2FwKSB7XG4gICAgICAgICAgICBoYW5kbGVQcmVzZXJ2ZWRFbGVtZW50cyhmcmFnbWVudClcbiAgICAgICAgICAgIHN3YXBXaXRoU3R5bGUoc3dhcFN0eWxlLCB0YXJnZXQsIHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gICAgICAgICAgICByZXN0b3JlUHJlc2VydmVkRWxlbWVudHMoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3JFYWNoKHNldHRsZUluZm8uZWx0cywgZnVuY3Rpb24oZWx0KSB7XG4gICAgICAgICAgICB0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDpvb2JBZnRlclN3YXAnLCBiZWZvcmVTd2FwRGV0YWlscylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICApXG4gICAgICBvb2JFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob29iRWxlbWVudClcbiAgICB9IGVsc2Uge1xuICAgICAgb29iRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9vYkVsZW1lbnQpXG4gICAgICB0cmlnZ2VyRXJyb3JFdmVudChnZXREb2N1bWVudCgpLmJvZHksICdodG14Om9vYkVycm9yTm9UYXJnZXQnLCB7IGNvbnRlbnQ6IG9vYkVsZW1lbnQsIHRhcmdldDogc2VsZWN0b3IgfSlcbiAgICB9XG4gICAgcmV0dXJuIG9vYlZhbHVlXG4gIH1cblxuICBmdW5jdGlvbiByZXN0b3JlUHJlc2VydmVkRWxlbWVudHMoKSB7XG4gICAgY29uc3QgcGFudHJ5ID0gZmluZCgnIy0taHRteC1wcmVzZXJ2ZS1wYW50cnktLScpXG4gICAgaWYgKHBhbnRyeSkge1xuICAgICAgZm9yIChjb25zdCBwcmVzZXJ2ZWRFbHQgb2YgWy4uLnBhbnRyeS5jaGlsZHJlbl0pIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdFbGVtZW50ID0gZmluZCgnIycgKyBwcmVzZXJ2ZWRFbHQuaWQpXG4gICAgICAgIC8vIEB0cy1pZ25vcmUgLSB1c2UgcHJvcG9zZWQgbW92ZUJlZm9yZSBmZWF0dXJlXG4gICAgICAgIGV4aXN0aW5nRWxlbWVudC5wYXJlbnROb2RlLm1vdmVCZWZvcmUocHJlc2VydmVkRWx0LCBleGlzdGluZ0VsZW1lbnQpXG4gICAgICAgIGV4aXN0aW5nRWxlbWVudC5yZW1vdmUoKVxuICAgICAgfVxuICAgICAgcGFudHJ5LnJlbW92ZSgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudHxQYXJlbnROb2RlfSBmcmFnbWVudFxuICAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlUHJlc2VydmVkRWxlbWVudHMoZnJhZ21lbnQpIHtcbiAgICBmb3JFYWNoKGZpbmRBbGwoZnJhZ21lbnQsICdbaHgtcHJlc2VydmVdLCBbZGF0YS1oeC1wcmVzZXJ2ZV0nKSwgZnVuY3Rpb24ocHJlc2VydmVkRWx0KSB7XG4gICAgICBjb25zdCBpZCA9IGdldEF0dHJpYnV0ZVZhbHVlKHByZXNlcnZlZEVsdCwgJ2lkJylcbiAgICAgIGNvbnN0IGV4aXN0aW5nRWxlbWVudCA9IGdldERvY3VtZW50KCkuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gICAgICBpZiAoZXhpc3RpbmdFbGVtZW50ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKHByZXNlcnZlZEVsdC5tb3ZlQmVmb3JlKSB7IC8vIGlmIHRoZSBtb3ZlQmVmb3JlIEFQSSBleGlzdHMsIHVzZSBpdFxuICAgICAgICAgIC8vIGdldCBvciBjcmVhdGUgYSBzdG9yYWdlIHNwb3QgZm9yIHN0dWZmXG4gICAgICAgICAgbGV0IHBhbnRyeSA9IGZpbmQoJyMtLWh0bXgtcHJlc2VydmUtcGFudHJ5LS0nKVxuICAgICAgICAgIGlmIChwYW50cnkgPT0gbnVsbCkge1xuICAgICAgICAgICAgZ2V0RG9jdW1lbnQoKS5ib2R5Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJlbmQnLCBcIjxkaXYgaWQ9Jy0taHRteC1wcmVzZXJ2ZS1wYW50cnktLSc+PC9kaXY+XCIpXG4gICAgICAgICAgICBwYW50cnkgPSBmaW5kKCcjLS1odG14LXByZXNlcnZlLXBhbnRyeS0tJylcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZSAtIHVzZSBwcm9wb3NlZCBtb3ZlQmVmb3JlIGZlYXR1cmVcbiAgICAgICAgICBwYW50cnkubW92ZUJlZm9yZShleGlzdGluZ0VsZW1lbnQsIG51bGwpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJlc2VydmVkRWx0LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGV4aXN0aW5nRWxlbWVudCwgcHJlc2VydmVkRWx0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IHBhcmVudE5vZGVcbiAgICogQHBhcmFtIHtQYXJlbnROb2RlfSBmcmFnbWVudFxuICAgKiBAcGFyYW0ge0h0bXhTZXR0bGVJbmZvfSBzZXR0bGVJbmZvXG4gICAqL1xuICBmdW5jdGlvbiBoYW5kbGVBdHRyaWJ1dGVzKHBhcmVudE5vZGUsIGZyYWdtZW50LCBzZXR0bGVJbmZvKSB7XG4gICAgZm9yRWFjaChmcmFnbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbaWRdJyksIGZ1bmN0aW9uKG5ld05vZGUpIHtcbiAgICAgIGNvbnN0IGlkID0gZ2V0UmF3QXR0cmlidXRlKG5ld05vZGUsICdpZCcpXG4gICAgICBpZiAoaWQgJiYgaWQubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBwYXJlbnRFbHQgPSBhc1BhcmVudE5vZGUocGFyZW50Tm9kZSlcbiAgICAgICAgY29uc3Qgb2xkTm9kZSA9IHBhcmVudEVsdCAmJiBwYXJlbnRFbHQucXVlcnlTZWxlY3RvcihDU1MuZXNjYXBlKG5ld05vZGUudGFnTmFtZSkgKyAnIycgKyBDU1MuZXNjYXBlKGlkKSlcbiAgICAgICAgaWYgKG9sZE5vZGUgJiYgb2xkTm9kZSAhPT0gcGFyZW50RWx0KSB7XG4gICAgICAgICAgY29uc3QgbmV3QXR0cmlidXRlcyA9IG5ld05vZGUuY2xvbmVOb2RlKClcbiAgICAgICAgICBjbG9uZUF0dHJpYnV0ZXMobmV3Tm9kZSwgb2xkTm9kZSlcbiAgICAgICAgICBzZXR0bGVJbmZvLnRhc2tzLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjbG9uZUF0dHJpYnV0ZXMobmV3Tm9kZSwgbmV3QXR0cmlidXRlcylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IGNoaWxkXG4gICAqIEByZXR1cm5zIHtIdG14U2V0dGxlVGFza31cbiAgICovXG4gIGZ1bmN0aW9uIG1ha2VBamF4TG9hZFRhc2soY2hpbGQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZW1vdmVDbGFzc0Zyb21FbGVtZW50KGNoaWxkLCBodG14LmNvbmZpZy5hZGRlZENsYXNzKVxuICAgICAgcHJvY2Vzc05vZGUoYXNFbGVtZW50KGNoaWxkKSlcbiAgICAgIHByb2Nlc3NGb2N1cyhhc1BhcmVudE5vZGUoY2hpbGQpKVxuICAgICAgdHJpZ2dlckV2ZW50KGNoaWxkLCAnaHRteDpsb2FkJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtQYXJlbnROb2RlfSBjaGlsZFxuICAgKi9cbiAgZnVuY3Rpb24gcHJvY2Vzc0ZvY3VzKGNoaWxkKSB7XG4gICAgY29uc3QgYXV0b2ZvY3VzID0gJ1thdXRvZm9jdXNdJ1xuICAgIGNvbnN0IGF1dG9Gb2N1c2VkRWx0ID0gYXNIdG1sRWxlbWVudChtYXRjaGVzKGNoaWxkLCBhdXRvZm9jdXMpID8gY2hpbGQgOiBjaGlsZC5xdWVyeVNlbGVjdG9yKGF1dG9mb2N1cykpXG4gICAgaWYgKGF1dG9Gb2N1c2VkRWx0ICE9IG51bGwpIHtcbiAgICAgIGF1dG9Gb2N1c2VkRWx0LmZvY3VzKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBwYXJlbnROb2RlXG4gICAqIEBwYXJhbSB7Tm9kZX0gaW5zZXJ0QmVmb3JlXG4gICAqIEBwYXJhbSB7UGFyZW50Tm9kZX0gZnJhZ21lbnRcbiAgICogQHBhcmFtIHtIdG14U2V0dGxlSW5mb30gc2V0dGxlSW5mb1xuICAgKi9cbiAgZnVuY3Rpb24gaW5zZXJ0Tm9kZXNCZWZvcmUocGFyZW50Tm9kZSwgaW5zZXJ0QmVmb3JlLCBmcmFnbWVudCwgc2V0dGxlSW5mbykge1xuICAgIGhhbmRsZUF0dHJpYnV0ZXMocGFyZW50Tm9kZSwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gICAgd2hpbGUgKGZyYWdtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY2hpbGQgPSBmcmFnbWVudC5maXJzdENoaWxkXG4gICAgICBhZGRDbGFzc1RvRWxlbWVudChhc0VsZW1lbnQoY2hpbGQpLCBodG14LmNvbmZpZy5hZGRlZENsYXNzKVxuICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2hpbGQsIGluc2VydEJlZm9yZSlcbiAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSAhPT0gTm9kZS5URVhUX05PREUgJiYgY2hpbGQubm9kZVR5cGUgIT09IE5vZGUuQ09NTUVOVF9OT0RFKSB7XG4gICAgICAgIHNldHRsZUluZm8udGFza3MucHVzaChtYWtlQWpheExvYWRUYXNrKGNoaWxkKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogYmFzZWQgb24gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vaHlhbWFtb3RvL2ZkNDM1NTA1ZDI5ZWJmYTNkOTcxNmZkMmJlOGQ0MmYwLFxuICAgKiBkZXJpdmVkIGZyb20gSmF2YSdzIHN0cmluZyBoYXNoY29kZSBpbXBsZW1lbnRhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoYXNoXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBzdHJpbmdIYXNoKHN0cmluZywgaGFzaCkge1xuICAgIGxldCBjaGFyID0gMFxuICAgIHdoaWxlIChjaGFyIDwgc3RyaW5nLmxlbmd0aCkge1xuICAgICAgaGFzaCA9IChoYXNoIDw8IDUpIC0gaGFzaCArIHN0cmluZy5jaGFyQ29kZUF0KGNoYXIrKykgfCAwIC8vIGJpdHdpc2Ugb3IgZW5zdXJlcyB3ZSBoYXZlIGEgMzItYml0IGludFxuICAgIH1cbiAgICByZXR1cm4gaGFzaFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBhdHRyaWJ1dGVIYXNoKGVsdCkge1xuICAgIGxldCBoYXNoID0gMFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWx0LmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGVsdC5hdHRyaWJ1dGVzW2ldXG4gICAgICBpZiAoYXR0cmlidXRlLnZhbHVlKSB7IC8vIG9ubHkgaW5jbHVkZSBhdHRyaWJ1dGVzIHcvIGFjdHVhbCB2YWx1ZXMgKGVtcHR5IGlzIHNhbWUgYXMgbm9uLWV4aXN0ZW50KVxuICAgICAgICBoYXNoID0gc3RyaW5nSGFzaChhdHRyaWJ1dGUubmFtZSwgaGFzaClcbiAgICAgICAgaGFzaCA9IHN0cmluZ0hhc2goYXR0cmlidXRlLnZhbHVlLCBoYXNoKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzaFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IGVsdFxuICAgKi9cbiAgZnVuY3Rpb24gZGVJbml0T25IYW5kbGVycyhlbHQpIHtcbiAgICBjb25zdCBpbnRlcm5hbERhdGEgPSBnZXRJbnRlcm5hbERhdGEoZWx0KVxuICAgIGlmIChpbnRlcm5hbERhdGEub25IYW5kbGVycykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnRlcm5hbERhdGEub25IYW5kbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBoYW5kbGVySW5mbyA9IGludGVybmFsRGF0YS5vbkhhbmRsZXJzW2ldXG4gICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXJJbXBsKGVsdCwgaGFuZGxlckluZm8uZXZlbnQsIGhhbmRsZXJJbmZvLmxpc3RlbmVyKVxuICAgICAgfVxuICAgICAgZGVsZXRlIGludGVybmFsRGF0YS5vbkhhbmRsZXJzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gZWxlbWVudFxuICAgKi9cbiAgZnVuY3Rpb24gZGVJbml0Tm9kZShlbGVtZW50KSB7XG4gICAgY29uc3QgaW50ZXJuYWxEYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGVsZW1lbnQpXG4gICAgaWYgKGludGVybmFsRGF0YS50aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQoaW50ZXJuYWxEYXRhLnRpbWVvdXQpXG4gICAgfVxuICAgIGlmIChpbnRlcm5hbERhdGEubGlzdGVuZXJJbmZvcykge1xuICAgICAgZm9yRWFjaChpbnRlcm5hbERhdGEubGlzdGVuZXJJbmZvcywgZnVuY3Rpb24oaW5mbykge1xuICAgICAgICBpZiAoaW5mby5vbikge1xuICAgICAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXJJbXBsKGluZm8ub24sIGluZm8udHJpZ2dlciwgaW5mby5saXN0ZW5lcilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgZGVJbml0T25IYW5kbGVycyhlbGVtZW50KVxuICAgIGZvckVhY2goT2JqZWN0LmtleXMoaW50ZXJuYWxEYXRhKSwgZnVuY3Rpb24oa2V5KSB7IGlmIChrZXkgIT09ICdmaXJzdEluaXRDb21wbGV0ZWQnKSBkZWxldGUgaW50ZXJuYWxEYXRhW2tleV0gfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge05vZGV9IGVsZW1lbnRcbiAgICovXG4gIGZ1bmN0aW9uIGNsZWFuVXBFbGVtZW50KGVsZW1lbnQpIHtcbiAgICB0cmlnZ2VyRXZlbnQoZWxlbWVudCwgJ2h0bXg6YmVmb3JlQ2xlYW51cEVsZW1lbnQnKVxuICAgIGRlSW5pdE5vZGUoZWxlbWVudClcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZm9yRWFjaChlbGVtZW50LmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCkgeyBjbGVhblVwRWxlbWVudChjaGlsZCkgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICAgKiBAcGFyYW0ge1BhcmVudE5vZGV9IGZyYWdtZW50XG4gICAqIEBwYXJhbSB7SHRteFNldHRsZUluZm99IHNldHRsZUluZm9cbiAgICovXG4gIGZ1bmN0aW9uIHN3YXBPdXRlckhUTUwodGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbykge1xuICAgIGlmICh0YXJnZXQudGFnTmFtZSA9PT0gJ0JPRFknKSB7IC8vIHNwZWNpYWwgY2FzZSB0aGUgYm9keSB0byBpbm5lckhUTUwgYmVjYXVzZSBEb2N1bWVudEZyYWdtZW50cyBjYW4ndCBjb250YWluIGEgYm9keSBlbHQgdW5mb3J0dW5hdGVseVxuICAgICAgcmV0dXJuIHN3YXBJbm5lckhUTUwodGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICB9XG4gICAgLyoqIEB0eXBlIHtOb2RlfSAqL1xuICAgIGxldCBuZXdFbHRcbiAgICBjb25zdCBlbHRCZWZvcmVOZXdDb250ZW50ID0gdGFyZ2V0LnByZXZpb3VzU2libGluZ1xuICAgIGNvbnN0IHBhcmVudE5vZGUgPSBwYXJlbnRFbHQodGFyZ2V0KVxuICAgIGlmICghcGFyZW50Tm9kZSkgeyAvLyB3aGVuIHBhcmVudCBub2RlIGRpc2FwcGVhcnMsIHdlIGNhbid0IGRvIGFueXRoaW5nXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaW5zZXJ0Tm9kZXNCZWZvcmUocGFyZW50Tm9kZSwgdGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICBpZiAoZWx0QmVmb3JlTmV3Q29udGVudCA9PSBudWxsKSB7XG4gICAgICBuZXdFbHQgPSBwYXJlbnROb2RlLmZpcnN0Q2hpbGRcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3RWx0ID0gZWx0QmVmb3JlTmV3Q29udGVudC5uZXh0U2libGluZ1xuICAgIH1cbiAgICBzZXR0bGVJbmZvLmVsdHMgPSBzZXR0bGVJbmZvLmVsdHMuZmlsdGVyKGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUgIT09IHRhcmdldCB9KVxuICAgIC8vIHNjYW4gdGhyb3VnaCBhbGwgbmV3bHkgYWRkZWQgY29udGVudCBhbmQgYWRkIGFsbCBlbGVtZW50cyB0byB0aGUgc2V0dGxlIGluZm8gc28gd2UgdHJpZ2dlclxuICAgIC8vIGV2ZW50cyBwcm9wZXJseSBvbiB0aGVtXG4gICAgd2hpbGUgKG5ld0VsdCAmJiBuZXdFbHQgIT09IHRhcmdldCkge1xuICAgICAgaWYgKG5ld0VsdCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgc2V0dGxlSW5mby5lbHRzLnB1c2gobmV3RWx0KVxuICAgICAgfVxuICAgICAgbmV3RWx0ID0gbmV3RWx0Lm5leHRTaWJsaW5nXG4gICAgfVxuICAgIGNsZWFuVXBFbGVtZW50KHRhcmdldClcbiAgICB0YXJnZXQucmVtb3ZlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICAgKiBAcGFyYW0ge1BhcmVudE5vZGV9IGZyYWdtZW50XG4gICAqIEBwYXJhbSB7SHRteFNldHRsZUluZm99IHNldHRsZUluZm9cbiAgICovXG4gIGZ1bmN0aW9uIHN3YXBBZnRlckJlZ2luKHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pIHtcbiAgICByZXR1cm4gaW5zZXJ0Tm9kZXNCZWZvcmUodGFyZ2V0LCB0YXJnZXQuZmlyc3RDaGlsZCwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAgICogQHBhcmFtIHtQYXJlbnROb2RlfSBmcmFnbWVudFxuICAgKiBAcGFyYW0ge0h0bXhTZXR0bGVJbmZvfSBzZXR0bGVJbmZvXG4gICAqL1xuICBmdW5jdGlvbiBzd2FwQmVmb3JlQmVnaW4odGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbykge1xuICAgIHJldHVybiBpbnNlcnROb2Rlc0JlZm9yZShwYXJlbnRFbHQodGFyZ2V0KSwgdGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICAgKiBAcGFyYW0ge1BhcmVudE5vZGV9IGZyYWdtZW50XG4gICAqIEBwYXJhbSB7SHRteFNldHRsZUluZm99IHNldHRsZUluZm9cbiAgICovXG4gIGZ1bmN0aW9uIHN3YXBCZWZvcmVFbmQodGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbykge1xuICAgIHJldHVybiBpbnNlcnROb2Rlc0JlZm9yZSh0YXJnZXQsIG51bGwsIGZyYWdtZW50LCBzZXR0bGVJbmZvKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7UGFyZW50Tm9kZX0gZnJhZ21lbnRcbiAgICogQHBhcmFtIHtIdG14U2V0dGxlSW5mb30gc2V0dGxlSW5mb1xuICAgKi9cbiAgZnVuY3Rpb24gc3dhcEFmdGVyRW5kKHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pIHtcbiAgICByZXR1cm4gaW5zZXJ0Tm9kZXNCZWZvcmUocGFyZW50RWx0KHRhcmdldCksIHRhcmdldC5uZXh0U2libGluZywgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAgICovXG4gIGZ1bmN0aW9uIHN3YXBEZWxldGUodGFyZ2V0KSB7XG4gICAgY2xlYW5VcEVsZW1lbnQodGFyZ2V0KVxuICAgIGNvbnN0IHBhcmVudCA9IHBhcmVudEVsdCh0YXJnZXQpXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcmV0dXJuIHBhcmVudC5yZW1vdmVDaGlsZCh0YXJnZXQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7UGFyZW50Tm9kZX0gZnJhZ21lbnRcbiAgICogQHBhcmFtIHtIdG14U2V0dGxlSW5mb30gc2V0dGxlSW5mb1xuICAgKi9cbiAgZnVuY3Rpb24gc3dhcElubmVySFRNTCh0YXJnZXQsIGZyYWdtZW50LCBzZXR0bGVJbmZvKSB7XG4gICAgY29uc3QgZmlyc3RDaGlsZCA9IHRhcmdldC5maXJzdENoaWxkXG4gICAgaW5zZXJ0Tm9kZXNCZWZvcmUodGFyZ2V0LCBmaXJzdENoaWxkLCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICBpZiAoZmlyc3RDaGlsZCkge1xuICAgICAgd2hpbGUgKGZpcnN0Q2hpbGQubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgY2xlYW5VcEVsZW1lbnQoZmlyc3RDaGlsZC5uZXh0U2libGluZylcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUNoaWxkKGZpcnN0Q2hpbGQubmV4dFNpYmxpbmcpXG4gICAgICB9XG4gICAgICBjbGVhblVwRWxlbWVudChmaXJzdENoaWxkKVxuICAgICAgdGFyZ2V0LnJlbW92ZUNoaWxkKGZpcnN0Q2hpbGQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SHRteFN3YXBTdHlsZX0gc3dhcFN0eWxlXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gICAqIEBwYXJhbSB7UGFyZW50Tm9kZX0gZnJhZ21lbnRcbiAgICogQHBhcmFtIHtIdG14U2V0dGxlSW5mb30gc2V0dGxlSW5mb1xuICAgKi9cbiAgZnVuY3Rpb24gc3dhcFdpdGhTdHlsZShzd2FwU3R5bGUsIGVsdCwgdGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbykge1xuICAgIHN3aXRjaCAoc3dhcFN0eWxlKSB7XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgICAgcmV0dXJuXG4gICAgICBjYXNlICdvdXRlckhUTUwnOlxuICAgICAgICBzd2FwT3V0ZXJIVE1MKHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gICAgICAgIHJldHVyblxuICAgICAgY2FzZSAnYWZ0ZXJiZWdpbic6XG4gICAgICAgIHN3YXBBZnRlckJlZ2luKHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gICAgICAgIHJldHVyblxuICAgICAgY2FzZSAnYmVmb3JlYmVnaW4nOlxuICAgICAgICBzd2FwQmVmb3JlQmVnaW4odGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICAgICAgcmV0dXJuXG4gICAgICBjYXNlICdiZWZvcmVlbmQnOlxuICAgICAgICBzd2FwQmVmb3JlRW5kKHRhcmdldCwgZnJhZ21lbnQsIHNldHRsZUluZm8pXG4gICAgICAgIHJldHVyblxuICAgICAgY2FzZSAnYWZ0ZXJlbmQnOlxuICAgICAgICBzd2FwQWZ0ZXJFbmQodGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICAgICAgcmV0dXJuXG4gICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICBzd2FwRGVsZXRlKHRhcmdldClcbiAgICAgICAgcmV0dXJuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgZXh0ZW5zaW9ucyA9IGdldEV4dGVuc2lvbnMoZWx0KVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4dGVuc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBleHQgPSBleHRlbnNpb25zW2ldXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0VsZW1lbnRzID0gZXh0LmhhbmRsZVN3YXAoc3dhcFN0eWxlLCB0YXJnZXQsIGZyYWdtZW50LCBzZXR0bGVJbmZvKVxuICAgICAgICAgICAgaWYgKG5ld0VsZW1lbnRzKSB7XG4gICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG5ld0VsZW1lbnRzKSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIGhhbmRsZVN3YXAgcmV0dXJucyBhbiBhcnJheSAobGlrZSkgb2YgZWxlbWVudHMsIHdlIGhhbmRsZSB0aGVtXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuZXdFbGVtZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBuZXdFbGVtZW50c1tqXVxuICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSAmJiBjaGlsZC5ub2RlVHlwZSAhPT0gTm9kZS5DT01NRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGxlSW5mby50YXNrcy5wdXNoKG1ha2VBamF4TG9hZFRhc2soY2hpbGQpKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2dFcnJvcihlKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc3dhcFN0eWxlID09PSAnaW5uZXJIVE1MJykge1xuICAgICAgICAgIHN3YXBJbm5lckhUTUwodGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzd2FwV2l0aFN0eWxlKGh0bXguY29uZmlnLmRlZmF1bHRTd2FwU3R5bGUsIGVsdCwgdGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IGZyYWdtZW50XG4gICAqIEBwYXJhbSB7SHRteFNldHRsZUluZm99IHNldHRsZUluZm9cbiAgICogQHBhcmFtIHtOb2RlfERvY3VtZW50fSBbcm9vdE5vZGVdXG4gICAqL1xuICBmdW5jdGlvbiBmaW5kQW5kU3dhcE9vYkVsZW1lbnRzKGZyYWdtZW50LCBzZXR0bGVJbmZvLCByb290Tm9kZSkge1xuICAgIHZhciBvb2JFbHRzID0gZmluZEFsbChmcmFnbWVudCwgJ1toeC1zd2FwLW9vYl0sIFtkYXRhLWh4LXN3YXAtb29iXScpXG4gICAgZm9yRWFjaChvb2JFbHRzLCBmdW5jdGlvbihvb2JFbGVtZW50KSB7XG4gICAgICBpZiAoaHRteC5jb25maWcuYWxsb3dOZXN0ZWRPb2JTd2FwcyB8fCBvb2JFbGVtZW50LnBhcmVudEVsZW1lbnQgPT09IG51bGwpIHtcbiAgICAgICAgY29uc3Qgb29iVmFsdWUgPSBnZXRBdHRyaWJ1dGVWYWx1ZShvb2JFbGVtZW50LCAnaHgtc3dhcC1vb2InKVxuICAgICAgICBpZiAob29iVmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgIG9vYlN3YXAob29iVmFsdWUsIG9vYkVsZW1lbnQsIHNldHRsZUluZm8sIHJvb3ROb2RlKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvb2JFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaHgtc3dhcC1vb2InKVxuICAgICAgICBvb2JFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1oeC1zd2FwLW9vYicpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gb29iRWx0cy5sZW5ndGggPiAwXG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50cyBjb21wbGV0ZSBzd2FwcGluZyBwaXBlbGluZSwgaW5jbHVkaW5nOiBkZWxheSwgdmlldyB0cmFuc2l0aW9ucywgZm9jdXMgYW5kIHNlbGVjdGlvbiBwcmVzZXJ2YXRpb24sXG4gICAqIHRpdGxlIHVwZGF0ZXMsIHNjcm9sbCwgT09CIHN3YXBwaW5nLCBub3JtYWwgc3dhcHBpbmcgYW5kIHNldHRsaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfEVsZW1lbnR9IHRhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICAgKiBAcGFyYW0ge0h0bXhTd2FwU3BlY2lmaWNhdGlvbn0gc3dhcFNwZWNcbiAgICogQHBhcmFtIHtTd2FwT3B0aW9uc30gW3N3YXBPcHRpb25zXVxuICAgKi9cbiAgZnVuY3Rpb24gc3dhcCh0YXJnZXQsIGNvbnRlbnQsIHN3YXBTcGVjLCBzd2FwT3B0aW9ucykge1xuICAgIGlmICghc3dhcE9wdGlvbnMpIHtcbiAgICAgIHN3YXBPcHRpb25zID0ge31cbiAgICB9XG4gICAgLy8gb3B0aW9uYWwgdHJhbnNpdGlvbiBBUEkgcHJvbWlzZSBjYWxsYmFja3NcbiAgICBsZXQgc2V0dGxlUmVzb2x2ZSA9IG51bGxcbiAgICBsZXQgc2V0dGxlUmVqZWN0ID0gbnVsbFxuXG4gICAgbGV0IGRvU3dhcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbWF5YmVDYWxsKHN3YXBPcHRpb25zLmJlZm9yZVN3YXBDYWxsYmFjaylcblxuICAgICAgdGFyZ2V0ID0gcmVzb2x2ZVRhcmdldCh0YXJnZXQpXG4gICAgICBjb25zdCByb290Tm9kZSA9IHN3YXBPcHRpb25zLmNvbnRleHRFbGVtZW50ID8gZ2V0Um9vdE5vZGUoc3dhcE9wdGlvbnMuY29udGV4dEVsZW1lbnQsIGZhbHNlKSA6IGdldERvY3VtZW50KClcblxuICAgICAgLy8gcHJlc2VydmUgZm9jdXMgYW5kIHNlbGVjdGlvblxuICAgICAgY29uc3QgYWN0aXZlRWx0ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgbGV0IHNlbGVjdGlvbkluZm8gPSB7fVxuICAgICAgc2VsZWN0aW9uSW5mbyA9IHtcbiAgICAgICAgZWx0OiBhY3RpdmVFbHQsXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgc3RhcnQ6IGFjdGl2ZUVsdCA/IGFjdGl2ZUVsdC5zZWxlY3Rpb25TdGFydCA6IG51bGwsXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZW5kOiBhY3RpdmVFbHQgPyBhY3RpdmVFbHQuc2VsZWN0aW9uRW5kIDogbnVsbFxuICAgICAgfVxuICAgICAgY29uc3Qgc2V0dGxlSW5mbyA9IG1ha2VTZXR0bGVJbmZvKHRhcmdldClcblxuICAgICAgLy8gRm9yIHRleHQgY29udGVudCBzd2FwcywgZG9uJ3QgcGFyc2UgdGhlIHJlc3BvbnNlIGFzIEhUTUwsIGp1c3QgaW5zZXJ0IGl0XG4gICAgICBpZiAoc3dhcFNwZWMuc3dhcFN0eWxlID09PSAndGV4dENvbnRlbnQnKSB7XG4gICAgICAgIHRhcmdldC50ZXh0Q29udGVudCA9IGNvbnRlbnRcbiAgICAgIC8vIE90aGVyd2lzZSwgbWFrZSB0aGUgZnJhZ21lbnQgYW5kIHByb2Nlc3MgaXRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBmcmFnbWVudCA9IG1ha2VGcmFnbWVudChjb250ZW50KVxuXG4gICAgICAgIHNldHRsZUluZm8udGl0bGUgPSBzd2FwT3B0aW9ucy50aXRsZSB8fCBmcmFnbWVudC50aXRsZVxuICAgICAgICBpZiAoc3dhcE9wdGlvbnMuaGlzdG9yeVJlcXVlc3QpIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlIGZyYWdtZW50IGNhbiBiZSBhIHBhcmVudE5vZGUgRWxlbWVudFxuICAgICAgICAgIGZyYWdtZW50ID0gZnJhZ21lbnQucXVlcnlTZWxlY3RvcignW2h4LWhpc3RvcnktZWx0XSxbZGF0YS1oeC1oaXN0b3J5LWVsdF0nKSB8fCBmcmFnbWVudFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2VsZWN0LW9vYiBzd2Fwc1xuICAgICAgICBpZiAoc3dhcE9wdGlvbnMuc2VsZWN0T09CKSB7XG4gICAgICAgICAgY29uc3Qgb29iU2VsZWN0VmFsdWVzID0gc3dhcE9wdGlvbnMuc2VsZWN0T09CLnNwbGl0KCcsJylcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9vYlNlbGVjdFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgb29iU2VsZWN0VmFsdWUgPSBvb2JTZWxlY3RWYWx1ZXNbaV0uc3BsaXQoJzonLCAyKVxuICAgICAgICAgICAgbGV0IGlkID0gb29iU2VsZWN0VmFsdWVbMF0udHJpbSgpXG4gICAgICAgICAgICBpZiAoaWQuaW5kZXhPZignIycpID09PSAwKSB7XG4gICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyaW5nKDEpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBvb2JWYWx1ZSA9IG9vYlNlbGVjdFZhbHVlWzFdIHx8ICd0cnVlJ1xuICAgICAgICAgICAgY29uc3Qgb29iRWxlbWVudCA9IGZyYWdtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgaWQpXG4gICAgICAgICAgICBpZiAob29iRWxlbWVudCkge1xuICAgICAgICAgICAgICBvb2JTd2FwKG9vYlZhbHVlLCBvb2JFbGVtZW50LCBzZXR0bGVJbmZvLCByb290Tm9kZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gb29iIHN3YXBzXG4gICAgICAgIGZpbmRBbmRTd2FwT29iRWxlbWVudHMoZnJhZ21lbnQsIHNldHRsZUluZm8sIHJvb3ROb2RlKVxuICAgICAgICBmb3JFYWNoKGZpbmRBbGwoZnJhZ21lbnQsICd0ZW1wbGF0ZScpLCAvKiogQHBhcmFtIHtIVE1MVGVtcGxhdGVFbGVtZW50fSB0ZW1wbGF0ZSAqL2Z1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgICAgICAgaWYgKHRlbXBsYXRlLmNvbnRlbnQgJiYgZmluZEFuZFN3YXBPb2JFbGVtZW50cyh0ZW1wbGF0ZS5jb250ZW50LCBzZXR0bGVJbmZvLCByb290Tm9kZSkpIHtcbiAgICAgICAgICAgIC8vIEF2b2lkIHBvbGx1dGluZyB0aGUgRE9NIHdpdGggZW1wdHkgdGVtcGxhdGVzIHRoYXQgd2VyZSBvbmx5IHVzZWQgdG8gZW5jYXBzdWxhdGUgb29iIHN3YXBcbiAgICAgICAgICAgIHRlbXBsYXRlLnJlbW92ZSgpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIG5vcm1hbCBzd2FwXG4gICAgICAgIGlmIChzd2FwT3B0aW9ucy5zZWxlY3QpIHtcbiAgICAgICAgICBjb25zdCBuZXdGcmFnbWVudCA9IGdldERvY3VtZW50KCkuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgICAgICAgZm9yRWFjaChmcmFnbWVudC5xdWVyeVNlbGVjdG9yQWxsKHN3YXBPcHRpb25zLnNlbGVjdCksIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIG5ld0ZyYWdtZW50LmFwcGVuZENoaWxkKG5vZGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBmcmFnbWVudCA9IG5ld0ZyYWdtZW50XG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlUHJlc2VydmVkRWxlbWVudHMoZnJhZ21lbnQpXG4gICAgICAgIHN3YXBXaXRoU3R5bGUoc3dhcFNwZWMuc3dhcFN0eWxlLCBzd2FwT3B0aW9ucy5jb250ZXh0RWxlbWVudCwgdGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbylcbiAgICAgICAgcmVzdG9yZVByZXNlcnZlZEVsZW1lbnRzKClcbiAgICAgIH1cblxuICAgICAgLy8gYXBwbHkgc2F2ZWQgZm9jdXMgYW5kIHNlbGVjdGlvbiBpbmZvcm1hdGlvbiB0byBzd2FwcGVkIGNvbnRlbnRcbiAgICAgIGlmIChzZWxlY3Rpb25JbmZvLmVsdCAmJlxuICAgICAgICAhYm9keUNvbnRhaW5zKHNlbGVjdGlvbkluZm8uZWx0KSAmJlxuICAgICAgICBnZXRSYXdBdHRyaWJ1dGUoc2VsZWN0aW9uSW5mby5lbHQsICdpZCcpKSB7XG4gICAgICAgIGNvbnN0IG5ld0FjdGl2ZUVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGdldFJhd0F0dHJpYnV0ZShzZWxlY3Rpb25JbmZvLmVsdCwgJ2lkJykpXG4gICAgICAgIGNvbnN0IGZvY3VzT3B0aW9ucyA9IHsgcHJldmVudFNjcm9sbDogc3dhcFNwZWMuZm9jdXNTY3JvbGwgIT09IHVuZGVmaW5lZCA/ICFzd2FwU3BlYy5mb2N1c1Njcm9sbCA6ICFodG14LmNvbmZpZy5kZWZhdWx0Rm9jdXNTY3JvbGwgfVxuICAgICAgICBpZiAobmV3QWN0aXZlRWx0KSB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGlmIChzZWxlY3Rpb25JbmZvLnN0YXJ0ICYmIG5ld0FjdGl2ZUVsdC5zZXRTZWxlY3Rpb25SYW5nZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBuZXdBY3RpdmVFbHQuc2V0U2VsZWN0aW9uUmFuZ2Uoc2VsZWN0aW9uSW5mby5zdGFydCwgc2VsZWN0aW9uSW5mby5lbmQpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIC8vIHRoZSBzZXRTZWxlY3Rpb25SYW5nZSBtZXRob2QgaXMgcHJlc2VudCBvbiBmaWVsZHMgdGhhdCBkb24ndCBzdXBwb3J0IGl0LCBzbyBqdXN0IGxldCB0aGlzIGZhaWxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgbmV3QWN0aXZlRWx0LmZvY3VzKGZvY3VzT3B0aW9ucylcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZW1vdmVDbGFzc0Zyb21FbGVtZW50KHRhcmdldCwgaHRteC5jb25maWcuc3dhcHBpbmdDbGFzcylcbiAgICAgIGZvckVhY2goc2V0dGxlSW5mby5lbHRzLCBmdW5jdGlvbihlbHQpIHtcbiAgICAgICAgaWYgKGVsdC5jbGFzc0xpc3QpIHtcbiAgICAgICAgICBhZGRDbGFzc1RvRWxlbWVudChlbHQsIGh0bXguY29uZmlnLnNldHRsaW5nQ2xhc3MpXG4gICAgICAgIH1cbiAgICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6YWZ0ZXJTd2FwJywgc3dhcE9wdGlvbnMuZXZlbnRJbmZvKVxuICAgICAgfSlcbiAgICAgIG1heWJlQ2FsbChzd2FwT3B0aW9ucy5hZnRlclN3YXBDYWxsYmFjaylcblxuICAgICAgLy8gbWVyZ2UgaW4gbmV3IHRpdGxlIGFmdGVyIHN3YXAgYnV0IGJlZm9yZSBzZXR0bGVcbiAgICAgIGlmICghc3dhcFNwZWMuaWdub3JlVGl0bGUpIHtcbiAgICAgICAgaGFuZGxlVGl0bGUoc2V0dGxlSW5mby50aXRsZSlcbiAgICAgIH1cblxuICAgICAgLy8gc2V0dGxlXG4gICAgICBjb25zdCBkb1NldHRsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3JFYWNoKHNldHRsZUluZm8udGFza3MsIGZ1bmN0aW9uKHRhc2spIHtcbiAgICAgICAgICB0YXNrLmNhbGwoKVxuICAgICAgICB9KVxuICAgICAgICBmb3JFYWNoKHNldHRsZUluZm8uZWx0cywgZnVuY3Rpb24oZWx0KSB7XG4gICAgICAgICAgaWYgKGVsdC5jbGFzc0xpc3QpIHtcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzRnJvbUVsZW1lbnQoZWx0LCBodG14LmNvbmZpZy5zZXR0bGluZ0NsYXNzKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDphZnRlclNldHRsZScsIHN3YXBPcHRpb25zLmV2ZW50SW5mbylcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoc3dhcE9wdGlvbnMuYW5jaG9yKSB7XG4gICAgICAgICAgY29uc3QgYW5jaG9yVGFyZ2V0ID0gYXNFbGVtZW50KHJlc29sdmVUYXJnZXQoJyMnICsgc3dhcE9wdGlvbnMuYW5jaG9yKSlcbiAgICAgICAgICBpZiAoYW5jaG9yVGFyZ2V0KSB7XG4gICAgICAgICAgICBhbmNob3JUYXJnZXQuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogJ3N0YXJ0JywgYmVoYXZpb3I6ICdhdXRvJyB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVNjcm9sbFN0YXRlKHNldHRsZUluZm8uZWx0cywgc3dhcFNwZWMpXG4gICAgICAgIG1heWJlQ2FsbChzd2FwT3B0aW9ucy5hZnRlclNldHRsZUNhbGxiYWNrKVxuICAgICAgICBtYXliZUNhbGwoc2V0dGxlUmVzb2x2ZSlcbiAgICAgIH1cblxuICAgICAgaWYgKHN3YXBTcGVjLnNldHRsZURlbGF5ID4gMCkge1xuICAgICAgICBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGRvU2V0dGxlLCBzd2FwU3BlYy5zZXR0bGVEZWxheSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvU2V0dGxlKClcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IHNob3VsZFRyYW5zaXRpb24gPSBodG14LmNvbmZpZy5nbG9iYWxWaWV3VHJhbnNpdGlvbnNcbiAgICBpZiAoc3dhcFNwZWMuaGFzT3duUHJvcGVydHkoJ3RyYW5zaXRpb24nKSkge1xuICAgICAgc2hvdWxkVHJhbnNpdGlvbiA9IHN3YXBTcGVjLnRyYW5zaXRpb25cbiAgICB9XG5cbiAgICBjb25zdCBlbHQgPSBzd2FwT3B0aW9ucy5jb250ZXh0RWxlbWVudCB8fCBnZXREb2N1bWVudCgpXG5cbiAgICBpZiAoc2hvdWxkVHJhbnNpdGlvbiAmJlxuICAgICAgICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6YmVmb3JlVHJhbnNpdGlvbicsIHN3YXBPcHRpb25zLmV2ZW50SW5mbykgJiZcbiAgICAgICAgICAgIHR5cGVvZiBQcm9taXNlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBleHBlcmltZW50YWwgZmVhdHVyZSBhdG1cbiAgICAgICAgICAgIGRvY3VtZW50LnN0YXJ0Vmlld1RyYW5zaXRpb24pIHtcbiAgICAgIGNvbnN0IHNldHRsZVByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihfcmVzb2x2ZSwgX3JlamVjdCkge1xuICAgICAgICBzZXR0bGVSZXNvbHZlID0gX3Jlc29sdmVcbiAgICAgICAgc2V0dGxlUmVqZWN0ID0gX3JlamVjdFxuICAgICAgfSlcbiAgICAgIC8vIHdyYXAgdGhlIG9yaWdpbmFsIGRvU3dhcCgpIGluIGEgY2FsbCB0byBzdGFydFZpZXdUcmFuc2l0aW9uKClcbiAgICAgIGNvbnN0IGlubmVyRG9Td2FwID0gZG9Td2FwXG4gICAgICBkb1N3YXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZSBleHBlcmltZW50YWwgZmVhdHVyZSBhdG1cbiAgICAgICAgZG9jdW1lbnQuc3RhcnRWaWV3VHJhbnNpdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBpbm5lckRvU3dhcCgpXG4gICAgICAgICAgcmV0dXJuIHNldHRsZVByb21pc2VcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaWYgKHN3YXBTcGVjPy5zd2FwRGVsYXkgJiYgc3dhcFNwZWMuc3dhcERlbGF5ID4gMCkge1xuICAgICAgICBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGRvU3dhcCwgc3dhcFNwZWMuc3dhcERlbGF5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9Td2FwKClcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0cmlnZ2VyRXJyb3JFdmVudChlbHQsICdodG14OnN3YXBFcnJvcicsIHN3YXBPcHRpb25zLmV2ZW50SW5mbylcbiAgICAgIG1heWJlQ2FsbChzZXR0bGVSZWplY3QpXG4gICAgICB0aHJvdyBlXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3R9IHhoclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGVhZGVyXG4gICAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IGVsdFxuICAgKi9cbiAgZnVuY3Rpb24gaGFuZGxlVHJpZ2dlckhlYWRlcih4aHIsIGhlYWRlciwgZWx0KSB7XG4gICAgY29uc3QgdHJpZ2dlckJvZHkgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoaGVhZGVyKVxuICAgIGlmICh0cmlnZ2VyQm9keS5pbmRleE9mKCd7JykgPT09IDApIHtcbiAgICAgIGNvbnN0IHRyaWdnZXJzID0gcGFyc2VKU09OKHRyaWdnZXJCb2R5KVxuICAgICAgZm9yIChjb25zdCBldmVudE5hbWUgaW4gdHJpZ2dlcnMpIHtcbiAgICAgICAgaWYgKHRyaWdnZXJzLmhhc093blByb3BlcnR5KGV2ZW50TmFtZSkpIHtcbiAgICAgICAgICBsZXQgZGV0YWlsID0gdHJpZ2dlcnNbZXZlbnROYW1lXVxuICAgICAgICAgIGlmIChpc1Jhd09iamVjdChkZXRhaWwpKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBlbHQgPSBkZXRhaWwudGFyZ2V0ICE9PSB1bmRlZmluZWQgPyBkZXRhaWwudGFyZ2V0IDogZWx0XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRldGFpbCA9IHsgdmFsdWU6IGRldGFpbCB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRyaWdnZXJFdmVudChlbHQsIGV2ZW50TmFtZSwgZGV0YWlsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZXMgPSB0cmlnZ2VyQm9keS5zcGxpdCgnLCcpXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgZXZlbnROYW1lc1tpXS50cmltKCksIFtdKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IFdISVRFU1BBQ0UgPSAvXFxzL1xuICBjb25zdCBXSElURVNQQUNFX09SX0NPTU1BID0gL1tcXHMsXS9cbiAgY29uc3QgU1lNQk9MX1NUQVJUID0gL1tfJGEtekEtWl0vXG4gIGNvbnN0IFNZTUJPTF9DT05UID0gL1tfJGEtekEtWjAtOV0vXG4gIGNvbnN0IFNUUklOR0lTSF9TVEFSVCA9IFsnXCInLCBcIidcIiwgJy8nXVxuICBjb25zdCBOT1RfV0hJVEVTUEFDRSA9IC9bXlxcc10vXG4gIGNvbnN0IENPTUJJTkVEX1NFTEVDVE9SX1NUQVJUID0gL1t7KF0vXG4gIGNvbnN0IENPTUJJTkVEX1NFTEVDVE9SX0VORCA9IC9bfSldL1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgICovXG4gIGZ1bmN0aW9uIHRva2VuaXplU3RyaW5nKHN0cikge1xuICAgIC8qKiBAdHlwZSBzdHJpbmdbXSAqL1xuICAgIGNvbnN0IHRva2VucyA9IFtdXG4gICAgbGV0IHBvc2l0aW9uID0gMFxuICAgIHdoaWxlIChwb3NpdGlvbiA8IHN0ci5sZW5ndGgpIHtcbiAgICAgIGlmIChTWU1CT0xfU1RBUlQuZXhlYyhzdHIuY2hhckF0KHBvc2l0aW9uKSkpIHtcbiAgICAgICAgdmFyIHN0YXJ0UG9zaXRpb24gPSBwb3NpdGlvblxuICAgICAgICB3aGlsZSAoU1lNQk9MX0NPTlQuZXhlYyhzdHIuY2hhckF0KHBvc2l0aW9uICsgMSkpKSB7XG4gICAgICAgICAgcG9zaXRpb24rK1xuICAgICAgICB9XG4gICAgICAgIHRva2Vucy5wdXNoKHN0ci5zdWJzdHJpbmcoc3RhcnRQb3NpdGlvbiwgcG9zaXRpb24gKyAxKSlcbiAgICAgIH0gZWxzZSBpZiAoU1RSSU5HSVNIX1NUQVJULmluZGV4T2Yoc3RyLmNoYXJBdChwb3NpdGlvbikpICE9PSAtMSkge1xuICAgICAgICBjb25zdCBzdGFydENoYXIgPSBzdHIuY2hhckF0KHBvc2l0aW9uKVxuICAgICAgICB2YXIgc3RhcnRQb3NpdGlvbiA9IHBvc2l0aW9uXG4gICAgICAgIHBvc2l0aW9uKytcbiAgICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgc3RyLmxlbmd0aCAmJiBzdHIuY2hhckF0KHBvc2l0aW9uKSAhPT0gc3RhcnRDaGFyKSB7XG4gICAgICAgICAgaWYgKHN0ci5jaGFyQXQocG9zaXRpb24pID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uKytcbiAgICAgICAgICB9XG4gICAgICAgICAgcG9zaXRpb24rK1xuICAgICAgICB9XG4gICAgICAgIHRva2Vucy5wdXNoKHN0ci5zdWJzdHJpbmcoc3RhcnRQb3NpdGlvbiwgcG9zaXRpb24gKyAxKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN5bWJvbCA9IHN0ci5jaGFyQXQocG9zaXRpb24pXG4gICAgICAgIHRva2Vucy5wdXNoKHN5bWJvbClcbiAgICAgIH1cbiAgICAgIHBvc2l0aW9uKytcbiAgICB9XG4gICAgcmV0dXJuIHRva2Vuc1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlblxuICAgKiBAcGFyYW0ge3N0cmluZ3xudWxsfSBsYXN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbU5hbWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBpc1Bvc3NpYmxlUmVsYXRpdmVSZWZlcmVuY2UodG9rZW4sIGxhc3QsIHBhcmFtTmFtZSkge1xuICAgIHJldHVybiBTWU1CT0xfU1RBUlQuZXhlYyh0b2tlbi5jaGFyQXQoMCkpICYmXG4gICAgICB0b2tlbiAhPT0gJ3RydWUnICYmXG4gICAgICB0b2tlbiAhPT0gJ2ZhbHNlJyAmJlxuICAgICAgdG9rZW4gIT09ICd0aGlzJyAmJlxuICAgICAgdG9rZW4gIT09IHBhcmFtTmFtZSAmJlxuICAgICAgbGFzdCAhPT0gJy4nXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldHxzdHJpbmd9IGVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSB0b2tlbnNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtTmFtZVxuICAgKiBAcmV0dXJucyB7Q29uZGl0aW9uYWxGdW5jdGlvbnxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gbWF5YmVHZW5lcmF0ZUNvbmRpdGlvbmFsKGVsdCwgdG9rZW5zLCBwYXJhbU5hbWUpIHtcbiAgICBpZiAodG9rZW5zWzBdID09PSAnWycpIHtcbiAgICAgIHRva2Vucy5zaGlmdCgpXG4gICAgICBsZXQgYnJhY2tldENvdW50ID0gMVxuICAgICAgbGV0IGNvbmRpdGlvbmFsU291cmNlID0gJyByZXR1cm4gKGZ1bmN0aW9uKCcgKyBwYXJhbU5hbWUgKyAnKXsgcmV0dXJuICgnXG4gICAgICBsZXQgbGFzdCA9IG51bGxcbiAgICAgIHdoaWxlICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vuc1swXVxuICAgICAgICAvLyBAdHMtaWdub3JlIEZvciBzb21lIHJlYXNvbiB0c2MgZG9lc24ndCB1bmRlcnN0YW5kIHRoZSBzaGlmdCBjYWxsLCBhbmQgdGhpbmtzIHdlJ3JlIGNvbXBhcmluZyB0aGUgc2FtZSB2YWx1ZSBoZXJlLCBpLmUuICdbJyB2cyAnXSdcbiAgICAgICAgaWYgKHRva2VuID09PSAnXScpIHtcbiAgICAgICAgICBicmFja2V0Q291bnQtLVxuICAgICAgICAgIGlmIChicmFja2V0Q291bnQgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChsYXN0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIGNvbmRpdGlvbmFsU291cmNlID0gY29uZGl0aW9uYWxTb3VyY2UgKyAndHJ1ZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRva2Vucy5zaGlmdCgpXG4gICAgICAgICAgICBjb25kaXRpb25hbFNvdXJjZSArPSAnKX0pJ1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QgY29uZGl0aW9uRnVuY3Rpb24gPSBtYXliZUV2YWwoZWx0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24oY29uZGl0aW9uYWxTb3VyY2UpKClcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlIH0pXG4gICAgICAgICAgICAgIGNvbmRpdGlvbkZ1bmN0aW9uLnNvdXJjZSA9IGNvbmRpdGlvbmFsU291cmNlXG4gICAgICAgICAgICAgIHJldHVybiBjb25kaXRpb25GdW5jdGlvblxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICB0cmlnZ2VyRXJyb3JFdmVudChnZXREb2N1bWVudCgpLmJvZHksICdodG14OnN5bnRheDplcnJvcicsIHsgZXJyb3I6IGUsIHNvdXJjZTogY29uZGl0aW9uYWxTb3VyY2UgfSlcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodG9rZW4gPT09ICdbJykge1xuICAgICAgICAgIGJyYWNrZXRDb3VudCsrXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUG9zc2libGVSZWxhdGl2ZVJlZmVyZW5jZSh0b2tlbiwgbGFzdCwgcGFyYW1OYW1lKSkge1xuICAgICAgICAgIGNvbmRpdGlvbmFsU291cmNlICs9ICcoKCcgKyBwYXJhbU5hbWUgKyAnLicgKyB0b2tlbiArICcpID8gKCcgKyBwYXJhbU5hbWUgKyAnLicgKyB0b2tlbiArICcpIDogKHdpbmRvdy4nICsgdG9rZW4gKyAnKSknXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uZGl0aW9uYWxTb3VyY2UgPSBjb25kaXRpb25hbFNvdXJjZSArIHRva2VuXG4gICAgICAgIH1cbiAgICAgICAgbGFzdCA9IHRva2Vucy5zaGlmdCgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHRva2Vuc1xuICAgKiBAcGFyYW0ge1JlZ0V4cH0gbWF0Y2hcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGNvbnN1bWVVbnRpbCh0b2tlbnMsIG1hdGNoKSB7XG4gICAgbGV0IHJlc3VsdCA9ICcnXG4gICAgd2hpbGUgKHRva2Vucy5sZW5ndGggPiAwICYmICFtYXRjaC50ZXN0KHRva2Vuc1swXSkpIHtcbiAgICAgIHJlc3VsdCArPSB0b2tlbnMuc2hpZnQoKVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gdG9rZW5zXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBjb25zdW1lQ1NTU2VsZWN0b3IodG9rZW5zKSB7XG4gICAgbGV0IHJlc3VsdFxuICAgIGlmICh0b2tlbnMubGVuZ3RoID4gMCAmJiBDT01CSU5FRF9TRUxFQ1RPUl9TVEFSVC50ZXN0KHRva2Vuc1swXSkpIHtcbiAgICAgIHRva2Vucy5zaGlmdCgpXG4gICAgICByZXN1bHQgPSBjb25zdW1lVW50aWwodG9rZW5zLCBDT01CSU5FRF9TRUxFQ1RPUl9FTkQpLnRyaW0oKVxuICAgICAgdG9rZW5zLnNoaWZ0KClcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gY29uc3VtZVVudGlsKHRva2VucywgV0hJVEVTUEFDRV9PUl9DT01NQSlcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgY29uc3QgSU5QVVRfU0VMRUNUT1IgPSAnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBleHBsaWNpdFRyaWdnZXJcbiAgICogQHBhcmFtIHtPYmplY3R9IGNhY2hlIGZvciB0cmlnZ2VyIHNwZWNzXG4gICAqIEByZXR1cm5zIHtIdG14VHJpZ2dlclNwZWNpZmljYXRpb25bXX1cbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlQW5kQ2FjaGVUcmlnZ2VyKGVsdCwgZXhwbGljaXRUcmlnZ2VyLCBjYWNoZSkge1xuICAgIC8qKiBAdHlwZSBIdG14VHJpZ2dlclNwZWNpZmljYXRpb25bXSAqL1xuICAgIGNvbnN0IHRyaWdnZXJTcGVjcyA9IFtdXG4gICAgY29uc3QgdG9rZW5zID0gdG9rZW5pemVTdHJpbmcoZXhwbGljaXRUcmlnZ2VyKVxuICAgIGRvIHtcbiAgICAgIGNvbnN1bWVVbnRpbCh0b2tlbnMsIE5PVF9XSElURVNQQUNFKVxuICAgICAgY29uc3QgaW5pdGlhbExlbmd0aCA9IHRva2Vucy5sZW5ndGhcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBjb25zdW1lVW50aWwodG9rZW5zLCAvWyxcXFtcXHNdLylcbiAgICAgIGlmICh0cmlnZ2VyICE9PSAnJykge1xuICAgICAgICBpZiAodHJpZ2dlciA9PT0gJ2V2ZXJ5Jykge1xuICAgICAgICAgIC8qKiBAdHlwZSBIdG14VHJpZ2dlclNwZWNpZmljYXRpb24gKi9cbiAgICAgICAgICBjb25zdCBldmVyeSA9IHsgdHJpZ2dlcjogJ2V2ZXJ5JyB9XG4gICAgICAgICAgY29uc3VtZVVudGlsKHRva2VucywgTk9UX1dISVRFU1BBQ0UpXG4gICAgICAgICAgZXZlcnkucG9sbEludGVydmFsID0gcGFyc2VJbnRlcnZhbChjb25zdW1lVW50aWwodG9rZW5zLCAvWyxcXFtcXHNdLykpXG4gICAgICAgICAgY29uc3VtZVVudGlsKHRva2VucywgTk9UX1dISVRFU1BBQ0UpXG4gICAgICAgICAgdmFyIGV2ZW50RmlsdGVyID0gbWF5YmVHZW5lcmF0ZUNvbmRpdGlvbmFsKGVsdCwgdG9rZW5zLCAnZXZlbnQnKVxuICAgICAgICAgIGlmIChldmVudEZpbHRlcikge1xuICAgICAgICAgICAgZXZlcnkuZXZlbnRGaWx0ZXIgPSBldmVudEZpbHRlclxuICAgICAgICAgIH1cbiAgICAgICAgICB0cmlnZ2VyU3BlY3MucHVzaChldmVyeSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKiogQHR5cGUgSHRteFRyaWdnZXJTcGVjaWZpY2F0aW9uICovXG4gICAgICAgICAgY29uc3QgdHJpZ2dlclNwZWMgPSB7IHRyaWdnZXIgfVxuICAgICAgICAgIHZhciBldmVudEZpbHRlciA9IG1heWJlR2VuZXJhdGVDb25kaXRpb25hbChlbHQsIHRva2VucywgJ2V2ZW50JylcbiAgICAgICAgICBpZiAoZXZlbnRGaWx0ZXIpIHtcbiAgICAgICAgICAgIHRyaWdnZXJTcGVjLmV2ZW50RmlsdGVyID0gZXZlbnRGaWx0ZXJcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3VtZVVudGlsKHRva2VucywgTk9UX1dISVRFU1BBQ0UpXG4gICAgICAgICAgd2hpbGUgKHRva2Vucy5sZW5ndGggPiAwICYmIHRva2Vuc1swXSAhPT0gJywnKSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vucy5zaGlmdCgpXG4gICAgICAgICAgICBpZiAodG9rZW4gPT09ICdjaGFuZ2VkJykge1xuICAgICAgICAgICAgICB0cmlnZ2VyU3BlYy5jaGFuZ2VkID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbiA9PT0gJ29uY2UnKSB7XG4gICAgICAgICAgICAgIHRyaWdnZXJTcGVjLm9uY2UgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuID09PSAnY29uc3VtZScpIHtcbiAgICAgICAgICAgICAgdHJpZ2dlclNwZWMuY29uc3VtZSA9IHRydWVcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4gPT09ICdkZWxheScgJiYgdG9rZW5zWzBdID09PSAnOicpIHtcbiAgICAgICAgICAgICAgdG9rZW5zLnNoaWZ0KClcbiAgICAgICAgICAgICAgdHJpZ2dlclNwZWMuZGVsYXkgPSBwYXJzZUludGVydmFsKGNvbnN1bWVVbnRpbCh0b2tlbnMsIFdISVRFU1BBQ0VfT1JfQ09NTUEpKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbiA9PT0gJ2Zyb20nICYmIHRva2Vuc1swXSA9PT0gJzonKSB7XG4gICAgICAgICAgICAgIHRva2Vucy5zaGlmdCgpXG4gICAgICAgICAgICAgIGlmIChDT01CSU5FRF9TRUxFQ1RPUl9TVEFSVC50ZXN0KHRva2Vuc1swXSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZnJvbV9hcmcgPSBjb25zdW1lQ1NTU2VsZWN0b3IodG9rZW5zKVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBmcm9tX2FyZyA9IGNvbnN1bWVVbnRpbCh0b2tlbnMsIFdISVRFU1BBQ0VfT1JfQ09NTUEpXG4gICAgICAgICAgICAgICAgaWYgKGZyb21fYXJnID09PSAnY2xvc2VzdCcgfHwgZnJvbV9hcmcgPT09ICdmaW5kJyB8fCBmcm9tX2FyZyA9PT0gJ25leHQnIHx8IGZyb21fYXJnID09PSAncHJldmlvdXMnKSB7XG4gICAgICAgICAgICAgICAgICB0b2tlbnMuc2hpZnQoKVxuICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBjb25zdW1lQ1NTU2VsZWN0b3IodG9rZW5zKVxuICAgICAgICAgICAgICAgICAgLy8gYG5leHRgIGFuZCBgcHJldmlvdXNgIGFsbG93IGEgc2VsZWN0b3ItbGVzcyBzeW50YXhcbiAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rvci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21fYXJnICs9ICcgJyArIHNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRyaWdnZXJTcGVjLmZyb20gPSBmcm9tX2FyZ1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbiA9PT0gJ3RhcmdldCcgJiYgdG9rZW5zWzBdID09PSAnOicpIHtcbiAgICAgICAgICAgICAgdG9rZW5zLnNoaWZ0KClcbiAgICAgICAgICAgICAgdHJpZ2dlclNwZWMudGFyZ2V0ID0gY29uc3VtZUNTU1NlbGVjdG9yKHRva2VucylcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4gPT09ICd0aHJvdHRsZScgJiYgdG9rZW5zWzBdID09PSAnOicpIHtcbiAgICAgICAgICAgICAgdG9rZW5zLnNoaWZ0KClcbiAgICAgICAgICAgICAgdHJpZ2dlclNwZWMudGhyb3R0bGUgPSBwYXJzZUludGVydmFsKGNvbnN1bWVVbnRpbCh0b2tlbnMsIFdISVRFU1BBQ0VfT1JfQ09NTUEpKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbiA9PT0gJ3F1ZXVlJyAmJiB0b2tlbnNbMF0gPT09ICc6Jykge1xuICAgICAgICAgICAgICB0b2tlbnMuc2hpZnQoKVxuICAgICAgICAgICAgICB0cmlnZ2VyU3BlYy5xdWV1ZSA9IGNvbnN1bWVVbnRpbCh0b2tlbnMsIFdISVRFU1BBQ0VfT1JfQ09NTUEpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuID09PSAncm9vdCcgJiYgdG9rZW5zWzBdID09PSAnOicpIHtcbiAgICAgICAgICAgICAgdG9rZW5zLnNoaWZ0KClcbiAgICAgICAgICAgICAgdHJpZ2dlclNwZWNbdG9rZW5dID0gY29uc3VtZUNTU1NlbGVjdG9yKHRva2VucylcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4gPT09ICd0aHJlc2hvbGQnICYmIHRva2Vuc1swXSA9PT0gJzonKSB7XG4gICAgICAgICAgICAgIHRva2Vucy5zaGlmdCgpXG4gICAgICAgICAgICAgIHRyaWdnZXJTcGVjW3Rva2VuXSA9IGNvbnN1bWVVbnRpbCh0b2tlbnMsIFdISVRFU1BBQ0VfT1JfQ09NTUEpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0cmlnZ2VyRXJyb3JFdmVudChlbHQsICdodG14OnN5bnRheDplcnJvcicsIHsgdG9rZW46IHRva2Vucy5zaGlmdCgpIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdW1lVW50aWwodG9rZW5zLCBOT1RfV0hJVEVTUEFDRSlcbiAgICAgICAgICB9XG4gICAgICAgICAgdHJpZ2dlclNwZWNzLnB1c2godHJpZ2dlclNwZWMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0b2tlbnMubGVuZ3RoID09PSBpbml0aWFsTGVuZ3RoKSB7XG4gICAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6c3ludGF4OmVycm9yJywgeyB0b2tlbjogdG9rZW5zLnNoaWZ0KCkgfSlcbiAgICAgIH1cbiAgICAgIGNvbnN1bWVVbnRpbCh0b2tlbnMsIE5PVF9XSElURVNQQUNFKVxuICAgIH0gd2hpbGUgKHRva2Vuc1swXSA9PT0gJywnICYmIHRva2Vucy5zaGlmdCgpKVxuICAgIGlmIChjYWNoZSkge1xuICAgICAgY2FjaGVbZXhwbGljaXRUcmlnZ2VyXSA9IHRyaWdnZXJTcGVjc1xuICAgIH1cbiAgICByZXR1cm4gdHJpZ2dlclNwZWNzXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHJldHVybnMge0h0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbltdfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0VHJpZ2dlclNwZWNzKGVsdCkge1xuICAgIGNvbnN0IGV4cGxpY2l0VHJpZ2dlciA9IGdldEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXRyaWdnZXInKVxuICAgIGxldCB0cmlnZ2VyU3BlY3MgPSBbXVxuICAgIGlmIChleHBsaWNpdFRyaWdnZXIpIHtcbiAgICAgIGNvbnN0IGNhY2hlID0gaHRteC5jb25maWcudHJpZ2dlclNwZWNzQ2FjaGVcbiAgICAgIHRyaWdnZXJTcGVjcyA9IChjYWNoZSAmJiBjYWNoZVtleHBsaWNpdFRyaWdnZXJdKSB8fCBwYXJzZUFuZENhY2hlVHJpZ2dlcihlbHQsIGV4cGxpY2l0VHJpZ2dlciwgY2FjaGUpXG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJTcGVjcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdHJpZ2dlclNwZWNzXG4gICAgfSBlbHNlIGlmIChtYXRjaGVzKGVsdCwgJ2Zvcm0nKSkge1xuICAgICAgcmV0dXJuIFt7IHRyaWdnZXI6ICdzdWJtaXQnIH1dXG4gICAgfSBlbHNlIGlmIChtYXRjaGVzKGVsdCwgJ2lucHV0W3R5cGU9XCJidXR0b25cIl0sIGlucHV0W3R5cGU9XCJzdWJtaXRcIl0nKSkge1xuICAgICAgcmV0dXJuIFt7IHRyaWdnZXI6ICdjbGljaycgfV1cbiAgICB9IGVsc2UgaWYgKG1hdGNoZXMoZWx0LCBJTlBVVF9TRUxFQ1RPUikpIHtcbiAgICAgIHJldHVybiBbeyB0cmlnZ2VyOiAnY2hhbmdlJyB9XVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW3sgdHJpZ2dlcjogJ2NsaWNrJyB9XVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKi9cbiAgZnVuY3Rpb24gY2FuY2VsUG9sbGluZyhlbHQpIHtcbiAgICBnZXRJbnRlcm5hbERhdGEoZWx0KS5jYW5jZWxsZWQgPSB0cnVlXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtUcmlnZ2VySGFuZGxlcn0gaGFuZGxlclxuICAgKiBAcGFyYW0ge0h0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbn0gc3BlY1xuICAgKi9cbiAgZnVuY3Rpb24gcHJvY2Vzc1BvbGxpbmcoZWx0LCBoYW5kbGVyLCBzcGVjKSB7XG4gICAgY29uc3Qgbm9kZURhdGEgPSBnZXRJbnRlcm5hbERhdGEoZWx0KVxuICAgIG5vZGVEYXRhLnRpbWVvdXQgPSBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGJvZHlDb250YWlucyhlbHQpICYmIG5vZGVEYXRhLmNhbmNlbGxlZCAhPT0gdHJ1ZSkge1xuICAgICAgICBpZiAoIW1heWJlRmlsdGVyRXZlbnQoc3BlYywgZWx0LCBtYWtlRXZlbnQoJ2h4OnBvbGw6dHJpZ2dlcicsIHtcbiAgICAgICAgICB0cmlnZ2VyU3BlYzogc3BlYyxcbiAgICAgICAgICB0YXJnZXQ6IGVsdFxuICAgICAgICB9KSkpIHtcbiAgICAgICAgICBoYW5kbGVyKGVsdClcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzUG9sbGluZyhlbHQsIGhhbmRsZXIsIHNwZWMpXG4gICAgICB9XG4gICAgfSwgc3BlYy5wb2xsSW50ZXJ2YWwpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtIVE1MQW5jaG9yRWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gaXNMb2NhbExpbmsoZWx0KSB7XG4gICAgcmV0dXJuIGxvY2F0aW9uLmhvc3RuYW1lID09PSBlbHQuaG9zdG5hbWUgJiZcbiAgICAgIGdldFJhd0F0dHJpYnV0ZShlbHQsICdocmVmJykgJiZcbiAgICAgIGdldFJhd0F0dHJpYnV0ZShlbHQsICdocmVmJykuaW5kZXhPZignIycpICE9PSAwXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICovXG4gIGZ1bmN0aW9uIGVsdElzRGlzYWJsZWQoZWx0KSB7XG4gICAgcmV0dXJuIGNsb3Nlc3QoZWx0LCBodG14LmNvbmZpZy5kaXNhYmxlU2VsZWN0b3IpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtIdG14Tm9kZUludGVybmFsRGF0YX0gbm9kZURhdGFcbiAgICogQHBhcmFtIHtIdG14VHJpZ2dlclNwZWNpZmljYXRpb25bXX0gdHJpZ2dlclNwZWNzXG4gICAqL1xuICBmdW5jdGlvbiBib29zdEVsZW1lbnQoZWx0LCBub2RlRGF0YSwgdHJpZ2dlclNwZWNzKSB7XG4gICAgaWYgKChlbHQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCAmJiBpc0xvY2FsTGluayhlbHQpICYmIChlbHQudGFyZ2V0ID09PSAnJyB8fCBlbHQudGFyZ2V0ID09PSAnX3NlbGYnKSkgfHwgKGVsdC50YWdOYW1lID09PSAnRk9STScgJiYgU3RyaW5nKGdldFJhd0F0dHJpYnV0ZShlbHQsICdtZXRob2QnKSkudG9Mb3dlckNhc2UoKSAhPT0gJ2RpYWxvZycpKSB7XG4gICAgICBub2RlRGF0YS5ib29zdGVkID0gdHJ1ZVxuICAgICAgbGV0IHZlcmIsIHBhdGhcbiAgICAgIGlmIChlbHQudGFnTmFtZSA9PT0gJ0EnKSB7XG4gICAgICAgIHZlcmIgPSAoLyoqIEB0eXBlIEh0dHBWZXJiICovKCdnZXQnKSlcbiAgICAgICAgcGF0aCA9IGdldFJhd0F0dHJpYnV0ZShlbHQsICdocmVmJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJhd0F0dHJpYnV0ZSA9IGdldFJhd0F0dHJpYnV0ZShlbHQsICdtZXRob2QnKVxuICAgICAgICB2ZXJiID0gKC8qKiBAdHlwZSBIdHRwVmVyYiAqLyhyYXdBdHRyaWJ1dGUgPyByYXdBdHRyaWJ1dGUudG9Mb3dlckNhc2UoKSA6ICdnZXQnKSlcbiAgICAgICAgcGF0aCA9IGdldFJhd0F0dHJpYnV0ZShlbHQsICdhY3Rpb24nKVxuICAgICAgICBpZiAocGF0aCA9PSBudWxsIHx8IHBhdGggPT09ICcnKSB7XG4gICAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gYWN0aW9uIGF0dHJpYnV0ZSBvbiB0aGUgZm9ybSBzZXQgcGF0aCB0byBjdXJyZW50IGhyZWYgYmVmb3JlIHRoZVxuICAgICAgICAgIC8vIGZvbGxvd2luZyBsb2dpYyB0byBwcm9wZXJseSBjbGVhciBwYXJhbWV0ZXJzIG9uIGEgR0VUIChub3Qgb24gYSBQT1NUISlcbiAgICAgICAgICBwYXRoID0gbG9jYXRpb24uaHJlZlxuICAgICAgICB9XG4gICAgICAgIGlmICh2ZXJiID09PSAnZ2V0JyAmJiBwYXRoLmluY2x1ZGVzKCc/JykpIHtcbiAgICAgICAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXD9bXiNdKy8sICcnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0cmlnZ2VyU3BlY3MuZm9yRWFjaChmdW5jdGlvbih0cmlnZ2VyU3BlYykge1xuICAgICAgICBhZGRFdmVudExpc3RlbmVyKGVsdCwgZnVuY3Rpb24obm9kZSwgZXZ0KSB7XG4gICAgICAgICAgY29uc3QgZWx0ID0gYXNFbGVtZW50KG5vZGUpXG4gICAgICAgICAgaWYgKGVsdElzRGlzYWJsZWQoZWx0KSkge1xuICAgICAgICAgICAgY2xlYW5VcEVsZW1lbnQoZWx0KVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGlzc3VlQWpheFJlcXVlc3QodmVyYiwgcGF0aCwgZWx0LCBldnQpXG4gICAgICAgIH0sIG5vZGVEYXRhLCB0cmlnZ2VyU3BlYywgdHJ1ZSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIHNob3VsZENhbmNlbChldnQsIGVsdCkge1xuICAgIGlmIChldnQudHlwZSA9PT0gJ3N1Ym1pdCcgJiYgZWx0LnRhZ05hbWUgPT09ICdGT1JNJykge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2UgaWYgKGV2dC50eXBlID09PSAnY2xpY2snKSB7XG4gICAgICAvLyBmaW5kIGJ1dHRvbiB3cmFwcGluZyB0aGUgdHJpZ2dlciBlbGVtZW50XG4gICAgICBjb25zdCBidG4gPSAvKiogQHR5cGUge0hUTUxCdXR0b25FbGVtZW50fEhUTUxJbnB1dEVsZW1lbnR8bnVsbH0gKi8gKGVsdC5jbG9zZXN0KCdpbnB1dFt0eXBlPVwic3VibWl0XCJdLCBidXR0b24nKSlcbiAgICAgIC8vIERvIG5vdCBjYW5jZWwgb24gYnV0dG9ucyB0aGF0IDEpIGRvbid0IGhhdmUgYSByZWxhdGVkIGZvcm0gb3IgMikgaGF2ZSBhIHR5cGUgYXR0cmlidXRlIG9mICdyZXNldCcvJ2J1dHRvbicuXG4gICAgICBpZiAoYnRuICYmIGJ0bi5mb3JtICYmIGJ0bi50eXBlID09PSAnc3VibWl0Jykge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICAvLyBmaW5kIGxpbmsgd3JhcHBpbmcgdGhlIHRyaWdnZXIgZWxlbWVudFxuICAgICAgY29uc3QgbGluayA9IGVsdC5jbG9zZXN0KCdhJylcbiAgICAgIC8vIEFsbG93IGxpbmtzIHdpdGggaHJlZj1cIiNmcmFnbWVudFwiIChhbmNob3JzIHdpdGggY29udGVudCBhZnRlciAjKSB0byBwZXJmb3JtIG5vcm1hbCBmcmFnbWVudCBuYXZpZ2F0aW9uLlxuICAgICAgLy8gQ2FuY2VsIGRlZmF1bHQgYWN0aW9uIGZvciBsaW5rcyB3aXRoIGhyZWY9XCIjXCIgKGJhcmUgaGFzaCkgdG8gcHJldmVudCBzY3JvbGxpbmcgdG8gdG9wIGFuZCB1bndhbnRlZCBVUkwgY2hhbmdlcy5cbiAgICAgIGNvbnN0IHNhbWVQYWdlQW5jaG9yID0gL14jLisvXG4gICAgICBpZiAobGluayAmJiBsaW5rLmhyZWYgJiYgIXNhbWVQYWdlQW5jaG9yLnRlc3QobGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOb2RlfSBlbHRcbiAgICogQHBhcmFtIHtFdmVudHxNb3VzZUV2ZW50fEtleWJvYXJkRXZlbnR8VG91Y2hFdmVudH0gZXZ0XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gaWdub3JlQm9vc3RlZEFuY2hvckN0cmxDbGljayhlbHQsIGV2dCkge1xuICAgIHJldHVybiBnZXRJbnRlcm5hbERhdGEoZWx0KS5ib29zdGVkICYmIGVsdCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50ICYmIGV2dC50eXBlID09PSAnY2xpY2snICYmXG4gICAgICAvLyBAdHMtaWdub3JlIHRoaXMgd2lsbCByZXNvbHZlIHRvIHVuZGVmaW5lZCBmb3IgZXZlbnRzIHRoYXQgZG9uJ3QgZGVmaW5lIHRob3NlIHByb3BlcnRpZXMsIHdoaWNoIGlzIGZpbmVcbiAgICAgIChldnQuY3RybEtleSB8fCBldnQubWV0YUtleSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0h0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbn0gdHJpZ2dlclNwZWNcbiAgICogQHBhcmFtIHtOb2RlfSBlbHRcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gbWF5YmVGaWx0ZXJFdmVudCh0cmlnZ2VyU3BlYywgZWx0LCBldnQpIHtcbiAgICBjb25zdCBldmVudEZpbHRlciA9IHRyaWdnZXJTcGVjLmV2ZW50RmlsdGVyXG4gICAgaWYgKGV2ZW50RmlsdGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gZXZlbnRGaWx0ZXIuY2FsbChlbHQsIGV2dCkgIT09IHRydWVcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gZXZlbnRGaWx0ZXIuc291cmNlXG4gICAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6ZXZlbnRGaWx0ZXI6ZXJyb3InLCB7IGVycm9yOiBlLCBzb3VyY2UgfSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtUcmlnZ2VySGFuZGxlcn0gaGFuZGxlclxuICAgKiBAcGFyYW0ge0h0bXhOb2RlSW50ZXJuYWxEYXRhfSBub2RlRGF0YVxuICAgKiBAcGFyYW0ge0h0bXhUcmlnZ2VyU3BlY2lmaWNhdGlvbn0gdHJpZ2dlclNwZWNcbiAgICogQHBhcmFtIHtib29sZWFufSBbZXhwbGljaXRDYW5jZWxdXG4gICAqL1xuICBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKGVsdCwgaGFuZGxlciwgbm9kZURhdGEsIHRyaWdnZXJTcGVjLCBleHBsaWNpdENhbmNlbCkge1xuICAgIGNvbnN0IGVsZW1lbnREYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGVsdClcbiAgICAvKiogQHR5cGUgeyhOb2RlfFdpbmRvdylbXX0gKi9cbiAgICBsZXQgZWx0c1RvTGlzdGVuT25cbiAgICBpZiAodHJpZ2dlclNwZWMuZnJvbSkge1xuICAgICAgZWx0c1RvTGlzdGVuT24gPSBxdWVyeVNlbGVjdG9yQWxsRXh0KGVsdCwgdHJpZ2dlclNwZWMuZnJvbSlcbiAgICB9IGVsc2Uge1xuICAgICAgZWx0c1RvTGlzdGVuT24gPSBbZWx0XVxuICAgIH1cbiAgICAvLyBzdG9yZSB0aGUgaW5pdGlhbCB2YWx1ZXMgb2YgdGhlIGVsZW1lbnRzLCBzbyB3ZSBjYW4gdGVsbCBpZiB0aGV5IGNoYW5nZVxuICAgIGlmICh0cmlnZ2VyU3BlYy5jaGFuZ2VkKSB7XG4gICAgICBpZiAoISgnbGFzdFZhbHVlJyBpbiBlbGVtZW50RGF0YSkpIHtcbiAgICAgICAgZWxlbWVudERhdGEubGFzdFZhbHVlID0gbmV3IFdlYWtNYXAoKVxuICAgICAgfVxuICAgICAgZWx0c1RvTGlzdGVuT24uZm9yRWFjaChmdW5jdGlvbihlbHRUb0xpc3Rlbk9uKSB7XG4gICAgICAgIGlmICghZWxlbWVudERhdGEubGFzdFZhbHVlLmhhcyh0cmlnZ2VyU3BlYykpIHtcbiAgICAgICAgICBlbGVtZW50RGF0YS5sYXN0VmFsdWUuc2V0KHRyaWdnZXJTcGVjLCBuZXcgV2Vha01hcCgpKVxuICAgICAgICB9XG4gICAgICAgIC8vIEB0cy1pZ25vcmUgdmFsdWUgd2lsbCBiZSB1bmRlZmluZWQgZm9yIG5vbi1pbnB1dCBlbGVtZW50cywgd2hpY2ggaXMgZmluZVxuICAgICAgICBlbGVtZW50RGF0YS5sYXN0VmFsdWUuZ2V0KHRyaWdnZXJTcGVjKS5zZXQoZWx0VG9MaXN0ZW5PbiwgZWx0VG9MaXN0ZW5Pbi52YWx1ZSlcbiAgICAgIH0pXG4gICAgfVxuICAgIGZvckVhY2goZWx0c1RvTGlzdGVuT24sIGZ1bmN0aW9uKGVsdFRvTGlzdGVuT24pIHtcbiAgICAgIC8qKiBAdHlwZSBFdmVudExpc3RlbmVyICovXG4gICAgICBjb25zdCBldmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIGlmICghYm9keUNvbnRhaW5zKGVsdCkpIHtcbiAgICAgICAgICBlbHRUb0xpc3Rlbk9uLnJlbW92ZUV2ZW50TGlzdGVuZXIodHJpZ2dlclNwZWMudHJpZ2dlciwgZXZlbnRMaXN0ZW5lcilcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoaWdub3JlQm9vc3RlZEFuY2hvckN0cmxDbGljayhlbHQsIGV2dCkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwbGljaXRDYW5jZWwgfHwgc2hvdWxkQ2FuY2VsKGV2dCwgZWx0VG9MaXN0ZW5PbikpIHtcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB9XG4gICAgICAgIGlmIChtYXliZUZpbHRlckV2ZW50KHRyaWdnZXJTcGVjLCBlbHQsIGV2dCkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBldmVudERhdGEgPSBnZXRJbnRlcm5hbERhdGEoZXZ0KVxuICAgICAgICBldmVudERhdGEudHJpZ2dlclNwZWMgPSB0cmlnZ2VyU3BlY1xuICAgICAgICBpZiAoZXZlbnREYXRhLmhhbmRsZWRGb3IgPT0gbnVsbCkge1xuICAgICAgICAgIGV2ZW50RGF0YS5oYW5kbGVkRm9yID0gW11cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnREYXRhLmhhbmRsZWRGb3IuaW5kZXhPZihlbHQpIDwgMCkge1xuICAgICAgICAgIGV2ZW50RGF0YS5oYW5kbGVkRm9yLnB1c2goZWx0KVxuICAgICAgICAgIGlmICh0cmlnZ2VyU3BlYy5jb25zdW1lKSB7XG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRyaWdnZXJTcGVjLnRhcmdldCAmJiBldnQudGFyZ2V0KSB7XG4gICAgICAgICAgICBpZiAoIW1hdGNoZXMoYXNFbGVtZW50KGV2dC50YXJnZXQpLCB0cmlnZ2VyU3BlYy50YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHJpZ2dlclNwZWMub25jZSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnREYXRhLnRyaWdnZXJlZE9uY2UpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbGVtZW50RGF0YS50cmlnZ2VyZWRPbmNlID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHJpZ2dlclNwZWMuY2hhbmdlZCkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGV2dC50YXJnZXRcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdmFsdWUgd2lsbCBiZSB1bmRlZmluZWQgZm9yIG5vbi1pbnB1dCBlbGVtZW50cywgd2hpY2ggaXMgZmluZVxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBub2RlLnZhbHVlXG4gICAgICAgICAgICBjb25zdCBsYXN0VmFsdWUgPSBlbGVtZW50RGF0YS5sYXN0VmFsdWUuZ2V0KHRyaWdnZXJTcGVjKVxuICAgICAgICAgICAgaWYgKGxhc3RWYWx1ZS5oYXMobm9kZSkgJiYgbGFzdFZhbHVlLmdldChub2RlKSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0VmFsdWUuc2V0KG5vZGUsIHZhbHVlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZWxlbWVudERhdGEuZGVsYXllZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGVsZW1lbnREYXRhLmRlbGF5ZWQpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlbGVtZW50RGF0YS50aHJvdHRsZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRyaWdnZXJTcGVjLnRocm90dGxlID4gMCkge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50RGF0YS50aHJvdHRsZSkge1xuICAgICAgICAgICAgICB0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDp0cmlnZ2VyJylcbiAgICAgICAgICAgICAgaGFuZGxlcihlbHQsIGV2dClcbiAgICAgICAgICAgICAgZWxlbWVudERhdGEudGhyb3R0bGUgPSBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnREYXRhLnRocm90dGxlID0gbnVsbFxuICAgICAgICAgICAgICB9LCB0cmlnZ2VyU3BlYy50aHJvdHRsZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHRyaWdnZXJTcGVjLmRlbGF5ID4gMCkge1xuICAgICAgICAgICAgZWxlbWVudERhdGEuZGVsYXllZCA9IGdldFdpbmRvdygpLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OnRyaWdnZXInKVxuICAgICAgICAgICAgICBoYW5kbGVyKGVsdCwgZXZ0KVxuICAgICAgICAgICAgfSwgdHJpZ2dlclNwZWMuZGVsYXkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OnRyaWdnZXInKVxuICAgICAgICAgICAgaGFuZGxlcihlbHQsIGV2dClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChub2RlRGF0YS5saXN0ZW5lckluZm9zID09IG51bGwpIHtcbiAgICAgICAgbm9kZURhdGEubGlzdGVuZXJJbmZvcyA9IFtdXG4gICAgICB9XG4gICAgICBub2RlRGF0YS5saXN0ZW5lckluZm9zLnB1c2goe1xuICAgICAgICB0cmlnZ2VyOiB0cmlnZ2VyU3BlYy50cmlnZ2VyLFxuICAgICAgICBsaXN0ZW5lcjogZXZlbnRMaXN0ZW5lcixcbiAgICAgICAgb246IGVsdFRvTGlzdGVuT25cbiAgICAgIH0pXG4gICAgICBlbHRUb0xpc3Rlbk9uLmFkZEV2ZW50TGlzdGVuZXIodHJpZ2dlclNwZWMudHJpZ2dlciwgZXZlbnRMaXN0ZW5lcilcbiAgICB9KVxuICB9XG5cbiAgbGV0IHdpbmRvd0lzU2Nyb2xsaW5nID0gZmFsc2UgLy8gdXNlZCBieSBpbml0U2Nyb2xsSGFuZGxlclxuICBsZXQgc2Nyb2xsSGFuZGxlciA9IG51bGxcbiAgZnVuY3Rpb24gaW5pdFNjcm9sbEhhbmRsZXIoKSB7XG4gICAgaWYgKCFzY3JvbGxIYW5kbGVyKSB7XG4gICAgICBzY3JvbGxIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvd0lzU2Nyb2xsaW5nID0gdHJ1ZVxuICAgICAgfVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIpXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgc2Nyb2xsSGFuZGxlcilcbiAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAod2luZG93SXNTY3JvbGxpbmcpIHtcbiAgICAgICAgICB3aW5kb3dJc1Njcm9sbGluZyA9IGZhbHNlXG4gICAgICAgICAgZm9yRWFjaChnZXREb2N1bWVudCgpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbaHgtdHJpZ2dlcio9J3JldmVhbGVkJ10sW2RhdGEtaHgtdHJpZ2dlcio9J3JldmVhbGVkJ11cIiksIGZ1bmN0aW9uKGVsdCkge1xuICAgICAgICAgICAgbWF5YmVSZXZlYWwoZWx0KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sIDIwMClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICovXG4gIGZ1bmN0aW9uIG1heWJlUmV2ZWFsKGVsdCkge1xuICAgIGlmICghaGFzQXR0cmlidXRlKGVsdCwgJ2RhdGEtaHgtcmV2ZWFsZWQnKSAmJiBpc1Njcm9sbGVkSW50b1ZpZXcoZWx0KSkge1xuICAgICAgZWx0LnNldEF0dHJpYnV0ZSgnZGF0YS1oeC1yZXZlYWxlZCcsICd0cnVlJylcbiAgICAgIGNvbnN0IG5vZGVEYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGVsdClcbiAgICAgIGlmIChub2RlRGF0YS5pbml0SGFzaCkge1xuICAgICAgICB0cmlnZ2VyRXZlbnQoZWx0LCAncmV2ZWFsZWQnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgdGhlIG5vZGUgaXNuJ3QgaW5pdGlhbGl6ZWQsIHdhaXQgZm9yIGl0IGJlZm9yZSB0cmlnZ2VyaW5nIHRoZSByZXF1ZXN0XG4gICAgICAgIGVsdC5hZGRFdmVudExpc3RlbmVyKCdodG14OmFmdGVyUHJvY2Vzc05vZGUnLCBmdW5jdGlvbigpIHsgdHJpZ2dlckV2ZW50KGVsdCwgJ3JldmVhbGVkJykgfSwgeyBvbmNlOiB0cnVlIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtUcmlnZ2VySGFuZGxlcn0gaGFuZGxlclxuICAgKiBAcGFyYW0ge0h0bXhOb2RlSW50ZXJuYWxEYXRhfSBub2RlRGF0YVxuICAgKiBAcGFyYW0ge251bWJlcn0gZGVsYXlcbiAgICovXG4gIGZ1bmN0aW9uIGxvYWRJbW1lZGlhdGVseShlbHQsIGhhbmRsZXIsIG5vZGVEYXRhLCBkZWxheSkge1xuICAgIGNvbnN0IGxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghbm9kZURhdGEubG9hZGVkKSB7XG4gICAgICAgIG5vZGVEYXRhLmxvYWRlZCA9IHRydWVcbiAgICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6dHJpZ2dlcicpXG4gICAgICAgIGhhbmRsZXIoZWx0KVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGxvYWQsIGRlbGF5KVxuICAgIH0gZWxzZSB7XG4gICAgICBsb2FkKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtIdG14Tm9kZUludGVybmFsRGF0YX0gbm9kZURhdGFcbiAgICogQHBhcmFtIHtIdG14VHJpZ2dlclNwZWNpZmljYXRpb25bXX0gdHJpZ2dlclNwZWNzXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gcHJvY2Vzc1ZlcmJzKGVsdCwgbm9kZURhdGEsIHRyaWdnZXJTcGVjcykge1xuICAgIGxldCBleHBsaWNpdEFjdGlvbiA9IGZhbHNlXG4gICAgZm9yRWFjaChWRVJCUywgZnVuY3Rpb24odmVyYikge1xuICAgICAgaWYgKGhhc0F0dHJpYnV0ZShlbHQsICdoeC0nICsgdmVyYikpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IGdldEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LScgKyB2ZXJiKVxuICAgICAgICBleHBsaWNpdEFjdGlvbiA9IHRydWVcbiAgICAgICAgbm9kZURhdGEucGF0aCA9IHBhdGhcbiAgICAgICAgbm9kZURhdGEudmVyYiA9IHZlcmJcbiAgICAgICAgdHJpZ2dlclNwZWNzLmZvckVhY2goZnVuY3Rpb24odHJpZ2dlclNwZWMpIHtcbiAgICAgICAgICBhZGRUcmlnZ2VySGFuZGxlcihlbHQsIHRyaWdnZXJTcGVjLCBub2RlRGF0YSwgZnVuY3Rpb24obm9kZSwgZXZ0KSB7XG4gICAgICAgICAgICBjb25zdCBlbHQgPSBhc0VsZW1lbnQobm9kZSlcbiAgICAgICAgICAgIGlmIChlbHRJc0Rpc2FibGVkKGVsdCkpIHtcbiAgICAgICAgICAgICAgY2xlYW5VcEVsZW1lbnQoZWx0KVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzc3VlQWpheFJlcXVlc3QodmVyYiwgcGF0aCwgZWx0LCBldnQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBleHBsaWNpdEFjdGlvblxuICB9XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBUcmlnZ2VySGFuZGxlclxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcGFyYW0ge0V2ZW50fSBbZXZ0XVxuICAgKi9cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtIdG14VHJpZ2dlclNwZWNpZmljYXRpb259IHRyaWdnZXJTcGVjXG4gICAqIEBwYXJhbSB7SHRteE5vZGVJbnRlcm5hbERhdGF9IG5vZGVEYXRhXG4gICAqIEBwYXJhbSB7VHJpZ2dlckhhbmRsZXJ9IGhhbmRsZXJcbiAgICovXG4gIGZ1bmN0aW9uIGFkZFRyaWdnZXJIYW5kbGVyKGVsdCwgdHJpZ2dlclNwZWMsIG5vZGVEYXRhLCBoYW5kbGVyKSB7XG4gICAgaWYgKHRyaWdnZXJTcGVjLnRyaWdnZXIgPT09ICdyZXZlYWxlZCcpIHtcbiAgICAgIGluaXRTY3JvbGxIYW5kbGVyKClcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZWx0LCBoYW5kbGVyLCBub2RlRGF0YSwgdHJpZ2dlclNwZWMpXG4gICAgICBtYXliZVJldmVhbChhc0VsZW1lbnQoZWx0KSlcbiAgICB9IGVsc2UgaWYgKHRyaWdnZXJTcGVjLnRyaWdnZXIgPT09ICdpbnRlcnNlY3QnKSB7XG4gICAgICBjb25zdCBvYnNlcnZlck9wdGlvbnMgPSB7fVxuICAgICAgaWYgKHRyaWdnZXJTcGVjLnJvb3QpIHtcbiAgICAgICAgb2JzZXJ2ZXJPcHRpb25zLnJvb3QgPSBxdWVyeVNlbGVjdG9yRXh0KGVsdCwgdHJpZ2dlclNwZWMucm9vdClcbiAgICAgIH1cbiAgICAgIGlmICh0cmlnZ2VyU3BlYy50aHJlc2hvbGQpIHtcbiAgICAgICAgb2JzZXJ2ZXJPcHRpb25zLnRocmVzaG9sZCA9IHBhcnNlRmxvYXQodHJpZ2dlclNwZWMudGhyZXNob2xkKVxuICAgICAgfVxuICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24oZW50cmllcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IGVudHJpZXNbaV1cbiAgICAgICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgICAgIHRyaWdnZXJFdmVudChlbHQsICdpbnRlcnNlY3QnKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIG9ic2VydmVyT3B0aW9ucylcbiAgICAgIG9ic2VydmVyLm9ic2VydmUoYXNFbGVtZW50KGVsdCkpXG4gICAgICBhZGRFdmVudExpc3RlbmVyKGFzRWxlbWVudChlbHQpLCBoYW5kbGVyLCBub2RlRGF0YSwgdHJpZ2dlclNwZWMpXG4gICAgfSBlbHNlIGlmICghbm9kZURhdGEuZmlyc3RJbml0Q29tcGxldGVkICYmIHRyaWdnZXJTcGVjLnRyaWdnZXIgPT09ICdsb2FkJykge1xuICAgICAgaWYgKCFtYXliZUZpbHRlckV2ZW50KHRyaWdnZXJTcGVjLCBlbHQsIG1ha2VFdmVudCgnbG9hZCcsIHsgZWx0IH0pKSkge1xuICAgICAgICBsb2FkSW1tZWRpYXRlbHkoYXNFbGVtZW50KGVsdCksIGhhbmRsZXIsIG5vZGVEYXRhLCB0cmlnZ2VyU3BlYy5kZWxheSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRyaWdnZXJTcGVjLnBvbGxJbnRlcnZhbCA+IDApIHtcbiAgICAgIG5vZGVEYXRhLnBvbGxpbmcgPSB0cnVlXG4gICAgICBwcm9jZXNzUG9sbGluZyhhc0VsZW1lbnQoZWx0KSwgaGFuZGxlciwgdHJpZ2dlclNwZWMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZEV2ZW50TGlzdGVuZXIoZWx0LCBoYW5kbGVyLCBub2RlRGF0YSwgdHJpZ2dlclNwZWMpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIHNob3VsZFByb2Nlc3NIeE9uKG5vZGUpIHtcbiAgICBjb25zdCBlbHQgPSBhc0VsZW1lbnQobm9kZSlcbiAgICBpZiAoIWVsdCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbHQuYXR0cmlidXRlc1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYXR0cmlidXRlcy5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgYXR0ck5hbWUgPSBhdHRyaWJ1dGVzW2pdLm5hbWVcbiAgICAgIGlmIChzdGFydHNXaXRoKGF0dHJOYW1lLCAnaHgtb246JykgfHwgc3RhcnRzV2l0aChhdHRyTmFtZSwgJ2RhdGEtaHgtb246JykgfHxcbiAgICAgICAgc3RhcnRzV2l0aChhdHRyTmFtZSwgJ2h4LW9uLScpIHx8IHN0YXJ0c1dpdGgoYXR0ck5hbWUsICdkYXRhLWh4LW9uLScpKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gZWx0XG4gICAqIEByZXR1cm5zIHtFbGVtZW50W119XG4gICAqL1xuICBjb25zdCBIWF9PTl9RVUVSWSA9IG5ldyBYUGF0aEV2YWx1YXRvcigpXG4gICAgLmNyZWF0ZUV4cHJlc3Npb24oJy4vLypbQCpbIHN0YXJ0cy13aXRoKG5hbWUoKSwgXCJoeC1vbjpcIikgb3Igc3RhcnRzLXdpdGgobmFtZSgpLCBcImRhdGEtaHgtb246XCIpIG9yJyArXG4gICAgICAnIHN0YXJ0cy13aXRoKG5hbWUoKSwgXCJoeC1vbi1cIikgb3Igc3RhcnRzLXdpdGgobmFtZSgpLCBcImRhdGEtaHgtb24tXCIpIF1dJylcblxuICBmdW5jdGlvbiBwcm9jZXNzSFhPblJvb3QoZWx0LCBlbGVtZW50cykge1xuICAgIGlmIChzaG91bGRQcm9jZXNzSHhPbihlbHQpKSB7XG4gICAgICBlbGVtZW50cy5wdXNoKGFzRWxlbWVudChlbHQpKVxuICAgIH1cbiAgICBjb25zdCBpdGVyID0gSFhfT05fUVVFUlkuZXZhbHVhdGUoZWx0KVxuICAgIGxldCBub2RlID0gbnVsbFxuICAgIHdoaWxlIChub2RlID0gaXRlci5pdGVyYXRlTmV4dCgpKSBlbGVtZW50cy5wdXNoKGFzRWxlbWVudChub2RlKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmRIeE9uV2lsZGNhcmRFbGVtZW50cyhlbHQpIHtcbiAgICAvKiogQHR5cGUge0VsZW1lbnRbXX0gKi9cbiAgICBjb25zdCBlbGVtZW50cyA9IFtdXG4gICAgaWYgKGVsdCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZWx0LmNoaWxkTm9kZXMpIHtcbiAgICAgICAgcHJvY2Vzc0hYT25Sb290KGNoaWxkLCBlbGVtZW50cylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcHJvY2Vzc0hYT25Sb290KGVsdCwgZWxlbWVudHMpXG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50c1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm5zIHtOb2RlTGlzdE9mPEVsZW1lbnQ+fFtdfVxuICAgKi9cbiAgZnVuY3Rpb24gZmluZEVsZW1lbnRzVG9Qcm9jZXNzKGVsdCkge1xuICAgIGlmIChlbHQucXVlcnlTZWxlY3RvckFsbCkge1xuICAgICAgY29uc3QgYm9vc3RlZFNlbGVjdG9yID0gJywgW2h4LWJvb3N0XSBhLCBbZGF0YS1oeC1ib29zdF0gYSwgYVtoeC1ib29zdF0sIGFbZGF0YS1oeC1ib29zdF0nXG5cbiAgICAgIGNvbnN0IGV4dGVuc2lvblNlbGVjdG9ycyA9IFtdXG4gICAgICBmb3IgKGNvbnN0IGUgaW4gZXh0ZW5zaW9ucykge1xuICAgICAgICBjb25zdCBleHRlbnNpb24gPSBleHRlbnNpb25zW2VdXG4gICAgICAgIGlmIChleHRlbnNpb24uZ2V0U2VsZWN0b3JzKSB7XG4gICAgICAgICAgdmFyIHNlbGVjdG9ycyA9IGV4dGVuc2lvbi5nZXRTZWxlY3RvcnMoKVxuICAgICAgICAgIGlmIChzZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGV4dGVuc2lvblNlbGVjdG9ycy5wdXNoKHNlbGVjdG9ycylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0cyA9IGVsdC5xdWVyeVNlbGVjdG9yQWxsKFZFUkJfU0VMRUNUT1IgKyBib29zdGVkU2VsZWN0b3IgKyBcIiwgZm9ybSwgW3R5cGU9J3N1Ym1pdCddLFwiICtcbiAgICAgICAgJyBbaHgtZXh0XSwgW2RhdGEtaHgtZXh0XSwgW2h4LXRyaWdnZXJdLCBbZGF0YS1oeC10cmlnZ2VyXScgKyBleHRlbnNpb25TZWxlY3RvcnMuZmxhdCgpLm1hcChzID0+ICcsICcgKyBzKS5qb2luKCcnKSlcblxuICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBzdWJtaXQgYnV0dG9ucy9pbnB1dHMgdGhhdCBoYXZlIHRoZSBmb3JtIGF0dHJpYnV0ZSBzZXRcbiAgICogc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0hUTUwvRWxlbWVudC9idXR0b25cbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XG4gICAqL1xuICBmdW5jdGlvbiBtYXliZVNldExhc3RCdXR0b25DbGlja2VkKGV2dCkge1xuICAgIGNvbnN0IGVsdCA9IGdldFRhcmdldEJ1dHRvbihldnQudGFyZ2V0KVxuICAgIGNvbnN0IGludGVybmFsRGF0YSA9IGdldFJlbGF0ZWRGb3JtRGF0YShldnQpXG4gICAgaWYgKGludGVybmFsRGF0YSkge1xuICAgICAgaW50ZXJuYWxEYXRhLmxhc3RCdXR0b25DbGlja2VkID0gZWx0XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxuICAgKi9cbiAgZnVuY3Rpb24gbWF5YmVVbnNldExhc3RCdXR0b25DbGlja2VkKGV2dCkge1xuICAgIGNvbnN0IGludGVybmFsRGF0YSA9IGdldFJlbGF0ZWRGb3JtRGF0YShldnQpXG4gICAgaWYgKGludGVybmFsRGF0YSkge1xuICAgICAgaW50ZXJuYWxEYXRhLmxhc3RCdXR0b25DbGlja2VkID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRcbiAgICogQHJldHVybnMge0hUTUxCdXR0b25FbGVtZW50fEhUTUxJbnB1dEVsZW1lbnR8bnVsbH1cbiAgICovXG4gIGZ1bmN0aW9uIGdldFRhcmdldEJ1dHRvbih0YXJnZXQpIHtcbiAgICByZXR1cm4gLyoqIEB0eXBlIHtIVE1MQnV0dG9uRWxlbWVudHxIVE1MSW5wdXRFbGVtZW50fG51bGx9ICovIChjbG9zZXN0KGFzRWxlbWVudCh0YXJnZXQpLCBcImJ1dHRvbiwgaW5wdXRbdHlwZT0nc3VibWl0J11cIikpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHJldHVybnMge0hUTUxGb3JtRWxlbWVudHxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0UmVsYXRlZEZvcm0oZWx0KSB7XG4gICAgLy8gQHRzLWlnbm9yZSBHZXQgdGhlIHJlbGF0ZWQgZm9ybSBpZiBhdmFpbGFibGUsIGVsc2UgZmluZCB0aGUgY2xvc2VzdCBwYXJlbnQgZm9ybVxuICAgIHJldHVybiBlbHQuZm9ybSB8fCBjbG9zZXN0KGVsdCwgJ2Zvcm0nKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxuICAgKiBAcmV0dXJucyB7SHRteE5vZGVJbnRlcm5hbERhdGF8dW5kZWZpbmVkfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0UmVsYXRlZEZvcm1EYXRhKGV2dCkge1xuICAgIGNvbnN0IGVsdCA9IGdldFRhcmdldEJ1dHRvbihldnQudGFyZ2V0KVxuICAgIGlmICghZWx0KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgZm9ybSA9IGdldFJlbGF0ZWRGb3JtKGVsdClcbiAgICBpZiAoIWZvcm0pIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICByZXR1cm4gZ2V0SW50ZXJuYWxEYXRhKGZvcm0pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldH0gZWx0XG4gICAqL1xuICBmdW5jdGlvbiBpbml0QnV0dG9uVHJhY2tpbmcoZWx0KSB7XG4gICAgLy8gbmVlZCB0byBoYW5kbGUgYm90aCBjbGljayBhbmQgZm9jdXMgaW46XG4gICAgLy8gICBmb2N1c2luIC0gaW4gY2FzZSBzb21lb25lIHRhYnMgaW4gdG8gYSBidXR0b24gYW5kIGhpdHMgdGhlIHNwYWNlIGJhclxuICAgIC8vICAgY2xpY2sgLSBvbiBPU1ggYnV0dG9ucyBkbyBub3QgZm9jdXMgb24gY2xpY2sgc2VlIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMzcyNFxuICAgIGVsdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG1heWJlU2V0TGFzdEJ1dHRvbkNsaWNrZWQpXG4gICAgZWx0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCBtYXliZVNldExhc3RCdXR0b25DbGlja2VkKVxuICAgIGVsdC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIG1heWJlVW5zZXRMYXN0QnV0dG9uQ2xpY2tlZClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlXG4gICAqL1xuICBmdW5jdGlvbiBhZGRIeE9uRXZlbnRIYW5kbGVyKGVsdCwgZXZlbnROYW1lLCBjb2RlKSB7XG4gICAgY29uc3Qgbm9kZURhdGEgPSBnZXRJbnRlcm5hbERhdGEoZWx0KVxuICAgIGlmICghQXJyYXkuaXNBcnJheShub2RlRGF0YS5vbkhhbmRsZXJzKSkge1xuICAgICAgbm9kZURhdGEub25IYW5kbGVycyA9IFtdXG4gICAgfVxuICAgIGxldCBmdW5jXG4gICAgLyoqIEB0eXBlIEV2ZW50TGlzdGVuZXIgKi9cbiAgICBjb25zdCBsaXN0ZW5lciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIG1heWJlRXZhbChlbHQsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZWx0SXNEaXNhYmxlZChlbHQpKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFmdW5jKSB7XG4gICAgICAgICAgZnVuYyA9IG5ldyBGdW5jdGlvbignZXZlbnQnLCBjb2RlKVxuICAgICAgICB9XG4gICAgICAgIGZ1bmMuY2FsbChlbHQsIGUpXG4gICAgICB9KVxuICAgIH1cbiAgICBlbHQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyKVxuICAgIG5vZGVEYXRhLm9uSGFuZGxlcnMucHVzaCh7IGV2ZW50OiBldmVudE5hbWUsIGxpc3RlbmVyIH0pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICovXG4gIGZ1bmN0aW9uIHByb2Nlc3NIeE9uV2lsZGNhcmQoZWx0KSB7XG4gICAgLy8gd2lwZSBhbnkgcHJldmlvdXMgb24gaGFuZGxlcnMgc28gdGhhdCB0aGlzIGZ1bmN0aW9uIHRha2VzIHByZWNlZGVuY2VcbiAgICBkZUluaXRPbkhhbmRsZXJzKGVsdClcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWx0LmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBlbHQuYXR0cmlidXRlc1tpXS5uYW1lXG4gICAgICBjb25zdCB2YWx1ZSA9IGVsdC5hdHRyaWJ1dGVzW2ldLnZhbHVlXG4gICAgICBpZiAoc3RhcnRzV2l0aChuYW1lLCAnaHgtb24nKSB8fCBzdGFydHNXaXRoKG5hbWUsICdkYXRhLWh4LW9uJykpIHtcbiAgICAgICAgY29uc3QgYWZ0ZXJPblBvc2l0aW9uID0gbmFtZS5pbmRleE9mKCctb24nKSArIDNcbiAgICAgICAgY29uc3QgbmV4dENoYXIgPSBuYW1lLnNsaWNlKGFmdGVyT25Qb3NpdGlvbiwgYWZ0ZXJPblBvc2l0aW9uICsgMSlcbiAgICAgICAgaWYgKG5leHRDaGFyID09PSAnLScgfHwgbmV4dENoYXIgPT09ICc6Jykge1xuICAgICAgICAgIGxldCBldmVudE5hbWUgPSBuYW1lLnNsaWNlKGFmdGVyT25Qb3NpdGlvbiArIDEpXG4gICAgICAgICAgLy8gaWYgdGhlIGV2ZW50TmFtZSBzdGFydHMgd2l0aCBhIGNvbG9uIG9yIGRhc2gsIHByZXBlbmQgXCJodG14XCIgZm9yIHNob3J0aGFuZCBzdXBwb3J0XG4gICAgICAgICAgaWYgKHN0YXJ0c1dpdGgoZXZlbnROYW1lLCAnOicpKSB7XG4gICAgICAgICAgICBldmVudE5hbWUgPSAnaHRteCcgKyBldmVudE5hbWVcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0c1dpdGgoZXZlbnROYW1lLCAnLScpKSB7XG4gICAgICAgICAgICBldmVudE5hbWUgPSAnaHRteDonICsgZXZlbnROYW1lLnNsaWNlKDEpXG4gICAgICAgICAgfSBlbHNlIGlmIChzdGFydHNXaXRoKGV2ZW50TmFtZSwgJ2h0bXgtJykpIHtcbiAgICAgICAgICAgIGV2ZW50TmFtZSA9ICdodG14OicgKyBldmVudE5hbWUuc2xpY2UoNSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhZGRIeE9uRXZlbnRIYW5kbGVyKGVsdCwgZXZlbnROYW1lLCB2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR8SFRNTElucHV0RWxlbWVudH0gZWx0XG4gICAqL1xuICBmdW5jdGlvbiBpbml0Tm9kZShlbHQpIHtcbiAgICB0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDpiZWZvcmVQcm9jZXNzTm9kZScpXG5cbiAgICBjb25zdCBub2RlRGF0YSA9IGdldEludGVybmFsRGF0YShlbHQpXG4gICAgY29uc3QgdHJpZ2dlclNwZWNzID0gZ2V0VHJpZ2dlclNwZWNzKGVsdClcbiAgICBjb25zdCBoYXNFeHBsaWNpdEh0dHBBY3Rpb24gPSBwcm9jZXNzVmVyYnMoZWx0LCBub2RlRGF0YSwgdHJpZ2dlclNwZWNzKVxuXG4gICAgaWYgKCFoYXNFeHBsaWNpdEh0dHBBY3Rpb24pIHtcbiAgICAgIGlmIChnZXRDbG9zZXN0QXR0cmlidXRlVmFsdWUoZWx0LCAnaHgtYm9vc3QnKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIGJvb3N0RWxlbWVudChlbHQsIG5vZGVEYXRhLCB0cmlnZ2VyU3BlY3MpXG4gICAgICB9IGVsc2UgaWYgKGhhc0F0dHJpYnV0ZShlbHQsICdoeC10cmlnZ2VyJykpIHtcbiAgICAgICAgdHJpZ2dlclNwZWNzLmZvckVhY2goZnVuY3Rpb24odHJpZ2dlclNwZWMpIHtcbiAgICAgICAgICAvLyBGb3IgXCJuYWtlZFwiIHRyaWdnZXJzLCBkb24ndCBkbyBhbnl0aGluZyBhdCBhbGxcbiAgICAgICAgICBhZGRUcmlnZ2VySGFuZGxlcihlbHQsIHRyaWdnZXJTcGVjLCBub2RlRGF0YSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgc3VibWl0IGJ1dHRvbnMvaW5wdXRzIHRoYXQgaGF2ZSB0aGUgZm9ybSBhdHRyaWJ1dGUgc2V0XG4gICAgLy8gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0hUTUwvRWxlbWVudC9idXR0b25cbiAgICBpZiAoZWx0LnRhZ05hbWUgPT09ICdGT1JNJyB8fCAoZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ3R5cGUnKSA9PT0gJ3N1Ym1pdCcgJiYgaGFzQXR0cmlidXRlKGVsdCwgJ2Zvcm0nKSkpIHtcbiAgICAgIGluaXRCdXR0b25UcmFja2luZyhlbHQpXG4gICAgfVxuXG4gICAgbm9kZURhdGEuZmlyc3RJbml0Q29tcGxldGVkID0gdHJ1ZVxuICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OmFmdGVyUHJvY2Vzc05vZGUnKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gbWF5YmVEZUluaXRBbmRIYXNoKGVsdCkge1xuICAgIC8vIEVuc3VyZSBvbmx5IHZhbGlkIEVsZW1lbnRzIGFuZCBub3Qgc2hhZG93IERPTSByb290cyBhcmUgaW5pdGVkXG4gICAgaWYgKCEoZWx0IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IG5vZGVEYXRhID0gZ2V0SW50ZXJuYWxEYXRhKGVsdClcbiAgICBjb25zdCBoYXNoID0gYXR0cmlidXRlSGFzaChlbHQpXG4gICAgaWYgKG5vZGVEYXRhLmluaXRIYXNoICE9PSBoYXNoKSB7XG4gICAgICBkZUluaXROb2RlKGVsdClcbiAgICAgIG5vZGVEYXRhLmluaXRIYXNoID0gaGFzaFxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogUHJvY2Vzc2VzIG5ldyBjb250ZW50LCBlbmFibGluZyBodG14IGJlaGF2aW9yLiBUaGlzIGNhbiBiZSB1c2VmdWwgaWYgeW91IGhhdmUgY29udGVudCB0aGF0IGlzIGFkZGVkIHRvIHRoZSBET00gb3V0c2lkZSBvZiB0aGUgbm9ybWFsIGh0bXggcmVxdWVzdCBjeWNsZSBidXQgc3RpbGwgd2FudCBodG14IGF0dHJpYnV0ZXMgdG8gd29yay5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jcHJvY2Vzc1xuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR8c3RyaW5nfSBlbHQgZWxlbWVudCB0byBwcm9jZXNzXG4gICAqL1xuICBmdW5jdGlvbiBwcm9jZXNzTm9kZShlbHQpIHtcbiAgICBlbHQgPSByZXNvbHZlVGFyZ2V0KGVsdClcbiAgICBpZiAoZWx0SXNEaXNhYmxlZChlbHQpKSB7XG4gICAgICBjbGVhblVwRWxlbWVudChlbHQpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50c1RvSW5pdCA9IFtdXG4gICAgaWYgKG1heWJlRGVJbml0QW5kSGFzaChlbHQpKSB7XG4gICAgICBlbGVtZW50c1RvSW5pdC5wdXNoKGVsdClcbiAgICB9XG4gICAgZm9yRWFjaChmaW5kRWxlbWVudHNUb1Byb2Nlc3MoZWx0KSwgZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmIChlbHRJc0Rpc2FibGVkKGNoaWxkKSkge1xuICAgICAgICBjbGVhblVwRWxlbWVudChjaGlsZClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAobWF5YmVEZUluaXRBbmRIYXNoKGNoaWxkKSkge1xuICAgICAgICBlbGVtZW50c1RvSW5pdC5wdXNoKGNoaWxkKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBmb3JFYWNoKGZpbmRIeE9uV2lsZGNhcmRFbGVtZW50cyhlbHQpLCBwcm9jZXNzSHhPbldpbGRjYXJkKVxuICAgIGZvckVhY2goZWxlbWVudHNUb0luaXQsIGluaXROb2RlKVxuICB9XG5cbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRXZlbnQvTG9nIFN1cHBvcnRcbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24ga2ViYWJFdmVudE5hbWUoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW2EtejAtOV0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICAgKiBAcGFyYW0ge2FueX0gZGV0YWlsXG4gICAqIEByZXR1cm5zIHtDdXN0b21FdmVudH1cbiAgICovXG4gIGZ1bmN0aW9uIG1ha2VFdmVudChldmVudE5hbWUsIGRldGFpbCkge1xuICAgIC8vIFRPRE86IGBjb21wb3NlZDogdHJ1ZWAgaGVyZSBpcyBhIGhhY2sgdG8gbWFrZSBnbG9iYWwgZXZlbnQgaGFuZGxlcnMgd29yayB3aXRoIGV2ZW50cyBpbiBzaGFkb3cgRE9NXG4gICAgLy8gVGhpcyBicmVha3MgZXhwZWN0ZWQgZW5jYXBzdWxhdGlvbiBidXQgbmVlZHMgdG8gYmUgaGVyZSB1bnRpbCBkZWNpZGVkIG90aGVyd2lzZSBieSBjb3JlIGRldnNcbiAgICByZXR1cm4gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgeyBidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiB0cnVlLCBjb21wb3NlZDogdHJ1ZSwgZGV0YWlsIH0pXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFdmVudFRhcmdldHxzdHJpbmd9IGVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gICAqIEBwYXJhbSB7YW55PX0gZGV0YWlsXG4gICAqL1xuICBmdW5jdGlvbiB0cmlnZ2VyRXJyb3JFdmVudChlbHQsIGV2ZW50TmFtZSwgZGV0YWlsKSB7XG4gICAgdHJpZ2dlckV2ZW50KGVsdCwgZXZlbnROYW1lLCBtZXJnZU9iamVjdHMoeyBlcnJvcjogZXZlbnROYW1lIH0sIGRldGFpbCkpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIGlnbm9yZUV2ZW50Rm9yTG9nZ2luZyhldmVudE5hbWUpIHtcbiAgICByZXR1cm4gZXZlbnROYW1lID09PSAnaHRteDphZnRlclByb2Nlc3NOb2RlJ1xuICB9XG5cbiAgLyoqXG4gICAqIGB3aXRoRXh0ZW5zaW9uc2AgbG9jYXRlcyBhbGwgYWN0aXZlIGV4dGVuc2lvbnMgZm9yIGEgcHJvdmlkZWQgZWxlbWVudCwgdGhlblxuICAgKiBleGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gdXNpbmcgZWFjaCBvZiB0aGUgYWN0aXZlIGV4dGVuc2lvbnMuIFlvdSBjYW4gZmlsdGVyXG4gICAqIHRoZSBlbGVtZW50J3MgZXh0ZW5zaW9ucyBieSBnaXZpbmcgaXQgYSBsaXN0IG9mIGV4dGVuc2lvbnMgdG8gaWdub3JlLiBJdCBzaG91bGRcbiAgICogYmUgY2FsbGVkIGludGVybmFsbHkgYXQgZXZlcnkgZXh0ZW5kYWJsZSBleGVjdXRpb24gcG9pbnQgaW4gaHRteC5cbiAgICpcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHsoZXh0ZW5zaW9uOkh0bXhFeHRlbnNpb24pID0+IHZvaWR9IHRvRG9cbiAgICogQHBhcmFtIHtzdHJpbmdbXT19IGV4dGVuc2lvbnNUb0lnbm9yZVxuICAgKiBAcmV0dXJucyB2b2lkXG4gICAqL1xuICBmdW5jdGlvbiB3aXRoRXh0ZW5zaW9ucyhlbHQsIHRvRG8sIGV4dGVuc2lvbnNUb0lnbm9yZSkge1xuICAgIGZvckVhY2goZ2V0RXh0ZW5zaW9ucyhlbHQsIFtdLCBleHRlbnNpb25zVG9JZ25vcmUpLCBmdW5jdGlvbihleHRlbnNpb24pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRvRG8oZXh0ZW5zaW9uKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dFcnJvcihlKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBsb2dFcnJvcihtc2cpIHtcbiAgICBjb25zb2xlLmVycm9yKG1zZylcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VycyBhIGdpdmVuIGV2ZW50IG9uIGFuIGVsZW1lbnRcbiAgICpcbiAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jdHJpZ2dlclxuICAgKlxuICAgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fHN0cmluZ30gZWx0IHRoZSBlbGVtZW50IHRvIHRyaWdnZXIgdGhlIGV2ZW50IG9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgdGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRvIHRyaWdnZXJcbiAgICogQHBhcmFtIHthbnk9fSBkZXRhaWwgZGV0YWlscyBmb3IgdGhlIGV2ZW50XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gdHJpZ2dlckV2ZW50KGVsdCwgZXZlbnROYW1lLCBkZXRhaWwpIHtcbiAgICBlbHQgPSByZXNvbHZlVGFyZ2V0KGVsdClcbiAgICBpZiAoZGV0YWlsID09IG51bGwpIHtcbiAgICAgIGRldGFpbCA9IHt9XG4gICAgfVxuICAgIGRldGFpbC5lbHQgPSBlbHRcbiAgICBjb25zdCBldmVudCA9IG1ha2VFdmVudChldmVudE5hbWUsIGRldGFpbClcbiAgICBpZiAoaHRteC5sb2dnZXIgJiYgIWlnbm9yZUV2ZW50Rm9yTG9nZ2luZyhldmVudE5hbWUpKSB7XG4gICAgICBodG14LmxvZ2dlcihlbHQsIGV2ZW50TmFtZSwgZGV0YWlsKVxuICAgIH1cbiAgICBpZiAoZGV0YWlsLmVycm9yKSB7XG4gICAgICBsb2dFcnJvcihkZXRhaWwuZXJyb3IgKyAoZGV0YWlsLnRhcmdldCA/ICcsICcgKyBkZXRhaWwudGFyZ2V0IDogJycpKVxuICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6ZXJyb3InLCB7IGVycm9ySW5mbzogZGV0YWlsIH0pXG4gICAgfVxuICAgIGxldCBldmVudFJlc3VsdCA9IGVsdC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgIGNvbnN0IGtlYmFiTmFtZSA9IGtlYmFiRXZlbnROYW1lKGV2ZW50TmFtZSlcbiAgICBpZiAoZXZlbnRSZXN1bHQgJiYga2ViYWJOYW1lICE9PSBldmVudE5hbWUpIHtcbiAgICAgIGNvbnN0IGtlYmFiZWRFdmVudCA9IG1ha2VFdmVudChrZWJhYk5hbWUsIGV2ZW50LmRldGFpbClcbiAgICAgIGV2ZW50UmVzdWx0ID0gZXZlbnRSZXN1bHQgJiYgZWx0LmRpc3BhdGNoRXZlbnQoa2ViYWJlZEV2ZW50KVxuICAgIH1cbiAgICB3aXRoRXh0ZW5zaW9ucyhhc0VsZW1lbnQoZWx0KSwgZnVuY3Rpb24oZXh0ZW5zaW9uKSB7XG4gICAgICBldmVudFJlc3VsdCA9IGV2ZW50UmVzdWx0ICYmIChleHRlbnNpb24ub25FdmVudChldmVudE5hbWUsIGV2ZW50KSAhPT0gZmFsc2UgJiYgIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpXG4gICAgfSlcbiAgICByZXR1cm4gZXZlbnRSZXN1bHRcbiAgfVxuXG4gIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEhpc3RvcnkgU3VwcG9ydFxuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBsZXQgY3VycmVudFBhdGhGb3JIaXN0b3J5XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqL1xuICBmdW5jdGlvbiBzZXRDdXJyZW50UGF0aEZvckhpc3RvcnkocGF0aCkge1xuICAgIGN1cnJlbnRQYXRoRm9ySGlzdG9yeSA9IHBhdGhcbiAgICBpZiAoY2FuQWNjZXNzTG9jYWxTdG9yYWdlKCkpIHtcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2h0bXgtY3VycmVudC1wYXRoLWZvci1oaXN0b3J5JywgcGF0aClcbiAgICB9XG4gIH1cblxuICBzZXRDdXJyZW50UGF0aEZvckhpc3RvcnkobG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2gpXG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtFbGVtZW50fVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0SGlzdG9yeUVsZW1lbnQoKSB7XG4gICAgY29uc3QgaGlzdG9yeUVsdCA9IGdldERvY3VtZW50KCkucXVlcnlTZWxlY3RvcignW2h4LWhpc3RvcnktZWx0XSxbZGF0YS1oeC1oaXN0b3J5LWVsdF0nKVxuICAgIHJldHVybiBoaXN0b3J5RWx0IHx8IGdldERvY3VtZW50KCkuYm9keVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtFbGVtZW50fSByb290RWx0XG4gICAqL1xuICBmdW5jdGlvbiBzYXZlVG9IaXN0b3J5Q2FjaGUodXJsLCByb290RWx0KSB7XG4gICAgaWYgKCFjYW5BY2Nlc3NMb2NhbFN0b3JhZ2UoKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gZ2V0IHN0YXRlIHRvIHNhdmVcbiAgICBjb25zdCBpbm5lckhUTUwgPSBjbGVhbklubmVySHRtbEZvckhpc3Rvcnkocm9vdEVsdClcbiAgICBjb25zdCB0aXRsZSA9IGdldERvY3VtZW50KCkudGl0bGVcbiAgICBjb25zdCBzY3JvbGwgPSB3aW5kb3cuc2Nyb2xsWVxuXG4gICAgaWYgKGh0bXguY29uZmlnLmhpc3RvcnlDYWNoZVNpemUgPD0gMCkge1xuICAgICAgLy8gbWFrZSBzdXJlIHRoYXQgYW4gZXZlbnR1YWxseSBhbHJlYWR5IGV4aXN0aW5nIGNhY2hlIGlzIHB1cmdlZFxuICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnaHRteC1oaXN0b3J5LWNhY2hlJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHVybCA9IG5vcm1hbGl6ZVBhdGgodXJsKVxuXG4gICAgY29uc3QgaGlzdG9yeUNhY2hlID0gcGFyc2VKU09OKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2h0bXgtaGlzdG9yeS1jYWNoZScpKSB8fCBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGlzdG9yeUNhY2hlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaGlzdG9yeUNhY2hlW2ldLnVybCA9PT0gdXJsKSB7XG4gICAgICAgIGhpc3RvcnlDYWNoZS5zcGxpY2UoaSwgMSlcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQHR5cGUgSHRteEhpc3RvcnlJdGVtICovXG4gICAgY29uc3QgbmV3SGlzdG9yeUl0ZW0gPSB7IHVybCwgY29udGVudDogaW5uZXJIVE1MLCB0aXRsZSwgc2Nyb2xsIH1cblxuICAgIHRyaWdnZXJFdmVudChnZXREb2N1bWVudCgpLmJvZHksICdodG14Omhpc3RvcnlJdGVtQ3JlYXRlZCcsIHsgaXRlbTogbmV3SGlzdG9yeUl0ZW0sIGNhY2hlOiBoaXN0b3J5Q2FjaGUgfSlcblxuICAgIGhpc3RvcnlDYWNoZS5wdXNoKG5ld0hpc3RvcnlJdGVtKVxuICAgIHdoaWxlIChoaXN0b3J5Q2FjaGUubGVuZ3RoID4gaHRteC5jb25maWcuaGlzdG9yeUNhY2hlU2l6ZSkge1xuICAgICAgaGlzdG9yeUNhY2hlLnNoaWZ0KClcbiAgICB9XG5cbiAgICAvLyBrZWVwIHRyeWluZyB0byBzYXZlIHRoZSBjYWNoZSB1bnRpbCBpdCBzdWNjZWVkcyBvciBpcyBlbXB0eVxuICAgIHdoaWxlIChoaXN0b3J5Q2FjaGUubGVuZ3RoID4gMCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnaHRteC1oaXN0b3J5LWNhY2hlJywgSlNPTi5zdHJpbmdpZnkoaGlzdG9yeUNhY2hlKSlcbiAgICAgICAgYnJlYWtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdHJpZ2dlckVycm9yRXZlbnQoZ2V0RG9jdW1lbnQoKS5ib2R5LCAnaHRteDpoaXN0b3J5Q2FjaGVFcnJvcicsIHsgY2F1c2U6IGUsIGNhY2hlOiBoaXN0b3J5Q2FjaGUgfSlcbiAgICAgICAgaGlzdG9yeUNhY2hlLnNoaWZ0KCkgLy8gc2hyaW5rIHRoZSBjYWNoZSBhbmQgcmV0cnlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gSHRteEhpc3RvcnlJdGVtXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB1cmxcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNvbnRlbnRcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHRpdGxlXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzY3JvbGxcbiAgICovXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHJldHVybnMge0h0bXhIaXN0b3J5SXRlbXxudWxsfVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Q2FjaGVkSGlzdG9yeSh1cmwpIHtcbiAgICBpZiAoIWNhbkFjY2Vzc0xvY2FsU3RvcmFnZSgpKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHVybCA9IG5vcm1hbGl6ZVBhdGgodXJsKVxuXG4gICAgY29uc3QgaGlzdG9yeUNhY2hlID0gcGFyc2VKU09OKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2h0bXgtaGlzdG9yeS1jYWNoZScpKSB8fCBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGlzdG9yeUNhY2hlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaGlzdG9yeUNhY2hlW2ldLnVybCA9PT0gdXJsKSB7XG4gICAgICAgIHJldHVybiBoaXN0b3J5Q2FjaGVbaV1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gY2xlYW5Jbm5lckh0bWxGb3JIaXN0b3J5KGVsdCkge1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGh0bXguY29uZmlnLnJlcXVlc3RDbGFzc1xuICAgIGNvbnN0IGNsb25lID0gLyoqIEB0eXBlIEVsZW1lbnQgKi8gKGVsdC5jbG9uZU5vZGUodHJ1ZSkpXG4gICAgZm9yRWFjaChmaW5kQWxsKGNsb25lLCAnLicgKyBjbGFzc05hbWUpLCBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgcmVtb3ZlQ2xhc3NGcm9tRWxlbWVudChjaGlsZCwgY2xhc3NOYW1lKVxuICAgIH0pXG4gICAgLy8gcmVtb3ZlIHRoZSBkaXNhYmxlZCBhdHRyaWJ1dGUgZm9yIGFueSBlbGVtZW50IGRpc2FibGVkIGR1ZSB0byBhbiBodG14IHJlcXVlc3RcbiAgICBmb3JFYWNoKGZpbmRBbGwoY2xvbmUsICdbZGF0YS1kaXNhYmxlZC1ieS1odG14XScpLCBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgY2hpbGQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgfSlcbiAgICByZXR1cm4gY2xvbmUuaW5uZXJIVE1MXG4gIH1cblxuICBmdW5jdGlvbiBzYXZlQ3VycmVudFBhZ2VUb0hpc3RvcnkoKSB7XG4gICAgY29uc3QgZWx0ID0gZ2V0SGlzdG9yeUVsZW1lbnQoKVxuICAgIGxldCBwYXRoID0gY3VycmVudFBhdGhGb3JIaXN0b3J5XG4gICAgaWYgKGNhbkFjY2Vzc0xvY2FsU3RvcmFnZSgpKSB7XG4gICAgICBwYXRoID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnaHRteC1jdXJyZW50LXBhdGgtZm9yLWhpc3RvcnknKVxuICAgIH1cbiAgICBwYXRoID0gcGF0aCB8fCBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaFxuXG4gICAgLy8gQWxsb3cgaGlzdG9yeSBzbmFwc2hvdCBmZWF0dXJlIHRvIGJlIGRpc2FibGVkIHdoZXJlIGh4LWhpc3Rvcnk9XCJmYWxzZVwiXG4gICAgLy8gaXMgcHJlc2VudCAqYW55d2hlcmUqIGluIHRoZSBjdXJyZW50IGRvY3VtZW50IHdlJ3JlIGFib3V0IHRvIHNhdmUsXG4gICAgLy8gc28gd2UgY2FuIHByZXZlbnQgcHJpdmlsZWdlZCBkYXRhIGVudGVyaW5nIHRoZSBjYWNoZS5cbiAgICAvLyBUaGUgcGFnZSB3aWxsIHN0aWxsIGJlIHJlYWNoYWJsZSBhcyBhIGhpc3RvcnkgZW50cnksIGJ1dCBodG14IHdpbGwgZmV0Y2ggaXRcbiAgICAvLyBsaXZlIGZyb20gdGhlIHNlcnZlciBvbnBvcHN0YXRlIHJhdGhlciB0aGFuIGxvb2sgaW4gdGhlIHNlc3Npb25TdG9yYWdlIGNhY2hlXG4gICAgY29uc3QgZGlzYWJsZUhpc3RvcnlDYWNoZSA9IGdldERvY3VtZW50KCkucXVlcnlTZWxlY3RvcignW2h4LWhpc3Rvcnk9XCJmYWxzZVwiIGldLFtkYXRhLWh4LWhpc3Rvcnk9XCJmYWxzZVwiIGldJylcbiAgICBpZiAoIWRpc2FibGVIaXN0b3J5Q2FjaGUpIHtcbiAgICAgIHRyaWdnZXJFdmVudChnZXREb2N1bWVudCgpLmJvZHksICdodG14OmJlZm9yZUhpc3RvcnlTYXZlJywgeyBwYXRoLCBoaXN0b3J5RWx0OiBlbHQgfSlcbiAgICAgIHNhdmVUb0hpc3RvcnlDYWNoZShwYXRoLCBlbHQpXG4gICAgfVxuXG4gICAgaWYgKGh0bXguY29uZmlnLmhpc3RvcnlFbmFibGVkKSBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7IGh0bXg6IHRydWUgfSwgZ2V0RG9jdW1lbnQoKS50aXRsZSwgbG9jYXRpb24uaHJlZilcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgKi9cbiAgZnVuY3Rpb24gcHVzaFVybEludG9IaXN0b3J5KHBhdGgpIHtcbiAgLy8gcmVtb3ZlIHRoZSBjYWNoZSBidXN0ZXIgcGFyYW1ldGVyLCBpZiBhbnlcbiAgICBpZiAoaHRteC5jb25maWcuZ2V0Q2FjaGVCdXN0ZXJQYXJhbSkge1xuICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvb3JnXFwuaHRteFxcLmNhY2hlLWJ1c3Rlcj1bXiZdKiY/LywgJycpXG4gICAgICBpZiAoZW5kc1dpdGgocGF0aCwgJyYnKSB8fCBlbmRzV2l0aChwYXRoLCAnPycpKSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnNsaWNlKDAsIC0xKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaHRteC5jb25maWcuaGlzdG9yeUVuYWJsZWQpIHtcbiAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHsgaHRteDogdHJ1ZSB9LCAnJywgcGF0aClcbiAgICB9XG4gICAgc2V0Q3VycmVudFBhdGhGb3JIaXN0b3J5KHBhdGgpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICovXG4gIGZ1bmN0aW9uIHJlcGxhY2VVcmxJbkhpc3RvcnkocGF0aCkge1xuICAgIGlmIChodG14LmNvbmZpZy5oaXN0b3J5RW5hYmxlZCkgaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBodG14OiB0cnVlIH0sICcnLCBwYXRoKVxuICAgIHNldEN1cnJlbnRQYXRoRm9ySGlzdG9yeShwYXRoKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SHRteFNldHRsZVRhc2tbXX0gdGFza3NcbiAgICovXG4gIGZ1bmN0aW9uIHNldHRsZUltbWVkaWF0ZWx5KHRhc2tzKSB7XG4gICAgZm9yRWFjaCh0YXNrcywgZnVuY3Rpb24odGFzaykge1xuICAgICAgdGFzay5jYWxsKHVuZGVmaW5lZClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqL1xuICBmdW5jdGlvbiBsb2FkSGlzdG9yeUZyb21TZXJ2ZXIocGF0aCkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIGNvbnN0IHN3YXBTcGVjID0geyBzd2FwU3R5bGU6ICdpbm5lckhUTUwnLCBzd2FwRGVsYXk6IDAsIHNldHRsZURlbGF5OiAwIH1cbiAgICBjb25zdCBkZXRhaWxzID0geyBwYXRoLCB4aHI6IHJlcXVlc3QsIGhpc3RvcnlFbHQ6IGdldEhpc3RvcnlFbGVtZW50KCksIHN3YXBTcGVjIH1cbiAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHBhdGgsIHRydWUpXG4gICAgaWYgKGh0bXguY29uZmlnLmhpc3RvcnlSZXN0b3JlQXNIeFJlcXVlc3QpIHtcbiAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignSFgtUmVxdWVzdCcsICd0cnVlJylcbiAgICB9XG4gICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdIWC1IaXN0b3J5LVJlc3RvcmUtUmVxdWVzdCcsICd0cnVlJylcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0hYLUN1cnJlbnQtVVJMJywgbG9jYXRpb24uaHJlZilcbiAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDQwMCkge1xuICAgICAgICBkZXRhaWxzLnJlc3BvbnNlID0gdGhpcy5yZXNwb25zZVxuICAgICAgICB0cmlnZ2VyRXZlbnQoZ2V0RG9jdW1lbnQoKS5ib2R5LCAnaHRteDpoaXN0b3J5Q2FjaGVNaXNzTG9hZCcsIGRldGFpbHMpXG4gICAgICAgIHN3YXAoZGV0YWlscy5oaXN0b3J5RWx0LCBkZXRhaWxzLnJlc3BvbnNlLCBzd2FwU3BlYywge1xuICAgICAgICAgIGNvbnRleHRFbGVtZW50OiBkZXRhaWxzLmhpc3RvcnlFbHQsXG4gICAgICAgICAgaGlzdG9yeVJlcXVlc3Q6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgc2V0Q3VycmVudFBhdGhGb3JIaXN0b3J5KGRldGFpbHMucGF0aClcbiAgICAgICAgdHJpZ2dlckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6aGlzdG9yeVJlc3RvcmUnLCB7IHBhdGgsIGNhY2hlTWlzczogdHJ1ZSwgc2VydmVyUmVzcG9uc2U6IGRldGFpbHMucmVzcG9uc2UgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6aGlzdG9yeUNhY2hlTWlzc0xvYWRFcnJvcicsIGRldGFpbHMpXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0cmlnZ2VyRXZlbnQoZ2V0RG9jdW1lbnQoKS5ib2R5LCAnaHRteDpoaXN0b3J5Q2FjaGVNaXNzJywgZGV0YWlscykpIHtcbiAgICAgIHJlcXVlc3Quc2VuZCgpIC8vIG9ubHkgc2VuZCByZXF1ZXN0IGlmIGV2ZW50IG5vdCBwcmV2ZW50ZWRcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtwYXRoXVxuICAgKi9cbiAgZnVuY3Rpb24gcmVzdG9yZUhpc3RvcnkocGF0aCkge1xuICAgIHNhdmVDdXJyZW50UGFnZVRvSGlzdG9yeSgpXG4gICAgcGF0aCA9IHBhdGggfHwgbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2hcbiAgICBjb25zdCBjYWNoZWQgPSBnZXRDYWNoZWRIaXN0b3J5KHBhdGgpXG4gICAgaWYgKGNhY2hlZCkge1xuICAgICAgY29uc3Qgc3dhcFNwZWMgPSB7IHN3YXBTdHlsZTogJ2lubmVySFRNTCcsIHN3YXBEZWxheTogMCwgc2V0dGxlRGVsYXk6IDAsIHNjcm9sbDogY2FjaGVkLnNjcm9sbCB9XG4gICAgICBjb25zdCBkZXRhaWxzID0geyBwYXRoLCBpdGVtOiBjYWNoZWQsIGhpc3RvcnlFbHQ6IGdldEhpc3RvcnlFbGVtZW50KCksIHN3YXBTcGVjIH1cbiAgICAgIGlmICh0cmlnZ2VyRXZlbnQoZ2V0RG9jdW1lbnQoKS5ib2R5LCAnaHRteDpoaXN0b3J5Q2FjaGVIaXQnLCBkZXRhaWxzKSkge1xuICAgICAgICBzd2FwKGRldGFpbHMuaGlzdG9yeUVsdCwgY2FjaGVkLmNvbnRlbnQsIHN3YXBTcGVjLCB7XG4gICAgICAgICAgY29udGV4dEVsZW1lbnQ6IGRldGFpbHMuaGlzdG9yeUVsdCxcbiAgICAgICAgICB0aXRsZTogY2FjaGVkLnRpdGxlXG4gICAgICAgIH0pXG4gICAgICAgIHNldEN1cnJlbnRQYXRoRm9ySGlzdG9yeShkZXRhaWxzLnBhdGgpXG4gICAgICAgIHRyaWdnZXJFdmVudChnZXREb2N1bWVudCgpLmJvZHksICdodG14Omhpc3RvcnlSZXN0b3JlJywgZGV0YWlscylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGh0bXguY29uZmlnLnJlZnJlc2hPbkhpc3RvcnlNaXNzKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmU6IG9wdGlvbmFsIHBhcmFtZXRlciBpbiByZWxvYWQoKSBmdW5jdGlvbiB0aHJvd3MgZXJyb3JcbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuICAgICAgICBodG14LmxvY2F0aW9uLnJlbG9hZCh0cnVlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9hZEhpc3RvcnlGcm9tU2VydmVyKHBhdGgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm5zIHtFbGVtZW50W119XG4gICAqL1xuICBmdW5jdGlvbiBhZGRSZXF1ZXN0SW5kaWNhdG9yQ2xhc3NlcyhlbHQpIHtcbiAgICBsZXQgaW5kaWNhdG9ycyA9IC8qKiBAdHlwZSBFbGVtZW50W10gKi8gKGZpbmRBdHRyaWJ1dGVUYXJnZXRzKGVsdCwgJ2h4LWluZGljYXRvcicpKVxuICAgIGlmIChpbmRpY2F0b3JzID09IG51bGwpIHtcbiAgICAgIGluZGljYXRvcnMgPSBbZWx0XVxuICAgIH1cbiAgICBmb3JFYWNoKGluZGljYXRvcnMsIGZ1bmN0aW9uKGljKSB7XG4gICAgICBjb25zdCBpbnRlcm5hbERhdGEgPSBnZXRJbnRlcm5hbERhdGEoaWMpXG4gICAgICBpbnRlcm5hbERhdGEucmVxdWVzdENvdW50ID0gKGludGVybmFsRGF0YS5yZXF1ZXN0Q291bnQgfHwgMCkgKyAxXG4gICAgICBhZGRDbGFzc1RvRWxlbWVudChpYywgaHRteC5jb25maWcucmVxdWVzdENsYXNzKVxuICAgIH0pXG4gICAgcmV0dXJuIGluZGljYXRvcnNcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcmV0dXJucyB7RWxlbWVudFtdfVxuICAgKi9cbiAgZnVuY3Rpb24gZGlzYWJsZUVsZW1lbnRzKGVsdCkge1xuICAgIGxldCBkaXNhYmxlZEVsdHMgPSAvKiogQHR5cGUgRWxlbWVudFtdICovIChmaW5kQXR0cmlidXRlVGFyZ2V0cyhlbHQsICdoeC1kaXNhYmxlZC1lbHQnKSlcbiAgICBpZiAoZGlzYWJsZWRFbHRzID09IG51bGwpIHtcbiAgICAgIGRpc2FibGVkRWx0cyA9IFtdXG4gICAgfVxuICAgIGZvckVhY2goZGlzYWJsZWRFbHRzLCBmdW5jdGlvbihkaXNhYmxlZEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGludGVybmFsRGF0YSA9IGdldEludGVybmFsRGF0YShkaXNhYmxlZEVsZW1lbnQpXG4gICAgICBpbnRlcm5hbERhdGEucmVxdWVzdENvdW50ID0gKGludGVybmFsRGF0YS5yZXF1ZXN0Q291bnQgfHwgMCkgKyAxXG4gICAgICBpZiAoIWRpc2FibGVkRWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgZGlzYWJsZWRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJylcbiAgICAgICAgZGlzYWJsZWRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1kaXNhYmxlZC1ieS1odG14JywgJycpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gZGlzYWJsZWRFbHRzXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50W119IGluZGljYXRvcnNcbiAgICogQHBhcmFtIHtFbGVtZW50W119IGRpc2FibGVkXG4gICAqL1xuICBmdW5jdGlvbiByZW1vdmVSZXF1ZXN0SW5kaWNhdG9ycyhpbmRpY2F0b3JzLCBkaXNhYmxlZCkge1xuICAgIGZvckVhY2goaW5kaWNhdG9ycy5jb25jYXQoZGlzYWJsZWQpLCBmdW5jdGlvbihlbGUpIHtcbiAgICAgIGNvbnN0IGludGVybmFsRGF0YSA9IGdldEludGVybmFsRGF0YShlbGUpXG4gICAgICBpbnRlcm5hbERhdGEucmVxdWVzdENvdW50ID0gKGludGVybmFsRGF0YS5yZXF1ZXN0Q291bnQgfHwgMSkgLSAxXG4gICAgfSlcbiAgICBmb3JFYWNoKGluZGljYXRvcnMsIGZ1bmN0aW9uKGljKSB7XG4gICAgICBjb25zdCBpbnRlcm5hbERhdGEgPSBnZXRJbnRlcm5hbERhdGEoaWMpXG4gICAgICBpZiAoaW50ZXJuYWxEYXRhLnJlcXVlc3RDb3VudCA9PT0gMCkge1xuICAgICAgICByZW1vdmVDbGFzc0Zyb21FbGVtZW50KGljLCBodG14LmNvbmZpZy5yZXF1ZXN0Q2xhc3MpXG4gICAgICB9XG4gICAgfSlcbiAgICBmb3JFYWNoKGRpc2FibGVkLCBmdW5jdGlvbihkaXNhYmxlZEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGludGVybmFsRGF0YSA9IGdldEludGVybmFsRGF0YShkaXNhYmxlZEVsZW1lbnQpXG4gICAgICBpZiAoaW50ZXJuYWxEYXRhLnJlcXVlc3RDb3VudCA9PT0gMCAmJiBkaXNhYmxlZEVsZW1lbnQuaGFzQXR0cmlidXRlKCdkYXRhLWRpc2FibGVkLWJ5LWh0bXgnKSkge1xuICAgICAgICBkaXNhYmxlZEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICAgIGRpc2FibGVkRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZGlzYWJsZWQtYnktaHRteCcpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIElucHV0IFZhbHVlIFByb2Nlc3NpbmdcbiAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50W119IHByb2Nlc3NlZFxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIGhhdmVTZWVuTm9kZShwcm9jZXNzZWQsIGVsdCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvY2Vzc2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBub2RlID0gcHJvY2Vzc2VkW2ldXG4gICAgICBpZiAobm9kZS5pc1NhbWVOb2RlKGVsdCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBzaG91bGRJbmNsdWRlKGVsZW1lbnQpIHtcbiAgICAvLyBDYXN0IHRvIHRyaWNrIHRzYywgdW5kZWZpbmVkIHZhbHVlcyB3aWxsIHdvcmsgZmluZSBoZXJlXG4gICAgY29uc3QgZWx0ID0gLyoqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fSAqLyAoZWxlbWVudClcbiAgICBpZiAoZWx0Lm5hbWUgPT09ICcnIHx8IGVsdC5uYW1lID09IG51bGwgfHwgZWx0LmRpc2FibGVkIHx8IGNsb3Nlc3QoZWx0LCAnZmllbGRzZXRbZGlzYWJsZWRdJykpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICAvLyBpZ25vcmUgXCJzdWJtaXR0ZXJcIiB0eXBlcyAoc2VlIGpRdWVyeSBzcmMvc2VyaWFsaXplLmpzKVxuICAgIGlmIChlbHQudHlwZSA9PT0gJ2J1dHRvbicgfHwgZWx0LnR5cGUgPT09ICdzdWJtaXQnIHx8IGVsdC50YWdOYW1lID09PSAnaW1hZ2UnIHx8IGVsdC50YWdOYW1lID09PSAncmVzZXQnIHx8IGVsdC50YWdOYW1lID09PSAnZmlsZScpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBpZiAoZWx0LnR5cGUgPT09ICdjaGVja2JveCcgfHwgZWx0LnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgIHJldHVybiBlbHQuY2hlY2tlZFxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfEFycmF5fEZvcm1EYXRhRW50cnlWYWx1ZX0gdmFsdWVcbiAgICogQHBhcmFtIHtGb3JtRGF0YX0gZm9ybURhdGEgKi9cbiAgZnVuY3Rpb24gYWRkVmFsdWVUb0Zvcm1EYXRhKG5hbWUsIHZhbHVlLCBmb3JtRGF0YSkge1xuICAgIGlmIChuYW1lICE9IG51bGwgJiYgdmFsdWUgIT0gbnVsbCkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24odikgeyBmb3JtRGF0YS5hcHBlbmQobmFtZSwgdikgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd8QXJyYXl9IHZhbHVlXG4gICAqIEBwYXJhbSB7Rm9ybURhdGF9IGZvcm1EYXRhICovXG4gIGZ1bmN0aW9uIHJlbW92ZVZhbHVlRnJvbUZvcm1EYXRhKG5hbWUsIHZhbHVlLCBmb3JtRGF0YSkge1xuICAgIGlmIChuYW1lICE9IG51bGwgJiYgdmFsdWUgIT0gbnVsbCkge1xuICAgICAgbGV0IHZhbHVlcyA9IGZvcm1EYXRhLmdldEFsbChuYW1lKVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlcyA9IHZhbHVlcy5maWx0ZXIodiA9PiB2YWx1ZS5pbmRleE9mKHYpIDwgMClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcyA9IHZhbHVlcy5maWx0ZXIodiA9PiB2ICE9PSB2YWx1ZSlcbiAgICAgIH1cbiAgICAgIGZvcm1EYXRhLmRlbGV0ZShuYW1lKVxuICAgICAgZm9yRWFjaCh2YWx1ZXMsIHYgPT4gZm9ybURhdGEuYXBwZW5kKG5hbWUsIHYpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfEFycmF5fVxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0VmFsdWVGcm9tSW5wdXQoZWx0KSB7XG4gICAgaWYgKGVsdCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50ICYmIGVsdC5tdWx0aXBsZSkge1xuICAgICAgcmV0dXJuIHRvQXJyYXkoZWx0LnF1ZXJ5U2VsZWN0b3JBbGwoJ29wdGlvbjpjaGVja2VkJykpLm1hcChmdW5jdGlvbihlKSB7IHJldHVybiAoLyoqIEB0eXBlIEhUTUxPcHRpb25FbGVtZW50ICovKGUpKS52YWx1ZSB9KVxuICAgIH1cbiAgICAvLyBpbmNsdWRlIGZpbGUgaW5wdXRzXG4gICAgaWYgKGVsdCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgZWx0LmZpbGVzKSB7XG4gICAgICByZXR1cm4gdG9BcnJheShlbHQuZmlsZXMpXG4gICAgfVxuICAgIC8vIEB0cy1pZ25vcmUgdmFsdWUgd2lsbCBiZSB1bmRlZmluZWQgZm9yIG5vbi1pbnB1dCBlbGVtZW50cywgd2hpY2ggaXMgZmluZVxuICAgIHJldHVybiBlbHQudmFsdWVcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gcHJvY2Vzc2VkXG4gICAqIEBwYXJhbSB7Rm9ybURhdGF9IGZvcm1EYXRhXG4gICAqIEBwYXJhbSB7SHRteEVsZW1lbnRWYWxpZGF0aW9uRXJyb3JbXX0gZXJyb3JzXG4gICAqIEBwYXJhbSB7RWxlbWVudHxIVE1MSW5wdXRFbGVtZW50fEhUTUxTZWxlY3RFbGVtZW50fEhUTUxGb3JtRWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmFsaWRhdGVcbiAgICovXG4gIGZ1bmN0aW9uIHByb2Nlc3NJbnB1dFZhbHVlKHByb2Nlc3NlZCwgZm9ybURhdGEsIGVycm9ycywgZWx0LCB2YWxpZGF0ZSkge1xuICAgIGlmIChlbHQgPT0gbnVsbCB8fCBoYXZlU2Vlbk5vZGUocHJvY2Vzc2VkLCBlbHQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgcHJvY2Vzc2VkLnB1c2goZWx0KVxuICAgIH1cbiAgICBpZiAoc2hvdWxkSW5jbHVkZShlbHQpKSB7XG4gICAgICBjb25zdCBuYW1lID0gZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ25hbWUnKVxuICAgICAgYWRkVmFsdWVUb0Zvcm1EYXRhKG5hbWUsIGdldFZhbHVlRnJvbUlucHV0KGVsdCksIGZvcm1EYXRhKVxuICAgICAgaWYgKHZhbGlkYXRlKSB7XG4gICAgICAgIHZhbGlkYXRlRWxlbWVudChlbHQsIGVycm9ycylcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVsdCBpbnN0YW5jZW9mIEhUTUxGb3JtRWxlbWVudCkge1xuICAgICAgZm9yRWFjaChlbHQuZWxlbWVudHMsIGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIGlmIChwcm9jZXNzZWQuaW5kZXhPZihpbnB1dCkgPj0gMCkge1xuICAgICAgICAgIC8vIFRoZSBpbnB1dCBoYXMgYWxyZWFkeSBiZWVuIHByb2Nlc3NlZCBhbmQgYWRkZWQgdG8gdGhlIHZhbHVlcywgYnV0IHRoZSBGb3JtRGF0YSB0aGF0IHdpbGwgYmVcbiAgICAgICAgICAvLyAgY29uc3RydWN0ZWQgcmlnaHQgYWZ0ZXIgb24gdGhlIGZvcm0sIHdpbGwgaW5jbHVkZSBpdCBvbmNlIGFnYWluLiBTbyByZW1vdmUgdGhhdCBpbnB1dCdzIHZhbHVlXG4gICAgICAgICAgLy8gIG5vdyB0byBhdm9pZCBkdXBsaWNhdGVzXG4gICAgICAgICAgcmVtb3ZlVmFsdWVGcm9tRm9ybURhdGEoaW5wdXQubmFtZSwgZ2V0VmFsdWVGcm9tSW5wdXQoaW5wdXQpLCBmb3JtRGF0YSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9jZXNzZWQucHVzaChpbnB1dClcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsaWRhdGUpIHtcbiAgICAgICAgICB2YWxpZGF0ZUVsZW1lbnQoaW5wdXQsIGVycm9ycylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIG5ldyBGb3JtRGF0YShlbHQpLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRmlsZSAmJiB2YWx1ZS5uYW1lID09PSAnJykge1xuICAgICAgICAgIHJldHVybiAvLyBpZ25vcmUgbm8tbmFtZSBmaWxlc1xuICAgICAgICB9XG4gICAgICAgIGFkZFZhbHVlVG9Gb3JtRGF0YShuYW1lLCB2YWx1ZSwgZm9ybURhdGEpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcGFyYW0ge0h0bXhFbGVtZW50VmFsaWRhdGlvbkVycm9yW119IGVycm9yc1xuICAgKi9cbiAgZnVuY3Rpb24gdmFsaWRhdGVFbGVtZW50KGVsdCwgZXJyb3JzKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IC8qKiBAdHlwZSB7SFRNTEVsZW1lbnQgJiBFbGVtZW50SW50ZXJuYWxzfSAqLyAoZWx0KVxuICAgIGlmIChlbGVtZW50LndpbGxWYWxpZGF0ZSkge1xuICAgICAgdHJpZ2dlckV2ZW50KGVsZW1lbnQsICdodG14OnZhbGlkYXRpb246dmFsaWRhdGUnKVxuICAgICAgaWYgKCFlbGVtZW50LmNoZWNrVmFsaWRpdHkoKSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdHJpZ2dlckV2ZW50KGVsZW1lbnQsICdodG14OnZhbGlkYXRpb246ZmFpbGVkJywge1xuICAgICAgICAgICAgbWVzc2FnZTogZWxlbWVudC52YWxpZGF0aW9uTWVzc2FnZSxcbiAgICAgICAgICAgIHZhbGlkaXR5OiBlbGVtZW50LnZhbGlkaXR5XG4gICAgICAgICAgfSkgJiZcbiAgICAgICAgICAhZXJyb3JzLmxlbmd0aCAmJlxuICAgICAgICAgIGh0bXguY29uZmlnLnJlcG9ydFZhbGlkaXR5T2ZGb3Jtc1xuICAgICAgICApIHtcbiAgICAgICAgICBlbGVtZW50LnJlcG9ydFZhbGlkaXR5KClcbiAgICAgICAgfVxuICAgICAgICBlcnJvcnMucHVzaCh7IGVsdDogZWxlbWVudCwgbWVzc2FnZTogZWxlbWVudC52YWxpZGF0aW9uTWVzc2FnZSwgdmFsaWRpdHk6IGVsZW1lbnQudmFsaWRpdHkgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGUgdmFsdWVzIGluIHRoZSBvbmUgRm9ybURhdGEgd2l0aCB0aG9zZSBmcm9tIGFub3RoZXIuXG4gICAqIEBwYXJhbSB7Rm9ybURhdGF9IHJlY2VpdmVyIHRoZSBmb3JtZGF0YSB0aGF0IHdpbGwgYmUgbXV0YXRlZFxuICAgKiBAcGFyYW0ge0Zvcm1EYXRhfSBkb25vciB0aGUgZm9ybWRhdGEgdGhhdCB3aWxsIHByb3ZpZGUgdGhlIG92ZXJyaWRpbmcgdmFsdWVzXG4gICAqIEByZXR1cm5zIHtGb3JtRGF0YX0gdGhlIHtAbGlua2NvZGUgcmVjZWl2ZXJ9XG4gICAqL1xuICBmdW5jdGlvbiBvdmVycmlkZUZvcm1EYXRhKHJlY2VpdmVyLCBkb25vcikge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGRvbm9yLmtleXMoKSkge1xuICAgICAgcmVjZWl2ZXIuZGVsZXRlKGtleSlcbiAgICB9XG4gICAgZG9ub3IuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICByZWNlaXZlci5hcHBlbmQoa2V5LCB2YWx1ZSlcbiAgICB9KVxuICAgIHJldHVybiByZWNlaXZlclxuICB9XG5cbiAgLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnR8SFRNTEZvcm1FbGVtZW50fSBlbHRcbiAqIEBwYXJhbSB7SHR0cFZlcmJ9IHZlcmJcbiAqIEByZXR1cm5zIHt7ZXJyb3JzOiBIdG14RWxlbWVudFZhbGlkYXRpb25FcnJvcltdLCBmb3JtRGF0YTogRm9ybURhdGEsIHZhbHVlczogT2JqZWN0fX1cbiAqL1xuICBmdW5jdGlvbiBnZXRJbnB1dFZhbHVlcyhlbHQsIHZlcmIpIHtcbiAgICAvKiogQHR5cGUgRWxlbWVudFtdICovXG4gICAgY29uc3QgcHJvY2Vzc2VkID0gW11cbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgY29uc3QgcHJpb3JpdHlGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgLyoqIEB0eXBlIEh0bXhFbGVtZW50VmFsaWRhdGlvbkVycm9yW10gKi9cbiAgICBjb25zdCBlcnJvcnMgPSBbXVxuICAgIGNvbnN0IGludGVybmFsRGF0YSA9IGdldEludGVybmFsRGF0YShlbHQpXG4gICAgaWYgKGludGVybmFsRGF0YS5sYXN0QnV0dG9uQ2xpY2tlZCAmJiAhYm9keUNvbnRhaW5zKGludGVybmFsRGF0YS5sYXN0QnV0dG9uQ2xpY2tlZCkpIHtcbiAgICAgIGludGVybmFsRGF0YS5sYXN0QnV0dG9uQ2xpY2tlZCA9IG51bGxcbiAgICB9XG5cbiAgICAvLyBvbmx5IHZhbGlkYXRlIHdoZW4gZm9ybSBpcyBkaXJlY3RseSBzdWJtaXR0ZWQgYW5kIG5vdmFsaWRhdGUgb3IgZm9ybW5vdmFsaWRhdGUgYXJlIG5vdCBzZXRcbiAgICAvLyBvciBpZiB0aGUgZWxlbWVudCBoYXMgYW4gZXhwbGljaXQgaHgtdmFsaWRhdGU9XCJ0cnVlXCIgb24gaXRcbiAgICBsZXQgdmFsaWRhdGUgPSAoZWx0IGluc3RhbmNlb2YgSFRNTEZvcm1FbGVtZW50ICYmIGVsdC5ub1ZhbGlkYXRlICE9PSB0cnVlKSB8fCBnZXRBdHRyaWJ1dGVWYWx1ZShlbHQsICdoeC12YWxpZGF0ZScpID09PSAndHJ1ZSdcbiAgICBpZiAoaW50ZXJuYWxEYXRhLmxhc3RCdXR0b25DbGlja2VkKSB7XG4gICAgICB2YWxpZGF0ZSA9IHZhbGlkYXRlICYmIGludGVybmFsRGF0YS5sYXN0QnV0dG9uQ2xpY2tlZC5mb3JtTm9WYWxpZGF0ZSAhPT0gdHJ1ZVxuICAgIH1cblxuICAgIC8vIGZvciBhIG5vbi1HRVQgaW5jbHVkZSB0aGUgcmVsYXRlZCBmb3JtLCB3aGljaCBtYXkgb3IgbWF5IG5vdCBiZSBhIHBhcmVudCBlbGVtZW50IG9mIGVsdFxuICAgIGlmICh2ZXJiICE9PSAnZ2V0Jykge1xuICAgICAgcHJvY2Vzc0lucHV0VmFsdWUocHJvY2Vzc2VkLCBwcmlvcml0eUZvcm1EYXRhLCBlcnJvcnMsIGdldFJlbGF0ZWRGb3JtKGVsdCksIHZhbGlkYXRlKVxuICAgIH1cblxuICAgIC8vIGluY2x1ZGUgdGhlIGVsZW1lbnQgaXRzZWxmXG4gICAgcHJvY2Vzc0lucHV0VmFsdWUocHJvY2Vzc2VkLCBmb3JtRGF0YSwgZXJyb3JzLCBlbHQsIHZhbGlkYXRlKVxuXG4gICAgLy8gaWYgYSBidXR0b24gb3Igc3VibWl0IHdhcyBjbGlja2VkIGxhc3QsIGluY2x1ZGUgaXRzIHZhbHVlXG4gICAgaWYgKGludGVybmFsRGF0YS5sYXN0QnV0dG9uQ2xpY2tlZCB8fCBlbHQudGFnTmFtZSA9PT0gJ0JVVFRPTicgfHxcbiAgICAoZWx0LnRhZ05hbWUgPT09ICdJTlBVVCcgJiYgZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ3R5cGUnKSA9PT0gJ3N1Ym1pdCcpKSB7XG4gICAgICBjb25zdCBidXR0b24gPSBpbnRlcm5hbERhdGEubGFzdEJ1dHRvbkNsaWNrZWQgfHwgKC8qKiBAdHlwZSBIVE1MSW5wdXRFbGVtZW50fEhUTUxCdXR0b25FbGVtZW50ICovKGVsdCkpXG4gICAgICBjb25zdCBuYW1lID0gZ2V0UmF3QXR0cmlidXRlKGJ1dHRvbiwgJ25hbWUnKVxuICAgICAgYWRkVmFsdWVUb0Zvcm1EYXRhKG5hbWUsIGJ1dHRvbi52YWx1ZSwgcHJpb3JpdHlGb3JtRGF0YSlcbiAgICB9XG5cbiAgICAvLyBpbmNsdWRlIGFueSBleHBsaWNpdCBpbmNsdWRlc1xuICAgIGNvbnN0IGluY2x1ZGVzID0gZmluZEF0dHJpYnV0ZVRhcmdldHMoZWx0LCAnaHgtaW5jbHVkZScpXG4gICAgZm9yRWFjaChpbmNsdWRlcywgZnVuY3Rpb24obm9kZSkge1xuICAgICAgcHJvY2Vzc0lucHV0VmFsdWUocHJvY2Vzc2VkLCBmb3JtRGF0YSwgZXJyb3JzLCBhc0VsZW1lbnQobm9kZSksIHZhbGlkYXRlKVxuICAgICAgLy8gaWYgYSBub24tZm9ybSBpcyBpbmNsdWRlZCwgaW5jbHVkZSBhbnkgaW5wdXQgdmFsdWVzIHdpdGhpbiBpdFxuICAgICAgaWYgKCFtYXRjaGVzKG5vZGUsICdmb3JtJykpIHtcbiAgICAgICAgZm9yRWFjaChhc1BhcmVudE5vZGUobm9kZSkucXVlcnlTZWxlY3RvckFsbChJTlBVVF9TRUxFQ1RPUiksIGZ1bmN0aW9uKGRlc2NlbmRhbnQpIHtcbiAgICAgICAgICBwcm9jZXNzSW5wdXRWYWx1ZShwcm9jZXNzZWQsIGZvcm1EYXRhLCBlcnJvcnMsIGRlc2NlbmRhbnQsIHZhbGlkYXRlKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyB2YWx1ZXMgZnJvbSBhIDxmb3JtPiB0YWtlIHByZWNlZGVuY2UsIG92ZXJyaWRpbmcgdGhlIHJlZ3VsYXIgdmFsdWVzXG4gICAgb3ZlcnJpZGVGb3JtRGF0YShmb3JtRGF0YSwgcHJpb3JpdHlGb3JtRGF0YSlcblxuICAgIHJldHVybiB7IGVycm9ycywgZm9ybURhdGEsIHZhbHVlczogZm9ybURhdGFQcm94eShmb3JtRGF0YSkgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXR1cm5TdHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHthbnl9IHJlYWxWYWx1ZVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gYXBwZW5kUGFyYW0ocmV0dXJuU3RyLCBuYW1lLCByZWFsVmFsdWUpIHtcbiAgICBpZiAocmV0dXJuU3RyICE9PSAnJykge1xuICAgICAgcmV0dXJuU3RyICs9ICcmJ1xuICAgIH1cbiAgICBpZiAoU3RyaW5nKHJlYWxWYWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICByZWFsVmFsdWUgPSBKU09OLnN0cmluZ2lmeShyZWFsVmFsdWUpXG4gICAgfVxuICAgIGNvbnN0IHMgPSBlbmNvZGVVUklDb21wb25lbnQocmVhbFZhbHVlKVxuICAgIHJldHVyblN0ciArPSBlbmNvZGVVUklDb21wb25lbnQobmFtZSkgKyAnPScgKyBzXG4gICAgcmV0dXJuIHJldHVyblN0clxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Rm9ybURhdGF8T2JqZWN0fSB2YWx1ZXNcbiAgICogQHJldHVybnMgc3RyaW5nXG4gICAqL1xuICBmdW5jdGlvbiB1cmxFbmNvZGUodmFsdWVzKSB7XG4gICAgdmFsdWVzID0gZm9ybURhdGFGcm9tT2JqZWN0KHZhbHVlcylcbiAgICBsZXQgcmV0dXJuU3RyID0gJydcbiAgICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICByZXR1cm5TdHIgPSBhcHBlbmRQYXJhbShyZXR1cm5TdHIsIGtleSwgdmFsdWUpXG4gICAgfSlcbiAgICByZXR1cm4gcmV0dXJuU3RyXG4gIH1cblxuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBBamF4XG4gIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9tcHRcbiAqIEByZXR1cm5zIHtIdG14SGVhZGVyU3BlY2lmaWNhdGlvbn1cbiAqL1xuICBmdW5jdGlvbiBnZXRIZWFkZXJzKGVsdCwgdGFyZ2V0LCBwcm9tcHQpIHtcbiAgICAvKiogQHR5cGUgSHRteEhlYWRlclNwZWNpZmljYXRpb24gKi9cbiAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgJ0hYLVJlcXVlc3QnOiAndHJ1ZScsXG4gICAgICAnSFgtVHJpZ2dlcic6IGdldFJhd0F0dHJpYnV0ZShlbHQsICdpZCcpLFxuICAgICAgJ0hYLVRyaWdnZXItTmFtZSc6IGdldFJhd0F0dHJpYnV0ZShlbHQsICduYW1lJyksXG4gICAgICAnSFgtVGFyZ2V0JzogZ2V0QXR0cmlidXRlVmFsdWUodGFyZ2V0LCAnaWQnKSxcbiAgICAgICdIWC1DdXJyZW50LVVSTCc6IGxvY2F0aW9uLmhyZWZcbiAgICB9XG4gICAgZ2V0VmFsdWVzRm9yRWxlbWVudChlbHQsICdoeC1oZWFkZXJzJywgZmFsc2UsIGhlYWRlcnMpXG4gICAgaWYgKHByb21wdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBoZWFkZXJzWydIWC1Qcm9tcHQnXSA9IHByb21wdFxuICAgIH1cbiAgICBpZiAoZ2V0SW50ZXJuYWxEYXRhKGVsdCkuYm9vc3RlZCkge1xuICAgICAgaGVhZGVyc1snSFgtQm9vc3RlZCddID0gJ3RydWUnXG4gICAgfVxuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICAvKipcbiAqIGZpbHRlclZhbHVlcyB0YWtlcyBhbiBvYmplY3QgY29udGFpbmluZyBmb3JtIGlucHV0IHZhbHVlc1xuICogYW5kIHJldHVybnMgYSBuZXcgb2JqZWN0IHRoYXQgb25seSBjb250YWlucyBrZXlzIHRoYXQgYXJlXG4gKiBzcGVjaWZpZWQgYnkgdGhlIGNsb3Nlc3QgXCJoeC1wYXJhbXNcIiBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7Rm9ybURhdGF9IGlucHV0VmFsdWVzXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICogQHJldHVybnMge0Zvcm1EYXRhfVxuICovXG4gIGZ1bmN0aW9uIGZpbHRlclZhbHVlcyhpbnB1dFZhbHVlcywgZWx0KSB7XG4gICAgY29uc3QgcGFyYW1zVmFsdWUgPSBnZXRDbG9zZXN0QXR0cmlidXRlVmFsdWUoZWx0LCAnaHgtcGFyYW1zJylcbiAgICBpZiAocGFyYW1zVmFsdWUpIHtcbiAgICAgIGlmIChwYXJhbXNWYWx1ZSA9PT0gJ25vbmUnKSB7XG4gICAgICAgIHJldHVybiBuZXcgRm9ybURhdGEoKVxuICAgICAgfSBlbHNlIGlmIChwYXJhbXNWYWx1ZSA9PT0gJyonKSB7XG4gICAgICAgIHJldHVybiBpbnB1dFZhbHVlc1xuICAgICAgfSBlbHNlIGlmIChwYXJhbXNWYWx1ZS5pbmRleE9mKCdub3QgJykgPT09IDApIHtcbiAgICAgICAgZm9yRWFjaChwYXJhbXNWYWx1ZS5zbGljZSg0KS5zcGxpdCgnLCcpLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgbmFtZSA9IG5hbWUudHJpbSgpXG4gICAgICAgICAgaW5wdXRWYWx1ZXMuZGVsZXRlKG5hbWUpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBpbnB1dFZhbHVlc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVzID0gbmV3IEZvcm1EYXRhKClcbiAgICAgICAgZm9yRWFjaChwYXJhbXNWYWx1ZS5zcGxpdCgnLCcpLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgbmFtZSA9IG5hbWUudHJpbSgpXG4gICAgICAgICAgaWYgKGlucHV0VmFsdWVzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgaW5wdXRWYWx1ZXMuZ2V0QWxsKG5hbWUpLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHsgbmV3VmFsdWVzLmFwcGVuZChuYW1lLCB2YWx1ZSkgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBuZXdWYWx1ZXNcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlucHV0VmFsdWVzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBpc0FuY2hvckxpbmsoZWx0KSB7XG4gICAgcmV0dXJuICEhZ2V0UmF3QXR0cmlidXRlKGVsdCwgJ2hyZWYnKSAmJiBnZXRSYXdBdHRyaWJ1dGUoZWx0LCAnaHJlZicpLmluZGV4T2YoJyMnKSA+PSAwXG4gIH1cblxuICAvKipcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gKiBAcGFyYW0ge0h0bXhTd2FwU3R5bGV9IFtzd2FwSW5mb092ZXJyaWRlXVxuICogQHJldHVybnMge0h0bXhTd2FwU3BlY2lmaWNhdGlvbn1cbiAqL1xuICBmdW5jdGlvbiBnZXRTd2FwU3BlY2lmaWNhdGlvbihlbHQsIHN3YXBJbmZvT3ZlcnJpZGUpIHtcbiAgICBjb25zdCBzd2FwSW5mbyA9IHN3YXBJbmZvT3ZlcnJpZGUgfHwgZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXN3YXAnKVxuICAgIC8qKiBAdHlwZSBIdG14U3dhcFNwZWNpZmljYXRpb24gKi9cbiAgICBjb25zdCBzd2FwU3BlYyA9IHtcbiAgICAgIHN3YXBTdHlsZTogZ2V0SW50ZXJuYWxEYXRhKGVsdCkuYm9vc3RlZCA/ICdpbm5lckhUTUwnIDogaHRteC5jb25maWcuZGVmYXVsdFN3YXBTdHlsZSxcbiAgICAgIHN3YXBEZWxheTogaHRteC5jb25maWcuZGVmYXVsdFN3YXBEZWxheSxcbiAgICAgIHNldHRsZURlbGF5OiBodG14LmNvbmZpZy5kZWZhdWx0U2V0dGxlRGVsYXlcbiAgICB9XG4gICAgaWYgKGh0bXguY29uZmlnLnNjcm9sbEludG9WaWV3T25Cb29zdCAmJiBnZXRJbnRlcm5hbERhdGEoZWx0KS5ib29zdGVkICYmICFpc0FuY2hvckxpbmsoZWx0KSkge1xuICAgICAgc3dhcFNwZWMuc2hvdyA9ICd0b3AnXG4gICAgfVxuICAgIGlmIChzd2FwSW5mbykge1xuICAgICAgY29uc3Qgc3BsaXQgPSBzcGxpdE9uV2hpdGVzcGFjZShzd2FwSW5mbylcbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IHNwbGl0W2ldXG4gICAgICAgICAgaWYgKHZhbHVlLmluZGV4T2YoJ3N3YXA6JykgPT09IDApIHtcbiAgICAgICAgICAgIHN3YXBTcGVjLnN3YXBEZWxheSA9IHBhcnNlSW50ZXJ2YWwodmFsdWUuc2xpY2UoNSkpXG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS5pbmRleE9mKCdzZXR0bGU6JykgPT09IDApIHtcbiAgICAgICAgICAgIHN3YXBTcGVjLnNldHRsZURlbGF5ID0gcGFyc2VJbnRlcnZhbCh2YWx1ZS5zbGljZSg3KSlcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmluZGV4T2YoJ3RyYW5zaXRpb246JykgPT09IDApIHtcbiAgICAgICAgICAgIHN3YXBTcGVjLnRyYW5zaXRpb24gPSB2YWx1ZS5zbGljZSgxMSkgPT09ICd0cnVlJ1xuICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUuaW5kZXhPZignaWdub3JlVGl0bGU6JykgPT09IDApIHtcbiAgICAgICAgICAgIHN3YXBTcGVjLmlnbm9yZVRpdGxlID0gdmFsdWUuc2xpY2UoMTIpID09PSAndHJ1ZSdcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmluZGV4T2YoJ3Njcm9sbDonKSA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsU3BlYyA9IHZhbHVlLnNsaWNlKDcpXG4gICAgICAgICAgICB2YXIgc3BsaXRTcGVjID0gc2Nyb2xsU3BlYy5zcGxpdCgnOicpXG4gICAgICAgICAgICBjb25zdCBzY3JvbGxWYWwgPSBzcGxpdFNwZWMucG9wKClcbiAgICAgICAgICAgIHZhciBzZWxlY3RvclZhbCA9IHNwbGl0U3BlYy5sZW5ndGggPiAwID8gc3BsaXRTcGVjLmpvaW4oJzonKSA6IG51bGxcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHN3YXBTcGVjLnNjcm9sbCA9IHNjcm9sbFZhbFxuICAgICAgICAgICAgc3dhcFNwZWMuc2Nyb2xsVGFyZ2V0ID0gc2VsZWN0b3JWYWxcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmluZGV4T2YoJ3Nob3c6JykgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHNob3dTcGVjID0gdmFsdWUuc2xpY2UoNSlcbiAgICAgICAgICAgIHZhciBzcGxpdFNwZWMgPSBzaG93U3BlYy5zcGxpdCgnOicpXG4gICAgICAgICAgICBjb25zdCBzaG93VmFsID0gc3BsaXRTcGVjLnBvcCgpXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JWYWwgPSBzcGxpdFNwZWMubGVuZ3RoID4gMCA/IHNwbGl0U3BlYy5qb2luKCc6JykgOiBudWxsXG4gICAgICAgICAgICBzd2FwU3BlYy5zaG93ID0gc2hvd1ZhbFxuICAgICAgICAgICAgc3dhcFNwZWMuc2hvd1RhcmdldCA9IHNlbGVjdG9yVmFsXG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS5pbmRleE9mKCdmb2N1cy1zY3JvbGw6JykgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGZvY3VzU2Nyb2xsVmFsID0gdmFsdWUuc2xpY2UoJ2ZvY3VzLXNjcm9sbDonLmxlbmd0aClcbiAgICAgICAgICAgIHN3YXBTcGVjLmZvY3VzU2Nyb2xsID0gZm9jdXNTY3JvbGxWYWwgPT0gJ3RydWUnXG4gICAgICAgICAgfSBlbHNlIGlmIChpID09IDApIHtcbiAgICAgICAgICAgIHN3YXBTcGVjLnN3YXBTdHlsZSA9IHZhbHVlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZ0Vycm9yKCdVbmtub3duIG1vZGlmaWVyIGluIGh4LXN3YXA6ICcgKyB2YWx1ZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN3YXBTcGVjXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIHVzZXNGb3JtRGF0YShlbHQpIHtcbiAgICByZXR1cm4gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LWVuY29kaW5nJykgPT09ICdtdWx0aXBhcnQvZm9ybS1kYXRhJyB8fFxuICAgIChtYXRjaGVzKGVsdCwgJ2Zvcm0nKSAmJiBnZXRSYXdBdHRyaWJ1dGUoZWx0LCAnZW5jdHlwZScpID09PSAnbXVsdGlwYXJ0L2Zvcm0tZGF0YScpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtYTUxIdHRwUmVxdWVzdH0geGhyXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7Rm9ybURhdGF9IGZpbHRlcmVkUGFyYW1ldGVyc1xuICAgKiBAcmV0dXJucyB7KnxzdHJpbmd8bnVsbH1cbiAgICovXG4gIGZ1bmN0aW9uIGVuY29kZVBhcmFtc0ZvckJvZHkoeGhyLCBlbHQsIGZpbHRlcmVkUGFyYW1ldGVycykge1xuICAgIGxldCBlbmNvZGVkUGFyYW1ldGVycyA9IG51bGxcbiAgICB3aXRoRXh0ZW5zaW9ucyhlbHQsIGZ1bmN0aW9uKGV4dGVuc2lvbikge1xuICAgICAgaWYgKGVuY29kZWRQYXJhbWV0ZXJzID09IG51bGwpIHtcbiAgICAgICAgZW5jb2RlZFBhcmFtZXRlcnMgPSBleHRlbnNpb24uZW5jb2RlUGFyYW1ldGVycyh4aHIsIGZpbHRlcmVkUGFyYW1ldGVycywgZWx0KVxuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKGVuY29kZWRQYXJhbWV0ZXJzICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBlbmNvZGVkUGFyYW1ldGVyc1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodXNlc0Zvcm1EYXRhKGVsdCkpIHtcbiAgICAgICAgLy8gRm9yY2UgY29udmVyc2lvbiB0byBhbiBhY3R1YWwgRm9ybURhdGEgb2JqZWN0IGluIGNhc2UgZmlsdGVyZWRQYXJhbWV0ZXJzIGlzIGEgZm9ybURhdGFQcm94eVxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2JpZ3NreXNvZnR3YXJlL2h0bXgvaXNzdWVzLzIzMTdcbiAgICAgICAgcmV0dXJuIG92ZXJyaWRlRm9ybURhdGEobmV3IEZvcm1EYXRhKCksIGZvcm1EYXRhRnJvbU9iamVjdChmaWx0ZXJlZFBhcmFtZXRlcnMpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVybEVuY29kZShmaWx0ZXJlZFBhcmFtZXRlcnMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEByZXR1cm5zIHtIdG14U2V0dGxlSW5mb31cbiAqL1xuICBmdW5jdGlvbiBtYWtlU2V0dGxlSW5mbyh0YXJnZXQpIHtcbiAgICByZXR1cm4geyB0YXNrczogW10sIGVsdHM6IFt0YXJnZXRdIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnRbXX0gY29udGVudFxuICAgKiBAcGFyYW0ge0h0bXhTd2FwU3BlY2lmaWNhdGlvbn0gc3dhcFNwZWNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZVNjcm9sbFN0YXRlKGNvbnRlbnQsIHN3YXBTcGVjKSB7XG4gICAgY29uc3QgZmlyc3QgPSBjb250ZW50WzBdXG4gICAgY29uc3QgbGFzdCA9IGNvbnRlbnRbY29udGVudC5sZW5ndGggLSAxXVxuICAgIGlmIChzd2FwU3BlYy5zY3JvbGwpIHtcbiAgICAgIHZhciB0YXJnZXQgPSBudWxsXG4gICAgICBpZiAoc3dhcFNwZWMuc2Nyb2xsVGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldCA9IGFzRWxlbWVudChxdWVyeVNlbGVjdG9yRXh0KGZpcnN0LCBzd2FwU3BlYy5zY3JvbGxUYXJnZXQpKVxuICAgICAgfVxuICAgICAgaWYgKHN3YXBTcGVjLnNjcm9sbCA9PT0gJ3RvcCcgJiYgKGZpcnN0IHx8IHRhcmdldCkpIHtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IGZpcnN0XG4gICAgICAgIHRhcmdldC5zY3JvbGxUb3AgPSAwXG4gICAgICB9XG4gICAgICBpZiAoc3dhcFNwZWMuc2Nyb2xsID09PSAnYm90dG9tJyAmJiAobGFzdCB8fCB0YXJnZXQpKSB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCBsYXN0XG4gICAgICAgIHRhcmdldC5zY3JvbGxUb3AgPSB0YXJnZXQuc2Nyb2xsSGVpZ2h0XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHN3YXBTcGVjLnNjcm9sbCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgZ2V0V2luZG93KCkuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgLyoqIEB0eXBlIG51bWJlciAqLyAoc3dhcFNwZWMuc2Nyb2xsKSlcbiAgICAgICAgfSwgMCkgLy8gbmV4dCAndGljaycsIHNvIGJyb3dzZXIgaGFzIHRpbWUgdG8gcmVuZGVyIGxheW91dFxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3dhcFNwZWMuc2hvdykge1xuICAgICAgdmFyIHRhcmdldCA9IG51bGxcbiAgICAgIGlmIChzd2FwU3BlYy5zaG93VGFyZ2V0KSB7XG4gICAgICAgIGxldCB0YXJnZXRTdHIgPSBzd2FwU3BlYy5zaG93VGFyZ2V0XG4gICAgICAgIGlmIChzd2FwU3BlYy5zaG93VGFyZ2V0ID09PSAnd2luZG93Jykge1xuICAgICAgICAgIHRhcmdldFN0ciA9ICdib2R5J1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldCA9IGFzRWxlbWVudChxdWVyeVNlbGVjdG9yRXh0KGZpcnN0LCB0YXJnZXRTdHIpKVxuICAgICAgfVxuICAgICAgaWYgKHN3YXBTcGVjLnNob3cgPT09ICd0b3AnICYmIChmaXJzdCB8fCB0YXJnZXQpKSB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCBmaXJzdFxuICAgICAgICAvLyBAdHMtaWdub3JlIEZvciBzb21lIHJlYXNvbiB0c2MgZG9lc24ndCByZWNvZ25pemUgXCJpbnN0YW50XCIgYXMgYSB2YWxpZCBvcHRpb24gZm9yIG5vd1xuICAgICAgICB0YXJnZXQuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogJ3N0YXJ0JywgYmVoYXZpb3I6IGh0bXguY29uZmlnLnNjcm9sbEJlaGF2aW9yIH0pXG4gICAgICB9XG4gICAgICBpZiAoc3dhcFNwZWMuc2hvdyA9PT0gJ2JvdHRvbScgJiYgKGxhc3QgfHwgdGFyZ2V0KSkge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXQgfHwgbGFzdFxuICAgICAgICAvLyBAdHMtaWdub3JlIEZvciBzb21lIHJlYXNvbiB0c2MgZG9lc24ndCByZWNvZ25pemUgXCJpbnN0YW50XCIgYXMgYSB2YWxpZCBvcHRpb24gZm9yIG5vd1xuICAgICAgICB0YXJnZXQuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogJ2VuZCcsIGJlaGF2aW9yOiBodG14LmNvbmZpZy5zY3JvbGxCZWhhdmlvciB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSBldmFsQXNEZWZhdWx0XG4gKiBAcGFyYW0ge09iamVjdD19IHZhbHVlc1xuICogQHBhcmFtIHtFdmVudD19IGV2ZW50XG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG4gIGZ1bmN0aW9uIGdldFZhbHVlc0ZvckVsZW1lbnQoZWx0LCBhdHRyLCBldmFsQXNEZWZhdWx0LCB2YWx1ZXMsIGV2ZW50KSB7XG4gICAgaWYgKHZhbHVlcyA9PSBudWxsKSB7XG4gICAgICB2YWx1ZXMgPSB7fVxuICAgIH1cbiAgICBpZiAoZWx0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiB2YWx1ZXNcbiAgICB9XG4gICAgY29uc3QgYXR0cmlidXRlVmFsdWUgPSBnZXRBdHRyaWJ1dGVWYWx1ZShlbHQsIGF0dHIpXG4gICAgaWYgKGF0dHJpYnV0ZVZhbHVlKSB7XG4gICAgICBsZXQgc3RyID0gYXR0cmlidXRlVmFsdWUudHJpbSgpXG4gICAgICBsZXQgZXZhbHVhdGVWYWx1ZSA9IGV2YWxBc0RlZmF1bHRcbiAgICAgIGlmIChzdHIgPT09ICd1bnNldCcpIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignamF2YXNjcmlwdDonKSA9PT0gMCkge1xuICAgICAgICBzdHIgPSBzdHIuc2xpY2UoMTEpXG4gICAgICAgIGV2YWx1YXRlVmFsdWUgPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKHN0ci5pbmRleE9mKCdqczonKSA9PT0gMCkge1xuICAgICAgICBzdHIgPSBzdHIuc2xpY2UoMylcbiAgICAgICAgZXZhbHVhdGVWYWx1ZSA9IHRydWVcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZigneycpICE9PSAwKSB7XG4gICAgICAgIHN0ciA9ICd7JyArIHN0ciArICd9J1xuICAgICAgfVxuICAgICAgbGV0IHZhcnNWYWx1ZXNcbiAgICAgIGlmIChldmFsdWF0ZVZhbHVlKSB7XG4gICAgICAgIHZhcnNWYWx1ZXMgPSBtYXliZUV2YWwoZWx0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbignZXZlbnQnLCAncmV0dXJuICgnICsgc3RyICsgJyknKS5jYWxsKGVsdCwgZXZlbnQpXG4gICAgICAgICAgfSBlbHNlIHsgLy8gYWxsb3cgd2luZG93LmV2ZW50IHRvIGJlIGFjY2Vzc2libGVcbiAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbigncmV0dXJuICgnICsgc3RyICsgJyknKS5jYWxsKGVsdClcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHt9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyc1ZhbHVlcyA9IHBhcnNlSlNPTihzdHIpXG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiB2YXJzVmFsdWVzKSB7XG4gICAgICAgIGlmICh2YXJzVmFsdWVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAodmFsdWVzW2tleV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWVzW2tleV0gPSB2YXJzVmFsdWVzW2tleV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdldFZhbHVlc0ZvckVsZW1lbnQoYXNFbGVtZW50KHBhcmVudEVsdChlbHQpKSwgYXR0ciwgZXZhbEFzRGVmYXVsdCwgdmFsdWVzLCBldmVudClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fHN0cmluZ30gZWx0XG4gICAqIEBwYXJhbSB7KCkgPT4gYW55fSB0b0V2YWxcbiAgICogQHBhcmFtIHthbnk9fSBkZWZhdWx0VmFsXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqL1xuICBmdW5jdGlvbiBtYXliZUV2YWwoZWx0LCB0b0V2YWwsIGRlZmF1bHRWYWwpIHtcbiAgICBpZiAoaHRteC5jb25maWcuYWxsb3dFdmFsKSB7XG4gICAgICByZXR1cm4gdG9FdmFsKClcbiAgICB9IGVsc2Uge1xuICAgICAgdHJpZ2dlckVycm9yRXZlbnQoZWx0LCAnaHRteDpldmFsRGlzYWxsb3dlZEVycm9yJylcbiAgICAgIHJldHVybiBkZWZhdWx0VmFsXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICogQHBhcmFtIHtFdmVudD19IGV2ZW50XG4gKiBAcGFyYW0geyo/PX0gZXhwcmVzc2lvblZhcnNcbiAqIEByZXR1cm5zXG4gKi9cbiAgZnVuY3Rpb24gZ2V0SFhWYXJzRm9yRWxlbWVudChlbHQsIGV2ZW50LCBleHByZXNzaW9uVmFycykge1xuICAgIHJldHVybiBnZXRWYWx1ZXNGb3JFbGVtZW50KGVsdCwgJ2h4LXZhcnMnLCB0cnVlLCBleHByZXNzaW9uVmFycywgZXZlbnQpXG4gIH1cblxuICAvKipcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gKiBAcGFyYW0ge0V2ZW50PX0gZXZlbnRcbiAqIEBwYXJhbSB7Kj89fSBleHByZXNzaW9uVmFyc1xuICogQHJldHVybnNcbiAqL1xuICBmdW5jdGlvbiBnZXRIWFZhbHNGb3JFbGVtZW50KGVsdCwgZXZlbnQsIGV4cHJlc3Npb25WYXJzKSB7XG4gICAgcmV0dXJuIGdldFZhbHVlc0ZvckVsZW1lbnQoZWx0LCAnaHgtdmFscycsIGZhbHNlLCBleHByZXNzaW9uVmFycywgZXZlbnQpXG4gIH1cblxuICAvKipcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gKiBAcGFyYW0ge0V2ZW50PX0gZXZlbnRcbiAqIEByZXR1cm5zIHtGb3JtRGF0YX1cbiAqL1xuICBmdW5jdGlvbiBnZXRFeHByZXNzaW9uVmFycyhlbHQsIGV2ZW50KSB7XG4gICAgcmV0dXJuIG1lcmdlT2JqZWN0cyhnZXRIWFZhcnNGb3JFbGVtZW50KGVsdCwgZXZlbnQpLCBnZXRIWFZhbHNGb3JFbGVtZW50KGVsdCwgZXZlbnQpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3R9IHhoclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaGVhZGVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IGhlYWRlclZhbHVlXG4gICAqL1xuICBmdW5jdGlvbiBzYWZlbHlTZXRIZWFkZXJWYWx1ZSh4aHIsIGhlYWRlciwgaGVhZGVyVmFsdWUpIHtcbiAgICBpZiAoaGVhZGVyVmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgaGVhZGVyVmFsdWUpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBPbiBhbiBleGNlcHRpb24sIHRyeSB0byBzZXQgdGhlIGhlYWRlciBVUkkgZW5jb2RlZCBpbnN0ZWFkXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgZW5jb2RlVVJJQ29tcG9uZW50KGhlYWRlclZhbHVlKSlcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyICsgJy1VUkktQXV0b0VuY29kZWQnLCAndHJ1ZScpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3R9IHhoclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRQYXRoRnJvbVJlc3BvbnNlKHhocikge1xuICAgIGlmICh4aHIucmVzcG9uc2VVUkwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoeGhyLnJlc3BvbnNlVVJMKVxuICAgICAgICByZXR1cm4gdXJsLnBhdGhuYW1lICsgdXJsLnNlYXJjaFxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0cmlnZ2VyRXJyb3JFdmVudChnZXREb2N1bWVudCgpLmJvZHksICdodG14OmJhZFJlc3BvbnNlVXJsJywgeyB1cmw6IHhoci5yZXNwb25zZVVSTCB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1hNTEh0dHBSZXF1ZXN0fSB4aHJcbiAgICogQHBhcmFtIHtSZWdFeHB9IHJlZ2V4cFxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gaGFzSGVhZGVyKHhociwgcmVnZXhwKSB7XG4gICAgcmV0dXJuIHJlZ2V4cC50ZXN0KHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJc3N1ZXMgYW4gaHRteC1zdHlsZSBBSkFYIHJlcXVlc3RcbiAgICpcbiAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jYWpheFxuICAgKlxuICAgKiBAcGFyYW0ge0h0dHBWZXJifSB2ZXJiXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIHRoZSBVUkwgcGF0aCB0byBtYWtlIHRoZSBBSkFYXG4gICAqIEBwYXJhbSB7RWxlbWVudHxzdHJpbmd8SHRteEFqYXhIZWxwZXJDb250ZXh0fSBjb250ZXh0IHRoZSBlbGVtZW50IHRvIHRhcmdldCAoZGVmYXVsdHMgdG8gdGhlICoqYm9keSoqKSB8IGEgc2VsZWN0b3IgZm9yIHRoZSB0YXJnZXQgfCBhIGNvbnRleHQgb2JqZWN0IHRoYXQgY29udGFpbnMgYW55IG9mIHRoZSBmb2xsb3dpbmdcbiAgICogQHJldHVybiB7UHJvbWlzZTx2b2lkPn0gUHJvbWlzZSB0aGF0IHJlc29sdmVzIGltbWVkaWF0ZWx5IGlmIG5vIHJlcXVlc3QgaXMgc2VudCwgb3Igd2hlbiB0aGUgcmVxdWVzdCBpcyBjb21wbGV0ZVxuICAgKi9cbiAgZnVuY3Rpb24gYWpheEhlbHBlcih2ZXJiLCBwYXRoLCBjb250ZXh0KSB7XG4gICAgdmVyYiA9ICgvKiogQHR5cGUgSHR0cFZlcmIgKi8odmVyYi50b0xvd2VyQ2FzZSgpKSlcbiAgICBpZiAoY29udGV4dCkge1xuICAgICAgaWYgKGNvbnRleHQgaW5zdGFuY2VvZiBFbGVtZW50IHx8IHR5cGVvZiBjb250ZXh0ID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gaXNzdWVBamF4UmVxdWVzdCh2ZXJiLCBwYXRoLCBudWxsLCBudWxsLCB7XG4gICAgICAgICAgdGFyZ2V0T3ZlcnJpZGU6IHJlc29sdmVUYXJnZXQoY29udGV4dCkgfHwgRFVNTVlfRUxULFxuICAgICAgICAgIHJldHVyblByb21pc2U6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByZXNvbHZlZFRhcmdldCA9IHJlc29sdmVUYXJnZXQoY29udGV4dC50YXJnZXQpXG4gICAgICAgIC8vIElmIHRhcmdldCBpcyBzdXBwbGllZCBidXQgY2FuJ3QgcmVzb2x2ZSBPUiBzb3VyY2UgaXMgc3VwcGxpZWQgYnV0IGJvdGggdGFyZ2V0IGFuZCBzb3VyY2UgY2FuJ3QgYmUgcmVzb2x2ZWRcbiAgICAgICAgLy8gdGhlbiB1c2UgRFVNTVlfRUxUIHRvIGFib3J0IHRoZSByZXF1ZXN0IHdpdGggaHRteDp0YXJnZXRFcnJvciB0byBhdm9pZCBpdCByZXBsYWNpbmcgYm9keSBieSBtaXN0YWtlXG4gICAgICAgIGlmICgoY29udGV4dC50YXJnZXQgJiYgIXJlc29sdmVkVGFyZ2V0KSB8fCAoY29udGV4dC5zb3VyY2UgJiYgIXJlc29sdmVkVGFyZ2V0ICYmICFyZXNvbHZlVGFyZ2V0KGNvbnRleHQuc291cmNlKSkpIHtcbiAgICAgICAgICByZXNvbHZlZFRhcmdldCA9IERVTU1ZX0VMVFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc3N1ZUFqYXhSZXF1ZXN0KHZlcmIsIHBhdGgsIHJlc29sdmVUYXJnZXQoY29udGV4dC5zb3VyY2UpLCBjb250ZXh0LmV2ZW50LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhhbmRsZXI6IGNvbnRleHQuaGFuZGxlcixcbiAgICAgICAgICAgIGhlYWRlcnM6IGNvbnRleHQuaGVhZGVycyxcbiAgICAgICAgICAgIHZhbHVlczogY29udGV4dC52YWx1ZXMsXG4gICAgICAgICAgICB0YXJnZXRPdmVycmlkZTogcmVzb2x2ZWRUYXJnZXQsXG4gICAgICAgICAgICBzd2FwT3ZlcnJpZGU6IGNvbnRleHQuc3dhcCxcbiAgICAgICAgICAgIHNlbGVjdDogY29udGV4dC5zZWxlY3QsXG4gICAgICAgICAgICByZXR1cm5Qcm9taXNlOiB0cnVlLFxuICAgICAgICAgICAgcHVzaDogY29udGV4dC5wdXNoLFxuICAgICAgICAgICAgcmVwbGFjZTogY29udGV4dC5yZXBsYWNlLFxuICAgICAgICAgICAgc2VsZWN0T09COiBjb250ZXh0LnNlbGVjdE9PQlxuICAgICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpc3N1ZUFqYXhSZXF1ZXN0KHZlcmIsIHBhdGgsIG51bGwsIG51bGwsIHtcbiAgICAgICAgcmV0dXJuUHJvbWlzZTogdHJ1ZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHJldHVybiB7RWxlbWVudFtdfVxuICAgKi9cbiAgZnVuY3Rpb24gaGllcmFyY2h5Rm9yRWx0KGVsdCkge1xuICAgIGNvbnN0IGFyciA9IFtdXG4gICAgd2hpbGUgKGVsdCkge1xuICAgICAgYXJyLnB1c2goZWx0KVxuICAgICAgZWx0ID0gZWx0LnBhcmVudEVsZW1lbnRcbiAgICB9XG4gICAgcmV0dXJuIGFyclxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7SHRteFJlcXVlc3RDb25maWd9IHJlcXVlc3RDb25maWdcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGZ1bmN0aW9uIHZlcmlmeVBhdGgoZWx0LCBwYXRoLCByZXF1ZXN0Q29uZmlnKSB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChwYXRoLCBsb2NhdGlvbi5wcm90b2NvbCAhPT0gJ2Fib3V0OicgPyBsb2NhdGlvbi5ocmVmIDogd2luZG93Lm9yaWdpbilcbiAgICBjb25zdCBvcmlnaW4gPSBsb2NhdGlvbi5wcm90b2NvbCAhPT0gJ2Fib3V0OicgPyBsb2NhdGlvbi5vcmlnaW4gOiB3aW5kb3cub3JpZ2luXG4gICAgY29uc3Qgc2FtZUhvc3QgPSBvcmlnaW4gPT09IHVybC5vcmlnaW5cblxuICAgIGlmIChodG14LmNvbmZpZy5zZWxmUmVxdWVzdHNPbmx5KSB7XG4gICAgICBpZiAoIXNhbWVIb3N0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6dmFsaWRhdGVVcmwnLCBtZXJnZU9iamVjdHMoeyB1cmwsIHNhbWVIb3N0IH0sIHJlcXVlc3RDb25maWcpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fEZvcm1EYXRhfSBvYmpcbiAgICogQHJldHVybiB7Rm9ybURhdGF9XG4gICAqL1xuICBmdW5jdGlvbiBmb3JtRGF0YUZyb21PYmplY3Qob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIEZvcm1EYXRhKSByZXR1cm4gb2JqXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGlmIChvYmpba2V5XSAmJiB0eXBlb2Ygb2JqW2tleV0uZm9yRWFjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIG9ialtrZXldLmZvckVhY2goZnVuY3Rpb24odikgeyBmb3JtRGF0YS5hcHBlbmQoa2V5LCB2KSB9KVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ29iamVjdCcgJiYgIShvYmpba2V5XSBpbnN0YW5jZW9mIEJsb2IpKSB7XG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGtleSwgSlNPTi5zdHJpbmdpZnkob2JqW2tleV0pKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChrZXksIG9ialtrZXldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmb3JtRGF0YVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Rm9ybURhdGF9IGZvcm1EYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5XG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG4gIGZ1bmN0aW9uIGZvcm1EYXRhQXJyYXlQcm94eShmb3JtRGF0YSwgbmFtZSwgYXJyYXkpIHtcbiAgICAvLyBtdXRhdGluZyB0aGUgYXJyYXkgc2hvdWxkIG11dGF0ZSB0aGUgdW5kZXJseWluZyBmb3JtIGRhdGFcbiAgICByZXR1cm4gbmV3IFByb3h5KGFycmF5LCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKHRhcmdldCwga2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnbnVtYmVyJykgcmV0dXJuIHRhcmdldFtrZXldXG4gICAgICAgIGlmIChrZXkgPT09ICdsZW5ndGgnKSByZXR1cm4gdGFyZ2V0Lmxlbmd0aFxuICAgICAgICBpZiAoa2V5ID09PSAncHVzaCcpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHRhcmdldC5wdXNoKHZhbHVlKVxuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKG5hbWUsIHZhbHVlKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0uYXBwbHkodGFyZ2V0LCBhcmd1bWVudHMpXG4gICAgICAgICAgICBmb3JtRGF0YS5kZWxldGUobmFtZSlcbiAgICAgICAgICAgIHRhcmdldC5mb3JFYWNoKGZ1bmN0aW9uKHYpIHsgZm9ybURhdGEuYXBwZW5kKG5hbWUsIHYpIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldFtrZXldICYmIHRhcmdldFtrZXldLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHJldHVybiB0YXJnZXRba2V5XVswXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0YXJnZXRba2V5XVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbih0YXJnZXQsIGluZGV4LCB2YWx1ZSkge1xuICAgICAgICB0YXJnZXRbaW5kZXhdID0gdmFsdWVcbiAgICAgICAgZm9ybURhdGEuZGVsZXRlKG5hbWUpXG4gICAgICAgIHRhcmdldC5mb3JFYWNoKGZ1bmN0aW9uKHYpIHsgZm9ybURhdGEuYXBwZW5kKG5hbWUsIHYpIH0pXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0Zvcm1EYXRhfSBmb3JtRGF0YVxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgZnVuY3Rpb24gZm9ybURhdGFQcm94eShmb3JtRGF0YSkge1xuICAgIHJldHVybiBuZXcgUHJveHkoZm9ybURhdGEsIHtcbiAgICAgIGdldDogZnVuY3Rpb24odGFyZ2V0LCBuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgICAvLyBGb3J3YXJkIHN5bWJvbCBjYWxscyB0byB0aGUgRm9ybURhdGEgaXRzZWxmIGRpcmVjdGx5XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBuYW1lKVxuICAgICAgICAgIC8vIFdyYXAgaW4gZnVuY3Rpb24gd2l0aCBhcHBseSB0byBjb3JyZWN0bHkgYmluZCB0aGUgRm9ybURhdGEgY29udGV4dCwgYXMgYSBkaXJlY3QgY2FsbCB3b3VsZCByZXN1bHQgaW4gYW4gaWxsZWdhbCBpbnZvY2F0aW9uIGVycm9yXG4gICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5hcHBseShmb3JtRGF0YSwgYXJndW1lbnRzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuYW1lID09PSAndG9KU09OJykge1xuICAgICAgICAgIC8vIFN1cHBvcnQgSlNPTi5zdHJpbmdpZnkgY2FsbCBvbiBwcm94eVxuICAgICAgICAgIHJldHVybiAoKSA9PiBPYmplY3QuZnJvbUVudHJpZXMoZm9ybURhdGEpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hbWUgaW4gdGFyZ2V0KSB7XG4gICAgICAgICAgLy8gV3JhcCBpbiBmdW5jdGlvbiB3aXRoIGFwcGx5IHRvIGNvcnJlY3RseSBiaW5kIHRoZSBGb3JtRGF0YSBjb250ZXh0LCBhcyBhIGRpcmVjdCBjYWxsIHdvdWxkIHJlc3VsdCBpbiBhbiBpbGxlZ2FsIGludm9jYXRpb24gZXJyb3JcbiAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gZm9ybURhdGFbbmFtZV0uYXBwbHkoZm9ybURhdGEsIGFyZ3VtZW50cylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXJyYXkgPSBmb3JtRGF0YS5nZXRBbGwobmFtZSlcbiAgICAgICAgLy8gVGhvc2UgMiB1bmRlZmluZWQgJiBzaW5nbGUgdmFsdWUgcmV0dXJucyBhcmUgZm9yIHJldHJvLWNvbXBhdGliaWxpdHkgYXMgd2Ugd2VyZW4ndCB1c2luZyBGb3JtRGF0YSBiZWZvcmVcbiAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfSBlbHNlIGlmIChhcnJheS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gYXJyYXlbMF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZm9ybURhdGFBcnJheVByb3h5KHRhcmdldCwgbmFtZSwgYXJyYXkpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHRhcmdldC5kZWxldGUobmFtZSlcbiAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5mb3JFYWNoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdmFsdWUuZm9yRWFjaChmdW5jdGlvbih2KSB7IHRhcmdldC5hcHBlbmQobmFtZSwgdikgfSlcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICEodmFsdWUgaW5zdGFuY2VvZiBCbG9iKSkge1xuICAgICAgICAgIHRhcmdldC5hcHBlbmQobmFtZSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldC5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0sXG4gICAgICBkZWxldGVQcm9wZXJ0eTogZnVuY3Rpb24odGFyZ2V0LCBuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0YXJnZXQuZGVsZXRlKG5hbWUpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0sXG4gICAgICAvLyBTdXBwb3J0IE9iamVjdC5hc3NpZ24gY2FsbCBmcm9tIHByb3h5XG4gICAgICBvd25LZXlzOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyhPYmplY3QuZnJvbUVudHJpZXModGFyZ2V0KSlcbiAgICAgIH0sXG4gICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcCkge1xuICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoT2JqZWN0LmZyb21FbnRyaWVzKHRhcmdldCksIHByb3ApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0h0dHBWZXJifSB2ZXJiXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gICAqIEBwYXJhbSB7SHRteEFqYXhFdGN9IFtldGNdXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NvbmZpcm1lZF1cbiAgICogQHJldHVybiB7UHJvbWlzZTx2b2lkPn1cbiAgICovXG4gIGZ1bmN0aW9uIGlzc3VlQWpheFJlcXVlc3QodmVyYiwgcGF0aCwgZWx0LCBldmVudCwgZXRjLCBjb25maXJtZWQpIHtcbiAgICBsZXQgcmVzb2x2ZSA9IG51bGxcbiAgICBsZXQgcmVqZWN0ID0gbnVsbFxuICAgIGV0YyA9IGV0YyAhPSBudWxsID8gZXRjIDoge31cbiAgICBpZiAoZXRjLnJldHVyblByb21pc2UgJiYgdHlwZW9mIFByb21pc2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKF9yZXNvbHZlLCBfcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmUgPSBfcmVzb2x2ZVxuICAgICAgICByZWplY3QgPSBfcmVqZWN0XG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoZWx0ID09IG51bGwpIHtcbiAgICAgIGVsdCA9IGdldERvY3VtZW50KCkuYm9keVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZUhhbmRsZXIgPSBldGMuaGFuZGxlciB8fCBoYW5kbGVBamF4UmVzcG9uc2VcbiAgICBjb25zdCBzZWxlY3QgPSBldGMuc2VsZWN0IHx8IG51bGxcblxuICAgIGlmICghYm9keUNvbnRhaW5zKGVsdCkpIHtcbiAgICAvLyBkbyBub3QgaXNzdWUgcmVxdWVzdHMgZm9yIGVsZW1lbnRzIHJlbW92ZWQgZnJvbSB0aGUgRE9NXG4gICAgICBtYXliZUNhbGwocmVzb2x2ZSlcbiAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxuICAgIGNvbnN0IHRhcmdldCA9IGV0Yy50YXJnZXRPdmVycmlkZSB8fCBhc0VsZW1lbnQoZ2V0VGFyZ2V0KGVsdCkpXG4gICAgaWYgKHRhcmdldCA9PSBudWxsIHx8IHRhcmdldCA9PSBEVU1NWV9FTFQpIHtcbiAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6dGFyZ2V0RXJyb3InLCB7IHRhcmdldDogZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXRhcmdldCcpIH0pXG4gICAgICBtYXliZUNhbGwocmVqZWN0KVxuICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9XG5cbiAgICBsZXQgZWx0RGF0YSA9IGdldEludGVybmFsRGF0YShlbHQpXG4gICAgY29uc3Qgc3VibWl0dGVyID0gZWx0RGF0YS5sYXN0QnV0dG9uQ2xpY2tlZFxuXG4gICAgaWYgKHN1Ym1pdHRlcikge1xuICAgICAgY29uc3QgYnV0dG9uUGF0aCA9IGdldFJhd0F0dHJpYnV0ZShzdWJtaXR0ZXIsICdmb3JtYWN0aW9uJylcbiAgICAgIGlmIChidXR0b25QYXRoICE9IG51bGwpIHtcbiAgICAgICAgcGF0aCA9IGJ1dHRvblBhdGhcbiAgICAgIH1cblxuICAgICAgY29uc3QgYnV0dG9uVmVyYiA9IGdldFJhd0F0dHJpYnV0ZShzdWJtaXR0ZXIsICdmb3JtbWV0aG9kJylcbiAgICAgIGlmIChidXR0b25WZXJiICE9IG51bGwpIHtcbiAgICAgICAgaWYgKFZFUkJTLmluY2x1ZGVzKGJ1dHRvblZlcmIudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICB2ZXJiID0gKC8qKiBAdHlwZSBIdHRwVmVyYiAqLyhidXR0b25WZXJiKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXliZUNhbGwocmVzb2x2ZSlcbiAgICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY29uZmlybVF1ZXN0aW9uID0gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LWNvbmZpcm0nKVxuICAgIC8vIGFsbG93IGV2ZW50LWJhc2VkIGNvbmZpcm1hdGlvbiB3LyBhIGNhbGxiYWNrXG4gICAgaWYgKGNvbmZpcm1lZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBpc3N1ZVJlcXVlc3QgPSBmdW5jdGlvbihza2lwQ29uZmlybWF0aW9uKSB7XG4gICAgICAgIHJldHVybiBpc3N1ZUFqYXhSZXF1ZXN0KHZlcmIsIHBhdGgsIGVsdCwgZXZlbnQsIGV0YywgISFza2lwQ29uZmlybWF0aW9uKVxuICAgICAgfVxuICAgICAgY29uc3QgY29uZmlybURldGFpbHMgPSB7IHRhcmdldCwgZWx0LCBwYXRoLCB2ZXJiLCB0cmlnZ2VyaW5nRXZlbnQ6IGV2ZW50LCBldGMsIGlzc3VlUmVxdWVzdCwgcXVlc3Rpb246IGNvbmZpcm1RdWVzdGlvbiB9XG4gICAgICBpZiAodHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6Y29uZmlybScsIGNvbmZpcm1EZXRhaWxzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgbWF5YmVDYWxsKHJlc29sdmUpXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHN5bmNFbHQgPSBlbHRcbiAgICBsZXQgc3luY1N0cmF0ZWd5ID0gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXN5bmMnKVxuICAgIGxldCBxdWV1ZVN0cmF0ZWd5ID0gbnVsbFxuICAgIGxldCBhYm9ydGFibGUgPSBmYWxzZVxuICAgIGlmIChzeW5jU3RyYXRlZ3kpIHtcbiAgICAgIGNvbnN0IHN5bmNTdHJpbmdzID0gc3luY1N0cmF0ZWd5LnNwbGl0KCc6JylcbiAgICAgIGNvbnN0IHNlbGVjdG9yID0gc3luY1N0cmluZ3NbMF0udHJpbSgpXG4gICAgICBpZiAoc2VsZWN0b3IgPT09ICd0aGlzJykge1xuICAgICAgICBzeW5jRWx0ID0gZmluZFRoaXNFbGVtZW50KGVsdCwgJ2h4LXN5bmMnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3luY0VsdCA9IGFzRWxlbWVudChxdWVyeVNlbGVjdG9yRXh0KGVsdCwgc2VsZWN0b3IpKVxuICAgICAgfVxuICAgICAgLy8gZGVmYXVsdCB0byB0aGUgZHJvcCBzdHJhdGVneVxuICAgICAgc3luY1N0cmF0ZWd5ID0gKHN5bmNTdHJpbmdzWzFdIHx8ICdkcm9wJykudHJpbSgpXG4gICAgICBlbHREYXRhID0gZ2V0SW50ZXJuYWxEYXRhKHN5bmNFbHQpXG4gICAgICBpZiAoc3luY1N0cmF0ZWd5ID09PSAnZHJvcCcgJiYgZWx0RGF0YS54aHIgJiYgZWx0RGF0YS5hYm9ydGFibGUgIT09IHRydWUpIHtcbiAgICAgICAgbWF5YmVDYWxsKHJlc29sdmUpXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgICB9IGVsc2UgaWYgKHN5bmNTdHJhdGVneSA9PT0gJ2Fib3J0Jykge1xuICAgICAgICBpZiAoZWx0RGF0YS54aHIpIHtcbiAgICAgICAgICBtYXliZUNhbGwocmVzb2x2ZSlcbiAgICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFib3J0YWJsZSA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzeW5jU3RyYXRlZ3kgPT09ICdyZXBsYWNlJykge1xuICAgICAgICB0cmlnZ2VyRXZlbnQoc3luY0VsdCwgJ2h0bXg6YWJvcnQnKSAvLyBhYm9ydCB0aGUgY3VycmVudCByZXF1ZXN0IGFuZCBjb250aW51ZVxuICAgICAgfSBlbHNlIGlmIChzeW5jU3RyYXRlZ3kuaW5kZXhPZigncXVldWUnKSA9PT0gMCkge1xuICAgICAgICBjb25zdCBxdWV1ZVN0ckFycmF5ID0gc3luY1N0cmF0ZWd5LnNwbGl0KCcgJylcbiAgICAgICAgcXVldWVTdHJhdGVneSA9IChxdWV1ZVN0ckFycmF5WzFdIHx8ICdsYXN0JykudHJpbSgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGVsdERhdGEueGhyKSB7XG4gICAgICBpZiAoZWx0RGF0YS5hYm9ydGFibGUpIHtcbiAgICAgICAgdHJpZ2dlckV2ZW50KHN5bmNFbHQsICdodG14OmFib3J0JykgLy8gYWJvcnQgdGhlIGN1cnJlbnQgcmVxdWVzdCBhbmQgY29udGludWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChxdWV1ZVN0cmF0ZWd5ID09IG51bGwpIHtcbiAgICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50RGF0YSA9IGdldEludGVybmFsRGF0YShldmVudClcbiAgICAgICAgICAgIGlmIChldmVudERhdGEgJiYgZXZlbnREYXRhLnRyaWdnZXJTcGVjICYmIGV2ZW50RGF0YS50cmlnZ2VyU3BlYy5xdWV1ZSkge1xuICAgICAgICAgICAgICBxdWV1ZVN0cmF0ZWd5ID0gZXZlbnREYXRhLnRyaWdnZXJTcGVjLnF1ZXVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChxdWV1ZVN0cmF0ZWd5ID09IG51bGwpIHtcbiAgICAgICAgICAgIHF1ZXVlU3RyYXRlZ3kgPSAnbGFzdCdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsdERhdGEucXVldWVkUmVxdWVzdHMgPT0gbnVsbCkge1xuICAgICAgICAgIGVsdERhdGEucXVldWVkUmVxdWVzdHMgPSBbXVxuICAgICAgICB9XG4gICAgICAgIGlmIChxdWV1ZVN0cmF0ZWd5ID09PSAnZmlyc3QnICYmIGVsdERhdGEucXVldWVkUmVxdWVzdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgZWx0RGF0YS5xdWV1ZWRSZXF1ZXN0cy5wdXNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXNzdWVBamF4UmVxdWVzdCh2ZXJiLCBwYXRoLCBlbHQsIGV2ZW50LCBldGMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmIChxdWV1ZVN0cmF0ZWd5ID09PSAnYWxsJykge1xuICAgICAgICAgIGVsdERhdGEucXVldWVkUmVxdWVzdHMucHVzaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlzc3VlQWpheFJlcXVlc3QodmVyYiwgcGF0aCwgZWx0LCBldmVudCwgZXRjKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAocXVldWVTdHJhdGVneSA9PT0gJ2xhc3QnKSB7XG4gICAgICAgICAgZWx0RGF0YS5xdWV1ZWRSZXF1ZXN0cyA9IFtdIC8vIGR1bXAgZXhpc3RpbmcgcXVldWVcbiAgICAgICAgICBlbHREYXRhLnF1ZXVlZFJlcXVlc3RzLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpc3N1ZUFqYXhSZXF1ZXN0KHZlcmIsIHBhdGgsIGVsdCwgZXZlbnQsIGV0YylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIG1heWJlQ2FsbChyZXNvbHZlKVxuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgZWx0RGF0YS54aHIgPSB4aHJcbiAgICBlbHREYXRhLmFib3J0YWJsZSA9IGFib3J0YWJsZVxuICAgIGNvbnN0IGVuZFJlcXVlc3RMb2NrID0gZnVuY3Rpb24oKSB7XG4gICAgICBlbHREYXRhLnhociA9IG51bGxcbiAgICAgIGVsdERhdGEuYWJvcnRhYmxlID0gZmFsc2VcbiAgICAgIGlmIChlbHREYXRhLnF1ZXVlZFJlcXVlc3RzICE9IG51bGwgJiZcbiAgICAgIGVsdERhdGEucXVldWVkUmVxdWVzdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBxdWV1ZWRSZXF1ZXN0ID0gZWx0RGF0YS5xdWV1ZWRSZXF1ZXN0cy5zaGlmdCgpXG4gICAgICAgIHF1ZXVlZFJlcXVlc3QoKVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBwcm9tcHRRdWVzdGlvbiA9IGdldENsb3Nlc3RBdHRyaWJ1dGVWYWx1ZShlbHQsICdoeC1wcm9tcHQnKVxuICAgIGlmIChwcm9tcHRRdWVzdGlvbikge1xuICAgICAgdmFyIHByb21wdFJlc3BvbnNlID0gcHJvbXB0KHByb21wdFF1ZXN0aW9uKVxuICAgICAgLy8gcHJvbXB0IHJldHVybnMgbnVsbCBpZiBjYW5jZWxsZWQgYW5kIGVtcHR5IHN0cmluZyBpZiBhY2NlcHRlZCB3aXRoIG5vIGVudHJ5XG4gICAgICBpZiAocHJvbXB0UmVzcG9uc2UgPT09IG51bGwgfHxcbiAgICAgICF0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDpwcm9tcHQnLCB7IHByb21wdDogcHJvbXB0UmVzcG9uc2UsIHRhcmdldCB9KSkge1xuICAgICAgICBtYXliZUNhbGwocmVzb2x2ZSlcbiAgICAgICAgZW5kUmVxdWVzdExvY2soKVxuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb25maXJtUXVlc3Rpb24gJiYgIWNvbmZpcm1lZCkge1xuICAgICAgaWYgKCFjb25maXJtKGNvbmZpcm1RdWVzdGlvbikpIHtcbiAgICAgICAgbWF5YmVDYWxsKHJlc29sdmUpXG4gICAgICAgIGVuZFJlcXVlc3RMb2NrKClcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgaGVhZGVycyA9IGdldEhlYWRlcnMoZWx0LCB0YXJnZXQsIHByb21wdFJlc3BvbnNlKVxuXG4gICAgaWYgKHZlcmIgIT09ICdnZXQnICYmICF1c2VzRm9ybURhdGEoZWx0KSkge1xuICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgIH1cblxuICAgIGlmIChldGMuaGVhZGVycykge1xuICAgICAgaGVhZGVycyA9IG1lcmdlT2JqZWN0cyhoZWFkZXJzLCBldGMuaGVhZGVycylcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0cyA9IGdldElucHV0VmFsdWVzKGVsdCwgdmVyYilcbiAgICBsZXQgZXJyb3JzID0gcmVzdWx0cy5lcnJvcnNcbiAgICBjb25zdCByYXdGb3JtRGF0YSA9IHJlc3VsdHMuZm9ybURhdGFcbiAgICBpZiAoZXRjLnZhbHVlcykge1xuICAgICAgb3ZlcnJpZGVGb3JtRGF0YShyYXdGb3JtRGF0YSwgZm9ybURhdGFGcm9tT2JqZWN0KGV0Yy52YWx1ZXMpKVxuICAgIH1cbiAgICBjb25zdCBleHByZXNzaW9uVmFycyA9IGZvcm1EYXRhRnJvbU9iamVjdChnZXRFeHByZXNzaW9uVmFycyhlbHQsIGV2ZW50KSlcbiAgICBjb25zdCBhbGxGb3JtRGF0YSA9IG92ZXJyaWRlRm9ybURhdGEocmF3Rm9ybURhdGEsIGV4cHJlc3Npb25WYXJzKVxuICAgIGxldCBmaWx0ZXJlZEZvcm1EYXRhID0gZmlsdGVyVmFsdWVzKGFsbEZvcm1EYXRhLCBlbHQpXG5cbiAgICBpZiAoaHRteC5jb25maWcuZ2V0Q2FjaGVCdXN0ZXJQYXJhbSAmJiB2ZXJiID09PSAnZ2V0Jykge1xuICAgICAgZmlsdGVyZWRGb3JtRGF0YS5zZXQoJ29yZy5odG14LmNhY2hlLWJ1c3RlcicsIGdldFJhd0F0dHJpYnV0ZSh0YXJnZXQsICdpZCcpIHx8ICd0cnVlJylcbiAgICB9XG5cbiAgICAvLyBiZWhhdmlvciBvZiBhbmNob3JzIHcvIGVtcHR5IGhyZWYgaXMgdG8gdXNlIHRoZSBjdXJyZW50IFVSTFxuICAgIGlmIChwYXRoID09IG51bGwgfHwgcGF0aCA9PT0gJycpIHtcbiAgICAgIHBhdGggPSBsb2NhdGlvbi5ocmVmXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFtjcmVkZW50aWFsc11cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gW3RpbWVvdXRdXG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSBbbm9IZWFkZXJzXVxuICAgICAqL1xuICAgIGNvbnN0IHJlcXVlc3RBdHRyVmFsdWVzID0gZ2V0VmFsdWVzRm9yRWxlbWVudChlbHQsICdoeC1yZXF1ZXN0JylcblxuICAgIGNvbnN0IGVsdElzQm9vc3RlZCA9IGdldEludGVybmFsRGF0YShlbHQpLmJvb3N0ZWRcblxuICAgIGxldCB1c2VVcmxQYXJhbXMgPSBodG14LmNvbmZpZy5tZXRob2RzVGhhdFVzZVVybFBhcmFtcy5pbmRleE9mKHZlcmIpID49IDBcblxuICAgIC8qKiBAdHlwZSBIdG14UmVxdWVzdENvbmZpZyAqL1xuICAgIGNvbnN0IHJlcXVlc3RDb25maWcgPSB7XG4gICAgICBib29zdGVkOiBlbHRJc0Jvb3N0ZWQsXG4gICAgICB1c2VVcmxQYXJhbXMsXG4gICAgICBmb3JtRGF0YTogZmlsdGVyZWRGb3JtRGF0YSxcbiAgICAgIHBhcmFtZXRlcnM6IGZvcm1EYXRhUHJveHkoZmlsdGVyZWRGb3JtRGF0YSksXG4gICAgICB1bmZpbHRlcmVkRm9ybURhdGE6IGFsbEZvcm1EYXRhLFxuICAgICAgdW5maWx0ZXJlZFBhcmFtZXRlcnM6IGZvcm1EYXRhUHJveHkoYWxsRm9ybURhdGEpLFxuICAgICAgaGVhZGVycyxcbiAgICAgIGVsdCxcbiAgICAgIHRhcmdldCxcbiAgICAgIHZlcmIsXG4gICAgICBlcnJvcnMsXG4gICAgICB3aXRoQ3JlZGVudGlhbHM6IGV0Yy5jcmVkZW50aWFscyB8fCByZXF1ZXN0QXR0clZhbHVlcy5jcmVkZW50aWFscyB8fCBodG14LmNvbmZpZy53aXRoQ3JlZGVudGlhbHMsXG4gICAgICB0aW1lb3V0OiBldGMudGltZW91dCB8fCByZXF1ZXN0QXR0clZhbHVlcy50aW1lb3V0IHx8IGh0bXguY29uZmlnLnRpbWVvdXQsXG4gICAgICBwYXRoLFxuICAgICAgdHJpZ2dlcmluZ0V2ZW50OiBldmVudFxuICAgIH1cblxuICAgIGlmICghdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6Y29uZmlnUmVxdWVzdCcsIHJlcXVlc3RDb25maWcpKSB7XG4gICAgICBtYXliZUNhbGwocmVzb2x2ZSlcbiAgICAgIGVuZFJlcXVlc3RMb2NrKClcbiAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxuXG4gICAgLy8gY29weSBvdXQgaW4gY2FzZSB0aGUgb2JqZWN0IHdhcyBvdmVyd3JpdHRlblxuICAgIHBhdGggPSByZXF1ZXN0Q29uZmlnLnBhdGhcbiAgICB2ZXJiID0gcmVxdWVzdENvbmZpZy52ZXJiXG4gICAgaGVhZGVycyA9IHJlcXVlc3RDb25maWcuaGVhZGVyc1xuICAgIGZpbHRlcmVkRm9ybURhdGEgPSBmb3JtRGF0YUZyb21PYmplY3QocmVxdWVzdENvbmZpZy5wYXJhbWV0ZXJzKVxuICAgIGVycm9ycyA9IHJlcXVlc3RDb25maWcuZXJyb3JzXG4gICAgdXNlVXJsUGFyYW1zID0gcmVxdWVzdENvbmZpZy51c2VVcmxQYXJhbXNcblxuICAgIGlmIChlcnJvcnMgJiYgZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRyaWdnZXJFdmVudChlbHQsICdodG14OnZhbGlkYXRpb246aGFsdGVkJywgcmVxdWVzdENvbmZpZylcbiAgICAgIG1heWJlQ2FsbChyZXNvbHZlKVxuICAgICAgZW5kUmVxdWVzdExvY2soKVxuICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9XG5cbiAgICBjb25zdCBzcGxpdFBhdGggPSBwYXRoLnNwbGl0KCcjJylcbiAgICBjb25zdCBwYXRoTm9BbmNob3IgPSBzcGxpdFBhdGhbMF1cbiAgICBjb25zdCBhbmNob3IgPSBzcGxpdFBhdGhbMV1cblxuICAgIGxldCBmaW5hbFBhdGggPSBwYXRoXG4gICAgaWYgKHVzZVVybFBhcmFtcykge1xuICAgICAgZmluYWxQYXRoID0gcGF0aE5vQW5jaG9yXG4gICAgICBjb25zdCBoYXNWYWx1ZXMgPSAhZmlsdGVyZWRGb3JtRGF0YS5rZXlzKCkubmV4dCgpLmRvbmVcbiAgICAgIGlmIChoYXNWYWx1ZXMpIHtcbiAgICAgICAgaWYgKGZpbmFsUGF0aC5pbmRleE9mKCc/JykgPCAwKSB7XG4gICAgICAgICAgZmluYWxQYXRoICs9ICc/J1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbmFsUGF0aCArPSAnJidcbiAgICAgICAgfVxuICAgICAgICBmaW5hbFBhdGggKz0gdXJsRW5jb2RlKGZpbHRlcmVkRm9ybURhdGEpXG4gICAgICAgIGlmIChhbmNob3IpIHtcbiAgICAgICAgICBmaW5hbFBhdGggKz0gJyMnICsgYW5jaG9yXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXZlcmlmeVBhdGgoZWx0LCBmaW5hbFBhdGgsIHJlcXVlc3RDb25maWcpKSB7XG4gICAgICB0cmlnZ2VyRXJyb3JFdmVudChlbHQsICdodG14OmludmFsaWRQYXRoJywgcmVxdWVzdENvbmZpZylcbiAgICAgIG1heWJlQ2FsbChyZWplY3QpXG4gICAgICBlbmRSZXF1ZXN0TG9jaygpXG4gICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cblxuICAgIHhoci5vcGVuKHZlcmIudG9VcHBlckNhc2UoKSwgZmluYWxQYXRoLCB0cnVlKVxuICAgIHhoci5vdmVycmlkZU1pbWVUeXBlKCd0ZXh0L2h0bWwnKVxuICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSByZXF1ZXN0Q29uZmlnLndpdGhDcmVkZW50aWFsc1xuICAgIHhoci50aW1lb3V0ID0gcmVxdWVzdENvbmZpZy50aW1lb3V0XG5cbiAgICAvLyByZXF1ZXN0IGhlYWRlcnNcbiAgICBpZiAocmVxdWVzdEF0dHJWYWx1ZXMubm9IZWFkZXJzKSB7XG4gICAgLy8gaWdub3JlIGFsbCBoZWFkZXJzXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3QgaGVhZGVyIGluIGhlYWRlcnMpIHtcbiAgICAgICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoaGVhZGVyKSkge1xuICAgICAgICAgIGNvbnN0IGhlYWRlclZhbHVlID0gaGVhZGVyc1toZWFkZXJdXG4gICAgICAgICAgc2FmZWx5U2V0SGVhZGVyVmFsdWUoeGhyLCBoZWFkZXIsIGhlYWRlclZhbHVlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqIEB0eXBlIHtIdG14UmVzcG9uc2VJbmZvfSAqL1xuICAgIGNvbnN0IHJlc3BvbnNlSW5mbyA9IHtcbiAgICAgIHhocixcbiAgICAgIHRhcmdldCxcbiAgICAgIHJlcXVlc3RDb25maWcsXG4gICAgICBldGMsXG4gICAgICBib29zdGVkOiBlbHRJc0Jvb3N0ZWQsXG4gICAgICBzZWxlY3QsXG4gICAgICBwYXRoSW5mbzoge1xuICAgICAgICByZXF1ZXN0UGF0aDogcGF0aCxcbiAgICAgICAgZmluYWxSZXF1ZXN0UGF0aDogZmluYWxQYXRoLFxuICAgICAgICByZXNwb25zZVBhdGg6IG51bGwsXG4gICAgICAgIGFuY2hvclxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGhpZXJhcmNoeSA9IGhpZXJhcmNoeUZvckVsdChlbHQpXG4gICAgICAgIHJlc3BvbnNlSW5mby5wYXRoSW5mby5yZXNwb25zZVBhdGggPSBnZXRQYXRoRnJvbVJlc3BvbnNlKHhocilcbiAgICAgICAgcmVzcG9uc2VIYW5kbGVyKGVsdCwgcmVzcG9uc2VJbmZvKVxuICAgICAgICBpZiAocmVzcG9uc2VJbmZvLmtlZXBJbmRpY2F0b3JzICE9PSB0cnVlKSB7XG4gICAgICAgICAgcmVtb3ZlUmVxdWVzdEluZGljYXRvcnMoaW5kaWNhdG9ycywgZGlzYWJsZUVsdHMpXG4gICAgICAgIH1cbiAgICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6YWZ0ZXJSZXF1ZXN0JywgcmVzcG9uc2VJbmZvKVxuICAgICAgICB0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDphZnRlck9uTG9hZCcsIHJlc3BvbnNlSW5mbylcbiAgICAgICAgLy8gaWYgdGhlIGJvZHkgbm8gbG9uZ2VyIGNvbnRhaW5zIHRoZSBlbGVtZW50LCB0cmlnZ2VyIHRoZSBldmVudCBvbiB0aGUgY2xvc2VzdCBwYXJlbnRcbiAgICAgICAgLy8gcmVtYWluaW5nIGluIHRoZSBET01cbiAgICAgICAgaWYgKCFib2R5Q29udGFpbnMoZWx0KSkge1xuICAgICAgICAgIGxldCBzZWNvbmRhcnlUcmlnZ2VyRWx0ID0gbnVsbFxuICAgICAgICAgIHdoaWxlIChoaWVyYXJjaHkubGVuZ3RoID4gMCAmJiBzZWNvbmRhcnlUcmlnZ2VyRWx0ID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEVsdEluSGllcmFyY2h5ID0gaGllcmFyY2h5LnNoaWZ0KClcbiAgICAgICAgICAgIGlmIChib2R5Q29udGFpbnMocGFyZW50RWx0SW5IaWVyYXJjaHkpKSB7XG4gICAgICAgICAgICAgIHNlY29uZGFyeVRyaWdnZXJFbHQgPSBwYXJlbnRFbHRJbkhpZXJhcmNoeVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc2Vjb25kYXJ5VHJpZ2dlckVsdCkge1xuICAgICAgICAgICAgdHJpZ2dlckV2ZW50KHNlY29uZGFyeVRyaWdnZXJFbHQsICdodG14OmFmdGVyUmVxdWVzdCcsIHJlc3BvbnNlSW5mbylcbiAgICAgICAgICAgIHRyaWdnZXJFdmVudChzZWNvbmRhcnlUcmlnZ2VyRWx0LCAnaHRteDphZnRlck9uTG9hZCcsIHJlc3BvbnNlSW5mbylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWF5YmVDYWxsKHJlc29sdmUpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6b25Mb2FkRXJyb3InLCBtZXJnZU9iamVjdHMoeyBlcnJvcjogZSB9LCByZXNwb25zZUluZm8pKVxuICAgICAgICB0aHJvdyBlXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBlbmRSZXF1ZXN0TG9jaygpXG4gICAgICB9XG4gICAgfVxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZW1vdmVSZXF1ZXN0SW5kaWNhdG9ycyhpbmRpY2F0b3JzLCBkaXNhYmxlRWx0cylcbiAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6YWZ0ZXJSZXF1ZXN0JywgcmVzcG9uc2VJbmZvKVxuICAgICAgdHJpZ2dlckVycm9yRXZlbnQoZWx0LCAnaHRteDpzZW5kRXJyb3InLCByZXNwb25zZUluZm8pXG4gICAgICBtYXliZUNhbGwocmVqZWN0KVxuICAgICAgZW5kUmVxdWVzdExvY2soKVxuICAgIH1cbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVtb3ZlUmVxdWVzdEluZGljYXRvcnMoaW5kaWNhdG9ycywgZGlzYWJsZUVsdHMpXG4gICAgICB0cmlnZ2VyRXJyb3JFdmVudChlbHQsICdodG14OmFmdGVyUmVxdWVzdCcsIHJlc3BvbnNlSW5mbylcbiAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6c2VuZEFib3J0JywgcmVzcG9uc2VJbmZvKVxuICAgICAgbWF5YmVDYWxsKHJlamVjdClcbiAgICAgIGVuZFJlcXVlc3RMb2NrKClcbiAgICB9XG4gICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVtb3ZlUmVxdWVzdEluZGljYXRvcnMoaW5kaWNhdG9ycywgZGlzYWJsZUVsdHMpXG4gICAgICB0cmlnZ2VyRXJyb3JFdmVudChlbHQsICdodG14OmFmdGVyUmVxdWVzdCcsIHJlc3BvbnNlSW5mbylcbiAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6dGltZW91dCcsIHJlc3BvbnNlSW5mbylcbiAgICAgIG1heWJlQ2FsbChyZWplY3QpXG4gICAgICBlbmRSZXF1ZXN0TG9jaygpXG4gICAgfVxuICAgIGlmICghdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6YmVmb3JlUmVxdWVzdCcsIHJlc3BvbnNlSW5mbykpIHtcbiAgICAgIG1heWJlQ2FsbChyZXNvbHZlKVxuICAgICAgZW5kUmVxdWVzdExvY2soKVxuICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9XG4gICAgdmFyIGluZGljYXRvcnMgPSBhZGRSZXF1ZXN0SW5kaWNhdG9yQ2xhc3NlcyhlbHQpXG4gICAgdmFyIGRpc2FibGVFbHRzID0gZGlzYWJsZUVsZW1lbnRzKGVsdClcblxuICAgIGZvckVhY2goWydsb2Fkc3RhcnQnLCAnbG9hZGVuZCcsICdwcm9ncmVzcycsICdhYm9ydCddLCBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICAgIGZvckVhY2goW3hociwgeGhyLnVwbG9hZF0sIGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6eGhyOicgKyBldmVudE5hbWUsIHtcbiAgICAgICAgICAgIGxlbmd0aENvbXB1dGFibGU6IGV2ZW50Lmxlbmd0aENvbXB1dGFibGUsXG4gICAgICAgICAgICBsb2FkZWQ6IGV2ZW50LmxvYWRlZCxcbiAgICAgICAgICAgIHRvdGFsOiBldmVudC50b3RhbFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gICAgdHJpZ2dlckV2ZW50KGVsdCwgJ2h0bXg6YmVmb3JlU2VuZCcsIHJlc3BvbnNlSW5mbylcbiAgICBjb25zdCBwYXJhbXMgPSB1c2VVcmxQYXJhbXMgPyBudWxsIDogZW5jb2RlUGFyYW1zRm9yQm9keSh4aHIsIGVsdCwgZmlsdGVyZWRGb3JtRGF0YSlcbiAgICB4aHIuc2VuZChwYXJhbXMpXG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBIdG14SGlzdG9yeVVwZGF0ZVxuICAgKiBAcHJvcGVydHkge3N0cmluZ3xudWxsfSBbdHlwZV1cbiAgICogQHByb3BlcnR5IHtzdHJpbmd8bnVsbH0gW3BhdGhdXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcGFyYW0ge0h0bXhSZXNwb25zZUluZm99IHJlc3BvbnNlSW5mb1xuICAgKiBAcmV0dXJuIHtIdG14SGlzdG9yeVVwZGF0ZX1cbiAgICovXG4gIGZ1bmN0aW9uIGRldGVybWluZUhpc3RvcnlVcGRhdGVzKGVsdCwgcmVzcG9uc2VJbmZvKSB7XG4gICAgY29uc3QgeGhyID0gcmVzcG9uc2VJbmZvLnhoclxuXG4gICAgLy89ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEZpcnN0IGNvbnN1bHQgcmVzcG9uc2UgaGVhZGVyc1xuICAgIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBsZXQgcGF0aEZyb21IZWFkZXJzID0gbnVsbFxuICAgIGxldCB0eXBlRnJvbUhlYWRlcnMgPSBudWxsXG4gICAgaWYgKGhhc0hlYWRlcih4aHIsIC9IWC1QdXNoOi9pKSkge1xuICAgICAgcGF0aEZyb21IZWFkZXJzID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdIWC1QdXNoJylcbiAgICAgIHR5cGVGcm9tSGVhZGVycyA9ICdwdXNoJ1xuICAgIH0gZWxzZSBpZiAoaGFzSGVhZGVyKHhociwgL0hYLVB1c2gtVXJsOi9pKSkge1xuICAgICAgcGF0aEZyb21IZWFkZXJzID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdIWC1QdXNoLVVybCcpXG4gICAgICB0eXBlRnJvbUhlYWRlcnMgPSAncHVzaCdcbiAgICB9IGVsc2UgaWYgKGhhc0hlYWRlcih4aHIsIC9IWC1SZXBsYWNlLVVybDovaSkpIHtcbiAgICAgIHBhdGhGcm9tSGVhZGVycyA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignSFgtUmVwbGFjZS1VcmwnKVxuICAgICAgdHlwZUZyb21IZWFkZXJzID0gJ3JlcGxhY2UnXG4gICAgfVxuXG4gICAgLy8gaWYgdGhlcmUgd2FzIGEgcmVzcG9uc2UgaGVhZGVyLCB0aGF0IGhhcyBwcmlvcml0eVxuICAgIGlmIChwYXRoRnJvbUhlYWRlcnMpIHtcbiAgICAgIGlmIChwYXRoRnJvbUhlYWRlcnMgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IHR5cGVGcm9tSGVhZGVycyxcbiAgICAgICAgICBwYXRoOiBwYXRoRnJvbUhlYWRlcnNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBOZXh0IHJlc29sdmUgdmlhIERPTSB2YWx1ZXNcbiAgICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY29uc3QgcmVxdWVzdFBhdGggPSByZXNwb25zZUluZm8ucGF0aEluZm8uZmluYWxSZXF1ZXN0UGF0aFxuICAgIGNvbnN0IHJlc3BvbnNlUGF0aCA9IHJlc3BvbnNlSW5mby5wYXRoSW5mby5yZXNwb25zZVBhdGhcblxuICAgIGxldCBwdXNoVXJsID0gcmVzcG9uc2VJbmZvLmV0Yy5wdXNoIHx8IGdldENsb3Nlc3RBdHRyaWJ1dGVWYWx1ZShlbHQsICdoeC1wdXNoLXVybCcpXG4gICAgbGV0IHJlcGxhY2VVcmwgPSByZXNwb25zZUluZm8uZXRjLnJlcGxhY2UgfHwgZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXJlcGxhY2UtdXJsJylcbiAgICBpZiAocHVzaFVybCA9PT0gJ2ZhbHNlJykgcHVzaFVybCA9IG51bGxcbiAgICBpZiAocmVwbGFjZVVybCA9PT0gJ2ZhbHNlJykgcmVwbGFjZVVybCA9IG51bGxcbiAgICBjb25zdCBlbGVtZW50SXNCb29zdGVkID0gZ2V0SW50ZXJuYWxEYXRhKGVsdCkuYm9vc3RlZFxuXG4gICAgbGV0IHNhdmVUeXBlID0gbnVsbFxuICAgIGxldCBwYXRoID0gbnVsbFxuXG4gICAgaWYgKHB1c2hVcmwpIHtcbiAgICAgIHNhdmVUeXBlID0gJ3B1c2gnXG4gICAgICBwYXRoID0gcHVzaFVybFxuICAgIH0gZWxzZSBpZiAocmVwbGFjZVVybCkge1xuICAgICAgc2F2ZVR5cGUgPSAncmVwbGFjZSdcbiAgICAgIHBhdGggPSByZXBsYWNlVXJsXG4gICAgfSBlbHNlIGlmIChlbGVtZW50SXNCb29zdGVkKSB7XG4gICAgICBzYXZlVHlwZSA9ICdwdXNoJ1xuICAgICAgcGF0aCA9IHJlc3BvbnNlUGF0aCB8fCByZXF1ZXN0UGF0aCAvLyBpZiB0aGVyZSBpcyBubyByZXNwb25zZSBwYXRoLCBnbyB3aXRoIHRoZSBvcmlnaW5hbCByZXF1ZXN0IHBhdGhcbiAgICB9XG5cbiAgICBpZiAocGF0aCkge1xuICAgICAgLy8gdHJ1ZSBpbmRpY2F0ZXMgd2Ugd2FudCB0byBmb2xsb3cgd2hlcmV2ZXIgdGhlIHNlcnZlciBlbmRlZCB1cCBzZW5kaW5nIHVzXG4gICAgICBpZiAocGF0aCA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHBhdGggPSByZXNwb25zZVBhdGggfHwgcmVxdWVzdFBhdGggLy8gaWYgdGhlcmUgaXMgbm8gcmVzcG9uc2UgcGF0aCwgZ28gd2l0aCB0aGUgb3JpZ2luYWwgcmVxdWVzdCBwYXRoXG4gICAgICB9XG5cbiAgICAgIC8vIHJlc3RvcmUgYW55IGFuY2hvciBhc3NvY2lhdGVkIHdpdGggdGhlIHJlcXVlc3RcbiAgICAgIGlmIChyZXNwb25zZUluZm8ucGF0aEluZm8uYW5jaG9yICYmIHBhdGguaW5kZXhPZignIycpID09PSAtMSkge1xuICAgICAgICBwYXRoID0gcGF0aCArICcjJyArIHJlc3BvbnNlSW5mby5wYXRoSW5mby5hbmNob3JcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogc2F2ZVR5cGUsXG4gICAgICAgIHBhdGhcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SHRteFJlc3BvbnNlSGFuZGxpbmdDb25maWd9IHJlc3BvbnNlSGFuZGxpbmdDb25maWdcbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXR1c1xuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZnVuY3Rpb24gY29kZU1hdGNoZXMocmVzcG9uc2VIYW5kbGluZ0NvbmZpZywgc3RhdHVzKSB7XG4gICAgdmFyIHJlZ0V4cCA9IG5ldyBSZWdFeHAocmVzcG9uc2VIYW5kbGluZ0NvbmZpZy5jb2RlKVxuICAgIHJldHVybiByZWdFeHAudGVzdChzdGF0dXMudG9TdHJpbmcoMTApKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7WE1MSHR0cFJlcXVlc3R9IHhoclxuICAgKiBAcmV0dXJuIHtIdG14UmVzcG9uc2VIYW5kbGluZ0NvbmZpZ31cbiAgICovXG4gIGZ1bmN0aW9uIHJlc29sdmVSZXNwb25zZUhhbmRsaW5nKHhocikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaHRteC5jb25maWcucmVzcG9uc2VIYW5kbGluZy5sZW5ndGg7IGkrKykge1xuICAgICAgLyoqIEB0eXBlIEh0bXhSZXNwb25zZUhhbmRsaW5nQ29uZmlnICovXG4gICAgICB2YXIgcmVzcG9uc2VIYW5kbGluZ0VsZW1lbnQgPSBodG14LmNvbmZpZy5yZXNwb25zZUhhbmRsaW5nW2ldXG4gICAgICBpZiAoY29kZU1hdGNoZXMocmVzcG9uc2VIYW5kbGluZ0VsZW1lbnQsIHhoci5zdGF0dXMpKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZUhhbmRsaW5nRWxlbWVudFxuICAgICAgfVxuICAgIH1cbiAgICAvLyBubyBtYXRjaGVzLCByZXR1cm4gbm8gc3dhcFxuICAgIHJldHVybiB7XG4gICAgICBzd2FwOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcbiAgICovXG4gIGZ1bmN0aW9uIGhhbmRsZVRpdGxlKHRpdGxlKSB7XG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICBjb25zdCB0aXRsZUVsdCA9IGZpbmQoJ3RpdGxlJylcbiAgICAgIGlmICh0aXRsZUVsdCkge1xuICAgICAgICB0aXRsZUVsdC50ZXh0Q29udGVudCA9IHRpdGxlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSB0aXRsZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvdmUgdGhlIFJldGFyZ2V0IHNlbGVjdG9yIGFuZCB0aHJvdyBpZiBub3QgZm91bmRcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbHRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldFxuICAgKiBAcmV0dXJucyB7RWxlbWVudH1cbiAgICovXG4gIGZ1bmN0aW9uIHJlc29sdmVSZXRhcmdldChlbHQsIHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQgPT09ICd0aGlzJykge1xuICAgICAgcmV0dXJuIGVsdFxuICAgIH1cbiAgICBjb25zdCByZXNvbHZlZFRhcmdldCA9IGFzRWxlbWVudChxdWVyeVNlbGVjdG9yRXh0KGVsdCwgdGFyZ2V0KSlcbiAgICBpZiAocmVzb2x2ZWRUYXJnZXQgPT0gbnVsbCkge1xuICAgICAgdHJpZ2dlckVycm9yRXZlbnQoZWx0LCAnaHRteDp0YXJnZXRFcnJvcicsIHsgdGFyZ2V0IH0pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcmUtdGFyZ2V0ICR7dGFyZ2V0fWApXG4gICAgfVxuICAgIHJldHVybiByZXNvbHZlZFRhcmdldFxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWx0XG4gICAqIEBwYXJhbSB7SHRteFJlc3BvbnNlSW5mb30gcmVzcG9uc2VJbmZvXG4gICAqL1xuICBmdW5jdGlvbiBoYW5kbGVBamF4UmVzcG9uc2UoZWx0LCByZXNwb25zZUluZm8pIHtcbiAgICBjb25zdCB4aHIgPSByZXNwb25zZUluZm8ueGhyXG4gICAgbGV0IHRhcmdldCA9IHJlc3BvbnNlSW5mby50YXJnZXRcbiAgICBjb25zdCBldGMgPSByZXNwb25zZUluZm8uZXRjXG4gICAgY29uc3QgcmVzcG9uc2VJbmZvU2VsZWN0ID0gcmVzcG9uc2VJbmZvLnNlbGVjdFxuXG4gICAgaWYgKCF0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDpiZWZvcmVPbkxvYWQnLCByZXNwb25zZUluZm8pKSByZXR1cm5cblxuICAgIGlmIChoYXNIZWFkZXIoeGhyLCAvSFgtVHJpZ2dlcjovaSkpIHtcbiAgICAgIGhhbmRsZVRyaWdnZXJIZWFkZXIoeGhyLCAnSFgtVHJpZ2dlcicsIGVsdClcbiAgICB9XG5cbiAgICBpZiAoaGFzSGVhZGVyKHhociwgL0hYLUxvY2F0aW9uOi9pKSkge1xuICAgICAgbGV0IHJlZGlyZWN0UGF0aCA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignSFgtTG9jYXRpb24nKVxuICAgICAgLyoqIEB0eXBlIHtIdG14QWpheEhlbHBlckNvbnRleHQme3BhdGg/OnN0cmluZ319ICovXG4gICAgICB2YXIgcmVkaXJlY3RTd2FwU3BlYyA9IHt9XG4gICAgICBpZiAocmVkaXJlY3RQYXRoLmluZGV4T2YoJ3snKSA9PT0gMCkge1xuICAgICAgICByZWRpcmVjdFN3YXBTcGVjID0gcGFyc2VKU09OKHJlZGlyZWN0UGF0aClcbiAgICAgICAgLy8gd2hhdCdzIHRoZSBiZXN0IHdheSB0byB0aHJvdyBhbiBlcnJvciBpZiB0aGUgdXNlciBkaWRuJ3QgaW5jbHVkZSB0aGlzXG4gICAgICAgIHJlZGlyZWN0UGF0aCA9IHJlZGlyZWN0U3dhcFNwZWMucGF0aFxuICAgICAgICBkZWxldGUgcmVkaXJlY3RTd2FwU3BlYy5wYXRoXG4gICAgICB9XG4gICAgICByZWRpcmVjdFN3YXBTcGVjLnB1c2ggPSByZWRpcmVjdFN3YXBTcGVjLnB1c2ggPz8gJ3RydWUnXG4gICAgICBhamF4SGVscGVyKCdnZXQnLCByZWRpcmVjdFBhdGgsIHJlZGlyZWN0U3dhcFNwZWMpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBzaG91bGRSZWZyZXNoID0gaGFzSGVhZGVyKHhociwgL0hYLVJlZnJlc2g6L2kpICYmIHhoci5nZXRSZXNwb25zZUhlYWRlcignSFgtUmVmcmVzaCcpID09PSAndHJ1ZSdcblxuICAgIGlmIChoYXNIZWFkZXIoeGhyLCAvSFgtUmVkaXJlY3Q6L2kpKSB7XG4gICAgICByZXNwb25zZUluZm8ua2VlcEluZGljYXRvcnMgPSB0cnVlXG4gICAgICBodG14LmxvY2F0aW9uLmhyZWYgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0hYLVJlZGlyZWN0JylcbiAgICAgIHNob3VsZFJlZnJlc2ggJiYgaHRteC5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHNob3VsZFJlZnJlc2gpIHtcbiAgICAgIHJlc3BvbnNlSW5mby5rZWVwSW5kaWNhdG9ycyA9IHRydWVcbiAgICAgIGh0bXgubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGhpc3RvcnlVcGRhdGUgPSBkZXRlcm1pbmVIaXN0b3J5VXBkYXRlcyhlbHQsIHJlc3BvbnNlSW5mbylcblxuICAgIGNvbnN0IHJlc3BvbnNlSGFuZGxpbmcgPSByZXNvbHZlUmVzcG9uc2VIYW5kbGluZyh4aHIpXG4gICAgY29uc3Qgc2hvdWxkU3dhcCA9IHJlc3BvbnNlSGFuZGxpbmcuc3dhcFxuICAgIGxldCBpc0Vycm9yID0gISFyZXNwb25zZUhhbmRsaW5nLmVycm9yXG4gICAgbGV0IGlnbm9yZVRpdGxlID0gaHRteC5jb25maWcuaWdub3JlVGl0bGUgfHwgcmVzcG9uc2VIYW5kbGluZy5pZ25vcmVUaXRsZVxuICAgIGxldCBzZWxlY3RPdmVycmlkZSA9IHJlc3BvbnNlSGFuZGxpbmcuc2VsZWN0XG4gICAgaWYgKHJlc3BvbnNlSGFuZGxpbmcudGFyZ2V0KSB7XG4gICAgICByZXNwb25zZUluZm8udGFyZ2V0ID0gcmVzb2x2ZVJldGFyZ2V0KGVsdCwgcmVzcG9uc2VIYW5kbGluZy50YXJnZXQpXG4gICAgfVxuICAgIHZhciBzd2FwT3ZlcnJpZGUgPSBldGMuc3dhcE92ZXJyaWRlXG4gICAgaWYgKHN3YXBPdmVycmlkZSA9PSBudWxsICYmIHJlc3BvbnNlSGFuZGxpbmcuc3dhcE92ZXJyaWRlKSB7XG4gICAgICBzd2FwT3ZlcnJpZGUgPSByZXNwb25zZUhhbmRsaW5nLnN3YXBPdmVycmlkZVxuICAgIH1cblxuICAgIC8vIHJlc3BvbnNlIGhlYWRlcnMgb3ZlcnJpZGUgcmVzcG9uc2UgaGFuZGxpbmcgY29uZmlnXG4gICAgaWYgKGhhc0hlYWRlcih4aHIsIC9IWC1SZXRhcmdldDovaSkpIHtcbiAgICAgIHJlc3BvbnNlSW5mby50YXJnZXQgPSByZXNvbHZlUmV0YXJnZXQoZWx0LCB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0hYLVJldGFyZ2V0JykpXG4gICAgfVxuXG4gICAgaWYgKGhhc0hlYWRlcih4aHIsIC9IWC1SZXN3YXA6L2kpKSB7XG4gICAgICBzd2FwT3ZlcnJpZGUgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0hYLVJlc3dhcCcpXG4gICAgfVxuXG4gICAgdmFyIHNlcnZlclJlc3BvbnNlID0geGhyLnJlc3BvbnNlXG4gICAgLyoqIEB0eXBlIEh0bXhCZWZvcmVTd2FwRGV0YWlscyAqL1xuICAgIHZhciBiZWZvcmVTd2FwRGV0YWlscyA9IG1lcmdlT2JqZWN0cyh7XG4gICAgICBzaG91bGRTd2FwLFxuICAgICAgc2VydmVyUmVzcG9uc2UsXG4gICAgICBpc0Vycm9yLFxuICAgICAgaWdub3JlVGl0bGUsXG4gICAgICBzZWxlY3RPdmVycmlkZSxcbiAgICAgIHN3YXBPdmVycmlkZVxuICAgIH0sIHJlc3BvbnNlSW5mbylcblxuICAgIGlmIChyZXNwb25zZUhhbmRsaW5nLmV2ZW50ICYmICF0cmlnZ2VyRXZlbnQodGFyZ2V0LCByZXNwb25zZUhhbmRsaW5nLmV2ZW50LCBiZWZvcmVTd2FwRGV0YWlscykpIHJldHVyblxuXG4gICAgaWYgKCF0cmlnZ2VyRXZlbnQodGFyZ2V0LCAnaHRteDpiZWZvcmVTd2FwJywgYmVmb3JlU3dhcERldGFpbHMpKSByZXR1cm5cblxuICAgIHRhcmdldCA9IGJlZm9yZVN3YXBEZXRhaWxzLnRhcmdldCAvLyBhbGxvdyByZS10YXJnZXRpbmdcbiAgICBzZXJ2ZXJSZXNwb25zZSA9IGJlZm9yZVN3YXBEZXRhaWxzLnNlcnZlclJlc3BvbnNlIC8vIGFsbG93IHVwZGF0aW5nIGNvbnRlbnRcbiAgICBpc0Vycm9yID0gYmVmb3JlU3dhcERldGFpbHMuaXNFcnJvciAvLyBhbGxvdyB1cGRhdGluZyBlcnJvclxuICAgIGlnbm9yZVRpdGxlID0gYmVmb3JlU3dhcERldGFpbHMuaWdub3JlVGl0bGUgLy8gYWxsb3cgdXBkYXRpbmcgaWdub3JpbmcgdGl0bGVcbiAgICBzZWxlY3RPdmVycmlkZSA9IGJlZm9yZVN3YXBEZXRhaWxzLnNlbGVjdE92ZXJyaWRlIC8vIGFsbG93IHVwZGF0aW5nIHNlbGVjdCBvdmVycmlkZVxuICAgIHN3YXBPdmVycmlkZSA9IGJlZm9yZVN3YXBEZXRhaWxzLnN3YXBPdmVycmlkZSAvLyBhbGxvdyB1cGRhdGluZyBzd2FwIG92ZXJyaWRlXG5cbiAgICByZXNwb25zZUluZm8udGFyZ2V0ID0gdGFyZ2V0IC8vIE1ha2UgdXBkYXRlZCB0YXJnZXQgYXZhaWxhYmxlIHRvIHJlc3BvbnNlIGV2ZW50c1xuICAgIHJlc3BvbnNlSW5mby5mYWlsZWQgPSBpc0Vycm9yIC8vIE1ha2UgZmFpbGVkIHByb3BlcnR5IGF2YWlsYWJsZSB0byByZXNwb25zZSBldmVudHNcbiAgICByZXNwb25zZUluZm8uc3VjY2Vzc2Z1bCA9ICFpc0Vycm9yIC8vIE1ha2Ugc3VjY2Vzc2Z1bCBwcm9wZXJ0eSBhdmFpbGFibGUgdG8gcmVzcG9uc2UgZXZlbnRzXG5cbiAgICBpZiAoYmVmb3JlU3dhcERldGFpbHMuc2hvdWxkU3dhcCkge1xuICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDI4Nikge1xuICAgICAgICBjYW5jZWxQb2xsaW5nKGVsdClcbiAgICAgIH1cblxuICAgICAgd2l0aEV4dGVuc2lvbnMoZWx0LCBmdW5jdGlvbihleHRlbnNpb24pIHtcbiAgICAgICAgc2VydmVyUmVzcG9uc2UgPSBleHRlbnNpb24udHJhbnNmb3JtUmVzcG9uc2Uoc2VydmVyUmVzcG9uc2UsIHhociwgZWx0KVxuICAgICAgfSlcblxuICAgICAgLy8gU2F2ZSBjdXJyZW50IHBhZ2UgaWYgdGhlcmUgd2lsbCBiZSBhIGhpc3RvcnkgdXBkYXRlXG4gICAgICBpZiAoaGlzdG9yeVVwZGF0ZS50eXBlKSB7XG4gICAgICAgIHNhdmVDdXJyZW50UGFnZVRvSGlzdG9yeSgpXG4gICAgICB9XG5cbiAgICAgIHZhciBzd2FwU3BlYyA9IGdldFN3YXBTcGVjaWZpY2F0aW9uKGVsdCwgc3dhcE92ZXJyaWRlKVxuXG4gICAgICBpZiAoIXN3YXBTcGVjLmhhc093blByb3BlcnR5KCdpZ25vcmVUaXRsZScpKSB7XG4gICAgICAgIHN3YXBTcGVjLmlnbm9yZVRpdGxlID0gaWdub3JlVGl0bGVcbiAgICAgIH1cblxuICAgICAgYWRkQ2xhc3NUb0VsZW1lbnQodGFyZ2V0LCBodG14LmNvbmZpZy5zd2FwcGluZ0NsYXNzKVxuXG4gICAgICBpZiAocmVzcG9uc2VJbmZvU2VsZWN0KSB7XG4gICAgICAgIHNlbGVjdE92ZXJyaWRlID0gcmVzcG9uc2VJbmZvU2VsZWN0XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNIZWFkZXIoeGhyLCAvSFgtUmVzZWxlY3Q6L2kpKSB7XG4gICAgICAgIHNlbGVjdE92ZXJyaWRlID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdIWC1SZXNlbGVjdCcpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNlbGVjdE9PQiA9IGV0Yy5zZWxlY3RPT0IgfHwgZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXNlbGVjdC1vb2InKVxuICAgICAgY29uc3Qgc2VsZWN0ID0gZ2V0Q2xvc2VzdEF0dHJpYnV0ZVZhbHVlKGVsdCwgJ2h4LXNlbGVjdCcpXG5cbiAgICAgIHN3YXAodGFyZ2V0LCBzZXJ2ZXJSZXNwb25zZSwgc3dhcFNwZWMsIHtcbiAgICAgICAgc2VsZWN0OiBzZWxlY3RPdmVycmlkZSA9PT0gJ3Vuc2V0JyA/IG51bGwgOiBzZWxlY3RPdmVycmlkZSB8fCBzZWxlY3QsXG4gICAgICAgIHNlbGVjdE9PQixcbiAgICAgICAgZXZlbnRJbmZvOiByZXNwb25zZUluZm8sXG4gICAgICAgIGFuY2hvcjogcmVzcG9uc2VJbmZvLnBhdGhJbmZvLmFuY2hvcixcbiAgICAgICAgY29udGV4dEVsZW1lbnQ6IGVsdCxcbiAgICAgICAgYWZ0ZXJTd2FwQ2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChoYXNIZWFkZXIoeGhyLCAvSFgtVHJpZ2dlci1BZnRlci1Td2FwOi9pKSkge1xuICAgICAgICAgICAgbGV0IGZpbmFsRWx0ID0gZWx0XG4gICAgICAgICAgICBpZiAoIWJvZHlDb250YWlucyhlbHQpKSB7XG4gICAgICAgICAgICAgIGZpbmFsRWx0ID0gZ2V0RG9jdW1lbnQoKS5ib2R5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYW5kbGVUcmlnZ2VySGVhZGVyKHhociwgJ0hYLVRyaWdnZXItQWZ0ZXItU3dhcCcsIGZpbmFsRWx0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYWZ0ZXJTZXR0bGVDYWxsYmFjazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGhhc0hlYWRlcih4aHIsIC9IWC1UcmlnZ2VyLUFmdGVyLVNldHRsZTovaSkpIHtcbiAgICAgICAgICAgIGxldCBmaW5hbEVsdCA9IGVsdFxuICAgICAgICAgICAgaWYgKCFib2R5Q29udGFpbnMoZWx0KSkge1xuICAgICAgICAgICAgICBmaW5hbEVsdCA9IGdldERvY3VtZW50KCkuYm9keVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFuZGxlVHJpZ2dlckhlYWRlcih4aHIsICdIWC1UcmlnZ2VyLUFmdGVyLVNldHRsZScsIGZpbmFsRWx0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYmVmb3JlU3dhcENhbGxiYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAvLyBpZiB3ZSBuZWVkIHRvIHNhdmUgaGlzdG9yeSwgZG8gc28sIGJlZm9yZSBzd2FwcGluZyBzbyB0aGF0IHJlbGF0aXZlIHJlc291cmNlcyBoYXZlIHRoZSBjb3JyZWN0IGJhc2UgVVJMXG4gICAgICAgICAgaWYgKGhpc3RvcnlVcGRhdGUudHlwZSkge1xuICAgICAgICAgICAgdHJpZ2dlckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6YmVmb3JlSGlzdG9yeVVwZGF0ZScsIG1lcmdlT2JqZWN0cyh7IGhpc3Rvcnk6IGhpc3RvcnlVcGRhdGUgfSwgcmVzcG9uc2VJbmZvKSlcbiAgICAgICAgICAgIGlmIChoaXN0b3J5VXBkYXRlLnR5cGUgPT09ICdwdXNoJykge1xuICAgICAgICAgICAgICBwdXNoVXJsSW50b0hpc3RvcnkoaGlzdG9yeVVwZGF0ZS5wYXRoKVxuICAgICAgICAgICAgICB0cmlnZ2VyRXZlbnQoZ2V0RG9jdW1lbnQoKS5ib2R5LCAnaHRteDpwdXNoZWRJbnRvSGlzdG9yeScsIHsgcGF0aDogaGlzdG9yeVVwZGF0ZS5wYXRoIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXBsYWNlVXJsSW5IaXN0b3J5KGhpc3RvcnlVcGRhdGUucGF0aClcbiAgICAgICAgICAgICAgdHJpZ2dlckV2ZW50KGdldERvY3VtZW50KCkuYm9keSwgJ2h0bXg6cmVwbGFjZWRJbkhpc3RvcnknLCB7IHBhdGg6IGhpc3RvcnlVcGRhdGUucGF0aCB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IpIHtcbiAgICAgIHRyaWdnZXJFcnJvckV2ZW50KGVsdCwgJ2h0bXg6cmVzcG9uc2VFcnJvcicsIG1lcmdlT2JqZWN0cyh7IGVycm9yOiAnUmVzcG9uc2UgU3RhdHVzIEVycm9yIENvZGUgJyArIHhoci5zdGF0dXMgKyAnIGZyb20gJyArIHJlc3BvbnNlSW5mby5wYXRoSW5mby5yZXF1ZXN0UGF0aCB9LCByZXNwb25zZUluZm8pKVxuICAgIH1cbiAgfVxuXG4gIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEV4dGVuc2lvbnMgQVBJXG4gIC8vPSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqIEB0eXBlIHtPYmplY3Q8c3RyaW5nLCBIdG14RXh0ZW5zaW9uPn0gKi9cbiAgY29uc3QgZXh0ZW5zaW9ucyA9IHt9XG5cbiAgLyoqXG4gICAqIGV4dGVuc2lvbkJhc2UgZGVmaW5lcyB0aGUgZGVmYXVsdCBmdW5jdGlvbnMgZm9yIGFsbCBleHRlbnNpb25zLlxuICAgKiBAcmV0dXJucyB7SHRteEV4dGVuc2lvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGV4dGVuc2lvbkJhc2UoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGluaXQ6IGZ1bmN0aW9uKGFwaSkgeyByZXR1cm4gbnVsbCB9LFxuICAgICAgZ2V0U2VsZWN0b3JzOiBmdW5jdGlvbigpIHsgcmV0dXJuIG51bGwgfSxcbiAgICAgIG9uRXZlbnQ6IGZ1bmN0aW9uKG5hbWUsIGV2dCkgeyByZXR1cm4gdHJ1ZSB9LFxuICAgICAgdHJhbnNmb3JtUmVzcG9uc2U6IGZ1bmN0aW9uKHRleHQsIHhociwgZWx0KSB7IHJldHVybiB0ZXh0IH0sXG4gICAgICBpc0lubGluZVN3YXA6IGZ1bmN0aW9uKHN3YXBTdHlsZSkgeyByZXR1cm4gZmFsc2UgfSxcbiAgICAgIGhhbmRsZVN3YXA6IGZ1bmN0aW9uKHN3YXBTdHlsZSwgdGFyZ2V0LCBmcmFnbWVudCwgc2V0dGxlSW5mbykgeyByZXR1cm4gZmFsc2UgfSxcbiAgICAgIGVuY29kZVBhcmFtZXRlcnM6IGZ1bmN0aW9uKHhociwgcGFyYW1ldGVycywgZWx0KSB7IHJldHVybiBudWxsIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogZGVmaW5lRXh0ZW5zaW9uIGluaXRpYWxpemVzIHRoZSBleHRlbnNpb24gYW5kIGFkZHMgaXQgdG8gdGhlIGh0bXggcmVnaXN0cnlcbiAgICpcbiAgICogQHNlZSBodHRwczovL2h0bXgub3JnL2FwaS8jZGVmaW5lRXh0ZW5zaW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSBleHRlbnNpb24gbmFtZVxuICAgKiBAcGFyYW0ge1BhcnRpYWw8SHRteEV4dGVuc2lvbj59IGV4dGVuc2lvbiB0aGUgZXh0ZW5zaW9uIGRlZmluaXRpb25cbiAgICovXG4gIGZ1bmN0aW9uIGRlZmluZUV4dGVuc2lvbihuYW1lLCBleHRlbnNpb24pIHtcbiAgICBpZiAoZXh0ZW5zaW9uLmluaXQpIHtcbiAgICAgIGV4dGVuc2lvbi5pbml0KGludGVybmFsQVBJKVxuICAgIH1cbiAgICBleHRlbnNpb25zW25hbWVdID0gbWVyZ2VPYmplY3RzKGV4dGVuc2lvbkJhc2UoKSwgZXh0ZW5zaW9uKVxuICB9XG5cbiAgLyoqXG4gICAqIHJlbW92ZUV4dGVuc2lvbiByZW1vdmVzIGFuIGV4dGVuc2lvbiBmcm9tIHRoZSBodG14IHJlZ2lzdHJ5XG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9odG14Lm9yZy9hcGkvI3JlbW92ZUV4dGVuc2lvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlRXh0ZW5zaW9uKG5hbWUpIHtcbiAgICBkZWxldGUgZXh0ZW5zaW9uc1tuYW1lXVxuICB9XG5cbiAgLyoqXG4gICAqIGdldEV4dGVuc2lvbnMgc2VhcmNoZXMgdXAgdGhlIERPTSB0cmVlIHRvIHJldHVybiBhbGwgZXh0ZW5zaW9ucyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgZ2l2ZW4gZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICAgKiBAcGFyYW0ge0h0bXhFeHRlbnNpb25bXT19IGV4dGVuc2lvbnNUb1JldHVyblxuICAgKiBAcGFyYW0ge3N0cmluZ1tdPX0gZXh0ZW5zaW9uc1RvSWdub3JlXG4gICAqIEByZXR1cm5zIHtIdG14RXh0ZW5zaW9uW119XG4gICAqL1xuICBmdW5jdGlvbiBnZXRFeHRlbnNpb25zKGVsdCwgZXh0ZW5zaW9uc1RvUmV0dXJuLCBleHRlbnNpb25zVG9JZ25vcmUpIHtcbiAgICBpZiAoZXh0ZW5zaW9uc1RvUmV0dXJuID09IHVuZGVmaW5lZCkge1xuICAgICAgZXh0ZW5zaW9uc1RvUmV0dXJuID0gW11cbiAgICB9XG4gICAgaWYgKGVsdCA9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBleHRlbnNpb25zVG9SZXR1cm5cbiAgICB9XG4gICAgaWYgKGV4dGVuc2lvbnNUb0lnbm9yZSA9PSB1bmRlZmluZWQpIHtcbiAgICAgIGV4dGVuc2lvbnNUb0lnbm9yZSA9IFtdXG4gICAgfVxuICAgIGNvbnN0IGV4dGVuc2lvbnNGb3JFbGVtZW50ID0gZ2V0QXR0cmlidXRlVmFsdWUoZWx0LCAnaHgtZXh0JylcbiAgICBpZiAoZXh0ZW5zaW9uc0ZvckVsZW1lbnQpIHtcbiAgICAgIGZvckVhY2goZXh0ZW5zaW9uc0ZvckVsZW1lbnQuc3BsaXQoJywnKSwgZnVuY3Rpb24oZXh0ZW5zaW9uTmFtZSkge1xuICAgICAgICBleHRlbnNpb25OYW1lID0gZXh0ZW5zaW9uTmFtZS5yZXBsYWNlKC8gL2csICcnKVxuICAgICAgICBpZiAoZXh0ZW5zaW9uTmFtZS5zbGljZSgwLCA3KSA9PSAnaWdub3JlOicpIHtcbiAgICAgICAgICBleHRlbnNpb25zVG9JZ25vcmUucHVzaChleHRlbnNpb25OYW1lLnNsaWNlKDcpKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChleHRlbnNpb25zVG9JZ25vcmUuaW5kZXhPZihleHRlbnNpb25OYW1lKSA8IDApIHtcbiAgICAgICAgICBjb25zdCBleHRlbnNpb24gPSBleHRlbnNpb25zW2V4dGVuc2lvbk5hbWVdXG4gICAgICAgICAgaWYgKGV4dGVuc2lvbiAmJiBleHRlbnNpb25zVG9SZXR1cm4uaW5kZXhPZihleHRlbnNpb24pIDwgMCkge1xuICAgICAgICAgICAgZXh0ZW5zaW9uc1RvUmV0dXJuLnB1c2goZXh0ZW5zaW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGdldEV4dGVuc2lvbnMoYXNFbGVtZW50KHBhcmVudEVsdChlbHQpKSwgZXh0ZW5zaW9uc1RvUmV0dXJuLCBleHRlbnNpb25zVG9JZ25vcmUpXG4gIH1cblxuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbml0aWFsaXphdGlvblxuICAvLz0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICB2YXIgaXNSZWFkeSA9IGZhbHNlXG4gIGdldERvY3VtZW50KCkuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGlzUmVhZHkgPSB0cnVlXG4gIH0pXG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBmdW5jdGlvbiBub3cgaWYgRE9NQ29udGVudExvYWRlZCBoYXMgZmlyZWQsIG90aGVyd2lzZSBsaXN0ZW4gZm9yIGl0LlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHVzZXMgaXNSZWFkeSBiZWNhdXNlIHRoZXJlIGlzIG5vIHJlbGlhYmxlIHdheSB0byBhc2sgdGhlIGJyb3dzZXIgd2hldGhlclxuICAgKiB0aGUgRE9NQ29udGVudExvYWRlZCBldmVudCBoYXMgYWxyZWFkeSBiZWVuIGZpcmVkOyB0aGVyZSdzIGEgZ2FwIGJldHdlZW4gRE9NQ29udGVudExvYWRlZFxuICAgKiBmaXJpbmcgYW5kIHJlYWR5c3RhdGU9Y29tcGxldGUuXG4gICAqL1xuICBmdW5jdGlvbiByZWFkeShmbikge1xuICAgIC8vIENoZWNraW5nIHJlYWR5U3RhdGUgaGVyZSBpcyBhIGZhaWxzYWZlIGluIGNhc2UgdGhlIGh0bXggc2NyaXB0IHRhZyBlbnRlcmVkIHRoZSBET00gYnlcbiAgICAvLyBzb21lIG1lYW5zIG90aGVyIHRoYW4gdGhlIGluaXRpYWwgcGFnZSBsb2FkLlxuICAgIGlmIChpc1JlYWR5IHx8IGdldERvY3VtZW50KCkucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgZm4oKVxuICAgIH0gZWxzZSB7XG4gICAgICBnZXREb2N1bWVudCgpLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnRJbmRpY2F0b3JTdHlsZXMoKSB7XG4gICAgaWYgKGh0bXguY29uZmlnLmluY2x1ZGVJbmRpY2F0b3JTdHlsZXMgIT09IGZhbHNlKSB7XG4gICAgICBjb25zdCBub25jZUF0dHJpYnV0ZSA9IGh0bXguY29uZmlnLmlubGluZVN0eWxlTm9uY2UgPyBgIG5vbmNlPVwiJHtodG14LmNvbmZpZy5pbmxpbmVTdHlsZU5vbmNlfVwiYCA6ICcnXG4gICAgICBjb25zdCBpbmRpY2F0b3IgPSBodG14LmNvbmZpZy5pbmRpY2F0b3JDbGFzc1xuICAgICAgY29uc3QgcmVxdWVzdCA9IGh0bXguY29uZmlnLnJlcXVlc3RDbGFzc1xuICAgICAgZ2V0RG9jdW1lbnQoKS5oZWFkLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJyxcbiAgICAgICAgYDxzdHlsZSR7bm9uY2VBdHRyaWJ1dGV9PmAgK1xuICAgICAgICBgLiR7aW5kaWNhdG9yfXtvcGFjaXR5OjA7dmlzaWJpbGl0eTogaGlkZGVufSBgICtcbiAgICAgICAgYC4ke3JlcXVlc3R9IC4ke2luZGljYXRvcn0sIC4ke3JlcXVlc3R9LiR7aW5kaWNhdG9yfXtvcGFjaXR5OjE7dmlzaWJpbGl0eTogdmlzaWJsZTt0cmFuc2l0aW9uOiBvcGFjaXR5IDIwMG1zIGVhc2UtaW59YCArXG4gICAgICAgICc8L3N0eWxlPidcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNZXRhQ29uZmlnKCkge1xuICAgIC8qKiBAdHlwZSBIVE1MTWV0YUVsZW1lbnQgKi9cbiAgICBjb25zdCBlbGVtZW50ID0gZ2V0RG9jdW1lbnQoKS5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJodG14LWNvbmZpZ1wiXScpXG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBwYXJzZUpTT04oZWxlbWVudC5jb250ZW50KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlTWV0YUNvbmZpZygpIHtcbiAgICBjb25zdCBtZXRhQ29uZmlnID0gZ2V0TWV0YUNvbmZpZygpXG4gICAgaWYgKG1ldGFDb25maWcpIHtcbiAgICAgIGh0bXguY29uZmlnID0gbWVyZ2VPYmplY3RzKGh0bXguY29uZmlnLCBtZXRhQ29uZmlnKVxuICAgIH1cbiAgfVxuXG4gIC8vIGluaXRpYWxpemUgdGhlIGRvY3VtZW50XG4gIHJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIG1lcmdlTWV0YUNvbmZpZygpXG4gICAgaW5zZXJ0SW5kaWNhdG9yU3R5bGVzKClcbiAgICBsZXQgYm9keSA9IGdldERvY3VtZW50KCkuYm9keVxuICAgIHByb2Nlc3NOb2RlKGJvZHkpXG4gICAgY29uc3QgcmVzdG9yZWRFbHRzID0gZ2V0RG9jdW1lbnQoKS5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgXCJbaHgtdHJpZ2dlcj0ncmVzdG9yZWQnXSxbZGF0YS1oeC10cmlnZ2VyPSdyZXN0b3JlZCddXCJcbiAgICApXG4gICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCdodG14OmFib3J0JywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSAoLyoqIEB0eXBlIHtDdXN0b21FdmVudH0gKi8oZXZ0KSkuZGV0YWlsLmVsdCB8fCBldnQudGFyZ2V0XG4gICAgICBjb25zdCBpbnRlcm5hbERhdGEgPSBnZXRJbnRlcm5hbERhdGEodGFyZ2V0KVxuICAgICAgaWYgKGludGVybmFsRGF0YSAmJiBpbnRlcm5hbERhdGEueGhyKSB7XG4gICAgICAgIGludGVybmFsRGF0YS54aHIuYWJvcnQoKVxuICAgICAgfVxuICAgIH0pXG4gICAgLyoqIEB0eXBlIHsoZXY6IFBvcFN0YXRlRXZlbnQpID0+IGFueX0gKi9cbiAgICBjb25zdCBvcmlnaW5hbFBvcHN0YXRlID0gd2luZG93Lm9ucG9wc3RhdGUgPyB3aW5kb3cub25wb3BzdGF0ZS5iaW5kKHdpbmRvdykgOiBudWxsXG4gICAgLyoqIEB0eXBlIHsoZXY6IFBvcFN0YXRlRXZlbnQpID0+IGFueX0gKi9cbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQuc3RhdGUgJiYgZXZlbnQuc3RhdGUuaHRteCkge1xuICAgICAgICByZXN0b3JlSGlzdG9yeSgpXG4gICAgICAgIGZvckVhY2gocmVzdG9yZWRFbHRzLCBmdW5jdGlvbihlbHQpIHtcbiAgICAgICAgICB0cmlnZ2VyRXZlbnQoZWx0LCAnaHRteDpyZXN0b3JlZCcsIHtcbiAgICAgICAgICAgIGRvY3VtZW50OiBnZXREb2N1bWVudCgpLFxuICAgICAgICAgICAgdHJpZ2dlckV2ZW50XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvcmlnaW5hbFBvcHN0YXRlKSB7XG4gICAgICAgICAgb3JpZ2luYWxQb3BzdGF0ZShldmVudClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBnZXRXaW5kb3coKS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdHJpZ2dlckV2ZW50KGJvZHksICdodG14OmxvYWQnLCB7fSkgLy8gZ2l2ZSByZWFkeSBoYW5kbGVycyBhIGNoYW5jZSB0byBsb2FkIHVwIGJlZm9yZSBmaXJpbmcgdGhpcyBldmVudFxuICAgICAgYm9keSA9IG51bGwgLy8ga2lsbCByZWZlcmVuY2UgZm9yIGdjXG4gICAgfSwgMClcbiAgfSlcblxuICByZXR1cm4gaHRteFxufSkoKVxuXG4vKiogQHR5cGVkZWYgeydnZXQnfCdoZWFkJ3wncG9zdCd8J3B1dCd8J2RlbGV0ZSd8J2Nvbm5lY3QnfCdvcHRpb25zJ3wndHJhY2UnfCdwYXRjaCd9IEh0dHBWZXJiICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gU3dhcE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2VsZWN0XVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzZWxlY3RPT0JdXG4gKiBAcHJvcGVydHkgeyp9IFtldmVudEluZm9dXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2FuY2hvcl1cbiAqIEBwcm9wZXJ0eSB7RWxlbWVudH0gW2NvbnRleHRFbGVtZW50XVxuICogQHByb3BlcnR5IHtzd2FwQ2FsbGJhY2t9IFthZnRlclN3YXBDYWxsYmFja11cbiAqIEBwcm9wZXJ0eSB7c3dhcENhbGxiYWNrfSBbYWZ0ZXJTZXR0bGVDYWxsYmFja11cbiAqIEBwcm9wZXJ0eSB7c3dhcENhbGxiYWNrfSBbYmVmb3JlU3dhcENhbGxiYWNrXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt0aXRsZV1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2hpc3RvcnlSZXF1ZXN0XVxuICovXG5cbi8qKlxuICogQGNhbGxiYWNrIHN3YXBDYWxsYmFja1xuICovXG5cbi8qKlxuICogQHR5cGVkZWYgeydpbm5lckhUTUwnIHwgJ291dGVySFRNTCcgfCAnYmVmb3JlYmVnaW4nIHwgJ2FmdGVyYmVnaW4nIHwgJ2JlZm9yZWVuZCcgfCAnYWZ0ZXJlbmQnIHwgJ2RlbGV0ZScgfCAnbm9uZScgfCBzdHJpbmd9IEh0bXhTd2FwU3R5bGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIEh0bXhTd2FwU3BlY2lmaWNhdGlvblxuICogQHByb3BlcnR5IHtIdG14U3dhcFN0eWxlfSBzd2FwU3R5bGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzd2FwRGVsYXlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzZXR0bGVEZWxheVxuICogQHByb3BlcnR5IHtib29sZWFufSBbdHJhbnNpdGlvbl1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2lnbm9yZVRpdGxlXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtoZWFkXVxuICogQHByb3BlcnR5IHsndG9wJyB8ICdib3R0b20nIHwgbnVtYmVyIH0gW3Njcm9sbF1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2Nyb2xsVGFyZ2V0XVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzaG93XVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzaG93VGFyZ2V0XVxuICogQHByb3BlcnR5IHtib29sZWFufSBbZm9jdXNTY3JvbGxdXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7KCh0aGlzOk5vZGUsIGV2dDpFdmVudCkgPT4gYm9vbGVhbikgJiB7c291cmNlOiBzdHJpbmd9fSBDb25kaXRpb25hbEZ1bmN0aW9uXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIdG14VHJpZ2dlclNwZWNpZmljYXRpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0cmlnZ2VyXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3BvbGxJbnRlcnZhbF1cbiAqIEBwcm9wZXJ0eSB7Q29uZGl0aW9uYWxGdW5jdGlvbn0gW2V2ZW50RmlsdGVyXVxuICogQHByb3BlcnR5IHtib29sZWFufSBbY2hhbmdlZF1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW29uY2VdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtjb25zdW1lXVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtkZWxheV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZnJvbV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdGFyZ2V0XVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt0aHJvdHRsZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbcXVldWVdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3Jvb3RdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3RocmVzaG9sZF1cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHt7ZWx0OiBFbGVtZW50LCBtZXNzYWdlOiBzdHJpbmcsIHZhbGlkaXR5OiBWYWxpZGl0eVN0YXRlfX0gSHRteEVsZW1lbnRWYWxpZGF0aW9uRXJyb3JcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSBIdG14SGVhZGVyU3BlY2lmaWNhdGlvblxuICogQHByb3BlcnR5IHsndHJ1ZSd9IEhYLVJlcXVlc3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bGx9IEhYLVRyaWdnZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bGx9IEhYLVRyaWdnZXItTmFtZVxuICogQHByb3BlcnR5IHtzdHJpbmd8bnVsbH0gSFgtVGFyZ2V0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gSFgtQ3VycmVudC1VUkxcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbSFgtUHJvbXB0XVxuICogQHByb3BlcnR5IHsndHJ1ZSd9IFtIWC1Cb29zdGVkXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtDb250ZW50LVR5cGVdXG4gKiBAcHJvcGVydHkgeyd0cnVlJ30gW0hYLUhpc3RvcnktUmVzdG9yZS1SZXF1ZXN0XVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYgSHRteEFqYXhIZWxwZXJDb250ZXh0XG4gKiBAcHJvcGVydHkge0VsZW1lbnR8c3RyaW5nfSBbc291cmNlXVxuICogQHByb3BlcnR5IHtFdmVudH0gW2V2ZW50XVxuICogQHByb3BlcnR5IHtIdG14QWpheEhhbmRsZXJ9IFtoYW5kbGVyXVxuICogQHByb3BlcnR5IHtFbGVtZW50fHN0cmluZ30gW3RhcmdldF1cbiAqIEBwcm9wZXJ0eSB7SHRteFN3YXBTdHlsZX0gW3N3YXBdXG4gKiBAcHJvcGVydHkge09iamVjdHxGb3JtRGF0YX0gW3ZhbHVlc11cbiAqIEBwcm9wZXJ0eSB7UmVjb3JkPHN0cmluZyxzdHJpbmc+fSBbaGVhZGVyc11cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2VsZWN0XVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtwdXNoXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtyZXBsYWNlXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzZWxlY3RPT0JdXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIdG14UmVxdWVzdENvbmZpZ1xuICogQHByb3BlcnR5IHtib29sZWFufSBib29zdGVkXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IHVzZVVybFBhcmFtc1xuICogQHByb3BlcnR5IHtGb3JtRGF0YX0gZm9ybURhdGFcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBwYXJhbWV0ZXJzIGZvcm1EYXRhIHByb3h5XG4gKiBAcHJvcGVydHkge0Zvcm1EYXRhfSB1bmZpbHRlcmVkRm9ybURhdGFcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSB1bmZpbHRlcmVkUGFyYW1ldGVycyB1bmZpbHRlcmVkRm9ybURhdGEgcHJveHlcbiAqIEBwcm9wZXJ0eSB7SHRteEhlYWRlclNwZWNpZmljYXRpb259IGhlYWRlcnNcbiAqIEBwcm9wZXJ0eSB7RWxlbWVudH0gZWx0XG4gKiBAcHJvcGVydHkge0VsZW1lbnR9IHRhcmdldFxuICogQHByb3BlcnR5IHtIdHRwVmVyYn0gdmVyYlxuICogQHByb3BlcnR5IHtIdG14RWxlbWVudFZhbGlkYXRpb25FcnJvcltdfSBlcnJvcnNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gd2l0aENyZWRlbnRpYWxzXG4gKiBAcHJvcGVydHkge251bWJlcn0gdGltZW91dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHBhdGhcbiAqIEBwcm9wZXJ0eSB7RXZlbnR9IHRyaWdnZXJpbmdFdmVudFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gSHRteFJlc3BvbnNlSW5mb1xuICogQHByb3BlcnR5IHtYTUxIdHRwUmVxdWVzdH0geGhyXG4gKiBAcHJvcGVydHkge0VsZW1lbnR9IHRhcmdldFxuICogQHByb3BlcnR5IHtIdG14UmVxdWVzdENvbmZpZ30gcmVxdWVzdENvbmZpZ1xuICogQHByb3BlcnR5IHtIdG14QWpheEV0Y30gZXRjXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGJvb3N0ZWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzZWxlY3RcbiAqIEBwcm9wZXJ0eSB7e3JlcXVlc3RQYXRoOiBzdHJpbmcsIGZpbmFsUmVxdWVzdFBhdGg6IHN0cmluZywgcmVzcG9uc2VQYXRoOiBzdHJpbmd8bnVsbCwgYW5jaG9yOiBzdHJpbmd9fSBwYXRoSW5mb1xuICogQHByb3BlcnR5IHtib29sZWFufSBbZmFpbGVkXVxuICogQHByb3BlcnR5IHtib29sZWFufSBbc3VjY2Vzc2Z1bF1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2tlZXBJbmRpY2F0b3JzXVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gSHRteEFqYXhFdGNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW3JldHVyblByb21pc2VdXG4gKiBAcHJvcGVydHkge0h0bXhBamF4SGFuZGxlcn0gW2hhbmRsZXJdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3NlbGVjdF1cbiAqIEBwcm9wZXJ0eSB7RWxlbWVudH0gW3RhcmdldE92ZXJyaWRlXVxuICogQHByb3BlcnR5IHtIdG14U3dhcFN0eWxlfSBbc3dhcE92ZXJyaWRlXVxuICogQHByb3BlcnR5IHtSZWNvcmQ8c3RyaW5nLHN0cmluZz59IFtoZWFkZXJzXVxuICogQHByb3BlcnR5IHtPYmplY3R8Rm9ybURhdGF9IFt2YWx1ZXNdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtjcmVkZW50aWFsc11cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbdGltZW91dF1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbcHVzaF1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbcmVwbGFjZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2VsZWN0T09CXVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gSHRteFJlc3BvbnNlSGFuZGxpbmdDb25maWdcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbY29kZV1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gc3dhcFxuICogQHByb3BlcnR5IHtib29sZWFufSBbZXJyb3JdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtpZ25vcmVUaXRsZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2VsZWN0XVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt0YXJnZXRdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3N3YXBPdmVycmlkZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXZlbnRdXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7SHRteFJlc3BvbnNlSW5mbyAmIHtzaG91bGRTd2FwOiBib29sZWFuLCBzZXJ2ZXJSZXNwb25zZTogYW55LCBpc0Vycm9yOiBib29sZWFuLCBpZ25vcmVUaXRsZTogYm9vbGVhbiwgc2VsZWN0T3ZlcnJpZGU6c3RyaW5nLCBzd2FwT3ZlcnJpZGU6c3RyaW5nfX0gSHRteEJlZm9yZVN3YXBEZXRhaWxzXG4gKi9cblxuLyoqXG4gKiBAY2FsbGJhY2sgSHRteEFqYXhIYW5kbGVyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsdFxuICogQHBhcmFtIHtIdG14UmVzcG9uc2VJbmZvfSByZXNwb25zZUluZm9cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHsoKCkgPT4gdm9pZCl9IEh0bXhTZXR0bGVUYXNrXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBIdG14U2V0dGxlSW5mb1xuICogQHByb3BlcnR5IHtIdG14U2V0dGxlVGFza1tdfSB0YXNrc1xuICogQHByb3BlcnR5IHtFbGVtZW50W119IGVsdHNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdGl0bGVdXG4gKi9cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9iaWdza3lzb2Z0d2FyZS9odG14LWV4dGVuc2lvbnMvYmxvYi9tYWluL1JFQURNRS5tZFxuICogQHR5cGVkZWYge09iamVjdH0gSHRteEV4dGVuc2lvblxuICogQHByb3BlcnR5IHsoYXBpOiBhbnkpID0+IHZvaWR9IGluaXRcbiAqIEBwcm9wZXJ0eSB7KG5hbWU6IHN0cmluZywgZXZlbnQ6IEN1c3RvbUV2ZW50KSA9PiBib29sZWFufSBvbkV2ZW50XG4gKiBAcHJvcGVydHkgeyh0ZXh0OiBzdHJpbmcsIHhocjogWE1MSHR0cFJlcXVlc3QsIGVsdDogRWxlbWVudCkgPT4gc3RyaW5nfSB0cmFuc2Zvcm1SZXNwb25zZVxuICogQHByb3BlcnR5IHsoc3dhcFN0eWxlOiBIdG14U3dhcFN0eWxlKSA9PiBib29sZWFufSBpc0lubGluZVN3YXBcbiAqIEBwcm9wZXJ0eSB7KHN3YXBTdHlsZTogSHRteFN3YXBTdHlsZSwgdGFyZ2V0OiBOb2RlLCBmcmFnbWVudDogTm9kZSwgc2V0dGxlSW5mbzogSHRteFNldHRsZUluZm8pID0+IGJvb2xlYW58Tm9kZVtdfSBoYW5kbGVTd2FwXG4gKiBAcHJvcGVydHkgeyh4aHI6IFhNTEh0dHBSZXF1ZXN0LCBwYXJhbWV0ZXJzOiBGb3JtRGF0YSwgZWx0OiBOb2RlKSA9PiAqfHN0cmluZ3xudWxsfSBlbmNvZGVQYXJhbWV0ZXJzXG4gKiBAcHJvcGVydHkgeygpID0+IHN0cmluZ1tdfG51bGx9IGdldFNlbGVjdG9yc1xuICovXG5leHBvcnQgZGVmYXVsdCBodG14XG4iLCJpbXBvcnQgaHRteCBmcm9tICdodG14Lm9yZyc7XG5pbXBvcnQgJy4uL2Nzcy9mcm9udGVuZC5jc3MnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuXHRodG14LmNvbmZpZy5zZWxmUmVxdWVzdHNPbmx5ID0gZmFsc2U7IC8vIFJlcXVpcmVkIGZvciBkb2luZyBXUC1KU09OIHJlcXVlc3RzIHRvIFBEQy9QVUIgZW5kcG9pbnRzXG5cdGluaXRSZXZpZXdNb2RhbCgpO1xufSk7XG5cbmZ1bmN0aW9uIGluaXRSZXZpZXdNb2RhbCgpIHtcblx0Y29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneXBnLXJldmlldy1tb2RhbCcpO1xuXHRpZiAoIW1vZGFsKSByZXR1cm47XG5cblx0ZW5hYmxlRHJhZyhtb2RhbCk7XG5cblx0Y29uc3QgY2xvc2VCdXR0b24gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcueXBnLWNsb3NlLW1vZGFsJyk7XG5cdGlmIChjbG9zZUJ1dHRvbikge1xuXHRcdGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0bW9kYWwuY2xhc3NMaXN0LmFkZCgnY2xvc2VkJyk7XG5cdFx0fSk7XG5cdH1cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuXHRcdHJlcG9zaXRpb24obW9kYWwpO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBIYW5kbGVzIGVsZW1lbnQgcmVwb3NpdGlvbmluZyAodGhyb3VnaCBkcmFnZ2luZylcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7RXZlbnR9ICAgICAgIGV2ZW50XG4gKi9cbmZ1bmN0aW9uIHJlcG9zaXRpb24oZWxlbWVudCwgZXZlbnQpIHtcblx0bGV0IG5ld0xlZnQgPSBlbGVtZW50Lm9mZnNldExlZnQ7XG5cdGxldCBuZXdUb3AgPSBlbGVtZW50Lm9mZnNldFRvcDtcblxuXHRpZiAoZXZlbnQpIHtcblx0XHRjb25zdCBkZWx0YVggPSBlbGVtZW50Ll9wcmV2WCAtIGV2ZW50LmNsaWVudFg7XG5cdFx0Y29uc3QgZGVsdGFZID0gZWxlbWVudC5fcHJldlkgLSBldmVudC5jbGllbnRZO1xuXG5cdFx0bmV3TGVmdCA9IGVsZW1lbnQub2Zmc2V0TGVmdCAtIGRlbHRhWDtcblx0XHRuZXdUb3AgPSBlbGVtZW50Lm9mZnNldFRvcCAtIGRlbHRhWTtcblxuXHRcdGVsZW1lbnQuX3ByZXZYID0gZXZlbnQuY2xpZW50WDtcblx0XHRlbGVtZW50Ll9wcmV2WSA9IGV2ZW50LmNsaWVudFk7XG5cdH1cblxuXHRjb25zdCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0Y29uc3QgdncgPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0Y29uc3QgdmggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0aWYgKHJlY3QucmlnaHQgPiB2dykgbmV3TGVmdCA9IHZ3IC0gcmVjdC53aWR0aDtcblx0aWYgKHJlY3QuYm90dG9tID4gdmgpIG5ld1RvcCA9IHZoIC0gcmVjdC5oZWlnaHQ7XG5cdGlmIChyZWN0LmxlZnQgPCAwKSBuZXdMZWZ0ID0gMDtcblx0aWYgKHJlY3QudG9wIDwgMCkgbmV3VG9wID0gMDtcblxuXHRlbGVtZW50LnN0eWxlLmxlZnQgPSBuZXdMZWZ0ICsgJ3B4Jztcblx0ZWxlbWVudC5zdHlsZS50b3AgPSBuZXdUb3AgKyAncHgnO1xuXHRlbGVtZW50LnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xufVxuXG4vKipcbiAqIEhhbmRsZXMgZHJhZyBmdW5jdGlvbmFsaXR5IG9uIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gZW5hYmxlRHJhZyhlbGVtZW50KSB7XG5cdGxldCBpc0RyYWdnaW5nID0gZmFsc2U7XG5cblx0ZWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnZ3JhYic7XG5cdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaW5pdERyYWdnaW5nKTtcblxuXHRmdW5jdGlvbiBpbml0RHJhZ2dpbmcoZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJ2J1dHRvbiwgaW5wdXQsIHRleHRhcmVhLCBhLCBzZWxlY3QnKSkgcmV0dXJuO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRpc0RyYWdnaW5nID0gdHJ1ZTtcblxuXHRcdGVsZW1lbnQuX3ByZXZYID0gZXZlbnQuY2xpZW50WDtcblx0XHRlbGVtZW50Ll9wcmV2WSA9IGV2ZW50LmNsaWVudFk7XG5cblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBzdGFydERyYWdnaW5nKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgc3RvcERyYWdnaW5nKTtcblxuXHRcdGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJ2dyYWJiaW5nJztcblx0fVxuXG5cdGZ1bmN0aW9uIHN0YXJ0RHJhZ2dpbmcoZXZlbnQpIHtcblx0XHRpZiAoIWlzRHJhZ2dpbmcpIHJldHVybjtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHJlcG9zaXRpb24oZWxlbWVudCwgZXZlbnQpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc3RvcERyYWdnaW5nKCkge1xuXHRcdGlmICghaXNEcmFnZ2luZykgcmV0dXJuO1xuXHRcdGlzRHJhZ2dpbmcgPSBmYWxzZTtcblx0XHRlbGVtZW50LnN0eWxlLmN1cnNvciA9ICdncmFiJztcblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHN0YXJ0RHJhZ2dpbmcpO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzdG9wRHJhZ2dpbmcpO1xuXHR9XG59XG4iXSwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUksUUFBUSxXQUFXO0NBQ3JCO0NBR0EsTUFBTSxPQUFPOztFQUlYLFFBQVE7O0VBRVIsU0FBUzs7RUFFVCxJQUFJOztFQUVKLEtBQUs7O0VBRUwsU0FBUzs7RUFFVCxNQUFNOztFQUdOLE1BQU07O0VBRU4sU0FBUzs7RUFFVCxTQUFTOzs7Ozs7Ozs7O0VBVVQsUUFBUSxTQUFTLEtBQUssTUFBTTtHQUUxQixPQURvQixlQUFlLEtBQUssUUFBUSxNQUMvQixDQUFDLENBQUM7RUFDckI7O0VBR0EsUUFBUTs7RUFFUixVQUFVOztFQUVWLGFBQWE7O0VBRWIsYUFBYTs7RUFFYixXQUFXOztFQUVYLE1BQU07O0VBR04saUJBQWlCOztFQUVqQixpQkFBaUI7O0VBR2pCLFFB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