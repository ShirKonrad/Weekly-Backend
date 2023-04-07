import axios from 'axios'
import { Event } from '../models/event'
import { ITask, Task } from '../models/task'

export const getTasksAssignments = async (tasks: ITask[], events: Event[], workingHoursStart: number, workingHoursEnd: number) => {
    return await axios.post('http://127.0.0.1:5000/assignment', tasks)
        .then(res => {
            console.log("algorithm response assignment")
            console.log(res.data)

            const schedule = [];

            for (const [key, value] of Object.entries(res.data)) {
                schedule.push({
                    taskId: key,
                    assignment: new Date(String(value))
                })
            }
            return schedule

        })
        .catch((err) => {
            console.log(err)
        })
}