"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./Modal.css");
const Ad = (props) => {
    return (react_1.default.createElement("div", { className: "modal-overlay" },
        react_1.default.createElement("div", { className: "modal-container" },
            react_1.default.createElement("div", { className: "modal-content" },
                react_1.default.createElement("h4", null, "Subscribe to Crash Premium!"),
                react_1.default.createElement("p", null,
                    react_1.default.createElement("strong", null, "For only $5/mo, unlock access to platform features such as:")),
                react_1.default.createElement("ul", null,
                    react_1.default.createElement("li", null, "Roommate Finder: create & request to join verified roommate groups"),
                    react_1.default.createElement("li", null, "View active subleasings on Crash"),
                    react_1.default.createElement("li", null, "Sublease your unit to other Crash Premium users")),
                react_1.default.createElement("div", { className: "action-container" },
                    react_1.default.createElement("a", { href: "https://buy.stripe.com/14k15ZcKH5G40w0dQR", target: "_blank" },
                        react_1.default.createElement("button", { className: "default-button u-pointer" }, "Purchase")),
                    react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => props.setDisplay(false) }, "Not today"))))));
};
exports.default = Ad;
