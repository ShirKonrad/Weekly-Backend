// import { EventService } from 'src/services/event';
// import { ScheduleService } from 'src/services/schedule';
// import { TaskService } from 'src/services/task';
// import { UserService } from 'src/services/user';
// import * as currentUser from '../src/helpers/currentUser';

// const request = require('supertest');
// const app = require("../src/server");

// jest.mock('../src/services/schedule');
// jest.mock('../src/services/task');
// jest.mock('../src/services/event');
// jest.mock('../src/services/user');

// describe("Schedule Routes", () => {

//     beforeEach(() => {
//         jest.clearAllMocks();
//         jest.resetAllMocks();
//     });

//     describe('POST /schedule', () => {
//         it('should save tasks and events, generate schedule, and return the assigned and not assigned tasks', async () => {
//             // Mock the behavior of the TaskService and other utility functions
//             const userId = 1;
//             const newTasks = [{ title: 'Task 1' }];
//             const newEvents = [{ title: 'Event 1' }];
//             const savedTasks = [{ id: 1, title: 'Task 1' }];
//             const savedEvents = [{ id: 1, title: 'Event 1' }];
//             const generatedSchedule = [{ task: savedTasks[0], assignment: 1 }];
//             const updatedTasks = [{ id: 1, title: 'Task 1', assignment: 1 }];
//             const saveTasksMock = jest.spyOn(TaskService, 'saveTasks').mockResolvedValue(Promise.resolve([]));
//             const saveEventsMock = jest.spyOn(EventService, 'saveEvents').mockResolvedValue(Promise.resolve([]));
//             const getAllTasksByUserIdMock = jest.spyOn(TaskService, 'getAllTasksByUserId').mockResolvedValue(Promise.resolve(savedTasks));
//             const getAllEventsByUserIdMock = jest.spyOn(EventService, 'getAllEventsByUserId').mockResolvedValue(savedEvents);
//             const getUserByIdMock = jest.spyOn(UserService, 'getUserById').mockResolvedValue({ beginDayHour: 9, endDayHour: 17 });
//             const generateScheduleMock = jest.spyOn(ScheduleService, 'generateSchedule').mockResolvedValue(generatedSchedule);
//             const updateAssignmentsMock = jest.spyOn(TaskService, 'updateAssignments').mockResolvedValue(updatedTasks);

//             // Make the HTTP request to the route
//             const response = await request(app)
//                 .post('/schedule')
//                 .send({ tasks: newTasks, events: newEvents });

//             // Assert the expected response
//             expect(response.status).toBe(200);
//             expect(response.body).toEqual({ assignedTasks: updatedTasks, notAssignedTasks: [] });

//             // Verify that the mocked methods were called with the correct arguments
//             expect(saveTasksMock).toHaveBeenCalledWith(newTasks, userId);
//             expect(saveEventsMock).toHaveBeenCalledWith(newEvents, userId);
//             expect(getAllTasksByUserIdMock).toHaveBeenCalledWith(userId);
//             expect(getAllEventsByUserIdMock).toHaveBeenCalledWith(userId);
//             expect(getUserByIdMock).toHaveBeenCalledWith(userId);
//             expect(generateScheduleMock).toHaveBeenCalledWith(savedTasks, savedEvents, 9, 17);
//             expect(updateAssignmentsMock).toHaveBeenCalledWith([1], generatedSchedule, userId);

//             // Verify that the mocks were called
//             expect(saveTasksMock).toHaveBeenCalled();
//             expect(saveEventsMock).toHaveBeenCalled();
//             expect(getAllTasksByUserIdMock).toHaveBeenCalled();
//             expect(getAllEventsByUserIdMock).toHaveBeenCalled();
//             expect(getUserByIdMock).toHaveBeenCalled();
//             expect(generateScheduleMock).toHaveBeenCalled();
//             expect(updateAssignmentsMock).toHaveBeenCalled();
//         });

//         // Add more test cases for different scenarios if needed
//     });
// });