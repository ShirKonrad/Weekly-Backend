import { CustomError } from "./customError";

export class UnauthorizedError extends CustomError {
    public statusCode = 401;
    private reason = "User is unauthorized";

    constructor(message?: string) {
        super("User is unauthorized, " + message);
        this.reason = "User is unauthorized - " + message;

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}
