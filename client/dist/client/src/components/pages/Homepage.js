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
require("./Homepage.css");
const Login_1 = __importDefault(require("./Login"));
const CreateAccount_1 = __importDefault(require("../modules/accounts/CreateAccount"));
const Merge_1 = __importDefault(require("../modules/accounts/Merge"));
const react_lottie_player_1 = require("@lottiefiles/react-lottie-player");
const LogoutModal_1 = __importDefault(require("../modules/modals/LogoutModal"));
const Homepage = (props) => {
    const { handleLogin, handleLogout } = props;
    const [create, setCreate] = (0, react_1.useState)(false);
    const [login, setLogin] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)({ valid: false });
    const [logout, setLogout] = (0, react_1.useState)(false);
    const [mobile, setMobile] = (0, react_1.useState)(false);
    const detectMobile = () => {
        const devices = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i,
        ];
        return devices.some((device) => {
            return navigator.userAgent.match(device);
        });
        // let isMobile = window.matchMedia;
        // if (isMobile) {
        //   let match_mobile = isMobile("(pointer:coarse)");
        //   return match_mobile.matches;
        // }
        // return false;
    };
    (0, react_1.useEffect)(() => {
        const mobileDevice = detectMobile();
        console.log(`Mobile: ${mobileDevice}`);
        if (mobileDevice)
            setMobile(true);
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const invited = urlParams.get("joined_community");
        const communityCode = urlParams.get("community_code");
        console.log(`From invitation link: ${invited}`);
        if (invited) {
            props.setInvited(true);
            props.setJoinCode(communityCode);
        }
    }, []);
    return (react_1.default.createElement("div", { className: "background" }, props.userId ? (react_1.default.createElement(react_1.default.Fragment, null,
        props.consolidate ? (react_1.default.createElement(Merge_1.default, { userId: props.userId, extraProfiles: props.extraProfiles, chosenProfiles: props.chosenProfiles, setConsolidate: props.setConsolidate })) : logout ? (react_1.default.createElement(LogoutModal_1.default, { setUserId: props.setUserId, setLogout: setLogout })) : (react_1.default.createElement(react_1.default.Fragment, null)),
        react_1.default.createElement("div", { className: "centered default-container" },
            "You are logged in",
            react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => {
                    setLogin(false);
                    setCreate(false);
                    setLogout(true);
                } }, "Logout")))) : create ? (react_1.default.createElement(CreateAccount_1.default, { setCreate: setCreate, setLogin: setLogin, setUserId: props.setUserId, error: error, setError: setError })) : login ? (react_1.default.createElement(Login_1.default, { handleLogin: handleLogin, setLogin: setLogin, setCreate: setCreate, userId: props.userId, setUserId: props.setUserId, error: error, setError: setError })) : (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("h1", { className: "header u-" }, "Welcome to Crash"),
        react_1.default.createElement("div", { className: "animation-container" },
            react_1.default.createElement("script", { src: "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs", type: "module" }),
            react_1.default.createElement(react_lottie_player_1.Player, { src: "https://lottie.host/be856f9f-1f5a-4547-b753-fe1277ccd205/WV6ST8dhed.json", background: "transparent", speed: 0.75, style: { width: "50%", height: "50%" }, loop: true, controls: true, autoplay: true },
                react_1.default.createElement(react_lottie_player_1.Controls, { visible: false }))),
        react_1.default.createElement("div", { className: "animation2-container" },
            react_1.default.createElement("script", { src: "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs", type: "module" }),
            react_1.default.createElement(react_lottie_player_1.Player, { src: "https://lottie.host/08687337-9aa4-42d9-8a3d-f855b2350a2f/j7lwbUynui.json", background: "transparent", speed: 0.9, style: { width: "175%", height: "175%" }, loop: true, controls: true, autoplay: true },
                react_1.default.createElement(react_lottie_player_1.Controls, { visible: false }))),
        react_1.default.createElement("div", { className: "buttons-container" },
            react_1.default.createElement("button", { className: "landing-btn u-pointer", onClick: () => setLogin(true) }, "login"),
            react_1.default.createElement("button", { className: "landing-btn u-pointer", onClick: () => setCreate(true) }, "sign up"))))));
};
exports.default = Homepage;
