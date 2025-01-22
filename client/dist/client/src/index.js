"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const App_1 = __importDefault(require("./components/App"));
// renders React Component "Root" into the DOM element with ID "root"
react_dom_1.default.render(react_1.default.createElement(App_1.default, null), document.getElementById("root"));
// allows for live updating
if (module.hot !== undefined) {
    module.hot.accept();
}
