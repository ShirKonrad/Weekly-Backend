import { Between, MoreThanOrEqual } from "typeorm";
import { Event, IEvent } from "../models/event";
import { TagService } from "./tag";

export class EventService {

  static getById = async (eventId: number) => {
    return await Event.findOne({
      where: {
        id: eventId,
      },
      relations: ["tag"],
    });
  }

  static getAllEventsByUserId = async (userId: number, withPastStartTime?: boolean) => {
    return await Event.find({
      where: [
        { user: { id: userId }, startTime: withPastStartTime ? undefined : MoreThanOrEqual(new Date()) },
        { user: { id: userId }, endTime: withPastStartTime ? undefined : MoreThanOrEqual(new Date()) },

      ],
      relations: ["tag"],
    });
  }

  static getAllEventsByUserIdAndDates = async (
    userId: number,
    minDate: Date,
    maxDate: Date
  ) => {
    return await Event.find({
      where: {
        user: { id: userId },
        startTime: Between(minDate, maxDate),
      },
      relations: ["tag"],
    });
  }

  static saveEvents = async (events: IEvent[], userId: number) => {
    const newEvents = events.map((event: IEvent) => {
      return Event.create({
        ...event,
        tag: { id: event?.tag?.id },
        user: { id: userId },
      });
    });

    return await Event.save(newEvents);
  }

  static updateEvent = async (newEvent: IEvent, userId: number) => {
    const event = await Event.findOne({
      where: {
        id: newEvent.id,
        user: { id: userId },
      },
      relations: ["tag"],
    });

    if (event) {

      event.title = newEvent.title;
      event.location = newEvent.location;
      event.description = newEvent.description;
      event.startTime = new Date(newEvent.startTime);
      event.endTime = new Date(newEvent.endTime);
      event.tag = newEvent.tag ? await TagService.getTagById(newEvent.tag?.id, userId) || event.tag : null;

      return await Event.save(event);
    } else {
      return undefined;
    }
  }

  static deleteEvent = async (eventId: number) => {
    return Event.delete(eventId);
  }

}
