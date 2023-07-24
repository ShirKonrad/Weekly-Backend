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
*         id: 0
*         name: 'Work'
*         color: '#33d7cd'
*/

/**
* @swagger
* /tag/all-by-user:
*   get:
*     summary: get tags of current user
*     tags: [Tag]
*     responses:
*       200:
*         description: the user's tags
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Tag'
*       401:
*         $ref: '#/responses/Unauthorized'
*       404:
*         $ref: '#/responses/NotFound'
*/
router.get("/all-by-user", async (req: Request, res: Response) => {
  const tags = await TagService.getAllTagsByUserId(getUserId(req));
  if (!tags) {
    throw new DataNotFoundError("Tags");
  } else {
    return res.status(200).send(tags);
  }
});

/**
* @swagger
* /tag/add:
*   post:
*     summary: get tags of current user
*     tags: [Tag]
*     requestBody:
*         required: true
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 tag:
*                   $ref: '#/components/schemas/Tag'
*     responses:
*       200:
*         description: the user's tags
*         content:
*           application/json:
*             schema:
*               type: object
*               $ref: '#/components/schemas/Tag'
*       400:
*         $ref: '#/responses/BadRequest'
*/
router.post("/add", async (req: Request, res: Response) => {
  const newTag = await TagService.addNewTag(req.body.tag, getUserId(req));
  if (newTag) {
    return res.status(200).send(newTag);
  } else {
    throw new BadRequestError("Saving new tag failed");
  }
});

/**
* @swagger
* /tag/delete/{id}:
*   put:
*     summary: delete tag
*     tags: [Tag]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The tag id
*     responses:
*       200:
*         description: the user's tags
*         content:
*           application/json:
*             schema:
*               type: boolean
*       400:
*         $ref: '#/responses/BadRequest'
*/
router.put("/delete/:id", async (req: Request, res: Response) => {
  const retVal = await TagService.deleteTag(parseInt(req.params.id));
  if (retVal.affected && retVal.affected > 0) {
    return res.status(200).send(true);
  } else {
    throw new BadRequestError("Deleting tag failed");
  }
});

/**
* @swagger
* /tag/update/{id}:
*   put:
*     summary: update tag
*     tags: [Tag]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The tag id
*     requestBody:
*         required: true
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 tag:
*                   $ref: '#/components/schemas/Tag'
*     responses:
*       200:
*         description: the user's tags
*         content:
*           application/json:
*             schema:
*               type: object
*               $ref: '#/components/schemas/Tag'
*       400:
*         $ref: '#/responses/BadRequest'
*       401:
*         $ref: '#/responses/Unauthorized'
*/
router.put("/update/:id", async (req: Request, res: Response) => {
  const updatedTag = await TagService.updateTag(req.body.tag as Tag, getUserId(req));
  if (!updatedTag) {
    throw new BadRequestError("Updating tag failed");
  } else {
    return res.status(200).send(updatedTag);
  }
});

export { router as tagRouter };
