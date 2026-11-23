"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _Tool = _interopRequireWildcard(require("./enums/Tool"));
var _reactIntl = require("react-intl");
var _utils = require("./utils");
var _StrokeTool = require("./StrokeTool");
var _ShapeTool = require("./ShapeTool");
var _ImageTool = require("./ImageTool");
var _TextTool = require("./TextTool");
var _SelectTool = require("./SelectTool");
var _lodash = require("lodash");
var _Icon = _interopRequireDefault(require("./icons/Icon"));
var _uuid = require("uuid");
var _sketch_stroke_cursor = _interopRequireDefault(require("./images/sketch_stroke_cursor"));
var _sketch_eraser_cursor = _interopRequireDefault(require("./images/sketch_eraser_cursor"));
var _gesture = require("./gesture");
var _EnableSketchPadContext = _interopRequireDefault(require("./contexts/EnableSketchPadContext"));
require("./SketchPad.css");
var _ConfigContext = _interopRequireDefault(require("./ConfigContext"));
var _reactUseGesture = require("react-use-gesture");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const DPR = window.devicePixelRatio || 1;
const SELECT_BOX_PADDING = 3;
const BackgroundOperationId = 'Background/' + (0, _uuid.v4)();
const stopPropagation = e => e.stopPropagation();
const reduceOperations = operations => {
  const undoHistory = [];
  operations = operations.sort((a, b) => a.timestamp - b.timestamp);

  // convert background image to draw image
  let backgroundOperation;
  operations = operations.reduce((r, v) => {
    if (v.tool === _Tool.default.Background) {
      backgroundOperation = v;
      return r;
    } else if (v.tool === _Tool.default.RemoveBackground) {
      backgroundOperation = undefined;
      return r;
    } else {
      r.push(v);
      return r;
    }
  }, []);
  operations = operations.reduce((r, v) => {
    switch (v.tool) {
      case _Tool.default.Undo:
        if (r.length) {
          undoHistory.push(r.pop());
        }
        break;
      case _Tool.default.Redo:
        if (undoHistory.length) {
          r.push(undoHistory.pop());
        }
        break;
      default:
        undoHistory.splice(0);
        r.push(v);
        break;
    }
    return r;
  }, []);
  operations.forEach(v => {
    if (v.tool === _Tool.default.Update) {
      const update = v;
      const targetIndex = operations.findIndex(w => w && w.id === update.operationId);
      if (~targetIndex) {
        const target = operations[targetIndex];
        // @ts-ignore
        operations[targetIndex] = {
          ...operations[targetIndex],
          ...update.data
        };

        // move other properties related to pos
        if (update.data.pos) {
          switch (target.tool) {
            case _Tool.default.Eraser:
            case _Tool.default.Stroke:
              operations[targetIndex] = {
                ...operations[targetIndex],
                ...{
                  points: (0, _StrokeTool.moveStoke)(target, target.pos, update.data.pos)
                }
              };
              break;
            case _Tool.default.Shape:
              {
                const newOperation = {
                  ...operations[targetIndex]
                };
                const shapeTarget = target;
                if (shapeTarget.type !== _Tool.ShapeType.Line) {
                  newOperation.start = {
                    x: newOperation.pos.x,
                    y: newOperation.pos.y
                  };
                  newOperation.end = {
                    x: newOperation.pos.x + newOperation.pos.w,
                    y: newOperation.pos.y + newOperation.pos.h
                  };
                } else {
                  // line tool need decide direction
                  if ((shapeTarget.end.x - shapeTarget.start.x) * (shapeTarget.end.y - shapeTarget.start.y) > 0) {
                    newOperation.start = {
                      x: newOperation.pos.x,
                      y: newOperation.pos.y
                    };
                    newOperation.end = {
                      x: newOperation.pos.x + newOperation.pos.w,
                      y: newOperation.pos.y + newOperation.pos.h
                    };
                  } else {
                    newOperation.start = {
                      x: newOperation.pos.x,
                      y: newOperation.pos.y + newOperation.pos.h
                    };
                    newOperation.end = {
                      x: newOperation.pos.x + newOperation.pos.w,
                      y: newOperation.pos.y
                    };
                  }
                }
                operations[targetIndex] = {
                  ...newOperation
                };
                break;
              }
            default:
              break;
          }
        }
      }
    }
  });
  const removeIds = operations.filter(v => v.tool === _Tool.default.Remove).map(v => v.operationId);
  operations = operations.filter(v => v.tool !== _Tool.default.Update && removeIds.indexOf(v.id) < 0); // keep Remove operation to keep undoable

  if (backgroundOperation) {
    operations.unshift(backgroundOperation);
  }
  return operations;
};
const operationListReducer = (isControlled, onChange) => (state, action) => {
  switch (action.type) {
    case 'add':
      {
        let operation = action.payload.operation;
        const isLazy = action.payload.isLazy;
        const newQueue = state.queue.concat([operation]);
        if (!isControlled || isLazy) {
          return {
            queue: newQueue,
            reduced: reduceOperations(newQueue)
          };
        } else {
          onChange && onChange(operation, newQueue);
          return state;
        }
      }
    case 'replaceLast':
      {
        let operation = action.payload.operation;
        const newQueue = state.queue.slice(0, -1).concat([operation]);
        return {
          queue: newQueue,
          reduced: reduceOperations(newQueue)
        };
      }
    case 'replaceAll':
      {
        let newQueue = action.payload.queue;
        return {
          queue: newQueue,
          reduced: reduceOperations(newQueue)
        };
      }
    case 'completeLazyUpdate':
      {
        let operation = state.queue[state.queue.length - 1];
        if (isControlled && operation && operation.tool === _Tool.default.Update) {
          onChange && onChange(operation, state.queue);
        }
        return state;
      }
    default:
      return state;
  }
};
var ResizeDirection = /*#__PURE__*/function (ResizeDirection) {
  ResizeDirection["TopLeft"] = "TopLeft";
  ResizeDirection["TopCenter"] = "TopCenter";
  ResizeDirection["MiddleRight"] = "MiddleRight";
  ResizeDirection["MiddleLeft"] = "MiddleLest";
  ResizeDirection["BottomRight"] = "BottomRight";
  ResizeDirection["BottomCenter"] = "BottomCenter";
  ResizeDirection["BottomLeft"] = "BottomLeft";
  return ResizeDirection;
}(ResizeDirection || {});
let isResizing = null;
let startResizePoint = [0, 0];
let startResizePos = null;
const useResizeHandler = (selectedOperation, viewMatrix, items, operationListDispatch, setSelectedOperation, handleCompleteOperation, refCanvas, prefixCls) => {
  if (selectedOperation && (selectedOperation.tool === _Tool.default.Shape || selectedOperation.tool === _Tool.default.Image)) {
    const [a, b, c, d, e, f] = viewMatrix;
    const pos = {
      x: selectedOperation.pos.x - SELECT_BOX_PADDING,
      y: selectedOperation.pos.y - SELECT_BOX_PADDING,
      w: selectedOperation.pos.w + 2 * SELECT_BOX_PADDING,
      h: selectedOperation.pos.h + 2 * SELECT_BOX_PADDING
    };
    const tl = [a * pos.x + c * pos.y + e, b * pos.x + d * pos.y + f];
    const br = [a * (pos.x + pos.w) + c * (pos.y + pos.h) + e, b * (pos.x + pos.w) + d * (pos.y + pos.h) + f];
    const w = br[0] - tl[0],
      h = br[1] - tl[1];
    const onMouseDown = direction => e => {
      e.stopPropagation();
      if (refCanvas.current) {
        isResizing = direction;
        startResizePoint = (0, _utils.mapClientToCanvas)(e, refCanvas.current, viewMatrix);
        startResizePos = {
          ...selectedOperation.pos
        };
      }
    };
    const onTouchStart = direction => e => {
      e.stopPropagation();
      if (refCanvas.current && e.touches[0]) {
        isResizing = direction;
        startResizePoint = (0, _utils.mapClientToCanvas)(e.touches[0], refCanvas.current, viewMatrix);
        startResizePos = {
          ...selectedOperation.pos
        };
      }
    };
    const onMouseMove = e => {
      if (selectedOperation && isResizing && refCanvas.current && startResizePos) {
        let pos = (0, _utils.mapClientToCanvas)(e, refCanvas.current, viewMatrix);
        const diff = {
          x: pos[0] - startResizePoint[0],
          y: pos[1] - startResizePoint[1]
        };
        const updatePos = {
          ...startResizePos
        };
        if (isResizing === ResizeDirection.TopLeft) {
          diff.x = Math.min(diff.x, updatePos.w);
          diff.y = Math.min(diff.y, updatePos.h);
          updatePos.x += diff.x;
          updatePos.w -= diff.x;

          // Keep the diff as same radio of selected item
          if (selectedOperation?.pos?.w && selectedOperation.pos?.h) {
            const ratio = selectedOperation?.pos.w / selectedOperation?.pos?.h;
            updatePos.h = updatePos.w / ratio;
            updatePos.y += diff.x / ratio;
          } else {
            updatePos.y += diff.y;
            updatePos.h -= diff.y;
          }
        } else if (isResizing === ResizeDirection.TopCenter) {
          diff.y = Math.min(diff.y, updatePos.h);
          updatePos.y += diff.y;
          updatePos.h -= diff.y;
        } else if (isResizing === ResizeDirection.MiddleRight) {
          diff.x = Math.max(diff.x, -updatePos.w);
          updatePos.w += diff.x;
        } else if (isResizing === ResizeDirection.BottomRight) {
          diff.x = Math.max(diff.x, -updatePos.w);
          updatePos.w += diff.x;
          // Keep the diff as same radio of selected item
          if (selectedOperation?.pos?.w && selectedOperation.pos?.h) {
            const ratio = selectedOperation?.pos.w / selectedOperation?.pos?.h;
            updatePos.h = updatePos.w / ratio;
          } else {
            diff.y = Math.max(diff.y, -updatePos.h);
            updatePos.h += diff.y;
          }
        } else if (isResizing === ResizeDirection.BottomCenter) {
          diff.y = Math.max(diff.y, -updatePos.h);
          updatePos.h += diff.y;
        } else if (isResizing === ResizeDirection.BottomLeft) {
          diff.x = Math.min(diff.x, updatePos.w);
          updatePos.x += diff.x;
          updatePos.w -= diff.x;

          // Keep the diff as same radio of selected item
          if (selectedOperation?.pos?.w && selectedOperation.pos?.h) {
            const ratio = selectedOperation?.pos.w / selectedOperation?.pos?.h;
            updatePos.h = updatePos.w / ratio;
          } else {
            diff.y = Math.max(diff.y, -updatePos.h);
            updatePos.h += diff.y;
          }
        } else if (isResizing === ResizeDirection.MiddleLeft) {
          diff.x = Math.min(diff.x, updatePos.w);
          updatePos.x += diff.x;
          updatePos.w -= diff.x;
        }
        const lastOperation = items[items.length - 1];
        if (lastOperation && lastOperation.tool === _Tool.default.Update && lastOperation.operationId === selectedOperation.id && lastOperation.data.pos) {
          const update = lastOperation;
          if (update.data.pos) {
            update.data.pos = {
              ...updatePos
            };
            operationListDispatch({
              type: 'replaceLast',
              payload: {
                operation: update
              }
            });
          }
        } else {
          handleCompleteOperation(_Tool.default.LazyUpdate, {
            operationId: selectedOperation.id,
            data: {
              pos: {
                ...updatePos
              }
            }
          });
        }
        setSelectedOperation({
          ...selectedOperation,
          pos: {
            ...updatePos
          }
        });
      }
    };
    const onMouseUp = () => {
      operationListDispatch({
        type: 'completeLazyUpdate'
      });
      isResizing = null;
    };
    return {
      onMouseMove,
      onMouseUp,
      resizer: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
        key: ResizeDirection.TopLeft,
        onTouchStart: onTouchStart(ResizeDirection.TopLeft),
        onMouseDown: onMouseDown(ResizeDirection.TopLeft),
        className: `${prefixCls}-resizer`,
        style: {
          left: tl[0] + 'px',
          top: tl[1] + 'px'
        }
      }), /*#__PURE__*/_react.default.createElement("div", {
        key: ResizeDirection.TopCenter,
        onTouchStart: onTouchStart(ResizeDirection.TopCenter),
        onMouseDown: onMouseDown(ResizeDirection.TopCenter),
        className: `${prefixCls}-resizer`,
        style: {
          left: tl[0] + w / 2 + 'px',
          top: tl[1] + 'px'
        }
      }), /*#__PURE__*/_react.default.createElement("div", {
        key: ResizeDirection.MiddleRight,
        onTouchStart: onTouchStart(ResizeDirection.MiddleRight),
        onMouseDown: onMouseDown(ResizeDirection.MiddleRight),
        className: `${prefixCls}-resizer`,
        style: {
          left: tl[0] + w + 'px',
          top: tl[1] + h / 2 + 'px'
        }
      }), /*#__PURE__*/_react.default.createElement("div", {
        key: ResizeDirection.BottomRight,
        onTouchStart: onTouchStart(ResizeDirection.BottomRight),
        onMouseDown: onMouseDown(ResizeDirection.BottomRight),
        className: `${prefixCls}-resizer`,
        style: {
          left: br[0] + 'px',
          top: br[1] + 'px'
        }
      }), /*#__PURE__*/_react.default.createElement("div", {
        key: ResizeDirection.BottomCenter,
        onTouchStart: onTouchStart(ResizeDirection.BottomCenter),
        onMouseDown: onMouseDown(ResizeDirection.BottomCenter),
        className: `${prefixCls}-resizer`,
        style: {
          left: br[0] - w / 2 + 'px',
          top: br[1] + 'px'
        }
      }), /*#__PURE__*/_react.default.createElement("div", {
        key: ResizeDirection.BottomLeft,
        onTouchStart: onTouchStart(ResizeDirection.BottomLeft),
        onMouseDown: onMouseDown(ResizeDirection.BottomLeft),
        className: `${prefixCls}-resizer`,
        style: {
          left: br[0] - w + 'px',
          top: br[1] + 'px'
        }
      }), /*#__PURE__*/_react.default.createElement("div", {
        key: ResizeDirection.MiddleLeft,
        onTouchStart: onTouchStart(ResizeDirection.MiddleLeft),
        onMouseDown: onMouseDown(ResizeDirection.MiddleLeft),
        className: `${prefixCls}-resizer`,
        style: {
          left: tl[0] + 'px',
          top: tl[1] + h / 2 + 'px'
        }
      }))
    };
  } else return {
    onMouseMove: () => {},
    onMouseUp: () => {},
    resizer: null
  };
};

