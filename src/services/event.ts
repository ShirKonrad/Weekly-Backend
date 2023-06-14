import { Between, MoreThanOrEqual } from "typeorm";
import { Event, IEvent } from "../models/event";
import { title } from "process";
import { getTagById } from "./tag";

export async function getById(eventId: number) {
  return await Event.findOne({
    where: {
      id: eventId,
    },
    relations: ["tag"],
  });
}

export async function getAllEventsByUserId(userId: number) {
  return await Event.find({
    where: {
      user: { id: userId },
      startTime: MoreThanOrEqual(new Date()),
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

    //TODO: check time not overlap

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
