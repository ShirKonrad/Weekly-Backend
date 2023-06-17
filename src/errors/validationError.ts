import { CustomError } from "./customError";

export class ValidationError extends CustomError {
    public statusCode = 500;

    constructor(private reason: string) {
        super(reason);

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}
