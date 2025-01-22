"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommunitySchema = new mongoose_1.Schema({
    name: String,
    owner: String,
    admin: [String],
    members: [String],
    type: String,
    code: String, // join code
    aws_img_key: { type: String, required: false },
    description: { type: String, required: false },
    rules: { type: String, required: false },
});
const CommunityModel = (0, mongoose_1.model)("Community", CommunitySchema);
exports.default = CommunityModel;
