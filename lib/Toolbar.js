"use strict";

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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useTools = () => {
  const {
    showBackgroundTool
  } = (0, _react.useContext)(_ConfigContext.default);
  const tools = (0, _react.useMemo)(() => {
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
    }, ...(showBackgroundTool ? [{
      label: 'umi.block.sketch.background',
      icon: _BackgroundIcon.default,
      type: _Tool.default.Background,
      useDropdown: _BackgroundTool.useBackgroundDropdown
    }] : []), {
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
    }, ...(!_utils.isMobileDevice ? [{
      label: 'umi.block.sketch.zoom-out',
      icon: _ZoomOutIcon.default,
      type: _Tool.default.ZoomOut
    }] : []), ...(!_utils.isMobileDevice ? [{
      label: 'umi.block.sketch.zoom-in',
      icon: _ZoomInIcon.default,
      type: _Tool.default.ZoomIn
    }] : []), ...(!_utils.isMobileDevice ? [{
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
    }] : [])];
  }, [showBackgroundTool]);
  (0, _react.useEffect)(() => {
    (0, _TextTool.initTextTool)();
  }, []);
  return tools;
};
const Toolbar = props => {
  const {
    currentTool,
    setCurrentTool,
    currentToolOption,
    setCurrentToolOption,
    selectImage,
    selectBackgroundImage,
    removeBackgroundImage,
    viewMatrix,
    setViewMatrix,
    scale,
    undo,
    redo,
    clear,
    save,
    getCanvas
  } = props;
  const refFileInput = (0, _react.useRef)(null);
  const refBgFileInput = (0, _react.useRef)(null);
  const intl = (0, _reactIntl.useIntl)();
  const {
    prefixCls
  } = (0, _react.useContext)(_ConfigContext.default);
  const enableSketchPadContext = (0, _react.useContext)(_EnableSketchPadContext.default);
  const [hideDropdown, setHideDropdown] = (0, _react.useState)(false);
  const toolbarPrefixCls = prefixCls + '-toolbar';
  const handleFileChange = cb => e => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result;
        cb(base64data);
      };
    }
  };
  const handleSelectImage = handleFileChange(selectImage);
  const handleSelectBackground = handleFileChange(selectBackgroundImage);
  const tools = useTools();
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)({
      [`${toolbarPrefixCls}-container`]: true,
      [`${toolbarPrefixCls}-mobile-container`]: _utils.isMobileDevice
    })
  }, tools.map(tool => {
    let borderTopStyle = 'none';
    if (_utils.isMobileDevice) {
      if (tool.type === _Tool.default.Stroke && currentToolOption.strokeColor) {
        borderTopStyle = `3px solid ${currentToolOption.strokeColor}`;
      }
      if (tool.type === _Tool.default.Shape && currentToolOption.shapeBorderColor) {
        borderTopStyle = `3px solid ${currentToolOption.shapeBorderColor}`;
      }
    }
    const iconAnimateProps = (0, _reactSpring.useSpring)({
      left: _utils.isMobileDevice && currentTool !== tool.type ? -12 : 0,
      borderTop: borderTopStyle,
      ...(tool.style || {})
    });
    const menu = /*#__PURE__*/_react.default.createElement(_reactSpring.animated.div, {
      className: (0, _classnames.default)({
        [`${toolbarPrefixCls}-icon`]: true,
        [`${toolbarPrefixCls}-activeIcon`]: currentTool === tool.type && !_utils.isMobileDevice,
        [`${toolbarPrefixCls}-mobile-icon`]: _utils.isMobileDevice
      }),
      style: iconAnimateProps,
      onClick: () => {
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
            setHideDropdown(hide => !hide);
          } else {
            setHideDropdown(false);
          }
          setCurrentTool(tool.type);
        }
      },
      key: tool.label
    }, /*#__PURE__*/_react.default.createElement(tool.icon, null), !_utils.isMobileDevice ? /*#__PURE__*/_react.default.createElement("label", {
      className: `${toolbarPrefixCls}-iconLabel`,
      style: tool.labelStyle || {}
    }, tool.labelThunk ? tool.labelThunk(props) : intl.formatMessage({
      id: tool.label
    })) : null);
    if (tool.useDropdown) {
      const overlay = tool.useDropdown({
        currentToolOption,
        setCurrentToolOption,
        setCurrentTool,
        prefixCls,
        selectBackgroundImage: () => {
          refBgFileInput.current.click();
        },
        removeBackgroundImage: () => {
          removeBackgroundImage();
        },
        intl
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