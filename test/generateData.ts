import { Task } from "../src/models/task";
import { User } from "../src/models/user";
import { Event } from "../src/models/event";
import { addHours } from "date-fns";

export function generateTaskData(overide = {}) {
    return {
        id: 1,
        title: "task title",
        estTime: 1,
        dueDate: new Date("2023-06-01"),
        priority: 1,
        ...overide,
    } as Task;
}

export function generateTasksData(n: number = 1, overide = {}): Task[] {
    return Array.from(
        {
            length: n,
        },
        (_, i) => {
            return generateTaskData({ id: i, ...overide }) as Task;
        }
    );
}

export function generateUserData(overide = {}) {
    return {
        id: 0,
        firstName: "test user",
        lastName: "test user",
        email: "test@gmail.com",
        beginDayHour: 9,
        endDayHour: 18,
        ...overide,
    } as User;
}

export function generateEventData(overide = {}) {
    return {
        id: 1,
        title: "event title",
        startTime: new Date("2023-06-01"),
        endTime: addHours(new Date("2023-06-01"), 1),
        ...overide,
    } as Event;
}

export function generateEventsData(n: number = 1, overide = {}): Event[] {
    return Array.from(
        {
            length: n,
        },
        (_, i) => {
            return generateEventData({ id: i, ...overide }) as Event;
        }
    );
}

export function generateScheduleData(n: number = 1, isTasks: boolean, overide = {}) {
    return Array.from(
        {
            length: n,
        },
        (_, i) => {
            return {
                id: i,
                title: isTasks ? "task title" : "event title",
                startTime: new Date("2023-06-01"),
                endTime: addHours(new Date("2023-06-01"), 1),
                isTask: isTasks,
            };
        }
    );
}