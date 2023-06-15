import { CustomError } from "./customError";

type algorithmError = {
    code?: number;
    name: string;
    message: string;
}

export class AlgorithmError extends CustomError {
    public statusCode = 500;

    constructor(private error: algorithmError) {
        super(error?.name || "error connecting to algorithm API");
        this.statusCode = error?.code || 500

        // Only because we are extending a build in class
        Object.setPrototypeOf(this, AlgorithmError.prototype);
    }

    serializeErrors() {
        return [this.error];
    }
}
