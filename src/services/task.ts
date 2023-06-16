import { Between, In, IsNull, MoreThanOrEqual, Not } from "typeorm";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { NotFoundError } from "../errors/notFoundError";
import { TaskAssignment } from "../helpers/types";
import { ITask, Task } from "../models/task";
import { getTagById } from "./tag";

export async function getById(taskId: number) {
  return await Task.findOne({
    where: { id: taskId },
    relations: ["tag"],
  });
}

export async function getAllTasksByUserId(
  userId: number,
  withDone?: boolean,
  withPastDueDate?: boolean,
  onlyWithAssignment?: boolean
) {
  return await Task.find({
    where: {
      user: { id: userId },
      dueDate: withPastDueDate ? undefined : MoreThanOrEqual(new Date()),
      isDone: withDone ? undefined : false,
      assignment: onlyWithAssignment ? Not(IsNull()) : undefined
    },
    relations: ["tag"],
  });
}

export async function getAllTasksByUserIdAndDates(
  userId: number,
  minDate: Date,
  maxDate: Date
) {
  return await Task.find({
    where: {
      user: { id: userId },
      isDone: false,
      assignment: Between(minDate, maxDate),
    },
    relations: ["tag"],
  });
}

export async function saveTasks(tasks: ITask[], userId: number) {
  const newTasks = tasks.map((task: ITask) => {
    return Task.create({
      ...task,
      user: { id: userId },
      tag: { id: task?.tag?.id },
      isDone: task.isDone || false,
    });
  });

  return await Task.save(newTasks);
}

export async function updateAssignments(
  allTasksIdToUpdate: number[],
  assignments: TaskAssignment[],
  userId: number
) {
  // const tasks = await Task.find({
  //   where: {
  //     id: In(assignments.map((assignment) => assignment.taskId)),
  //     user: { id: userId },
  //   },
  //   relations: ["tag"],
  // });

  const tasks = await Task.find({
    where: {
      id: In(allTasksIdToUpdate),
      user: { id: userId },
    },
    relations: ["tag"],
  });

  if (tasks?.length > 0) {
    const tasksToSave = tasks.map((task) => {
      return {
        ...task,
        assignment: assignments.find((assignment) => assignment.taskId === task.id)?.assignment || null,
        assignmentLastUpdate: new Date()
      };
    });

    return await Task.save(tasksToSave);
  }
}

export async function setDone(taskId: number, userId: number) {
  const task = await Task.findOne({
    where: {
      id: taskId,
      user: { id: userId },
    },
    relations: ["tag"],
  });

  if (task) {
    task.isDone = !task.isDone;
    return await Task.save(task);
  } else {
    return undefined;
  }
}

export async function updateTask(newTask: ITask, userId: number) {
  const task = await Task.findOne({
    where: {
      id: newTask.id,
      user: { id: userId },
    },
    relations: ["tag"],
  });

  if (task) {

    //TODO: check assignment not overlap

    task.title = newTask.title;
    task.location = newTask.location;
    task.description = newTask.description;
    task.dueDate = newTask.dueDate;
    task.estTime = newTask.estTime;
    task.priority = newTask.priority;
    task.tag = newTask.tag ? await getTagById(newTask.tag?.id, userId) || task.tag : null;
    task.assignment = newTask.assignment;

    return await Task.save(task);
  } else {
    return undefined;
  }
}

export async function deleteTask(taskId: number) {
  return Task.delete(taskId);
}
