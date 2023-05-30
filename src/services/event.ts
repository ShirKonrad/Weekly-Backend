import { Between, MoreThanOrEqual } from "typeorm";
import { Event, IEvent } from "../models/event";

export async function getAllEventsByUserId(userId: number) {
    return await Event.find({
        where: {
            user: { id: userId },
            startTime: MoreThanOrEqual(new Date())
        },
    });
}

export async function getAllEventsByUserIdAndDates(userId: number, minDate: Date, maxDate: Date) {
    return await Event.find({
        where: {
            user: { id: userId },
            startTime: Between(
                minDate, 
                maxDate
            ),
        },
    });
}

export async function saveEvents(events: IEvent[], userId: number) {
    const newEvents = events.map((event: IEvent) => {
        return Event.create({
            ...event,
            tag: { id: event?.tag?.id },
            user: { id: userId }
        })
    })

    return await Event.insert(newEvents);
}