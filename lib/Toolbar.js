"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactSpring = require("react-spring");
var _reactIntl = require("react-intl");
var _Tool = _interopRequireDefault(require("./enums/Tool"));
var _SelectIcon = _interopRequireDefault(require("./svgs/SelectIcon"));
var _StrokeIcon = _interopRequireDefault(require("./svgs/StrokeIcon"));
var _ShapeIcon = _interopRequireDefault(require("./svgs/ShapeIcon"));
var _TextIcon = _interopRequireDefault(require("./svgs/TextIcon"));
var _ImageIcon = _interopRequireDefault(require("./svgs/ImageIcon"));
var _UndoIcon = _interopRequireDefault(require("./svgs/UndoIcon"));
var _RedoIcon = _interopRequireDefault(require("./svgs/RedoIcon"));
var _ClearIcon = _interopRequireDefault(require("./svgs/ClearIcon"));
var _SaveIcon = _interopRequireDefault(require("./svgs/SaveIcon"));
var _EraserIcon = _interopRequireDefault(require("./svgs/EraserIcon"));
var _BackgroundIcon = _interopRequireDefault(require("./svgs/BackgroundIcon"));
var _StrokeTool = require("./StrokeTool");
var _ShapeTool = require("./ShapeTool");
var _BackgroundTool = require("./BackgroundTool");
var _Layout = require("./Layout");
var _classnames = _interopRequireDefault(require("classnames"));
require("./Toolbar.css");
var _utils = require("./utils");
var _ConfigContext = _interopRequireDefault(require("./ConfigContext"));
var _EnableSketchPadContext = _interopRequireDefault(require("./contexts/EnableSketchPadContext"));
var _TextTool = require("./TextTool");
var _ZoomOutIcon = _interopRequireDefault(require("./svgs/ZoomOutIcon"));
var _ZoomInIcon = _interopRequireDefault(require("./svgs/ZoomInIcon"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var useTools = function useTools() {
  var _useContext = (0, _react.useContext)(_ConfigContext.default),
    showBackgroundTool = _useContext.showBackgroundTool;
  var tools = (0, _react.useMemo)(function () {
    return [{
      label: 'umi.block.sketch.select',
      icon: _SelectIcon.default,
      type: _Tool.default.Select
    }, {
      label: 'umi.block.sketch.pencil',
      icon: _StrokeIcon.default,
      type: _Tool.default.Stroke,
      useDropdown: _StrokeTool.useStrokeDropdown
    }, {
      label: 'umi.block.sketch.eraser',
      icon: _EraserIcon.default,
      type: _Tool.default.Eraser
    }, {
      label: 'umi.block.sketch.text',
      icon: _TextIcon.default,
      type: _Tool.default.Text,
      useDropdown: _TextTool.useTextDropdown
    }, {
      label: 'umi.block.sketch.image',
      icon: _ImageIcon.default,
      type: _Tool.default.Image
    }, {
      label: 'umi.block.sketch.shape',
      icon: _ShapeIcon.default,
      type: _Tool.default.Shape,
      useDropdown: _ShapeTool.useShapeDropdown
    }].concat(_toConsumableArray(showBackgroundTool ? [{
      label: 'umi.block.sketch.background',
      icon: _BackgroundIcon.default,
      type: _Tool.default.Background,
      useDropdown: _BackgroundTool.useBackgroundDropdown
    }] : []), [{
      label: 'umi.block.sketch.undo',
      icon: _UndoIcon.default,
      type: _Tool.default.Undo,
      style: {
        marginLeft: 'auto'
      }
    }, {
      label: 'umi.block.sketch.redo',
      icon: _RedoIcon.default,
      type: _Tool.default.Redo
    }, {
      label: 'umi.block.sketch.clear',
      icon: _ClearIcon.default,
      type: _Tool.default.Clear,
      style: {
        marginRight: 'auto'
      }
    }], _toConsumableArray(!_utils.isMobileDevice ? [{
      label: 'umi.block.sketch.zoom-out',
      icon: _ZoomOutIcon.default,
      type: _Tool.default.ZoomOut
    }] : []), _toConsumableArray(!_utils.isMobileDevice ? [{
      label: 'umi.block.sketch.zoom-in',
      icon: _ZoomInIcon.default,
      type: _Tool.default.ZoomIn
    }] : []), _toConsumableArray(!_utils.isMobileDevice ? [{
      label: 'umi.block.sketch.save',
      icon: _SaveIcon.default,
      type: _Tool.default.Save,
      style: {
        backgroundColor: '#0A38A1',
        width: 50,
        height: 50,
        borderRadius: 8,
        marginTop: 'auto',
        marginBottom: 'auto'
      },
      labelStyle: {
        color: 'white'
      }
    }] : []));
  }, [showBackgroundTool]);
  (0, _react.useEffect)(function () {
    (0, _TextTool.initTextTool)();
  }, []);
  return tools;
};
var Toolbar = function Toolbar(props) {
  var currentTool = props.currentTool,
    setCurrentTool = props.setCurrentTool,
    currentToolOption = props.currentToolOption,
    setCurrentToolOption = props.setCurrentToolOption,
    selectImage = props.selectImage,
    selectBackgroundImage = props.selectBackgroundImage,
    _removeBackgroundImage = props.removeBackgroundImage,
    viewMatrix = props.viewMatrix,
    setViewMatrix = props.setViewMatrix,
    scale = props.scale,
    undo = props.undo,
    redo = props.redo,
    clear = props.clear,
    save = props.save,
    getCanvas = props.getCanvas;
  var refFileInput = (0, _react.useRef)(null);
  var refBgFileInput = (0, _react.useRef)(null);
  var intl = (0, _reactIntl.useIntl)();
  var _useContext2 = (0, _react.useContext)(_ConfigContext.default),
    prefixCls = _useContext2.prefixCls;
  var enableSketchPadContext = (0, _react.useContext)(_EnableSketchPadContext.default);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    hideDropdown = _useState2[0],
    setHideDropdown = _useState2[1];
  var toolbarPrefixCls = prefixCls + '-toolbar';
  var handleFileChange = function handleFileChange(cb) {
    return function (e) {
      var file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
          var base64data = reader.result;
          cb(base64data);
        };
      }
    };
  };
  var handleSelectImage = handleFileChange(selectImage);
  var handleSelectBackground = handleFileChange(selectBackgroundImage);
  var tools = useTools();
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(_defineProperty(_defineProperty({}, "".concat(toolbarPrefixCls, "-container"), true), "".concat(toolbarPrefixCls, "-mobile-container"), _utils.isMobileDevice))
  }, tools.map(function (tool) {
    var borderTopStyle = 'none';
    if (_utils.isMobileDevice) {
      if (tool.type === _Tool.default.Stroke && currentToolOption.strokeColor) {
        borderTopStyle = "3px solid ".concat(currentToolOption.strokeColor);
      }
      if (tool.type === _Tool.default.Shape && currentToolOption.shapeBorderColor) {
        borderTopStyle = "3px solid ".concat(currentToolOption.shapeBorderColor);
      }
    }
    var iconAnimateProps = (0, _reactSpring.useSpring)(_objectSpread({
      left: _utils.isMobileDevice && currentTool !== tool.type ? -12 : 0,
      borderTop: borderTopStyle
    }, tool.style || {}));
    var menu = /*#__PURE__*/_react.default.createElement(_reactSpring.animated.div, {
      className: (0, _classnames.default)(_defineProperty(_defineProperty(_defineProperty({}, "".concat(toolbarPrefixCls, "-icon"), true), "".concat(toolbarPrefixCls, "-activeIcon"), currentTool === tool.type && !_utils.isMobileDevice), "".concat(toolbarPrefixCls, "-mobile-icon"), _utils.isMobileDevice)),
      style: iconAnimateProps,
      onClick: function onClick() {
        if (tool.type === _Tool.default.Image && refFileInput.current) {
          refFileInput.current.click();
        } else if (tool.type === _Tool.default.Background) {} else if (tool.type === _Tool.default.Undo) {
          undo();
        } else if (tool.type === _Tool.default.Redo) {
          redo();
        } else if (tool.type === _Tool.default.Clear) {
          clear();
        } else if (tool.type === _Tool.default.Zoom) {} else if (tool.type === _Tool.default.ZoomIn && getCanvas) {
          setViewMatrix((0, _utils.zoom_matrix)(viewMatrix, scale + 0.1, getCanvas()));
        } else if (tool.type === _Tool.default.ZoomOut && getCanvas) {
          setViewMatrix((0, _utils.zoom_matrix)(viewMatrix, scale - 0.1, getCanvas()));
        } else if (tool.type === _Tool.default.Save) {
          save();
        } else {
          // Close the current open dropdown
          if (tool.type === currentTool) {
            setHideDropdown(function (hide) {
              return !hide;
            });
          } else {
            setHideDropdown(false);
          }
          setCurrentTool(tool.type);
        }
      },
      key: tool.label
    }, /*#__PURE__*/_react.default.createElement(tool.icon, null), !_utils.isMobileDevice ? /*#__PURE__*/_react.default.createElement("label", {
      className: "".concat(toolbarPrefixCls, "-iconLabel"),
      style: tool.labelStyle || {}
    }, tool.labelThunk ? tool.labelThunk(props) : intl.formatMessage({
      id: tool.label
    })) : null);
    if (tool.useDropdown) {
      var overlay = tool.useDropdown({
        currentToolOption: currentToolOption,
        setCurrentToolOption: setCurrentToolOption,
        setCurrentTool: setCurrentTool,
        prefixCls: prefixCls,
        selectBackgroundImage: function selectBackgroundImage() {
          refBgFileInput.current.click();
        },
        removeBackgroundImage: function removeBackgroundImage() {
          _removeBackgroundImage();
        },
        intl: intl
      });
      return /*#__PURE__*/_react.default.createElement(_Layout.Dropdown, {
        key: tool.label,
        overlay: overlay,
        forceHide: hideDropdown,
        forceVisible: currentTool === tool.type
      }, menu);
    } else {
      return menu;
    }
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "file",
    style: {
      display: 'none'
    },
    accept: "image/*",
    ref: refFileInput,
    onChange: handleSelectImage
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "file",
    style: {
      display: 'none'
    },
    accept: "image/*",
    ref: refBgFileInput,
    onChange: handleSelectBackground
  }));
};
var _default = exports.default = Toolbar;