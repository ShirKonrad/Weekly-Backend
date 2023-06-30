import { Event } from "../src/models/event";
import { Task } from "../src/models/task";

export function generateTaskData(overide = {}) {
  return {
    id: 1,
    title: "title",
    estTime: 1,
    dueDate: new Date(),
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

export function generateEventData(overide = {}) {
  return {
    id: 1,
    title: "title",
    startTime: new Date(),
    endTime: new Date(),
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
