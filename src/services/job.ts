import { BadRequestError } from "../errors/badRequestError";
import { TaskAssignment } from "../helpers/types";
import { Task } from "../models/task";
import { User } from "../models/user";
import { getAllEventsByUserId } from "./event";
import { generateSchedule } from "./schedule";
import { getAllTasksByUserId, updateAssignments } from "./task";
import { getAllUsers } from "./user";
import { addHours } from 'date-fns';
import { Event } from "../models/event";

const NOW = new Date();

export async function assignmentsUpdate() {
    console.log("JOB IS RUNNING")
    const allUsers: User[] = await getAllUsers()
    let numOfUpdatedUsers = 0;

    // Go over all the users
    if (allUsers && allUsers?.length > 0) {
        for (const user of allUsers) {
            const tasks = await getAllTasksByUserId(user.id);

            // Check if there are tasks that meet the condition for update
            if (needsUpdate(tasks)) {

                console.log("starting update tasks for user: " + user.id)

                // find all tasks that their assignment is today, and treat them as events, means don't reschedule them
                // and reschedule the rest of the tasks
                const todayTasks = getAllTodayTasks(tasks);
                const tasksToAssign = tasks.filter((task) => !(todayTasks.map(todayTask => todayTask.id).includes(task.id)));

                const events = await getAllEventsByUserId(user.id);

                todayTasks.forEach((task) => events.push(
                    Event.create({
                        id: 0,
                        title: task.title,
                        startTime: task.assignment!,
                        endTime: addHours(task.assignment!, task.estTime),
                        user: task.user
                    })))

                if (tasksToAssign?.length > 0) {
                    try {
                        const schedule = await generateSchedule(tasksToAssign, events, user.beginDayHour, user.endDayHour) as TaskAssignment[];
                        if (schedule?.length > 0) {
                            const updatedTasks = await updateAssignments(tasksToAssign.map((task) => task.id), schedule, user.id)
                            console.log("Updated tasks for user: " + user.id)
                            numOfUpdatedUsers++;
                        }
                    } catch (err) {
                        console.log("Failed to update tasks for user: " + user.id)
                        console.log(err);
                        // new BadRequestError("Generating schedule failed")
                    }
                }
            } else {
                console.log("No update needed for user: " + user.id)
            }
        }
    }
    console.log("JOB FINISHED RUNNING")
    console.log("Number of user updated: " + numOfUpdatedUsers)
    console.log("---------------------------------------")
}

// Check if there are any tasks that have not yet been done, their assignment has passed and their due date has not yet passed,
// or they don't have an assignment. if there are any, return true
function needsUpdate(tasks: Task[]): boolean {
    const task = tasks.find((task) => ((task.assignment && task.assignment < NOW) || !task.assignment) && task.dueDate > NOW)
    return task !== undefined;
}

function getAllTodayTasks(tasks: Task[]) {
    return tasks.filter((task) => task.assignment?.toLocaleDateString() === NOW.toLocaleDateString())
}