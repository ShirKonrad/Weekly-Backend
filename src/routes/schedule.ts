import { Request, Response, Router } from "express";
import { BadRequestError } from "../errors/badRequestError";
import { getUserId } from "../helpers/currentUser";
import { TaskAssignment } from "../helpers/types";
import { IEvent } from "../models/event";
import { ITask } from "../models/task";
import { getAllEventsByUserId, getAllEventsByUserIdAndDates, saveEvents } from "../services/event";
import { generateSchedule } from "../services/schedule";
import { getAllTasksByUserId, getAllTasksByUserIdAndDates, saveTasks, updateAssignments } from "../services/task";


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

    console.log(newTasks)

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

    if (tasks?.length > 0) {
        try {
            const schedule = await generateSchedule(tasks, events, 9, 18) as TaskAssignment[];
            if (schedule?.length > 0) {
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

router.get("/week", async (req: Request, res: Response, next) => {
    // Searching for the schedulw only if there is a date range from the client.
    if (req?.query?.minDate && req?.query?.maxDate) {
        const minDate = new Date(req?.query?.minDate.toString());
        const maxDate = new Date(req?.query?.maxDate.toString());

        const userId = getUserId(req);

        // Selecting the tasks and the enevts separately.
        const tasks = await getAllTasksByUserIdAndDates(userId, minDate, maxDate);
        const events = await getAllEventsByUserIdAndDates(userId, minDate, maxDate);

        // Building a list of schedule entities.
        const tasksFormatted = tasks?.map((task) => {
            // Returning only the tasks that are assigned.
            if (task.assignment) {
                const endTime = new Date(task?.assignment);
                endTime.setHours(endTime.getHours() + task.estTime);

                return {
                    id: task.id,
                    title: task.title,
                    startTime: task.assignment,
                    endTime: endTime,
                    tagId: task.tag
                }
            }
        })

        const eventsFormatted = events?.map((event) => {
            return {
                id: event.id,
                title: event.title,
                startTime: event.startTime,
                endTime: event.endTime,
                tagId: event.tag
            }
        })

        return res.status(200).send([...tasksFormatted, ...eventsFormatted]);
    } else {
        next(new BadRequestError("No dates range"))
    }
})


export { router as scheduleRouter };