import { Tag } from "../models/tag";

export async function getAllTagsByUserId(userId: number) {
    return await Tag.find({
        where: {
            user: { id: userId },
        },
    });
}