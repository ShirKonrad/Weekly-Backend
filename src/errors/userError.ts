import { CustomError } from "./customError";

export class UserError extends CustomError {
    public statusCode = 400;

    constructor(private error: string) {
        super(error);

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, UserError.prototype);
    }

    serializeErrors() {
        return [{ message: this.error }];
    }
}
