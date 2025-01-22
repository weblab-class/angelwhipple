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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const client_socket_1 = require("../../../client-socket");
require("./InfoModal.css");
const InfoModal = (props) => {
    const [htmlContent, setHtmlContent] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        setHtmlContent({ __html: props.info });
    }, []);
    return (react_1.default.createElement("div", { className: "modal-overlay" },
        react_1.default.createElement("div", { className: "modal-container" },
            react_1.default.createElement("div", { className: "modal-content" },
                react_1.default.createElement("h4", null, props.header),
                react_1.default.createElement("div", { className: "info-textbox", dangerouslySetInnerHTML: htmlContent }),
                react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => {
                        props.setDisplay({ show: false });
                        if (props.setAltDisplay)
                            props.setAltDisplay(true);
                        if (props.header === "Crash Privacy Policy")
                            client_socket_1.socket.emit("privacy policy");
                        if (props.header === "Crash Terms of Service")
                            client_socket_1.socket.emit("terms of service");
                    } }, "I understand")))));
};
exports.default = InfoModal;
