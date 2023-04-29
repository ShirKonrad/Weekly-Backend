import { Request, Response, Router } from "express";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { getUserId } from "../helpers/currentUser";
import { getAllTasksByUserId, setDone } from "../services/task";


const router = Router();

router.get("/all", async (req: Request, res: Response, next) => {
    const tasks = await getAllTasksByUserId(getUserId(req), true);
    if (!tasks) {
        next(new DataNotFoundError("Tasks"));
    } else {
        return res.status(200).send(tasks);
    }
})

router.put("/setdone/:id", async (req: Request, res: Response) => {
    const updatedTask = await setDone(parseInt(req.params.id), getUserId(req));

    if (!updatedTask) {
        throw new DataNotFoundError("Task");
    } else {
        return res.status(200).send(updatedTask);
    }
});

export { router as taskRouter };
