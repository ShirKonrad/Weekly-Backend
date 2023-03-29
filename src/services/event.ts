import { MoreThanOrEqual } from "typeorm";
import { Event } from "../models/event";

export async function getAllEventsByUserId(userId: number) {
    return await Event.find({
        where: {
            id: userId,
            startTime: MoreThanOrEqual(new Date())
        },
    });
}