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
const utilities_1 = require("../../utilities");
const google_1 = require("@react-oauth/google");
require("../modules/modals/Modal.css");
require("./Login.css");
require("../modules/accounts/CreateAccount.css");
const types_1 = require("../../../../server/types");
const tb_1 = require("react-icons/tb");
const tb_2 = require("react-icons/tb");
const helpers_1 = __importDefault(require("../helpers"));
const PLATFORMS = {
    linkedin: "linkedinid",
    google: "googleid",
    fb: "facebookid",
    origin: "originid",
};
const GOOGLE_CLIENT_ID = "281523827651-6p2ui3h699r3378i6emjqdm4o68hhnbi.apps.googleusercontent.com";
const LINKEDIN_CLIENT_ID = "78kxc3fzhb4yju";
const LINKEDIN_REDIRECT_URI = `${types_1.DOMAIN}/api/user/linkedin`;
const LINKEDIN_AUTH_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${LINKEDIN_REDIRECT_URI}&scope=r_liteprofile,r_emailaddress`;
const LoginPage = (props) => {
    const [localAccount, setLocalAccount] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(props.error);
    const [email, setEmail] = (0, react_1.useState)("");
    const navigate = (0, router_1.useNavigate)();
    const route = (path) => {
        navigate(path);
    };
    const launch_linkedin = (event) => {
        window.open(LINKEDIN_AUTH_URL, "_self");
    };
    const handleLogin = (emailInput, passwordInput) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Email: ${emailInput.value}, Password: ${passwordInput.value}`);
        if (helpers_1.default.validateEmail(emailInput.value)) {
            yield (0, utilities_1.get)("/api/user/exists", { email: emailInput.value }).then((res) => {
                if (!res.exists) {
                    // props.setError({
                    //   valid: true,
                    //   message: "No account was found with that email address. Please create an account",
                    // });
                    props.setCreate(true);
                    props.setLogin(false);
                    return;
                }
                else
                    setEmail(emailInput.value);
            });
        }
        else {
            emailInput.value = "";
            setError({ valid: true, message: "Invalid email address" });
            return;
        }
        if (passwordInput.value !== "") {
            yield (0, utilities_1.post)("/api/login", {
                originid: "originid",
                email: emailInput.value,
                password: passwordInput.value,
            }).then((res) => {
                if (res.valid) {
                    props.setError({ valid: false });
                    setLocalAccount(false);
                    props.setLogin(false);
                }
                else {
                    passwordInput.value = "";
                    setError({ valid: true, message: res.message });
                }
            });
        }
        else {
            setError({ valid: true, message: "Please enter your password" });
        }
    });
    // useEffect order matters!
    // useEffect(() => {
    //   setError({ valid: false });
    // }, [email, props.userId]);
    // useEffect(() => {
    //   setError(props.error);
    //   if (props.error.valid) setLocalAccount(true);
    // }, []);
    return (react_1.default.createElement(google_1.GoogleOAuthProvider, { clientId: GOOGLE_CLIENT_ID },
        react_1.default.createElement("div", { className: "login-page" },
            react_1.default.createElement("div", { className: "login-panel" },
                react_1.default.createElement("p", null, "Sign in"),
                localAccount ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("label", { className: "create-label" },
                        "Enter your email address",
                        react_1.default.createElement("input", { id: "email", className: "create-input", type: "email" })),
                    react_1.default.createElement("label", { className: "create-label" },
                        "Enter your password",
                        " ",
                        react_1.default.createElement("input", { id: "password", className: "create-input", type: "password", onKeyDown: (event) => {
                                const emailInput = document.getElementById("email");
                                const passwordInput = document.getElementById("password");
                                if (event.key === "Enter")
                                    handleLogin(emailInput, passwordInput);
                            } })),
                    react_1.default.createElement("div", { className: "action-container" },
                        react_1.default.createElement(tb_2.TbPlayerTrackPrevFilled, { className: "login-icon u-pointer", onClick: (event) => {
                                setError({ valid: false });
                                setLocalAccount(false);
                            } }),
                        react_1.default.createElement(tb_1.TbPlayerTrackNextFilled, { className: "login-icon u-pointer", onClick: (event) => {
                                const emailInput = document.getElementById("email");
                                const passwordInput = document.getElementById("password");
                                handleLogin(emailInput, passwordInput);
                            } })),
                    error.valid ? (react_1.default.createElement("p", { className: "error-text" }, error.message)) : (react_1.default.createElement("p", { className: "error-text-hidden" }, "Default")))) : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => setLocalAccount(true) }, "I have a Crash account"),
                    react_1.default.createElement("hr", { style: { width: "100%" } }),
                    react_1.default.createElement(google_1.GoogleLogin, { onSuccess: (credentialResponse) => {
                            props.handleLogin(credentialResponse);
                        }, onError: () => {
                            console.log("Error logging in");
                        }, type: "standard", shape: "pill", size: "medium", text: "signin_with", logo_alignment: "left", click_listener: () => { } }),
                    react_1.default.createElement("button", { className: "login-button u-pointer", onClick: launch_linkedin }, "Sign in with Linkedin"),
                    react_1.default.createElement("button", { className: "login-button u-pointer", onClick: (event) => {
                            route("/facebook");
                        } }, "Sign in with Facebook"),
                    react_1.default.createElement("button", { className: "login-button u-pointer", onClick: (event) => props.setLogin(false) }, "Go back")))))));
};
exports.default = LoginPage;
