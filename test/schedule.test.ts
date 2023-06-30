import { EventService } from '../src/services/event';
import { ScheduleService } from '../src/services/schedule';
import { TaskService } from '../src/services/task';
import { UserService } from '../src/services/user';
import * as currentUser from '../src/helpers/currentUser';
import { generateEventsData, generateScheduleData, generateTasksData, generateUserData } from './generateData';
import { Task } from '../src/models/task';
import { Event } from '../src/models/event';

const request = require('supertest');
const app = require("../src/server");

jest.mock('../src/services/schedule');
jest.mock('../src/services/task');
jest.mock('../src/services/event');
jest.mock('../src/services/user');

describe("Schedule Routes", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('POST /schedule', () => {
        it('with new tasks and events, should save them and assign all the tasks', async () => {
            const userId = 1;
            const newTasks = generateTasksData(1, { id: 0, dueDate: (new Date()).toLocaleString() });
            const newEvents = generateEventsData(1, { id: 0, startTime: (new Date()).toLocaleString(), endTime: (new Date()).toLocaleString() });
            const mockedTasks = generateTasksData(1);
            const mockedEvents = generateEventsData(1);
            const mockedUser = generateUserData({ id: userId });
            const mockedGeneratedSchedule = [{ taskId: mockedTasks[0].id, assignment: new Date() }];
            const mockedUpdatedTasks = generateTasksData(1, { assignment: new Date().toLocaleString() });
            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockReturnValue(userId);
            const saveTasksMock = jest.spyOn(TaskService, 'saveTasks').mockResolvedValue(Promise.resolve(mockedTasks));
            const saveEventsMock = jest.spyOn(EventService, 'saveEvents').mockResolvedValue(Promise.resolve(mockedEvents));
            const getAllTasksByUserIdMock = jest.spyOn(TaskService, 'getAllTasksByUserId').mockResolvedValue(Promise.resolve(mockedTasks));
            const getAllEventsByUserIdMock = jest.spyOn(EventService, 'getAllEventsByUserId').mockResolvedValue(Promise.resolve(mockedEvents));
            const getUserByIdMock = jest.spyOn(UserService, 'getUserById').mockResolvedValue(Promise.resolve(mockedUser));
            const generateScheduleMock = jest.spyOn(ScheduleService, 'generateSchedule').mockResolvedValue(mockedGeneratedSchedule);
            const updateAssignmentsMock = jest.spyOn(TaskService, 'updateAssignments').mockResolvedValue(mockedUpdatedTasks);

            // Make the HTTP request to the route
            const response = await request(app)
                .post('/schedule')
                .send({ tasks: newTasks, events: newEvents });

            const resBody = {
                ...response.body,
                assignedTasks: response.body?.assignedTasks?.map((task: Task) => ({ ...task, dueDate: new Date(task.dueDate) })),
            };

            // Assert the expected response
            expect(response.status).toBe(200);
            expect(resBody).toEqual({ assignedTasks: mockedUpdatedTasks, notAssignedTasks: [] });

            // Verify that the mocked methods were called with the correct arguments
            expect(saveTasksMock).toHaveBeenCalledWith(newTasks, userId);
            expect(saveEventsMock).toHaveBeenCalledWith(newEvents, userId);
            expect(getAllTasksByUserIdMock).toHaveBeenCalledWith(userId);
            expect(getAllEventsByUserIdMock).toHaveBeenCalledWith(userId);
            expect(getUserByIdMock).toHaveBeenCalledWith(userId);
            expect(generateScheduleMock).toHaveBeenCalledWith(mockedTasks, mockedEvents, mockedUser.beginDayHour, mockedUser.endDayHour);
            expect(updateAssignmentsMock).toHaveBeenCalledWith(mockedTasks.map((task) => task.id), mockedGeneratedSchedule, userId);

            // Verify that the mocks were called
            expect(getUserIdMock).toHaveBeenCalled();
            expect(saveTasksMock).toHaveBeenCalled();
            expect(saveEventsMock).toHaveBeenCalled();
            expect(getAllTasksByUserIdMock).toHaveBeenCalled();
            expect(getAllEventsByUserIdMock).toHaveBeenCalled();
            expect(getUserByIdMock).toHaveBeenCalled();
            expect(generateScheduleMock).toHaveBeenCalled();
            expect(updateAssignmentsMock).toHaveBeenCalled();
        });

        it('without new tasks and events, should return assignment of other tasks from db', async () => {
            const userId = 1;
            const mockedTasks = generateTasksData(1);
            const mockedEvents = generateEventsData(1);
            const mockedUser = generateUserData({ id: userId });
            const mockedGeneratedSchedule = [{ taskId: mockedTasks[0].id, assignment: new Date() }];
            const mockedUpdatedTasks = generateTasksData(1, { assignment: new Date().toLocaleString() });
            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockReturnValue(userId);
            const saveTasksMock = jest.spyOn(TaskService, 'saveTasks').mockResolvedValue(Promise.resolve([]));
            const saveEventsMock = jest.spyOn(EventService, 'saveEvents').mockResolvedValue(Promise.resolve([]));
            const getAllTasksByUserIdMock = jest.spyOn(TaskService, 'getAllTasksByUserId').mockResolvedValue(Promise.resolve(mockedTasks));
            const getAllEventsByUserIdMock = jest.spyOn(EventService, 'getAllEventsByUserId').mockResolvedValue(Promise.resolve(mockedEvents));
            const getUserByIdMock = jest.spyOn(UserService, 'getUserById').mockResolvedValue(Promise.resolve(mockedUser));
            const generateScheduleMock = jest.spyOn(ScheduleService, 'generateSchedule').mockResolvedValue(mockedGeneratedSchedule);
            const updateAssignmentsMock = jest.spyOn(TaskService, 'updateAssignments').mockResolvedValue(mockedUpdatedTasks);

            // Make the HTTP request to the route
            const response = await request(app)
                .post('/schedule')
                .send({ tasks: [], events: [] });

            const resBody = {
                ...response.body,
                assignedTasks: response.body?.assignedTasks?.map((task: Task) => ({ ...task, dueDate: new Date(task.dueDate) })),
            };

            // Assert the expected response
            expect(response.status).toBe(200);
            expect(resBody).toEqual({ assignedTasks: mockedUpdatedTasks, notAssignedTasks: [] });

            // Verify that the mocked methods were called with the correct arguments
            expect(getAllTasksByUserIdMock).toHaveBeenCalledWith(userId);
            expect(getAllEventsByUserIdMock).toHaveBeenCalledWith(userId);
            expect(getUserByIdMock).toHaveBeenCalledWith(userId);
            expect(generateScheduleMock).toHaveBeenCalledWith(mockedTasks, mockedEvents, mockedUser.beginDayHour, mockedUser.endDayHour);
            expect(updateAssignmentsMock).toHaveBeenCalledWith(mockedTasks.map((task) => task.id), mockedGeneratedSchedule, userId);

            // Verify that the mocks were called
            expect(getUserIdMock).toHaveBeenCalled();
            expect(saveTasksMock).toHaveBeenCalledTimes(0);
            expect(saveEventsMock).toHaveBeenCalledTimes(0);
            expect(getAllTasksByUserIdMock).toHaveBeenCalled();
            expect(getAllEventsByUserIdMock).toHaveBeenCalled();
            expect(getUserByIdMock).toHaveBeenCalled();
            expect(generateScheduleMock).toHaveBeenCalled();
            expect(updateAssignmentsMock).toHaveBeenCalled();
        });

        it('when there is no tasks to schedule', async () => {
            const userId = 1;
            const mockedTasks: Task[] = [];
            const mockedEvents = generateEventsData(1);
            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockReturnValue(userId);
            const saveTasksMock = jest.spyOn(TaskService, 'saveTasks').mockResolvedValue([]);
            const saveEventsMock = jest.spyOn(EventService, 'saveEvents').mockResolvedValue([]);
            const getAllTasksByUserIdMock = jest.spyOn(TaskService, 'getAllTasksByUserId').mockResolvedValue(Promise.resolve(mockedTasks));
            const getAllEventsByUserIdMock = jest.spyOn(EventService, 'getAllEventsByUserId').mockResolvedValue(Promise.resolve(mockedEvents))

            // Make the HTTP request to the route
            const response = await request(app)
                .post('/schedule')
                .send({ tasks: [], events: [] });

            // Assert the expected response
            expect(response.status).toBe(200);
            expect(response.text).toEqual("no tasks to schedule");

            // Verify that the mocked methods were called with the correct arguments
            expect(getAllTasksByUserIdMock).toHaveBeenCalledWith(userId);
            expect(getAllEventsByUserIdMock).toHaveBeenCalledWith(userId);

            // Verify that the mocks were called
            expect(getUserIdMock).toHaveBeenCalled();
            expect(saveTasksMock).toHaveBeenCalledTimes(0);
            expect(saveEventsMock).toHaveBeenCalledTimes(0);
            expect(getAllTasksByUserIdMock).toHaveBeenCalled();
            expect(getAllEventsByUserIdMock).toHaveBeenCalled();
        });

    });

    describe('GET /schedule/week', () => {
        it('get week without dates range', async () => {
            const userId = 1;
            const mockedTasks: Task[] = generateTasksData(1, { assignment: new Date("2023-06-01") });
            const mockedEvents: Event[] = generateEventsData(1);
            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockReturnValue(userId);
            const getAllTasksByUserIdMock = jest.spyOn(TaskService, 'getAllTasksByUserId').mockResolvedValue(mockedTasks);
            const getAllEventsByUserIdMock = jest.spyOn(EventService, 'getAllEventsByUserId').mockResolvedValue(mockedEvents)

            // Make the HTTP request to the route
            const response = await request(app)
                .get('/schedule/week');

            const resBody = response.body.map((item: any) => ({ ...item, startTime: new Date(item.startTime), endTime: new Date(item.endTime) }));

            // Assert the expected response
            expect(response.status).toBe(200);
            expect(resBody).toEqual([...generateScheduleData(1, true), ...generateScheduleData(1, false)]);

            // Verify that the mocked methods were called with the correct arguments
            expect(getAllTasksByUserIdMock).toHaveBeenCalledWith(userId, false, true, true);
            expect(getAllEventsByUserIdMock).toHaveBeenCalledWith(userId, true);

            // Verify that the mocks were called
            expect(getUserIdMock).toHaveBeenCalled();
            expect(getAllTasksByUserIdMock).toHaveBeenCalled();
            expect(getAllEventsByUserIdMock).toHaveBeenCalled();
        });

        it('get week with dates range', async () => {
            const userId = 1;
            const minDate = new Date('2023-06-01');
            const maxDate = new Date('2023-06-07');
            const mockedTasks: Task[] = generateTasksData(1, { assignment: new Date("2023-06-01") });
            const mockedEvents: Event[] = generateEventsData(1);
            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockReturnValue(userId);
            const getAllTasksByUserIdAndDatesMock = jest.spyOn(TaskService, 'getAllTasksByUserIdAndDates').mockResolvedValue(mockedTasks);
            const getAllEventsByUserIdAndDatesMock = jest.spyOn(EventService, 'getAllEventsByUserIdAndDates').mockResolvedValue(mockedEvents)

            // Make the HTTP request to the route
            const response = await request(app)
                .get('/schedule/week')
                .query({ minDate: '2023-06-01', maxDate: '2023-06-07' });

            const resBody = response.body.map((item: any) => ({ ...item, startTime: new Date(item.startTime), endTime: new Date(item.endTime) }));

            // Assert the expected response
            expect(response.status).toBe(200);
            expect(resBody).toEqual([...generateScheduleData(1, true), ...generateScheduleData(1, false)]);

            // Verify that the mocked methods were called with the correct arguments
            expect(getAllTasksByUserIdAndDatesMock).toHaveBeenCalledWith(userId, minDate, maxDate);
            expect(getAllEventsByUserIdAndDatesMock).toHaveBeenCalledWith(userId, minDate, maxDate);

            // Verify that the mocks were called
            expect(getUserIdMock).toHaveBeenCalled();
            expect(getAllTasksByUserIdAndDatesMock).toHaveBeenCalled();
            expect(getAllEventsByUserIdAndDatesMock).toHaveBeenCalled();
        });

    });
});