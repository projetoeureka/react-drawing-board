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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let currentText = '';
let currentColor = '';
let currentSize = _Tool.TextSize.Default;
const initTextTool = () => {
  currentText = '';
};
exports.initTextTool = initTextTool;
const textSize = [_Tool.TextSize.Small, _Tool.TextSize.Default, _Tool.TextSize.Large];
const onTextMouseUp = (e, toolOption, scale, refInput, refCanvas, intl) => {
  if (!currentText && refInput.current && refCanvas.current) {
    const textarea = refInput.current;
    const canvas = refCanvas.current;
    const {
      top,
      left
    } = canvas.getBoundingClientRect();
    let x = e.clientX - left;
    let y = e.clientY - top;
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
    setTimeout(() => {
      if (getSelection && Range) {
        const selection = getSelection();
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
exports.onTextMouseUp = onTextMouseUp;
const onTextComplete = (refInput, refCanvas, viewMatrix, scale, handleCompleteOperation, setCurrentTool) => {
  if (currentText && refInput.current && refCanvas.current) {
    const textarea = refInput.current;
    const text = textarea.innerText;
    let {
      top,
      left,
      width,
      height
    } = textarea.getBoundingClientRect();
    width = 1 / scale * width;
    const lineHeight = parseInt(textarea.style.lineHeight.replace('px', ''));
    height = 1 / scale * lineHeight * text.split('\n').length;
    const currentPos = (0, _utils.mapClientToCanvas)({
      clientX: left,
      clientY: top
    }, refCanvas.current, viewMatrix);
    textarea.style.display = 'none';
    const pos = {
      x: currentPos[0],
      y: currentPos[1],
      w: width,
      h: height
    };
    handleCompleteOperation(_Tool.default.Text, {
      text,
      color: currentColor,
      size: currentSize
    }, pos);
    currentText = '';
  }
};
exports.onTextComplete = onTextComplete;
const font = exports.font = `"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif, "localant"`;
const drawText = (item, context, pos) => {
  context.globalCompositeOperation = 'source-over';
  context.font = `${item.size}px ${font}`;
  context.fillStyle = item.color || '#4a4a4a';
  context.textBaseline = 'middle';
  const lines = item.text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    context.fillText(lines[i], pos.x, pos.y + item.size / 2 + i * item.size); // add half line height cause to textBaseline middle
  }
};
exports.drawText = drawText;
const useTextDropdown = config => {
  const {
    currentToolOption,
    setCurrentToolOption,
    setCurrentTool,
    prefixCls: basePrefixCls,
    intl
  } = config;
  const prefixCls = basePrefixCls + '-textTool';
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-strokeMenu`
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-colorAndSize`
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-textSizeSelector`
  }, textSize.map(size => {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: size,
      onTouchStart: evt => {
        evt.stopPropagation();
        setCurrentToolOption({
          ...currentToolOption,
          textSize: size
        });
        setCurrentTool && setCurrentTool(_Tool.default.Text);
      },
      onClick: evt => {
        evt.stopPropagation();
        setCurrentToolOption({
          ...currentToolOption,
          textSize: size
        });
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
          textColor: color
        });
        setCurrentTool && setCurrentTool(_Tool.default.Text);
      },
      onTouchStart: evt => {
        evt.stopPropagation();
        setCurrentToolOption({
          ...currentToolOption,
          textColor: color
        });
        setCurrentTool && setCurrentTool(_Tool.default.Text);
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: `${prefixCls}-fill`,
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
exports.useTextDropdown = useTextDropdown;