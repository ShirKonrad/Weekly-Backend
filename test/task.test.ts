import { Task } from '../src/models/task';
import { TaskService } from "../src/services/task";
import * as currentUser from '../src/helpers/currentUser';
import { generateTaskData, generateTasksData } from "./generateData";

const request = require('supertest');
const app = require("../src/server");

jest.mock('../src/services/task');


describe("Task Routes", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe("GET /task/all", () => {
        it("should return a list of tasks", async () => {

            const mockedTasks = generateTasksData(2);
            const getAllTasksByUserIdMock = jest.spyOn(TaskService, 'getAllTasksByUserId').mockResolvedValue(Promise.resolve(mockedTasks));
            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockResolvedValue(1);

            const response = await request(app).get('/task/all');

            const receivedTasks = response.body.map((task: Task) => ({ ...task, dueDate: new Date(task.dueDate) }));

            expect(response.status).toBe(200);
            expect(receivedTasks).toEqual(mockedTasks);

            // Verify that the mocked methods was called
            expect(getAllTasksByUserIdMock).toHaveBeenCalledTimes(1);
            expect(getUserIdMock).toHaveBeenCalledTimes(1);
        });

        it("should get unauthorized error", async () => {
            const mockedTasks = generateTasksData(2);
            const getAllTasksByUserIdMock = jest.spyOn(TaskService, 'getAllTasksByUserId').mockResolvedValue(Promise.resolve(mockedTasks));

            const response = await request(app).get('/task/all');

            expect(response.status).toBe(401);
        })

        it("should get an error", async () => {

            const getAllTasksByUserIdMock = jest.spyOn(TaskService, 'getAllTasksByUserId').mockRejectedValue(new Error('Some error'));
            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockResolvedValue(1);

            const response = await request(app).get('/task/all');

            expect(response.status).toBe(500);

            // Verify that the mocked methods was called
            expect(getAllTasksByUserIdMock).toHaveBeenCalledTimes(1);
            expect(getUserIdMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("GET /task/getOne/:id", () => {
        it("should return the task and success status code", async () => {
            const mockedTask = generateTaskData();
            const getByIdMock = jest.spyOn(TaskService, 'getById').mockResolvedValue(Promise.resolve(mockedTask));

            const response = await request(app).get('/task/getOne/1');

            const receivedTask = { ...response.body, dueDate: new Date(response.body.dueDate) };

            expect(response.status).toBe(200);
            expect(receivedTask).toEqual(mockedTask);

            // Verify that the mocked methods was called
            expect(getByIdMock).toHaveBeenCalledWith(1);
            expect(getByIdMock).toHaveBeenCalledTimes(1);

        });

        it("should get an error", async () => {

            const getByIdMock = jest.spyOn(TaskService, 'getById').mockRejectedValue(new Error('Some error'));

            const response = await request(app).get('/task/getOne/1');

            expect(response.status).toBe(500);

            // Verify that the mocked methods was called
            expect(getByIdMock).toHaveBeenCalledWith(1);
            expect(getByIdMock).toHaveBeenCalledTimes(1);
        });

        it("should get DataNotFoundError error", async () => {

            const getByIdMock = jest.spyOn(TaskService, 'getById').mockResolvedValue(Promise.resolve(null));

            const response = await request(app).get('/task/getOne/1');

            expect(response.status).toBe(404);

            // Verify that the mocked methods was called
            expect(getByIdMock).toHaveBeenCalledWith(1);
            expect(getByIdMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("PUT /task/setdone/:id", () => {
        it("should set done to true and return the task", async () => {
            const updatedTask = generateTaskData({ setDone: true });
            const setDoneMock = jest.spyOn(TaskService, 'setDone').mockResolvedValue(Promise.resolve(updatedTask));
            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockResolvedValue(1);

            const response = await request(app).put('/task/setdone/1');

            const receivedTask = { ...response.body, dueDate: new Date(response.body.dueDate) };

            expect(response.status).toBe(200);
            expect(receivedTask).toEqual(updatedTask);

            // Verify that the mock was called
            expect(setDoneMock).toHaveBeenCalledTimes(1);
            expect(getUserIdMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('PUT /task/:id', () => {
        it('should update a task and return the updated task', async () => {
            const updatedTask = generateTaskData();

            const updateTaskMock = jest.spyOn(TaskService, 'updateTask').mockResolvedValue(updatedTask);
            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockResolvedValue(1);

            const response = await request(app)
                .put('/task/1')
                .send({ ...updatedTask });

            const receivedTask = { ...response.body, dueDate: new Date(response.body.dueDate) };

            expect(response.status).toBe(200);
            expect(receivedTask).toEqual(updatedTask);

            // Verify that the mock was called
            expect(updateTaskMock).toHaveBeenCalledTimes(1);
            expect(getUserIdMock).toHaveBeenCalledTimes(1);
        });

        it('should handle BadRequestError', async () => {
            // Mock the behavior of the TaskService method to return undefined
            const updateTaskMock = jest.spyOn(TaskService, 'updateTask').mockResolvedValue(undefined);
            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockResolvedValue(1);

            const response = await request(app)
                .put('/task/1')
                .send({ task: { title: 'Updated Task' } });

            expect(response.status).toBe(400);

            // Verify that the mock was called
            expect(updateTaskMock).toHaveBeenCalledTimes(1);
            expect(getUserIdMock).toHaveBeenCalledTimes(1);
        });

    });
});
