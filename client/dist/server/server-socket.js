"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.init = exports.removeUser = exports.addUser = exports.getCommunityFromSocketID = exports.getSocketFromSocketID = exports.getUserFromSocketID = exports.getSocketFromUserID = void 0;
const socket_io_1 = require("socket.io");
let io;
const userToSocketMap = new Map(); // maps user ID to socket object
const socketToUserMap = new Map(); // maps socket ID to user object
const socketToCommunityMap = new Map(); // maps socket ID to a community object
const getSocketFromUserID = (userid) => userToSocketMap.get(userid);
exports.getSocketFromUserID = getSocketFromUserID;
const getUserFromSocketID = (socketid) => socketToUserMap.get(socketid);
exports.getUserFromSocketID = getUserFromSocketID;
const getSocketFromSocketID = (socketid) => io.sockets.sockets.get(socketid);
exports.getSocketFromSocketID = getSocketFromSocketID;
const getCommunityFromSocketID = (socketid) => socketToCommunityMap.get(socketid);
exports.getCommunityFromSocketID = getCommunityFromSocketID;
const addUser = (user, socket) => {
    const oldSocket = userToSocketMap.get(user._id);
    if (oldSocket && oldSocket.id !== socket.id) {
        // there was an old tab open for this user, force it to disconnect
        // TODO(weblab student): is this the behavior you want?
        oldSocket.disconnect();
        socketToUserMap.delete(oldSocket.id);
    }
    userToSocketMap.set(user._id, socket);
    socketToUserMap.set(socket.id, user);
};
exports.addUser = addUser;
const removeUser = (user, socket) => {
    if (user)
        userToSocketMap.delete(user._id);
    socketToUserMap.delete(socket.id);
};
exports.removeUser = removeUser;
const init = (server) => {
    io = new socket_io_1.Server(server);
    io.on("connection", (socket) => {
        console.log(`socket has connected ${socket.id}`);
        socket.on("disconnect", () => {
            console.log(`socket has disconnected ${socket.id}`);
            const user = (0, exports.getUserFromSocketID)(socket.id);
            if (user !== undefined)
                (0, exports.removeUser)(user, socket);
        });
        // ADD socket.on EVENTS AS NEEDED
        socket.on("login success", () => {
            console.log(`socket has logged in successfully ${socket.id}`);
            io.emit("login success", {});
        });
        socket.on("nav toggle all", () => {
            console.log(`socket has toggled nav bar ${socket.id}`);
            io.emit("nav toggle all", {});
        });
        socket.on("privacy policy", () => {
            console.log(`socket has acknowledged privacy policy ${socket.id}`);
            io.emit("privacy policy", {});
        });
        socket.on("terms of service", () => {
            console.log(`socket has acknowledged terms of service ${socket.id}`);
            io.emit("terms of service", {});
        });
        socket.on("switched communities", (event) => {
            console.log(`socket has switched communities ${socket.id}`);
            io.emit("switched communities", { community: event.community });
        });
        socket.on("create new community", (event) => {
            console.log(`socket has elected to start a new community ${socket.id}`);
            io.emit("create new community");
        });
    });
};
exports.init = init;
const getIo = () => io;
exports.getIo = getIo;
exports.default = {
    getIo: exports.getIo,
    init: exports.init,
    removeUser: exports.removeUser,
    addUser: exports.addUser,
    getSocketFromSocketID: exports.getSocketFromSocketID,
    getUserFromSocketID: exports.getUserFromSocketID,
    getSocketFromUserID: exports.getSocketFromUserID,
};
