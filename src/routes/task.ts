import { NextFunction, Request, Response, Router } from "express";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { getUserId } from "../helpers/currentUser";
import { TaskService } from "../services/task";
import { ITask } from "../models/task";
import { BadRequestError } from "../errors/badRequestError";
import { wrapAsyncRouter } from "../helpers/wrapAsyncRouter";

const router = wrapAsyncRouter();

/** 
* @swagger
* tags:
*   name: Task
*   description: Mission to accomplish until a certain date, without a specific time
*/

// TODO: fix example for tag
/**
* @swagger 
* components:
*   schemas:
*     Task:
*       type: object
*       required:
*         - id
*         - title
*         - estTime
*         - dueDate
*         - priority
*       properties:
*         id:
*           type: number
*           description: The task's id
*         title:
*           type: string
*           description: The task's title
*         location:
*           type: string
*           description: Where will the task take place
*         description:
*           type: string
*           description: Short description to expand the information
*         estTime:
*           type: number
*           description: Estimated time that the task will take in hours
*         dueDate:
*           type: string
*           format: date
*           description: Date that the task needs to be preformed
*         tag:
*           $ref: '#/components/schemas/Tag'
*         priority:
*           type: number
*           description: The task's priority (1-3 when 1 is the most-important)
*         assignment:
*           type: string
*           format: date
*           description: The time that the task is scheduled to be done
*         isDone:
*           type: boolean
*           description: Weather you have finished the task
*         assignmentLastUpdate:
*           type: string
*           format: date
*           description: The last time the assignment date ws updated
*       example: 
*         id: 1
*         title: 'Task Title'
*         location: 'Home'
*         description: 'Here describe your task details'
*         estTime: 2
*         dueDate: '2023-06-23T08:00:00.000Z'
*         tag:
*         priority: 1
*         assignment: '2023-06-20T17:00:00.000Z'
*         isDone: false
*         assignmentLastUpdate: '2023-06-20T15:57:55.961Z'
*/

/**
* @swagger
* /task/getOne/{id}:
*   get:
*     summary: get task data by id
*     tags: [Task]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The task id
*     responses:
*       200:
*         description: The task data
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Task'
*       404:
*         description: Task was not found
*/
router.get(
  "/getOne/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await TaskService.getById(parseInt(req.params.id));
    if (!task) {
      throw new DataNotFoundError("Task");
    } else {
      return res.status(200).send(task);
    }
  }
);

/**
* @swagger
* /task/getOne/{id}:
*   get:
*     summary: get task data by id
*     tags: [Task]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The task id
*     responses:
*       200:
*         description: The task data
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Task'
*       404:
*         description: Task not found
*/
router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
  const tasks = await TaskService.getAllTasksByUserId(getUserId(req), true, true);
  if (!tasks) {
    throw new DataNotFoundError("Tasks");
  } else {
    return res.status(200).send(tasks);
  }
});

/**
* @swagger
* /task/setdone/{id}:
*   put:
*     summary: update task's isDone field to opposite
*     tags: [Task]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The task id
*     responses:
*       200:
*         description: isDone field updated successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Task'
*       404:
*         description: Task not found
*/
router.put(
  "/setdone/:id",
  async (req: Request, res: Response) => {
    const updatedTask = await TaskService.setDone(parseInt(req.params.id), getUserId(req));

    if (!updatedTask) {
      throw new DataNotFoundError("Task");
    } else {
      return res.status(200).send(updatedTask);
    }
  }
);

router.put("/:id", async (req: Request, res: Response) => {
  const updatedTask = await TaskService.updateTask(req.body.task as ITask, getUserId(req));
  if (!updatedTask) {
    throw new BadRequestError("Updating task failed");
  } else {
    return res.status(200).send(updatedTask);
  }
});

router.put("/delete/:id", async (req: Request, res: Response) => {
  const retVal = await TaskService.deleteTask(parseInt(req.params.id));
  if (retVal.affected && retVal.affected > 0) {
    return res.status(200).send(true);
  } else {
    throw new BadRequestError("Deleting task failed");
  }
});

export { router as taskRouter };
