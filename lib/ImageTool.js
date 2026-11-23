"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onImageComplete = exports.onBackgroundImageComplete = exports.drawImage = exports.drawBackgroundImage = exports.clearBackgroundPostionCache = void 0;
var _Tool = _interopRequireDefault(require("./enums/Tool"));
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const _cacheImgs = {};
let _cacheBackgroundPosition = {};
const clearBackgroundPostionCache = () => {
  _cacheBackgroundPosition = {};
};
exports.clearBackgroundPostionCache = clearBackgroundPostionCache;
const drawImage = (item, context, pos, id, rerender) => {
  if (!_cacheImgs[id]) {
    fetch(item.imageData).then(res => res.blob()).then(blob => {
      return new Promise((resolve, reject) => {
        let img = document.createElement('img');
        img.addEventListener('load', function () {
          resolve(this);
        });
        img.src = URL.createObjectURL(blob);
      });
    }).then(imageBitmap => {
      _cacheImgs[id] = imageBitmap;
      rerender();
    });
  } else {
    context.drawImage(_cacheImgs[id], pos.x, pos.y, pos.w, pos.h);
  }
};
exports.drawImage = drawImage;
const drawBackgroundImage = (item, canvas, context, viewMatrix, id, rerender) => {
  const originalCompositeOperation = context.globalCompositeOperation;
  let position = _cacheBackgroundPosition[item.imageData];
  if (position) {
    context.globalCompositeOperation = "destination-over";
    drawImage(item, context, position, id, rerender);
    context.globalCompositeOperation = originalCompositeOperation;
  } else {
    onImageComplete(item.imageData, canvas, viewMatrix, (_tool, _data, pos) => {
      position = pos;
      _cacheBackgroundPosition[item.imageData] = pos;
      context.globalCompositeOperation = "destination-over";
      rerender();
      context.globalCompositeOperation = originalCompositeOperation;
    }, {
      imageSize: "contain"
    });
  }
};
exports.drawBackgroundImage = drawBackgroundImage;
const onImageComplete = (data, canvas, viewMatrix, handleCompleteOperation, options) => {
  const image = new Image();
  image.onload = () => {
    const {
      top,
      left
    } = canvas.getBoundingClientRect();
    const imageWidth = image.width;
    const imageHeight = image.height;
    const offsetWidth = canvas.offsetWidth;
    const offsetHeight = canvas.offsetHeight;
    const imageRatio = imageWidth / imageHeight;
    const canvasRatio = offsetWidth / offsetHeight;
    let targetImageWidth = imageWidth;
    let targetImageHeight = imageHeight;
    const clientPos = {
      clientX: 0,
      clientY: 0
    };
    const clientPosEnd = {
      clientX: 0,
      clientY: 0
    };
    if (options?.imageSize == "contain") {
      if (imageRatio >= canvasRatio) {
        targetImageWidth = offsetWidth;
        targetImageHeight = targetImageWidth / imageRatio;
      } else {
        targetImageHeight = offsetHeight;
        targetImageWidth = targetImageHeight * imageRatio;
      }
      clientPos.clientX = left + (offsetWidth / 2 - targetImageWidth / 2);
      clientPos.clientY = top + (offsetHeight / 2 - targetImageHeight / 2);
      clientPosEnd.clientX = left + (offsetWidth / 2 + targetImageWidth / 2);
      clientPosEnd.clientY = top + (offsetHeight / 2 + targetImageHeight / 2);
    } else {
      clientPos.clientX = left + (offsetWidth / 2 - targetImageWidth / 4);
      clientPos.clientY = top + (offsetHeight / 2 - targetImageHeight / 4);
      clientPosEnd.clientX = left + (offsetWidth / 2 + targetImageWidth / 4);
      clientPosEnd.clientY = top + (offsetHeight / 2 + targetImageHeight / 4);
    }
    const pos = (0, _utils.mapClientToCanvas)(clientPos, canvas, viewMatrix);
    const posEnd = (0, _utils.mapClientToCanvas)(clientPosEnd, canvas, viewMatrix);
    const posInfo = {
      x: pos[0],
      y: pos[1],
      w: posEnd[0] - pos[0],
      h: posEnd[1] - pos[1]
    };
    handleCompleteOperation(_Tool.default.Image, {
      imageData: data
    }, posInfo);
  };
  image.src = data;
};
exports.onImageComplete = onImageComplete;
const onBackgroundImageComplete = (data, canvas, viewMatrix, handleCompleteOperation) => {
  handleCompleteOperation(_Tool.default.Background, {
    imageData: data
  });
};
exports.onBackgroundImageComplete = onBackgroundImageComplete;