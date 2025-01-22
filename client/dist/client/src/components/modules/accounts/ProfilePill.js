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
require("./ProfilePill.css");
const linkedin_png_1 = __importDefault(require("../../../assets/linkedin.png"));
const google_png_1 = __importDefault(require("../../../assets/google.png"));
const fb_png_1 = __importDefault(require("../../../assets/fb.png"));
const origin_png_1 = __importDefault(require("../../../assets/origin.png"));
const PROFILE_ICONS = {
    linkedinid: linkedin_png_1.default,
    googleid: google_png_1.default,
    facebookid: fb_png_1.default,
    originid: origin_png_1.default,
};
const ProfilePill = (props) => {
    const [platform, setPlatform] = (0, react_1.useState)("");
    const [icon, setIcon] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        for (const [platform, path] of Object.entries(PROFILE_ICONS)) {
            if (platform in props.profile) {
                setIcon(path);
                setPlatform(platform);
            }
        }
    }, []);
    const handleSelect = (checkbox) => {
        if (checkbox.target.checked) {
            props.setChosenProfiles((prev) => [...prev, platform]); // functional (dynamic) update
        }
        else {
            props.setChosenProfiles(props.chosenProfiles.filter((profile) => profile !== platform));
        }
    };
    return (react_1.default.createElement("div", { className: "pill-container u-pointer" },
        react_1.default.createElement("img", { src: icon, className: "platform-icon" }),
        react_1.default.createElement("p", null, props.profile.name ? props.profile.name : props.profile.username),
        react_1.default.createElement("input", { id: "platformCheck", type: "checkbox", className: "u-pointer", onClick: handleSelect.bind(this) })));
};
exports.default = ProfilePill;
