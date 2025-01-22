"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const express_session_1 = __importDefault(require("express-session")); // Allows us to store information about a client
const mongoose_1 = __importDefault(require("mongoose")); // Wrapper around MongoDB
const morgan_1 = __importDefault(require("morgan")); // Request logger (https://github.com/expressjs/morgan). Can be removed if you wish.
const path_1 = __importDefault(require("path")); // Allows us to retrieve file paths
const auth_1 = __importDefault(require("./auth")); // weblab authentication helper
const server_socket_1 = __importDefault(require("./server-socket")); // websockets
const api_1 = __importDefault(require("./api"));
const login_1 = __importDefault(require("./login"));
// Loads environmental variables
require("dotenv").config({}); // Allows us to use environmental variables
// Server configuration below
const mongoConnectionURL = process.env.MONGO_SRV;
const databaseName = "intern-io";
if (mongoConnectionURL === undefined) {
    throw new Error("Please add the MongoDB connection SRV as 'MONGO_SRV'");
}
mongoose_1.default
    .connect(mongoConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: databaseName,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));
// Create a new Express server
const app = (0, express_1.default)();
// Middleware setup.
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev")); // To change the format of logs: https://github.com/expressjs/morgan#predefined-formats
const sessionSecret = process.env.SESSION_SECRET;
if (sessionSecret === undefined) {
    throw new Error("Please add a session secret as 'SESSION_SECRET'");
}
app.use((0, express_session_1.default)({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
}));
app.use(auth_1.default.populateCurrentUser);
app.use("/api", api_1.default);
// TODO: build API router for login to different services (Linkedin, Facebook, AirBnb, etc)
app.use("/login", login_1.default);
// Serves the frontend code
const reactPath = path_1.default.resolve(__dirname, "..", "client", "dist");
app.use(express_1.default.static(reactPath));
// Fallbacks
// for all other routes, render index.html and let react router handle it
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(reactPath, "index.html"));
});
// Optional TODO (on your own) - Add an error interface.
app.use((err, _req, res) => {
    const status = err.status || 500;
    if (status === 500) {
        // 500 means Internal Server Error
        console.log("The server errored when processing a request!");
        console.log(err);
    }
    res.status(500);
    res.send({
        message: err.message,
        status,
    });
});
const port = process.env.PORT || 3000;
const server = http_1.default.createServer(app);
server_socket_1.default.init(server);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
