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