import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
    public statusCode = 404;
    constructor() {
        super("Route not found");

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: "Route not found" }];
    }
}
