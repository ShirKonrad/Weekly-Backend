import { EventService } from "src/services/event";
import { Event } from "../src/models/event";
import { generateEventData, generateEventsData } from "./generateData";
import * as currentUser from "../src/helpers/currentUser";

const request = require("supertest");
const app = require("../src/server");

jest.mock("../src/services/event");

describe("Event Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("GET /event/:id", () => {
    it("should return the event and success status code", async () => {
      const mockedEvent = generateEventData();
      const getByIdMock = jest
        .spyOn(EventService, "getById")
        .mockResolvedValue(Promise.resolve(mockedEvent));

      const response = await request(app).get("/event/1");

      const receivedEvent = {
        ...response.body,
        startTime: new Date(response.body.startTime),
        endTime: new Date(response.body.endTime),
      };

      expect(response.status).toBe(200);
      expect(receivedEvent).toEqual(mockedEvent);

      // Verify that the mocked methods was called
      expect(getByIdMock).toHaveBeenCalledWith(1);
      expect(getByIdMock).toHaveBeenCalledTimes(1);
    });

    it("should get an error", async () => {
      const getByIdMock = jest
        .spyOn(EventService, "getById")
        .mockRejectedValue(new Error("Some error"));

      const response = await request(app).get("/event/1");

      expect(response.status).toBe(500);

      // Verify that the mocked methods was called
      expect(getByIdMock).toHaveBeenCalledWith(1);
      expect(getByIdMock).toHaveBeenCalledTimes(1);
    });

    it("should get DataNotFoundError error", async () => {
      const getByIdMock = jest
        .spyOn(EventService, "getById")
        .mockResolvedValue(Promise.resolve(null));

      const response = await request(app).get("/event/1");

      expect(response.status).toBe(404);

      // Verify that the mocked methods was called
      expect(getByIdMock).toHaveBeenCalledWith(1);
      expect(getByIdMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("PUT /event/:id", () => {
    it("should update an event and return the updated event", async () => {
      const updatedEvent = generateEventData();

      const updateEventMock = jest
        .spyOn(EventService, "updateEvent")
        .mockResolvedValue(updatedEvent);
      const getUserIdMock = jest
        .spyOn(currentUser, "getUserId")
        .mockResolvedValue(1);

      const response = await request(app)
        .put("/event/1")
        .send({ ...updatedEvent });

      const receivedEvent = {
        ...response.body,
        startTime: new Date(response.body.startTime),
        endTime: new Date(response.body.endTime),
      };

      expect(response.status).toBe(200);
      expect(receivedEvent).toEqual(updatedEvent);

      // Verify that the mock was called
      expect(updateEventMock).toHaveBeenCalledTimes(1);
      expect(getUserIdMock).toHaveBeenCalledTimes(1);
    });

    it("should handle BadRequestError", async () => {
      // Mock the behavior of the EventService method to return undefined
      const updateEventMock = jest
        .spyOn(EventService, "updateEvent")
        .mockResolvedValue(undefined);
      const getUserIdMock = jest
        .spyOn(currentUser, "getUserId")
        .mockResolvedValue(1);

      const response = await request(app)
        .put("/event/1")
        .send({ event: { title: "Updated Event" } });

      expect(response.status).toBe(400);

      // Verify that the mock was called
      expect(updateEventMock).toHaveBeenCalledTimes(1);
      expect(getUserIdMock).toHaveBeenCalledTimes(1);
    });
  });

  //   describe("PUT /event/delete/:id", () => {
  //     it("should delete an event and return success status code", async () => {
  //       const updatedEvent = generateEventData();

  //       const updateEventMock = jest
  //         .spyOn(EventService, "deleteEvent")
  //         .mockResolvedValue();
  //       const getUserIdMock = jest
  //         .spyOn(currentUser, "getUserId")
  //         .mockResolvedValue(1);

  //       const response = await request(app)
  //         .put("/event/1")
  //         .send({ ...updatedEvent });

  //       const receivedEvent = {
  //         ...response.body,
  //         startTime: new Date(response.body.startTime),
  //         endTime: new Date(response.body.endTime),
  //       };

  //       expect(response.status).toBe(200);
  //       expect(receivedEvent).toEqual(updatedEvent);

  //       // Verify that the mock was called
  //       expect(updateEventMock).toHaveBeenCalledTimes(1);
  //       expect(getUserIdMock).toHaveBeenCalledTimes(1);
  //     });

  //     it("should handle BadRequestError", async () => {
  //       // Mock the behavior of the EventService method to return undefined
  //       const updateEventMock = jest
  //         .spyOn(EventService, "updateEvent")
  //         .mockResolvedValue(undefined);
  //       const getUserIdMock = jest
  //         .spyOn(currentUser, "getUserId")
  //         .mockResolvedValue(1);

  //       const response = await request(app)
  //         .put("/event/1")
  //         .send({ event: { title: "Updated Event" } });

  //       expect(response.status).toBe(400);

  //       // Verify that the mock was called
  //       expect(updateEventMock).toHaveBeenCalledTimes(1);
  //       expect(getUserIdMock).toHaveBeenCalledTimes(1);
  //     });
  //   });
});
