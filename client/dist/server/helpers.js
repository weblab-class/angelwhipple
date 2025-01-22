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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const Community_1 = __importDefault(require("./models/Community"));
const User_1 = __importDefault(require("./models/User"));
const types_1 = require("./types");
const fs_1 = __importDefault(require("fs"));
/**
 * AWS S3 CONFIG
 */
const IAM_ROLE_ARN = "arn:aws:iam::416540946578:user/crash-admin";
const IAM_SESSION_NAME = "admin-session";
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const sts = new AWS.STS();
const S3_BUCKET_NAME = "crash-images";
/**
 * HELPER FUNCTIONS
 */
const configureAWS = (iamRoleARN, iamRoleSession) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const params = { RoleArn: iamRoleARN, RoleSessionName: iamRoleSession };
        sts.assumeRole(params, (err, data) => {
            if (err) {
                console.error(`[S3] Error assuming IAM role for ${iamRoleARN} - ${iamRoleSession}: ${err}`);
                reject(err);
            }
            else {
                const credentials = data.credentials;
                const newAWSConfig = new AWS.Config({
                    accessKeyId: credentials.AccessKeyId,
                    secretAccessKey: credentials.SecretAccessKey,
                    sessionToken: credentials.SessionToken,
                    region: "us-east-2",
                });
                resolve(newAWSConfig);
            }
        });
    });
});
const uploadImageToS3 = (file, key) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("[S3] Attempting to upload image file");
    //   const config = await configureAWS(IAM_ROLE_ARN, IAM_SESSION_NAME);
    //   const s3 = new AWS.S3(config);
    return new Promise((resolve, reject) => {
        const arrayBuffer = Buffer.from(file.buffer);
        const objectParams = {
            Bucket: S3_BUCKET_NAME,
            Key: key,
            Body: arrayBuffer,
            ContentType: "image/jpeg",
        };
        s3.upload(objectParams, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            const s3Url = data.Location;
            resolve({ url: s3Url, buffer: arrayBuffer });
        });
    });
});
const getImageS3 = (key) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("[S3] Attempting to load image file");
    //   const config = configureAWS(IAM_ROLE_ARN, IAM_SESSION_NAME);
    //   const s3 = new AWS.S3(config);
    return new Promise((resolve, reject) => {
        const objectParams = { Bucket: S3_BUCKET_NAME, Key: key };
        s3.getObject(objectParams, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(data);
        });
    });
});
/**
 * Async helper for making requests to external APIs
 * @param url URL of the desired API endpoint
 * @returns a Promise that resolves when the API call resolves,
 * otherwise the Promise rejects if the call returns an error
 */
const callExternalAPI = (endpoint_url) => {
    return new Promise((resolve, reject) => {
        (0, request_1.default)(endpoint_url, { json: true }, (err, res, body) => {
            if (err)
                reject(err);
            resolve(body);
        });
    });
};
/**
 * TODO: revise
 *
 * Generates a random invitation code for a newly created
 * community, of the format XXXXX-XX
 * @param req
 * @returns
 */
const createCommunity = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let communityType;
    switch (req.body.communityType) {
        case types_1.CommunityType.UNIVERSITY: {
            communityType = "UNIVERSITY";
        }
        case types_1.CommunityType.WORKPLACE: {
            communityType = "WORKPLACE";
        }
        case types_1.CommunityType.LIVING: {
            communityType = "LIVING";
        }
        case types_1.CommunityType.LOCAL: {
            communityType = "LOCAL";
        }
    }
    // generate community code, need some way of checking uniqueness
    let communityCode = "";
    for (let i = 0; i < 5; i++) {
        const rand1 = Math.floor(Math.random() * 10); // generate random int btwn [0, 9] inclusive
        communityCode += `${rand1}`;
    }
    communityCode += `-`;
    let [min, max] = [0, 24];
    for (let i = 0; i < 2; i++) {
        const rand2 = Math.floor(Math.random() * (max - min + 1) + min);
        communityCode += types_1.LETTERS[rand2];
    }
    const community = new Community_1.default({
        name: req.body.communityName,
        owner: req.body.userId,
        members: [req.body.userId],
        admin: [req.body.userId],
        type: communityType,
        code: communityCode,
    });
    return yield community.save().then((newCommunity) => {
        return User_1.default.findByIdAndUpdate(req.body.userId, {
            $push: { communities: newCommunity._id },
        }).then((user) => {
            return {
                community: newCommunity,
                communityCode: newCommunity.code,
                owner: newCommunity.owner,
            };
        });
    });
});
const readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(path, "utf-8", (err, data) => {
            if (err) {
                console.log(`Error reading file ${path}: ${err}`);
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
exports.default = {
    readFile,
    createCommunity,
    callExternalAPI,
    uploadImageToS3,
    getImageS3,
};
