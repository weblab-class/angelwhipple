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
require("./ImCropper.css");
const react_image_crop_1 = require("react-image-crop");
require("react-image-crop/dist/ReactCrop.css");
const helpers_1 = __importDefault(require("../helpers"));
const MIN_DIMENSION = 200;
const ASPECT_RATIO = 1;
const ImCropper = (props) => {
    const [src, setSrc] = (0, react_1.useState)("");
    const [crop, setCrop] = (0, react_1.useState)();
    const cropImage = () => __awaiter(void 0, void 0, void 0, function* () {
        const image = document.getElementById("cropper-photo");
        const canvas = document.createElement("canvas");
        canvas.width = MIN_DIMENSION;
        canvas.height = MIN_DIMENSION;
        helpers_1.default.drawCropCanvas(image, canvas, (0, react_image_crop_1.convertToPixelCrop)(crop, image.width, image.height));
        const dataUrl = canvas.toDataURL("image/jpeg");
        props.setFile(yield helpers_1.default.fileFromURL(dataUrl, props.inputImg.name));
        props.setCrop({
            show: false,
            input: props.inputImg,
            previewSrc: dataUrl,
        });
    });
    (0, react_1.useEffect)(() => {
        if (props.inputImg) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target)
                    setSrc(event.target.result);
            };
            reader.readAsDataURL(props.inputImg);
            const elem = document.getElementById("cropper-photo");
            elem.onload = (event) => {
                if (elem.naturalWidth < MIN_DIMENSION || elem.naturalHeight < MIN_DIMENSION) {
                    setSrc("");
                    const msg = `Image must be atleast ${MIN_DIMENSION} x ${MIN_DIMENSION} pixels`;
                    props.setError({ valid: true, message: msg });
                    props.setCrop({ show: false });
                }
                else {
                    const cropObj = (0, react_image_crop_1.makeAspectCrop)({ unit: "%", width: 25 }, ASPECT_RATIO, elem.width, elem.height);
                    const centeredCrop = (0, react_image_crop_1.centerCrop)(cropObj, elem.width, elem.height);
                    setCrop(centeredCrop);
                }
            };
        }
    }, []);
    return (react_1.default.createElement("div", { className: "modal-overlay" },
        react_1.default.createElement("div", { className: "modal-container" },
            react_1.default.createElement("div", { className: "modal-content" },
                react_1.default.createElement("h4", null, "Crop image"),
                react_1.default.createElement(react_image_crop_1.ReactCrop, { crop: crop, circularCrop: true, keepSelection: true, aspect: ASPECT_RATIO, minWidth: MIN_DIMENSION, onChange: (pixelCrop, percentCrop) => setCrop(percentCrop) },
                    react_1.default.createElement("img", { id: "cropper-photo", src: src, alt: "Croppable Photo", className: "cropper-photo" })),
                react_1.default.createElement("div", { className: "action-container" },
                    react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => props.setCrop({ show: false }) }, "back"),
                    react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => __awaiter(void 0, void 0, void 0, function* () { return yield cropImage(); }) }, "done"))))));
};
exports.default = ImCropper;
