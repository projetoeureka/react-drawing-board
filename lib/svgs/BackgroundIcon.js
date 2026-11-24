"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var BackgroundIcon = function BackgroundIcon(props) {
  return /*#__PURE__*/_react.default.createElement("svg", _extends({
    viewBox: "0 0 1024 1024",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    width: "64",
    height: "64",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    style: {
      padding: '3px 1px'
    }
  }, props), /*#__PURE__*/_react.default.createElement("path", {
    d: "M384 938.666667h132.266667l422.4-422.4V384m-93.866667 554.666667c51.2 0 93.866667-42.666667 93.866667-93.866667v-93.866667L750.933333 938.666667M179.2 85.333333C128 85.333333 85.333333 128 85.333333 179.2v93.866667L273.066667 85.333333m234.666666 0L85.333333 507.733333V640L640 85.333333m226.133333 4.266667L89.6 866.133333c4.266667 17.066667 12.8 29.866667 25.6 42.666667 12.8 12.8 25.6 21.333333 42.666667 25.6L934.4 157.866667c-8.533333-34.133333-34.133333-59.733333-68.266667-68.266667z"
  }));
};
var _default = exports.default = BackgroundIcon;