"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dropdown = Dropdown;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function Dropdown(props) {
  const {
    children,
    overlay,
    forceVisible,
    forceHide
  } = props;
  const [isDropdownVisible, setDropdownVisible] = (0, _react.useState)(false);

  // This code will prevent accidentally drawing under the dropdown when you are
  // selecting an item from the tool options
  const stopPropagation = e => e.stopPropagation();
  const menuStyle = {
    position: 'absolute',
    top: 56
  };
  const settingMenu = /*#__PURE__*/_react.default.createElement("div", {
    style: menuStyle,
    onMouseDown: stopPropagation
  }, overlay);
  const wrapperStyle = {
    position: 'relative'
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: wrapperStyle,
    onMouseEnter: () => setDropdownVisible(true),
    onMouseLeave: () => setDropdownVisible(false)
  }, children, (isDropdownVisible || forceVisible) && !forceHide ? settingMenu : null);
}