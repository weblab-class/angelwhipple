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
const router_1 = require("@reach/router");
require("./Communities.css");
require("../../modules/accounts/CreateAccount.css");
require("../../pages/Login.css");
require("../../modules/NavBar.css");
const tb_1 = require("react-icons/tb");
const Invite_1 = __importDefault(require("../../modules/communities/Invite"));
const CommunityMenu_1 = __importDefault(require("../../modules/communities/CommunityMenu"));
const Details_1 = __importDefault(require("./Details"));
const Manage_1 = __importDefault(require("./Manage"));
const Explore_1 = __importDefault(require("./Explore"));
const Annoucements_1 = __importDefault(require("./Annoucements"));
const types_1 = require("../../../../../server/types");
var CommunityType;
(function (CommunityType) {
    CommunityType[CommunityType["UNIVERSITY"] = 0] = "UNIVERSITY";
    CommunityType[CommunityType["WORKPLACE"] = 1] = "WORKPLACE";
    CommunityType[CommunityType["LIVING"] = 2] = "LIVING";
    CommunityType[CommunityType["LOCAL"] = 3] = "LOCAL";
})(CommunityType || (CommunityType = {}));
var MenuAction;
(function (MenuAction) {
    MenuAction[MenuAction["DETAILS"] = 0] = "DETAILS";
    MenuAction[MenuAction["MANAGE"] = 1] = "MANAGE";
    MenuAction[MenuAction["ANNOUCEMENTS"] = 2] = "ANNOUCEMENTS";
    MenuAction[MenuAction["EXPLORE"] = 3] = "EXPLORE";
    MenuAction[MenuAction["TOGGLE"] = 4] = "TOGGLE";
})(MenuAction || (MenuAction = {}));
const Communities = (props) => {
    const [landing, setLanding] = (0, react_1.useState)(true);
    const [communities, setCommunties] = (0, react_1.useState)([]);
    const [activeCommunity, setActiveCommunity] = (0, react_1.useState)(undefined);
    const [communityType, setType] = (0, react_1.useState)(undefined);
    const [verified, setVerified] = (0, react_1.useState)(false);
    const [verifying, setVerifying] = (0, react_1.useState)(false);
    const [showInvite, setShowInvite] = (0, react_1.useState)(false);
    const [joining, setJoining] = (0, react_1.useState)(false);
    const [menuAction, setMenuAction] = (0, react_1.useState)(undefined);
    const [error, setError] = (0, react_1.useState)({ valid: false });
    const navigate = (0, router_1.useNavigate)();
    const route = (path) => {
        navigate(path);
    };
    client_socket_1.socket.on("verified", (event) => {
        console.log(event);
        setVerifying(false);
        setVerified(true);
    });
    client_socket_1.socket.on("new community", (event) => { });
    client_socket_1.socket.on("switched communities", (event) => {
        setActiveCommunity(event.community);
        setMenuAction(MenuAction.DETAILS);
    });
    client_socket_1.socket.on("create new community", () => {
        setMenuAction(undefined);
        setJoining(false);
        setLanding(false);
        setType(undefined);
        setActiveCommunity(undefined);
    });
    client_socket_1.socket.on("joined community", (event) => __awaiter(void 0, void 0, void 0, function* () {
        if (event.communityId === (activeCommunity === null || activeCommunity === void 0 ? void 0 : activeCommunity._id)) {
            yield (0, utilities_1.get)("/api/community/fetch", { communityId: activeCommunity === null || activeCommunity === void 0 ? void 0 : activeCommunity._id }).then((res) => {
                console.log(`Refreshed community: ${JSON.stringify(res)}`);
                setActiveCommunity(res.community); // refresh state of active community object
            });
        }
    }));
    (0, react_1.useEffect)(() => {
        if (props.userId) {
            (0, utilities_1.get)("/api/user/communities", { id: props.userId }).then((res) => {
                if (res.valid) {
                    setCommunties(res.communities);
                    setActiveCommunity(res.communities[res.communities.length - 1]);
                }
            });
            (0, utilities_1.get)("/api/user/fetch", { id: props.userId }).then((res) => {
                if (res.valid && res.user.verified === true) {
                    setVerified(true);
                }
            });
        }
        setMenuAction(MenuAction.EXPLORE);
    }, []);
    (0, react_1.useEffect)(() => setError({ valid: false }), [verified]);
    const createCommunity = (nameInput) => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            userId: props.userId,
            communityName: nameInput.value,
            communityType: communityType,
            userVerified: verified,
        };
        nameInput.value = "";
        (0, utilities_1.post)("/api/community/create", body).then((community) => {
            setCommunties((prev) => [...prev, community]);
            setActiveCommunity(community);
            setShowInvite(true);
        });
    });
    const joinCommunity = (codeInput) => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            code: codeInput.value,
            userId: props.userId,
        };
        codeInput.value = "";
        (0, utilities_1.post)("/api/community/join", body).then((res) => {
            if (res.valid) {
                setCommunties((prev) => [...prev, res.community]);
                setActiveCommunity(res.community);
                setJoining(false);
            }
            else {
                console.log("Bad join code"); // TODO: display error msg
            }
        });
    });
    const verification = (emailInput) => __awaiter(void 0, void 0, void 0, function* () {
        (0, utilities_1.get)("/api/user/fetch", { id: props.userId }).then((res) => {
            const sender = { email: "awhipp@mit.edu", name: "Crash MIT" }; // registered e-mail with Mailjet API
            const sendee = {
                email: emailInput.value,
                name: res.user.name !== null ? res.user.name : res.user.username,
            };
            emailInput.value = "";
            console.log(`From: ${sender.email}, To: ${sendee.email}`);
            const messages = {
                Messages: [
                    {
                        From: { Email: sender.email, Name: sender.name }, // single sender object
                        To: [{ Email: sendee.email, Name: sendee.name }], // list of sendee objects
                        Subject: "Verify your e-mail with Crash",
                        HTMLPart: `<a href="${types_1.DOMAIN}/api/user/verified?id=${props.userId}">Click here to confirm your email address</a>`,
                    },
                ],
            };
            (0, utilities_1.post)("/api/user/verification", { messages: messages }).then((res) => {
                if (res.sent) {
                    setError({ valid: true, message: "Please check your email for a verification link!" });
                }
                else {
                    console.log(`Mailjet error: ${res.error}`);
                    setError({
                        valid: true,
                        message: "Error sending verification link, please try again later.",
                    });
                }
            });
        });
    });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        props.userId !== undefined ? (react_1.default.createElement("div", { className: "sidebar-split" },
            react_1.default.createElement(CommunityMenu_1.default, { userId: props.userId, menuAction: menuAction, setMenuAction: setMenuAction, setUserId: props.setUserId }))) : (react_1.default.createElement(react_1.default.Fragment, null)),
        react_1.default.createElement("div", { className: "mainpage-split" }, props.userId === undefined ? (react_1.default.createElement("div", { className: "centered default-container" },
            react_1.default.createElement("p", null, "Login to see this page"),
            react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => {
                    client_socket_1.socket.emit("nav toggle all", {});
                    route("/");
                } }, "Take me back"))) : activeCommunity && showInvite ? (react_1.default.createElement(Invite_1.default, { newCommunity: activeCommunity, setShowInvite: setShowInvite })) : activeCommunity && (menuAction === undefined || menuAction === MenuAction.EXPLORE) ? (react_1.default.createElement(Explore_1.default, { activeCommunity: activeCommunity })) : activeCommunity && menuAction === MenuAction.DETAILS ? (react_1.default.createElement(Details_1.default, { userId: props.userId, activeCommunity: activeCommunity })) : activeCommunity && menuAction === MenuAction.MANAGE ? (react_1.default.createElement(Manage_1.default, { activeCommunity: activeCommunity })) : activeCommunity && menuAction === MenuAction.ANNOUCEMENTS ? (react_1.default.createElement(Annoucements_1.default, { activeCommunity: activeCommunity })) : landing === true && props.userId ? (react_1.default.createElement("div", { className: "centered default-container" },
            react_1.default.createElement("h3", null, "You aren't a member of any communities yet."),
            react_1.default.createElement("button", { className: "login-button u-pointer", onClick: (event) => {
                    setLanding(false);
                } }, "Create a community"),
            react_1.default.createElement("button", { className: "login-button u-pointer", onClick: (event) => {
                    setLanding(false);
                    setJoining(true);
                } }, "Join your first community"))) : joining === true && props.userId ? (react_1.default.createElement("div", { className: "centered default-container" },
            react_1.default.createElement("div", { className: "u-flex" },
                react_1.default.createElement("label", { className: "create-label" },
                    react_1.default.createElement("p", null, "Please provide an invite code"),
                    react_1.default.createElement("input", { id: "inv_code", type: "text", className: "create-input", onKeyDown: (event) => {
                            if (event.key === "Enter") {
                                const codeInput = document.getElementById("inv_code");
                                joinCommunity(codeInput);
                            }
                        } })),
                react_1.default.createElement(tb_1.TbPlayerTrackNextFilled, { className: "nav-icon u-pointer", onClick: (event) => {
                        const codeInput = document.getElementById("inv_code");
                        joinCommunity(codeInput);
                    } })),
            react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => {
                    setJoining(false);
                    setLanding(true);
                } }, "Go back"))) : communityType === undefined && props.userId ? (react_1.default.createElement("div", { className: "centered default-container" },
            react_1.default.createElement("h3", null, "What type of community is this?"),
            react_1.default.createElement("button", { onClick: (event) => {
                    setType((prev) => CommunityType.UNIVERSITY);
                    if (!verified)
                        setVerifying(true);
                }, className: "login-button u-pointer" }, "College/university"),
            react_1.default.createElement("button", { onClick: (event) => {
                    setType((prev) => CommunityType.WORKPLACE);
                    if (!verified)
                        setVerifying(true);
                }, className: "login-button u-pointer" }, "Workplace"),
            react_1.default.createElement("button", { onClick: (event) => {
                    setType((prev) => CommunityType.LIVING);
                }, className: "login-button u-pointer" }, "Living group"),
            react_1.default.createElement("button", { onClick: (event) => {
                    setType((prev) => CommunityType.LOCAL);
                }, className: "login-button u-pointer" }, "Locality"),
            communities.length > 0 ? (react_1.default.createElement(react_1.default.Fragment, null)) : (react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => setLanding(true) }, "Go back")))) : communityType !== undefined && props.userId && verifying === true ? (react_1.default.createElement("div", { className: "centered default-container" },
            react_1.default.createElement("h3", null,
                "Enter your ",
                communityType === CommunityType.WORKPLACE ? "work" : "school",
                " email address for verification"),
            react_1.default.createElement("div", { className: "u-flex" },
                react_1.default.createElement("input", { id: "email", type: "email", className: "input", onKeyDown: (event) => {
                        if (event.key == "Enter") {
                            const emailInput = document.getElementById("email");
                            verification(emailInput);
                        }
                    } }),
                react_1.default.createElement(tb_1.TbPlayerTrackNextFilled, { className: "nav-icon u-pointer", onClick: (event) => {
                        const emailInput = document.getElementById("email");
                        verification(emailInput);
                    } })),
            react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => {
                    setType(undefined);
                    setVerifying(false);
                } }, "Go back"),
            error.valid ? (react_1.default.createElement("p", { className: "error-text" }, error.message)) : (react_1.default.createElement("p", { className: "error-text-hidden" }, "Default")))) : (props.userId &&
            (communityType == CommunityType.UNIVERSITY ||
                communityType == CommunityType.WORKPLACE) && verified) || communityType == CommunityType.LIVING ||
            communityType == CommunityType.LOCAL ? (react_1.default.createElement("div", { className: "centered default-container" },
            react_1.default.createElement("div", { className: "u-flex" },
                react_1.default.createElement("label", { className: "create-label" },
                    "Community name",
                    react_1.default.createElement("input", { id: "community_name", className: "create-input", onKeyDown: (event) => {
                            if (event.key === "Enter") {
                                const nameInput = document.getElementById("community_name");
                                createCommunity(nameInput);
                            }
                        } })),
                react_1.default.createElement(tb_1.TbPlayerTrackNextFilled, { className: "nav-icon u-pointer", onClick: (event) => {
                        const nameInput = document.getElementById("community_name");
                        createCommunity(nameInput);
                    } })),
            react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => setType(undefined) }, "Go back"))) : (react_1.default.createElement(react_1.default.Fragment, null)))));
};
exports.default = Communities;
