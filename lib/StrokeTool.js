"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveStoke = exports.drawStroke = exports.drawEraser = void 0;
exports.onStrokeMouseDown = onStrokeMouseDown;
exports.onStrokeMouseMove = onStrokeMouseMove;
exports.onStrokeMouseUp = onStrokeMouseUp;
exports.useStrokeDropdown = void 0;
var _react = _interopRequireDefault(require("react"));
var _Tool = _interopRequireWildcard(require("./enums/Tool"));
var _Icon = _interopRequireDefault(require("./icons/Icon"));
require("./StrokeTool.css");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Stroke tool
var stroke = null;
var points = [];
var drawLine = function drawLine(context, item, start, _ref) {
  var x = _ref.x,
    y = _ref.y;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.beginPath();
  context.lineWidth = item.size;
  context.strokeStyle = item.color;
  context.globalCompositeOperation = 'source-over';
  context.moveTo(start.x, start.y);
  var xc = (start.x + x) / 2;
  var yc = (start.y + y) / 2;
  context.quadraticCurveTo(xc, yc, x, y);
  context.closePath();
  context.stroke();
};
var drawEraser = exports.drawEraser = function drawEraser(stroke, context, hover) {
  var points = stroke.points.filter(function (_, index) {
    return index % 2 === 0;
  });
  if (points.length < 3) {
    return;
  }
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.beginPath();
  context.lineWidth = stroke.size;
  var originalCompositeOperation = context.globalCompositeOperation;
  context.globalCompositeOperation = 'destination-out';
  context.strokeStyle = hover ? '#3AB1FE' : stroke.color;

  // move to the first point
  context.moveTo(points[0].x, points[0].y);
  var i = 0;
  for (i = 1; i < points.length - 2; i++) {
    var xc = (points[i].x + points[i + 1].x) / 2;
    var yc = (points[i].y + points[i + 1].y) / 2;
    context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  // curve through the last two points
  context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
  context.stroke();
  context.globalCompositeOperation = originalCompositeOperation;
};
var drawStroke = exports.drawStroke = function drawStroke(stroke, context, hover) {
  var points = stroke.points.filter(function (_, index) {
    return index % 2 === 0;
  });
  if (points.length < 3) {
    return;
  }
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.beginPath();
  context.lineWidth = stroke.size;
  context.globalCompositeOperation = 'source-over';
  context.strokeStyle = hover ? '#3AB1FE' : stroke.color;

  // move to the first point
  context.moveTo(points[0].x, points[0].y);
  var i = 0;
  for (i = 1; i < points.length - 2; i++) {
    var xc = (points[i].x + points[i + 1].x) / 2;
    var yc = (points[i].y + points[i + 1].y) / 2;
    context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  // curve through the last two points
  context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
  context.stroke();
};
function onStrokeMouseDown(x, y, toolOption) {
  stroke = {
    color: toolOption.strokeColor,
    size: toolOption.strokeSize,
    points: [{
      x: x,
      y: y
    }]
  };
  return [stroke];
}
function onStrokeMouseMove(x, y, context) {
  if (!stroke) return [];
  var newPoint = {
    x: x,
    y: y
  };
  var start = stroke.points.slice(-1)[0];
  drawLine(context, stroke, start, newPoint);
  stroke.points.push(newPoint);
  points.push(newPoint);
  return [stroke];
}
function onStrokeMouseUp(setCurrentTool, handleCompleteOperation) {
  var currentTool = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _Tool.default.Stroke;
  if (!stroke) {
    return;
  }
  var item = stroke;
  points = [];
  stroke = null;
  if (item) {
    var lineData = item;
    var _pos = null;
    var xMax = -Infinity,
      yMax = -Infinity,
      xMin = lineData.points[0].x,
      yMin = lineData.points[0].y;
    lineData.points.forEach(function (p) {
      if (p.x > xMax) {
        xMax = p.x;
      }
      if (p.x < xMin) {
        xMin = p.x;
      }
      if (p.y > yMax) {
        yMax = p.y;
      }
      if (p.y < yMin) {
        yMin = p.y;
      }
    });
    _pos = {
      x: xMin,
      y: yMin,
      w: xMax - xMin,
      h: yMax - yMin
    };
    handleCompleteOperation(currentTool, lineData, _pos);
  }
  return [item];
}
var useStrokeDropdown = exports.useStrokeDropdown = function useStrokeDropdown(config) {
  var currentToolOption = config.currentToolOption,
    setCurrentToolOption = config.setCurrentToolOption,
    setCurrentTool = config.setCurrentTool,
    basePrefixCls = config.prefixCls;
  var prefixCls = basePrefixCls + '-strokeTool';
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-strokeMenu")
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-colorAndSize")
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-strokeSelector")
  }, _Tool.strokeSize.map(function (size) {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: size,
      onClick: function onClick(evt) {
        evt.stopPropagation();
        setCurrentToolOption(_objectSpread(_objectSpread({}, currentToolOption), {}, {
          strokeSize: size
        }));
        setCurrentTool && setCurrentTool(_Tool.default.Stroke);
      },
      onTouchStart: function onTouchStart(evt) {
        evt.stopPropagation();
        setCurrentToolOption(_objectSpread(_objectSpread({}, currentToolOption), {}, {
          strokeSize: size
        }));
        setCurrentTool && setCurrentTool(_Tool.default.Stroke);
      },
      style: {
        width: size + 4,
        height: size + 4,
        background: size === currentToolOption.strokeSize ? '#666666' : '#EEEEEE'
      }
    });
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-split")
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-palette")
  }, _Tool.strokeColor.map(function (color) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "".concat(prefixCls, "-color"),
      key: color,
      onClick: function onClick(evt) {
        evt.stopPropagation();
        setCurrentToolOption(_objectSpread(_objectSpread({}, currentToolOption), {}, {
          strokeColor: color
        }));
        setCurrentTool && setCurrentTool(_Tool.default.Stroke);
      },
      onTouchStart: function onTouchStart(evt) {
        evt.stopPropagation();
        setCurrentToolOption(_objectSpread(_objectSpread({}, currentToolOption), {}, {
          strokeColor: color
        }));
        setCurrentTool && setCurrentTool(_Tool.default.Stroke);
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "".concat(prefixCls, "-fill"),
      style: {
        background: color
      }
    }), currentToolOption.strokeColor === color ? /*#__PURE__*/_react.default.createElement(_Icon.default, {
      type: "check",
      style: color === '#ffffff' ? {
        color: '#979797'
      } : {
        color: '#fff'
      }
    }) : null);
  }))));
};
var moveStoke = exports.moveStoke = function moveStoke(prev, oldPos, newPos) {
  var diffX = newPos.x - oldPos.x;
  var diffY = newPos.y - oldPos.y;
  return prev.points.map(function (p) {
    return {
      x: p.x + diffX,
      y: p.y + diffY
    };
  });
};