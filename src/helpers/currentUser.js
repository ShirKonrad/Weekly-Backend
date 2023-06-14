"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = void 0;
const unauthorizedError_1 = require("../errors/unauthorizedError");
const jwt = require("jsonwebtoken");
const getUserId = (req) => {
    var _a, _b, _c;
    if ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.token) {
        return (_c = jwt.verify((_b = req.headers) === null || _b === void 0 ? void 0 : _b.token, process.env.SECRET_KEY)) !== null && _c !== void 0 ? _c : null;
    }
    else {
        throw new unauthorizedError_1.UnauthorizedError("token is missing");
    }
};
exports.getUserId = getUserId;
