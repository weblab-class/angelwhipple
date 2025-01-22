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
const cg_1 = require("react-icons/cg");
const md_1 = require("react-icons/md");
const md_2 = require("react-icons/md");
const md_3 = require("react-icons/md");
require("./CommunityMenu.css");
var MenuAction;
(function (MenuAction) {
    MenuAction[MenuAction["DETAILS"] = 0] = "DETAILS";
    MenuAction[MenuAction["MANAGE"] = 1] = "MANAGE";
    MenuAction[MenuAction["ANNOUCEMENTS"] = 2] = "ANNOUCEMENTS";
    MenuAction[MenuAction["EXPLORE"] = 3] = "EXPLORE";
    MenuAction[MenuAction["TOGGLE"] = 4] = "TOGGLE";
})(MenuAction || (MenuAction = {}));
const CommunityMenu = (props) => {
    const [hoverExplore, setHoverExplore] = (0, react_1.useState)(false);
    const [hoverManage, setHoverManage] = (0, react_1.useState)(false);
    const [hoverAnnounce, setHoverAnnounce] = (0, react_1.useState)(false);
    const [hoverDetails, setHoverDetails] = (0, react_1.useState)(false);
    return (react_1.default.createElement("div", { className: "menu-options-container" },
        react_1.default.createElement("button", { id: "border", title: "Explore", className: `${props.menuAction === MenuAction.EXPLORE
                ? `menu-option-sel reg-sel u-pointer`
                : `menu-option reg u-pointer`}`, onMouseOver: (event) => {
                setHoverExplore(true);
            }, onMouseOut: (event) => {
                setHoverExplore(false);
            }, onClick: (event) => {
                props.setMenuAction(MenuAction.EXPLORE);
            } },
            react_1.default.createElement(md_3.MdExplore, { id: "icon", className: `${hoverExplore || props.menuAction === MenuAction.EXPLORE
                    ? `menu-icon-sel icon-reg-sel`
                    : `menu-icon icon-reg`}` })),
        react_1.default.createElement("button", { title: "Messaging", className: `${props.menuAction === MenuAction.ANNOUCEMENTS
                ? `menu-option-sel inv-sel u-pointer`
                : `menu-option inv u-pointer`}`, onMouseOver: (event) => {
                setHoverAnnounce(true);
            }, onMouseOut: (event) => {
                setHoverAnnounce(false);
            }, onClick: (event) => {
                props.setMenuAction(MenuAction.ANNOUCEMENTS);
            } },
            react_1.default.createElement(md_1.MdOutlineAnnouncement, { className: `${hoverAnnounce || props.menuAction === MenuAction.ANNOUCEMENTS
                    ? `menu-icon-sel icon-inv-sel`
                    : `menu-icon icon-inv`}` })),
        react_1.default.createElement("button", { title: "Details", className: `${props.menuAction === MenuAction.DETAILS
                ? `menu-option-sel reg-sel u-pointer`
                : `menu-option reg u-pointer`}`, onMouseOver: (event) => {
                setHoverDetails(true);
            }, onMouseOut: (event) => {
                setHoverDetails(false);
            }, onClick: (event) => {
                props.setMenuAction(MenuAction.DETAILS);
            } },
            react_1.default.createElement(cg_1.CgDetailsMore, { className: `${hoverDetails || props.menuAction === MenuAction.DETAILS
                    ? `menu-icon-sel icon-reg-sel`
                    : `menu-icon icon-reg`}` })),
        react_1.default.createElement("button", { title: "Manage", className: `${props.menuAction === MenuAction.MANAGE
                ? `menu-option-sel inv-sel u-pointer`
                : `menu-option inv u-pointer`}`, onMouseOver: (event) => {
                setHoverManage(true);
            }, onMouseOut: (event) => {
                setHoverManage(false);
            }, onClick: (event) => {
                props.setMenuAction(MenuAction.MANAGE);
            } },
            react_1.default.createElement(md_2.MdManageAccounts, { className: `${hoverManage || props.menuAction === MenuAction.MANAGE
                    ? `menu-icon-sel icon-inv-sel`
                    : `menu-icon icon-inv`}` }))));
};
exports.default = CommunityMenu;
