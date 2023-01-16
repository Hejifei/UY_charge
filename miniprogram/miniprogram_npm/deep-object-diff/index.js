module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1673854635101, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "addedDiff", {
  enumerable: true,
  get: function () {
    return _added.default;
  }
});
Object.defineProperty(exports, "deletedDiff", {
  enumerable: true,
  get: function () {
    return _deleted.default;
  }
});
Object.defineProperty(exports, "detailedDiff", {
  enumerable: true,
  get: function () {
    return _detailed.default;
  }
});
Object.defineProperty(exports, "diff", {
  enumerable: true,
  get: function () {
    return _diff.default;
  }
});
Object.defineProperty(exports, "updatedDiff", {
  enumerable: true,
  get: function () {
    return _updated.default;
  }
});

var _diff = _interopRequireDefault(require("./diff.js"));

var _added = _interopRequireDefault(require("./added.js"));

var _deleted = _interopRequireDefault(require("./deleted.js"));

var _updated = _interopRequireDefault(require("./updated.js"));

var _detailed = _interopRequireDefault(require("./detailed.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
}, function(modId) {var map = {"./diff.js":1673854635102,"./added.js":1673854635104,"./deleted.js":1673854635105,"./updated.js":1673854635106,"./detailed.js":1673854635107}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1673854635102, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils.js");

const diff = (lhs, rhs) => {
  if (lhs === rhs) return {}; // equal return no diff

  if (!(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return rhs; // return updated rhs

  const deletedValues = Object.keys(lhs).reduce((acc, key) => {
    if (!(0, _utils.hasOwnProperty)(rhs, key)) {
      acc[key] = undefined;
    }

    return acc;
  }, (0, _utils.makeObjectWithoutPrototype)());

  if ((0, _utils.isDate)(lhs) || (0, _utils.isDate)(rhs)) {
    if (lhs.valueOf() == rhs.valueOf()) return {};
    return rhs;
  }

  return Object.keys(rhs).reduce((acc, key) => {
    if (!(0, _utils.hasOwnProperty)(lhs, key)) {
      acc[key] = rhs[key]; // return added r key

      return acc;
    }

    const difference = diff(lhs[key], rhs[key]); // If the difference is empty, and the lhs is an empty object or the rhs is not an empty object

    if ((0, _utils.isEmptyObject)(difference) && !(0, _utils.isDate)(difference) && ((0, _utils.isEmptyObject)(lhs[key]) || !(0, _utils.isEmptyObject)(rhs[key]))) return acc; // return no diff

    acc[key] = difference; // return updated key

    return acc; // return updated key
  }, deletedValues);
};

var _default = diff;
exports.default = _default;
}, function(modId) { var map = {"./utils.js":1673854635103}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1673854635103, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeObjectWithoutPrototype = exports.isObject = exports.isEmptyObject = exports.isEmpty = exports.isDate = exports.hasOwnProperty = void 0;

const isDate = d => d instanceof Date;

exports.isDate = isDate;

const isEmpty = o => Object.keys(o).length === 0;

exports.isEmpty = isEmpty;

const isObject = o => o != null && typeof o === 'object';

exports.isObject = isObject;

const hasOwnProperty = (o, ...args) => Object.prototype.hasOwnProperty.call(o, ...args);

exports.hasOwnProperty = hasOwnProperty;

const isEmptyObject = o => isObject(o) && isEmpty(o);

exports.isEmptyObject = isEmptyObject;

const makeObjectWithoutPrototype = () => Object.create(null);

exports.makeObjectWithoutPrototype = makeObjectWithoutPrototype;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1673854635104, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils.js");

const addedDiff = (lhs, rhs) => {
  if (lhs === rhs || !(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return {};
  return Object.keys(rhs).reduce((acc, key) => {
    if ((0, _utils.hasOwnProperty)(lhs, key)) {
      const difference = addedDiff(lhs[key], rhs[key]);
      if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference)) return acc;
      acc[key] = difference;
      return acc;
    }

    acc[key] = rhs[key];
    return acc;
  }, (0, _utils.makeObjectWithoutPrototype)());
};

var _default = addedDiff;
exports.default = _default;
}, function(modId) { var map = {"./utils.js":1673854635103}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1673854635105, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils.js");

const deletedDiff = (lhs, rhs) => {
  if (lhs === rhs || !(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return {};
  return Object.keys(lhs).reduce((acc, key) => {
    if ((0, _utils.hasOwnProperty)(rhs, key)) {
      const difference = deletedDiff(lhs[key], rhs[key]);
      if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference)) return acc;
      acc[key] = difference;
      return acc;
    }

    acc[key] = undefined;
    return acc;
  }, (0, _utils.makeObjectWithoutPrototype)());
};

var _default = deletedDiff;
exports.default = _default;
}, function(modId) { var map = {"./utils.js":1673854635103}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1673854635106, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils.js");

const updatedDiff = (lhs, rhs) => {
  if (lhs === rhs) return {};
  if (!(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return rhs;

  if ((0, _utils.isDate)(lhs) || (0, _utils.isDate)(rhs)) {
    if (lhs.valueOf() == rhs.valueOf()) return {};
    return rhs;
  }

  return Object.keys(rhs).reduce((acc, key) => {
    if ((0, _utils.hasOwnProperty)(lhs, key)) {
      const difference = updatedDiff(lhs[key], rhs[key]); // If the difference is empty, and the lhs is an empty object or the rhs is not an empty object

      if ((0, _utils.isEmptyObject)(difference) && !(0, _utils.isDate)(difference) && ((0, _utils.isEmptyObject)(lhs[key]) || !(0, _utils.isEmptyObject)(rhs[key]))) return acc; // return no diff

      acc[key] = difference;
      return acc;
    }

    return acc;
  }, (0, _utils.makeObjectWithoutPrototype)());
};

var _default = updatedDiff;
exports.default = _default;
}, function(modId) { var map = {"./utils.js":1673854635103}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1673854635107, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _added = _interopRequireDefault(require("./added.js"));

var _deleted = _interopRequireDefault(require("./deleted.js"));

var _updated = _interopRequireDefault(require("./updated.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const detailedDiff = (lhs, rhs) => ({
  added: (0, _added.default)(lhs, rhs),
  deleted: (0, _deleted.default)(lhs, rhs),
  updated: (0, _updated.default)(lhs, rhs)
});

var _default = detailedDiff;
exports.default = _default;
}, function(modId) { var map = {"./added.js":1673854635104,"./deleted.js":1673854635105,"./updated.js":1673854635106}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1673854635101);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map