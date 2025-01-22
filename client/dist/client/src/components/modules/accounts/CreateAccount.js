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
require("./CreateAccount.css");
require("../NavBar.css");
const tb_1 = require("react-icons/tb");
const md_1 = require("react-icons/md");
const helpers_1 = __importDefault(require("../../helpers"));
const InfoModal_1 = __importDefault(require("../modals/InfoModal"));
const types_1 = require("../../types");
const CreateAccount = (props) => {
    const [email, setEmail] = (0, react_1.useState)("");
    const [dob, setDob] = (0, react_1.useState)("");
    const [username, setUsername] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [policy, setPolicy] = (0, react_1.useState)({ show: false });
    const [acknowledgements, setAcknowledgements] = (0, react_1.useState)({
        privacy: false,
        terms: false,
    });
    const [error, setError] = (0, react_1.useState)(props.error);
    const handleDob = (event, dobInput) => {
        event.preventDefault();
        // console.log(`Date of birth: ${dobInput.value}`);
        if (!dobInput.value) {
            setError({ valid: true, message: "Please enter a valid date of birth" });
        }
        else if (helpers_1.default.validateAge(dobInput.value)) {
            setDob(dobInput.value);
            setError({ valid: false });
        }
        else {
            setError({ valid: true, message: "Must be atleast 16 years of age" });
        }
        dobInput.value = "";
    };
    const handleEmail = (event, emailInput) => {
        event.preventDefault();
        // console.log(`Email: ${emailInput.value}`);
        if (helpers_1.default.validateEmail(emailInput.value)) {
            (0, utilities_1.get)("/api/user/exists", { email: emailInput.value }).then((res) => {
                if (res.exists) {
                    // props.setError({
                    //   valid: true,
                    //   message: "An existing account was found with that email address. Please login",
                    // });
                    props.setLogin(true);
                    props.setCreate(false);
                }
                else
                    setEmail(emailInput.value);
            });
        }
        else {
            emailInput.value = "";
            setError({ valid: true, message: "Invalid email address" });
        }
    };
    const handleUserPass = (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const confirmInput = document.getElementById("confirm");
        // console.log(`Username: ${usernameInput.value}`);
        if (passwordInput.value !== confirmInput.value) {
            passwordInput.value = "";
            confirmInput.value = "";
            setError({ valid: true, message: "Passwords must match" });
        }
        else {
            // console.log(`Password: ${passwordInput.value}`);
            const usernameError = yield helpers_1.default.validateUsername(usernameInput.value);
            const passwordError = helpers_1.default.validatePassword(passwordInput.value);
            const acknowledged = acknowledgements.privacy && acknowledgements.terms;
            if (!usernameError.valid && !passwordError.valid && acknowledged) {
                setUsername(usernameInput.value);
                setPassword(passwordInput.value);
                props.setError({ valid: false });
                const body = {
                    username: usernameInput.value,
                    password: passwordInput.value,
                    email: email,
                    dob: dob,
                };
                (0, utilities_1.post)("/api/user/create", body).then((user) => {
                    console.log(user);
                    props.setUserId(user._id);
                    props.setCreate(false);
                    helpers_1.default.route("/profile");
                });
            }
            else if (usernameError.valid) {
                setError(usernameError);
                usernameInput.value = "";
                passwordInput.value = "";
                confirmInput.value = "";
            }
            else if (passwordError.valid) {
                setError(passwordError);
                passwordInput.value = "";
                confirmInput.value = "";
            }
            else if (!acknowledged) {
                setError({
                    valid: true,
                    message: "Please read and accept our Privacy Policy and Terms of Service",
                });
            }
        }
    });
    (0, react_1.useEffect)(() => {
        setError({ valid: false }); // clear error
    }, [email, dob, username, password]);
    (0, react_1.useEffect)(() => {
        setError(props.error);
    }, []);
    client_socket_1.socket.on("privacy policy", () => setAcknowledgements({ privacy: true, terms: acknowledgements.terms }));
    client_socket_1.socket.on("terms of service", () => setAcknowledgements({ privacy: acknowledgements.privacy, terms: true }));
    return (react_1.default.createElement(react_1.default.Fragment, null,
        policy.show ? (react_1.default.createElement(InfoModal_1.default, { header: policy.header, info: policy.text, setDisplay: setPolicy })) : (react_1.default.createElement(react_1.default.Fragment, null)),
        react_1.default.createElement("div", { className: "centered default-container create-container" },
            react_1.default.createElement("h3", null, "Create an account"),
            email === "" ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("label", { className: "create-label" },
                    "Enter your email address",
                    react_1.default.createElement("input", { id: "email", className: "create-input", onKeyDown: (event) => {
                            const emailInput = document.getElementById("email");
                            if (event.key === "Enter")
                                handleEmail(event, emailInput);
                        }, type: "email" }),
                    react_1.default.createElement(tb_1.TbPlayerTrackNextFilled, { className: "nav-icon u-pointer", onClick: (event) => {
                            const emailInput = document.getElementById("email");
                            handleEmail(event, emailInput);
                        } })),
                react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => props.setCreate(false) }, "Go back"))) : dob === "" ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("label", { className: "create-label" },
                    "What is your date of birth?",
                    react_1.default.createElement("input", { id: "dob", className: "create-input", onKeyDown: (event) => {
                            if (event.key === "Enter") {
                                const dobInput = document.getElementById("dob");
                                handleDob(event, dobInput);
                            }
                        }, type: "date" }),
                    react_1.default.createElement(tb_1.TbPlayerTrackNextFilled, { className: "nav-icon u-pointer", onClick: (event) => {
                            const dobInput = document.getElementById("dob");
                            handleDob(event, dobInput);
                        } })))) : username === "" || password === "" ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("label", { className: "create-label", title: "username" },
                    react_1.default.createElement(md_1.MdInfoOutline, { className: "info-icon-create u-pointer", onClick: (event) => {
                            setPolicy({
                                show: true,
                                header: "Username requirements",
                                text: types_1.USERNAME_INFO,
                            });
                        } }),
                    "Select a username ",
                    react_1.default.createElement("input", { id: "username", className: "create-input", type: "text" })),
                react_1.default.createElement("label", { className: "create-label" },
                    react_1.default.createElement(md_1.MdInfoOutline, { className: "info-icon-create u-pointer", onClick: (event) => {
                            setPolicy({
                                show: true,
                                header: "Password requirements",
                                text: types_1.PASSWORD_INFO,
                            });
                        } }),
                    "Enter a password",
                    react_1.default.createElement("input", { id: "password", className: "create-input", onKeyDown: (event) => __awaiter(void 0, void 0, void 0, function* () {
                            if (event.key === "Enter") {
                                yield handleUserPass(event);
                            }
                        }), type: "password" })),
                react_1.default.createElement("label", { className: "create-label" },
                    "Re-enter your password",
                    " ",
                    react_1.default.createElement("input", { id: "confirm", className: "create-input", onKeyDown: (event) => __awaiter(void 0, void 0, void 0, function* () {
                            if (event.key === "Enter") {
                                yield handleUserPass(event);
                            }
                        }), type: "password" })),
                react_1.default.createElement("label", { className: "create-label" },
                    "I have read and accept the",
                    " ",
                    react_1.default.createElement("a", { className: "u-pointer default-button", onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                            yield (0, utilities_1.get)("/api/privacy").then((res) => {
                                setPolicy({ show: true, header: "Crash Privacy Policy", text: res.text });
                            });
                        }) },
                        "Privacy Policy",
                        " "),
                    "and",
                    " ",
                    react_1.default.createElement("a", { className: "u-pointer default-button", onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                            yield (0, utilities_1.get)("/api/terms").then((res) => {
                                setPolicy({ show: true, header: "Crash Terms of Service", text: res.text });
                            });
                        }) }, "Terms of Service")),
                react_1.default.createElement(tb_1.TbPlayerTrackNextFilled, { className: "nav-icon u-pointer", onClick: (event) => __awaiter(void 0, void 0, void 0, function* () {
                        yield handleUserPass(event);
                    }) }))) : (react_1.default.createElement(react_1.default.Fragment, null)),
            error.valid ? (react_1.default.createElement("p", { className: "error-text" }, error.message)) : (react_1.default.createElement("p", { className: "error-text-hidden" }, "Default")))));
};
exports.default = CreateAccount;
