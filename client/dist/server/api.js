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
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const server_socket_1 = __importDefault(require("./server-socket"));
const User_1 = __importDefault(require("./models/User"));
const Community_1 = __importDefault(require("./models/Community"));
const router = express_1.default.Router();
const AWS = require("aws-sdk");
const node_mailjet_1 = __importDefault(require("node-mailjet"));
const helpers_1 = __importDefault(require("./helpers"));
const types_1 = require("./types");
const path_1 = __importDefault(require("path"));
/**
 * CONFIG
 */
dotenv_1.default.config({});
const { v4: uuidv4 } = require("uuid"); // generates unique keys
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory as Buffers
const mailjet_api = node_mailjet_1.default.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY, { options: { timeout: 300000 } } // 5 min timeout (ms)
);
/**
 * AUTH
 */
router.post("/login", auth_1.default.login);
router.post("/logout", auth_1.default.logout);
router.get("/whoami", (req, res) => {
    if (!req.user) {
        // Not logged in.
        return res.send({});
    }
    res.send(req.user);
});
router.post("/initsocket", (req, res) => {
    // do nothing if user not logged in
    if (req.user) {
        const socket = server_socket_1.default.getSocketFromSocketID(req.body.socketid);
        if (socket !== undefined)
            server_socket_1.default.addUser(req.user, socket);
        AWS.config.getCredentials(function (err) {
            if (err)
                console.log(err.stack);
            // credentials not loaded
            else {
                console.log(`AWS Access key ID: ${AWS.config.credentials.accessKeyId}`);
                console.log(`AWS Secret access key: ${AWS.config.credentials.secretAccessKey}`);
            }
        });
    }
    res.send({});
});
// |--------------------------|
// | custom API methods below!|
// |--------------------------|
/**
 * USERS, ACCOUNTS, & VERIFICATION
 */
router.post("/user/create", auth_1.default.createUser);
router.post("/user/linkedin", auth_1.default.login);
router.post("/user/consolidate", auth_1.default.consolidateProfiles);
router.get("/user/exists", auth_1.default.existingUser);
router.get("/user/linkedin", auth_1.default.linkedin);
router.get("/user/unique", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findOne({ username: req.query.username }).then((user) => {
        if (user)
            res.send({ unique: false });
        else
            res.send({ unique: true });
    });
}));
router.get("/user/fetch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[MONGODB] Requesting user: ${req.query.id}`);
    yield User_1.default.findById(req.query.id).then((user) => {
        console.log(`[MONGODB] Got user: ${user}`);
        if (user !== null) {
            res.send({ valid: true, user: user });
        }
        else {
            res.send({ valid: false, user: undefined });
        }
    });
}));
router.post("/user/verification", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body.messages;
    const request = mailjet_api.post("send", { version: "v3.1" }).request(body);
    yield request
        .then((result) => {
        console.log(`[MAILJET] Sent successfully: ${result}`);
        res.send({ sent: true });
    })
        .catch((err) => {
        console.log(`[MAILJET] API error: ${err}`);
        res.send({ sent: false, error: err });
    });
}));
router.get("/user/verified", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.id;
    console.log(`[MONGODB] Verifying user: ${userId}`);
    User_1.default.findByIdAndUpdate(userId, { verified: true }).then((user) => {
        server_socket_1.default.getIo().emit("verified", { userId: userId });
        res.redirect("/verified");
    });
}));
router.post("/user/update", upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [params, event] = [{}, {}];
    if (req.files && req.files[0]) {
        const key = `profilePhotos/${req.body.userId}_${uuidv4()}`;
        const file = req.files[0];
        try {
            const { url, buffer } = yield helpers_1.default.uploadImageToS3(file, key);
            params["aws_img_key"] = key;
            event["image"] = buffer;
        }
        catch (error) {
            console.error(`[S3] Error uploading image: ${error}`);
            res.status(500).send({ valid: false });
        }
    }
    if (req.body.name) {
        params["name"] = req.body.name;
        event["name"] = req.body.name;
    }
    if (req.body.username) {
        params["username"] = req.body.username;
        event["username"] = req.body.username;
    }
    if (req.body.bio) {
        params["bio"] = req.body.bio;
        event["bio"] = req.body.bio;
    }
    if (Object.keys(params).length > 0) {
        User_1.default.findByIdAndUpdate(req.body.userId, params).then((user) => {
            server_socket_1.default.getIo().emit("updated user", event);
            res.send({ valid: true, user: user });
        });
    }
}));
router.get("/user/loadphoto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findById(req.query.userId).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user === null || user === void 0 ? void 0 : user.aws_img_key) {
            try {
                const buffer = yield helpers_1.default.getImageS3(user.aws_img_key.toString());
                res.send({ valid: true, buffer: buffer });
            }
            catch (error) {
                console.error(`[S3] Error loading image from S3: ${error}`);
                res.status(500).send({ valid: false });
            }
        }
        else {
            res.send({ valid: false });
        }
    }));
}));
// return a list of community objects associated to a single user
router.get("/user/communities", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.findById(req.query.id).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user && user.communities.length > 0) {
            const communityInfos = [];
            for (const communityId of user.communities) {
                yield Community_1.default.findById(communityId).then((communityInfo) => {
                    communityInfos.push(communityInfo);
                });
            }
            res.send({ valid: true, communities: communityInfos });
        }
        else
            res.send({ valid: false, communities: [] });
    }));
}));
/**
 * COMMUNITIES
 */
