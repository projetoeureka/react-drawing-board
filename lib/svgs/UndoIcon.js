"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var UndoIcon = function UndoIcon(props) {
  return /*#__PURE__*/_react.default.createElement("svg", _extends({
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), /*#__PURE__*/_react.default.createElement("path", {
    d: "M6.34311 17.6569C7.08515 18.4009 7.96692 18.9909 8.93772 19.393C9.90852 19.7951 10.9492 20.0014 12 20C16.4182 20 20 16.4182 20 12C20 7.58178 16.4182 4 12 4C9.79111 4 7.79111 4.89556 6.34311 6.34311C5.60622 7.08 4 8.88889 4 8.88889",
    stroke: "#0A38A1",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M4 5.33594V8.89149H7.55556",
    stroke: "#0A38A1",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};
var _default = exports.default = UndoIcon;