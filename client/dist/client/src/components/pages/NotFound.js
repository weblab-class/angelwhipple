"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("../pages/Login.css");
const router_1 = require("@reach/router");
const NotFound = (props) => {
    const navigate = (0, router_1.useNavigate)();
    const route = (path) => {
        navigate(path);
    };
    return (react_1.default.createElement("div", { className: "centered default-container" },
        react_1.default.createElement("h1", null, "Sorry, you've reached a dead end."),
        react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => route("/") }, "Take me back")));
};
exports.default = NotFound;
