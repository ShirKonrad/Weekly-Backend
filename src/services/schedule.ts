import { getTasksAssignments } from "../api/algo"
import { Event } from "../models/event"
import { ITask, Task } from "../models/task"


export async function generateSchedule(tasks: ITask[], events: Event[], workingHoursStart: number, workingHoursEnd: number) {
    return await getTasksAssignments(tasks, events, workingHoursStart, workingHoursEnd)
}