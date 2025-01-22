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
exports.GMAPS_API_KEY = void 0;
const google_auth_library_1 = require("google-auth-library");
const User_1 = __importDefault(require("./models/User"));
const server_socket_1 = __importDefault(require("./server-socket"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const url_1 = __importDefault(require("url"));
const types_1 = require("./types");
const helpers_1 = __importDefault(require("./helpers"));
dotenv_1.default.config({});
exports.GMAPS_API_KEY = process.env.GMAPS_API_KEY;
// create a new OAuth client used to verify google sign-in
const GOOGLE_CLIENT_ID = "281523827651-6p2ui3h699r3378i6emjqdm4o68hhnbi.apps.googleusercontent.com";
const LINKEDIN_CLIENT_ID = "78kxc3fzhb4yju";
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = `${types_1.DOMAIN}/api/user/linkedin`;
const SALT_ROUNDS = 10;
const client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
const { v4: uuidv4 } = require("uuid"); // for generating unique keys
const bcrypt = require("bcrypt");
const verify = (token) => {
    return client
        .verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
    })
        .then((ticket) => ticket.getPayload());
};
/**
 * TODO
 * @param req
 * @param res
 */
const existingUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    User_1.default.findOne({ email: (_a = req.query.email) === null || _a === void 0 ? void 0 : _a.toString(), originid: { $exists: true } }).then((user) => {
        if (user !== null) {
            res.send({ exists: true });
        }
        else {
            res.send({ exists: false });
        }
    });
});
/**
 * TODO
 * @param req
 * @param res
 */
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt.genSalt(SALT_ROUNDS); // encryption
    const hashedPassword = yield bcrypt.hash(req.body.password, salt);
    const newUser = new User_1.default({
        email: req.body.email,
        dob: req.body.dob,
        name: `Crash User`,
        username: req.body.username,
        hashed_pw: hashedPassword,
        pw_salt: salt,
        originid: uuidv4().toString(),
    });
    yield newUser.save().then((user) => {
        res.send(user);
    });
});
/**
 * TODO
 * @param user
 * @returns
 */
const getOrCreateUser_GOOGLE = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return User_1.default.findOne({ googleid: user.sub }).then((existingUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (existingUser !== null && existingUser !== undefined)
            return existingUser;
        const uniqueId = uuidv4().toString();
        const newUser = new User_1.default({
            name: user.name,
            username: `user_${uniqueId.slice(0, 8)}`,
            googleid: user.sub,
            email: user.email,
        });
        return yield newUser.save();
    }));
});
/**
 * TODO
 * @param req
 * @returns
 */
const getOrCreateUser_LINKEDIN = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.default.findOne({ email: req.body.email, linkedinid: { $exists: true } }).then((existingUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (existingUser !== null && existingUser !== undefined)
            return existingUser;
        const uniqueId = uuidv4().toString();
        const newUser = new User_1.default({
            name: req.body.name,
            username: `user_${uniqueId.slice(0, 8)}`,
            linkedinid: req.body.linkedinid,
            email: req.body.email,
        });
        return yield newUser.save();
    }));
});
/**
 * TODO
 * @param req
 * @returns
 */
const loginUser_ORIGIN = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    return yield User_1.default.findOne({
        email: (_b = req.body.email) === null || _b === void 0 ? void 0 : _b.toString(),
        originid: { $exists: true },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        const hashedEnteredPassword = yield bcrypt.hash(req.body.password, user.pw_salt);
        if (hashedEnteredPassword === user.hashed_pw) {
            return { user: user, status: { valid: true, account: user, message: "" } };
        }
        else {
            return {
                user: undefined,
                status: {
                    valid: false,
                    account: undefined,
                    message: "Incorrect password, please try again",
                },
            };
        }
    }));
});
/**
 * TODO
 * Google-Linkedin account consolidation
 * @param user
 */
const consolidateProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fields = ["linkedinid", "googleid", "originid"];
    // extract ALL original fields from the currently active profile: use User.findbyID()
    // for each additional chosen profile, set missing fields one by one
    const originalUser = yield User_1.default.findById(req.body.id);
    // extract user selected profiles for consolidation only
    const chosenProfiles = fields.filter((field) => req.body.profiles.includes(field));
    for (const field of chosenProfiles) {
        console.log(field);
        const query = { email: req.body.email, [field]: { $exists: true } };
        yield User_1.default.findOneAndDelete(query).then((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user) {
                user.schema.eachPath((path) => __awaiter(void 0, void 0, void 0, function* () {
                    if ((originalUser === null || originalUser === void 0 ? void 0 : originalUser.get(path)) === undefined && user.get(path) !== undefined) {
                        yield User_1.default.findByIdAndUpdate(req.body.id, { [path]: user[path] });
                    }
                }));
            }
        }));
    }
    const consolidatedUser = yield User_1.default.findById(req.body.id);
    res.send(consolidatedUser);
});
/**
 * TODO
 * @param user
 * @returns
 */
