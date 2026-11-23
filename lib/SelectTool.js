"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onSelectMouseUp = exports.onSelectMouseMove = exports.onSelectMouseDown = exports.onSelectMouseDoubleClick = exports.SELECT_PADDING = void 0;
var _Tool = _interopRequireDefault(require("./enums/Tool"));
var _TextTool = require("./TextTool");
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var lastSelectX = 0;
var lastSelectY = 0;
var isDragging = false;
var startDragPos = null;
var startDragViewMatrix = [1, 0, 0, 1, 0, 0];
var isLazy = false;
var SELECT_PADDING = exports.SELECT_PADDING = 10;
var getRotatedWidgets = function getRotatedWidgets(px, py, ox, oy, rotate) {
  var x = Math.cos(rotate) * (px - ox) - Math.sin(rotate) * (py - oy) + ox;
  var y = Math.sin(rotate) * (px - ox) + Math.cos(rotate) * (py - oy) + oy;
  return [x, y];
};
function rectContain(_ref, _ref2, rotate) {
  var parentX = _ref.x,
    parentY = _ref.y,
    width = _ref.w,
    height = _ref.h;
  var _ref3 = _slicedToArray(_ref2, 2),
    x = _ref3[0],
    y = _ref3[1];
  if (rotate) {
    var _getRotatedWidgets = getRotatedWidgets(x, y, parentX + width / 2, parentY + height / 2, -rotate);
    var _getRotatedWidgets2 = _slicedToArray(_getRotatedWidgets, 2);
    x = _getRotatedWidgets2[0];
    y = _getRotatedWidgets2[1];
  }
  return !!(x >= parentX && x <= parentX + width && y >= parentY && y <= parentY + height);
}
var findSelectedItem = function findSelectedItem(items, pos, scale) {
  var selectPadding = Math.max(SELECT_PADDING * 1 / scale || 0, SELECT_PADDING);
  for (var i = items.length - 1; i >= 0; i--) {
    var _item = items[i];
    if ((_item.tool === _Tool.default.Stroke || _item.tool === _Tool.default.Eraser) && rectContain(_item.pos, pos, 0)) {
      var points = _item.points;
      if (points.some(function (p) {
        return Math.pow(p.x - pos[0], 2) + Math.pow(p.y - pos[1], 2) < Math.pow(selectPadding * 2, 2);
      })) {
        return _item;
      }
    } else if (_item.tool === _Tool.default.Shape || _item.tool === _Tool.default.Text || _item.tool === _Tool.default.Image) {
      var rotate = 0;
      var selectedItem = rectContain({
        x: _item.pos.x - selectPadding,
        y: _item.pos.y - selectPadding,
        w: _item.pos.w + 2 * selectPadding,
        h: _item.pos.h + 2 * selectPadding
      }, pos, rotate) ? _item : null;
      if (selectedItem) {
        return _objectSpread({}, selectedItem);
      }
    }
  }
  return null;
};
var onSelectMouseDown = exports.onSelectMouseDown = function onSelectMouseDown(e, x, y, scale, operationListState, viewMatrix, setSelectedOperation) {
  var pos = [x, y];
  lastSelectX = e.clientX;
  lastSelectY = e.clientY;
  var selectedItem = findSelectedItem(operationListState.reduced, pos, scale);
  setSelectedOperation(selectedItem);
  if (selectedItem !== null) {
    startDragPos = selectedItem.pos;
  }
  isDragging = true;
  startDragViewMatrix = viewMatrix;
};
var onSelectMouseMove = exports.onSelectMouseMove = function onSelectMouseMove(e, x, y, scale, operationListState, selectedOperation, setViewMatrix, setHoverOperationId, handleCompleteOperation, operationListDispatch, setSelectedOperation) {
  if (isDragging) {
    var items = operationListState.queue;
    var diff = {
      x: (e.clientX - lastSelectX) / scale,
      y: (e.clientY - lastSelectY) / scale
    };
    if (selectedOperation && startDragPos) {
      var lastOperation = items[items.length - 1];
      if (lastOperation && lastOperation.tool === _Tool.default.Update && lastOperation.operationId === selectedOperation.id && lastOperation.data.pos) {
        var update = lastOperation;
        if (update.data.pos) {
          update.data.pos = _objectSpread(_objectSpread({}, update.data.pos), {}, {
            x: startDragPos.x + diff.x,
            y: startDragPos.y + diff.y
          });
          operationListDispatch({
            type: 'replaceLast',
            payload: {
              operation: update
            }
          });
        }
      } else {
        isLazy = true;
        handleCompleteOperation(_Tool.default.LazyUpdate, {
          operationId: selectedOperation.id,
          data: {
            pos: _objectSpread(_objectSpread({}, startDragPos), {}, {
              x: startDragPos.x + diff.x,
              y: startDragPos.y + diff.y
            })
          }
        });
      }
      setSelectedOperation(_objectSpread(_objectSpread({}, selectedOperation), {}, {
        pos: _objectSpread(_objectSpread({}, startDragPos), {}, {
          x: startDragPos.x + diff.x,
          y: startDragPos.y + diff.y
        })
      }));
    } else {
      setViewMatrix((0, _utils.matrix_multiply)([1, 0, 0, 1, diff.x * scale, diff.y * scale], startDragViewMatrix));
    }
  } else if (!_utils.isMobileDevice) {
    var _pos = [x, y];
    var selectedItem = findSelectedItem(operationListState.reduced, _pos, scale);
    setHoverOperationId(selectedItem ? selectedItem.id : selectedItem);
  }
};
var onSelectMouseDoubleClick = exports.onSelectMouseDoubleClick = function onSelectMouseDoubleClick(x, y, scale, operationListState, handleCompleteOperation, viewMatrix, refInput, refCanvas, intl) {
  var pos = [x, y];
  var selectedItem = findSelectedItem(operationListState.reduced, pos, scale);
  if (selectedItem !== null && refCanvas.current) {
    if (selectedItem.tool === _Tool.default.Text) {
      var _operation = selectedItem;
      var _viewMatrix = _slicedToArray(viewMatrix, 6),
        a = _viewMatrix[0],
        b = _viewMatrix[1],
        c = _viewMatrix[2],
        d = _viewMatrix[3],
        e = _viewMatrix[4],
        f = _viewMatrix[5];
      var canvas = refCanvas.current;
      var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
        top = _canvas$getBoundingCl.top,
        left = _canvas$getBoundingCl.left;
      handleCompleteOperation(_Tool.default.Remove, {
        operationId: selectedItem.id
      });
      (0, _TextTool.onTextMouseUp)({
        clientX: a * selectedItem.pos.x + c * selectedItem.pos.y + e + left,
        clientY: b * selectedItem.pos.x + d * selectedItem.pos.y + f + top
      }, {
        textSize: _operation.size,
        textColor: _operation.color,
        defaultText: _operation.text
      }, scale, refInput, refCanvas, intl);
    }
  }
};
var onSelectMouseUp = exports.onSelectMouseUp = function onSelectMouseUp(operationListDispatch) {
  if (isLazy) {
    isLazy = false;
    operationListDispatch({
      type: 'completeLazyUpdate'
    });
  }
  if (isDragging) {
    isDragging = false;
  }
};