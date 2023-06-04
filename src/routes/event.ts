import { Request, Response, Router } from "express";
import { updateEvent } from "../services/event";
import { Event } from "../models/event";
import { getUserId } from "../helpers/currentUser";
import { BadRequestError } from "../errors/badRequestError";

const router = Router();

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

export { router as eventRouter };
