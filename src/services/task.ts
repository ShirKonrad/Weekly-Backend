import { MoreThanOrEqual } from "typeorm";
import { Task } from "../models/task";

export async function getAllTasksByUserId(userId: number) {
    return await Task.find({
        where: {
            id: userId,
            dueDate: MoreThanOrEqual(new Date())
        },
        // relations: ["products"],
    });
}