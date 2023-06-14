"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAsyncRouter = void 0;
const express = require('express');
// Wrap async function so all the errors thrown by the function will pass to the error handling middleware
const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
// Wrap the route handlers with the wrapAsync middleware
const wrapAsyncRouter = () => {
    const router = express.Router();
    // Override the route handler methods to automatically wrap with wrapAsync
    ['get', 'post', 'put', 'delete', 'patch'].forEach((method) => {
        const originalMethod = router[method];
        router[method] = (path, ...handlers) => {
            const wrappedHandlers = handlers.map((handler) => wrapAsync(handler));
            originalMethod.call(router, path, ...wrappedHandlers);
        };
    });
    return router;
};
exports.wrapAsyncRouter = wrapAsyncRouter;
// module.exports = wrapAsyncRouter;
