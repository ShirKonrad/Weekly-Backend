"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const schedule_1 = require("./schedule");
const tag_1 = require("./tag");
const task_1 = require("./task");
const user_1 = require("./user");
const router = (0, express_1.Router)();
exports.router = router;
// Add new routes here
router.use("/task", task_1.taskRouter);
router.use("/schedule", schedule_1.scheduleRouter);
router.use("/user", user_1.userRouter);
router.use("/tag", tag_1.tagRouter);
