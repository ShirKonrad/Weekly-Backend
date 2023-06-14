"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosError = void 0;
const customError_1 = require("./customError");
class AxiosError extends customError_1.CustomError {
    constructor() {
        super("Error connecting to the API");
        this.statusCode = 500;
        this.reason = "Error connecting to the API";
        // Only because we are extending a build in class
        Object.setPrototypeOf(this, AxiosError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
exports.AxiosError = AxiosError;
