import { Request, Response, Router } from "express";
import { EventService } from "../services/event";
import { Event, IEvent } from "../models/event";
import { getUserId } from "../helpers/currentUser";
import { BadRequestError } from "../errors/badRequestError";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { wrapAsyncRouter } from "../helpers/wrapAsyncRouter";

const router = wrapAsyncRouter();

/**
* @swagger
* tags:
*   name: Event
*   description: A block in a specific time on the schedule
*/

/**
* @swagger 
* components:
*   schemas:
*     Event:
*       type: object
*       required:
*         - id
*         - title
*         - startTime
*         - endTime
*         - tag
*       properties:
*         id:
*           type: number
*           description: The event's id
*         title:
*           type: string
*           description: The event's title
*         location:
*           type: string
*           description: Where will the event take place
*         description:
*           type: string
*           description: Short description to expand the information
*         startTime:
*           type: number
*           format: date
*           description: Start time of the event
*         endTime:
*           type: number
*           format: date
*           description: end time of the event
*         tag:
*           $ref: '#/components/schemas/Tag'
*         userId:
*           type: number
*           description: The user that the event belongs to
*       example: 
*         id: 0
*         title: 'Meeting'
*         location: 'Home'
*         description: 'Another meeting'
*         startTime: '2023-06-23T08:00:00.000Z'
*         endTime: '2023-06-23T10:00:00.000Z'
*         tag: 
*           id: 0
*           name: 'Work'
*           color: '#33d7cd'
*         userId: 0
*/

/**
* @swagger
* /event/{id}:
*   get:
*     summary: Get event data by id
*     tags: [Event]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The event's ID
*         schema:
*           type: string
*     responses:
*       200:
*         description: The event data (Received WITHOUT the userId field)
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Event'
*       404:
*         $ref: '#/responses/NotFound'
*/

router.get("/:id", async (req: Request, res: Response) => {
  const event = await EventService.getById(parseInt(req.params.id));
  if (!event) {
    throw new DataNotFoundError("event");
  } else {
    return res.status(200).send(event);
  }
});

/**
* @swagger
* /event/{id}:
*   put:
*     summary: update event's data
*     tags: [Event]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The event id
*     requestBody:
*         required: true
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 event:
*                   $ref: '#/components/schemas/Event'
*     responses:
*       200:
*         description: the updated event
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Event'
*       400:
*         $ref: '#/responses/BadRequest'
*       401:
*         $ref: '#/responses/Unauthorized'
*/
router.put("/:id", async (req: Request, res: Response) => {

  const updatedEvent = await EventService.updateEvent(req.body.event as IEvent, getUserId(req));
  if (!updatedEvent) {
    throw new BadRequestError("Updating event failed");
  } else {
    return res.status(200).send(updatedEvent);
  }
});

/**
* @swagger
* /event/delete/{id}:
*   put:
*     summary: deleting an event
*     tags: [Event]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The event's id
*     responses:
*       200:
*         description: Event deleted successfully
*         content:
*           application/json:
*             schema:
*               type: boolean
*       400:
*         $ref: '#/responses/BadRequest'
*/
router.put("/delete/:id", async (req: Request, res: Response) => {
  const retVal = await EventService.deleteEvent(parseInt(req.params.id));
  if (retVal.affected && retVal.affected > 0) {
    return res.status(200).send(true);
  } else {
    throw new BadRequestError("Deleting event failed");
  }
});

export { router as eventRouter };
