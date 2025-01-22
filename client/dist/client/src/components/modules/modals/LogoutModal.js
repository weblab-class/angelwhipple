"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_socket_1 = require("../../../client-socket");
const utilities_1 = require("../../../utilities");
const router_1 = require("@reach/router");
const google_1 = require("@react-oauth/google");
require("./Modal.css");
const Logout = (props) => {
    const navigate = (0, router_1.useNavigate)();
    const route = (path) => {
        navigate(path);
    };
    return (react_1.default.createElement("div", { className: "modal-overlay" },
        react_1.default.createElement("div", { className: "modal-container" },
            react_1.default.createElement("div", { className: "modal-content" },
                react_1.default.createElement("p", null, "Are you sure you would like to logout?"),
                react_1.default.createElement("div", { className: "action-container" },
                    react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => {
                            props.setUserId(undefined);
                            (0, google_1.googleLogout)();
                            (0, utilities_1.post)("/api/logout").then((res) => {
                                client_socket_1.socket.emit("nav toggle all", {});
                                props.setLogout(false);
                                route("/");
                            });
                        } }, "yes"),
                    react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => props.setLogout(false) }, "no"))))));
};
exports.default = Logout;
