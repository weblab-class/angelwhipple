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
require("../profile/EditModal.css");
const ImCropper_1 = __importDefault(require("../ImCropper"));
require("../ImCropper.css");
const EditModal = (props) => {
    const [file, setFile] = (0, react_1.useState)(undefined);
    const [crop, setCrop] = (0, react_1.useState)({ show: false });
    const [error, setError] = (0, react_1.useState)({ valid: false });
    const update = (nameInput, descriptionInput) => __awaiter(void 0, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append("communityId", props.communityId);
        if (file)
            formData.append("image", file);
        if (nameInput && nameInput.value) {
            formData.append("name", nameInput.value);
            nameInput.value = "";
        }
        if (descriptionInput && descriptionInput.value) {
            formData.append("description", descriptionInput.value);
            descriptionInput.value = "";
        }
        fetch("/api/community/update", { method: "POST", body: formData }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield res.json();
            if (data.valid)
                console.log(data);
        }));
    });
    (0, react_1.useEffect)(() => {
        setError({ valid: false });
    }, [file]);
    return (react_1.default.createElement(react_1.default.Fragment, null, crop.show ? (react_1.default.createElement(ImCropper_1.default, { setError: setError, inputImg: crop.input, setCrop: setCrop, setFile: setFile })) : (react_1.default.createElement("div", { className: "modal-overlay" },
        react_1.default.createElement("div", { id: "reg-container", className: "modal-container" },
            react_1.default.createElement("div", { id: "reg-content", className: "modal-content" },
                react_1.default.createElement("h3", null, "Edit community details"),
                error.valid ? (react_1.default.createElement("p", { className: "error-text" }, error.message)) : (react_1.default.createElement("p", { className: "error-text-hidden" }, "Default")),
                crop.previewSrc ? (react_1.default.createElement("img", { className: "cropper-preview", src: crop.previewSrc })) : (react_1.default.createElement(react_1.default.Fragment, null)),
                react_1.default.createElement("label", null,
                    react_1.default.createElement("input", { type: "file", name: "photo", onChange: (event) => __awaiter(void 0, void 0, void 0, function* () {
                            if (event.target.files && event.target.files[0]) {
                                setCrop({ show: true, input: event.target.files[0] });
                            }
                        }) }),
                    react_1.default.createElement("p", { className: "img-label u-pointer" }, file ? file.name : "Upload a new photo")),
                react_1.default.createElement("label", { className: "edit-label" },
                    "Name",
                    react_1.default.createElement("input", { id: "name", type: "text", className: "edit-input", placeholder: props.name })),
                react_1.default.createElement("div", { className: "multiline-container" },
                    react_1.default.createElement("p", null, "Description"),
                    react_1.default.createElement("textarea", { id: "description", className: "multiline-input", defaultValue: props.decription })),
                react_1.default.createElement("div", { className: "action-container" },
                    react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => __awaiter(void 0, void 0, void 0, function* () {
                            const nameInput = document.getElementById("name");
                            const descriptionInput = document.getElementById("description");
                            yield update(nameInput, descriptionInput);
                            props.setEditing(false);
                        }) }, "submit"),
                    react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => {
                            props.setEditing(false);
                        } }, "exit"))))))));
};
exports.default = EditModal;
