import { Between, In, IsNull, MoreThanOrEqual, Not } from "typeorm";
import { TaskAssignment } from "../helpers/types";
import { ITask, Task } from "../models/task";
import { TagService } from "./tag";
import { validateTask } from "../helpers/functions";
import { ValidationError } from "../errors/validationError";

export class TaskService {

  static getById = async (taskId: number) => {
    return await Task.findOne({
      where: { id: taskId },
      relations: ["tag"],
    });
  }

  static getAllTasksByUserId = async (
    userId: number,
    withDone?: boolean,
    withPastDueDate?: boolean,
    onlyWithAssignment?: boolean
  ) => {
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

  static getAllTasksByUserIdAndDates = async (
    userId: number,
    minDate: Date,
    maxDate: Date
  ) => {
    return await Task.find({
      where: {
        user: { id: userId },
        isDone: false,
        assignment: Between(minDate, maxDate),
      },
      relations: ["tag"],
    });
  }

  static saveTasks = async (tasks: ITask[], userId: number) => {
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

  static async updateAssignments(
    allTasksIdToUpdate: number[],
    assignments: TaskAssignment[],
    userId: number
  ) {

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
          assignment: assignments?.find((assignment) => assignment.taskId === task.id)?.assignment || null,
          assignmentLastUpdate: new Date()
        };
      });

      return await Task.save(tasksToSave);
    }
  }

  static setDone = async (taskId: number, userId: number) => {
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

  static updateTask = async (newTask: ITask, userId: number) => {
    const task = await Task.findOne({
      where: {
        id: newTask.id,
        user: { id: userId },
      },
      relations: ["tag"],
    });

    if (task) {

      // Validate task
      const validationMessage = validateTask(newTask)
      if (validationMessage) {
        throw new ValidationError(validationMessage)
      }

      task.title = newTask.title;
      task.location = newTask.location;
      task.description = newTask.description;
      task.dueDate = new Date(newTask.dueDate);
      task.estTime = newTask.estTime;
      task.priority = newTask.priority;
      task.tag = newTask.tag ? await TagService.getTagById(newTask.tag?.id, userId) || task.tag : null;
      task.assignment = newTask.assignment && new Date(newTask.assignment);

      return await Task.save(task);
    } else {
      return undefined;
    }
  }

  static deleteTask = async (taskId: number) => {
    return Task.delete(taskId);
  }

}
