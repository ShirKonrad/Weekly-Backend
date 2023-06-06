import { Request, Response, Router } from "express";
import { deleteEvent, getById, updateEvent } from "../services/event";
import { Event } from "../models/event";
import { getUserId } from "../helpers/currentUser";
import { BadRequestError } from "../errors/badRequestError";
import { DataNotFoundError } from "../errors/dataNotFoundError";

const router = Router();

router.get("/:id", async (req: Request, res: Response, next) => {
  const event = await getById(parseInt(req.params.id));
  if (!event) {
    next(new DataNotFoundError("event"));
  } else {
    return res.status(200).send(event);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const updatedEvent = await updateEvent(
    req.body.event as Event,
    getUserId(req)
  );

  if (!updatedEvent) {
    throw new BadRequestError("Updating event failed");
  } else {
    return res.status(200).send(updateEvent);
  }
});

router.put("/delete/:id", async (req: Request, res: Response) => {
  const retVal = await deleteEvent(parseInt(req.params.id));
  if (retVal.affected) {
    return res.status(200).send(retVal.affected);
  } else {
    throw new BadRequestError("Deleting event failed");
  }
});

export { router as eventRouter };
