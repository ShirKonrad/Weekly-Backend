import axios, { AxiosError } from 'axios'
import { TaskAssignment } from '../helpers/types'
import { Event } from '../models/event'
import { ITask, Task } from '../models/task'

export const getTasksAssignments = async (tasks: Task[], events: Event[], dayHoursStart: number, dayHoursEnd: number) => {
    console.log("CALL TO ALGORITHM")

    const tasksJson = tasks.map((task) => {
        return {
            ...task,
            dueDate: task.dueDate.toLocaleString("he-IL")
        }
    })

    const eventsJson = events.map((event) => {
        return {
            ...event,
            startTime: event.startTime.toLocaleString("he-IL"),
            endTime: event.endTime.toLocaleString("he-IL")
        }
    })

    const body = {
        tasks: tasksJson,
        events: eventsJson,
        dayHoursStart,
        dayHoursEnd
    }
    return await axios.post(`${process.env.MICRO_SERVICE_URL}/assignment`, body)
        .then(res => {
            console.log("algorithm response assignment")
            console.log(res.data)

            const schedule: TaskAssignment[] = [];

            for (const [key, value] of Object.entries(res.data)) {
                schedule.push({
                    taskId: Number(key),
                    assignment: new Date(String(value))
                })
            }
            return schedule

        })
        .catch((err) => {
            // console.error(err)
            // return err;
            throw new AxiosError()
        })
}