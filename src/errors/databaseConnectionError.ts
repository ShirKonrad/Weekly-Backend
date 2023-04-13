import { CustomError } from "./customError";

export class DatabaseConnectionError extends CustomError {
    public statusCode = 500;
    private reason = "Error connecting to database";

    constructor() {
        super("Error connecting to database");

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}
