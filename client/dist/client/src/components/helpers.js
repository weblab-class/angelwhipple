"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const router_1 = require("@reach/router");
const utilities_1 = require("../utilities");
/**
 * HELPERS
 */
const route = (path) => {
    (0, router_1.useNavigate)()(path);
};
// PASSWORD CONSTRAINTS: len <= 8 chars, <= 1 special char, <= 1 letter, <= 1 number
const validatePassword = (pass) => {
    let valid = true;
    if (pass.length < 8) {
        return { valid: true, message: "Password must be atleast 8 characters" };
    }
    if (pass.search(/[a-zA-Z]/g) === -1) {
        return { valid: true, message: "Password must contain letter(s)" };
    }
    if (pass.search(/[0-9]/g) === -1) {
        console.log(`Password missing numbers`);
        return { valid: true, message: "Password must contain number(s)" };
    }
    if (pass.search(/[^a-zA-Z0-9]/g) === -1) {
        console.log(`Password missing special characters`);
        return { valid: true, message: "Password must contain special character(s)" };
    }
    return { valid: false };
};
// AGE CONSTRAINT: age >= 16
const validateAge = (birthDate) => {
    const birthYear = parseInt(birthDate.substring(0, 4));
    const valid = types_1.THIS_YEAR - birthYear >= 16;
    return valid;
};
// USERNAME CONSTRAINTS: unique, len >= 3, 0 special characters (REVISE)
const validateUsername = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const match = /^[a-z0-9]+$/i.test(user);
    const length = user.length >= 3;
    if (!match || !length)
        return { valid: true, message: "Invalid username" };
    return yield (0, utilities_1.get)("/api/user/unique", { username: user }).then((res) => {
        if (!res.unique)
            return { valid: true, message: "Username taken" };
        else
            return { valid: false };
    });
});
// EMAIL CONSTRAINTS:
const validateEmail = (emailAddress) => {
    const valid = types_1.VALID_DOMAINS.filter((domain) => emailAddress.endsWith(domain));
    return valid.length !== 0;
};
/**
 * IMAGE CROP
 */
const drawCropCanvas = (image, canvas, crop) => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = "high";
        ctx.save();
        const cropX = crop.x * scaleX;
        const cropY = crop.y * scaleY;
        // Move crop origin to canvas origin (0, 0)
        ctx.translate(-cropX, -cropY);
        ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);
        ctx.restore();
    }
    else
        console.log("No 2d context");
};
/**
 * FILE MANIPULATION
 */
const fileFromURL = (url, filename) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    const blob = yield response.blob();
    const file = new File([blob], filename, { type: blob.type });
    return file;
});
const URLFromFile = (file) => {
    const reader = new FileReader();
    let url = "";
    reader.onload = (event) => {
        var _a;
        url = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
    };
    reader.readAsDataURL(file);
    return url;
};
const URLFromBuffer = (buffer) => {
    const arrayBuffer = Uint8Array.from(buffer).buffer;
    const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
};
exports.default = {
    route,
    validateUsername,
    validatePassword,
    validateAge,
    validateEmail,
    drawCropCanvas,
    fileFromURL,
    URLFromFile,
    URLFromBuffer,
};
