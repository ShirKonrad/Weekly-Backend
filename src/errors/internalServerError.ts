import { CustomError } from "./customError";

export class InternalServerError extends CustomError {
    public statusCode = 500;
    private reason = "Internal server error";

    constructor() {
        super("Internal server error");

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}