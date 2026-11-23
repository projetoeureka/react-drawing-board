"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _enUS = _interopRequireDefault(require("./en-US"));
var _zhCN = _interopRequireDefault(require("./zh-CN"));
var _trTR = _interopRequireDefault(require("./tr-TR"));
var _ptBR = _interopRequireDefault(require("./pt-BR"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = {
  messages: {
    ['en-US']: _enUS.default,
    ['zh-CN']: _zhCN.default,
    ['tr-TR']: _trTR.default,
    ['en']: _enUS.default,
    ['zh']: _zhCN.default,
    ['tr']: _enUS.default,
    ['pt-BR']: _ptBR.default
  }
};