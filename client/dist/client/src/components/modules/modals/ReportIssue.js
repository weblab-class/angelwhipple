"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
require("./Modal.css");
const md_1 = require("react-icons/md");
const fa_1 = require("react-icons/fa");
const Dropdown_1 = __importDefault(require("../Dropdown"));
require("../profile/EditModal.css");
const Report = (props) => {
    const [display, setDisplay] = (0, react_1.useState)(false);
    const [category, setCategory] = (0, react_1.useState)("");
    const CATEGORIES = ["BUG", "ACCOUNTS/LOGIN", "SAFETY", "HARASSMENT"];
    (0, react_1.useEffect)(() => {
        console.log(`Category changed: ${category}`);
    }, [category]);
    return (react_1.default.createElement(react_1.default.Fragment, null, display ? (react_1.default.createElement("div", { className: "modal-overlay" },
        react_1.default.createElement("div", { className: "modal-container" },
            react_1.default.createElement("div", { className: "modal-content" },
                react_1.default.createElement("p", null,
                    react_1.default.createElement("strong", null, "Report an issue")),
                react_1.default.createElement("label", null,
                    "Category",
                    " ",
                    react_1.default.createElement("div", { className: "dropdown-container" },
                        react_1.default.createElement("input", { className: "dropdown-input", type: "text", value: category, readOnly: true }),
                        react_1.default.createElement(Dropdown_1.default, { options: CATEGORIES, setter: setCategory })),
                    react_1.default.createElement(fa_1.FaChevronDown, { className: "default-icon", onClick: () => {
                            const dropdown = document.getElementById("dropdown-content");
                            dropdown.style.display = dropdown.style.display === "none" ? "flex" : "none";
                        } })),
                react_1.default.createElement("label", null,
                    "Description ",
                    react_1.default.createElement("textarea", { className: "multiline-input" })),
                react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => setDisplay(false) }, "Close"))))) : (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(md_1.MdOutlineReportProblem, { className: "report-icon u-pointer", onClick: () => setDisplay(true) })))));
};
exports.default = Report;
