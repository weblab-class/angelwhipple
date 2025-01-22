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
require("./Housing.css");
const AdModal_1 = __importDefault(require("../modules/modals/AdModal"));
const TODAYS_DATE = new Date(new Date().toLocaleDateString("en", { timeZone: "America/New_York" }))
    .toISOString()
    .slice(0, 10); // get date in format YYYY-MM-DD
const Housing = (props) => {
    const [view, setView] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)({ valid: false });
    const [travelQuery, setTravelQuery] = (0, react_1.useState)();
    const [premiumAd, setPremiumAd] = (0, react_1.useState)(false);
    const [map, setMap] = (0, react_1.useState)();
    // @ts-ignore google.maps.plugins
    // const loader = new Loader({
    //   apiKey: GMAPS_API_KEY!,
    //   version: "weekly",
    //   // libraries: ["places", "maps", "streetView"],
    // });
    const initGoogleMaps = () => {
        const mapOptions = {
            center: {
                lat: 37.4708247,
                lng: -121.927533,
            },
            zoom: 10,
        };
        const gmap = document.getElementById("map");
        // loader.importLibrary("maps").then(({ Map }) => {
        //   setMap(new Map(gmap, mapOptions));
        // });
        const location = document.getElementById("location");
        // loader.importLibrary("places").then(({ Autocomplete }) => {
        //   const autocomplete = new Autocomplete(location);
        //   autocomplete.addListener("place_changed", () => {
        //     const place = autocomplete.getPlace();
        //     console.log(place);
        //   });
        // });
    };
    const handleDetails = () => __awaiter(void 0, void 0, void 0, function* () {
        const location = document.getElementById("location");
        const startDate = document.getElementById("date_start");
        const endDate = document.getElementById("date_end");
        const groupSize = document.getElementById("group_size");
        let tempError = { valid: false };
        // revise to use GMAPs Autocomplete
        if (!location.value)
            tempError = { valid: true, message: "Please select a valid location" };
        else if (!startDate.value)
            tempError = { valid: true, message: "Please enter a valid start date for travel" };
        else if (!endDate.value)
            tempError = { valid: true, message: "Please enter a valid end date for travel" };
        else if (!groupSize.value || parseInt(groupSize.value) < 1) {
            tempError = { valid: true, message: "Must be traveling with atleast 1 person" };
            groupSize.value = "";
        }
        if (tempError.valid) {
            setError(tempError);
            return;
        }
        else {
            setTravelQuery({
                location: location.value,
                startDate: startDate.value,
                endDate: endDate.value,
                groupSize: parseInt(groupSize.value),
            });
            location.value = "";
            startDate.value = "";
            endDate.value = "";
            groupSize.value = "";
        }
    });
    (0, react_1.useEffect)(() => {
        console.log(travelQuery);
        if (travelQuery !== undefined)
            setPremiumAd(true);
        setError({ valid: false });
    }, [travelQuery, view]);
    (0, react_1.useEffect)(() => {
        initGoogleMaps();
    }, []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        premiumAd ? react_1.default.createElement(AdModal_1.default, { setDisplay: setPremiumAd }) : react_1.default.createElement(react_1.default.Fragment, null),
        react_1.default.createElement("div", { className: "centered default-container" }, travelQuery ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("p", null, "Gather more details: housing arrangements finalized, searching for roommates"),
            react_1.default.createElement("p", null, "Optional one time roommate preference survey"),
            react_1.default.createElement("p", null, "Info to collect for unfinalized arrangements: unit type, budget, distance"),
            react_1.default.createElement("p", null, "For finalized arrangements: property listing information"),
            react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => setTravelQuery(undefined) }, "Go back"))) : view === "TRAVELER" ? (react_1.default.createElement("div", { className: "inputs-container" },
            react_1.default.createElement("h4", null, "Share a few details about your upcoming travel"),
            react_1.default.createElement("form", null,
                react_1.default.createElement("label", null, "Destination"),
                react_1.default.createElement("div", { className: "dates-container" },
                    react_1.default.createElement("label", null,
                        "From",
                        react_1.default.createElement("input", { id: "date_start", type: "date", min: TODAYS_DATE })),
                    react_1.default.createElement("label", null,
                        "To",
                        react_1.default.createElement("input", { id: "date_end", type: "date", min: TODAYS_DATE }))),
                react_1.default.createElement("label", null,
                    "Number of Travelers",
                    react_1.default.createElement("input", { id: "group_size", type: "number", min: "1" }))),
            error.valid ? (react_1.default.createElement("p", { className: "error-text" }, error.message)) : (react_1.default.createElement("p", { className: "error-text-hidden" }, "Default")),
            react_1.default.createElement("div", { className: "action-container" },
                react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => __awaiter(void 0, void 0, void 0, function* () { return yield handleDetails(); }) }, "Next"),
                react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => setView("") }, "Go back")))) : view === "HOST" ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("h4", null, "Host details here"),
            react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => setView("") }, "Go back"))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("p", null, "I am a..."),
            react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => setView("HOST") }, "Host"),
            react_1.default.createElement("button", { className: "default-button u-pointer", onClick: () => setView("TRAVELER") }, "Traveler"))))));
};
exports.default = Housing;
