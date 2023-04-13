import axios, { AxiosError } from 'axios'
import { TaskAssignment } from '../helpers/types'
import { Event } from '../models/event'
import { ITask, Task } from '../models/task'

export const getTasksAssignments = async (tasks: Task[], events: Event[], workingHoursStart: number, workingHoursEnd: number) => {
    console.log("CALL TO ALGORITHM")
    const body = {
        tasks,
        events,
        workingHoursStart,
        workingHoursEnd
    }
    return await axios.post('http://127.0.0.1:5000/assignment', body)
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
            console.error(err)
            return err;
            // throw new AxiosError()
        })
}