import { Between, MoreThanOrEqual } from "typeorm";
import { Event, IEvent } from "../models/event";
import { title } from "process";

export async function getById(eventId: number) {
  return await Event.findOne({
    where: {
      id: eventId,
    },
    relations: ["user", "tag"],
  });
}

export async function getAllEventsByUserId(userId: number) {
  return await Event.find({
    where: {
      user: { id: userId },
      startTime: MoreThanOrEqual(new Date()),
    },
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

  return await Event.insert(newEvents);
}

export async function updateEvent(newEvent: Event, userId: number) {
  const event = await Event.findOne({
    where: {
      id: newEvent.id,
      user: { id: userId },
    },
    relations: ["user", "tag"],
  });

  if (event) {
    const e = Event.create({
      ...event,
      title: newEvent.title,
      location: newEvent.location,
      description: newEvent.description,
      startTime: new Date(newEvent.startTime),
      endTime: new Date(newEvent.endTime),
    });
    // event.title = newEvent.title;
    // event.location = newEvent.location;
    // event.description = newEvent.description;
    // event.startTime = new Date(newEvent.startTime);
    // event.endTime = new Date(newEvent.endTime);
    // // event.tag= await getTagById(newEvent.tag?.id ?? 0);
    // return await Event.save(event);
    return await Event.save(e);
  } else {
    return undefined;
  }
}

export async function deleteEvent(eventId: number) {
  return Event.delete(eventId);
}
