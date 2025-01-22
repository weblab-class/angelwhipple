"use strict";
/**
 * TYPES
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSWORD_INFO = exports.USERNAME_INFO = exports.FILTERS_TO_IDS = exports.VALID_DOMAINS = exports.THIS_YEAR = exports.SearchFilters = void 0;
var SearchFilters;
(function (SearchFilters) {
    SearchFilters[SearchFilters["ALL"] = 0] = "ALL";
    SearchFilters[SearchFilters["USERS"] = 1] = "USERS";
    SearchFilters[SearchFilters["COMMUNITIES"] = 2] = "COMMUNITIES";
    SearchFilters[SearchFilters["HOUSING"] = 3] = "HOUSING";
})(SearchFilters || (exports.SearchFilters = SearchFilters = {}));
exports.THIS_YEAR = new Date().getFullYear();
exports.VALID_DOMAINS = [".edu", ".com", ".gov"];
exports.FILTERS_TO_IDS = {
    [SearchFilters.ALL]: "all",
    [SearchFilters.USERS]: "users",
    [SearchFilters.COMMUNITIES]: "communities",
};
exports.USERNAME_INFO = `<div>
    <p>1. New username must be atleast 3 characters long.</p>
    <p>2. Can include a mix of letters, numbers, and underscores.</p>
    <p>3. Usernames may only be changed twice every 30 days.</p>
    <p>4. Your old username will be reserved for up to 5 days after the change.</p>
  </div>`;
exports.PASSWORD_INFO = `<div>
    <p>1. Your password must be atleast 8 characters long.</p>
    <p>2. Must include a mix of letters, numbers, and special characters.</p>
    <p>3. Avoid common passwords and consider using passphrases for added security.</p>
  </div>`;
