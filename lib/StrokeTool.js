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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Stroke tool
let stroke = null;
let points = [];
const drawLine = (context, item, start, {
  x,
  y
}) => {
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.beginPath();
  context.lineWidth = item.size;
  context.strokeStyle = item.color;
  context.globalCompositeOperation = 'source-over';
  context.moveTo(start.x, start.y);
  const xc = (start.x + x) / 2;
  const yc = (start.y + y) / 2;
  context.quadraticCurveTo(xc, yc, x, y);
  context.closePath();
  context.stroke();
};
const drawEraser = (stroke, context, hover) => {
  const points = stroke.points.filter((_, index) => index % 2 === 0);
  if (points.length < 3) {
    return;
  }
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.beginPath();
  context.lineWidth = stroke.size;
  const originalCompositeOperation = context.globalCompositeOperation;
  context.globalCompositeOperation = 'destination-out';
  context.strokeStyle = hover ? '#3AB1FE' : stroke.color;

  // move to the first point
  context.moveTo(points[0].x, points[0].y);
  let i = 0;
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
exports.drawEraser = drawEraser;
const drawStroke = (stroke, context, hover) => {
  const points = stroke.points.filter((_, index) => index % 2 === 0);
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
  let i = 0;
  for (i = 1; i < points.length - 2; i++) {
    var xc = (points[i].x + points[i + 1].x) / 2;
    var yc = (points[i].y + points[i + 1].y) / 2;
    context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  // curve through the last two points
  context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
  context.stroke();
};
exports.drawStroke = drawStroke;
function onStrokeMouseDown(x, y, toolOption) {
  stroke = {
    color: toolOption.strokeColor,
    size: toolOption.strokeSize,
    points: [{
      x,
      y
    }]
  };
  return [stroke];
}
function onStrokeMouseMove(x, y, context) {
  if (!stroke) return [];
  const newPoint = {
    x,
    y
  };
  const start = stroke.points.slice(-1)[0];
  drawLine(context, stroke, start, newPoint);
  stroke.points.push(newPoint);
  points.push(newPoint);
  return [stroke];
}
function onStrokeMouseUp(setCurrentTool, handleCompleteOperation, currentTool = _Tool.default.Stroke) {
  if (!stroke) {
    return;
  }
  const item = stroke;
  points = [];
  stroke = null;
  if (item) {
    let lineData = item;
    let pos = null;
    let xMax = -Infinity,
      yMax = -Infinity,
      xMin = lineData.points[0].x,
      yMin = lineData.points[0].y;
    lineData.points.forEach(p => {
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
    pos = {
      x: xMin,
      y: yMin,
      w: xMax - xMin,
      h: yMax - yMin
    };
    handleCompleteOperation(currentTool, lineData, pos);
  }
  return [item];
}
const useStrokeDropdown = config => {
  const {
    currentToolOption,
    setCurrentToolOption,
    setCurrentTool,
    prefixCls: basePrefixCls
  } = config;
  const prefixCls = basePrefixCls + '-strokeTool';
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-strokeMenu`
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-colorAndSize`
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-strokeSelector`
  }, _Tool.strokeSize.map(size => {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: size,
      onClick: evt => {
        evt.stopPropagation();
        setCurrentToolOption({
          ...currentToolOption,
          strokeSize: size
        });
        setCurrentTool && setCurrentTool(_Tool.default.Stroke);
      },
      onTouchStart: evt => {
        evt.stopPropagation();
        setCurrentToolOption({
          ...currentToolOption,
          strokeSize: size
        });
        setCurrentTool && setCurrentTool(_Tool.default.Stroke);
      },
      style: {
        width: size + 4,
        height: size + 4,
        background: size === currentToolOption.strokeSize ? '#666666' : '#EEEEEE'
      }
    });
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-split`
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-palette`
  }, _Tool.strokeColor.map(color => {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: `${prefixCls}-color`,
      key: color,
      onClick: evt => {
        evt.stopPropagation();
        setCurrentToolOption({
          ...currentToolOption,
          strokeColor: color
        });
        setCurrentTool && setCurrentTool(_Tool.default.Stroke);
      },
      onTouchStart: evt => {
        evt.stopPropagation();
        setCurrentToolOption({
          ...currentToolOption,
          strokeColor: color
        });
        setCurrentTool && setCurrentTool(_Tool.default.Stroke);
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: `${prefixCls}-fill`,
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
exports.useStrokeDropdown = useStrokeDropdown;
const moveStoke = (prev, oldPos, newPos) => {
  const diffX = newPos.x - oldPos.x;
  const diffY = newPos.y - oldPos.y;
  return prev.points.map(p => ({
    x: p.x + diffX,
    y: p.y + diffY
  }));
};
exports.moveStoke = moveStoke;