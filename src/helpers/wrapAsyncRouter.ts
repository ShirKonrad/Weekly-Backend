import { NextFunction } from "express";

const express = require('express');

// Wrap async function so all the errors thrown by the function will pass to the error handling middleware
const wrapAsync = (fn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

// Wrap the route handlers with the wrapAsync middleware
export const wrapAsyncRouter = () => {
    const router = express.Router();

    // Override the route handler methods to automatically wrap with wrapAsync
    ['get', 'post', 'put', 'delete', 'patch'].forEach((method) => {
        const originalMethod = router[method];
        router[method] = (path: string, ...handlers: any) => {
            const wrappedHandlers = handlers.map((handler: any) => wrapAsync(handler));
            originalMethod.call(router, path, ...wrappedHandlers);
        };
    });

    return router;
};

// module.exports = wrapAsyncRouter;