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
const utilities_1 = require("../../../utilities");
require("./MemberEntry.css");
const rx_1 = require("react-icons/rx");
const io5_1 = require("react-icons/io5");
const bi_1 = require("react-icons/bi");
const blank_jpg_1 = __importDefault(require("../../../assets/blank.jpg"));
const Member = (props) => {
    const [focused, setFocused] = (0, react_1.useState)(false);
    const [img, setImg] = (0, react_1.useState)(blank_jpg_1.default);
    (0, react_1.useEffect)(() => {
        (0, utilities_1.get)("/api/user/loadphoto", { userId: props.user._id }).then((res) => {
            if (res.valid) {
                const buffer = res.buffer.Body.data;
                const base64Image = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
                const src = `data:image/jpeg;base64,${base64Image}`;
                setImg(src);
            }
        });
    }, []);
    return (react_1.default.createElement("div", { className: "entry-container", onMouseOver: (event) => setFocused(true), onMouseOut: (event) => setFocused(false) },
        react_1.default.createElement("img", { src: img, className: "member-img" }),
        props.user._id === props.community.owner ? (react_1.default.createElement("div", { className: "u-flex u-alignCenter" },
            react_1.default.createElement(bi_1.BiSolidCrown, { className: `${focused ? `icon-sel` : `crown-icon`}` }),
            react_1.default.createElement("p", null, props.user.name !== undefined ? props.user.name : props.user.username))) : (react_1.default.createElement("div", { className: "u-flex u-alignCenter" },
            react_1.default.createElement("p", null, props.user.name !== undefined ? props.user.name : props.user.username))),
        props.user.verified ? (react_1.default.createElement("div", { className: "u-flex u-alignCenter" },
            react_1.default.createElement(io5_1.IoCheckmarkSharp, { className: `${focused ? `icon-sel` : `check-icon`}` }),
            " ",
            "Verified")) : (react_1.default.createElement("div", { className: "u-flex u-alignCenter" },
            react_1.default.createElement(rx_1.RxCross2, { className: `${focused ? `icon-sel` : `x-icon`}` }),
            " Unverified"))));
};
exports.default = Member;
