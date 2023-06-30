import { Tag } from "../models/tag";

export class TagService {

  static getAllTagsByUserId = async (userId: number) => {
    return await Tag.find({
      where: {
        user: { id: userId },
      },
    });
  }

  static getTagById = async (id: number, userId: number) => {
    return await Tag.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
    });
  }

  static addNewTag = async (tag: Tag, userId: number) => {
    const newTag = Tag.create({ ...tag, user: { id: userId } });
    return await Tag.insert(newTag);
  }

  static deleteTag = async (tagId: number) => {
    return await Tag.delete(tagId);
  }

  static updateTag = async (newTag: Tag, userId: number) => {
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
}
