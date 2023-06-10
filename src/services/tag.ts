import { Tag } from "../models/tag";

export async function getAllTagsByUserId(userId: number) {
  return await Tag.find({
    where: {
      user: { id: userId },
    },
  });
}

export async function getTagById(id: number, userId: number) {
  return await Tag.findOne({
    where: {
      id: id,
      user: { id: userId }
    }
  });
}
