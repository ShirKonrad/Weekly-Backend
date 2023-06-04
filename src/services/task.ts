import { In, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { TaskAssignment } from "../helpers/types";
import { ITask, Task } from "../models/task";
import { getTagById } from "./tag";

export async function getAllTasksByUserId(userId: number, withDone?: boolean) {
  return await Task.find({
    where: {
      user: { id: userId },
      dueDate: MoreThanOrEqual(new Date()),
      isDone: withDone ? undefined : false,
    },
    relations: ["user", "tag"],
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
      assignment: MoreThanOrEqual(minDate) && LessThanOrEqual(maxDate),
    },
    relations: ["user", "tag"],
  });
}

export async function saveTasks(tasks: ITask[], userId: number) {
  const newTasks = tasks.map((task: ITask) => {
    return Task.create({
      ...task,
      user: { id: userId },
      tag: { id: task?.tag?.id },
      isDone: false,
    });
  });

  return await Task.insert(newTasks);
}

export async function updateAssignments(
  assignments: TaskAssignment[],
  userId: number
) {
  const tasks = await Task.find({
    where: {
      id: In(assignments.map((assignment) => assignment.taskId)),
      user: { id: userId },
    },
    relations: ["user", "tag"],
  });

  if (tasks?.length > 0) {
    const tasksToSave = tasks.map((task) => {
      return {
        ...task,
        assignment: assignments.find(
          (assignment) => assignment.taskId === task.id
        )?.assignment,
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
    relations: ["user", "tag"],
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
    relations: ["user", "tag"],
  });

  if (task) {
    task.title = newTask.title;
    task.location = newTask.location;
    task.description = newTask.description;
    task.dueDate = newTask.dueDate;
    task.estTime = newTask.estTime;
    // task.tag= await getTagById(newTask.tag?.id ?? 0);
    task.priority = newTask.priority;
    return await Task.save(task);
  } else {
    return undefined;
  }
}
