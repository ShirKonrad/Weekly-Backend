interface FormattedError {
    message: string;
    field?: string;
}

export abstract class CustomError extends Error {
    abstract statusCode: number;
    constructor(message: string) {
        super(message);

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): FormattedError[];
}
