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
exports.getAllUsers = exports.createUser = exports.getUserByEmail = exports.getUserById = void 0;
const user_1 = require("../models/user");
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_1.User.findOne({
            where: {
                id: userId
            },
        });
    });
}
exports.getUserById = getUserById;
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_1.User.findOne({
            where: {
                email: email
            },
        });
    });
}
exports.getUserByEmail = getUserByEmail;
function createUser(firstName, lastName, email, password, beginDayHour, endDayHour) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.User.create({
            firstName,
            lastName,
            email,
            password,
            beginDayHour,
            endDayHour
        });
        const results = yield user_1.User.save(user);
        return results;
    });
}
exports.createUser = createUser;
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_1.User.find();
    });
}
exports.getAllUsers = getAllUsers;
