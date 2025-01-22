"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    googleid: { type: String, required: false },
    linkedinid: { type: String, required: false },
    originid: { type: String, required: false },
    email: { type: String, required: true },
    hashed_pw: { type: String, required: false },
    pw_salt: { type: String, required: false },
    dob: { type: String, required: false },
    bio: { type: String, required: false },
    verified: { type: Boolean, default: false },
    communities: [String], // array of community IDs
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
    aws_img_key: { type: String, required: false },
    subscription_tier: { type: String, default: "BASIC" },
});
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.default = UserModel;
