import { Request, Response, Router } from "express";
import { BadRequestError } from "../errors/badRequestError";
import { ClientMessageError } from "../errors/clientMessageError";
import { clientErrors } from "../helpers/constants";
import { getUserId } from "../helpers/currentUser";
import { TaskAssignment } from "../helpers/types";
import { wrapAsyncRouter } from "../helpers/wrapAsyncRouter";
import { Event, IEvent } from "../models/event";
import { ITask, Task } from "../models/task";
import {
  getAllEventsByUserId,
  getAllEventsByUserIdAndDates,
  saveEvents,
} from "../services/event";
import { generateSchedule } from "../services/schedule";
import { TaskService } from "../services/task";
import { getUserById } from "../services/user";

const router = wrapAsyncRouter();

/**
 * Get new or existing tasks and events and save them on DB.
 * Then select all the tasks and events in the user's schedule and regenerate the schedule with the new tasks and events.
 * Update the new assignments in the DB
 */
router.post("", async (req: Request, res: Response) => {
  const newTasks = req.body.tasks as ITask[];
  const newEvents = req.body.events as IEvent[];

  const userId = getUserId(req);

  // console.log(newTasks);

  try {
    if (newTasks && newTasks.length > 0) {
      await TaskService.saveTasks(newTasks, userId);
    }
    if (newEvents && newEvents.length > 0) {
      await saveEvents(newEvents, userId);
    }
  } catch (err) {
    console.log(err);
    throw new ClientMessageError(clientErrors.SAVING_TASKS_FAILED);
  }

  // get all the user's tasks and events that their due date has not passed
  const tasks = await TaskService.getAllTasksByUserId(userId);
  const events = await getAllEventsByUserId(userId);

  if (tasks?.length > 0) {
    try {
      // get the user in order to get his day hours
      const user = await getUserById(userId);

      const schedule = (await generateSchedule(
        tasks,
        events,
        user?.beginDayHour || 0,
        user?.endDayHour || 0
      )) as TaskAssignment[];
      const updatedTasks = await TaskService.updateAssignments(tasks.map((task) => task.id), schedule, userId);
      const assignedTasks = updatedTasks?.filter((task) => task.assignment !== null);
      const notAssignedTasks = updatedTasks?.filter((task) => task.assignment === null)
      return res.status(200).send({ assignedTasks: assignedTasks, notAssignedTasks: notAssignedTasks });
    } catch (err) {
      console.error(err);
      throw new ClientMessageError(clientErrors.GENERATE_SCHEDULE_FAILED);
    }
  } else {
    return res.status(200).send("no tasks to schedule");
  }
});

router.get("/week", async (req: Request, res: Response) => {

  const userId = getUserId(req);

  let tasks: Task[] = [];
  let events: Event[] = [];

  // Selecting the tasks and the enevts separately.
  // If there is a date range from the client, select only in the given dates, otherwise select all
  if (req?.query?.minDate && req?.query?.maxDate) {
    const minDate = new Date(req?.query?.minDate.toString());
    const maxDate = new Date(req?.query?.maxDate.toString());
    tasks = await TaskService.getAllTasksByUserIdAndDates(userId, minDate, maxDate);
    events = await getAllEventsByUserIdAndDates(userId, minDate, maxDate);
  } else {
    tasks = await TaskService.getAllTasksByUserId(userId, false, true, true);
    events = await getAllEventsByUserId(userId, true);
  }

  // const tasks = await getAllTasksByUserIdAndDates(userId, minDate, maxDate);
  // const events = await getAllEventsByUserIdAndDates(userId, minDate, maxDate);

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
        tag: task.tag,
        isTask: true,
      };
    }
  });

  const eventsFormatted = events?.map((event) => {
    return {
      id: event.id,
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      tag: event.tag,
      isTask: false,
    };
  });

  return res.status(200).send([...tasksFormatted, ...eventsFormatted]);
  // } else {
  //   throw new BadRequestError("No dates range");
  // }
});

export { router as scheduleRouter };
