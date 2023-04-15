import { In, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { TaskAssignment } from "../helpers/types";
import { ITask, Task } from "../models/task";

export async function getAllTasksByUserId(userId: number) {
    return await Task.find({
        where: {
            user: { id: userId },
            dueDate: MoreThanOrEqual(new Date()),
            isDone: false
        },
        relations: ["user", "tag"],
    });
}

export async function getAllTasksByUserIdAndDates(userId: number, minDate: Date, maxDate: Date) {
    return await Task.find({
        where: {
            user: { id: userId },
            assignment: MoreThanOrEqual(minDate) && LessThanOrEqual(maxDate)
        },
        relations: ["user", "tag"],
    });
}

export async function saveTasks(tasks: ITask[], userId: number) {
    const newTasks = tasks.map((task: ITask) => {
        return Task.create({
            ...task,
            user: { id: userId },
            tag: { id: task.tagId },
            isDone: false
        })
    })

    return await Task.insert(newTasks);
}

export async function updateAssignments(assignments: TaskAssignment[], userId: number) {
    const tasks = await Task.find({
        where: {
            id: In(assignments.map((assignment) => assignment.taskId))
        },
        relations: ["user", "tag"],
    });

    if (tasks) {
        const tasksToSave = tasks.map((task) => {
            return {
                ...task,
                assignment: assignments.find((assignment) => assignment.taskId === task.id)?.assignment
            }
        })

        return await Task.save(tasksToSave)
    }
}