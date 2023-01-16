module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1673854635098, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reducerRegistry = exports.wxaRedux = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getStore = getStore;

var _redux = require('redux');

Object.keys(_redux).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _redux[key];
        }
    });
});

var _mapState = require('./mapState');

var _mapState2 = _interopRequireDefault(_mapState);

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

var _core = require('@wxa/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var combine = function combine(registryReducers, userReducers) {
    // if the user directly pass combined reducers to plugin, then we need to use it directly;
    if (typeof userReducers === 'function') return userReducers;

    // const reducerNames = Object.keys(reducers);
    // Object.keys(initialState).forEach(item => {
    //     if (reducerNames.indexOf(item) === -1) {
    //         reducers[item] = (state = null) => state;
    //     }
    // });
    return (0, _redux.combineReducers)(_extends({}, registryReducers, userReducers));
};

var checkAndFilterDataField = function checkAndFilterDataField(data) {
    var maxSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1024 * 1000;

    var check = function check(key, value) {
        var str = JSON.stringify(value);
        if (typeof str !== 'string') return true;

        var len = str.length;
        if (len > maxSize) {
            console.error(key + ' \u6570\u636E\u957F\u5EA6\u4E3A' + len + ', \u6570\u636E\u5927\u4E8E' + maxSize + '\u5C06\u65E0\u6CD5\u540C\u6B65\u5230webview');

            return false;
        }
        return true;
    };

    var ret = Array.isArray(data) ? [] : {};
    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data != null) {
        Object.keys(data).forEach(function (key) {
            if (check(key, data[key])) {
                ret[key] = data[key];
            };
        });
    } else {
        ret = data;
    }
    return ret;
};

var isEmpty = function isEmpty(val) {
    return val == null || !Object.keys(val).length;
};

var simpleDeepClone = function simpleDeepClone(val) {
    if (val == null) return val;
    try {
        var ret = JSON.parse(JSON.stringify(val));
        return ret;
    } catch (e) {
        console.error('[@wxa/redux] 深拷贝失败 ', e);
        return Object.assign({}, val);
    }
};

var _store = void 0;

function getStore() {
    if (_store == null) console.warn('%c[@wxa/redux] store is null, initial redux plugin first in app.wxa', 'font-size: 12px; color: red;');

    return _store;
}

