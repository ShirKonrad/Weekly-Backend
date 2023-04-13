import { CustomError } from "./customError";

export class BadRequestError extends CustomError {
    public statusCode = 400;

    constructor(private reason: string) {
        super(reason);

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}
