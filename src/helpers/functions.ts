import { Event } from "../models/event";
import { Task } from "../models/task";
import { addHours, addDays } from 'date-fns';
import { getAllTasksByUserIdAndDates } from "../services/task";
import { getAllEventsByUserIdAndDates } from "../services/event";
import { getUserById } from "../services/user";

export async function checkAssignmentTimeValid(id: number, startTime: Date, endTime: Date, isTask: boolean, userId: number) {
    const user = await getUserById(userId);

    // Select all the tasks and events in the same day and check if the new assignment is overlap with one of them
    const selectFrom = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), user?.beginDayHour || 0, 0, 0);
    const selectTo = addDays(selectFrom, 1);
    const tasksInTheSameDay = await getAllTasksByUserIdAndDates(userId, selectFrom, endTime);
    const eventsInTheSameDay = await getAllEventsByUserIdAndDates(userId, selectFrom, selectTo);

    if (checkScheduleItemsOverlap(tasksInTheSameDay, eventsInTheSameDay, id, startTime, endTime, isTask)) {
        return (isTask ? "Assignment" : "Event time") + " is overlaps with other tasks or events in your schedule"
    }

    // Check if it is outside the working hours
    if (isOutsideDayHours(startTime, endTime, user?.beginDayHour, user?.endDayHour)) {
        return (isTask ? "Assignment" : "Event time") + " is outside your day hours"
    }
}

export function checkScheduleItemsOverlap(tasks: Task[], events: Event[], id: number, startTime: Date, endTime: Date, isTask: boolean) {
    for (const task of tasks) {
        if (isTask && id === task.id) {
            continue;
        }

        if (task.assignment && overlap(startTime, endTime, task.assignment, addHours(task.assignment, task.estTime))) {
            return true;
        }
    }

    for (const event of events) {
        if (!isTask && id === event.id) {
            continue;
        }

        if (overlap(startTime, endTime, event.startTime, event.endTime)) {
            return true;
        }

    }

    return false;
}

export function overlap(startTime1: Date, endTime1: Date, startTime2: Date, endTime2: Date) {
    return ((startTime1 <= startTime2 && startTime2 < endTime1) ||
        (startTime2 <= startTime1 && startTime1 < endTime2))

}

export function isOutsideDayHours(startTime: Date, endTime: Date, beginDayHour?: number, endDayHour?: number) {

    if (beginDayHour === 0 && endDayHour === 0) {
        return false
    }

    if (beginDayHour !== undefined && endDayHour !== undefined) {
        return (startTime.getHours() < beginDayHour ||
            startTime.getHours() >= endDayHour ||
            endTime.getHours() <= beginDayHour ||
            endTime.getHours() > endDayHour)
    }
    return false;
}