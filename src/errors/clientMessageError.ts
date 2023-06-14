import { CustomError } from "./customError";

export type ClientError = {
    code: number;
    message: string;
    extraMessage?: string;
}

export class ClientMessageError extends CustomError {
    public statusCode = 500;

    constructor(private error: ClientError) {
        super(error.message);

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, ClientMessageError.prototype);
    }

    serializeErrors() {
        return [this.error];
    }
}