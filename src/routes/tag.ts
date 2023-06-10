import { Request, Response, Router } from "express";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { getUserId } from "../helpers/currentUser";
import { wrapAsyncRouter } from "../helpers/wrapAsyncRouter";
import { addNewTag, deleteTag, getAllTagsByUserId } from "../services/tag";
import { BadRequestError } from "../errors/badRequestError";

const router = wrapAsyncRouter();

router.get("/all-by-user", async (req: Request, res: Response) => {
  const tags = await getAllTagsByUserId(getUserId(req));
  if (!tags) {
    throw new DataNotFoundError("Tags");
  } else {
    return res.status(200).send(tags);
  }
});

router.post("/add", async (req: Request, res: Response) => {
  const newTag = await addNewTag(req.body.tag, getUserId(req));
  if (newTag) {
    return res.status(200).send(newTag);
  } else {
    throw new BadRequestError("Saving new task failed");
  }
});

router.put("/delete/:id", async (req: Request, res: Response) => {
  const retVal = await deleteTag(parseInt(req.params.id));
  if (retVal.affected && retVal.affected > 0) {
    return res.status(200).send(true);
  } else {
    throw new BadRequestError("Deleting tag failed");
  }
});

export { router as tagRouter };
