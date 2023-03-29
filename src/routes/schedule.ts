import { Request, Response, Router } from "express";
import { getGeneratedSchedule } from "../api/algo";
import { Priority } from "../helpers/constants";
import { getUserId } from "../helpers/currentUser";
import { Task } from "../models/task";
import { getAllEventsByUserId } from "../services/event";
import { generateSchedule } from "../services/schedule";
import { getAllTasksByUserId } from "../services/task";


const router = Router();

router.post("", async (req: Request, res: Response) => {
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