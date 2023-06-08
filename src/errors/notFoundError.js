"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const customError_1 = require("./customError");
class NotFoundError extends customError_1.CustomError {
    constructor() {
        super("Route not found");
        this.statusCode = 404;
        // Only because we are extending a build in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: "Not found" }];
    }
}
exports.NotFoundError = NotFoundError;
