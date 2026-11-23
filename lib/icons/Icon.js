"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Icon;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function Icon({
  type,
  style
}) {
  const iconText = (0, _react.useMemo)(() => type === 'check' ? '✓' : 'x', [type]);
  const addtionStyle = (0, _react.useMemo)(() => type === 'close-circle' ? {
    borderRadius: '50%',
    backgroundColor: 'red',
    color: '#fff',
    alignItems: 'flex-end'
  } : {}, [type]);
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 15,
      height: 15,
      position: 'absolute',
      fontSize: 12,
      ...addtionStyle,
      ...style
    }
  }, iconText);
}