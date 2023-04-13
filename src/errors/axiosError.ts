import { CustomError } from "./customError";

export class AxiosError extends CustomError {
    public statusCode = 500;
    private reason = "Error connecting to the API";

    constructor() {
        super("Error connecting to the API");

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, AxiosError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}
