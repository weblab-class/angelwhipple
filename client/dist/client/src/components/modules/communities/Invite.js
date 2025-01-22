"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("../../pages/Login.css");
require("./Invite.css");
require("../modals/Modal.css");
const Invite = (props) => {
    const newest = props.newCommunity;
    const joinLink = `http://localhost:5050/api/community/join?code=${newest.code}`;
    const subject = `Join ${newest.name} on Crash!`;
    const message = `I just launched a new community called ${newest.name} on Crash! Create an account and join with community code ${newest.code}, or follow this link: ${joinLink}`;
    return (react_1.default.createElement("div", { className: "centered default-container" },
        react_1.default.createElement("h2", null,
            "Invite users to join ",
            newest.name,
            " on Crash!"),
        react_1.default.createElement("h1", { title: "Copy invite code", className: "u-pointer", onClick: (event) => {
                navigator.clipboard.writeText(newest.code.toString()); // copy invite code to clipboard
            } }, newest.code),
        react_1.default.createElement("div", { className: "options-container" },
            react_1.default.createElement("button", { className: "login-button u-pointer", onClick: (event) => {
                    window.open(`mailto:?subject=${subject}&body=${message}`); // open mail with default msg containing unique invite code/link
                } }, "Email invite code"),
            react_1.default.createElement("button", { className: "login-button u-pointer", onClick: (event) => { } }, "Message Crash user")),
        react_1.default.createElement("p", { className: "text-option u-pointer", onClick: (event) => props.setShowInvite(false) }, "Maybe later")));
};
exports.default = Invite;
