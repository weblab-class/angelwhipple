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
const react_1 = __importStar(require("react"));
require("./NavBar.css");
require("../pages/Login.css");
require("../../utilities.css");
const client_socket_1 = require("../../client-socket");
const utilities_1 = require("../../utilities");
const router_1 = require("@reach/router");
const hi_1 = require("react-icons/hi");
const io_1 = require("react-icons/io");
const go_1 = require("react-icons/go");
const fa6_1 = require("react-icons/fa6");
const FiltersModal_1 = __importDefault(require("./modals/FiltersModal"));
const types_1 = require("../types");
const LogoutModal_1 = __importDefault(require("./modals/LogoutModal"));
const blank_jpg_1 = __importDefault(require("../../assets/blank.jpg"));
const helpers_1 = __importDefault(require("../helpers"));
require("./modals/Modal.css");
const DROPDOWN_IDS = ["profile-dropdown", "community-dropdown"];
const NavBar = (props) => {
    const [profile, setProfile] = (0, react_1.useState)(false);
    const [communities, setCommunities] = (0, react_1.useState)(false);
    const [housing, setHousing] = (0, react_1.useState)(false);
    const [querying, setQuerying] = (0, react_1.useState)(false);
    const [filtering, setFiltering] = (0, react_1.useState)(false);
    const [logout, setLogout] = (0, react_1.useState)(false);
    const [query, setQuery] = (0, react_1.useState)("");
    const [filter, setFilter] = (0, react_1.useState)(types_1.SearchFilters.ALL);
    const [src, setSrc] = (0, react_1.useState)("");
    const [communityBtns, setCommunityBtns] = (0, react_1.useState)();
    const [name, setName] = (0, react_1.useState)("Crash User");
    const navigate = (0, router_1.useNavigate)();
    const route = (path) => {
        navigate(path);
    };
    /**
     * TODO
     * @param selectedFunc
     * @param all
     * @param filter
     */
    const toggleTabs = (all = false, filter = false, selectedFunc) => {
        DROPDOWN_IDS.map((dropdown) => {
            const elem = document.getElementById(dropdown);
            if (elem)
                elem.style.display = "none"; // always disable dropdowns
        });
        const funcOptions = [setProfile, setCommunities, setHousing, setQuerying, setFiltering];
        for (const toggleFunc of funcOptions)
            toggleFunc(false);
        if (filter)
            setFiltering(!filtering);
        else if (!all && selectedFunc)
            selectedFunc(true);
    };
    const toggleDropdown = (dropdownId) => {
        const dropdown = document.getElementById(dropdownId);
        dropdown.style.display = (dropdown === null || dropdown === void 0 ? void 0 : dropdown.style.display) === "none" ? "flex" : "none";
    };
    const handleQuery = (event) => {
        setQuery(event.target.value);
    };
    const handleSearch = (event) => {
        const body = { query: query };
        console.log(`Search query: ${query}`);
        setQuery("");
        event.target.value = "";
        setFiltering(false);
        const route = types_1.FILTERS_TO_IDS[filter];
        (0, utilities_1.post)(`/api/search/${route}`, body).then((res) => {
            console.log(res);
        });
    };
    const updateIdentity = () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, utilities_1.get)("/api/user/fetch", { id: props.userId }).then((res) => {
            setName(res.user.name);
        });
        yield (0, utilities_1.get)("/api/user/loadphoto", { userId: props.userId }).then((res) => {
            if (res.valid) {
                const buffer = res.buffer.Body.data;
                setSrc(helpers_1.default.URLFromBuffer(buffer));
            }
        });
    });
    const refreshCommunities = () => {
        const btns = [];
        (0, utilities_1.get)("/api/user/communities", { id: props.userId }).then((res) => {
            console.log(res);
            for (const community of res.communities) {
                btns.push(react_1.default.createElement("button", { key: community._id, className: "default-button u-pointer", onClick: () => {
                        client_socket_1.socket.emit("switched communities", { community: community });
                        toggleDropdown("community-dropdown");
                    } }, community.name));
            }
            setCommunityBtns(btns);
        });
    };
    (0, react_1.useEffect)(() => {
        if (props.userId) {
            updateIdentity();
            refreshCommunities();
        }
        else
            setSrc(blank_jpg_1.default);
    }, []);
    (0, react_1.useEffect)(() => {
        if (props.userId) {
            updateIdentity();
            refreshCommunities();
        }
    }, [props.userId]);
    client_socket_1.socket.on("nav toggle all", (event) => {
        toggleTabs(true, false);
    });
    client_socket_1.socket.on("updated user", () => {
        if (props.userId)
            updateIdentity();
    });
    client_socket_1.socket.on("new community", (event) => {
        if (event.owner === props.userId)
            refreshCommunities();
    });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("script", null),
        filtering ? (react_1.default.createElement(FiltersModal_1.default, { filter: filter, setFilter: setFilter, setFiltering: setFiltering })) : logout ? (react_1.default.createElement(LogoutModal_1.default, { setUserId: props.setUserId, setLogout: setLogout })) : (react_1.default.createElement(react_1.default.Fragment, null)),
        react_1.default.createElement("nav", { className: "nav-bar-container" },
            props.userId !== undefined ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: "nav-dropdown-container" },
                    react_1.default.createElement("div", { className: "u-flex u-alignCenter", onClick: () => {
                            toggleDropdown("profile-dropdown");
                        } },
                        react_1.default.createElement("img", { className: `u-pointer ${profile ? "nav-img-selected" : "nav-img"}`, src: src }),
                        react_1.default.createElement("p", { className: "u-pointer font-small pad-light" }, name)),
                    react_1.default.createElement("div", { id: "profile-dropdown", className: "nav-dropdown-content" },
                        react_1.default.createElement("button", { className: "default-button font-medium u-pointer", onClick: (event) => {
                                route("/profile");
                                toggleDropdown("profile-dropdown");
                                toggleTabs(false, false, setProfile);
                            } }, "Profile"),
                        react_1.default.createElement("button", { className: "default-button font-medium u-pointer", onClick: () => {
                                setLogout(true);
                                toggleDropdown("profile-dropdown");
                            } }, "Logout"))))) : (react_1.default.createElement(react_1.default.Fragment, null)),
            react_1.default.createElement(hi_1.HiHome, { title: "Housing", className: `u-pointer ${housing ? "nav-icon-selected" : "nav-icon"}`, onClick: (event) => {
                    route("/housing");
                    toggleTabs(false, false, setHousing);
                } }),
            react_1.default.createElement(io_1.IoIosPeople, { title: "Communities", className: `u-pointer ${communities ? "nav-icon-selected" : "nav-icon"}`, onClick: (event) => {
                    route("/communities");
                    toggleTabs(false, false, setCommunities);
                } }),
            react_1.default.createElement("div", { className: "alt-container" },
                " ",
                communities && props.userId ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("div", { className: "nav-dropdown-container community-dropdown" },
                        react_1.default.createElement(fa6_1.FaGear, { id: "gear", className: "nav-icon u-pointer", onClick: () => {
                                toggleDropdown("community-dropdown");
                            } }),
                        react_1.default.createElement("div", { id: "community-dropdown", className: "nav-dropdown-content" },
                            communityBtns,
                            react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => {
                                    client_socket_1.socket.emit("create new community");
                                    toggleDropdown("community-dropdown");
                                } }, "Create new"))))) : (react_1.default.createElement(react_1.default.Fragment, null)),
                react_1.default.createElement("div", { className: "search-bar-container" },
                    react_1.default.createElement(go_1.GoFilter, { className: `u-pointer ${filtering ? "nav-icon-selected" : "nav-icon"}`, onClick: (event) => {
                            setFiltering(!filtering);
                        } }),
                    react_1.default.createElement("input", { id: "navSearch", type: "search", placeholder: "search", className: "search-bar", onKeyDown: (event) => {
                            if (event.key == "Enter") {
                                handleSearch(event);
                            }
                        }, onChange: handleQuery }))))));
};
exports.default = NavBar;
