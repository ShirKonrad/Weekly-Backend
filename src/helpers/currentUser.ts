import { Request } from "express";
const jwt = require("jsonwebtoken");

export const getUserId = (req: Request) => {
    // TODO: uncomment when adding the token to the requests' headers

    // return jwt.verify(req.headers?.token, process.env.SECRET_KEY);
    return 1;
};