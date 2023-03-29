import { getGeneratedSchedule } from "../api/algo"
import { Event } from "../models/event"
import { ITask, Task } from "../models/task"


export async function generateSchedule(tasks: ITask[], events: Event[], workingHoursStart: number, workingHoursEnd: number) {
    return await getGeneratedSchedule(tasks, events, workingHoursStart, workingHoursEnd)
}