"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onSelectMouseUp = exports.onSelectMouseMove = exports.onSelectMouseDown = exports.onSelectMouseDoubleClick = exports.SELECT_PADDING = void 0;
var _Tool = _interopRequireDefault(require("./enums/Tool"));
var _TextTool = require("./TextTool");
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let lastSelectX = 0;
let lastSelectY = 0;
let isDragging = false;
let startDragPos = null;
let startDragViewMatrix = [1, 0, 0, 1, 0, 0];
let isLazy = false;
const SELECT_PADDING = exports.SELECT_PADDING = 10;
const getRotatedWidgets = (px, py, ox, oy, rotate) => {
  const x = Math.cos(rotate) * (px - ox) - Math.sin(rotate) * (py - oy) + ox;
  const y = Math.sin(rotate) * (px - ox) + Math.cos(rotate) * (py - oy) + oy;
  return [x, y];
};
function rectContain({
  x: parentX,
  y: parentY,
  w: width,
  h: height
}, [x, y], rotate) {
  if (rotate) {
    [x, y] = getRotatedWidgets(x, y, parentX + width / 2, parentY + height / 2, -rotate);
  }
  return !!(x >= parentX && x <= parentX + width && y >= parentY && y <= parentY + height);
}
const findSelectedItem = (items, pos, scale) => {
  const selectPadding = Math.max(SELECT_PADDING * 1 / scale || 0, SELECT_PADDING);
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if ((item.tool === _Tool.default.Stroke || item.tool === _Tool.default.Eraser) && rectContain(item.pos, pos, 0)) {
      const points = item.points;
      if (points.some(p => (p.x - pos[0]) ** 2 + (p.y - pos[1]) ** 2 < (selectPadding * 2) ** 2)) {
        return item;
      }
    } else if (item.tool === _Tool.default.Shape || item.tool === _Tool.default.Text || item.tool === _Tool.default.Image) {
      const rotate = 0;
      const selectedItem = rectContain({
        x: item.pos.x - selectPadding,
        y: item.pos.y - selectPadding,
        w: item.pos.w + 2 * selectPadding,
        h: item.pos.h + 2 * selectPadding
      }, pos, rotate) ? item : null;
      if (selectedItem) {
        return {
          ...selectedItem
        };
      }
    }
  }
  return null;
};
const onSelectMouseDown = (e, x, y, scale, operationListState, viewMatrix, setSelectedOperation) => {
  const pos = [x, y];
  lastSelectX = e.clientX;
  lastSelectY = e.clientY;
  let selectedItem = findSelectedItem(operationListState.reduced, pos, scale);
  setSelectedOperation(selectedItem);
  if (selectedItem !== null) {
    startDragPos = selectedItem.pos;
  }
  isDragging = true;
  startDragViewMatrix = viewMatrix;
};
exports.onSelectMouseDown = onSelectMouseDown;
const onSelectMouseMove = (e, x, y, scale, operationListState, selectedOperation, setViewMatrix, setHoverOperationId, handleCompleteOperation, operationListDispatch, setSelectedOperation) => {
  if (isDragging) {
    const items = operationListState.queue;
    const diff = {
      x: (e.clientX - lastSelectX) / scale,
      y: (e.clientY - lastSelectY) / scale
    };
    if (selectedOperation && startDragPos) {
      const lastOperation = items[items.length - 1];
      if (lastOperation && lastOperation.tool === _Tool.default.Update && lastOperation.operationId === selectedOperation.id && lastOperation.data.pos) {
        const update = lastOperation;
        if (update.data.pos) {
          update.data.pos = {
            ...update.data.pos,
            x: startDragPos.x + diff.x,
            y: startDragPos.y + diff.y
          };
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
            pos: {
              ...startDragPos,
              x: startDragPos.x + diff.x,
              y: startDragPos.y + diff.y
            }
          }
        });
      }
      setSelectedOperation({
        ...selectedOperation,
        pos: {
          ...startDragPos,
          x: startDragPos.x + diff.x,
          y: startDragPos.y + diff.y
        }
      });
    } else {
      setViewMatrix((0, _utils.matrix_multiply)([1, 0, 0, 1, diff.x * scale, diff.y * scale], startDragViewMatrix));
    }
  } else if (!_utils.isMobileDevice) {
    const pos = [x, y];
    let selectedItem = findSelectedItem(operationListState.reduced, pos, scale);
    setHoverOperationId(selectedItem ? selectedItem.id : selectedItem);
  }
};
exports.onSelectMouseMove = onSelectMouseMove;
const onSelectMouseDoubleClick = (x, y, scale, operationListState, handleCompleteOperation, viewMatrix, refInput, refCanvas, intl) => {
  const pos = [x, y];
  let selectedItem = findSelectedItem(operationListState.reduced, pos, scale);
  if (selectedItem !== null && refCanvas.current) {
    if (selectedItem.tool === _Tool.default.Text) {
      const operation = selectedItem;
      const [a, b, c, d, e, f] = viewMatrix;
      const canvas = refCanvas.current;
      const {
        top,
        left
      } = canvas.getBoundingClientRect();
      handleCompleteOperation(_Tool.default.Remove, {
        operationId: selectedItem.id
      });
      (0, _TextTool.onTextMouseUp)({
        clientX: a * selectedItem.pos.x + c * selectedItem.pos.y + e + left,
        clientY: b * selectedItem.pos.x + d * selectedItem.pos.y + f + top
      }, {
        textSize: operation.size,
        textColor: operation.color,
        defaultText: operation.text
      }, scale, refInput, refCanvas, intl);
    }
  }
};
exports.onSelectMouseDoubleClick = onSelectMouseDoubleClick;
const onSelectMouseUp = operationListDispatch => {
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
exports.onSelectMouseUp = onSelectMouseUp;