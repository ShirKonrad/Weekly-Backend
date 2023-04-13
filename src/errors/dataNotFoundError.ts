import { CustomError } from "./customError";

export class DataNotFoundError extends CustomError {
    public statusCode = 404;
    constructor(private data: String) {
        super(data + " not found");

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, DataNotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: `${this.data} not found` }];
    }
}
