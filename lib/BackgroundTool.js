"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBackgroundDropdown = exports.getBackgroundPosition = void 0;
var _react = _interopRequireDefault(require("react"));
var _Layout = require("./Layout");
var _reactIntl = require("react-intl");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const useBackgroundDropdown = config => {
  const {
    selectBackgroundImage,
    removeBackgroundImage
  } = config;
  const {
    formatMessage
  } = (0, _reactIntl.useIntl)();
  return /*#__PURE__*/_react.default.createElement(_Layout.Menu, null, /*#__PURE__*/_react.default.createElement(_Layout.Menu.Item, {
    onClick: () => selectBackgroundImage()
  }, formatMessage({
    id: 'umi.block.sketch.bg.select'
  })), /*#__PURE__*/_react.default.createElement(_Layout.Menu.Item, {
    onClick: () => removeBackgroundImage()
  }, formatMessage({
    id: 'umi.block.sketch.bg.remove'
  })));
};
exports.useBackgroundDropdown = useBackgroundDropdown;
const getBackgroundPosition = context => {
  return {
    x: 0,
    y: 0,
    w: context.canvas.width,
    h: context.canvas.height
  };
};
exports.getBackgroundPosition = getBackgroundPosition;