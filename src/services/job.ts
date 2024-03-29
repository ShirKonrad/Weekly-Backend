import { BadRequestError } from "../errors/badRequestError";
import { TaskAssignment } from "../helpers/types";
import { Task } from "../models/task";
import { User } from "../models/user";
import { EventService } from "./event";
import { ScheduleService } from "./schedule";
import { TaskService } from "./task";
import { UserService } from "./user";
import { addHours } from 'date-fns';
import { Event } from "../models/event";

// const NOW = new Date();

export async function assignmentsUpdate() {
    console.log("JOB IS RUNNING")
    const allUsers: User[] = await UserService.getAllUsers()
    let numOfUpdatedUsers = 0;

    // Go over all the users
    if (allUsers && allUsers?.length > 0) {
        for (const user of allUsers) {
            const tasks = await TaskService.getAllTasksByUserId(user.id);

            // Check if there are tasks that meet the condition for update
            if (needsUpdate(tasks)) {

                console.log("starting update tasks for user: " + user.id)

                // find all tasks that their assignment is today, and treat them as events, means don't reschedule them
                // and reschedule the rest of the tasks
                const todayTasks = getAllTodayTasks(tasks);
                const tasksToAssign = tasks.filter((task) => !(todayTasks.map(todayTask => todayTask.id).includes(task.id)));

                const events = await EventService.getAllEventsByUserId(user.id);

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
                        const schedule = await ScheduleService.generateSchedule(tasksToAssign, events, user.beginDayHour, user.endDayHour) as TaskAssignment[];
                        const updatedTasks = await TaskService.updateAssignments(tasksToAssign.map((task) => task.id), schedule, user.id)
                        console.log("Updated tasks for user: " + user.id)
                        numOfUpdatedUsers++;
                    } catch (err) {
                        console.log("Failed to update tasks for user: " + user.id)
                        console.log(err);
                    }
                } else {
                    console.log("No update needed for user: " + user.id)
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
    const NOW = new Date();
    const task = tasks.find((task) => ((task.assignment && task.assignment < NOW) || !task.assignment) && task.dueDate > NOW)
    return task !== undefined;
}

// Get all task that are in the same day as NOW and start after it
function getAllTodayTasks(tasks: Task[]) {
    const NOW = new Date();
    return tasks.filter((task) => task.assignment &&
        (task.assignment?.toLocaleDateString() === NOW.toLocaleDateString() && task.assignment >= NOW))
}