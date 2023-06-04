import { Request, Response, Router } from "express";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { getUserId } from "../helpers/currentUser";
import {
  deleteTask,
  getAllTasksByUserId,
  setDone,
  updateTask,
} from "../services/task";
import { Task } from "../models/task";
import { BadRequestError } from "../errors/badRequestError";

const router = Router();

router.get("/all", async (req: Request, res: Response, next) => {
  const tasks = await getAllTasksByUserId(getUserId(req), true);
  if (!tasks) {
    next(new DataNotFoundError("Tasks"));
  } else {
    return res.status(200).send(tasks);
  }
});

router.put("/setdone/:id", async (req: Request, res: Response) => {
  const updatedTask = await setDone(parseInt(req.params.id), getUserId(req));

  if (!updatedTask) {
    throw new DataNotFoundError("Task");
  } else {
    return res.status(200).send(updatedTask);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const updatedTask = await updateTask(req.body.task as Task, getUserId(req));
  if (!updatedTask) {
    throw new BadRequestError("Updating task failed");
  } else {
    return res.status(200).send(updatedTask);
  }
});

router.put("/delete/:id", async (req: Request, res: Response) => {
  const retVal = await deleteTask(parseInt(req.params.id));
  if (retVal.affected) {
    return res.status(200).send(retVal.affected);
  } else {
    throw new BadRequestError("Deleting task failed");
  }
});

export { router as taskRouter };
