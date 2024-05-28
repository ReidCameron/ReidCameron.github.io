/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate, global) {;(function() {
    "use strict"
    function Vnode(tag, key, attrs0, children, text, dom) {
        return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
    }
    Vnode.normalize = function(node) {
        if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
        if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
        return node
    }
    Vnode.normalizeChildren = function normalizeChildren(children) {
        for (var i = 0; i < children.length; i++) {
            children[i] = Vnode.normalize(children[i])
        }
        return children
    }
    var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
    var selectorCache = {}
    var hasOwn = {}.hasOwnProperty
    function compileSelector(selector) {
        var match, tag = "div", classes = [], attrs = {}
        while (match = selectorParser.exec(selector)) {
            var type = match[1], value = match[2]
            if (type === "" && value !== "") tag = value
            else if (type === "#") attrs.id = value
            else if (type === ".") classes.push(value)
            else if (match[3][0] === "[") {
                var attrValue = match[6]
                if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
                if (match[4] === "class") classes.push(attrValue)
                else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
            }
        }
        if (classes.length > 0) attrs.className = classes.join(" ")
        return selectorCache[selector] = {tag: tag, attrs: attrs}
    }
    function execSelector(state, attrs, children) {
        var hasAttrs = false, childList, text
        var className = attrs.className || attrs.class
        for (var key in state.attrs) {
            if (hasOwn.call(state.attrs, key)) {
                attrs[key] = state.attrs[key]
            }
        }
        if (className !== undefined) {
            if (attrs.class !== undefined) {
                attrs.class = undefined
                attrs.className = className
            }
            if (state.attrs.className != null) {
                attrs.className = state.attrs.className + " " + className
            }
        }
        for (var key in attrs) {
            if (hasOwn.call(attrs, key) && key !== "key") {
                hasAttrs = true
                break
            }
        }
        if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
            text = children[0].children
        } else {
            childList = children
        }
        return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
    }
    function hyperscript(selector) {
        // Because sloppy mode sucks
        var attrs = arguments[1], start = 2, children
        if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
            throw Error("The selector must be either a string or a component.");
        }
        if (typeof selector === "string") {
            var cached = selectorCache[selector] || compileSelector(selector)
        }
        if (attrs == null) {
            attrs = {}
        } else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
            attrs = {}
            start = 1
        }
        if (arguments.length === start + 1) {
            children = arguments[start]
            if (!Array.isArray(children)) children = [children]
        } else {
            children = []
            while (start < arguments.length) children.push(arguments[start++])
        }
        var normalized = Vnode.normalizeChildren(children)
        if (typeof selector === "string") {
            return execSelector(cached, attrs, normalized)
        } else {
            return Vnode(selector, attrs.key, attrs, normalized)
        }
    }
    hyperscript.trust = function(html) {
        if (html == null) html = ""
        return Vnode("<", undefined, undefined, html, undefined, undefined)
    }
    hyperscript.fragment = function(attrs1, children) {
        return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
    }
    var m = hyperscript
    /** @constructor */
    var PromisePolyfill = function(executor) {
        if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
        if (typeof executor !== "function") throw new TypeError("executor must be a function")
        var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
        var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
        var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
        function handler(list, shouldAbsorb) {
            return function execute(value) {
                var then
                try {
                    if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
                        if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
                        executeOnce(then.bind(value))
                    }
                    else {
                        callAsync(function() {
                            if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
                            for (var i = 0; i < list.length; i++) list[i](value)
                            resolvers.length = 0, rejectors.length = 0
                            instance.state = shouldAbsorb
                            instance.retry = function() {execute(value)}
                        })
                    }
                }
                catch (e) {
                    rejectCurrent(e)
                }
            }
        }
        function executeOnce(then) {
            var runs = 0
            function run(fn) {
                return function(value) {
                    if (runs++ > 0) return
                    fn(value)
                }
            }
            var onerror = run(rejectCurrent)
            try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
        }
        executeOnce(executor)
    }
    PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
        var self = this, instance = self._instance
        function handle(callback, list, next, state) {
            list.push(function(value) {
                if (typeof callback !== "function") next(value)
                else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
            })
            if (typeof instance.retry === "function" && state === instance.state) instance.retry()
        }
        var resolveNext, rejectNext
        var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
        handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
        return promise
    }
    PromisePolyfill.prototype.catch = function(onRejection) {
        return this.then(null, onRejection)
    }
    PromisePolyfill.resolve = function(value) {
        if (value instanceof PromisePolyfill) return value
        return new PromisePolyfill(function(resolve) {resolve(value)})
    }
    PromisePolyfill.reject = function(value) {
        return new PromisePolyfill(function(resolve, reject) {reject(value)})
    }
    PromisePolyfill.all = function(list) {
        return new PromisePolyfill(function(resolve, reject) {
            var total = list.length, count = 0, values = []
            if (list.length === 0) resolve([])
            else for (var i = 0; i < list.length; i++) {
                (function(i) {
                    function consume(value) {
                        count++
                        values[i] = value
                        if (count === total) resolve(values)
                    }
                    if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
                        list[i].then(consume, reject)
                    }
                    else consume(list[i])
                })(i)
            }
        })
    }
    PromisePolyfill.race = function(list) {
        return new PromisePolyfill(function(resolve, reject) {
            for (var i = 0; i < list.length; i++) {
                list[i].then(resolve, reject)
            }
        })
    }
    if (typeof window !== "undefined") {
        if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
        var PromisePolyfill = window.Promise
    } else if (typeof global !== "undefined") {
        if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
        var PromisePolyfill = global.Promise
    } else {
    }
    var buildQueryString = function(object) {
        if (Object.prototype.toString.call(object) !== "[object Object]") return ""
        var args = []
        for (var key0 in object) {
            destructure(key0, object[key0])
        }
        return args.join("&")
        function destructure(key0, value) {
            if (Array.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    destructure(key0 + "[" + i + "]", value[i])
                }
            }
            else if (Object.prototype.toString.call(value) === "[object Object]") {
                for (var i in value) {
                    destructure(key0 + "[" + i + "]", value[i])
                }
            }
            else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
        }
    }
    var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
    var _8 = function($window, Promise) {
        var callbackCount = 0
        var oncompletion
        function setCompletionCallback(callback) {oncompletion = callback}
        function finalizer() {
            var count = 0
            function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
            return function finalize(promise0) {
                var then0 = promise0.then
                promise0.then = function() {
                    count++
                    var next = then0.apply(promise0, arguments)
                    next.then(complete, function(e) {
                        complete()
                        if (count === 0) throw e
                    })
                    return finalize(next)
                }
                return promise0
            }
        }
        function normalize(args, extra) {
            if (typeof args === "string") {
                var url = args
                args = extra || {}
                if (args.url == null) args.url = url
            }
            return args
        }
        function request(args, extra) {
            var finalize = finalizer()
            args = normalize(args, extra)
            var promise0 = new Promise(function(resolve, reject) {
                if (args.method == null) args.method = "GET"
                args.method = args.method.toUpperCase()
                var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
                if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
                if (typeof args.deserialize !== "function") args.deserialize = deserialize
                if (typeof args.extract !== "function") args.extract = extract
                args.url = interpolate(args.url, args.data)
                if (useBody) args.data = args.serialize(args.data)
                else args.url = assemble(args.url, args.data)
                var xhr = new $window.XMLHttpRequest(),
                    aborted = false,
                    _abort = xhr.abort
                xhr.abort = function abort() {
                    aborted = true
                    _abort.call(xhr)
                }
                xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
                if (args.serialize === JSON.stringify && useBody) {
                    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
                }
                if (args.deserialize === deserialize) {
                    xhr.setRequestHeader("Accept", "application/json, text/*")
                }
                if (args.withCredentials) xhr.withCredentials = args.withCredentials
                for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
                    xhr.setRequestHeader(key, args.headers[key])
                }
                if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
                xhr.onreadystatechange = function() {
                    // Don't throw errors on xhr.abort().
                    if(aborted) return
                    if (xhr.readyState === 4) {
                        try {
                            var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
                            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
                                resolve(cast(args.type, response))
                            }
                            else {
                                var error = new Error(xhr.responseText)
                                for (var key in response) error[key] = response[key]
                                reject(error)
                            }
                        }
                        catch (e) {
                            reject(e)
                        }
                    }
                }
                if (useBody && (args.data != null)) xhr.send(args.data)
                else xhr.send()
            })
            return args.background === true ? promise0 : finalize(promise0)
        }
        function jsonp(args, extra) {
            var finalize = finalizer()
            args = normalize(args, extra)
            var promise0 = new Promise(function(resolve, reject) {
                var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
                var script = $window.document.createElement("script")
                $window[callbackName] = function(data) {
                    script.parentNode.removeChild(script)
                    resolve(cast(args.type, data))
                    delete $window[callbackName]
                }
                script.onerror = function() {
                    script.parentNode.removeChild(script)
                    reject(new Error("JSONP request failed"))
                    delete $window[callbackName]
                }
                if (args.data == null) args.data = {}
                args.url = interpolate(args.url, args.data)
                args.data[args.callbackKey || "callback"] = callbackName
                script.src = assemble(args.url, args.data)
                $window.document.documentElement.appendChild(script)
            })
            return args.background === true? promise0 : finalize(promise0)
        }
        function interpolate(url, data) {
            if (data == null) return url
            var tokens = url.match(/:[^\/]+/gi) || []
            for (var i = 0; i < tokens.length; i++) {
                var key = tokens[i].slice(1)
                if (data[key] != null) {
                    url = url.replace(tokens[i], data[key])
                }
            }
            return url
        }
        function assemble(url, data) {
            var querystring = buildQueryString(data)
            if (querystring !== "") {
                var prefix = url.indexOf("?") < 0 ? "?" : "&"
                url += prefix + querystring
            }
            return url
        }
        function deserialize(data) {
            try {return data !== "" ? JSON.parse(data) : null}
            catch (e) {throw new Error(data)}
        }
        function extract(xhr) {return xhr.responseText}
        function cast(type0, data) {
            if (typeof type0 === "function") {
                if (Array.isArray(data)) {
                    for (var i = 0; i < data.length; i++) {
                        data[i] = new type0(data[i])
                    }
                }
                else return new type0(data)
            }
            return data
        }
        return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
    }
    var requestService = _8(window, PromisePolyfill)
    var coreRenderer = function($window) {
        var $doc = $window.document
        var $emptyFragment = $doc.createDocumentFragment()
        var nameSpace = {
            svg: "http://www.w3.org/2000/svg",
            math: "http://www.w3.org/1998/Math/MathML"
        }
        var onevent
        function setEventCallback(callback) {return onevent = callback}
        function getNameSpace(vnode) {
            return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
        }
        //create
        function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
            for (var i = start; i < end; i++) {
                var vnode = vnodes[i]
                if (vnode != null) {
                    createNode(parent, vnode, hooks, ns, nextSibling)
                }
            }
        }
        function createNode(parent, vnode, hooks, ns, nextSibling) {
            var tag = vnode.tag
            if (typeof tag === "string") {
                vnode.state = {}
                if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
                switch (tag) {
                    case "#": return createText(parent, vnode, nextSibling)
                    case "<": return createHTML(parent, vnode, nextSibling)
                    case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
                    default: return createElement(parent, vnode, hooks, ns, nextSibling)
                }
            }
            else return createComponent(parent, vnode, hooks, ns, nextSibling)
        }
        function createText(parent, vnode, nextSibling) {
            vnode.dom = $doc.createTextNode(vnode.children)
            insertNode(parent, vnode.dom, nextSibling)
            return vnode.dom
        }
        function createHTML(parent, vnode, nextSibling) {
            var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
            var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
            var temp = $doc.createElement(parent1)
            temp.innerHTML = vnode.children
            vnode.dom = temp.firstChild
            vnode.domSize = temp.childNodes.length
            var fragment = $doc.createDocumentFragment()
            var child
            while (child = temp.firstChild) {
                fragment.appendChild(child)
            }
            insertNode(parent, fragment, nextSibling)
            return fragment
        }
        function createFragment(parent, vnode, hooks, ns, nextSibling) {
            var fragment = $doc.createDocumentFragment()
            if (vnode.children != null) {
                var children = vnode.children
                createNodes(fragment, children, 0, children.length, hooks, null, ns)
            }
            vnode.dom = fragment.firstChild
            vnode.domSize = fragment.childNodes.length
            insertNode(parent, fragment, nextSibling)
            return fragment
        }
        function createElement(parent, vnode, hooks, ns, nextSibling) {
            var tag = vnode.tag
            var attrs2 = vnode.attrs
            var is = attrs2 && attrs2.is
            ns = getNameSpace(vnode) || ns
            var element = ns ?
                is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
                is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
            vnode.dom = element
            if (attrs2 != null) {
                setAttrs(vnode, attrs2, ns)
            }
            insertNode(parent, element, nextSibling)
            if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
                setContentEditable(vnode)
            }
            else {
                if (vnode.text != null) {
                    if (vnode.text !== "") element.textContent = vnode.text
                    else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
                }
                if (vnode.children != null) {
                    var children = vnode.children
                    createNodes(element, children, 0, children.length, hooks, null, ns)
                    setLateAttrs(vnode)
                }
            }
            return element
        }
        function initComponent(vnode, hooks) {
            var sentinel
            if (typeof vnode.tag.view === "function") {
                vnode.state = Object.create(vnode.tag)
                sentinel = vnode.state.view
                if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
                sentinel.$$reentrantLock$$ = true
            } else {
                vnode.state = void 0
                sentinel = vnode.tag
                if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
                sentinel.$$reentrantLock$$ = true
                vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
            }
            vnode._state = vnode.state
            if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
            initLifecycle(vnode._state, vnode, hooks)
            vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
            if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
            sentinel.$$reentrantLock$$ = null
        }
        function createComponent(parent, vnode, hooks, ns, nextSibling) {
            initComponent(vnode, hooks)
            if (vnode.instance != null) {
                var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
                vnode.dom = vnode.instance.dom
                vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
                insertNode(parent, element, nextSibling)
                return element
            }
            else {
                vnode.domSize = 0
                return $emptyFragment
            }
        }
        //update
        function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
            if (old === vnodes || old == null && vnodes == null) return
            else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
            else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
            else {
                if (old.length === vnodes.length) {
                    var isUnkeyed = false
                    for (var i = 0; i < vnodes.length; i++) {
                        if (vnodes[i] != null && old[i] != null) {
                            isUnkeyed = vnodes[i].key == null && old[i].key == null
                            break
                        }
                    }
                    if (isUnkeyed) {
                        for (var i = 0; i < old.length; i++) {
                            if (old[i] === vnodes[i]) continue
                            else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
                            else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
                            else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
                        }
                        return
                    }
                }
                recycling = recycling || isRecyclable(old, vnodes)
                if (recycling) {
                    var pool = old.pool
                    old = old.concat(old.pool)
                }
                var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
                while (oldEnd >= oldStart && end >= start) {
                    var o = old[oldStart], v = vnodes[start]
                    if (o === v && !recycling) oldStart++, start++
                    else if (o == null) oldStart++
                    else if (v == null) start++
                    else if (o.key === v.key) {
                        var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
                        oldStart++, start++
                        updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
                        if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
                    }
                    else {
                        var o = old[oldEnd]
                        if (o === v && !recycling) oldEnd--, start++
                        else if (o == null) oldEnd--
                        else if (v == null) start++
                        else if (o.key === v.key) {
                            var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
                            updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
                            if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
                            oldEnd--, start++
                        }
                        else break
                    }
                }
                while (oldEnd >= oldStart && end >= start) {
                    var o = old[oldEnd], v = vnodes[end]
                    if (o === v && !recycling) oldEnd--, end--
                    else if (o == null) oldEnd--
                    else if (v == null) end--
                    else if (o.key === v.key) {
                        var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
                        updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
                        if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
                        if (o.dom != null) nextSibling = o.dom
                        oldEnd--, end--
                    }
                    else {
                        if (!map) map = getKeyMap(old, oldEnd)
                        if (v != null) {
                            var oldIndex = map[v.key]
                            if (oldIndex != null) {
                                var movable = old[oldIndex]
                                var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
                                updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
                                insertNode(parent, toFragment(movable), nextSibling)
                                old[oldIndex].skip = true
                                if (movable.dom != null) nextSibling = movable.dom
                            }
                            else {
                                var dom = createNode(parent, v, hooks, ns, nextSibling)
                                nextSibling = dom
                            }
                        }
                        end--
                    }
                    if (end < start) break
                }
                createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
                removeNodes(old, oldStart, oldEnd + 1, vnodes)
            }
        }
        function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
            var oldTag = old.tag, tag = vnode.tag
            if (oldTag === tag) {
                vnode.state = old.state
                vnode._state = old._state
                vnode.events = old.events
                if (!recycling && shouldNotUpdate(vnode, old)) return
                if (typeof oldTag === "string") {
                    if (vnode.attrs != null) {
                        if (recycling) {
                            vnode.state = {}
                            initLifecycle(vnode.attrs, vnode, hooks)
                        }
                        else updateLifecycle(vnode.attrs, vnode, hooks)
                    }
                    switch (oldTag) {
                        case "#": updateText(old, vnode); break
                        case "<": updateHTML(parent, old, vnode, nextSibling); break
                        case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
                        default: updateElement(old, vnode, recycling, hooks, ns)
                    }
                }
                else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
            }
            else {
                removeNode(old, null)
                createNode(parent, vnode, hooks, ns, nextSibling)
            }
        }
        function updateText(old, vnode) {
            if (old.children.toString() !== vnode.children.toString()) {
                old.dom.nodeValue = vnode.children
            }
            vnode.dom = old.dom
        }
        function updateHTML(parent, old, vnode, nextSibling) {
            if (old.children !== vnode.children) {
                toFragment(old)
                createHTML(parent, vnode, nextSibling)
            }
            else vnode.dom = old.dom, vnode.domSize = old.domSize
        }
        function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
            updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
            var domSize = 0, children = vnode.children
            vnode.dom = null
            if (children != null) {
                for (var i = 0; i < children.length; i++) {
                    var child = children[i]
                    if (child != null && child.dom != null) {
                        if (vnode.dom == null) vnode.dom = child.dom
                        domSize += child.domSize || 1
                    }
                }
                if (domSize !== 1) vnode.domSize = domSize
            }
        }
        function updateElement(old, vnode, recycling, hooks, ns) {
            var element = vnode.dom = old.dom
            ns = getNameSpace(vnode) || ns
            if (vnode.tag === "textarea") {
                if (vnode.attrs == null) vnode.attrs = {}
                if (vnode.text != null) {
                    vnode.attrs.value = vnode.text //FIXME handle0 multiple children
                    vnode.text = undefined
                }
            }
            updateAttrs(vnode, old.attrs, vnode.attrs, ns)
            if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
                setContentEditable(vnode)
            }
            else if (old.text != null && vnode.text != null && vnode.text !== "") {
                if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
            }
            else {
                if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
                if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
                updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
            }
        }
        function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
            if (recycling) {
                initComponent(vnode, hooks)
            } else {
                vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
                if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
                if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
                updateLifecycle(vnode._state, vnode, hooks)
            }
            if (vnode.instance != null) {
                if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
                else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
                vnode.dom = vnode.instance.dom
                vnode.domSize = vnode.instance.domSize
            }
            else if (old.instance != null) {
                removeNode(old.instance, null)
                vnode.dom = undefined
                vnode.domSize = 0
            }
            else {
                vnode.dom = old.dom
                vnode.domSize = old.domSize
            }
        }
        function isRecyclable(old, vnodes) {
            if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
                var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
                var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
                var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
                if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
                    return true
                }
            }
            return false
        }
        function getKeyMap(vnodes, end) {
            var map = {}, i = 0
            for (var i = 0; i < end; i++) {
                var vnode = vnodes[i]
                if (vnode != null) {
                    var key2 = vnode.key
                    if (key2 != null) map[key2] = i
                }
            }
            return map
        }
        function toFragment(vnode) {
            var count0 = vnode.domSize
            if (count0 != null || vnode.dom == null) {
                var fragment = $doc.createDocumentFragment()
                if (count0 > 0) {
                    var dom = vnode.dom
                    while (--count0) fragment.appendChild(dom.nextSibling)
                    fragment.insertBefore(dom, fragment.firstChild)
                }
                return fragment
            }
            else return vnode.dom
        }
        function getNextSibling(vnodes, i, nextSibling) {
            for (; i < vnodes.length; i++) {
                if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
            }
            return nextSibling
        }
        function insertNode(parent, dom, nextSibling) {
            if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
            else parent.appendChild(dom)
        }
        function setContentEditable(vnode) {
            var children = vnode.children
            if (children != null && children.length === 1 && children[0].tag === "<") {
                var content = children[0].children
                if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
            }
            else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
        }
        //remove
        function removeNodes(vnodes, start, end, context) {
            for (var i = start; i < end; i++) {
                var vnode = vnodes[i]
                if (vnode != null) {
                    if (vnode.skip) vnode.skip = false
                    else removeNode(vnode, context)
                }
            }
        }
        function removeNode(vnode, context) {
            var expected = 1, called = 0
            if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
                var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
                if (result != null && typeof result.then === "function") {
                    expected++
                    result.then(continuation, continuation)
                }
            }
            if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
                var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
                if (result != null && typeof result.then === "function") {
                    expected++
                    result.then(continuation, continuation)
                }
            }
            continuation()
            function continuation() {
                if (++called === expected) {
                    onremove(vnode)
                    if (vnode.dom) {
                        var count0 = vnode.domSize || 1
                        if (count0 > 1) {
                            var dom = vnode.dom
                            while (--count0) {
                                removeNodeFromDOM(dom.nextSibling)
                            }
                        }
                        removeNodeFromDOM(vnode.dom)
                        if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
                            if (!context.pool) context.pool = [vnode]
                            else context.pool.push(vnode)
                        }
                    }
                }
            }
        }
        function removeNodeFromDOM(node) {
            var parent = node.parentNode
            if (parent != null) parent.removeChild(node)
        }
        function onremove(vnode) {
            if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
            if (typeof vnode.tag !== "string" && typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
            if (vnode.instance != null) onremove(vnode.instance)
            else {
                var children = vnode.children
                if (Array.isArray(children)) {
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i]
                        if (child != null) onremove(child)
                    }
                }
            }
        }
        //attrs2
        function setAttrs(vnode, attrs2, ns) {
            for (var key2 in attrs2) {
                setAttr(vnode, key2, null, attrs2[key2], ns)
            }
        }
        function setAttr(vnode, key2, old, value, ns) {
            var element = vnode.dom
            if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
            var nsLastIndex = key2.indexOf(":")
            if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
                element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
            }
            else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
            else if (key2 === "style") updateStyle(element, old, value)
            else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
                if (key2 === "value") {
                    var normalized0 = "" + value // eslint-disable-line no-implicit-coercion
                    //setting input[value] to same value by typing on focused element moves cursor to end in Chrome
                    if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
                    //setting select[value] to same value while having select open blinks select dropdown in Chrome
                    if (vnode.tag === "select") {
                        if (value === null) {
                            if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
                        } else {
                            if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
                        }
                    }
                    //setting option[value] to same value while having select open blinks select dropdown in Chrome
                    if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
                }
                // If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
                if (vnode.tag === "input" && key2 === "type") {
                    element.setAttribute(key2, value)
                    return
                }
                element[key2] = value
            }
            else {
                if (typeof value === "boolean") {
                    if (value) element.setAttribute(key2, "")
                    else element.removeAttribute(key2)
                }
                else element.setAttribute(key2 === "className" ? "class" : key2, value)
            }
        }
        function setLateAttrs(vnode) {
            var attrs2 = vnode.attrs
            if (vnode.tag === "select" && attrs2 != null) {
                if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
                if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
            }
        }
        function updateAttrs(vnode, old, attrs2, ns) {
            if (attrs2 != null) {
                for (var key2 in attrs2) {
                    setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
                }
            }
            if (old != null) {
                for (var key2 in old) {
                    if (attrs2 == null || !(key2 in attrs2)) {
                        if (key2 === "className") key2 = "class"
                        if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
                        else if (key2 !== "key") vnode.dom.removeAttribute(key2)
                    }
                }
            }
        }
        function isFormAttribute(vnode, attr) {
            return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
        }
        function isLifecycleMethod(attr) {
            return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
        }
        function isAttribute(attr) {
            return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
        }
        function isCustomElement(vnode){
            return vnode.attrs.is || vnode.tag.indexOf("-") > -1
        }
        function hasIntegrationMethods(source) {
            return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
        }
        //style
        function updateStyle(element, old, style) {
            if (old === style) element.style.cssText = "", old = null
            if (style == null) element.style.cssText = ""
            else if (typeof style === "string") element.style.cssText = style
            else {
                if (typeof old === "string") element.style.cssText = ""
                for (var key2 in style) {
                    element.style[key2] = style[key2]
                }
                if (old != null && typeof old !== "string") {
                    for (var key2 in old) {
                        if (!(key2 in style)) element.style[key2] = ""
                    }
                }
            }
        }
        //event
        function updateEvent(vnode, key2, value) {
            var element = vnode.dom
            var callback = typeof onevent !== "function" ? value : function(e) {
                var result = value.call(element, e)
                onevent.call(element, e)
                return result
            }
            if (key2 in element) element[key2] = typeof value === "function" ? callback : null
            else {
                var eventName = key2.slice(2)
                if (vnode.events === undefined) vnode.events = {}
                if (vnode.events[key2] === callback) return
                if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
                if (typeof value === "function") {
                    vnode.events[key2] = callback
                    element.addEventListener(eventName, vnode.events[key2], false)
                }
            }
        }
        //lifecycle
        function initLifecycle(source, vnode, hooks) {
            if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
            if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
        }
        function updateLifecycle(source, vnode, hooks) {
            if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
        }
        function shouldNotUpdate(vnode, old) {
            var forceVnodeUpdate, forceComponentUpdate
            if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
            if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
            if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
                vnode.dom = old.dom
                vnode.domSize = old.domSize
                vnode.instance = old.instance
                return true
            }
            return false
        }
        function render(dom, vnodes) {
            if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
            var hooks = []
            var active = $doc.activeElement
            var namespace = dom.namespaceURI
            // First time0 rendering into a node clears it out
            if (dom.vnodes == null) dom.textContent = ""
            if (!Array.isArray(vnodes)) vnodes = [vnodes]
            updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
            dom.vnodes = vnodes
            for (var i = 0; i < hooks.length; i++) hooks[i]()
            if ($doc.activeElement !== active) active.focus()
        }
        return {render: render, setEventCallback: setEventCallback}
    }
    function throttle(callback) {
        //60fps translates to 16.6ms, round it down since setTimeout requires int
        var time = 16
        var last = 0, pending = null
        var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
        return function() {
            var now = Date.now()
            if (last === 0 || now - last >= time) {
                last = now
                callback()
            }
            else if (pending === null) {
                pending = timeout(function() {
                    pending = null
                    callback()
                    last = Date.now()
                }, time - (now - last))
            }
        }
    }
    var _11 = function($window) {
        var renderService = coreRenderer($window)
        renderService.setEventCallback(function(e) {
            if (e.redraw === false) e.redraw = undefined
            else redraw()
        })
        var callbacks = []
        function subscribe(key1, callback) {
            unsubscribe(key1)
            callbacks.push(key1, throttle(callback))
        }
        function unsubscribe(key1) {
            var index = callbacks.indexOf(key1)
            if (index > -1) callbacks.splice(index, 2)
        }
        function redraw() {
            for (var i = 1; i < callbacks.length; i += 2) {
                callbacks[i]()
            }
        }
        return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
    }
    var redrawService = _11(window)
    requestService.setCompletionCallback(redrawService.redraw)
    var _16 = function(redrawService0) {
        return function(root, component) {
            if (component === null) {
                redrawService0.render(root, [])
                redrawService0.unsubscribe(root)
                return
            }
            
            if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
            
            var run0 = function() {
                redrawService0.render(root, Vnode(component))
            }
            redrawService0.subscribe(root, run0)
            redrawService0.redraw()
        }
    }
    m.mount = _16(redrawService)
    var Promise = PromisePolyfill
    var parseQueryString = function(string) {
        if (string === "" || string == null) return {}
        if (string.charAt(0) === "?") string = string.slice(1)
        var entries = string.split("&"), data0 = {}, counters = {}
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i].split("=")
            var key5 = decodeURIComponent(entry[0])
            var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
            if (value === "true") value = true
            else if (value === "false") value = false
            var levels = key5.split(/\]\[?|\[/)
            var cursor = data0
            if (key5.indexOf("[") > -1) levels.pop()
            for (var j = 0; j < levels.length; j++) {
                var level = levels[j], nextLevel = levels[j + 1]
                var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
                var isValue = j === levels.length - 1
                if (level === "") {
                    var key5 = levels.slice(0, j).join()
                    if (counters[key5] == null) counters[key5] = 0
                    level = counters[key5]++
                }
                if (cursor[level] == null) {
                    cursor[level] = isValue ? value : isNumber ? [] : {}
                }
                cursor = cursor[level]
            }
        }
        return data0
    }
    var coreRouter = function($window) {
        var supportsPushState = typeof $window.history.pushState === "function"
        var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
        function normalize1(fragment0) {
            var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
            if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
            return data
        }
        var asyncId
        function debounceAsync(callback0) {
            return function() {
                if (asyncId != null) return
                asyncId = callAsync0(function() {
                    asyncId = null
                    callback0()
                })
            }
        }
        function parsePath(path, queryData, hashData) {
            var queryIndex = path.indexOf("?")
            var hashIndex = path.indexOf("#")
            var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
            if (queryIndex > -1) {
                var queryEnd = hashIndex > -1 ? hashIndex : path.length
                var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
                for (var key4 in queryParams) queryData[key4] = queryParams[key4]
            }
            if (hashIndex > -1) {
                var hashParams = parseQueryString(path.slice(hashIndex + 1))
                for (var key4 in hashParams) hashData[key4] = hashParams[key4]
            }
            return path.slice(0, pathEnd)
        }
        var router = {prefix: "#!"}
        router.getPath = function() {
            var type2 = router.prefix.charAt(0)
            switch (type2) {
                case "#": return normalize1("hash").slice(router.prefix.length)
                case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
                default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
            }
        }
        router.setPath = function(path, data, options) {
            var queryData = {}, hashData = {}
            path = parsePath(path, queryData, hashData)
            if (data != null) {
                for (var key4 in data) queryData[key4] = data[key4]
                path = path.replace(/:([^\/]+)/g, function(match2, token) {
                    delete queryData[token]
                    return data[token]
                })
            }
            var query = buildQueryString(queryData)
            if (query) path += "?" + query
            var hash = buildQueryString(hashData)
            if (hash) path += "#" + hash
            if (supportsPushState) {
                var state = options ? options.state : null
                var title = options ? options.title : null
                $window.onpopstate()
                if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
                else $window.history.pushState(state, title, router.prefix + path)
            }
            else $window.location.href = router.prefix + path
        }
        router.defineRoutes = function(routes, resolve, reject) {
            function resolveRoute() {
                var path = router.getPath()
                var params = {}
                var pathname = parsePath(path, params, params)
                var state = $window.history.state
                if (state != null) {
                    for (var k in state) params[k] = state[k]
                }
                for (var route0 in routes) {
                    var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
                    if (matcher.test(pathname)) {
                        pathname.replace(matcher, function() {
                            var keys = route0.match(/:[^\/]+/g) || []
                            var values = [].slice.call(arguments, 1, -2)
                            for (var i = 0; i < keys.length; i++) {
                                params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
                            }
                            resolve(routes[route0], params, path, route0)
                        })
                        return
                    }
                }
                reject(path, params)
            }
            if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
            else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
            resolveRoute()
        }
        return router
    }
    var _20 = function($window, redrawService0) {
        var routeService = coreRouter($window)
        var identity = function(v) {return v}
        var render1, component, attrs3, currentPath, lastUpdate
        var route = function(root, defaultRoute, routes) {
            if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
            var run1 = function() {
                if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
            }
            var bail = function(path) {
                if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
                else throw new Error("Could not resolve default route " + defaultRoute)
            }
            routeService.defineRoutes(routes, function(payload, params, path) {
                var update = lastUpdate = function(routeResolver, comp) {
                    if (update !== lastUpdate) return
                    component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
                    attrs3 = params, currentPath = path, lastUpdate = null
                    render1 = (routeResolver.render || identity).bind(routeResolver)
                    run1()
                }
                if (payload.view || typeof payload === "function") update({}, payload)
                else {
                    if (payload.onmatch) {
                        Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
                            update(payload, resolved)
                        }, bail)
                    }
                    else update(payload, "div")
                }
            }, bail)
            redrawService0.subscribe(root, run1)
        }
        route.set = function(path, data, options) {
            if (lastUpdate != null) {
                options = options || {}
                options.replace = true
            }
            lastUpdate = null
            routeService.setPath(path, data, options)
        }
        route.get = function() {return currentPath}
        route.prefix = function(prefix0) {routeService.prefix = prefix0}
        route.link = function(vnode1) {
            vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
            vnode1.dom.onclick = function(e) {
                if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
                e.preventDefault()
                e.redraw = false
                var href = this.getAttribute("href")
                if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
                route.set(href, undefined, undefined)
            }
        }
        route.param = function(key3) {
            if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
            return attrs3
        }
        return route
    }
    m.route = _20(window, redrawService)
    m.withAttr = function(attrName, callback1, context) {
        return function(e) {
            callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
        }
    }
    var _28 = coreRenderer(window)
    m.render = _28.render
    m.redraw = redrawService.redraw
    m.request = requestService.request
    m.jsonp = requestService.jsonp
    m.parseQueryString = parseQueryString
    m.buildQueryString = buildQueryString
    m.version = "1.1.3"
    m.vnode = Vnode
    if (true) module["exports"] = m
    else window.m = m
    }());
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).setImmediate, __webpack_require__(6)))
    
    /***/ }),
    /* 1 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var Layout = __webpack_require__(17);
    
    var attrs = {};
    
    function Page(PageComponent) {
        PageComponent.oninit = PageComponent.oninit || function (vnode) {
            // destroying previous scope to prevent v3 super flashies
            if (typeof SearchSpring != 'undefined' && SearchSpring.Catalog) {
                var $scope = SearchSpring.Catalog.elems.container.scope();
    
                $scope.$destroy();
    
                // delete SearchSpring.Catalog;
            }
        };
    
        this.view = function () {
            return m(
                Layout,
                attrs,
                m(PageComponent, attrs)
            );
        };
    }
    
    Page.defineAttrs = function (fn) {
        attrs = fn();
    };
    
    module.exports = Page;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 2 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var siteId = __webpack_require__(5);
    
    __webpack_require__(20);
    
    var templates = document.createElement('div');
    templates.innerHTML = __webpack_require__(22);
    document.body.appendChild(templates);
    
    var beforeSearchCallbacks = {};
    
    function bgFiltersToSimpleString(bgFilters) {
        var nodes = [];
    
        Object.keys(bgFilters).forEach(function (key) {
            nodes.push(key);
            nodes.push(bgFilters[key]);
        });
    
        return nodes.join(':');
    }
    
    window.SearchSpringInit = function () {};
    
    var AjaxCatalog = {
        oninit: function oninit(vnode) {
            this.id = Math.random() + +new Date();
    
            this.bgFilters = vnode.attrs.bgFilters || {};
            this.applyOverloads();
        },
        applyOverloads: function applyOverloads() {
            var _this = this;
    
            beforeSearchCallbacks[this.id] = function (req) {
                req.disableRedirects = 1;
                req.siteId = siteId;
    
                Object.keys(_this.bgFilters).forEach(function (fieldName) {
                    var values = _this.bgFilters[fieldName];
    
                    if (values instanceof Array) {
                        req['bgfilter.' + fieldName] = values;
                    } else if (values instanceof Object) {
                        Object.keys(values).forEach(function (key) {
                            req['bgfilter.' + fieldName + '.' + key] = values[key];
                        });
                    }
                });
            };
        },
        onbeforeupdate: function onbeforeupdate(vnode) {
            this.bgFilters = vnode.attrs.bgFilters || {};
            this.applyOverloads();
        },
        onremove: function onremove() {
            delete beforeSearchCallbacks[this.id];
        },
        view: function view(vnode) {
            var contextInfo = bgFiltersToSimpleString(vnode.attrs.bgFilters || {});
    
            return m(
                'div',
                null,
                [m('script', {
                    key: contextInfo + '_' + m.route.param('q'),
                    src: 'http://a.cdn.searchspring.net/search/v3/js/searchspring.catalog.js',
                    'hide-content': '.searchspring-sidebar, .searchspring-content',
                    searchspring: siteId,
                    onload: function onload() {
                        setTimeout(function () {
                            SearchSpring.Catalog.on('beforeSearch', function (req, config) {
                                if (!config.moduleName) {
                                    Object.keys(beforeSearchCallbacks).forEach(function (key) {
                                        beforeSearchCallbacks[key](req);
                                    });
                                }
                                // console.log('beforeSearch callback...');
                            });
                        });
                    }
                })]
            );
        }
    };
    
    module.exports = AjaxCatalog;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 3 */
    /***/ (function(module, exports) {
    
    /*
        MIT License http://www.opensource.org/licenses/mit-license.php
        Author Tobias Koppers @sokra
    */
    // css base code, injected by the css-loader
    module.exports = function(useSourceMap) {
        var list = [];
    
        // return the list of modules as css string
        list.toString = function toString() {
            return this.map(function (item) {
                var content = cssWithMappingToString(item, useSourceMap);
                if(item[2]) {
                    return "@media " + item[2] + "{" + content + "}";
                } else {
                    return content;
                }
            }).join("");
        };
    
        // import a list of modules into the list
        list.i = function(modules, mediaQuery) {
            if(typeof modules === "string")
                modules = [[null, modules, ""]];
            var alreadyImportedModules = {};
            for(var i = 0; i < this.length; i++) {
                var id = this[i][0];
                if(typeof id === "number")
                    alreadyImportedModules[id] = true;
            }
            for(i = 0; i < modules.length; i++) {
                var item = modules[i];
                // skip already imported module
                // this implementation is not 100% perfect for weird media query combinations
                //  when a module is imported multiple times with different media queries.
                //  I hope this will never occur (Hey this way we have smaller bundles)
                if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
                    if(mediaQuery && !item[2]) {
                        item[2] = mediaQuery;
                    } else if(mediaQuery) {
                        item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
                    }
                    list.push(item);
                }
            }
        };
        return list;
    };
    
    function cssWithMappingToString(item, useSourceMap) {
        var content = item[1] || '';
        var cssMapping = item[3];
        if (!cssMapping) {
            return content;
        }
    
        if (useSourceMap && typeof btoa === 'function') {
            var sourceMapping = toComment(cssMapping);
            var sourceURLs = cssMapping.sources.map(function (source) {
                return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
            });
    
            return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
        }
    
        return [content].join('\n');
    }
    
    // Adapted from convert-source-map (MIT)
    function toComment(sourceMap) {
        // eslint-disable-next-line no-undef
        var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
        var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
    
        return '/*# ' + data + ' */';
    }
    
    
    /***/ }),
    /* 4 */
    /***/ (function(module, exports, __webpack_require__) {
    
    /*
        MIT License http://www.opensource.org/licenses/mit-license.php
        Author Tobias Koppers @sokra
    */
    
    var stylesInDom = {};
    
    var	memoize = function (fn) {
        var memo;
    
        return function () {
            if (typeof memo === "undefined") memo = fn.apply(this, arguments);
            return memo;
        };
    };
    
    var isOldIE = memoize(function () {
        // Test for IE <= 9 as proposed by Browserhacks
        // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
        // Tests for existence of standard globals is to allow style-loader
        // to operate correctly into non-standard environments
        // @see https://github.com/webpack-contrib/style-loader/issues/177
        return window && document && document.all && !window.atob;
    });
    
    var getElement = (function (fn) {
        var memo = {};
    
        return function(selector) {
            if (typeof memo[selector] === "undefined") {
                memo[selector] = fn.call(this, selector);
            }
    
            return memo[selector]
        };
    })(function (target) {
        return document.querySelector(target)
    });
    
    var singleton = null;
    var	singletonCounter = 0;
    var	stylesInsertedAtTop = [];
    
    var	fixUrls = __webpack_require__(14);
    
    module.exports = function(list, options) {
        if (typeof DEBUG !== "undefined" && DEBUG) {
            if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
        }
    
        options = options || {};
    
        options.attrs = typeof options.attrs === "object" ? options.attrs : {};
    
        // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
        // tags it will allow on a page
        if (!options.singleton) options.singleton = isOldIE();
    
        // By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";
    
        // By default, add <style> tags to the bottom of the target
        if (!options.insertAt) options.insertAt = "bottom";
    
        var styles = listToStyles(list, options);
    
        addStylesToDom(styles, options);
    
        return function update (newList) {
            var mayRemove = [];
    
            for (var i = 0; i < styles.length; i++) {
                var item = styles[i];
                var domStyle = stylesInDom[item.id];
    
                domStyle.refs--;
                mayRemove.push(domStyle);
            }
    
            if(newList) {
                var newStyles = listToStyles(newList, options);
                addStylesToDom(newStyles, options);
            }
    
            for (var i = 0; i < mayRemove.length; i++) {
                var domStyle = mayRemove[i];
    
                if(domStyle.refs === 0) {
                    for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();
    
                    delete stylesInDom[domStyle.id];
                }
            }
        };
    };
    
    function addStylesToDom (styles, options) {
        for (var i = 0; i < styles.length; i++) {
            var item = styles[i];
            var domStyle = stylesInDom[item.id];
    
            if(domStyle) {
                domStyle.refs++;
    
                for(var j = 0; j < domStyle.parts.length; j++) {
                    domStyle.parts[j](item.parts[j]);
                }
    
                for(; j < item.parts.length; j++) {
                    domStyle.parts.push(addStyle(item.parts[j], options));
                }
            } else {
                var parts = [];
    
                for(var j = 0; j < item.parts.length; j++) {
                    parts.push(addStyle(item.parts[j], options));
                }
    
                stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
            }
        }
    }
    
    function listToStyles (list, options) {
        var styles = [];
        var newStyles = {};
    
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var id = options.base ? item[0] + options.base : item[0];
            var css = item[1];
            var media = item[2];
            var sourceMap = item[3];
            var part = {css: css, media: media, sourceMap: sourceMap};
    
            if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
            else newStyles[id].parts.push(part);
        }
    
        return styles;
    }
    
    function insertStyleElement (options, style) {
        var target = getElement(options.insertInto)
    
        if (!target) {
            throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
        }
    
        var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];
    
        if (options.insertAt === "top") {
            if (!lastStyleElementInsertedAtTop) {
                target.insertBefore(style, target.firstChild);
            } else if (lastStyleElementInsertedAtTop.nextSibling) {
                target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
            } else {
                target.appendChild(style);
            }
            stylesInsertedAtTop.push(style);
        } else if (options.insertAt === "bottom") {
            target.appendChild(style);
        } else {
            throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
        }
    }
    
    function removeStyleElement (style) {
        if (style.parentNode === null) return false;
        style.parentNode.removeChild(style);
    
        var idx = stylesInsertedAtTop.indexOf(style);
        if(idx >= 0) {
            stylesInsertedAtTop.splice(idx, 1);
        }
    }
    
    function createStyleElement (options) {
        var style = document.createElement("style");
    
        options.attrs.type = "text/css";
    
        addAttrs(style, options.attrs);
        insertStyleElement(options, style);
    
        return style;
    }
    
    function createLinkElement (options) {
        var link = document.createElement("link");
    
        options.attrs.type = "text/css";
        options.attrs.rel = "stylesheet";
    
        addAttrs(link, options.attrs);
        insertStyleElement(options, link);
    
        return link;
    }
    
    function addAttrs (el, attrs) {
        Object.keys(attrs).forEach(function (key) {
            el.setAttribute(key, attrs[key]);
        });
    }
    
    function addStyle (obj, options) {
        var style, update, remove, result;
    
        // If a transform function was defined, run it on the css
        if (options.transform && obj.css) {
            result = options.transform(obj.css);
    
            if (result) {
                // If transform returns a value, use that instead of the original css.
                // This allows running runtime transformations on the css.
                obj.css = result;
            } else {
                // If the transform function returns a falsy value, don't add this css.
                // This allows conditional loading of css
                return function() {
                    // noop
                };
            }
        }
    
        if (options.singleton) {
            var styleIndex = singletonCounter++;
    
            style = singleton || (singleton = createStyleElement(options));
    
            update = applyToSingletonTag.bind(null, style, styleIndex, false);
            remove = applyToSingletonTag.bind(null, style, styleIndex, true);
    
        } else if (
            obj.sourceMap &&
            typeof URL === "function" &&
            typeof URL.createObjectURL === "function" &&
            typeof URL.revokeObjectURL === "function" &&
            typeof Blob === "function" &&
            typeof btoa === "function"
        ) {
            style = createLinkElement(options);
            update = updateLink.bind(null, style, options);
            remove = function () {
                removeStyleElement(style);
    
                if(style.href) URL.revokeObjectURL(style.href);
            };
        } else {
            style = createStyleElement(options);
            update = applyToTag.bind(null, style);
            remove = function () {
                removeStyleElement(style);
            };
        }
    
        update(obj);
    
        return function updateStyle (newObj) {
            if (newObj) {
                if (
                    newObj.css === obj.css &&
                    newObj.media === obj.media &&
                    newObj.sourceMap === obj.sourceMap
                ) {
                    return;
                }
    
                update(obj = newObj);
            } else {
                remove();
            }
        };
    }
    
    var replaceText = (function () {
        var textStore = [];
    
        return function (index, replacement) {
            textStore[index] = replacement;
    
            return textStore.filter(Boolean).join('\n');
        };
    })();
    
    function applyToSingletonTag (style, index, remove, obj) {
        var css = remove ? "" : obj.css;
    
        if (style.styleSheet) {
            style.styleSheet.cssText = replaceText(index, css);
        } else {
            var cssNode = document.createTextNode(css);
            var childNodes = style.childNodes;
    
            if (childNodes[index]) style.removeChild(childNodes[index]);
    
            if (childNodes.length) {
                style.insertBefore(cssNode, childNodes[index]);
            } else {
                style.appendChild(cssNode);
            }
        }
    }
    
    function applyToTag (style, obj) {
        var css = obj.css;
        var media = obj.media;
    
        if(media) {
            style.setAttribute("media", media)
        }
    
        if(style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            while(style.firstChild) {
                style.removeChild(style.firstChild);
            }
    
            style.appendChild(document.createTextNode(css));
        }
    }
    
    function updateLink (link, options, obj) {
        var css = obj.css;
        var sourceMap = obj.sourceMap;
    
        /*
            If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
            and there is no publicPath defined then lets turn convertToAbsoluteUrls
            on by default.  Otherwise default to the convertToAbsoluteUrls option
            directly
        */
        var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;
    
        if (options.convertToAbsoluteUrls || autoFixUrls) {
            css = fixUrls(css);
        }
    
        if (sourceMap) {
            // http://stackoverflow.com/a/26603875
            css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
        }
    
        var blob = new Blob([css], { type: "text/css" });
    
        var oldSrc = link.href;
    
        link.href = URL.createObjectURL(blob);
    
        if(oldSrc) URL.revokeObjectURL(oldSrc);
    }
    
    
    /***/ }),
    /* 5 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    module.exports = 'scmq7n';
    
    /***/ }),
    /* 6 */
    /***/ (function(module, exports) {
    
    var g;
    
    // This works in non-strict mode
    g = (function() {
        return this;
    })();
    
    try {
        // This works if eval is allowed (see CSP)
        g = g || Function("return this")() || (1,eval)("this");
    } catch(e) {
        // This works if the window reference is available
        if(typeof window === "object")
            g = window;
    }
    
    // g can still be undefined, but nothing to do about it...
    // We return undefined, instead of nothing here, so it's
    // easier to handle this case. if(!global) { ...}
    
    module.exports = g;
    
    
    /***/ }),
    /* 7 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
    
    var Link = {
        view: function view(vnode) {
            return m(
                'a',
                _extends({}, vnode.attrs, {
                    oncreate: m.route.link,
                    'class': [vnode.attrs.class || '', vnode.attrs.href == m.route.get().split('#')[0] ? 'active' : ''].join(' ')
                }),
                vnode.children
            );
        }
    };
    
    module.exports = Link;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 8 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    __webpack_require__(12);
    
    var categories = __webpack_require__(15);
    var Page = __webpack_require__(1);
    
    Page.defineAttrs(function () {
        var _cart = new Map(JSON.parse(localStorage.ssCart || '[]'));
    
        return {
            onAddCart: function onAddCart(product) {
                if (_cart.has(product.id)) {
                    _cart.delete(product.id);
                } else {
                    _cart.set(product.id, product);
                }
    
                localStorage.ssCart = JSON.stringify(Array.from(_cart));
            },
            cart: function cart() {
                return _cart;
            },
            rand: function rand() {
                return Math.random();
            },
            links: {
                categories: categories.map(function (category) {
                    return {
                        name: category.name,
                        link: category.link
                    };
                })
            }
        };
    });
    
    var routes = categories.reduce(function (map, category, index) {
        console.log(map, category);
        map[category.link] = category.require;
        return map;
    }, {});
    
    // adding other routes in addition to categories
    routes['/search'] = __webpack_require__(28);
    routes['/product/:sku'] = __webpack_require__(29), routes['/cart'] = __webpack_require__(34);
    
    m.route.prefix('');
    m.route(document.querySelector('#app'), '/new-arrivals', routes);
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 9 */
    /***/ (function(module, exports, __webpack_require__) {
    
    var apply = Function.prototype.apply;
    
    // DOM APIs, for completeness
    
    exports.setTimeout = function() {
      return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
    };
    exports.setInterval = function() {
      return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
    };
    exports.clearTimeout =
    exports.clearInterval = function(timeout) {
      if (timeout) {
        timeout.close();
      }
    };
    
    function Timeout(id, clearFn) {
      this._id = id;
      this._clearFn = clearFn;
    }
    Timeout.prototype.unref = Timeout.prototype.ref = function() {};
    Timeout.prototype.close = function() {
      this._clearFn.call(window, this._id);
    };
    
    // Does not start the time, just sets up the members needed.
    exports.enroll = function(item, msecs) {
      clearTimeout(item._idleTimeoutId);
      item._idleTimeout = msecs;
    };
    
    exports.unenroll = function(item) {
      clearTimeout(item._idleTimeoutId);
      item._idleTimeout = -1;
    };
    
    exports._unrefActive = exports.active = function(item) {
      clearTimeout(item._idleTimeoutId);
    
      var msecs = item._idleTimeout;
      if (msecs >= 0) {
        item._idleTimeoutId = setTimeout(function onTimeout() {
          if (item._onTimeout)
            item._onTimeout();
        }, msecs);
      }
    };
    
    // setimmediate attaches itself to the global object
    __webpack_require__(10);
    exports.setImmediate = setImmediate;
    exports.clearImmediate = clearImmediate;
    
    
    /***/ }),
    /* 10 */
    /***/ (function(module, exports, __webpack_require__) {
    
    /* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
        "use strict";
    
        if (global.setImmediate) {
            return;
        }
    
        var nextHandle = 1; // Spec says greater than zero
        var tasksByHandle = {};
        var currentlyRunningATask = false;
        var doc = global.document;
        var registerImmediate;
    
        function setImmediate(callback) {
          // Callback can either be a function or a string
          if (typeof callback !== "function") {
            callback = new Function("" + callback);
          }
          // Copy function arguments
          var args = new Array(arguments.length - 1);
          for (var i = 0; i < args.length; i++) {
              args[i] = arguments[i + 1];
          }
          // Store and register the task
          var task = { callback: callback, args: args };
          tasksByHandle[nextHandle] = task;
          registerImmediate(nextHandle);
          return nextHandle++;
        }
    
        function clearImmediate(handle) {
            delete tasksByHandle[handle];
        }
    
        function run(task) {
            var callback = task.callback;
            var args = task.args;
            switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
            }
        }
    
        function runIfPresent(handle) {
            // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
            // So if we're currently running a task, we'll need to delay this invocation.
            if (currentlyRunningATask) {
                // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
                // "too much recursion" error.
                setTimeout(runIfPresent, 0, handle);
            } else {
                var task = tasksByHandle[handle];
                if (task) {
                    currentlyRunningATask = true;
                    try {
                        run(task);
                    } finally {
                        clearImmediate(handle);
                        currentlyRunningATask = false;
                    }
                }
            }
        }
    
        function installNextTickImplementation() {
            registerImmediate = function(handle) {
                process.nextTick(function () { runIfPresent(handle); });
            };
        }
    
        function canUsePostMessage() {
            // The test against `importScripts` prevents this implementation from being installed inside a web worker,
            // where `global.postMessage` means something completely different and can't be used for this purpose.
            if (global.postMessage && !global.importScripts) {
                var postMessageIsAsynchronous = true;
                var oldOnMessage = global.onmessage;
                global.onmessage = function() {
                    postMessageIsAsynchronous = false;
                };
                global.postMessage("", "*");
                global.onmessage = oldOnMessage;
                return postMessageIsAsynchronous;
            }
        }
    
        function installPostMessageImplementation() {
            // Installs an event handler on `global` for the `message` event: see
            // * https://developer.mozilla.org/en/DOM/window.postMessage
            // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
    
            var messagePrefix = "setImmediate$" + Math.random() + "$";
            var onGlobalMessage = function(event) {
                if (event.source === global &&
                    typeof event.data === "string" &&
                    event.data.indexOf(messagePrefix) === 0) {
                    runIfPresent(+event.data.slice(messagePrefix.length));
                }
            };
    
            if (global.addEventListener) {
                global.addEventListener("message", onGlobalMessage, false);
            } else {
                global.attachEvent("onmessage", onGlobalMessage);
            }
    
            registerImmediate = function(handle) {
                global.postMessage(messagePrefix + handle, "*");
            };
        }
    
        function installMessageChannelImplementation() {
            var channel = new MessageChannel();
            channel.port1.onmessage = function(event) {
                var handle = event.data;
                runIfPresent(handle);
            };
    
            registerImmediate = function(handle) {
                channel.port2.postMessage(handle);
            };
        }
    
        function installReadyStateChangeImplementation() {
            var html = doc.documentElement;
            registerImmediate = function(handle) {
                // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
                // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
                var script = doc.createElement("script");
                script.onreadystatechange = function () {
                    runIfPresent(handle);
                    script.onreadystatechange = null;
                    html.removeChild(script);
                    script = null;
                };
                html.appendChild(script);
            };
        }
    
        function installSetTimeoutImplementation() {
            registerImmediate = function(handle) {
                setTimeout(runIfPresent, 0, handle);
            };
        }
    
        // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
        var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
        attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
    
        // Don't get fooled by e.g. browserify environments.
        if ({}.toString.call(global.process) === "[object process]") {
            // For Node.js before 0.9
            installNextTickImplementation();
    
        } else if (canUsePostMessage()) {
            // For non-IE10 modern browsers
            installPostMessageImplementation();
    
        } else if (global.MessageChannel) {
            // For web workers, where supported
            installMessageChannelImplementation();
    
        } else if (doc && "onreadystatechange" in doc.createElement("script")) {
            // For IE 6–8
            installReadyStateChangeImplementation();
    
        } else {
            // For older browsers
            installSetTimeoutImplementation();
        }
    
        attachTo.setImmediate = setImmediate;
        attachTo.clearImmediate = clearImmediate;
    }(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));
    
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(11)))
    
    /***/ }),
    /* 11 */
    /***/ (function(module, exports) {
    
    // shim for using process in browser
    var process = module.exports = {};
    
    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.
    
    var cachedSetTimeout;
    var cachedClearTimeout;
    
    function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout () {
        throw new Error('clearTimeout has not been defined');
    }
    (function () {
        try {
            if (typeof setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
            } else {
                cachedSetTimeout = defaultSetTimout;
            }
        } catch (e) {
            cachedSetTimeout = defaultSetTimout;
        }
        try {
            if (typeof clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
            } else {
                cachedClearTimeout = defaultClearTimeout;
            }
        } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
        }
    } ())
    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
        } catch(e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
            } catch(e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
            }
        }
    
    
    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
        } catch (e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
            } catch (e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
            }
        }
    
    
    
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    
    function cleanUpNextTick() {
        if (!draining || !currentQueue) {
            return;
        }
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }
    
    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
    
        var len = queue.length;
        while(len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }
    
    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
        }
    };
    
    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};
    
    function noop() {}
    
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;
    
    process.listeners = function (name) { return [] }
    
    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };
    
    process.cwd = function () { return '/' };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function() { return 0; };
    
    
    /***/ }),
    /* 12 */
    /***/ (function(module, exports, __webpack_require__) {
    
    // style-loader: Adds some css to the DOM by adding a <style> tag
    
    // load the styles
    var content = __webpack_require__(13);
    if(typeof content === 'string') content = [[module.i, content, '']];
    // Prepare cssTransformation
    var transform;
    
    var options = {}
    options.transform = transform
    // add the styles to the DOM
    var update = __webpack_require__(4)(content, options);
    if(content.locals) module.exports = content.locals;
    // Hot Module Replacement
    if(false) {
        // When the styles change, update the <style> tags
        if(!content.locals) {
            module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./main.scss", function() {
                var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./main.scss");
                if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
                update(newContent);
            });
        }
        // When the module is disposed, remove the <style> tags
        module.hot.dispose(function() { update(); });
    }
    
    /***/ }),
    /* 13 */
    /***/ (function(module, exports, __webpack_require__) {
    
    exports = module.exports = __webpack_require__(3)(undefined);
    // imports
    
    
    // module
    exports.push([module.i, "/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\n/* Document\n   ========================================================================== */\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\nhtml {\n  line-height: 1.15;\n  /* 1 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/* Sections\n   ========================================================================== */\n/**\n * Remove the margin in all browsers.\n */\nbody {\n  margin: 0; }\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/* Grouping content\n   ========================================================================== */\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */ }\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/* Text-level semantics\n   ========================================================================== */\n/**\n * Remove the gray background on active links in IE 10.\n */\na {\n  background-color: transparent; }\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */ }\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\nb,\nstrong {\n  font-weight: bolder; }\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */ }\n\n/**\n * Add the correct font size in all browsers.\n */\nsmall {\n  font-size: 80%; }\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsub {\n  bottom: -0.25em; }\n\nsup {\n  top: -0.5em; }\n\n/* Embedded content\n   ========================================================================== */\n/**\n * Remove the border on images inside links in IE 10.\n */\nimg {\n  border-style: none; }\n\n/* Forms\n   ========================================================================== */\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit;\n  /* 1 */\n  font-size: 100%;\n  /* 1 */\n  line-height: 1.15;\n  /* 1 */\n  margin: 0;\n  /* 2 */ }\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\nbutton,\ninput {\n  /* 1 */\n  overflow: visible; }\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\nbutton,\nselect {\n  /* 1 */\n  text-transform: none; }\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; }\n\n/**\n * Remove the inner border and padding in Firefox.\n */\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0; }\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText; }\n\n/**\n * Correct the padding in Firefox.\n */\nfieldset {\n  padding: 0.35em 0.75em 0.625em; }\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */ }\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\nprogress {\n  vertical-align: baseline; }\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\ntextarea {\n  overflow: auto; }\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */ }\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */ }\n\n/* Interactive\n   ========================================================================== */\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\ndetails {\n  display: block; }\n\n/*\n * Add the correct display in all browsers.\n */\nsummary {\n  display: list-item; }\n\n/* Misc\n   ========================================================================== */\n/**\n * Add the correct display in IE 10+.\n */\ntemplate {\n  display: none; }\n\n/**\n * Add the correct display in IE 10.\n */\n[hidden] {\n  display: none; }\n\n/* Base Styles\n============================================== */\n*, *:before, *:after {\n  box-sizing: border-box; }\n\nhtml, body {\n  min-height: 100%; }\n\nhtml {\n  font-size: 16px; }\n\nbody {\n  height: 100%;\n  -webkit-print-color-adjust: exact;\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\n  backface-visibility: hidden;\n  background-attachment: fixed;\n  font-family: 'Roboto', Helvetica, Arial;\n  font-size: 14px;\n  line-height: 1.5;\n  color: #3f3e40; }\n\nimg {\n  max-width: 100%;\n  width: auto;\n  height: auto;\n  display: block; }\n\na {\n  color: #4c3ce2;\n  text-decoration: none; }\n  a:hover {\n    color: #3f3e40; }\n\nul {\n  list-style: none;\n  padding: 0; }\n\nh1, h2, h3, h4, h5, h6, p, ul {\n  margin: 0 0 20px 0; }\n\nh1, h2, h3, h4, h5, h6, .ss-lite-title {\n  font-weight: 700;\n  font-family: 'Roboto', Helvetica, Arial; }\n\nh1 {\n  font-size: 26px; }\n\nh2 {\n  font-size: 24px; }\n\nh3 {\n  font-size: 22px; }\n\nh4 {\n  font-size: 20px; }\n\nh5, h6 {\n  font-size: 18px; }\n\nhr {\n  border: 0;\n  border-top: 1px solid #ebebeb; }\n\n/* Form fields\n============================================== */\ninput::-webkit-input-placeholder {\n  color: #3f3e40;\n  -webkit-transition: color 0.3s ease-in-out;\n  -moz-transition: color 0.3s ease-in-out;\n  -ms-transition: color 0.3s ease-in-out;\n  -o-transition: color 0.3s ease-in-out;\n  transition: color 0.3s ease-in-out; }\n\ninput:-moz-placeholder {\n  color: #3f3e40;\n  -webkit-transition: color 0.3s ease-in-out;\n  -moz-transition: color 0.3s ease-in-out;\n  -ms-transition: color 0.3s ease-in-out;\n  -o-transition: color 0.3s ease-in-out;\n  transition: color 0.3s ease-in-out; }\n\ninput::-moz-placeholder {\n  color: #3f3e40;\n  -webkit-transition: color 0.3s ease-in-out;\n  -moz-transition: color 0.3s ease-in-out;\n  -ms-transition: color 0.3s ease-in-out;\n  -o-transition: color 0.3s ease-in-out;\n  transition: color 0.3s ease-in-out; }\n\ninput:-ms-input-placeholder {\n  color: #3f3e40;\n  -webkit-transition: color 0.3s ease-in-out;\n  -moz-transition: color 0.3s ease-in-out;\n  -ms-transition: color 0.3s ease-in-out;\n  -o-transition: color 0.3s ease-in-out;\n  transition: color 0.3s ease-in-out; }\n\ninput :focus::-webkit-input-placeholder {\n  color: #3f3e40; }\n\ninput :focus:-moz-placeholder {\n  color: #3f3e40; }\n\ninput :focus::-moz-placeholder {\n  color: #3f3e40; }\n\ninput :focus:-ms-input-placeholder {\n  color: #3f3e40; }\n\ninput[type='text'], button {\n  border: 0;\n  line-height: 1; }\n\nbutton {\n  padding: 7px 20px;\n  color: #ffffff;\n  background: #3a23ad;\n  font-size: 18px;\n  border: none;\n  font-weight: bold;\n  cursor: pointer; }\n  button:hover {\n    color: white;\n    background: #4e37c1; }\n\ninput[type='text'] {\n  color: #3f3e40;\n  padding: 10px;\n  min-height: 40px; }\n\n/* Layout\n============================================== */\n.ss-lite-wrapper {\n  margin: 0 auto;\n  padding: 0 20px;\n  max-width: 1200px;\n  width: auto; }\n\n.ss-lite-flex-wrap, .ss-lite-flex-wrap-center {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-flex-flow: row wrap;\n  -ms-flex-flow: row wrap;\n  flex-flow: row wrap; }\n\n.ss-lite-flex-nowrap, .ss-lite-flex-nowrap-center {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-flex-flow: row nowrap;\n  -ms-flex-flow: row nowrap;\n  flex-flow: row nowrap; }\n\n.ss-lite-flex-wrap-center, .ss-lite-flex-nowrap-center {\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  -ms-grid-row-align: center;\n  align-items: center; }\n\n.ss-lite-row-5 {\n  margin: 0 -5px; }\n  .ss-lite-row-5 > .ss-lite-col {\n    padding: 0 5px; }\n\n.ss-lite-row-10 {\n  margin: 0 -10px; }\n  .ss-lite-row-10 > .ss-lite-col {\n    padding: 0 10px; }\n\n.ss-lite-row-20 {\n  margin: 0 -20px; }\n  .ss-lite-row-20 > .ss-lite-col {\n    padding: 0 20px; }\n\n.clear {\n  clear: both; }\n\n/* Faded background\n============================================== */\n.ss-lite-header {\n  background-color: #f8f8f8; }\n  .ss-lite-header, .ss-lite-header .ss-lite-wrapper {\n    position: relative; }\n  .ss-lite-header .ss-lite-wrapper {\n    padding: 20px; }\n\n/* Header\n============================================== */\n.ss-lite-header .ss-lite-subheader {\n  text-transform: uppercase;\n  color: #00cee1; }\n\n.ss-lite-header .ss-lite-icon {\n  font-size: 20px;\n  color: #4c3ce2; }\n\n.ss-lite-header .ss-lite-header-logo {\n  width: 250px; }\n  .ss-lite-header .ss-lite-header-logo .st0 {\n    fill: url(#SVGID_1_); }\n  .ss-lite-header .ss-lite-header-logo .st1 {\n    fill: url(#SVGID_2_); }\n  .ss-lite-header .ss-lite-header-logo .st2 {\n    fill: #515151; }\n  .ss-lite-header .ss-lite-header-logo a {\n    text-align: right;\n    display: block;\n    line-height: 0; }\n  .ss-lite-header .ss-lite-header-logo svg {\n    max-width: 100%; }\n\n.ss-lite-header .ss-lite-header-buttons {\n  width: 720px;\n  margin: 0 0 0 auto; }\n  .ss-lite-header .ss-lite-header-buttons .ss-lite-search-bar {\n    -webkit-box-flex: 1;\n    -webkit-flex: 1 0 auto;\n    -ms-flex: 1 0 auto;\n    flex: 1 0 auto;\n    position: relative; }\n    .ss-lite-header .ss-lite-header-buttons .ss-lite-search-bar .ss-lite-input[type='text'] {\n      border: 1px solid #ebebeb;\n      width: 100%;\n      padding-right: 50px; }\n      .ss-lite-header .ss-lite-header-buttons .ss-lite-search-bar .ss-lite-input[type='text']::placeholder {\n        color: #c9c9c9;\n        font-weight: 100; }\n    .ss-lite-header .ss-lite-header-buttons .ss-lite-search-bar .ss-lite-button {\n      background-color: transparent;\n      padding: 0;\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      right: 10px;\n      margin: auto; }\n  .ss-lite-header .ss-lite-header-buttons .ss-lite-store-icons {\n    margin: 0 0 0 15px; }\n    .ss-lite-header .ss-lite-header-buttons .ss-lite-store-icons a {\n      position: relative;\n      padding: 0 5px; }\n    .ss-lite-header .ss-lite-header-buttons .ss-lite-store-icons .ss-lite-cart-count {\n      position: absolute;\n      top: 6px;\n      right: -6px;\n      color: #ffffff;\n      font-size: 12px;\n      font-weight: bold;\n      width: 20px;\n      height: 20px;\n      line-height: 20px;\n      text-align: center;\n      display: inline-block;\n      background: #00cee1;\n      border-radius: 100%; }\n      .ss-lite-header .ss-lite-header-buttons .ss-lite-store-icons .ss-lite-cart-count:hover {\n        color: white;\n        background: #4e37c1; }\n\n/* Navigation\n============================================== */\n.ss-lite-navigation {\n  background-color: #3a23ad;\n  border-top: 5px solid #4c3ce2; }\n  .ss-lite-navigation .ss-lite-list {\n    margin: 0 -20px -10px -20px;\n    text-align: center; }\n    .ss-lite-navigation .ss-lite-list li {\n      display: inline-block;\n      zoom: 1;\n      *display: inline;\n      vertical-align: middle;\n      padding: 0 20px 10px 20px; }\n      .ss-lite-navigation .ss-lite-list li a {\n        color: #ffffff;\n        font-size: 16px;\n        font-weight: bold;\n        text-transform: uppercase; }\n        .ss-lite-navigation .ss-lite-list li a.active {\n          border-bottom: 2px solid #00cee1; }\n        .ss-lite-navigation .ss-lite-list li a:hover {\n          color: #00cee1; }\n\n/* Main\n============================================== */\n.ss-lite-site {\n  display: flex;\n  min-height: 100vh;\n  flex-direction: column; }\n\n.ss-lite-main {\n  flex: 1;\n  min-height: 500px;\n  padding: 40px 0; }\n\n.ss-lite-breadcrumbs .ss-lite-list {\n  margin: 0 -5px 40px -5px; }\n  .ss-lite-breadcrumbs .ss-lite-list li {\n    padding: 0 5px;\n    display: inline-block;\n    zoom: 1;\n    *display: inline;\n    vertical-align: middle; }\n\n.ss-lite-main-layout {\n  min-height: 600px; }\n  .ss-lite-main-layout .ss-lite-sidebar {\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 1 auto;\n    -ms-flex: 0 1 auto;\n    flex: 0 1 auto;\n    width: 250px;\n    margin: 0 40px 0 0; }\n  .ss-lite-main-layout .ss-lite-content {\n    -webkit-box-flex: 1;\n    -webkit-flex: 1 1 0%;\n    -ms-flex: 1 1 0%;\n    flex: 1 1 0%; }\n\n/* Footer\n============================================== */\n.ss-lite-footer {\n  padding: 20px 0;\n  background-color: #3a23ad;\n  border-top: 5px solid #4c3ce2; }\n  .ss-lite-footer, .ss-lite-footer a, .ss-lite-footer p, .ss-lite-footer .ss-lite-title {\n    color: #ffffff; }\n  .ss-lite-footer a:hover {\n    color: #00cee1; }\n  .ss-lite-footer .ss-lite-col {\n    -webkit-box-flex: 1;\n    -webkit-flex: 1 1 0%;\n    -ms-flex: 1 1 0%;\n    flex: 1 1 0%; }\n    .ss-lite-footer .ss-lite-col .ss-lite-title {\n      text-transform: uppercase;\n      font-size: 16px;\n      margin: 0 0 10px 0;\n      padding: 0 0 10px 0;\n      border-bottom: 1px solid #4c3ce2; }\n      .ss-lite-footer .ss-lite-col .ss-lite-title .ss-lite-icon {\n        margin: 0 10px 0 0; }\n    .ss-lite-footer .ss-lite-col.ss-lite-footer-visit .ss-lite-list li {\n      display: inline-block;\n      margin-right: 10px; }\n    .ss-lite-footer .ss-lite-col.ss-lite-footer-visit a {\n      display: inline-block;\n      zoom: 1;\n      *display: inline;\n      vertical-align: middle;\n      width: 30px;\n      height: 30px;\n      background: #4c3ce2;\n      text-align: center;\n      -webkit-border-radius: 100%;\n      -moz-border-radius: 100%;\n      -ms-border-radius: 100%;\n      -o-border-radius: 100%;\n      border-radius: 100%; }\n      .ss-lite-footer .ss-lite-col.ss-lite-footer-visit a:hover {\n        color: #ffffff;\n        background-color: #00cee1; }\n      .ss-lite-footer .ss-lite-col.ss-lite-footer-visit a i {\n        line-height: 30px;\n        font-size: 16px; }\n\n/* Footer Copyright\n============================================== */\n.ss-lite-footer-copyright {\n  padding: 30px 0 0;\n  text-align: center; }\n  .ss-lite-footer-copyright p {\n    margin: 0; }\n    .ss-lite-footer-copyright p:first-child {\n      margin: 0 0 2.5px 0; }\n\n/* Responsive\n============================================== */\n@media only screen and (max-width: 991px) {\n  .ss-lite-footer .ss-lite-col, .ss-lite-footer .ss-lite-footer-information {\n    -webkit-box-flex: 1;\n    -webkit-flex: 1 0 auto;\n    -ms-flex: 1 0 auto;\n    flex: 1 0 auto;\n    width: 50%; }\n  .ss-lite-header > .ss-lite-wrapper > .ss-lite-flex-wrap-center {\n    display: block; }\n  .ss-lite-header .ss-lite-header-logo, .ss-lite-header .ss-lite-header-buttons {\n    width: auto; }\n  .ss-lite-header .ss-lite-header-logo {\n    max-width: 250px;\n    margin: 0 auto 20px auto; }\n  .ss-lite-main .ss-lite-flex-nowrap {\n    display: block; }\n    .ss-lite-main .ss-lite-flex-nowrap .ss-lite-sidebar {\n      display: none; } }\n\n@media only screen and (max-width: 767px) {\n  .ss-lite-navigation .ss-lite-list {\n    margin: 0 -10px -10px -10px; }\n    .ss-lite-navigation .ss-lite-list li {\n      padding: 0 10px 10px 10px; }\n      .ss-lite-navigation .ss-lite-list li a {\n        font-size: 14px; } }\n\n@media only screen and (max-width: 540px) {\n  .ss-lite-footer .ss-lite-flex-wrap {\n    display: block; }\n  .ss-lite-footer .ss-lite-col, .ss-lite-footer .ss-lite-footer-information {\n    width: auto; } }\n", ""]);
    
    // exports
    
    
    /***/ }),
    /* 14 */
    /***/ (function(module, exports) {
    
    
    /**
     * When source maps are enabled, `style-loader` uses a link element with a data-uri to
     * embed the css on the page. This breaks all relative urls because now they are relative to a
     * bundle instead of the current page.
     *
     * One solution is to only use full urls, but that may be impossible.
     *
     * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
     *
     * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
     *
     */
    
    module.exports = function (css) {
      // get current location
      var location = typeof window !== "undefined" && window.location;
    
      if (!location) {
        throw new Error("fixUrls requires window.location");
      }
    
        // blank or null?
        if (!css || typeof css !== "string") {
          return css;
      }
    
      var baseUrl = location.protocol + "//" + location.host;
      var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");
    
        // convert each url(...)
        /*
        This regular expression is just a way to recursively match brackets within
        a string.
    
         /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
           (  = Start a capturing group
             (?:  = Start a non-capturing group
                 [^)(]  = Match anything that isn't a parentheses
                 |  = OR
                 \(  = Match a start parentheses
                     (?:  = Start another non-capturing groups
                         [^)(]+  = Match anything that isn't a parentheses
                         |  = OR
                         \(  = Match a start parentheses
                             [^)(]*  = Match anything that isn't a parentheses
                         \)  = Match a end parentheses
                     )  = End Group
                  *\) = Match anything and then a close parens
              )  = Close non-capturing group
              *  = Match anything
           )  = Close capturing group
         \)  = Match a close parens
    
         /gi  = Get all matches, not the first.  Be case insensitive.
         */
        var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
            // strip quotes (if they exist)
            var unquotedOrigUrl = origUrl
                .trim()
                .replace(/^"(.*)"$/, function(o, $1){ return $1; })
                .replace(/^'(.*)'$/, function(o, $1){ return $1; });
    
            // already a full url? no change
            if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
              return fullMatch;
            }
    
            // convert the url to a full url
            var newUrl;
    
            if (unquotedOrigUrl.indexOf("//") === 0) {
                  //TODO: should we add protocol?
                newUrl = unquotedOrigUrl;
            } else if (unquotedOrigUrl.indexOf("/") === 0) {
                // path should be relative to the base url
                newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
            } else {
                // path should be relative to current directory
                newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
            }
    
            // send back the fixed url(...)
            return "url(" + JSON.stringify(newUrl) + ")";
        });
    
        // send back the fixed css
        return fixedCss;
    };
    
    
    /***/ }),
    /* 15 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    module.exports = [{
        name: 'New Arrivals',
        link: '/new-arrivals',
        require: __webpack_require__(16)
    }, {
        name: 'Dresses',
        link: '/dresses',
        require: __webpack_require__(23)
    }, {
        name: 'Tops',
        link: '/tops',
        require: __webpack_require__(24)
    }, {
        name: 'Shoes',
        link: '/shoes',
        require: __webpack_require__(25)
    }, {
        name: 'Accessories',
        link: '/accessories',
        require: __webpack_require__(26)
    }, {
        name: 'Sale',
        link: '/sale',
        require: __webpack_require__(27)
    }];
    
    /***/ }),
    /* 16 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var Page = __webpack_require__(1);
    
    var AjaxCatalog = __webpack_require__(2);
    
    var NewArrivals = new Page({
        view: function view() {
            return m(
                'div',
                null,
                m(AjaxCatalog, { bgFilters: {
                        days_since_published: {
                            low: '*',
                            high: 30
                        }
                    } }),
                m(
                    'div',
                    { 'class': 'ss-lite-breadcrumbs' },
                    m(
                        'ul',
                        { 'class': 'ss-lite-list' },
                        m(
                            'li',
                            null,
                            m(
                                'a',
                                { href: '/' },
                                'Home'
                            )
                        ),
                        m(
                            'li',
                            null,
                            m('i', { 'class': 'ss-lite-icon fas fa-chevron-right' })
                        ),
                        m(
                            'li',
                            null,
                            'New Arrivals'
                        )
                    )
                ),
                m(
                    'div',
                    { 'class': 'ss-lite-flex-nowrap ss-lite-main-layout' },
                    m(
                        'aside',
                        { 'class': 'ss-lite-sidebar' },
                        m('div', { id: 'searchspring-sidebar' })
                    ),
                    m(
                        'section',
                        { 'class': 'ss-lite-content' },
                        m('div', { id: 'searchspring-content' })
                    )
                )
            );
        }
    });
    
    module.exports = NewArrivals;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 17 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var Header = __webpack_require__(18);
    var Footer = __webpack_require__(19);
    
    var Frame = {
        view: function view(vnode) {
            return m(
                'div',
                { 'class': 'ss-lite-site' },
                m(Header, { links: vnode.attrs.links, cart: vnode.attrs.cart() }),
                m(
                    'main',
                    { 'class': 'ss-lite-main' },
                    m(
                        'div',
                        { 'class': 'ss-lite-wrapper' },
                        vnode.children
                    )
                ),
                m(Footer, { links: vnode.attrs.links })
            );
        }
    };
    
    module.exports = Frame;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 18 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var Link = __webpack_require__(7);
    
    var Header = {
        view: function view(vnode) {
            var itemsInCart = vnode.attrs.cart.size;
            var categories = vnode.attrs.links.categories;
    
            return m(
                "header",
                { "class": "ss-lite-header" },
                m(
                    "div",
                    { "class": "ss-lite-wrapper" },
                    m(
                        "div",
                        { "class": "ss-lite-flex-wrap-center ss-lite-row-20" },
                        m(
                            "div",
                            { "class": "ss-lite-col ss-lite-header-logo" },
                            m(
                                "a",
                                { href: "/" },
                                m(
                                    "span",
                                    null,
                                    m(
                                        "svg",
                                        { version: "1.1", id: "SearchSpring-logo", xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", viewBox: "0 0 345.5 66.7" },
                                        m(
                                            "g",
                                            { id: "icon" },
                                            m(
                                                "g",
                                                null,
                                                m(
                                                    "linearGradient",
                                                    { id: "SVGID_1_", gradientUnits: "userSpaceOnUse", x1: "4.2528", y1: "48.76", x2: "43.8016", y2: "48.76", gradientTransform: "matrix(1 0 0 -1 0 68)" },
                                                    m("stop", { offset: "0", style: "stop-color:#3A23AD" }),
                                                    m("stop", { offset: "1", style: "stop-color:#4C3CE2" })
                                                ),
                                                m("path", { "class": "st0", d: "M12.9,13.8C12.9,13.8,12.9,13.8,12.9,13.8c-0.1,0.1-0.3,0.2-0.5,0.2C4.5,17.9,1.9,28.8,6.6,38.5l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2C43.5,20.6,46.2,9.7,41.5,0L12.9,13.8z" })
                                            ),
                                            m(
                                                "g",
                                                null,
                                                m(
                                                    "linearGradient",
                                                    { id: "SVGID_2_", gradientUnits: "userSpaceOnUse", x1: "2.800827e-03", y1: "20.51", x2: "39.5472", y2: "20.51", gradientTransform: "matrix(1 0 0 -1 0 68)" },
                                                    m("stop", { offset: "0", style: "stop-color:#3A23AD" }),
                                                    m("stop", { offset: "1", style: "stop-color:#4C3CE2" })
                                                ),
                                                m("path", { "class": "st1", d: "M8.6,42.1C8.6,42.1,8.6,42.1,8.6,42.1c-0.1,0.1-0.3,0.1-0.5,0.2C0.3,46.1-2.4,57,2.3,66.7l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2c7.9-3.8,10.5-14.8,5.8-24.4L8.6,42.1z" })
                                            )
                                        ),
                                        m(
                                            "g",
                                            { id: "wordmark" },
                                            m(
                                                "g",
                                                null,
                                                m("path", { "class": "st2", d: "M69.2,38.2c1.7,1.5,5.2,3,7.9,3c2.1,0,3-0.7,3-1.7c0-1.2-1.5-1.6-3.8-1.9c-3.8-0.7-9.2-1.4-9.2-7.1 c0-3.9,3.4-7.4,9.6-7.4c3.8,0,6.9,1.2,9.3,3l-2.7,4.7c-1.3-1.3-3.9-2.5-6.6-2.5c-1.7,0-2.8,0.6-2.8,1.5c0,1,1.2,1.4,3.6,1.8 c3.8,0.7,9.4,1.6,9.4,7.5c0,4.2-3.8,7.4-10.2,7.4c-4,0-8.1-1.3-10.4-3.4L69.2,38.2z" }),
                                                m("path", { "class": "st2", d: "M100,23.1c6.6,0,11.4,4.9,11.4,12.4V37H95.5c0.4,2.1,2.4,4,5.7,4c2,0,4.2-0.8,5.5-1.9l3,4.4 c-2.2,2-5.9,3-9.3,3c-6.9,0-12.2-4.5-12.2-11.8C88.1,28.3,93,23.1,100,23.1z M95.4,32.4h9.2c-0.2-1.6-1.3-3.8-4.6-3.8 C96.9,28.6,95.7,30.8,95.4,32.4z" }),
                                                m("path", { "class": "st2", d: "M127.2,43.7c-1.4,1.7-4.1,2.8-6.9,2.8c-3.4,0-7.7-2.3-7.7-7.3c0-5.4,4.2-7,7.7-7c3,0,5.6,0.9,6.9,2.6v-2.8 c0-1.9-1.7-3.2-4.5-3.2c-2.2,0-4.5,0.8-6.3,2.4l-2.5-4.5c2.9-2.5,6.7-3.5,10.1-3.5c5.4,0,10.4,2,10.4,8.9v14h-7.1L127.2,43.7 L127.2,43.7z M127.2,38.2c-0.7-1-2.4-1.6-4-1.6c-1.9,0-3.6,0.8-3.6,2.6s1.7,2.6,3.6,2.6c1.6,0,3.2-0.6,4-1.6V38.2z" }),
                                                m("path", { "class": "st2", d: "M138.6,23.6h7.1v2.8c1.5-1.8,4.3-3.4,7-3.4V30c-0.4-0.1-1-0.2-1.8-0.2c-1.9,0-4.3,0.8-5.2,2.1V46h-7.1 L138.6,23.6L138.6,23.6z" }),
                                                m("path", { "class": "st2", d: "M165.7,23.1c4.8,0,7.8,2.1,9.2,4.1l-4.6,4.3c-0.9-1.3-2.3-2.1-4.2-2.1c-3,0-5.2,2-5.2,5.4s2.3,5.5,5.2,5.5 c1.9,0,3.3-0.9,4.2-2.2l4.6,4.3c-1.3,1.9-4.4,4.1-9.2,4.1c-7,0-12.2-4.7-12.2-11.8C153.5,27.8,158.7,23.1,165.7,23.1z" }),
                                                m("path", { "class": "st2", d: "M192.4,33c0-2.7-1.4-3.6-3.7-3.6c-2.1,0-3.5,1.2-4.3,2.2v14.4h-7.1V15l7.1-3.3v14.6c1.3-1.6,4-3.3,7.7-3.3 c5.1,0,7.4,2.9,7.4,7V46h-7.1V33z" }),
                                                m("path", { "class": "st2", d: "M204.8,38.2c1.7,1.5,5.2,3,7.9,3c2.1,0,3-0.7,3-1.7c0-1.2-1.5-1.6-3.8-1.9c-3.8-0.7-9.2-1.4-9.2-7.1 c0-3.9,3.4-7.4,9.6-7.4c3.8,0,6.9,1.2,9.3,3l-2.7,4.7c-1.3-1.3-3.9-2.5-6.6-2.5c-1.7,0-2.8,0.6-2.8,1.5c0,1,1.2,1.4,3.6,1.8 c3.8,0.7,9.4,1.6,9.4,7.5c0,4.2-3.8,7.4-10.2,7.4c-4,0-8.1-1.3-10.4-3.4L204.8,38.2z" }),
                                                m("path", { "class": "st2", d: "M225.2,54.5V23.6h7.1v2.6c1.8-2.1,4.1-3.1,6.6-3.1c5.6,0,9.8,4.2,9.8,11.7c0,7.6-4.2,11.8-9.8,11.8 c-2.5,0-4.8-1-6.6-3.2v11.1L225.2,54.5L225.2,54.5z M236.6,29.4c-1.5,0-3.4,0.8-4.2,2v6.8c0.9,1.2,2.7,2,4.2,2 c2.8,0,4.9-2.1,4.9-5.5C241.5,31.4,239.3,29.4,236.6,29.4z" }),
                                                m("path", { "class": "st2", d: "M251.6,23.6h7.1v2.8c1.5-1.8,4.3-3.4,7-3.4V30c-0.4-0.1-1-0.2-1.8-0.2c-1.9,0-4.3,0.8-5.2,2.1V46h-7.1 L251.6,23.6L251.6,23.6z" }),
                                                m("path", { "class": "st2", d: "M267.5,16.7c0-2.3,1.8-4.1,4.1-4.1c2.3,0,4.1,1.8,4.1,4.1s-1.8,4.1-4.1,4.1S267.5,19,267.5,16.7z M268,23.6h7.1V46H268V23.6z" }),
                                                m("path", { "class": "st2", d: "M294.5,33c0-2.7-1.4-3.7-3.6-3.7c-2.1,0-3.5,1.2-4.4,2.2v14.4h-7.1V23.6h7.1v2.7c1.3-1.6,4-3.3,7.7-3.3 c5.1,0,7.4,3,7.4,7.1V46h-7.1V33z" }),
                                                m("path", { "class": "st2", d: "M308.4,46.6c1.7,1.8,4.2,2.6,6.8,2.6c2.4,0,5.7-1,5.7-5.1v-1.7c-1.9,2.2-4.1,3.2-6.6,3.2 c-5.5,0-9.9-3.8-9.9-11.3c0-7.4,4.2-11.2,9.9-11.2c2.5,0,4.8,1,6.6,3.2v-2.6h7.1V44c0,9.1-7.2,11-12.8,11c-3.8,0-7-1-9.9-3.3 L308.4,46.6z M320.8,31.3c-0.9-1.2-2.8-2-4.2-2c-2.8,0-4.9,1.7-4.9,4.9c0,3.3,2.1,5,4.9,5c1.5,0,3.4-0.8,4.2-2V31.3z" })
                                            ),
                                            m(
                                                "g",
                                                null,
                                                m("path", { "class": "st2", d: "M335.4,24.4h-1.8v-1.1h4.8v1.1h-1.8v4.9h-1.3L335.4,24.4L335.4,24.4z" }),
                                                m("path", { "class": "st2", d: "M344.2,25l-1.7,4.3H342l-1.7-4.3v4.3H339v-6h1.8l1.5,3.7l1.5-3.7h1.8v6h-1.3L344.2,25L344.2,25z" })
                                            )
                                        )
                                    )
                                ),
                                m(
                                    "span",
                                    { "class": "ss-lite-subheader" },
                                    "SPRINGLY FASHION"
                                )
                            )
                        ),
                        m(
                            "div",
                            { "class": "ss-lite-col ss-lite-header-buttons" },
                            m(
                                "div",
                                { "class": "ss-lite-flex-nowrap-center" },
                                m(
                                    "form",
                                    { "class": "ss-lite-search-bar", action: "/search", method: "get" },
                                    m("input", { "class": "ss-lite-input searchspring-ac", type: "text", name: "q", placeholder: "Search for Brand, Color, Size..." }),
                                    m(
                                        "button",
                                        { "class": "ss-lite-button", type: "submit" },
                                        m("i", { "class": "ss-lite-icon fas fa-search" })
                                    )
                                ),
                                m(
                                    "div",
                                    { "class": "ss-lite-store-icons" },
                                    m(
                                        "a",
                                        { href: "/cart", oncreate: m.route.link },
                                        m("i", { "class": "ss-lite-icon fas fa-shopping-bag" }),
                                        m(
                                            "span",
                                            { "class": "ss-lite-cart-count" },
                                            itemsInCart
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),
                m(
                    "nav",
                    { "class": "ss-lite-navigation" },
                    m(
                        "div",
                        { "class": "ss-lite-wrapper" },
                        m(
                            "ul",
                            { "class": "ss-lite-list" },
                            categories.map(function (category) {
                                return m(
                                    "li",
                                    null,
                                    m(
                                        Link,
                                        { href: category.link },
                                        category.name
                                    )
                                );
                            })
                        )
                    )
                )
            );
        }
    };
    
    module.exports = Header;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 19 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var Link = __webpack_require__(7);
    
    var Footer = {
        view: function view(vnode) {
            var categories = vnode.attrs.links.categories;
    
            return m(
                "footer",
                { "class": "ss-lite-footer" },
                m(
                    "div",
                    { "class": "ss-lite-wrapper" },
                    m(
                        "div",
                        { "class": "ss-lite-flex-wrap ss-lite-row-20 ss-lite-footer-row" },
                        m(
                            "div",
                            { "class": "ss-lite-col ss-lite-footer-categories" },
                            m(
                                "h5",
                                { "class": "ss-lite-title" },
                                m("i", { "class": "ss-lite-icon fas fa-tag" }),
                                "Categories"
                            ),
                            m(
                                "ul",
                                { "class": "ss-lite-list" },
                                categories.map(function (category) {
                                    return m(
                                        "li",
                                        null,
                                        m(
                                            Link,
                                            { href: category.link },
                                            category.name
                                        )
                                    );
                                })
                            )
                        ),
                        m(
                            "div",
                            { "class": "ss-lite-col ss-lite-footer-contact" },
                            m(
                                "h5",
                                { "class": "ss-lite-title" },
                                m("i", { "class": "ss-lite-icon fas fa-hands-helping" }),
                                "Support"
                            ),
                            m(
                                "ul",
                                { "class": "ss-lite-list" },
                                m(
                                    "li",
                                    null,
                                    m(
                                        "a",
                                        { href: "https://searchspring.com/about-searchspring", target: "_blank" },
                                        "About Us"
                                    )
                                ),
                                m(
                                    "li",
                                    null,
                                    m(
                                        "a",
                                        { href: "https://searchspring.com/contact", target: "_blank" },
                                        "Contact"
                                    )
                                ),
                                m(
                                    "li",
                                    null,
                                    m(
                                        "a",
                                        { href: "https://searchspring.com/request-a-demo/", target: "_blank" },
                                        "Request a Demo"
                                    )
                                )
                            )
                        ),
                        m(
                            "div",
                            { "class": "ss-lite-col ss-lite-footer-visit" },
                            m(
                                "h5",
                                { "class": "ss-lite-title" },
                                m("i", { "class": "ss-lite-icon fas fa-heart" }),
                                "Visit Us"
                            ),
                            m(
                                "ul",
                                { "class": "ss-lite-list" },
                                m(
                                    "li",
                                    null,
                                    m(
                                        "a",
                                        { href: "//www.facebook.com/SearchSpring", target: "_blank" },
                                        m("i", { "class": "ss-lite-icon fab fa-facebook-f" })
                                    )
                                ),
                                m(
                                    "li",
                                    null,
                                    m(
                                        "a",
                                        { href: "//twitter.com/SearchSpring", target: "_blank" },
                                        m("i", { "class": "ss-lite-icon fab fa-twitter" })
                                    )
                                ),
                                m(
                                    "li",
                                    null,
                                    m(
                                        "a",
                                        { href: "//www.linkedin.com/company/searchspring", target: "_blank" },
                                        m("i", { "class": "ss-lite-icon fab fa-linkedin-in" })
                                    )
                                )
                            )
                        )
                    )
                ),
                m(
                    "div",
                    { "class": "ss-lite-footer-copyright" },
                    m(
                        "div",
                        { "class": "ss-lite-wrapper" },
                        m(
                            "p",
                            null,
                            "\xA9 2020 ",
                            m(
                                "a",
                                { href: "//searchspring.com", target: "_blank" },
                                "Searchspring"
                            ),
                            " - All rights reserved."
                        )
                    )
                )
            );
        }
    };
    
    module.exports = Footer;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 20 */
    /***/ (function(module, exports, __webpack_require__) {
    
    // style-loader: Adds some css to the DOM by adding a <style> tag
    
    // load the styles
    var content = __webpack_require__(21);
    if(typeof content === 'string') content = [[module.i, content, '']];
    // Prepare cssTransformation
    var transform;
    
    var options = {}
    options.transform = transform
    // add the styles to the DOM
    var update = __webpack_require__(4)(content, options);
    if(content.locals) module.exports = content.locals;
    // Hot Module Replacement
    if(false) {
        // When the styles change, update the <style> tags
        if(!content.locals) {
            module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./styles.scss", function() {
                var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./styles.scss");
                if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
                update(newContent);
            });
        }
        // When the module is disposed, remove the <style> tags
        module.hot.dispose(function() { update(); });
    }
    
    /***/ }),
    /* 21 */
    /***/ (function(module, exports, __webpack_require__) {
    
    exports = module.exports = __webpack_require__(3)(undefined);
    // imports
    
    
    // module
    exports.push([module.i, "", ""]);
    
    // exports
    
    
    /***/ }),
    /* 22 */
    /***/ (function(module, exports) {
    
    module.exports = "<!-- in SMC now -->";
    
    /***/ }),
    /* 23 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var Page = __webpack_require__(1);
    
    var AjaxCatalog = __webpack_require__(2);
    
    var Dresses = new Page({
        view: function view() {
            return m(
                'div',
                null,
                m(AjaxCatalog, { bgFilters: { ss_category_hierarchy: ['All Dresses'] } }),
                m(
                    'div',
                    { 'class': 'ss-lite-breadcrumbs' },
                    m(
                        'ul',
                        { 'class': 'ss-lite-list' },
                        m(
                            'li',
                            null,
                            m(
                                'a',
                                { href: '/' },
                                'Home'
                            )
                        ),
                        m(
                            'li',
                            null,
                            m('i', { 'class': 'ss-lite-icon fas fa-chevron-right' })
                        ),
                        m(
                            'li',
                            null,
                            'Dresses'
                        )
                    )
                ),
                m(
                    'div',
                    { 'class': 'ss-lite-flex-nowrap ss-lite-main-layout' },
                    m(
                        'aside',
                        { 'class': 'ss-lite-sidebar' },
                        m('div', { id: 'searchspring-sidebar' })
                    ),
                    m(
                        'section',
                        { 'class': 'ss-lite-content' },
                        m('div', { id: 'searchspring-content' })
                    )
                )
            );
        }
    });
    
    module.exports = Dresses;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 24 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var Page = __webpack_require__(1);
    
    var AjaxCatalog = __webpack_require__(2);
    
    var Tops = new Page({
        view: function view() {
            return m(
                'div',
                null,
                m(AjaxCatalog, { bgFilters: { ss_category_hierarchy: ['All Tops'] } }),
                m(
                    'div',
                    { 'class': 'ss-lite-breadcrumbs' },
                    m(
                        'ul',
                        { 'class': 'ss-lite-list' },
                        m(
                            'li',
                            null,
                            m(
                                'a',
                                { href: '/' },
                                'Home'
                            )
                        ),
                        m(
                            'li',
                            null,
                            m('i', { 'class': 'ss-lite-icon fas fa-chevron-right' })
                        ),
                        m(
                            'li',
                            null,
                            'Tops'
                        )
                    )
                ),
                m(
                    'div',
                    { 'class': 'ss-lite-flex-nowrap ss-lite-main-layout' },
                    m(
                        'aside',
                        { 'class': 'ss-lite-sidebar' },
                        m('div', { id: 'searchspring-sidebar' })
                    ),
                    m(
                        'section',
                        { 'class': 'ss-lite-content' },
                        m('div', { id: 'searchspring-content' })
                    )
                )
            );
        }
    });
    
    module.exports = Tops;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 25 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var Page = __webpack_require__(1);
    
    var AjaxCatalog = __webpack_require__(2);
    
    var Shoes = new Page({
        view: function view() {
            return m(
                'div',
                null,
                m(AjaxCatalog, { bgFilters: { ss_category_hierarchy: ['All Shoes'] } }),
                m(
                    'div',
                    { 'class': 'ss-lite-breadcrumbs' },
                    m(
                        'ul',
                        { 'class': 'ss-lite-list' },
                        m(
                            'li',
                            null,
                            m(
                                'a',
                                { href: '/' },
                                'Home'
                            )
                        ),
                        m(
                            'li',
                            null,
                            m('i', { 'class': 'ss-lite-icon fas fa-chevron-right' })
                        ),
                        m(
                            'li',
                            null,
                            'Shoes'
                        )
                    )
                ),
                m(
                    'div',
                    { 'class': 'ss-lite-flex-nowrap ss-lite-main-layout' },
                    m(
                        'aside',
                        { 'class': 'ss-lite-sidebar' },
                        m('div', { id: 'searchspring-sidebar' })
                    ),
                    m(
                        'section',
                        { 'class': 'ss-lite-content' },
                        m('div', { id: 'searchspring-content' })
                    )
                )
            );
        }
    });
    
    module.exports = Shoes;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 26 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var Page = __webpack_require__(1);
    
    var AjaxCatalog = __webpack_require__(2);
    
    var Accessories = new Page({
        view: function view() {
            return m(
                'div',
                null,
                m(AjaxCatalog, { bgFilters: { ss_category_hierarchy: ['All Accessories'] } }),
                m(
                    'div',
                    { 'class': 'ss-lite-breadcrumbs' },
                    m(
                        'ul',
                        { 'class': 'ss-lite-list' },
                        m(
                            'li',
                            null,
                            m(
                                'a',
                                { href: '/' },
                                'Home'
                            )
                        ),
                        m(
                            'li',
                            null,
                            m('i', { 'class': 'ss-lite-icon fas fa-chevron-right' })
                        ),
                        m(
                            'li',
                            null,
                            'Accessories'
                        )
                    )
                ),
                m(
                    'div',
                    { 'class': 'ss-lite-flex-nowrap ss-lite-main-layout' },
                    m(
                        'aside',
                        { 'class': 'ss-lite-sidebar' },
                        m('div', { id: 'searchspring-sidebar' })
                    ),
                    m(
                        'section',
                        { 'class': 'ss-lite-content' },
                        m('div', { id: 'searchspring-content' })
                    )
                )
            );
        }
    });
    
    module.exports = Accessories;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 27 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var Page = __webpack_require__(1);
    
    var AjaxCatalog = __webpack_require__(2);
    
    var Sale = new Page({
        view: function view() {
            return m(
                'div',
                null,
                m(AjaxCatalog, { bgFilters: { on_sale: ['Yes'] } }),
                m(
                    'div',
                    { 'class': 'ss-lite-breadcrumbs' },
                    m(
                        'ul',
                        { 'class': 'ss-lite-list' },
                        m(
                            'li',
                            null,
                            m(
                                'a',
                                { href: '/' },
                                'Home'
                            )
                        ),
                        m(
                            'li',
                            null,
                            m('i', { 'class': 'ss-lite-icon fas fa-chevron-right' })
                        ),
                        m(
                            'li',
                            null,
                            'Sale'
                        )
                    )
                ),
                m(
                    'div',
                    { 'class': 'ss-lite-flex-nowrap ss-lite-main-layout' },
                    m(
                        'aside',
                        { 'class': 'ss-lite-sidebar' },
                        m('div', { id: 'searchspring-sidebar' })
                    ),
                    m(
                        'section',
                        { 'class': 'ss-lite-content' },
                        m('div', { id: 'searchspring-content' })
                    )
                )
            );
        }
    });
    
    module.exports = Sale;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 28 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var AjaxCatalog = __webpack_require__(2);
    var Page = __webpack_require__(1);
    
    var Search = new Page({
        view: function view() {
            return m(
                'div',
                null,
                m(AjaxCatalog, { key: m.route.param('q') }),
                m(
                    'div',
                    { 'class': 'ss-lite-breadcrumbs' },
                    m(
                        'ul',
                        { 'class': 'ss-lite-list' },
                        m(
                            'li',
                            null,
                            m(
                                'a',
                                { href: '/' },
                                'Home'
                            )
                        ),
                        m(
                            'li',
                            null,
                            m('i', { 'class': 'ss-lite-icon fas fa-chevron-right' })
                        ),
                        m(
                            'li',
                            null,
                            'Search Results'
                        )
                    )
                ),
                m(
                    'div',
                    { 'class': 'ss-lite-flex-nowrap ss-lite-main-layout' },
                    m(
                        'aside',
                        { 'class': 'ss-lite-sidebar' },
                        m('div', { id: 'searchspring-sidebar' })
                    ),
                    m(
                        'section',
                        { 'class': 'ss-lite-content' },
                        m('div', { id: 'searchspring-content' })
                    )
                )
            );
        }
    });
    
    module.exports = Search;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 29 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var AjaxCatalog = __webpack_require__(2);
    __webpack_require__(30);
    
    var getProduct = __webpack_require__(32);
    var Page = __webpack_require__(1);
    var siteId = __webpack_require__(5);
    
    var cachedProducts = {};
    var failedProducts = {};
    
    function productGetter(product) {
        function getter(field) {
            switch (field) {
                case 'msrp':
                case 'price':
                    return isNaN(product[field]) ? 1000 : Number(product[field]);
                default:
                    return product[field];
            }
        };
    
        getter.asObject = function () {
            return JSON.parse(JSON.stringify(product));
        };
    
        return getter;
    }
    
    var Product = new Page({
        oninit: function oninit(vnode) {
            this.syncState(vnode);
        },
        onbeforeupdate: function onbeforeupdate(vnode) {
            this.syncState(vnode);
        },
        intellisuggest: function intellisuggest(product) {
            var productCode = product('sku');
            IntelliSuggest.init({ siteId: siteId, context: 'Product/' + productCode, seed: productCode });
            IntelliSuggest.viewItem({ sku: productCode });
        },
        syncState: function syncState(vnode) {
            var _this = this;
    
            var sku = this.sku = m.route.param('sku');
    
            if (this.loading) {
                return;
            }
    
            if (failedProducts[sku]) {
                return;
            }
    
            if (cachedProducts[sku]) {
                if (!this.product || this.product('sku') != sku) {
                    this.product = productGetter(JSON.parse(JSON.stringify(cachedProducts[sku])));
                    this.intellisuggest(this.product);
                }
            } else {
                this.loading = true;
    
                getProduct(sku).then(function (product) {
                    cachedProducts[sku] = product;
                    _this.product = productGetter(product);
                    _this.intellisuggest(_this.product);
                }).catch(function () {
                    delete _this.product;
                    failedProducts[sku] = 1;
                }).then(function () {
                    _this.loading = false;
                    m.redraw();
                });
            }
        },
        view: function view(vnode) {
            var _this2 = this;
    
            return this.product ? m(
                'div',
                { id: 'product-detail' },
                m(
                    'div',
                    { id: 'left' },
                    m(
                        'div',
                        { id: 'product-image' },
                        m('img', { src: this.product('imageUrl') })
                    )
                ),
                m(
                    'div',
                    { id: 'right' },
                    m(
                        'div',
                        { id: 'product-info', 'class': 'section' },
                        m(
                            'h2',
                            { id: 'name' },
                            this.product('name')
                        ),
                        m(
                            'div',
                            { id: 'price-container' },
                            this.product('msrp') && this.product('msrp') > this.product('price') ? m(
                                'span',
                                { id: 'msrp' },
                                m(
                                    's',
                                    null,
                                    '$',
                                    this.product('msrp').toFixed(2)
                                ),
                                '\xA0\xA0\xA0\xA0'
                            ) : null,
                            m(
                                'span',
                                { id: 'price' },
                                '$',
                                this.product('price').toFixed(2)
                            )
                        )
                    ),
                    m(
                        'div',
                        { 'class': 'section' },
                        m(
                            'button',
                            { onclick: function onclick() {
                                    return vnode.attrs.onAddCart(_this2.product.asObject());
                                } },
                            vnode.attrs.cart().has(this.product('id')) ? 'Remove from Cart' : 'Add to Cart'
                        )
                    ),
                    m(
                        'div',
                        { id: 'product-description', 'class': 'section' },
                        m.trust(this.product('description'))
                    )
                ),
                m(
                    'div',
                    { 'class': 'section clear' },
                    m('br', null),
                    m('hr', null),
                    m('br', null),
                    m(
                        'script',
                        { type: 'searchspring/recommend', profile: 'product-page' },
                        'seed = [\'',
                        this.product('sku'),
                        '\']'
                    )
                ),
                m(AjaxCatalog, null),
                m(
                    'pre',
                    null,
                    JSON.stringify(this.product, null, 2)
                )
            ) : m(
                'div',
                null,
                'Loading...'
            );
        }
    });
    
    module.exports = Product;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 30 */
    /***/ (function(module, exports, __webpack_require__) {
    
    // style-loader: Adds some css to the DOM by adding a <style> tag
    
    // load the styles
    var content = __webpack_require__(31);
    if(typeof content === 'string') content = [[module.i, content, '']];
    // Prepare cssTransformation
    var transform;
    
    var options = {}
    options.transform = transform
    // add the styles to the DOM
    var update = __webpack_require__(4)(content, options);
    if(content.locals) module.exports = content.locals;
    // Hot Module Replacement
    if(false) {
        // When the styles change, update the <style> tags
        if(!content.locals) {
            module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./styles.scss", function() {
                var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./styles.scss");
                if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
                update(newContent);
            });
        }
        // When the module is disposed, remove the <style> tags
        module.hot.dispose(function() { update(); });
    }
    
    /***/ }),
    /* 31 */
    /***/ (function(module, exports, __webpack_require__) {
    
    exports = module.exports = __webpack_require__(3)(undefined);
    // imports
    
    
    // module
    exports.push([module.i, "/* TODO: Duplicated in main site styles. Find a central location for these */\n#product-detail #left, #product-detail #right {\n  display: inline-block;\n  vertical-align: top;\n  padding: 7px 15px; }\n\n#product-detail #left {\n  width: 39%; }\n\n#product-detail #right {\n  width: 60%;\n  float: right; }\n\n#product-detail #product-image {\n  width: 100%; }\n  #product-detail #product-image img {\n    width: 100%;\n    height: auto; }\n\n#product-detail #product-info #name {\n  margin: 0 0 5px; }\n\n#product-detail #product-info #price-container {\n  margin: 0 0 5px; }\n\n#product-detail #price-container #msrp, #product-detail #price-container #price {\n  font-size: 24px;\n  font-weight: bold; }\n\n#product-detail #price-container #msrp {\n  color: #CDD3DA; }\n\n#product-detail #price-container #price {\n  color: #11122D; }\n\n#product-detail #product-description {\n  margin: 40px 0; }\n\n#product-detail button {\n  padding: 14px 45px; }\n\n@media only screen and (max-width: 541px) {\n  #product-detail #left, #product-detail #right {\n    float: none;\n    width: 100%; } }\n", ""]);
    
    // exports
    
    
    /***/ }),
    /* 32 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    
    
    var search = __webpack_require__(33);
    
    function getProduct(sku) {
        return new Promise(function (resolve, reject) {
            search({ 'filter.sku': sku }).then(function (data) {
                if (!data || !data.results || !data.results.length) {
                    reject();
                }
    
                if (data.results[0].sku != sku) {
                    reject();
                }
    
                resolve(data.results[0]);
            }).catch(reject);
        });
    }
    
    module.exports = getProduct;
    
    /***/ }),
    /* 33 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    var siteId = __webpack_require__(5);
    
    function buildQueryString(params) {
        return m.buildQueryString(params).replace(/\[[0-9]*\]=/g, '=');
    }
    
    function search(params) {
        params = Object.assign({
            siteId: siteId,
            resultsFormat: 'native'
        }, params);
    
        return m.jsonp({
            url: '//' + siteId + '.a.searchspring.io/api/search/search.json?' + buildQueryString(params),
            callbackKey: 'callback'
        });
    }
    
    module.exports = search;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 34 */
    /***/ (function(module, exports, __webpack_require__) {
    
    "use strict";
    /* WEBPACK VAR INJECTION */(function(m) {
    
    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
    
    __webpack_require__(35);
    
    var Page = __webpack_require__(1);
    var AjaxCatalog = __webpack_require__(2);
    var siteId = __webpack_require__(5);
    
    function intellisuggestSeeds(cart) {
        return [].concat(_toConsumableArray(cart.values())).map(function (product) {
            return product.sku;
        });
    }
    
    function intellisuggestItems(cart) {
        return [].concat(_toConsumableArray(cart.values())).map(function (product) {
            return {
                sku: product.sku,
                qty: 1,
                price: product.price
            };
        });
    }
    
    var Cart = new Page({
        oninit: function oninit(vnode) {
            var cart = vnode.attrs.cart();
    
            IntelliSuggest.init({ siteId: 'YOUR_SITE_ID', context: 'Basket', seed: intellisuggestSeeds(cart) });
    
            intellisuggestItems(cart).forEach(function (product) {
                IntelliSuggest.haveItem(product);
            });
    
            IntelliSuggest.inBasket();
        },
        totalPrice: function totalPrice(cart) {
            var total = 0;
    
            cart.forEach(function (product) {
                return total += Number(product.price);
            });
    
            return total;
        },
        view: function view(vnode) {
            var cart = vnode.attrs.cart();
            var seeds = [].concat(_toConsumableArray(cart.values())).map(function (product) {
                return product.sku;
            });
    
            return m(
                'div',
                { 'class': 'cart-contents' },
                m(
                    'div',
                    { id: 'cart-products' },
                    cart.size ? m(
                        'div',
                        null,
                        m(
                            'h2',
                            null,
                            'Total price: $',
                            this.totalPrice(cart).toFixed(2)
                        ),
                        [].concat(_toConsumableArray(cart.values())).map(function (product) {
                            return m(
                                'div',
                                { 'class': 'product' },
                                m(
                                    'div',
                                    { 'class': 'left' },
                                    m(
                                        'div',
                                        { 'class': 'image' },
                                        m('img', { src: product.imageUrl })
                                    )
                                ),
                                m(
                                    'div',
                                    { 'class': 'right' },
                                    m(
                                        'div',
                                        { 'class': 'name section' },
                                        m(
                                            'h3',
                                            null,
                                            product.name
                                        )
                                    ),
                                    m(
                                        'div',
                                        { 'class': 'price section' },
                                        '$',
                                        Number(product.price).toFixed(2)
                                    ),
                                    m(
                                        'div',
                                        { 'class': 'remove-cart section' },
                                        m(
                                            'button',
                                            { onclick: function onclick(ev) {
                                                    return vnode.attrs.onAddCart(product);
                                                } },
                                            'Remove'
                                        )
                                    )
                                )
                            );
                        })
                    ) : m(
                        'h2',
                        null,
                        'There are no products in your shopping cart'
                    )
                ),
                m(
                    'div',
                    { 'class': 'section clear' },
                    m('br', null),
                    m('hr', null),
                    m('br', null),
                    m(
                        'script',
                        { type: 'searchspring/recommend', profile: 'cart-page' },
                        'seed = ',
                        JSON.stringify(seeds)
                    )
                ),
                m(AjaxCatalog, null)
            );
        }
    });
    
    module.exports = Cart;
    /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))
    
    /***/ }),
    /* 35 */
    /***/ (function(module, exports, __webpack_require__) {
    
    // style-loader: Adds some css to the DOM by adding a <style> tag
    
    // load the styles
    var content = __webpack_require__(36);
    if(typeof content === 'string') content = [[module.i, content, '']];
    // Prepare cssTransformation
    var transform;
    
    var options = {}
    options.transform = transform
    // add the styles to the DOM
    var update = __webpack_require__(4)(content, options);
    if(content.locals) module.exports = content.locals;
    // Hot Module Replacement
    if(false) {
        // When the styles change, update the <style> tags
        if(!content.locals) {
            module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./styles.scss", function() {
                var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./styles.scss");
                if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
                update(newContent);
            });
        }
        // When the module is disposed, remove the <style> tags
        module.hot.dispose(function() { update(); });
    }
    
    /***/ }),
    /* 36 */
    /***/ (function(module, exports, __webpack_require__) {
    
    exports = module.exports = __webpack_require__(3)(undefined);
    // imports
    
    
    // module
    exports.push([module.i, "#cart-products h3 {\n  margin: 0; }\n\n#cart-products .product {\n  padding: 20px 0;\n  margin: 20px 0;\n  border-top: 1px solid #ebebeb; }\n  #cart-products .product .right, #cart-products .product .left {\n    display: inline-block;\n    vertical-align: top; }\n  #cart-products .product .left {\n    width: 120px; }\n    #cart-products .product .left .image img {\n      width: 120px;\n      height: auto; }\n  #cart-products .product .right {\n    width: calc(100% - 150px);\n    float: right; }\n", ""]);
    
    // exports
    
    
    /***/ })
    /******/ ]);