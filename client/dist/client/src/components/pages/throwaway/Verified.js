"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Verified = (props) => {
    return (react_1.default.createElement("div", { className: "centered default-container" },
        react_1.default.createElement("p", null, "You've successfully verified your account! Feel free to close this window.")));
};
exports.default = Verified;
