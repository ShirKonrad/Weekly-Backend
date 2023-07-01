import { TagService } from "../src/services/tag";
import * as currentUser from "../src/helpers/currentUser";
import { generateTagData, generateTagsData } from "./generateData";
import { Tag } from "../src/models/tag";
import { InsertResult } from "typeorm";

const request = require("supertest");
const app = require("../src/server");

jest.mock("../src/services/tag");

describe("Tag Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("GET /tag/all-by-user", () => {
    it("should return a list of tags", async () => {
      const mockedTags = generateTagsData(2);
      const getAllTagsByUserIdMock = jest
        .spyOn(TagService, "getAllTagsByUserId")
        .mockResolvedValue(Promise.resolve(mockedTags));
      const getUserIdMock = jest
        .spyOn(currentUser, "getUserId")
        .mockReturnValue(1);

      const response = await request(app).get("/tag/all-by-user");

      const receivedTags = response.body.map((tag: Tag) => ({
        ...tag,
      }));

      expect(response.status).toBe(200);
      expect(receivedTags).toEqual(mockedTags);

      // Verify that the mocked methods was called
      expect(getAllTagsByUserIdMock).toHaveBeenCalledTimes(1);
      expect(getUserIdMock).toHaveBeenCalledTimes(1);
    });

    it("should get unauthorized error", async () => {
      const mockedTags = generateTagsData(2);
      const getAllTagsByUserIdMock = jest
        .spyOn(TagService, "getAllTagsByUserId")
        .mockResolvedValue(Promise.resolve(mockedTags));

      const response = await request(app).get("/tag/all-by-user");

      expect(response.status).toBe(401);
    });

    it("should get an error", async () => {
      const getAllTagsByUserIdMock = jest
        .spyOn(TagService, "getAllTagsByUserId")
        .mockRejectedValue(new Error("Some error"));
      const getUserIdMock = jest
        .spyOn(currentUser, "getUserId")
        .mockReturnValue(1);

      const response = await request(app).get("/tag/all-by-user");

      expect(response.status).toBe(500);

      // Verify that the mocked methods was called
      expect(getAllTagsByUserIdMock).toHaveBeenCalledTimes(1);
      expect(getUserIdMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("PUT /tag/update/:id", () => {
    it("should update a tag and return the updated tag", async () => {
      const mockedUpdatedTag = generateTagData({
        id: 1,
        name: "updated tag",
        color: "#GVE837",
      });
      const updateTagMock = jest
        .spyOn(TagService, "updateTag")
        .mockResolvedValue(mockedUpdatedTag);
      const getUserIdMock = jest
        .spyOn(currentUser, "getUserId")
        .mockReturnValue(1);

      // Make the request to the update tag endpoint
      const response = await request(app)
        .put("/tag/update/1")
        .send({ ...mockedUpdatedTag });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockedUpdatedTag);

      // Verify that the mock was called
      expect(updateTagMock).toHaveBeenCalledTimes(1);
      expect(getUserIdMock).toHaveBeenCalledTimes(1);
    });

    it("should handle BadRequestError", async () => {
      // Mock the behavior of the TagService method to return undefined
      const updateTagMock = jest
        .spyOn(TagService, "updateTag")
        .mockResolvedValue(undefined);
      const getUserIdMock = jest
        .spyOn(currentUser, "getUserId")
        .mockReturnValue(1);

      const response = await request(app)
        .put("/tag/update/1")
        .send({ tag: { name: "Updated Tag" } });

      expect(response.status).toBe(400);

      // Verify that the mock was called
      expect(updateTagMock).toHaveBeenCalledTimes(1);
      expect(getUserIdMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Post /add", () => {
    it("should save a new tag and return the new tag", async () => {
      const userId = 1;
      const newTag = generateTagData();
      const mockedNewTag = generateTagData({ name: "new tag" });
      const getUserIdMock = jest
        .spyOn(currentUser, "getUserId")
        .mockReturnValue(userId);
      const saveTagMock = jest
        .spyOn(TagService, "addNewTag")
        .mockResolvedValue(mockedNewTag);
      const response = await request(app).post("/tag/add").send(newTag);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockedNewTag);

      // Verify that the mock was called
      expect(saveTagMock).toHaveBeenCalledTimes(1);
      expect(getUserIdMock).toHaveBeenCalledTimes(1);
    });

    it("should handle BadRequestError", async () => {
      const mockedNewTag = generateTagData({ name: "new tag" });
      const getUserIdMock = jest
        .spyOn(currentUser, "getUserId")
        .mockReturnValue(1);

      const response = await request(app)
        .post("/tag/add")
        .send({ params: { color: mockedNewTag.color } });

      expect(response.status).toBe(400);

      // Verify that the mock was called
      expect(getUserIdMock).toHaveBeenCalled();
    });
  });
});
