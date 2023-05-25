import { BadRequestError } from "../errors/badRequestError";
import { TaskAssignment } from "../helpers/types";
import { Task } from "../models/task";
import { User } from "../models/user";
import { getAllEventsByUserId } from "./event";
import { generateSchedule } from "./schedule";
import { getAllTasksByUserId, updateAssignments } from "./task";
import { getAllUsers } from "./user";

export async function assignmentsUpdate() {
    console.log("JOB IS RUNNING")
    const allUsers: User[] = await getAllUsers()

    // Go over all the users
    if (allUsers && allUsers?.length > 0) {
        for (const user of allUsers) {
            const tasks = await getAllTasksByUserId(user.id);

            if (needsUpdate(tasks)) {

                const events = await getAllEventsByUserId(user.id);

                // TODO: get the user's working hours

                if (tasks?.length > 0) {
                    try {
                        const schedule = await generateSchedule(tasks, events, 9, 18) as TaskAssignment[];
                        if (schedule?.length > 0) {
                            const updatedTasks = await updateAssignments(schedule, user.id)
                        }
                    } catch (err) {
                        console.error(err);
                        // new BadRequestError("Generating schedule failed")
                    }
                }

            }
        }
    }
}

function needsUpdate(tasks: Task[]) {
    const now = new Date();
    const task = tasks.find((task) => task.assignment && task.assignment < now && task.dueDate > now)
    return task !== undefined;
}