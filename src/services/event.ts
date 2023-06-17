import { Between, MoreThanOrEqual } from "typeorm";
import { Event, IEvent } from "../models/event";
import { getTagById } from "./tag";
import { checkAssignmentTimeValid } from "../helpers/functions";
import { ValidationError } from "../errors/validationError";

export async function getById(eventId: number) {
  return await Event.findOne({
    where: {
      id: eventId,
    },
    relations: ["tag"],
  });
}

export async function getAllEventsByUserId(userId: number, withPastStartTime?: boolean) {
  return await Event.find({
    where: {
      user: { id: userId },
      startTime: withPastStartTime ? undefined : MoreThanOrEqual(new Date()),
    },
    relations: ["tag"],
  });
}

export async function getAllEventsByUserIdAndDates(
  userId: number,
  minDate: Date,
  maxDate: Date
) {
  return await Event.find({
    where: {
      user: { id: userId },
      startTime: Between(minDate, maxDate),
    },
    relations: ["tag"],
  });
}

export async function saveEvents(events: IEvent[], userId: number) {
  const newEvents = events.map((event: IEvent) => {
    return Event.create({
      ...event,
      tag: { id: event?.tag?.id },
      user: { id: userId },
    });
  });

  return await Event.save(newEvents);
}

export async function updateEvent(newEvent: IEvent, userId: number) {
  const event = await Event.findOne({
    where: {
      id: newEvent.id,
      user: { id: userId },
    },
    relations: ["tag"],
  });

  if (event) {
    // If event time updated, check that it is valid with the schedule
    newEvent.startTime = new Date(newEvent.startTime);
    newEvent.endTime = new Date(newEvent.endTime);
    if (newEvent.startTime.toLocaleString() !== event.startTime.toLocaleString() ||
      newEvent.endTime.toLocaleString() !== event.endTime.toLocaleString()) {
      const validationMessage = await checkAssignmentTimeValid(newEvent.id, newEvent.startTime, newEvent.endTime, false, userId)
      if (validationMessage) {
        throw new ValidationError(validationMessage)
      }
    }

    event.title = newEvent.title;
    event.location = newEvent.location;
    event.description = newEvent.description;
    event.startTime = new Date(newEvent.startTime);
    event.endTime = new Date(newEvent.endTime);
    event.tag = newEvent.tag ? await getTagById(newEvent.tag?.id, userId) || event.tag : null;

    return await Event.save(event);
  } else {
    return undefined;
  }
}

export async function deleteEvent(eventId: number) {
  return Event.delete(eventId);
}
