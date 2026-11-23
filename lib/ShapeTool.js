"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useShapeDropdown = exports.onShapeMouseUp = exports.onShapeMouseMove = exports.onShapeMouseDown = exports.drawRectangle = void 0;
var _Tool = _interopRequireWildcard(require("./enums/Tool"));
var _react = _interopRequireDefault(require("react"));
var _Icon = _interopRequireDefault(require("./icons/Icon"));
require("./ShapeTool.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let shape = null;
const onShapeMouseDown = (x, y, toolOption) => {
  shape = {
    type: toolOption.shapeType,
    color: toolOption.shapeBorderColor,
    size: toolOption.shapeBorderSize,
    start: {
      x,
      y
    },
    end: null
  };
  return [shape];
};
exports.onShapeMouseDown = onShapeMouseDown;
const draw = (item, mouseX, mouseY, context, hover) => {
  const startX = mouseX < item.start.x ? mouseX : item.start.x;
  const startY = mouseY < item.start.y ? mouseY : item.start.y;
  const widthX = Math.abs(item.start.x - mouseX);
  const widthY = Math.abs(item.start.y - mouseY);
  if (item.type === _Tool.ShapeType.Rectangle) {
    context.beginPath();
    context.lineWidth = item.size;
    context.strokeStyle = item.color;
    context.rect(startX, startY, widthX, widthY);
    context.stroke();
    context.closePath();
    if (hover) {
      context.beginPath();
      context.strokeStyle = '#3AB1FE';
      context.lineWidth = item.size / 2;
      context.rect(startX - item.size / 2, startY - item.size / 2, widthX + item.size, widthY + item.size);
      context.stroke();
      context.closePath();
    }
  } else if (item.type === _Tool.ShapeType.Line) {
    context.beginPath();
    context.lineWidth = item.size;
    context.strokeStyle = item.color;
    context.lineCap = 'round';
    context.moveTo(item.start.x, item.start.y);
    context.lineTo(mouseX, mouseY);
    context.stroke();
    context.closePath();
    if (hover) {
      context.beginPath();
      context.strokeStyle = '#3AB1FE';
      context.lineWidth = item.size;
      context.moveTo(item.start.x, item.start.y);
      context.lineTo(mouseX, mouseY);
      context.stroke();
      context.closePath();
    }
  } else if (item.type === _Tool.ShapeType.Oval) {
    const endX = mouseX >= item.start.x ? mouseX : item.start.x;
    const endY = mouseY >= item.start.y ? mouseY : item.start.y;
    const radiusX = (endX - startX) * 0.5;
    const radiusY = (endY - startY) * 0.5;
    const centerX = startX + radiusX;
    const centerY = startY + radiusY;
    context.beginPath();
    context.lineWidth = item.size;
    context.strokeStyle = item.color;
    if (typeof context.ellipse === 'function') {
      context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    } else {
      let xPos;
      let yPos;
      let i = 0;
      for (i; i < 2 * Math.PI; i += 0.01) {
        xPos = centerX - radiusY * Math.sin(i) * Math.sin(0) + radiusX * Math.cos(i) * Math.cos(0);
        yPos = centerY + radiusX * Math.cos(i) * Math.sin(0) + radiusY * Math.sin(i) * Math.cos(0);
        if (i === 0) {
          context.moveTo(xPos, yPos);
        } else {
          context.lineTo(xPos, yPos);
        }
      }
    }
    context.stroke();
    context.closePath();
    if (hover) {
      context.beginPath();
      context.strokeStyle = '#3AB1FE';
      context.lineWidth = item.size / 2;
      if (typeof context.ellipse === 'function') {
        context.ellipse(centerX, centerY, radiusX + item.size / 2, radiusY + item.size / 2, 0, 0, 2 * Math.PI);
      } else {
        let xPos;
        let yPos;
        let i = 0;
        for (i; i < 2 * Math.PI; i += 0.01) {
          xPos = centerX - (radiusY + item.size / 2) * Math.sin(i) * Math.sin(0) + (radiusX + item.size / 2) * Math.cos(i) * Math.cos(0);
          yPos = centerY + (radiusX + item.size / 2) * Math.cos(i) * Math.sin(0) + (radiusY + item.size / 2) * Math.sin(i) * Math.cos(0);
          if (i === 0) {
            context.moveTo(xPos, yPos);
          } else {
            context.lineTo(xPos, yPos);
          }
        }
      }
      context.stroke();
      context.closePath();
    }
  }
};
const onShapeMouseUp = (x, y, setCurrentTool, handleCompleteOperation) => {
  if (!shape) return;
  const item = shape;
  shape = null;
  item.end = {
    x,
    y
  };

  // avoid touch by mistake.
  if (Math.abs(item.start.x - item.end.x) + Math.abs(item.start.x - item.end.x) < 6) {
    return;
  }
  handleCompleteOperation(_Tool.default.Shape, item, {
    x: Math.min(item.start.x, item.end.x),
    y: Math.min(item.start.y, item.end.y),
    w: Math.abs(item.end.x - item.start.x),
    h: Math.abs(item.end.y - item.start.y)
  });
  return [item];
};
exports.onShapeMouseUp = onShapeMouseUp;
const onShapeMouseMove = (x, y, context) => {
  if (!shape) return;
  draw(shape, x, y, context, false);
};
exports.onShapeMouseMove = onShapeMouseMove;
const drawRectangle = (rect, context, hover) => {
  if (!rect.end) return null;
  draw(rect, rect.end.x, rect.end.y, context, hover);
};
exports.drawRectangle = drawRectangle;
const useShapeDropdown = config => {
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
    className: `${prefixCls}-shape`
  }, /*#__PURE__*/_react.default.createElement("div", {
    onClick: evt => {
      evt.stopPropagation();
      setCurrentToolOption({
        ...currentToolOption,
        shapeType: _Tool.ShapeType.Rectangle
      });
      setCurrentTool(_Tool.default.Shape);
    },
    onTouchStart: evt => {
      evt.stopPropagation();
      setCurrentToolOption({
        ...currentToolOption,
        shapeType: _Tool.ShapeType.Rectangle
      });
      setCurrentTool(_Tool.default.Shape);
    },
    className: `${prefixCls}-shapeItem`,
    style: currentToolOption.shapeType === _Tool.ShapeType.Rectangle ? {
      background: 'rgba(238, 238, 238, 1)'
    } : {}
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-rect`,
    style: currentToolOption.shapeType === _Tool.ShapeType.Rectangle ? {
      borderColor: currentToolOption.shapeBorderColor
    } : {}
  })), /*#__PURE__*/_react.default.createElement("div", {
    onTouchStart: evt => {
      evt.stopPropagation();
      setCurrentToolOption({
        ...currentToolOption,
        shapeType: _Tool.ShapeType.Oval
      });
      setCurrentTool(_Tool.default.Shape);
    },
    onClick: evt => {
      evt.stopPropagation();
      setCurrentToolOption({
        ...currentToolOption,
        shapeType: _Tool.ShapeType.Oval
      });
      setCurrentTool(_Tool.default.Shape);
    },
    className: `${prefixCls}-shapeItem`,
    style: currentToolOption.shapeType === _Tool.ShapeType.Oval ? {
      background: 'rgba(238, 238, 238, 1)'
    } : {}
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-circle`,
    style: currentToolOption.shapeType === _Tool.ShapeType.Oval ? {
      borderColor: currentToolOption.shapeBorderColor
    } : {}
  })), /*#__PURE__*/_react.default.createElement("div", {
    onTouchStart: evt => {
      evt.stopPropagation();
      setCurrentToolOption({
        ...currentToolOption,
        shapeType: _Tool.ShapeType.Line
      });
      setCurrentTool(_Tool.default.Shape);
    },
    onClick: evt => {
      evt.stopPropagation();
      setCurrentToolOption({
        ...currentToolOption,
        shapeType: _Tool.ShapeType.Line
      });
      setCurrentTool(_Tool.default.Shape);
    },
    className: `${prefixCls}-shapeItem`,
    style: currentToolOption.shapeType === _Tool.ShapeType.Line ? {
      background: 'rgba(238, 238, 238, 1)'
    } : {}
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-line`,
    style: currentToolOption.shapeType === _Tool.ShapeType.Line ? {
      borderColor: currentToolOption.shapeBorderColor
    } : {}
  }, /*#__PURE__*/_react.default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    viewBox: "0 0 100 100"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M0 99 L99 0 L100 1 L1 100",
    strokeWidth: "5",
    stroke: "black"
  }))))), /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-colorAndSize`
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-strokeSelector`
  }, _Tool.strokeSize.map(size => {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: size,
      onTouchStart: evt => {
        evt.stopPropagation();
        setCurrentToolOption({
          ...currentToolOption,
          shapeBorderSize: size
        });
        setCurrentTool(_Tool.default.Shape);
      },
      onClick: evt => {
        evt.stopPropagation();
        setCurrentToolOption({
          ...currentToolOption,
          shapeBorderSize: size
        });
        setCurrentTool(_Tool.default.Shape);
      },
      style: {
        width: size + 4,
        height: size + 4,
        background: size === currentToolOption.shapeBorderSize ? '#666666' : '#EEEEEE'
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
      onTouchStart: evt => {
        evt.stopPropagation();
        setCurrentToolOption({
          ...currentToolOption,
          shapeBorderColor: color
        });
        setCurrentTool(_Tool.default.Shape);
      },
      onClick: evt => {
        evt.stopPropagation();
        setCurrentToolOption({
          ...currentToolOption,
          shapeBorderColor: color
        });
        setCurrentTool(_Tool.default.Shape);
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: `${prefixCls}-fill`,
      style: {
        background: color
      }
    }), currentToolOption.shapeBorderColor === color ? /*#__PURE__*/_react.default.createElement(_Icon.default, {
      type: "check",
      style: color === '#ffffff' ? {
        color: '#979797'
      } : {
        color: '#fff'
      }
    }) : null);
  }))));
};
exports.useShapeDropdown = useShapeDropdown;