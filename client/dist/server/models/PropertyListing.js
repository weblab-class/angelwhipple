"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PropertyListingSchema = new mongoose_1.Schema({
    title: String,
    date_posted: String,
    category: { type: String, default: "LEASE" },
    availability: {
        type: {
            start: { type: String, required: true },
            end: { type: String, required: false },
            flexible: { type: Boolean, required: true },
        },
    },
    lease_term: { type: String, required: true },
    details: {
        type: {
            location: String,
            rent: Number,
            bed: Number,
            bath: Number,
            footage: Number, // square ft
            furnished: Boolean,
            aws_img_keys: [String],
        },
        required: true,
    },
    sublease_details: {
        type: {
            group: { type: Boolean, default: false },
            members: [String],
            crash_property_id: { type: String, required: false }, // for special support when subleasing Crash verified properties/listings
            external_property_details: {
                type: { name: String, email: String, phone: String, website_url: String },
                required: false,
            },
        },
        required: false,
    },
});
const PropertyListingModel = (0, mongoose_1.model)("PropertyListing", PropertyListingSchema);
exports.default = PropertyListingModel;
