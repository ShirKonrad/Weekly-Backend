"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const customError_1 = require("../errors/customError");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof customError_1.CustomError) {
        console.log("CUSTOM ERROR");
        console.log(err.serializeErrors());
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    console.error(err);
    return res
        .status(400)
        .send({ errors: [{ message: "Something went wrong..." }] });
};
exports.errorHandler = errorHandler;
