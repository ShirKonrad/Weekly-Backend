"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const notFoundError_1 = require("./errors/notFoundError");
const errorHandler_1 = require("./middlewares/errorHandler");
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.router);
// Try to reach to unexisting route
app.all("*", () => {
    throw new notFoundError_1.NotFoundError();
});
app.use(errorHandler_1.errorHandler);
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[Server]: I am running at https://localhost:${PORT}`);
    yield (0, config_1.connectToDb)();
}));
