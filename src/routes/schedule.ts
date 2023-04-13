import { Request, Response, Router } from "express";
import { BadRequestError } from "../errors/badRequestError";
import { Priority } from "../helpers/constants";
import { getUserId } from "../helpers/currentUser";
import { TaskAssignment } from "../helpers/types";
import { IEvent } from "../models/event";
import { ITask, Task } from "../models/task";
import { getAllEventsByUserId, saveEvents } from "../services/event";
import { generateSchedule } from "../services/schedule";
import { getAllTasksByUserId, saveTasks, updateAssignments } from "../services/task";


const router = Router();

/**
 * Get new tasks and events and save them on DB. 
 * Then select all the tasks and events in the user's schedule and regenerate the schedule with the new tasks and events. 
 * Update the new assignments in the DB 
 */
router.post("", async (req: Request, res: Response, next) => {
    const newTasks = req.body.tasks as ITask[];
    const newEvents = req.body.events as IEvent[];

    const userId = getUserId(req);

    try {
        if (newTasks && newTasks.length > 0) {
            await saveTasks(newTasks, userId);
        }
        if (newEvents && newEvents.length > 0) {
            await saveEvents(newEvents, userId);
        }

    } catch (err) {
        console.error(err);
        next(new BadRequestError("Saving tasks or events failed"))
    }


    const tasks = await getAllTasksByUserId(userId);
    const events = await getAllEventsByUserId(userId);

    // TODO: get the user's working hours

    if (tasks.length > 0) {
        try {
            const schedule = await generateSchedule(tasks, events, 9, 18) as TaskAssignment[];
            if (schedule) {
                const updatedTasks = await updateAssignments(schedule, userId)
                return res.status(200).send(updatedTasks);
            }
        } catch (err) {
            console.error(err);
            next(new BadRequestError("Generating schedule failed"))
        }
    } else {
        return res.status(200).send("no tasks to schedule");
    }
});


export { router as scheduleRouter };