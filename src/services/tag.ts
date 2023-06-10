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
      user: { id: userId },
    },
  });
}

export async function addNewTag(tag: Tag, userId: number) {
  const newTag = Tag.create({ ...tag, user: { id: userId } });
  return await Tag.insert(newTag);
}

export async function deleteTag(tagId: number) {
  return await Tag.delete(tagId);
}

export async function updateTag(newTag: Tag, userId: number) {
  const tag = await Tag.findOne({
    where: {
      id: newTag.id,
      user: { id: userId },
    },
  });

  if (tag) {
    tag.name = newTag.name;
    tag.color = newTag.color;

    return await Tag.save(tag);
  } else {
    return undefined;
  }
}
