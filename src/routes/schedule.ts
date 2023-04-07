import { Request, Response, Router } from "express";
import { Priority } from "../helpers/constants";
import { getUserId } from "../helpers/currentUser";
import { IEvent } from "../models/event";
import { ITask, Task } from "../models/task";
import { getAllEventsByUserId } from "../services/event";
import { generateSchedule } from "../services/schedule";
import { getAllTasksByUserId } from "../services/task";


const router = Router();

/**
 * Get new tasks and events and save them on DB. 
 * Then select all the tasks and events in the user's schedule and regenerate the schedule with the new tasks and events. 
 * Update the new assignments in the DB 
 */
router.post("", async (req: Request, res: Response) => {
    const newTasks = req.body.tasks as ITask[];
    const newEvents = req.body.events as IEvent[];

    // const tasks = await getAllTasksByUserId(getUserId(req));
    const events = await getAllEventsByUserId(getUserId(req));

    const tasks = [
        { id: 1, title: "test1", dueDate: new Date("2023-03-30"), estTime: 2, userId: 1, priority: Priority.MEDIUM },
        { id: 2, title: "test2", dueDate: new Date("2023-04-01"), estTime: 3, userId: 1, priority: Priority.HIGH },
        { id: 3, title: "test3", dueDate: new Date("2023-03-31"), estTime: 4, userId: 1, priority: Priority.HIGH }
    ];

    try {
        const schedule = await generateSchedule(tasks, events, 9, 18)
        return res.status(200).send(schedule);
    } catch {
        // throw new error
    }

});


export { router as scheduleRouter };