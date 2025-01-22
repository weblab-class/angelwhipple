"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMAIN = exports.SERVICE_TERMS = exports.PRIVACY_POLICY = exports.LETTERS = exports.CommunityType = void 0;
var CommunityType;
(function (CommunityType) {
    CommunityType[CommunityType["UNIVERSITY"] = 0] = "UNIVERSITY";
    CommunityType[CommunityType["WORKPLACE"] = 1] = "WORKPLACE";
    CommunityType[CommunityType["LIVING"] = 2] = "LIVING";
    CommunityType[CommunityType["LOCAL"] = 3] = "LOCAL";
})(CommunityType || (exports.CommunityType = CommunityType = {}));
exports.LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
exports.PRIVACY_POLICY = "client/src/assets/privacy-policy.txt";
exports.SERVICE_TERMS = "client/src/assets/terms-of-service.txt";
// export const DOMAIN = "https://crashmit-6571970b206b.herokuapp.com";
// export const DOMAIN = "http://localhost:5050/api/user/linkedin"
exports.DOMAIN = "https://angelwhipple.onrender.com";
