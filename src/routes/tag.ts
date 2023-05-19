import { Request, Response, Router } from "express";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { getUserId } from "../helpers/currentUser";
import { getAllTagsByUserId } from "../services/tag";


const router = Router();

router.get("/all-by-user", async (req: Request, res: Response, next) => {
    const tags = await getAllTagsByUserId(getUserId(req));
    if (!tags) {
        next(new DataNotFoundError("Tags"));
    } else {
        return res.status(200).send(tags);
    }
})

export { router as tagRouter };
