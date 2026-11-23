"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _uuid = require("uuid");
var _reactSpring = require("react-spring");
var _reactIntl = require("react-intl");
var _Layout = require("./Layout");
var _Toolbar = _interopRequireDefault(require("./Toolbar"));
var _SketchPad = _interopRequireDefault(require("./SketchPad"));
var _Tool = _interopRequireWildcard(require("./enums/Tool"));
var _EnableSketchPadContext = _interopRequireDefault(require("./contexts/EnableSketchPadContext"));
var _locales = _interopRequireDefault(require("./locales"));
var _utils = require("./utils");
require("./index.css");
var _ConfigContext = _interopRequireWildcard(require("./ConfigContext"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const {
  Header,
  Sider,
  Content
} = _Layout.Layout;
const AnimatedSketchPad = (0, _reactSpring.animated)(_SketchPad.default);
const defaultProps = {
  userId: (0, _uuid.v4)(),
  locale: navigator.language,
  toolbarPlacement: 'top'
};
const enableSketchPadReducer = (_state, action) => {
  return action;
};
const Block = props => {
  const {
    userId,
    operations,
    onChange,
    toolbarPlacement,
    clsssName,
    onSave,
    showBackgroundTool,
    initialBackground,
    viewMatrix: viewMatrixProp,
    onViewMatrixChange
  } = {
    ...defaultProps,
    ...props
  };
  const [currentTool, setCurrentTool] = (0, _react.useState)(_Tool.default.Select);
  const [currentToolOption, setCurrentToolOption] = (0, _react.useState)(_Tool.defaultToolOption);
  const enableSketchPad = (0, _react.useReducer)(enableSketchPadReducer, true);
  const refSketch = (0, _react.useRef)(null);

  // control view matrix.
  const [stateViewMatrix, setStateViewMatrix] = (0, _react.useState)([1, 0, 0, 1, 0, 0]);
  const viewMatrix = viewMatrixProp || stateViewMatrix;
  const setViewMatrix = newViewMatrix => {
    if (onViewMatrixChange) {
      onViewMatrixChange(newViewMatrix);
    } else {
      setStateViewMatrix(newViewMatrix);
    }
  };
  const scale = (0, _utils.extract_scale_from_matrix)(viewMatrix);
  (0, _react.useEffect)(() => {
    const keydownHandler = evt => {
      const {
        keyCode
      } = evt;

      // prevent shorcut when user input text 
      if (currentTool === _Tool.default.Text) {
        return;
      }

      // key 'p'
      if (keyCode === 80) {
        setCurrentTool(_Tool.default.Stroke);
      } else if (keyCode === 82) {
        // key 'r'
        setCurrentTool(_Tool.default.Shape);
        setCurrentToolOption({
          ...currentToolOption,
          shapeType: _Tool.ShapeType.Rectangle
        });
      } else if (keyCode === 79) {
        // key 'o'
        setCurrentTool(_Tool.default.Shape);
        setCurrentToolOption({
          ...currentToolOption,
          shapeType: _Tool.ShapeType.Oval
        });
      } else if (keyCode === 84) {
        // key 't'
        setCurrentTool(_Tool.default.Text);
      }
    };
    addEventListener('keydown', keydownHandler);
    return () => removeEventListener('keydown', keydownHandler);
  }, [currentTool]);
  const renderWithLayout = (toolbar, sketchPad) => {
    if (toolbarPlacement === 'left' || _utils.isMobileDevice) {
      return /*#__PURE__*/_react.default.createElement(_Layout.Layout, {
        style: {
          flexDirection: 'row'
        }
      }, /*#__PURE__*/_react.default.createElement(Sider, {
        width: _utils.isMobileDevice ? 40 : 55,
        theme: "light"
      }, toolbar), /*#__PURE__*/_react.default.createElement(Content, null, sketchPad));
    } else if (toolbarPlacement === 'top') {
      return /*#__PURE__*/_react.default.createElement(_Layout.Layout, {
        hasSider: false
      }, /*#__PURE__*/_react.default.createElement(Header, null, toolbar), /*#__PURE__*/_react.default.createElement(Content, null, sketchPad));
    } else if (toolbarPlacement === 'right') {
      return /*#__PURE__*/_react.default.createElement(_Layout.Layout, {
        style: {
          flexDirection: 'row'
        }
      }, /*#__PURE__*/_react.default.createElement(Content, null, sketchPad), /*#__PURE__*/_react.default.createElement(Sider, {
        width: 55,
        theme: "light"
      }, toolbar));
    } else {
      return null;
    }
  };
  const enableSketchPadContextValue = (0, _react.useMemo)(() => {
    return {
      enable: enableSketchPad[0],
      setEnable: enableSketchPad[1]
    };
  }, [...enableSketchPad]);
  const config = (0, _react.useMemo)(() => {
    return {
      ..._ConfigContext.DefaultConfig,
      showBackgroundTool
    };
  }, [_ConfigContext.DefaultConfig, showBackgroundTool]);
  const locale = props.locale && _locales.default.messages[props.locale] ? props.locale : 'en-US';
  return /*#__PURE__*/_react.default.createElement(_ConfigContext.default.Provider, {
    value: config
  }, /*#__PURE__*/_react.default.createElement(_reactIntl.IntlProvider, {
    locale: locale,
    messages: _locales.default.messages[locale]
  }, /*#__PURE__*/_react.default.createElement(_EnableSketchPadContext.default.Provider, {
    value: enableSketchPadContextValue
  }, /*#__PURE__*/_react.default.createElement(_ConfigContext.default.Consumer, null, config => /*#__PURE__*/_react.default.createElement("div", {
    className: `${config.prefixCls}-container ${clsssName || ''}`,
    style: {
      width: '100vw',
      height: '100vh',
      ...(props.style || {})
    }
  }, renderWithLayout( /*#__PURE__*/_react.default.createElement(_Toolbar.default, {
    toolbarPlacement: toolbarPlacement,
    currentTool: currentTool,
    setCurrentTool: setCurrentTool,
    currentToolOption: currentToolOption,
    setCurrentToolOption: setCurrentToolOption,
    viewMatrix: viewMatrix,
    setViewMatrix: setViewMatrix,
    scale: scale,
    getCanvas: refSketch.current?.getCanvas,
    selectImage: image => {
      if (image && refSketch.current) {
        refSketch.current.selectImage(image);
      }
    },
    selectBackgroundImage: image => {
      if (image && refSketch.current) {
        refSketch.current.selectBackgroundImage(image);
      }
    },
    removeBackgroundImage: () => {
      if (refSketch.current) {
        refSketch.current.removeBackgroundImage();
      }
    },
    undo: () => {
      if (refSketch.current) {
        refSketch.current.undo();
      }
    },
    redo: () => {
      if (refSketch.current) {
        refSketch.current.redo();
      }
    },
    clear: () => {
      if (refSketch.current) {
        refSketch.current.clear();
      }
    },
    save: () => {
      if (refSketch.current) {
        refSketch.current.save(onSave);
      }
    }
  }), /*#__PURE__*/_react.default.createElement(AnimatedSketchPad, {
    ref: refSketch,
    userId: userId,
    currentTool: currentTool,
    setCurrentTool: setCurrentTool,
    currentToolOption: currentToolOption,
    viewMatrix: viewMatrix,
    onViewMatrixChange: setViewMatrix,
    operations: operations,
    initialBackground: initialBackground,
    onChange: onChange
  })))))));
};
var _default = exports.default = Block;