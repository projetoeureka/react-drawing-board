"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTextDropdown = exports.onTextMouseUp = exports.onTextComplete = exports.initTextTool = exports.font = exports.drawText = void 0;
var _react = _interopRequireDefault(require("react"));
var _Tool = _interopRequireWildcard(require("./enums/Tool"));
var _utils = require("./utils");
var _Icon = _interopRequireDefault(require("./icons/Icon"));
require("./TextTool.css");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var currentText = '';
var currentColor = '';
var currentSize = _Tool.TextSize.Default;
var initTextTool = exports.initTextTool = function initTextTool() {
  currentText = '';
};
var textSize = [_Tool.TextSize.Small, _Tool.TextSize.Default, _Tool.TextSize.Large];
var onTextMouseUp = exports.onTextMouseUp = function onTextMouseUp(e, toolOption, scale, refInput, refCanvas, intl) {
  if (!currentText && refInput.current && refCanvas.current) {
    var textarea = refInput.current;
    var canvas = refCanvas.current;
    var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
      top = _canvas$getBoundingCl.top,
      left = _canvas$getBoundingCl.left;
    var x = e.clientX - left;
    var y = e.clientY - top;
    textarea.style.display = 'block';
    textarea.style.left = x + canvas.offsetLeft + 'px';
    textarea.style.top = y + canvas.offsetTop + 'px';
    textarea.style.fontSize = toolOption.textSize * scale + 'px';
    textarea.style.lineHeight = toolOption.textSize * scale + 'px';
    textarea.style.height = toolOption.textSize * scale + 'px';
    textarea.style.color = toolOption.textColor;
    textarea.innerText = typeof toolOption.defaultText === 'string' ? toolOption.defaultText : intl.formatMessage(toolOption.defaultText);
    if (_utils.isMobileDevice) {
      textarea.focus();
    }
    setTimeout(function () {
      if (getSelection && Range) {
        var selection = getSelection();
        if (selection) {
          selection.removeAllRanges();
          var range = new Range();
          range.selectNodeContents(textarea);
          selection.addRange(range);
        }
      }
    }, 0);
    currentText = typeof toolOption.defaultText === 'string' ? toolOption.defaultText : intl.formatMessage(toolOption.defaultText);
    currentColor = toolOption.textColor;
    currentSize = toolOption.textSize;
  }
};
var onTextComplete = exports.onTextComplete = function onTextComplete(refInput, refCanvas, viewMatrix, scale, handleCompleteOperation, setCurrentTool) {
  if (currentText && refInput.current && refCanvas.current) {
    var textarea = refInput.current;
    var text = textarea.innerText;
    var _textarea$getBounding = textarea.getBoundingClientRect(),
      top = _textarea$getBounding.top,
      left = _textarea$getBounding.left,
      width = _textarea$getBounding.width,
      height = _textarea$getBounding.height;
    width = 1 / scale * width;
    var lineHeight = parseInt(textarea.style.lineHeight.replace('px', ''));
    height = 1 / scale * lineHeight * text.split('\n').length;
    var currentPos = (0, _utils.mapClientToCanvas)({
      clientX: left,
      clientY: top
    }, refCanvas.current, viewMatrix);
    textarea.style.display = 'none';
    var _pos = {
      x: currentPos[0],
      y: currentPos[1],
      w: width,
      h: height
    };
    handleCompleteOperation(_Tool.default.Text, {
      text: text,
      color: currentColor,
      size: currentSize
    }, _pos);
    currentText = '';
  }
};
var font = exports.font = "\"PingFang SC\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Helvetica, \"Hiragino Sans GB\", \"Microsoft YaHei\", SimSun, sans-serif, \"localant\"";
var drawText = exports.drawText = function drawText(item, context, pos) {
  context.globalCompositeOperation = 'source-over';
  context.font = "".concat(item.size, "px ").concat(font);
  context.fillStyle = item.color || '#4a4a4a';
  context.textBaseline = 'middle';
  var lines = item.text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    context.fillText(lines[i], pos.x, pos.y + item.size / 2 + i * item.size); // add half line height cause to textBaseline middle
  }
};
var useTextDropdown = exports.useTextDropdown = function useTextDropdown(config) {
  var currentToolOption = config.currentToolOption,
    setCurrentToolOption = config.setCurrentToolOption,
    setCurrentTool = config.setCurrentTool,
    basePrefixCls = config.prefixCls,
    intl = config.intl;
  var prefixCls = basePrefixCls + '-textTool';
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-strokeMenu")
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-colorAndSize")
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-textSizeSelector")
  }, textSize.map(function (size) {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: size,
      onTouchStart: function onTouchStart(evt) {
        evt.stopPropagation();
        setCurrentToolOption(_objectSpread(_objectSpread({}, currentToolOption), {}, {
          textSize: size
        }));
        setCurrentTool && setCurrentTool(_Tool.default.Text);
      },
      onClick: function onClick(evt) {
        evt.stopPropagation();
        setCurrentToolOption(_objectSpread(_objectSpread({}, currentToolOption), {}, {
          textSize: size
        }));
        setCurrentTool && setCurrentTool(_Tool.default.Text);
      },
      style: {
        color: size === currentToolOption.textSize ? '#666' : '#ccc'
      }
    }, size === _Tool.TextSize.Small ? intl.formatMessage({
      id: 'umi.block.sketch.text.size.small'
    }) : size === _Tool.TextSize.Default ? intl.formatMessage({
      id: 'umi.block.sketch.text.size.default'
    }) : intl.formatMessage({
      id: 'umi.block.sketch.text.size.large'
    }));
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
          textColor: color
        }));
        setCurrentTool && setCurrentTool(_Tool.default.Text);
      },
      onTouchStart: function onTouchStart(evt) {
        evt.stopPropagation();
        setCurrentToolOption(_objectSpread(_objectSpread({}, currentToolOption), {}, {
          textColor: color
        }));
        setCurrentTool && setCurrentTool(_Tool.default.Text);
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "".concat(prefixCls, "-fill"),
      style: {
        background: color
      }
    }), currentToolOption.textColor === color ? /*#__PURE__*/_react.default.createElement(_Icon.default, {
      type: "check",
      style: color === '#ffffff' ? {
        color: '#979797'
      } : {
        color: '#fff'
      }
    }) : null);
  }))));
};