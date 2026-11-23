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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Header = _Layout.Layout.Header,
  Sider = _Layout.Layout.Sider,
  Content = _Layout.Layout.Content;
var AnimatedSketchPad = (0, _reactSpring.animated)(_SketchPad.default);
var defaultProps = {
  userId: (0, _uuid.v4)(),
  locale: navigator.language,
  toolbarPlacement: 'top'
};
var enableSketchPadReducer = function enableSketchPadReducer(_state, action) {
  return action;
};
var Block = function Block(props) {
  var _defaultProps$props = _objectSpread(_objectSpread({}, defaultProps), props),
    userId = _defaultProps$props.userId,
    operations = _defaultProps$props.operations,
    onChange = _defaultProps$props.onChange,
    toolbarPlacement = _defaultProps$props.toolbarPlacement,
    clsssName = _defaultProps$props.clsssName,
    onSave = _defaultProps$props.onSave,
    showBackgroundTool = _defaultProps$props.showBackgroundTool,
    initialBackground = _defaultProps$props.initialBackground,
    viewMatrixProp = _defaultProps$props.viewMatrix,
    onViewMatrixChange = _defaultProps$props.onViewMatrixChange;
  var _useState = (0, _react.useState)(_Tool.default.Select),
    _useState2 = _slicedToArray(_useState, 2),
    currentTool = _useState2[0],
    setCurrentTool = _useState2[1];
  var _useState3 = (0, _react.useState)(_Tool.defaultToolOption),
    _useState4 = _slicedToArray(_useState3, 2),
    currentToolOption = _useState4[0],
    setCurrentToolOption = _useState4[1];
  var enableSketchPad = (0, _react.useReducer)(enableSketchPadReducer, true);
  var refSketch = (0, _react.useRef)(null);

  // control view matrix.
  var _useState5 = (0, _react.useState)([1, 0, 0, 1, 0, 0]),
    _useState6 = _slicedToArray(_useState5, 2),
    stateViewMatrix = _useState6[0],
    setStateViewMatrix = _useState6[1];
  var viewMatrix = viewMatrixProp || stateViewMatrix;
  var setViewMatrix = function setViewMatrix(newViewMatrix) {
    if (onViewMatrixChange) {
      onViewMatrixChange(newViewMatrix);
    } else {
      setStateViewMatrix(newViewMatrix);
    }
  };
  var scale = (0, _utils.extract_scale_from_matrix)(viewMatrix);
  (0, _react.useEffect)(function () {
    var keydownHandler = function keydownHandler(evt) {
      var keyCode = evt.keyCode;

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
        setCurrentToolOption(_objectSpread(_objectSpread({}, currentToolOption), {}, {
          shapeType: _Tool.ShapeType.Rectangle
        }));
      } else if (keyCode === 79) {
        // key 'o'
        setCurrentTool(_Tool.default.Shape);
        setCurrentToolOption(_objectSpread(_objectSpread({}, currentToolOption), {}, {
          shapeType: _Tool.ShapeType.Oval
        }));
      } else if (keyCode === 84) {
        // key 't'
        setCurrentTool(_Tool.default.Text);
      }
    };
    addEventListener('keydown', keydownHandler);
    return function () {
      return removeEventListener('keydown', keydownHandler);
    };
  }, [currentTool]);
  var renderWithLayout = function renderWithLayout(toolbar, sketchPad) {
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
  var enableSketchPadContextValue = (0, _react.useMemo)(function () {
    return {
      enable: enableSketchPad[0],
      setEnable: enableSketchPad[1]
    };
  }, _toConsumableArray(enableSketchPad));
  var config = (0, _react.useMemo)(function () {
    return _objectSpread(_objectSpread({}, _ConfigContext.DefaultConfig), {}, {
      showBackgroundTool: showBackgroundTool
    });
  }, [_ConfigContext.DefaultConfig, showBackgroundTool]);
  var locale = props.locale && _locales.default.messages[props.locale] ? props.locale : 'en-US';
  return /*#__PURE__*/_react.default.createElement(_ConfigContext.default.Provider, {
    value: config
  }, /*#__PURE__*/_react.default.createElement(_reactIntl.IntlProvider, {
    locale: locale,
    messages: _locales.default.messages[locale]
  }, /*#__PURE__*/_react.default.createElement(_EnableSketchPadContext.default.Provider, {
    value: enableSketchPadContextValue
  }, /*#__PURE__*/_react.default.createElement(_ConfigContext.default.Consumer, null, function (config) {
    var _refSketch$current;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "".concat(config.prefixCls, "-container ").concat(clsssName || ''),
      style: _objectSpread({
        width: '100vw',
        height: '100vh'
      }, props.style || {})
    }, renderWithLayout( /*#__PURE__*/_react.default.createElement(_Toolbar.default, {
      toolbarPlacement: toolbarPlacement,
      currentTool: currentTool,
      setCurrentTool: setCurrentTool,
      currentToolOption: currentToolOption,
      setCurrentToolOption: setCurrentToolOption,
      viewMatrix: viewMatrix,
      setViewMatrix: setViewMatrix,
      scale: scale,
      getCanvas: (_refSketch$current = refSketch.current) === null || _refSketch$current === void 0 ? void 0 : _refSketch$current.getCanvas,
      selectImage: function selectImage(image) {
        if (image && refSketch.current) {
          refSketch.current.selectImage(image);
        }
      },
      selectBackgroundImage: function selectBackgroundImage(image) {
        if (image && refSketch.current) {
          refSketch.current.selectBackgroundImage(image);
        }
      },
      removeBackgroundImage: function removeBackgroundImage() {
        if (refSketch.current) {
          refSketch.current.removeBackgroundImage();
        }
      },
      undo: function undo() {
        if (refSketch.current) {
          refSketch.current.undo();
        }
      },
      redo: function redo() {
        if (refSketch.current) {
          refSketch.current.redo();
        }
      },
      clear: function clear() {
        if (refSketch.current) {
          refSketch.current.clear();
        }
      },
      save: function save() {
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
    })));
  }))));
};
var _default = exports.default = Block;