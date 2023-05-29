"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const customError_1 = require("./customError");
class BadRequestError extends customError_1.CustomError {
    constructor(reason) {
        super(reason);
        this.reason = reason;
        this.statusCode = 400;
        // Only because we are extending a build in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
exports.BadRequestError = BadRequestError;
