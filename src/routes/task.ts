import { NextFunction, Request, Response, Router } from "express";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { getUserId } from "../helpers/currentUser";
import { TaskService } from "../services/task";
import { ITask, Task } from "../models/task";
import { BadRequestError } from "../errors/badRequestError";
import { wrapAsyncRouter } from "../helpers/wrapAsyncRouter";

const router = wrapAsyncRouter();
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

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
  const tasks = await TaskService.getAllTasksByUserId(getUserId(req), true, true);
  if (!tasks) {
    throw new DataNotFoundError("Tasks");
  } else {
    return res.status(200).send(tasks);
  }
});

router.put(
  "/setdone/:id",
  async (req: Request, res: Response, next: NextFunction) => {
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
