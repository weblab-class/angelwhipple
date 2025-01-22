"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const utilities_1 = require("../../../utilities");
require("../modals/Modal.css");
require("./Merge.css");
const Merge = (props) => {
    return (react_1.default.createElement("div", { className: "modal-overlay" },
        react_1.default.createElement("div", { className: "merge-modal-container" },
            react_1.default.createElement("div", { className: "merge-modal" },
                react_1.default.createElement("h3", null, "Is this you?"),
                react_1.default.createElement("p", null, "We found another profile registered with your email address. Do you want to link these accounts?"),
                react_1.default.createElement("div", { className: "profiles-container" }, props.extraProfiles),
                react_1.default.createElement("div", { className: "action-container" },
                    react_1.default.createElement("button", { onClick: (event) => {
                            console.log(`Selected profiles: ${props.chosenProfiles}`);
                            if (props.chosenProfiles.length > 0) {
                                const body = {
                                    id: props.userId,
                                    name: props.extraProfiles[0].props.profile.name,
                                    email: props.extraProfiles[0].props.profile.email,
                                    profiles: props.chosenProfiles,
                                };
                                (0, utilities_1.post)("/api/user/consolidate", body).then((res) => {
                                    console.log(`Conslidated user: ${JSON.stringify(res)}`);
                                });
                            }
                            props.setConsolidate(false);
                        }, className: "default-button u-pointer" },
                        react_1.default.createElement("p", null, "Yes, please")),
                    react_1.default.createElement("div", { onClick: (event) => {
                            props.setConsolidate(false);
                        }, className: "default-button u-pointer" },
                        react_1.default.createElement("p", null, " Not me")))))));
};
exports.default = Merge;
