"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const customError_1 = require("./customError");
class DatabaseConnectionError extends customError_1.CustomError {
    constructor() {
        super("Error connecting to database");
        this.statusCode = 500;
        this.reason = "Error connecting to database";
        // Only because we are extending a build in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {
        return [{ message: this.reason }];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
