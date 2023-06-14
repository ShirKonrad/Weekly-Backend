"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataNotFoundError = void 0;
const customError_1 = require("./customError");
class DataNotFoundError extends customError_1.CustomError {
    constructor(data) {
        super(data + " not found");
        this.data = data;
        this.statusCode = 404;
        // Only because we are extending a build in class
        Object.setPrototypeOf(this, DataNotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: `${this.data} not found` }];
    }
}
exports.DataNotFoundError = DataNotFoundError;
