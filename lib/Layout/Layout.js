"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = Layout;
var _react = _interopRequireWildcard(require("react"));
var _ConfigContext = _interopRequireDefault(require("../ConfigContext"));
require("./Layout.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function Layout(props) {
  var _useContext = (0, _react.useContext)(_ConfigContext.default),
    prefixCls = _useContext.prefixCls;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-layout")
  }, props.children);
}
Layout.Header = function Header(props) {
  var _useContext2 = (0, _react.useContext)(_ConfigContext.default),
    prefixCls = _useContext2.prefixCls;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-layout-header")
  }, props.children);
};
Layout.Sider = function Sider(props) {
  var _useContext3 = (0, _react.useContext)(_ConfigContext.default),
    prefixCls = _useContext3.prefixCls;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-layout-sider")
  }, props.children);
};
Layout.Content = function Content(props) {
  var _useContext4 = (0, _react.useContext)(_ConfigContext.default),
    prefixCls = _useContext4.prefixCls;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(prefixCls, "-layout-content")
  }, props.children);
};