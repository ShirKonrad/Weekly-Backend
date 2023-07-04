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

// TODO: fix example for tag
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
*         - userId
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
*         id: 1
*         title: 'Event Title'
*         location: 'Home'
*         description: 'Here describe your event details'
*         startTime: '2023-06-23T08:00:00.000Z'
*         endTime: '2023-06-23T10:00:00.000Z'
*         tag:
*         userId: 42
*/

/**
* @swagger
* /event/{id}:
*   get:
*     summary: get event data by id
*     tags: [Event]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The event id
*     responses:
*       200:
*         description: The event data
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Event'
*       404:
*         description: Event not found
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Errors'
*/
router.get("/:id", async (req: Request, res: Response) => {
  const event = await EventService.getById(parseInt(req.params.id));
  if (!event) {
    throw new DataNotFoundError("event");
  } else {
    return res.status(200).send(event);
  }
});

// TODO: Problem - the event schema is the req body comes filled with the example data...
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
*         description: Updating event failed
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Errors'
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
*         description: The event id
*     responses:
*       200:
*         description: Event deleted successfully
*         content:
*           application/json:
*             schema:
*               type: boolean
*       400:
*         description: Deleting event failed
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Errors'
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
