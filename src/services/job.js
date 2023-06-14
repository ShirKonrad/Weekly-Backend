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
exports.assignmentsUpdate = void 0;
const event_1 = require("./event");
const schedule_1 = require("./schedule");
const task_1 = require("./task");
const user_1 = require("./user");
const date_fns_1 = require("date-fns");
const event_2 = require("../models/event");
const NOW = new Date();
function assignmentsUpdate() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("JOB IS RUNNING");
        const allUsers = yield (0, user_1.getAllUsers)();
        // Go over all the users
        if (allUsers && (allUsers === null || allUsers === void 0 ? void 0 : allUsers.length) > 0) {
            for (const user of allUsers) {
                const tasks = yield (0, task_1.getAllTasksByUserId)(user.id);
                // Check if there are tasks that meet the condition for update
                if (needsUpdate(tasks)) {
                    // find all tasks that their assignment is today, and treat them as events, means don't reschedule them
                    // and reschedule the rest of the tasks
                    const todayTasks = getAllTodayTasks(tasks);
                    const tasksToAssign = tasks.filter((task) => !(todayTasks.map(todayTask => todayTask.id).includes(task.id)));
                    const events = yield (0, event_1.getAllEventsByUserId)(user.id);
                    todayTasks.forEach((task) => events.push(event_2.Event.create({
                        id: 0,
                        title: task.title,
                        startTime: task.assignment,
                        endTime: (0, date_fns_1.addHours)(task.assignment, task.estTime),
                        user: task.user
                    })));
                    if ((tasksToAssign === null || tasksToAssign === void 0 ? void 0 : tasksToAssign.length) > 0) {
                        try {
                            const schedule = yield (0, schedule_1.generateSchedule)(tasksToAssign, events, user.beginDayHour, user.endDayHour);
                            if ((schedule === null || schedule === void 0 ? void 0 : schedule.length) > 0) {
                                const updatedTasks = yield (0, task_1.updateAssignments)(schedule, user.id);
                                console.log("Updated tasks for user: " + user.id);
                            }
                        }
                        catch (err) {
                            console.log("Failed to update tasks for user: " + user.id);
                            console.error(err);
                            // new BadRequestError("Generating schedule failed")
                        }
                    }
                }
            }
        }
    });
}
exports.assignmentsUpdate = assignmentsUpdate;
// Check if there are any tasks that have not yet been done, their assignment has passed and their due date has not yet passed,
// or they don't have an assignment. if there are any, return true
function needsUpdate(tasks) {
    const task = tasks.find((task) => ((task.assignment && task.assignment < NOW) || !task.assignment) && task.dueDate > NOW);
    return task !== undefined;
}
function getAllTodayTasks(tasks) {
    return tasks.filter((task) => { var _a; return ((_a = task.assignment) === null || _a === void 0 ? void 0 : _a.toLocaleDateString()) === NOW.toLocaleDateString(); });
}
