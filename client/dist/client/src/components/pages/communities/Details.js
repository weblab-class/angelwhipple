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
const client_socket_1 = require("../../../client-socket");
const utilities_1 = require("../../../utilities");
require("./Details.css");
const MemberEntry_1 = __importDefault(require("../../modules/communities/MemberEntry"));
const EditModal_1 = __importDefault(require("../../modules/communities/EditModal"));
const fa6_1 = require("react-icons/fa6");
const default_placeholder_png_1 = __importDefault(require("../../../assets/default-placeholder.png"));
const CommunityDetails = (props) => {
    const [showRules, setShowRules] = (0, react_1.useState)(false);
    const [showMembers, setShowMembers] = (0, react_1.useState)(true);
    const [showMedia, setShowMedia] = (0, react_1.useState)(false);
    const [members, setMembers] = (0, react_1.useState)([]);
    const [img, setImg] = (0, react_1.useState)(default_placeholder_png_1.default);
    const [name, setName] = (0, react_1.useState)(props.activeCommunity.name);
    const [description, setDescription] = (0, react_1.useState)(`Describe this community`);
    const [editing, setEditing] = (0, react_1.useState)(false);
    const toggle = (selectorFn) => {
        for (const selFn of [setShowRules, setShowMembers, setShowMedia]) {
            if (selFn !== selectorFn)
                selFn(false);
        }
        selectorFn(true);
    };
    const updatePhoto = (imageBuffer) => {
        const base64Image = btoa(new Uint8Array(imageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
        const src = `data:image/jpeg;base64,${base64Image}`;
        setImg(src);
    };
    client_socket_1.socket.on("updated community", (event) => {
        if (event.image) {
            const buffer = event.image;
            updatePhoto(buffer);
        }
        if (event.name)
            setName(event.name);
        if (event.description)
            setDescription(event.description);
    });
    client_socket_1.socket.on("joined community", (event) => {
        console.log(event);
        if (event.communityId === props.activeCommunity._id) {
            (0, utilities_1.get)("/api/user/fetch", { userId: event.user }).then((res) => {
                console.log(res);
                if (res.valid) {
                    const newMember = (react_1.default.createElement(MemberEntry_1.default, { key: event.user._id, user: event.user, community: props.activeCommunity }));
                    setMembers((prev) => [...prev, newMember]);
                }
            });
        }
    });
    const refreshDetails = () => __awaiter(void 0, void 0, void 0, function* () {
        setMembers([]);
        populateUsers();
        setImg(default_placeholder_png_1.default);
        (0, utilities_1.get)("/api/community/loadphoto", { communityId: props.activeCommunity._id }).then((res) => {
            if (res.valid) {
                const buffer = res.buffer.Body.data;
                updatePhoto(buffer);
            }
        });
        setName(props.activeCommunity.name);
        if (props.activeCommunity.description) {
            setDescription(props.activeCommunity.description.toString());
        }
        else
            setDescription(`Describe this community`);
    });
    (0, react_1.useEffect)(() => {
        refreshDetails();
    }, []);
    (0, react_1.useEffect)(() => {
        refreshDetails();
    }, [props.activeCommunity]);
    const populateUsers = () => __awaiter(void 0, void 0, void 0, function* () {
        const memberProfiles = [];
        return yield (0, utilities_1.get)("/api/community/fetch", { communityId: props.activeCommunity._id }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
            if (res.valid) {
                for (const memberId of res.community.members) {
                    yield (0, utilities_1.get)("/api/user/fetch", { id: memberId }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                        const member = (react_1.default.createElement(MemberEntry_1.default, { key: res.user._id, user: res.user, community: props.activeCommunity }));
                        memberProfiles.push(member);
                    }));
                }
                setMembers(memberProfiles);
            }
        }));
    });
    return (react_1.default.createElement("div", { className: "page-container" },
        react_1.default.createElement("div", { className: "community-header" },
            props.userId === props.activeCommunity.owner ? (react_1.default.createElement(fa6_1.FaGear, { className: "gear-icon u-pointer", onClick: (event) => {
                    setEditing(true);
                } })) : (react_1.default.createElement(react_1.default.Fragment, null)),
            react_1.default.createElement("img", { className: "community-img", src: img }),
            react_1.default.createElement("div", { className: "community-details" },
                react_1.default.createElement("h2", null, name),
                react_1.default.createElement("p", null,
                    members.length,
                    " members"),
                react_1.default.createElement("p", { className: "opaque-text" }, description))),
        react_1.default.createElement("div", { className: "toggle-container" },
            react_1.default.createElement("button", { className: "toggle-link u-pointer", onClick: (event) => toggle(setShowRules) },
                react_1.default.createElement("p", { className: `${showRules ? `gradient-text-sel` : `gradient-text`}` }, "rules")),
            react_1.default.createElement("button", { className: "toggle-link u-pointer", onClick: (event) => toggle(setShowMembers) },
                react_1.default.createElement("p", { className: `${showMembers ? `gradient-text-sel` : `gradient-text`}` }, "members")),
            react_1.default.createElement("button", { className: "toggle-link u-pointer", onClick: (event) => toggle(setShowMedia) },
                react_1.default.createElement("p", { className: `${showMedia ? `gradient-text-sel` : `gradient-text`}` }, "media"))),
        showRules ? (react_1.default.createElement("div", { className: "rules-view" },
            react_1.default.createElement("h4", null, "Community Rules"),
            react_1.default.createElement("div", { className: "rules-container" },
                react_1.default.createElement("p", null, "1. Treat other Crash users with kindness."),
                react_1.default.createElement("p", null, "2. No bullying, harassment, or hate speech is allowed."),
                react_1.default.createElement("p", null, "3. Only use your real identity. Catfishing and impersonation will be not be tolerated.")))) : showMembers ? (react_1.default.createElement(react_1.default.Fragment, null, members.length > 0 ? (react_1.default.createElement("div", { className: "member-view" }, members)) : (react_1.default.createElement("div", { className: "center" },
            react_1.default.createElement("div", { className: "wave" }),
            react_1.default.createElement("div", { className: "wave" }),
            react_1.default.createElement("div", { className: "wave" }),
            react_1.default.createElement("div", { className: "wave" }),
            react_1.default.createElement("div", { className: "wave" }),
            react_1.default.createElement("div", { className: "wave" }),
            react_1.default.createElement("div", { className: "wave" }),
            react_1.default.createElement("div", { className: "wave" }),
            react_1.default.createElement("div", { className: "wave" }),
            react_1.default.createElement("div", { className: "wave" }))))) : showMedia ? (react_1.default.createElement("div", { className: "centered-container" }, "No media to display")) : (react_1.default.createElement(react_1.default.Fragment, null)),
        editing ? (react_1.default.createElement(EditModal_1.default, { name: name, decription: description, setEditing: setEditing, communityId: props.activeCommunity._id })) : (react_1.default.createElement(react_1.default.Fragment, null))));
};
exports.default = CommunityDetails;
