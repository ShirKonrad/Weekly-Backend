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
exports.taskRouter = void 0;
const express_1 = require("express");
const dataNotFoundError_1 = require("../errors/dataNotFoundError");
const currentUser_1 = require("../helpers/currentUser");
const task_1 = require("../services/task");
const router = (0, express_1.Router)();
exports.taskRouter = router;
router.get("/all", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield (0, task_1.getAllTasksByUserId)((0, currentUser_1.getUserId)(req), true);
    if (!tasks) {
        next(new dataNotFoundError_1.DataNotFoundError("Tasks"));
    }
    else {
        return res.status(200).send(tasks);
    }
}));
router.put("/setdone/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedTask = yield (0, task_1.setDone)(parseInt(req.params.id), (0, currentUser_1.getUserId)(req));
    if (!updatedTask) {
        throw new dataNotFoundError_1.DataNotFoundError("Task");
    }
    else {
        return res.status(200).send(updatedTask);
    }
}));
