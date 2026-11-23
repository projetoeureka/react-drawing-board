"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SelectIcon = function SelectIcon(props) {
  return /*#__PURE__*/_react.default.createElement("svg", _extends({
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), /*#__PURE__*/_react.default.createElement("path", {
    d: "M3 3L10 22L12.051 15.846C12.3455 14.9623 12.8418 14.1592 13.5005 13.5005C14.1592 12.8418 14.9623 12.3455 15.846 12.051L22 10L3 3Z",
    stroke: "#0A38A1",
    strokeWidth: "2",
    strokeLinejoin: "round"
  }));
};
var _default = exports.default = SelectIcon;