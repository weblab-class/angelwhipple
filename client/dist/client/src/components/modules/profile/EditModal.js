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
require("../modals/Modal.css");
require("../modals/Modal.css");
const helpers_1 = __importDefault(require("../../helpers"));
const md_1 = require("react-icons/md");
const types_1 = require("../../types");
const ImCropper_1 = __importDefault(require("../ImCropper"));
const EditModal = (props) => {
    const [file, setFile] = (0, react_1.useState)(undefined);
    const [crop, setCrop] = (0, react_1.useState)({ show: false });
    const [error, setError] = (0, react_1.useState)({ valid: false });
    const updateProfile = (nameInput, usernameInput, bioInput, file) => __awaiter(void 0, void 0, void 0, function* () {
        const usernameError = yield helpers_1.default.validateUsername(usernameInput.value);
        const formData = new FormData();
        formData.append("userId", props.userId);
        if (nameInput.value)
            formData.append("name", nameInput.value);
        if (usernameInput.value && !usernameError.valid) {
            formData.append("username", usernameInput.value);
        }
        else
            setError(usernameError);
        if (bioInput.value)
            formData.append("bio", bioInput.value);
        if (file)
            formData.append("image", file);
        fetch("/api/user/update", { method: "POST", body: formData }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield res.json();
        }));
    });
    (0, react_1.useEffect)(() => {
        setError({ valid: false });
    }, [file, props.username]);
    return (react_1.default.createElement(react_1.default.Fragment, null, crop.show ? (react_1.default.createElement(ImCropper_1.default, { inputImg: crop.input, setCrop: setCrop, setFile: setFile, setError: setError })) : (react_1.default.createElement("div", { className: "modal-overlay" },
        react_1.default.createElement("div", { className: "modal-container" },
            react_1.default.createElement("div", { className: "modal-content" },
                react_1.default.createElement("h3", null, "Edit profile"),
                error.valid ? (react_1.default.createElement("p", { className: "error-text" }, error.message)) : (react_1.default.createElement("p", { className: "error-text-hidden" }, "Default")),
                crop.previewSrc ? (react_1.default.createElement("img", { src: crop.previewSrc, className: "cropper-preview" })) : (react_1.default.createElement(react_1.default.Fragment, null)),
                react_1.default.createElement("label", { className: "img-label u-pointer" },
                    react_1.default.createElement("input", { id: "image", type: "file", onChange: (event) => {
                            if (event.target.files && event.target.files[0]) {
                                setCrop({ show: true, input: event.target.files[0] });
                            }
                        } }),
                    react_1.default.createElement("p", null, file ? file.name : "Upload a new photo")),
                react_1.default.createElement("label", { className: "edit-label" },
                    "Full name",
                    react_1.default.createElement("input", { id: "name", type: "text", className: "edit-input", placeholder: props.name })),
                react_1.default.createElement("label", { className: "edit-label" },
                    react_1.default.createElement(md_1.MdInfoOutline, { className: "info-icon-profile u-pointer", onClick: (event) => {
                            props.setEditing(false);
                            props.setRequirements({
                                show: true,
                                header: "Username requirements",
                                text: types_1.USERNAME_INFO,
                            });
                        } }),
                    "Username",
                    react_1.default.createElement("input", { id: "username", type: "text", className: "edit-input", placeholder: props.username })),
                react_1.default.createElement("div", { className: "multiline-container" },
                    react_1.default.createElement("p", null, "Bio"),
                    react_1.default.createElement("textarea", { id: "bio", className: "multiline-input", defaultValue: props.bio })),
                react_1.default.createElement("div", { className: "action-container" },
                    react_1.default.createElement("button", { onClick: (event) => __awaiter(void 0, void 0, void 0, function* () {
                            const nameInput = document.getElementById("name");
                            const usernameInput = document.getElementById("username");
                            const bioInput = document.getElementById("bio");
                            yield updateProfile(nameInput, usernameInput, bioInput, file);
                            props.setEditing(false);
                        }), className: "default-button u-pointer" }, "submit"),
                    react_1.default.createElement("button", { onClick: (event) => {
                            props.setEditing(false);
                        }, className: "default-button u-pointer" }, "close"))))))));
};
exports.default = EditModal;
