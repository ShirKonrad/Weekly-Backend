import { Request, Response, Router } from "express";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { getUserId } from "../helpers/currentUser";
import { wrapAsyncRouter } from "../helpers/wrapAsyncRouter";
import { getAllTagsByUserId } from "../services/tag";


const router = wrapAsyncRouter();

router.get("/all-by-user", async (req: Request, res: Response) => {
    const tags = await getAllTagsByUserId(getUserId(req));
    if (!tags) {
        throw new DataNotFoundError("Tags");
    } else {
        return res.status(200).send(tags);
    }
})

export { router as tagRouter };
