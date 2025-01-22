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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const client_socket_1 = require("../../client-socket");
const utilities_1 = require("../../utilities");
const router_1 = require("@reach/router");
require("./Profile.css");
require("../pages/Login.css");
const blank_jpg_1 = __importDefault(require("../../assets/blank.jpg"));
const EditModal_1 = __importDefault(require("../modules/profile/EditModal"));
const fa6_1 = require("react-icons/fa6");
const InfoModal_1 = __importDefault(require("../modules/modals/InfoModal"));
const Profile = (props) => {
    const [user, setUser] = (0, react_1.useState)(undefined);
    const [name, setName] = (0, react_1.useState)(`Crash User`);
    const [username, setUsername] = (0, react_1.useState)(`default_user420`);
    const [pfp, setPfp] = (0, react_1.useState)(blank_jpg_1.default);
    const [editing, setEditing] = (0, react_1.useState)(false);
    const [bio, setBio] = (0, react_1.useState)(`Add a bio`);
    const [requirements, setRequirements] = (0, react_1.useState)({ show: false });
    const navigate = (0, router_1.useNavigate)();
    const route = (path) => {
        navigate(path);
    };
    const updatePhoto = (imageBuffer) => __awaiter(void 0, void 0, void 0, function* () {
        const base64Image = btoa(new Uint8Array(imageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
        const src = `data:image/jpeg;base64,${base64Image}`;
        setPfp(src);
    });
    client_socket_1.socket.on("updated user", (event) => {
        if (event.image) {
            const buffer = event.image;
            updatePhoto(buffer);
        }
        if (event.name)
            setName(event.name);
        if (event.username)
            setUsername(event.username);
        if (event.bio)
            setBio(event.bio);
    });
    (0, react_1.useEffect)(() => {
        if (props.userId !== undefined) {
            (0, utilities_1.get)("/api/user/fetch", { id: props.userId }).then((res) => {
                if (res.valid) {
                    setUser(res.user);
                    setName(res.user.name);
                    setUsername(res.user.username);
                    if (res.user.bio)
                        setBio(res.user.bio);
                    (0, utilities_1.get)("/api/user/loadphoto", { userId: res.user._id }).then((res) => {
                        if (res.valid) {
                            const buffer = res.buffer.Body.data;
                            updatePhoto(buffer);
                        }
                    });
                }
            });
        }
    }, []);
    return (react_1.default.createElement(react_1.default.Fragment, null, props.userId ? (react_1.default.createElement(react_1.default.Fragment, null,
        editing ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(EditModal_1.default, { name: name, bio: bio, username: username, userId: props.userId, setEditing: setEditing, setRequirements: setRequirements }))) : (react_1.default.createElement(react_1.default.Fragment, null, requirements.show ? (react_1.default.createElement(InfoModal_1.default, { header: requirements.header, info: requirements.text, setDisplay: setRequirements, setAltDisplay: setEditing })) : (react_1.default.createElement(react_1.default.Fragment, null)))),
        react_1.default.createElement("div", { className: "profile-split" },
            react_1.default.createElement("div", { className: "card-container" },
                react_1.default.createElement(fa6_1.FaGear, { className: "edit-icon u-pointer", onClick: (event) => {
                        setEditing(true);
                    } }),
                react_1.default.createElement("div", { className: "profile-info-container" },
                    react_1.default.createElement("h3", null,
                        "@",
                        username),
                    react_1.default.createElement("img", { src: pfp, className: "profile-pic" }),
                    react_1.default.createElement("h4", null, name),
                    react_1.default.createElement("p", { className: "opaque-text" }, bio),
                    react_1.default.createElement("div", { className: "follow-cts" },
                        react_1.default.createElement("p", null, "0 followers"),
                        react_1.default.createElement("p", null, "0 following"))),
                react_1.default.createElement("div", { className: "connected-view" },
                    react_1.default.createElement("div", { className: "account-pill" }, "TEST")))),
        react_1.default.createElement("div", { className: "details-split" }),
        react_1.default.createElement("div", { className: "settings-split" }))) : (react_1.default.createElement("div", { className: "centered default-container" },
        "Login to see profile",
        react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => {
                client_socket_1.socket.emit("nav toggle all", {});
                route("/");
            } }, "Take me back")))));
};
exports.default = Profile;
