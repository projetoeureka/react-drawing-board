"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var ZoomIcon = function ZoomIcon(props) {
  return /*#__PURE__*/_react.default.createElement("svg", _extends({
    x: "0px",
    y: "0px",
    viewBox: "0 0 64 64"
  }, props), /*#__PURE__*/_react.default.createElement("path", {
    d: "M49.6,52.2c-0.4,0-0.7-0.2-1-0.5l-9.9-9.9c-3,2.5-6.9,3.9-10.9,3.9c-9.4,0-17-7.6-17-17c0-9.4,7.6-17,17-17 c9.4,0,17,7.6,17,17c0,4-1.4,7.9-3.9,10.9l9.9,9.9c0.6,0.7,0.6,1.6-0.1,2.2C50.4,52.2,49.8,52.2,49.6,52.2z M27.8,14.9 c-7.7,0-13.9,6.2-13.9,13.9c0,7.7,6.2,13.9,13.9,13.9c7.7,0,13.9-6.2,13.9-13.9C41.7,21.1,35.5,14.9,27.8,14.9z"
  }));
};
var _default = exports.default = ZoomIcon;