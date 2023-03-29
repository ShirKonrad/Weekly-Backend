import { Request } from "express";

declare global {
    namespace Express {
        // interface User extends ITokenPayload {}
    }
}

export const getUserId = (req: Request) => {
    return 1;  // TODO: change this
};