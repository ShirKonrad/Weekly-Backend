"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserError = void 0;
const customError_1 = require("./customError");
class UserError extends customError_1.CustomError {
    constructor(error) {
        super(error);
        this.error = error;
        this.statusCode = 400;
        // Only because we are extending a build in class
        Object.setPrototypeOf(this, UserError.prototype);
    }
    serializeErrors() {
        return [{ message: this.error }];
    }
}
exports.UserError = UserError;
