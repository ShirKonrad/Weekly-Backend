import { MoreThanOrEqual } from "typeorm";
import { Event, IEvent } from "../models/event";

export async function getAllEventsByUserId(userId: number) {
    return await Event.find({
        where: {
            user: { id: userId },
            startTime: MoreThanOrEqual(new Date())
        },
    });
}

export async function saveEvents(events: IEvent[], userId: number) {
    const newEvents = events.map((event: IEvent) => {
        return Event.create({
            ...event,
            tag: { id: event.tagId },
            user: { id: userId }
        })
    })

    return await Event.insert(newEvents);
}