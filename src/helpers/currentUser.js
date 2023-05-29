"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = void 0;
const jwt = require("jsonwebtoken");
const getUserId = (req) => {
    // TODO: uncomment when adding the token to the requests' headers
    // return jwt.verify(req.headers?.token, process.env.SECRET_KEY);
    return 1;
};
exports.getUserId = getUserId;
