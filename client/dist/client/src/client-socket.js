"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSocketConnect = exports.socket = void 0;
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const endpoint = `${window.location.hostname}:${window.location.port}`;
exports.socket = socket_io_client_1.default.io(endpoint);
const onSocketConnectCallbacks = [];
exports.socket.on("connect", () => {
    console.log("Socket connected");
    onSocketConnectCallbacks.forEach((callback) => callback());
});
function onSocketConnect(callback) {
    onSocketConnectCallbacks.push(callback);
}
exports.onSocketConnect = onSocketConnect;