// a  c  e
// b  d  f
// 0  0  1

const SketchPad = (props, ref) => {
  const {
    currentTool,
    setCurrentTool,
    userId,
    currentToolOption,
    operations,
    initialBackground,
    onChange,
    viewMatrix,
    onViewMatrixChange
  } = props;
  const refCanvas = (0, _react.useRef)(null);
  const refContext = (0, _react.useRef)(null);
  const refInput = (0, _react.useRef)(null);
  const lastTapRef = (0, _react.useRef)(0);
  const intl = (0, _reactIntl.useIntl)();
  const {
    prefixCls
  } = (0, _react.useContext)(_ConfigContext.default);
  const enableSketchPadContext = (0, _react.useContext)(_EnableSketchPadContext.default);
  const sketchpadPrefixCls = prefixCls + '-sketchpad';
  const [hoverOperationId, setHoverOperationId] = (0, _react.useState)(null);
  const [selectedOperation, setSelectedOperation] = (0, _react.useState)(null);
  const isControlled = !!operations;
  const scale = (0, _utils.extract_scale_from_matrix)(viewMatrix);
  const reducer = (0, _react.useCallback)(operationListReducer(isControlled, onChange), []);
  const [operationListState, operationListDispatch] = (0, _react.useReducer)(reducer, {
    queue: [],
    reduced: []
  });
  if (isControlled) {
    (0, _react.useEffect)(() => {
      operationListDispatch({
        type: 'replaceAll',
        payload: {
          queue: operations
        }
      });
    }, [operations.length]);
  }
  const refOperationListState = (0, _react.useRef)(operationListState);
  refOperationListState.current = operationListState;
  const saveGlobalTransform = () => {
    if (!refContext.current) return;
    const context = refContext.current;
    context.save();
    context.scale(DPR, DPR);
    const [a, b, c, d, e, f] = viewMatrix;
    context.transform(a, b, c, d, e, f);
  };
  const restoreGlobalTransform = () => {
    if (!refContext.current) return;
    const context = refContext.current;
    context.restore();
  };
  const renderOperations = operations => {
    if (!refContext.current || !refCanvas.current) return;
    const context = refContext.current;

    // clear canvas
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    saveGlobalTransform();
    const renderBackgroundOperation = operation => {
      // restoreGlobalTransform();
      (0, _ImageTool.drawBackgroundImage)(operation, refCanvas.current, context, viewMatrix, operation.id, () => {
        renderOperations(operations);
      });
      // saveGlobalTransform();
    };
    operations.forEach(operation => {
      const hover = (!selectedOperation || selectedOperation.id !== operation.id) && operation.id === hoverOperationId;
      switch (operation.tool) {
        case _Tool.default.Clear:
          restoreGlobalTransform();
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
          saveGlobalTransform();

          // background image should not be removed
          if (backgroundOperation) {
            renderBackgroundOperation(backgroundOperation);
          }
          break;
        case _Tool.default.Eraser:
          (0, _StrokeTool.drawEraser)(operation, context, hover);
          break;
        case _Tool.default.Stroke:
          (0, _StrokeTool.drawStroke)(operation, context, hover);
          break;
        case _Tool.default.Shape:
          (0, _ShapeTool.drawRectangle)(operation, context, hover);
          break;
        case _Tool.default.Text:
          (0, _TextTool.drawText)(operation, context, operation.pos);
          break;
        case _Tool.default.Background:
          backgroundOperation = operation;
          renderBackgroundOperation(backgroundOperation);
          break;
        case _Tool.default.Image:
          (0, _ImageTool.drawImage)(operation, context, operation.pos, operation.id, () => {
            renderOperations(operations);
          });
        default:
          break;
      }
    });

    // selected box
    if (selectedOperation) {
      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = '#d0d0d0';
      context.rect(selectedOperation.pos.x - SELECT_BOX_PADDING, selectedOperation.pos.y - SELECT_BOX_PADDING, selectedOperation.pos.w + 2 * SELECT_BOX_PADDING, selectedOperation.pos.h + 2 * SELECT_BOX_PADDING);
      context.stroke();
      context.closePath();
    }
    let backgroundOperation;
    if (initialBackground) {
      backgroundOperation = {
        id: `${BackgroundOperationId}/${initialBackground}`,
        userId,
        timestamp: Date.now(),
        tool: _Tool.default.Background,
        imageData: initialBackground
      };
      renderBackgroundOperation(backgroundOperation);
    }
    restoreGlobalTransform();
  };
  (0, _react.useEffect)(() => {
    const keydownHandler = evt => {
      const {
        keyCode
      } = evt;
      // key 'delete'
      if (keyCode === 8) {
        if (selectedOperation) {
          setSelectedOperation(null);
          handleCompleteOperation(_Tool.default.Remove, {
            operationId: selectedOperation.id
          });
        }
      } else if (keyCode === 27) {
        // key 'esc'
        setSelectedOperation(null);
      }
    };
    addEventListener('keydown', keydownHandler);
    return () => removeEventListener('keydown', keydownHandler);
  }, [selectedOperation && selectedOperation.id]);
  (0, _react.useEffect)(() => {
    const resizeHandler = (0, _lodash.debounce)(() => {
      const canvas = refCanvas.current;
      if (canvas && refOperationListState.current) {
        // high resolution canvas.
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * DPR;
        canvas.height = rect.height * DPR;
        (0, _ImageTool.clearBackgroundPostionCache)();
        renderOperations(refOperationListState.current.reduced);
      }
    }, 200);
    addEventListener('resize', resizeHandler);
    return () => removeEventListener('resize', resizeHandler);
  }, []);

  // disable default scrolling on mobile device.
  // refer: https://stackoverflow.com/questions/49500339/cant-prevent-touchmove-from-scrolling-window-on-ios
  (0, _react.useEffect)(() => {
    const handler = e => {
      // only disable scroll when interact with this board.
      if (lastTapRef.current) {
        e.preventDefault();
      }
      onTouchMoveRef.current && onTouchMoveRef.current(e);
    };
    document.addEventListener('touchmove', handler, {
      passive: false
    });
    return () => {
      document.removeEventListener('touchmove', handler);
    };
  }, []);
  const handleCompleteOperation = (tool, data, pos) => {
    if (!tool) {
      renderOperations(operationListState.reduced);
      return;
    }

    // coerce update.
    const isLazy = tool === _Tool.default.LazyUpdate;
    tool = isLazy ? _Tool.default.Update : tool;
    const message = Object.assign({}, data, {
      id: (0, _uuid.v4)(),
      userId,
      timestamp: Date.now(),
      pos: pos,
      tool: tool
    });
    operationListDispatch({
      type: 'add',
      payload: {
        operation: message,
        isLazy
      }
    });
  };
  const {
    onMouseMove: onMouseResizeMove,
    onMouseUp: onMouseResizeUp,
    resizer
  } = useResizeHandler(selectedOperation, viewMatrix, operationListState.queue, operationListDispatch, setSelectedOperation, handleCompleteOperation, refCanvas, sketchpadPrefixCls);
  const onMouseDown = e => {
    if (!refCanvas.current) return null;
    if (!enableSketchPadContext.enable) return null;
    const [x, y] = (0, _utils.mapClientToCanvas)(e, refCanvas.current, viewMatrix);
    switch (currentTool) {
      case _Tool.default.Select:
        (0, _SelectTool.onSelectMouseDown)(e, x, y, scale, operationListState, viewMatrix, setSelectedOperation);
        break;
      case _Tool.default.Stroke:
        (0, _StrokeTool.onStrokeMouseDown)(x, y, currentToolOption);
        break;
      case _Tool.default.Eraser:
        (0, _StrokeTool.onStrokeMouseDown)(x, y, {
          ...currentToolOption,
          strokeSize: _Tool.defaultToolOption.strokeSize * 2 / scale,
          strokeColor: 'rgba(255, 255, 255, 1)'
        });
        break;
      case _Tool.default.Shape:
        (0, _ShapeTool.onShapeMouseDown)(x, y, currentToolOption);
        break;
      default:
        break;
    }
  };
  const onTouchStart = e => {
    if (e.touches.length === 1) {
      if (e.timeStamp - lastTapRef.current < 300) {
        onDoubleClick(e.touches[0]);
      } else {
        onMouseDown(e.touches[0]);
      }
    }
    lastTapRef.current = e.timeStamp;
  };
  const onDoubleClick = e => {
    if (!refCanvas.current) return null;
    const [x, y] = (0, _utils.mapClientToCanvas)(e, refCanvas.current, viewMatrix);
    switch (currentTool) {
      case _Tool.default.Select:
        (0, _SelectTool.onSelectMouseDoubleClick)(x, y, scale, operationListState, handleCompleteOperation, viewMatrix, refInput, refCanvas, intl);
        setSelectedOperation(null);
        break;
      default:
        setCurrentTool(_Tool.default.Select);
        break;
    }
  };
  const onMouseMove = e => {
    if (!refCanvas.current) return null;
    if (!enableSketchPadContext.enable) return null;
    onMouseResizeMove(e);
    const [x, y] = (0, _utils.mapClientToCanvas)(e, refCanvas.current, viewMatrix);
    switch (currentTool) {
      case _Tool.default.Select:
        (0, _SelectTool.onSelectMouseMove)(e, x, y, scale, operationListState, selectedOperation, onViewMatrixChange, setHoverOperationId, handleCompleteOperation, operationListDispatch, setSelectedOperation);
        break;
      case _Tool.default.Eraser:
      case _Tool.default.Stroke:
        {
          saveGlobalTransform();
          refContext.current && (0, _StrokeTool.onStrokeMouseMove)(x, y, refContext.current);
          restoreGlobalTransform();
          break;
        }
      case _Tool.default.Shape:
        {
          renderOperations(operationListState.reduced);
          saveGlobalTransform();
          refContext.current && (0, _ShapeTool.onShapeMouseMove)(x, y, refContext.current);
          restoreGlobalTransform();
          break;
        }
      default:
        break;
    }
  };
  const onTouchMove = e => {
    if (e.touches.length === 1) {
      onMouseMove(e.touches[0]);
    }
  };
  const onTouchMoveRef = (0, _react.useRef)(onTouchMove);
  (0, _react.useEffect)(() => {
    onTouchMoveRef.current = onTouchMove;
  }, [onTouchMove]);
  const onMouseUp = e => {
    if (!refCanvas.current) return null;
    if (!enableSketchPadContext.enable) return null;
    onMouseResizeUp(e);
    switch (currentTool) {
      case _Tool.default.Select:
        (0, _SelectTool.onSelectMouseUp)(operationListDispatch);
        break;
      case _Tool.default.Eraser:
        {
          refContext.current && (0, _StrokeTool.onStrokeMouseUp)(setCurrentTool, handleCompleteOperation, _Tool.default.Eraser);
          break;
        }
      case _Tool.default.Stroke:
        {
          refContext.current && (0, _StrokeTool.onStrokeMouseUp)(setCurrentTool, handleCompleteOperation);
          break;
        }
      case _Tool.default.Shape:
        {
          const [x, y] = (0, _utils.mapClientToCanvas)(e, refCanvas.current, viewMatrix);
          refContext.current && (0, _ShapeTool.onShapeMouseUp)(x, y, setCurrentTool, handleCompleteOperation);
          break;
        }
      case _Tool.default.Text:
        {
          (0, _TextTool.onTextMouseUp)({
            clientX: e.clientX + 2,
            clientY: e.clientY - currentToolOption.textSize / 2
          }, currentToolOption, scale, refInput, refCanvas, intl);
          break;
        }
      default:
        break;
    }
  };
  const onTouchEnd = e => {
    if (e.changedTouches.length === 1) {
      onMouseUp(e.changedTouches[0]);
    }
    lastTapRef.current = 0;
  };
  const onWheel = evt => {
    if (_utils.isMobileDevice && !evt.forceWheel) return;
    evt.stopPropagation && evt.stopPropagation();
    const {
      deltaY,
      ctrlKey
    } = evt;
    const [a, b, c, d, e, f] = viewMatrix;
    let newScale = a + (ctrlKey ? -deltaY : deltaY) / 100;
    newScale = Math.max(Math.min(newScale, _Tool.MAX_SCALE), _Tool.MIN_SCALE);
    if (refCanvas.current) {
      const pos = (0, _utils.mapClientToCanvas)(evt, refCanvas.current, viewMatrix);
      const scaleChange = newScale - a;
      onViewMatrixChange([newScale, b, c, newScale, e - pos[0] * scaleChange, f - pos[1] * scaleChange]);
    }
    setSelectedOperation(null);
  };
  const onRemoveOperation = evt => {
    evt.preventDefault();
    evt.stopPropagation();
    if (selectedOperation) {
      setSelectedOperation(null);
      handleCompleteOperation(_Tool.default.Remove, {
        operationId: selectedOperation.id
      });
    }
  };
  (0, _react.useEffect)(() => {
    const canvas = refCanvas.current;

    // high resolution canvas.
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * DPR;
    canvas.height = rect.height * DPR;
    refContext.current = canvas.getContext('2d');
    canvas.oncontextmenu = e => {
      e.preventDefault();
    };
  }, []);
  (0, _react.useEffect)(() => {
    renderOperations(operationListState.reduced);
  }, [operationListState.reduced, viewMatrix, hoverOperationId, selectedOperation, initialBackground, refContext.current]);
  const canvasStyle = {};
  if (currentTool === _Tool.default.Stroke) {
    canvasStyle.cursor = `url(${_sketch_stroke_cursor.default}) 0 14, crosshair`;
  } else if (currentTool === _Tool.default.Shape) {
    canvasStyle.cursor = `crosshair`;
  } else if (currentTool === _Tool.default.Eraser) {
    canvasStyle.cursor = `url(${_sketch_eraser_cursor.default}) 10 10, grab`;
  } else if (currentTool === _Tool.default.Text) {
    canvasStyle.cursor = `text`;
  }
  (0, _react.useImperativeHandle)(ref, () => {
    return {
      selectImage: image => {
        if (image && refCanvas.current) {
          (0, _ImageTool.onImageComplete)(image, refCanvas.current, viewMatrix, handleCompleteOperation, {
            imageSize: "contain"
          });
        }
      },
      selectBackgroundImage: image => {
        if (image && refCanvas.current) {
          (0, _ImageTool.onBackgroundImageComplete)(image, refCanvas.current, viewMatrix, handleCompleteOperation);
        }
      },
      removeBackgroundImage: () => {
        if (refCanvas.current) {
          handleCompleteOperation(_Tool.default.RemoveBackground);
        }
      },
      undo: () => {
        setSelectedOperation(null);
        if (operationListState.reduced.length) {
          handleCompleteOperation(_Tool.default.Undo);
        }
      },
      redo: () => {
        setSelectedOperation(null);
        let isRedoable = 0;
        const queue = operationListState.queue;
        for (let i = queue.length - 1; i >= 0; i--) {
          if (queue[i].tool === _Tool.default.Undo) {
            isRedoable++;
          } else if (queue[i].tool === _Tool.default.Redo) {
            isRedoable--;
          } else {
            break;
          }
        }
        if (isRedoable > 0) {
          handleCompleteOperation(_Tool.default.Redo);
        }
      },
      clear: () => {
        setSelectedOperation(null);
        handleCompleteOperation(_Tool.default.Clear);
      },
      save: handleSave => {
        if (refCanvas.current && refContext.current) {
          const canvas = refCanvas.current;
          const w = canvas.width;
          const h = canvas.height;
          const context = refContext.current;
          context.globalCompositeOperation = 'destination-over';
          context.fillStyle = '#fff';
          context.fillRect(0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/png');
          if (handleSave) {
            handleSave({
              canvas,
              dataUrl
            });
          } else {
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'sketch.png';
            a.click();
          }
        }
      },
      getCanvas: () => {
        return refCanvas.current;
      }
    };
  });
  (0, _gesture.useZoomGesture)(refCanvas);
  const bindPinch = (0, _reactUseGesture.usePinch)(state => {
    const {
      ctrlKey,
      origin,
      delta
    } = state;
    if (origin) {
      onWheel({
        deltaY: delta[0],
        ctrlKey,
        clientX: origin[0],
        clientY: origin[1],
        forceWheel: true
      });
    }
  });
  const bindWheel = (0, _reactUseGesture.useWheel)(state => {
    const {
      ctrlKey,
      event,
      delta,
      last
    } = state;
    if (event && !last && 'clientX' in event) {
      onWheel({
        deltaY: delta[1] / 4,
        ctrlKey,
        clientX: event.clientX + 0,
        clientY: event.clientY + 0,
        forceWheel: true
      });
    }
  });
  let settingMenu = null;
  let removeButton = null;
  if (selectedOperation) {
    let content = null;
    switch (selectedOperation.tool) {
      case _Tool.default.Stroke:
        content = (0, _StrokeTool.useStrokeDropdown)({
          currentToolOption: {
            strokeSize: selectedOperation.size,
            strokeColor: selectedOperation.color
          },
          setCurrentToolOption: option => {
            const data = {
              color: option.strokeColor,
              size: option.strokeSize
            };
            handleCompleteOperation(_Tool.default.Update, {
              operationId: selectedOperation.id,
              data
            });
            setSelectedOperation({
              ...selectedOperation,
              ...data
            });
          },
          setCurrentTool: () => {},
          prefixCls
        });
        break;
      case _Tool.default.Shape:
        content = (0, _ShapeTool.useShapeDropdown)({
          currentToolOption: {
            shapeType: selectedOperation.type,
            shapeBorderColor: selectedOperation.color,
            shapeBorderSize: selectedOperation.size
          },
          setCurrentToolOption: option => {
            const data = {
              type: option.shapeType,
              color: option.shapeBorderColor,
              size: option.shapeBorderSize
            };
            handleCompleteOperation(_Tool.default.Update, {
              operationId: selectedOperation.id,
              data
            });
            setSelectedOperation({
              ...selectedOperation,
              ...data
            });
          },
          setCurrentTool: () => {},
          prefixCls
        });
        break;
      case _Tool.default.Text:
        {
          const textOperation = selectedOperation;
          content = (0, _TextTool.useTextDropdown)({
            currentToolOption: {
              textSize: textOperation.size,
              textColor: textOperation.color
            },
            setCurrentToolOption: option => {
              const data = {
                color: option.textColor,
                size: option.textSize
              };
              if (refContext.current && option.textSize !== textOperation.size) {
                const context = refContext.current;

                // font size has changed, need to update pos
                context.font = `${option.textSize}px ${_TextTool.font}`;
                context.textBaseline = 'alphabetic';
                // measureText does not support multi-line
                const lines = textOperation.text.split('\n');
                data.pos = {
                  ...selectedOperation.pos,
                  w: Math.max(...lines.map(line => context.measureText(line).width)),
                  h: lines.length * option.textSize
                };
              }
              handleCompleteOperation(_Tool.default.Update, {
                operationId: selectedOperation.id,
                data
              });

              // @ts-ignore
              setSelectedOperation({
                ...selectedOperation,
                ...data
              });
            },
            setCurrentTool: () => {},
            prefixCls,
            intl
          });
          break;
        }
      default:
        break;
    }
    const resultRect = {
      xMin: selectedOperation.pos.x,
      xMax: selectedOperation.pos.x + selectedOperation.pos.w,
      yMin: selectedOperation.pos.y,
      yMax: selectedOperation.pos.y + selectedOperation.pos.h
    };
    const [a, b, c, d, e, f] = viewMatrix;
    const selectPadding = Math.max(_SelectTool.SELECT_PADDING * 1 / scale || 0, _SelectTool.SELECT_PADDING);
    const left = resultRect.xMin;
    const top = resultRect.yMax + selectPadding;
    const menuStyle = {
      position: 'absolute',
      left: a * left + c * top + e,
      top: b * left + d * top + f
    };
    settingMenu = /*#__PURE__*/_react.default.createElement("div", {
      style: menuStyle,
      onMouseDown: stopPropagation
    }, content);
    const removeX = selectedOperation.tool === _Tool.default.Text ? resultRect.xMax - 5 / scale : resultRect.xMax - 7 / scale;
    const removeY = selectedOperation.tool === _Tool.default.Text ? resultRect.yMin - 11 / scale : resultRect.yMin - 9 / scale;
    const removeStyle = {
      position: 'absolute',
      left: a * removeX + c * removeY + e,
      top: b * removeX + d * removeY + f,
      background: 'white',
      lineHeight: '16px',
      fontSize: '16px',
      borderRadius: '50%',
      cursor: 'pointer',
      color: '#f45b6c'
    };
    removeButton = /*#__PURE__*/_react.default.createElement("div", {
      style: removeStyle,
      onMouseDown: onRemoveOperation,
      onTouchStart: onRemoveOperation
    }, /*#__PURE__*/_react.default.createElement(_Icon.default, {
      type: "close-circle"
    }));
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `${sketchpadPrefixCls}-container`,
    onMouseDown: onMouseDown,
    onMouseMove: onMouseMove,
    onMouseLeave: onMouseUp,
    onTouchStart: onTouchStart,
    onTouchEnd: onTouchEnd,
    onMouseUp: onMouseUp
  }, /*#__PURE__*/_react.default.createElement("canvas", _extends({
    ref: refCanvas,
    onDoubleClick: onDoubleClick,
    className: `${sketchpadPrefixCls}-canvas`,
    style: canvasStyle
  }, bindPinch(), bindWheel())), /*#__PURE__*/_react.default.createElement("div", {
    ref: refInput,
    contentEditable: true,
    style: {
      fontSize: `${12 * scale}px`
    },
    className: `${sketchpadPrefixCls}-textInput`,
    onBlur: () => {
      (0, _TextTool.onTextComplete)(refInput, refCanvas, viewMatrix, scale, handleCompleteOperation, setCurrentTool);
    }
  }), settingMenu, removeButton, resizer);
};
var _default = exports.default = /*#__PURE__*/(0, _react.forwardRef)(SketchPad);