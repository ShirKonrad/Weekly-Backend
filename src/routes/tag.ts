import { Request, Response, Router } from "express";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { getUserId } from "../helpers/currentUser";
import { wrapAsyncRouter } from "../helpers/wrapAsyncRouter";
import {
  TagService,
} from "../services/tag";
import { BadRequestError } from "../errors/badRequestError";
import { Tag } from "../models/tag";

const router = wrapAsyncRouter();

/** 
* @swagger
* tags:
*   name: Tag
*   description: User's categories for tasks and events organization
*/

/**
* @swagger 
* components:
*   schemas:
*     Tag:
*       type: object
*       required:
*         - id
*         - name
*         - user
*         - color
*       properties:
*         id:
*           type: number
*           description: The tag's id
*         name:
*           type: string
*           description: The tag's name
*         color:
*           type: string
*           description: Color for the tag (Hex)
*       example:
*         id: 1
*         name: 'Tag Name'
*         color: '#33d7cd'
*/

router.get("/all-by-user", async (req: Request, res: Response) => {
  const tags = await TagService.getAllTagsByUserId(getUserId(req));
  if (!tags) {
    throw new DataNotFoundError("Tags");
  } else {
    return res.status(200).send(tags);
  }
});

router.post("/add", async (req: Request, res: Response) => {
  const newTag = await TagService.addNewTag(req.body.tag, getUserId(req));
  if (newTag) {
    return res.status(200).send(newTag);
  } else {
    throw new BadRequestError("Saving new task failed");
  }
});

router.put("/delete/:id", async (req: Request, res: Response) => {
  const retVal = await TagService.deleteTag(parseInt(req.params.id));
  if (retVal.affected && retVal.affected > 0) {
    return res.status(200).send(true);
  } else {
    throw new BadRequestError("Deleting tag failed");
  }
});

router.put("/update/:id", async (req: Request, res: Response) => {
  const updatedTag = await TagService.updateTag(req.body.tag as Tag, getUserId(req));
  if (!updatedTag) {
    throw new BadRequestError("Updating tag failed");
  } else {
    return res.status(200).send(updatedTag);
  }
});

export { router as tagRouter };