const countProfiles = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const fields = ["linkedinid", "googleid", "originid"];
    const currentProfile = fields.filter((field) => user.get(field) !== undefined)[0];
    const query = { email: user.email, [currentProfile]: { $ne: user[currentProfile] } };
    return User_1.default.find(query).then((additionalUsers) => {
        console.log(`[MONGODB] Found extra profiles: ${additionalUsers}`);
        const response = { eligible: additionalUsers.length > 0, profiles: additionalUsers };
        return response;
    });
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[BACKEND] Reached user profile consolidation check`);
    if ("linkedinid" in req.body) {
        const linkedinUser = yield getOrCreateUser_LINKEDIN(req);
        console.log(`Found MongoDB user: ${linkedinUser}`);
        res.send({
            user: linkedinUser,
            consolidate: yield countProfiles(linkedinUser),
        });
    }
    else if ("originid" in req.body) {
        const { user, status } = yield loginUser_ORIGIN(req);
        if (status.valid && user !== undefined) {
            console.log(`Logged in user: ${user.username}`);
            server_socket_1.default.getIo().emit("origin", { user: user, consolidate: yield countProfiles(user) });
            res.send({
                valid: status.valid,
                account: status.account,
            });
        }
        else {
            res.send({ valid: status.valid, message: status.message });
        }
    }
    else {
        verify(req.body.token)
            .then((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user === undefined)
                return;
            const googleUser = yield getOrCreateUser_GOOGLE(user);
            return googleUser;
        }))
            .then((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user === null || user === undefined) {
                throw new Error("Unable to retrieve user.");
            }
            req.session.user = user;
            res.send({ user: user, consolidate: yield countProfiles(user) });
        }))
            .catch((err) => {
            console.log(`Failed to login: ${err}`);
            res.status(401).send({ err });
        });
    }
});
const logout = (req, res) => {
    req.session.user = undefined;
    res.send({});
};
const linkedin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("[LINKEDIN] Initializing OAuth flow");
    // LINKEDIN OAUTH STEP 1: AUTHORIZATION CODE
    const query = url_1.default.parse(req.url, true).query;
    const auth_code = query.code;
    console.log(`[LINKEDIN] Authorization code: ${auth_code}`);
    console.log("[LINKEDIN] Requesting access token");
    // LINKEDIN OAUTH STEP 2: TOKEN REQUEST
    let endpoint_url = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${auth_code}&client_id=${LINKEDIN_CLIENT_ID}&client_secret=${LINKEDIN_CLIENT_SECRET}&redirect_uri=${LINKEDIN_REDIRECT_URI}`;
    yield helpers_1.default
        .callExternalAPI(endpoint_url)
        .then((token_response) => __awaiter(void 0, void 0, void 0, function* () {
        const access_token = token_response.access_token; // default: 60 day lifespan
        console.log(`[LINKEDIN] Access token: ${access_token}`);
        // LINKEDIN OAUTH STEP 3: AUTHENTICATED REQUESTS FOR USER INFORMATION
        console.log(`[LINKEDIN] Attempting user info requests with token ${access_token}`);
        endpoint_url = `https://api.linkedin.com/v2/me`;
        const headers = { Authorization: `Bearer ${access_token}` };
        const axiosConfig = { headers };
        axios_1.default.get(endpoint_url, axiosConfig).then((response) => {
            const liteProfile = response.data;
            const [firstName, lastName, linkedinId] = [
                liteProfile.localizedFirstName,
                liteProfile.localizedLastName,
                liteProfile.id,
            ];
            console.log(`[LINKEDIN] Name: ${firstName} ${lastName}, Linkedin ID: ${linkedinId}`);
            endpoint_url = `https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))`;
            axios_1.default.get(endpoint_url, axiosConfig).then((response) => {
                // const email = JSON.stringify(response.data); // convert Response Object back into readable JSON
                const emailAddress = response.data.elements[0]["handle~"]["emailAddress"];
                console.log(`[LINKEDIN] Email address: ${emailAddress}`);
                endpoint_url = `https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`;
                axios_1.default.get(endpoint_url, axiosConfig).then((response) => {
                    const profilePictureUrl = response.data.profilePicture["displayImage~"]["elements"][0]["identifiers"][0]["identifier"];
                    console.log(`[LINKEDIN] Profile picture url: ${profilePictureUrl}`);
                    const loginUrl = `${types_1.DOMAIN}/api/login`;
                    const loginBody = {
                        name: `${firstName} ${lastName}`,
                        linkedinid: linkedinId,
                        email: emailAddress,
                        pfp: profilePictureUrl,
                    };
                    axios_1.default.post(loginUrl, loginBody).then((response) => {
                        // const readable = JSON.stringify(response.data);
                        server_socket_1.default.getIo().emit("linkedin", response.data);
                    });
                });
            });
        });
    }))
        .catch((token_error) => {
        console.log(`[LINKEDIN] Token response error: ${token_error}`);
        res.send(token_error);
    });
    res.redirect("/"); // redirects back to homepage
});
const populateCurrentUser = (req, _res, next) => {
    req.user = req.session.user;
    next();
};
// We use any because
const ensureLoggedIn = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ err: "Not logged in." });
    }
    next();
};
exports.default = {
    ensureLoggedIn,
    populateCurrentUser,
    login,
    logout,
    linkedin,
    consolidateProfiles,
    createUser,
    existingUser,
};
