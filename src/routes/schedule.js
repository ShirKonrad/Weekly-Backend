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
exports.scheduleRouter = void 0;
const badRequestError_1 = require("../errors/badRequestError");
const currentUser_1 = require("../helpers/currentUser");
const wrapAsyncRouter_1 = require("../helpers/wrapAsyncRouter");
const event_1 = require("../services/event");
const schedule_1 = require("../services/schedule");
const task_1 = require("../services/task");
const user_1 = require("../services/user");
const router = (0, wrapAsyncRouter_1.wrapAsyncRouter)();
exports.scheduleRouter = router;
/**
 * Get new tasks and events and save them on DB.
 * Then select all the tasks and events in the user's schedule and regenerate the schedule with the new tasks and events.
 * Update the new assignments in the DB
 */
router.post("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newTasks = req.body.tasks;
    const newEvents = req.body.events;
    const userId = (0, currentUser_1.getUserId)(req);
    console.log(newTasks);
    try {
        if (newTasks && newTasks.length > 0) {
            yield (0, task_1.saveTasks)(newTasks, userId);
        }
        if (newEvents && newEvents.length > 0) {
            yield (0, event_1.saveEvents)(newEvents, userId);
        }
    }
    catch (err) {
        console.error(err);
        throw new badRequestError_1.BadRequestError("Saving tasks or events failed");
    }
    // get all the user's tasks and events that their due date has not passed
    const tasks = yield (0, task_1.getAllTasksByUserId)(userId);
    const events = yield (0, event_1.getAllEventsByUserId)(userId);
    if ((tasks === null || tasks === void 0 ? void 0 : tasks.length) > 0) {
        try {
            // get the user in order to get his day hours
            const user = yield (0, user_1.getUserById)(userId);
            const schedule = yield (0, schedule_1.generateSchedule)(tasks, events, (user === null || user === void 0 ? void 0 : user.beginDayHour) || 9, (user === null || user === void 0 ? void 0 : user.endDayHour) || 18);
            if ((schedule === null || schedule === void 0 ? void 0 : schedule.length) > 0) {
                const updatedTasks = yield (0, task_1.updateAssignments)(schedule, userId);
                return res.status(200).send(updatedTasks);
            }
        }
        catch (err) {
            console.error(err);
            throw new badRequestError_1.BadRequestError("Generating schedule failed");
        }
    }
    else {
        return res.status(200).send("no tasks to schedule");
    }
}));
router.get("/week", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    // Searching for the schedulw only if there is a date range from the client.
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.minDate) && ((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.maxDate)) {
        const minDate = new Date((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.minDate.toString());
        const maxDate = new Date((_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.maxDate.toString());
        const userId = (0, currentUser_1.getUserId)(req);
        // Selecting the tasks and the enevts separately.
        const tasks = yield (0, task_1.getAllTasksByUserIdAndDates)(userId, minDate, maxDate);
        const events = yield (0, event_1.getAllEventsByUserIdAndDates)(userId, minDate, maxDate);
        // Building a list of schedule entities.
        const tasksFormatted = tasks === null || tasks === void 0 ? void 0 : tasks.map((task) => {
            // Returning only the tasks that are assigned.
            if (task.assignment) {
                const endTime = new Date(task === null || task === void 0 ? void 0 : task.assignment);
                endTime.setHours(endTime.getHours() + task.estTime);
                return {
                    id: task.id,
                    title: task.title,
                    startTime: task.assignment,
                    endTime: endTime,
                    tag: task.tag
                };
            }
        });
        const eventsFormatted = events === null || events === void 0 ? void 0 : events.map((event) => {
            return {
                id: event.id,
                title: event.title,
                startTime: event.startTime,
                endTime: event.endTime,
                tag: event.tag
            };
        });
        return res.status(200).send([...tasksFormatted, ...eventsFormatted]);
    }
    else {
        throw new badRequestError_1.BadRequestError("No dates range");
    }
}));
