"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
require("./Modal.css");
require("./FiltersModal.css");
const types_1 = require("../../types");
const Filters = (props) => {
    const [selected, setSelected] = (0, react_1.useState)(props.filter);
    const toggle = (label) => {
        const selected = types_1.FILTERS_TO_IDS[label];
        for (const filter of Object.keys(types_1.FILTERS_TO_IDS)) {
            const elemId = types_1.FILTERS_TO_IDS[filter];
            const elem = document.getElementById(elemId);
            if (elemId === selected) {
                elem.checked = true;
                setSelected(label);
            }
            else
                elem.checked = false;
        }
    };
    (0, react_1.useEffect)(() => {
        toggle(props.filter);
    }, []);
    return (react_1.default.createElement("div", { className: "modal-overlay" },
        react_1.default.createElement("div", { className: "modal-container" },
            react_1.default.createElement("div", { className: "modal-content" },
                react_1.default.createElement("h4", null, "Advanced search"),
                react_1.default.createElement("div", { className: "filter-container" },
                    react_1.default.createElement("label", null,
                        react_1.default.createElement("input", { id: "all", type: "checkbox", onClick: (event) => {
                                toggle(types_1.SearchFilters.ALL);
                            } }),
                        react_1.default.createElement("p", null, "All")),
                    react_1.default.createElement("label", null,
                        react_1.default.createElement("input", { id: "users", type: "checkbox", onClick: (event) => {
                                toggle(types_1.SearchFilters.USERS);
                            } }),
                        react_1.default.createElement("p", null, "Users")),
                    react_1.default.createElement("label", null,
                        react_1.default.createElement("input", { id: "communities", type: "checkbox", onClick: (event) => {
                                toggle(types_1.SearchFilters.COMMUNITIES);
                            } }),
                        react_1.default.createElement("p", null, "Communities"))),
                react_1.default.createElement("div", { className: "action-container" },
                    react_1.default.createElement("button", { className: "default-button u-pointer", onClick: (event) => {
                            props.setFilter(selected);
                            props.setFiltering(false);
                        } }, "apply filter"),
                    react_1.default.createElement("button", { onClick: (event) => props.setFiltering(false), className: "default-button u-pointer" }, "close"))))));
};
exports.default = Filters;
