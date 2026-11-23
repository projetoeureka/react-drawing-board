"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = Layout;
var _react = _interopRequireWildcard(require("react"));
var _ConfigContext = _interopRequireDefault(require("../ConfigContext"));
require("./Layout.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function Layout(props) {
  const {
    prefixCls
  } = (0, _react.useContext)(_ConfigContext.default);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-layout`
  }, props.children);
}
Layout.Header = function Header(props) {
  const {
    prefixCls
  } = (0, _react.useContext)(_ConfigContext.default);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-layout-header`
  }, props.children);
};
Layout.Sider = function Sider(props) {
  const {
    prefixCls
  } = (0, _react.useContext)(_ConfigContext.default);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-layout-sider`
  }, props.children);
};
Layout.Content = function Content(props) {
  const {
    prefixCls
  } = (0, _react.useContext)(_ConfigContext.default);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `${prefixCls}-layout-content`
  }, props.children);
};