var wxaRedux = exports.wxaRedux = function wxaRedux() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // get options.
    var args = [];
    var userReducers = void 0;
    var debug = false;
    if (Array.isArray(options)) {
        userReducers = options[0];
        // object reducer
        args = [combine(_registry2.default.getReducers(), userReducers)].concat(_toConsumableArray(options.slice(1)));
    } else {
        userReducers = options.reducers;
        debug = options.debug;
        var middlewares = options.middlewares,
            initialState = options.initialState;


        args = [combine(_registry2.default.getReducers(), userReducers), initialState];
        if (Array.isArray(middlewares)) args.push(_redux.applyMiddleware.apply(undefined, _toConsumableArray(middlewares)));else if (typeof middlewares === 'function') args.push(middlewares);
    }

    // create Store directly;
    // cause the reducer may be attached at subpackages.
    var store = _redux.createStore.apply(null, args);
    _store = store;

    _registry2.default.setChangeListener(function (reducer) {
        var reducers = combine(reducer, userReducers);
        if (debug) {
            console.group('%c[@wxa/redux] Replacing reducers', 'font-size: 12px; color: green;');
            console.table({
                'registered reducer': reducer,
                'init reducer': userReducers
            });
            console.groupEnd();
        }
        store.replaceReducer(reducers);
    });

    var syncStore = function syncStore() {
        this.$$isCurrentPage = true;
        var data = (0, _mapState2.default)(this.mapState, this.$store.getState(), this.$$storeLastState, this);
        if (!isEmpty(data)) {
            // 有效state
            data = simpleDeepClone(data);
            this.$$storeLastState = data;
            var diffData = this.$$reduxDiff(data);
            var validData = checkAndFilterDataField(diffData);
            if (debug) console.log('[@wxa/redux] data ready to set ', _extends({}, validData));
            this.setData(validData);
        };
    };

    var mountRedux = function mountRedux(originHook) {
        return function () {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            this.$$reduxDiff = _core.diff.bind(this);
            if (this.$store) {
                var connectState = function connectState() {
                    var newState = _this.$store.getState();
                    var lastState = _this.$$storeLastState;
                    var data = (0, _mapState2.default)(_this.mapState, newState, lastState, _this);
                    if (!isEmpty(data)) {
                        // 防止引用类型错误修改
                        data = simpleDeepClone(data);
                        // 有效state
                        _this.$$storeLastState = data;
                        var diffData = _this.$$reduxDiff(data);
                        var validData = checkAndFilterDataField(diffData);
                        if (debug) console.log('[@wxa/redux] data ready to set ', _extends({}, validData));
                        if (validData != null) _this.setData(validData);
                    }
                };
                this.$unsubscribe = this.$store.subscribe(function () {
                    // Object updated && page is showing
                    if (_this.$$isCurrentPage) {
                        connectState();
                    }
                });
                // 直接挂载一次数据，这样子onLoad阶段可以直接使用现有数据
                connectState();
            }
            if (originHook) originHook.apply(this, args);
        };
    };

    var unmountRedux = function unmountRedux(originUnmount) {
        return function () {
            if (this.$unsubscribe) {
                this.$unsubscribe();
                this.$unsubscribe = null;
                this.$$storeLastState = null;
            }

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            if (originUnmount) originUnmount.apply(this, args);
        };
    };

    return function (vm, type) {
        switch (type) {
            case 'App':
                vm.$store = store;
                break;
            case 'Page':
                vm.$store = store;
                var onLoad = vm.onLoad,
                    onShow = vm.onShow,
                    onUnload = vm.onUnload,
                    onHide = vm.onHide;

                vm.onLoad = mountRedux(onLoad);
                vm.onShow = function () {
                    syncStore.bind(this)();

                    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        args[_key3] = arguments[_key3];
                    }

                    if (onShow) onShow.apply(this, args);
                };
                vm.onHide = function () {
                    this.$$isCurrentPage = false;

                    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                        args[_key4] = arguments[_key4];
                    }

                    if (onHide) onHide.apply(this, args);
                };
                vm.onUnload = unmountRedux(onUnload);
                break;
            case 'Component':
                var created = vm.created,
                    attached = vm.attached,
                    detached = vm.detached,
                    pageLifetimes = vm.pageLifetimes,
                    lifetimes = vm.lifetimes;


                vm.pageLifetimes = pageLifetimes || {};
                vm.lifetimes = lifetimes || {};
                var _vm$pageLifetimes = vm.pageLifetimes,
                    show = _vm$pageLifetimes.show,
                    hide = _vm$pageLifetimes.hide;
                var _vm$lifetimes = vm.lifetimes,
                    lifetimesAttached = _vm$lifetimes.attached,
                    lifetimesDetached = _vm$lifetimes.detached;
                // auto sync store data to component.

                vm.pageLifetimes.show = function () {
                    if (this.$$reduxDiff) syncStore.bind(this)();

                    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                        args[_key5] = arguments[_key5];
                    }

                    if (show) show.apply.apply(show, [this].concat(args));
                };
                vm.pageLifetimes.hide = function () {
                    this.$$isCurrentPage = false;

                    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                        args[_key6] = arguments[_key6];
                    }

                    if (hide) hide.apply.apply(hide, [this].concat(args));
                };

                vm.created = function () {
                    this.$store = store;
                    this.$$reduxDiff = _core.diff.bind(this);

                    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                        args[_key7] = arguments[_key7];
                    }

                    if (created) created.apply(this, args);
                };

                vm.lifetimes.attached = mountRedux(lifetimesAttached || attached);
                vm.lifetimes.detached = unmountRedux(lifetimesDetached || detached);
                vm.attached = mountRedux(lifetimesAttached || attached);
                vm.detached = unmountRedux(lifetimesDetached || detached);
                break;
            default:
                throw new Error('不合法的wxa组件类型');
        }
    };
};

exports.reducerRegistry = _registry2.default;
}, function(modId) {var map = {"./mapState":1673854635099,"./registry":1673854635100}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1673854635099, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mapState;

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapState(map, state, lastState, context) {
    if (map == null) return null;

    var newState = Object.keys(map).reduce(function (ret, key) {
        if (typeof map[key] !== 'function') {
            console.log('mapState\u4E2D\u7684' + key + '\u5FC5\u987B\u4E3A\u51FD\u6570');
            return ret;
        }

        try {
            var fn = map[key];
            if (context) fn = fn.bind(context);

            ret[key] = fn(state);
        } catch (e) {
            throw e;
        }

        return ret;
    }, {});

    if (lastState != null && (0, _shallowequal2.default)(newState, lastState)) {
        return null;
    } else {
        // 初始状态或者更新状态
        return newState;
    }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1673854635100, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// http://nicolasgallagher.com/redux-modules-and-code-splitting/
// learn from nicolas

var ReducerRegistry = exports.ReducerRegistry = function () {
    function ReducerRegistry() {
        _classCallCheck(this, ReducerRegistry);

        this._emitChange = null;
        this._reducers = {};
    }

    _createClass(ReducerRegistry, [{
        key: "getReducers",
        value: function getReducers() {
            return _extends({}, this._reducers);
        }
    }, {
        key: "register",
        value: function register(name, reducer) {
            this._reducers = _extends({}, this._reducers, _defineProperty({}, name, reducer));
            if (this._emitChange) {
                this._emitChange(this.getReducers());
            }
        }
    }, {
        key: "setChangeListener",
        value: function setChangeListener(listener) {
            this._emitChange = listener;
        }
    }]);

    return ReducerRegistry;
}();

var reducerRegistry = new ReducerRegistry();
exports.default = reducerRegistry;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1673854635098);
})()
//miniprogram-npm-outsideDeps=["redux","@wxa/core","shallowequal"]
//# sourceMappingURL=index.js.map