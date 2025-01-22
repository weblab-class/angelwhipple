"use strict";
/**
 * Utility functions to make API requests.
 * By importing this file, you can use the provided get and post functions.
 * You shouldn't need to modify this file, but if you want to learn more
 * about how these functions work, google search "Fetch API"
 *
 * These functions return promises, which means you should use ".then" on them.
 * e.g. get('/api/foo', { bar: 0 }).then(res => console.log(res))
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = exports.get = void 0;
const formatParams = (params) => {
    return Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");
};
const convertToJSON = (res) => {
    if (!res.ok) {
        throw `API request failed with response status ${res.status} and text: ${res.statusText}`;
    }
    return res
        .clone() // clone so that the original is still readable for debugging
        .json() // start converting to JSON object
        .catch((error) => {
        // throw an error containing the text that couldn't be converted to JSON
        return res.text().then((text) => {
            throw `API request's result could not be converted to a JSON object: \n${text}`;
        });
    });
};
// Helper code to make a get request. Default parameter of empty JSON Object for params.
// Returns a Promise to a JSON Object.
const get = (endpoint, params = {}) => {
    const fullPath = endpoint + "?" + formatParams(params);
    return fetch(fullPath)
        .then(convertToJSON)
        .catch((error) => {
        // give a useful error message
        throw `GET request to ${fullPath} failed with error:\n${error}`;
    });
};
exports.get = get;
// Helper code to make a post request. Default parameter of empty JSON Object for params.
// Returns a Promise to a JSON Object.
const post = (endpoint, params = {}) => {
    return fetch(endpoint, {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(params),
    })
        .then(convertToJSON) // convert result to JSON object
        .catch((error) => {
        // give a useful error message
        throw `POST request to ${endpoint} failed with error:\n${error}`;
    });
};
exports.post = post;
