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
const router_1 = require("@reach/router");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const utilities_1 = require("../utilities");
const NotFound_1 = __importDefault(require("./pages/NotFound"));
const client_socket_1 = require("../client-socket");
require("../utilities.css");
require("./pages/Homepage.css");
const Homepage_1 = __importDefault(require("./pages/Homepage"));
const NavBar_1 = __importDefault(require("../components/modules/NavBar"));
const Profile_1 = __importDefault(require("./pages/Profile"));
const Communities_1 = __importDefault(require("./pages/communities/Communities"));
const Housing_1 = __importDefault(require("./pages/Housing"));
const ProfilePill_1 = __importDefault(require("./modules/accounts/ProfilePill"));
const Verified_1 = __importDefault(require("./pages/throwaway/Verified"));
const Joined_1 = __importDefault(require("./pages/throwaway/Joined"));
const ReportIssue_1 = __importDefault(require("./modules/modals/ReportIssue"));
const PLATFORMS = {
    linkedin: "linkedinid",
    google: "googleid",
    fb: "facebookid",
    origin: "originid",
};
const App = () => {
    const [socketConnected, setSocketConnected] = (0, react_1.useState)(client_socket_1.socket.connected);
    const [userId, setUserId] = (0, react_1.useState)(undefined);
    const [consolidate, setConsolidate] = (0, react_1.useState)(false);
    const [extraProfiles, setExtraProfiles] = (0, react_1.useState)([]);
    const [chosenProfiles, setChosenProfiles] = (0, react_1.useState)([]);
    const [joinCode, setJoinCode] = (0, react_1.useState)("");
    const [invited, setInvited] = (0, react_1.useState)(false);
    client_socket_1.socket.on("linkedin", (event) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Linkedin login success`);
        setUserId(event.user._id);
        (0, utilities_1.post)("/api/initsocket", { socketid: client_socket_1.socket.id });
        handleConsolidate(event);
    }));
    client_socket_1.socket.on("origin", (event) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Crash login success`);
        setUserId(event.user._id);
        (0, utilities_1.post)("/api/initsocket", { socketid: client_socket_1.socket.id });
        handleConsolidate(event);
    }));
    const redirect = (path) => (0, router_1.navigate)(path);
    const handleLogin = (credentialResponse) => {
        const userToken = credentialResponse.credential;
        const decodedCredential = (0, jwt_decode_1.default)(userToken);
        console.log(`Logged in as ${decodedCredential.name}`);
        console.log(`Email address: ${decodedCredential.email}`);
        (0, utilities_1.post)("/api/login", {
            token: userToken,
        }).then((response) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Google login success`);
            setUserId(response.user._id);
            (0, utilities_1.post)("/api/initsocket", { socketid: client_socket_1.socket.id }).then(() => {
                client_socket_1.socket.emit("login success");
            });
            handleConsolidate(response);
        }));
    };
    const handleLogout = () => {
        setUserId(undefined);
        (0, utilities_1.post)("/api/logout");
    };
    const loginJoinCommunity = () => {
        if (invited) {
            const body = {
                code: joinCode,
                userId: userId,
            };
            console.log(`Join community body: ${JSON.stringify(body)}`);
            (0, utilities_1.post)("/api/community/join", body).then((res) => {
                redirect("/communities");
            });
        }
    };
    const generatePills = (profiles) => {
        const pills = profiles.map((profile, index) => (react_1.default.createElement(ProfilePill_1.default, { profile: profile, key: index, chosenProfiles: chosenProfiles, setChosenProfiles: setChosenProfiles })));
        return pills;
    };
    const handleConsolidate = (event) => {
        if (event.consolidate.eligible) {
            setExtraProfiles(generatePills(event.consolidate.profiles));
            setConsolidate(true);
        }
    };
    (0, react_1.useEffect)(() => {
        if (socketConnected) {
            console.log(`Socket is connected!`);
            console.log("Socket ID:", client_socket_1.socket.id);
        }
    }, [socketConnected]);
    (0, react_1.useEffect)(() => {
        loginJoinCommunity();
    }, [userId]);
    (0, react_1.useEffect)(() => {
        setSocketConnected(client_socket_1.socket.connected);
        const handleConnect = () => {
            setSocketConnected(true);
        };
        (0, client_socket_1.onSocketConnect)(handleConnect);
        (0, utilities_1.get)("/api/whoami")
            .then((user) => {
            if (user._id) {
                // They are registed in the database and currently logged in.
                setUserId(user._id);
            }
        })
            .then(() => client_socket_1.socket.on("connect", () => {
            (0, utilities_1.post)("/api/initsocket", { socketid: client_socket_1.socket.id });
        }));
    }, []);
    // NOTE:
    // All the pages need to have the props extended via RouteComponentProps for @reach/router to work properly. Please use the Homepage as an example.
    return (react_1.default.createElement("div", { className: "background" },
        react_1.default.createElement(router_1.Router, { primary: false },
            react_1.default.createElement(NavBar_1.default, { default: true, userId: userId, setUserId: setUserId })),
        react_1.default.createElement(router_1.Router, null,
            react_1.default.createElement(Homepage_1.default, { path: "/", handleLogin: handleLogin, handleLogout: handleLogout, consolidate: consolidate, extraProfiles: extraProfiles, chosenProfiles: chosenProfiles, setChosenProfiles: setChosenProfiles, userId: userId, setUserId: setUserId, setConsolidate: setConsolidate, setInvited: setInvited, setJoinCode: setJoinCode }),
            react_1.default.createElement(Profile_1.default, { path: "/profile", userId: userId }),
            react_1.default.createElement(Communities_1.default, { path: "/communities", userId: userId, setUserId: setUserId }),
            react_1.default.createElement(Housing_1.default, { path: "/housing" }),
            react_1.default.createElement(Verified_1.default, { path: "/verified" }),
            react_1.default.createElement(Joined_1.default, { path: "/joined" }),
            react_1.default.createElement(NotFound_1.default, { default: true })),
        react_1.default.createElement(ReportIssue_1.default, null)));
};
exports.default = App;
