import { NextFunction, Request } from "express";
import { UnauthorizedError } from "../errors/unauthorizedError";
const jwt = require("jsonwebtoken");

export const getUserId = (req: Request) => {
    if (req.headers?.token) {
        return jwt.verify(req.headers?.token, process.env.SECRET_KEY) ?? null;
    } else {
        throw new UnauthorizedError("token is missing")
    }
};