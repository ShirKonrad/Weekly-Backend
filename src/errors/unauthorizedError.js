"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const customError_1 = require("./customError");
class UnauthorizedError extends customError_1.CustomError {
    constructor(message) {
        super("User is unauthorized, " + message);
        this.statusCode = 401;
        this.reason = "User is unauthorized";
        this.reason = "User is unauthorized - " + message;
        // Only because we are extending a build in class
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
exports.UnauthorizedError = UnauthorizedError;