router.post("/community/description", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Community_1.default.findByIdAndUpdate(req.body.communityId, { description: req.body.description }).then((community) => {
        server_socket_1.default.getIo().emit("community description", { description: req.body.description });
        res.send({ updated: community });
    });
}));
router.post("/community/update", upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [params, event] = [{}, {}];
    if (req.files && req.files[0]) {
        const key = `communityPhotos/${req.body.communityId}_${uuidv4()}`;
        const file = req.files[0];
        try {
            const { url, buffer } = yield helpers_1.default.uploadImageToS3(file, key);
            params["aws_img_key"] = key;
            event["image"] = buffer;
        }
        catch (error) {
            console.error(`[S3] Error uploading image: ${error}`);
            res.status(500).send({ valid: false, community: undefined });
        }
    }
    if (req.body.name) {
        params["name"] = req.body.name;
        event["name"] = req.body.name;
    }
    if (req.body.description) {
        params["description"] = req.body.description;
        event["description"] = req.body.description;
    }
    if (Object.keys(params).length > 0) {
        Community_1.default.findByIdAndUpdate(req.body.communityId, params).then((community) => {
            server_socket_1.default.getIo().emit("updated community", event);
            res.send({ valid: true, community: community });
        });
    }
    else
        res.send({ valid: true, community: undefined });
}));
router.get("/community/loadphoto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Community_1.default.findById(req.query.communityId).then((community) => __awaiter(void 0, void 0, void 0, function* () {
        if (community === null || community === void 0 ? void 0 : community.aws_img_key) {
            try {
                const buffer = yield helpers_1.default.getImageS3(community.aws_img_key.toString());
                res.send({ valid: true, buffer: buffer });
            }
            catch (error) {
                console.error(`[S3] Error loading image from S3: ${error}`);
                res.status(500).send({ valid: false });
            }
        }
        else {
            res.send({ valid: false });
        }
    }));
}));
router.get("/community/fetch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Community_1.default.findById(req.query.communityId).then((community) => {
        if (community !== undefined)
            res.send({ valid: true, community: community });
        else
            res.send({ valid: false, community: undefined });
    });
}));
router.post("/community/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield helpers_1.default.createCommunity(req).then((communityInfo) => {
        server_socket_1.default
            .getIo()
            .emit("new community", { owner: communityInfo.owner, code: communityInfo.communityCode });
        res.send(communityInfo.community);
    });
}));
router.post("/community/join", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Community_1.default.find({ code: req.body.code }).then((communities) => __awaiter(void 0, void 0, void 0, function* () {
        if (communities.length !== 0) {
            const dstCommunity = communities[0]; // only 1 unique join code per community
            yield Community_1.default.findById(dstCommunity._id).then((community) => __awaiter(void 0, void 0, void 0, function* () {
                if (community === null || community === void 0 ? void 0 : community.members.includes(req.body.userId)) {
                    // user already joined community
                    res.send({ valid: true, community: community });
                }
                else {
                    yield Community_1.default.findByIdAndUpdate(dstCommunity._id, {
                        $push: { members: req.body.userId },
                    }).then((updatedCommunity) => __awaiter(void 0, void 0, void 0, function* () {
                        yield User_1.default.findByIdAndUpdate(req.body.userId, {
                            $push: { communities: updatedCommunity === null || updatedCommunity === void 0 ? void 0 : updatedCommunity._id },
                        }).then((updatedUser) => {
                            server_socket_1.default.getIo().emit("joined community", {
                                communityId: updatedCommunity === null || updatedCommunity === void 0 ? void 0 : updatedCommunity._id,
                                user: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id,
                            });
                            res.send({ valid: true, community: updatedCommunity });
                        });
                    }));
                }
            }));
        }
        else {
            res.send({ valid: false, community: undefined });
        }
    }));
}));
router.get("/community/join", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect(`/?joined_community=true&community_code=${req.query.code}`);
}));
/**
 * SEARCH
 */
router.post("/search/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const regex = new RegExp(req.body.query, "i");
    User_1.default.find({ name: { $regex: regex } }).then((users) => {
        console.log(users);
    });
    User_1.default.find({ username: { $regex: regex } }).then((users) => {
        console.log(users);
    });
}));
router.post("/search/communities", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const regex = new RegExp(req.body.query, "i");
    Community_1.default.find({ name: { $regex: regex } }).then((communities) => {
        console.log(communities);
    });
}));
router.get("/privacy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filepath = path_1.default.join(process.cwd(), types_1.PRIVACY_POLICY);
    const text = yield helpers_1.default.readFile(filepath);
    res.send({ text: text });
}));
router.get("/terms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filepath = path_1.default.join(process.cwd(), types_1.SERVICE_TERMS);
    const text = yield helpers_1.default.readFile(filepath);
    res.send({ text: text });
}));
// anything else falls to this "not found" case
router.all("*", (req, res) => {
    const msg = `Api route not found: ${req.method} ${req.url}`;
    res.status(404).send({ msg });
});
exports.default = router;
