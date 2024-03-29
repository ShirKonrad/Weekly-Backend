import { getTasksAssignments } from "../api/algo"
import { Event } from "../models/event"
import { ITask, Task } from "../models/task"

export class ScheduleService {

    static generateSchedule = async (tasks: Task[], events: Event[], dayHoursStart: number, dayHoursEnd: number) => {
        return await getTasksAssignments(tasks, events, dayHoursStart, dayHoursEnd)
    }
}