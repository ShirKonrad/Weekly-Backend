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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./models/user");
const event_1 = require("./models/event");
const task_1 = require("./models/task");
const tag_1 = require("./models/tag");
const databaseConnectionError_1 = require("./errors/databaseConnectionError");
require('dotenv').config();
const AppDataSource = new typeorm_1.DataSource({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: +process.env.POSTGRES_PORT,
    type: 'postgres',
    synchronize: false,
    logging: false,
    entities: [user_1.User, event_1.Event, task_1.Task, tag_1.Tag],
});
const connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield AppDataSource.initialize().catch((error) => {
        console.log(error);
        throw new databaseConnectionError_1.DatabaseConnectionError();
    });
    console.log("Connected to database");
});
exports.connectToDb = connectToDb;
