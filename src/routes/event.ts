import { Request, Response, Router } from "express";
import { deleteEvent, getById, updateEvent } from "../services/event";
import { Event, IEvent } from "../models/event";
import { getUserId } from "../helpers/currentUser";
import { BadRequestError } from "../errors/badRequestError";
import { DataNotFoundError } from "../errors/dataNotFoundError";
import { wrapAsyncRouter } from "../helpers/wrapAsyncRouter";

const router = wrapAsyncRouter();

router.get("/:id", async (req: Request, res: Response) => {
  const event = await getById(parseInt(req.params.id));
  if (!event) {
    throw new DataNotFoundError("event");
  } else {
    return res.status(200).send(event);
  }
});

router.put("/:id", async (req: Request, res: Response) => {

  const updatedEvent = await updateEvent(req.body.event as IEvent, getUserId(req));
  if (!updatedEvent) {
    throw new BadRequestError("Updating event failed");
  } else {
    return res.status(200).send(updatedEvent);
  }

  // try {
  //   const updatedEvent = await updateEvent(
  //     req.body.event as Event,
  //     getUserId(req)
  //   );

  //   if (!updatedEvent) {
  //     throw new BadRequestError("Updating event failed");
  //   } else {
  //     return res.status(200).send(updateEvent);
  //   }
  // } catch (err: any) {
  //   console.log(err);
  //   throw new BadRequestError("Updating event failed");
  // }
});

router.put("/delete/:id", async (req: Request, res: Response) => {
  const retVal = await deleteEvent(parseInt(req.params.id));
  if (retVal.affected && retVal.affected > 0) {
    return res.status(200).send(true);
  } else {
    throw new BadRequestError("Deleting event failed");
  }
});

export { router as eventRouter };
