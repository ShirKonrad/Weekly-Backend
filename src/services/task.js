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
exports.setDone = exports.updateAssignments = exports.saveTasks = exports.getAllTasksByUserIdAndDates = exports.getAllTasksByUserId = void 0;
const typeorm_1 = require("typeorm");
const task_1 = require("../models/task");
function getAllTasksByUserId(userId, withDone, withPastDueDate) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield task_1.Task.find({
            where: {
                user: { id: userId },
                dueDate: withPastDueDate ? undefined : (0, typeorm_1.MoreThanOrEqual)(new Date()),
                isDone: withDone ? undefined : false
            },
            relations: ["user", "tag"],
        });
    });
}
exports.getAllTasksByUserId = getAllTasksByUserId;
function getAllTasksByUserIdAndDates(userId, minDate, maxDate) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield task_1.Task.find({
            where: {
                user: { id: userId },
                assignment: (0, typeorm_1.Between)(minDate, maxDate),
            },
            relations: ["user", "tag"],
        });
    });
}
exports.getAllTasksByUserIdAndDates = getAllTasksByUserIdAndDates;
function saveTasks(tasks, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const newTasks = tasks.map((task) => {
            var _a;
            return task_1.Task.create(Object.assign(Object.assign({}, task), { user: { id: userId }, tag: { id: (_a = task === null || task === void 0 ? void 0 : task.tag) === null || _a === void 0 ? void 0 : _a.id }, isDone: false }));
        });
        return yield task_1.Task.insert(newTasks);
    });
}
exports.saveTasks = saveTasks;
function updateAssignments(assignments, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const tasks = yield task_1.Task.find({
            where: {
                id: (0, typeorm_1.In)(assignments.map((assignment) => assignment.taskId)),
                user: { id: userId },
            },
            relations: ["user", "tag"],
        });
        if ((tasks === null || tasks === void 0 ? void 0 : tasks.length) > 0) {
            const tasksToSave = tasks.map((task) => {
                var _a;
                return Object.assign(Object.assign({}, task), { assignment: (_a = assignments.find((assignment) => assignment.taskId === task.id)) === null || _a === void 0 ? void 0 : _a.assignment });
            });
            return yield task_1.Task.save(tasksToSave);
        }
    });
}
exports.updateAssignments = updateAssignments;
function setDone(taskId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const task = yield task_1.Task.findOne({
            where: {
                id: taskId,
                user: { id: userId }
            },
            relations: ["user", "tag"],
        });
        if (task) {
            task.isDone = !task.isDone;
            return yield task_1.Task.save(task);
        }
        else {
            return undefined;
        }
    });
}
exports.setDone = setDone;
