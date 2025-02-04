"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
// https://vitejs.dev/config/
const path = require("path");
const entryFile = path.resolve(__dirname, "client", "src", "index.tsx");
const outputDir = path.resolve(__dirname, "client", "dist");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    server: {
        open: true,
        port: 5050,
        proxy: {
            "/api": "http://localhost:3000",
            "/socket.io/*": {
                target: "http://localhost:3000",
                ws: true,
            },
        },
    },
    build: {
        rollupOptions: {
            input: entryFile, // Update this path based on your project structure
            output: { entryFileNames: "bundle.js", format: "commonjs", dir: outputDir },
        },
        chunkSizeWarningLimit: 1000,
        modulePreload: { polyfill: true },
    },
    resolve: {
        extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    },
});
