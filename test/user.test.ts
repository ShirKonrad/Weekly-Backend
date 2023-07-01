import { UserService } from "../src/services/user";
import { generateUserData } from "./generateData";
import * as currentUser from '../src/helpers/currentUser';
import * as emailHandler from '../src/helpers/emailHandler';

const request = require('supertest');
const app = require("../src/server");
const bcrypt = require("bcrypt");

jest.mock('../src/services/user');


describe("User Routes", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    beforeAll(() => {
        process.env.SECRET_KEY = 'weeklysecret';
    });

    afterAll(() => {
        delete process.env.SECRET_KEY;
    });

    describe("POST /user/register", () => {
        it('should register a new user and return a token and user data', async () => {
            const mockedNewUser = generateUserData({ password: "hashedPassword" });
            const getUserByEmailMock = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue(null);
            const createUserMock = jest.spyOn(UserService, 'createUser').mockResolvedValue(mockedNewUser);

            // Make the HTTP request to the route
            const response = await request(app)
                .post('/user/register')
                .send({ user: { ...mockedNewUser, password: "123" } });

            // Assert the expected response
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toEqual(mockedNewUser);

            // Verify that the mocked methods were called with the correct arguments
            expect(getUserByEmailMock).toHaveBeenCalledWith(mockedNewUser.email);
            expect(createUserMock).toHaveBeenCalledWith(
                mockedNewUser.firstName,
                mockedNewUser.lastName,
                mockedNewUser.email,
                expect.any(String),
                mockedNewUser.beginDayHour,
                mockedNewUser.endDayHour
            );

            // Verify that the mocks were called
            expect(getUserByEmailMock).toHaveBeenCalled();
            expect(createUserMock).toHaveBeenCalled();
        });

        it('should throw an error if an account with the email already exists', async () => {
            const mockedUser = generateUserData();
            const getUserByEmailMock = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue(mockedUser);

            // Make the HTTP request to the route
            const response = await request(app)
                .post('/user/register')
                .send({ user: { ...mockedUser, password: "123" } });

            expect(response.status).toBe(400);

            expect(getUserByEmailMock).toHaveBeenCalledWith(mockedUser.email);
        });
    });

    describe('POST /user/logIn', () => {
        it('should log in with correct credentials and return a token and user data', async () => {
            const mockedUser = generateUserData({ password: bcrypt.hashSync('password', 10) });
            const getUserByEmailMock = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue(mockedUser);

            // Make the HTTP request to the route
            const response = await request(app)
                .post('/user/logIn')
                .send({ params: { email: 'test@gmail.com', password: 'password' } })
                .expect(200);

            // Assert the expected response
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toEqual({
                id: mockedUser.id,
                email: mockedUser.email,
                firstName: mockedUser.firstName,
                lastName: mockedUser.lastName,
                beginDayHour: mockedUser.beginDayHour,
                endDayHour: mockedUser.endDayHour
            });
            expect(getUserByEmailMock).toHaveBeenCalledWith('test@gmail.com');
        });

        it('should return an error for incorrect password', async () => {
            const mockedUser = generateUserData({ password: bcrypt.hashSync('password', 10) });
            const getUserByEmailMock = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue(mockedUser);

            // Make the HTTP request to the route
            const response = await request(app)
                .post('/user/logIn')
                .send({ params: { email: 'test@gmail.com', password: 'wrongpassword' } })
                .expect(400);

            expect(getUserByEmailMock).toHaveBeenCalledWith('test@gmail.com');
        });

        it('should return an error for user not registered', async () => {
            const getUserByEmailMock = jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue(null);

            // Make the HTTP request to the route
            const response = await request(app)
                .post('/user/logIn')
                .send({ params: { email: 'test@gmail.com', password: 'password' } })
                .expect(400);

            expect(getUserByEmailMock).toHaveBeenCalledWith('test@gmail.com');
        });
    });

    describe('PUT /user', () => {
        it('should update the user and return the updated user', async () => {
            const userId = 1;
            const mockedUpdatedUser = generateUserData({ id: 1 });
            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockReturnValue(userId);
            const updateUserMock = jest.spyOn(UserService, 'updateUser').mockResolvedValue(mockedUpdatedUser as any);

            // Make the request to the update user endpoint
            const response = await request(app)
                .put('/user')
                .send({ user: mockedUpdatedUser })
                .expect(200);

            // Assert the expected response
            expect(response.body).toEqual(mockedUpdatedUser);

            expect(updateUserMock).toHaveBeenCalledWith(mockedUpdatedUser.id, mockedUpdatedUser.firstName, mockedUpdatedUser.lastName, mockedUpdatedUser.beginDayHour, mockedUpdatedUser.endDayHour);
            expect(getUserIdMock).toHaveBeenCalled();
        });
    });

    describe('POST /user/resetPassword', () => {

        it('should send a reset email and return the user ID', async () => {
            const mockedUser = generateUserData({ id: 1 });
            jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue(mockedUser);
            jest.spyOn(emailHandler, 'emailHandler').mockResolvedValue(1);
            jest.spyOn(UserService, 'updateUserResetToken').mockResolvedValue(mockedUser as any);

            // Make the request to the reset password endpoint
            const response = await request(app)
                .post('/user/resetPassword')
                .send({ params: { email: mockedUser.email } })
                .expect(200);

            expect(response.body).toEqual({ user: { id: 1 } });
        });

        it('should return an error if the email sending fails', async () => {
            const mockedUser = generateUserData({ id: 1 });
            jest.spyOn(UserService, 'getUserByEmail').mockResolvedValue(mockedUser);
            jest.spyOn(emailHandler, 'emailHandler').mockResolvedValue(0);

            const response = await request(app)
                .post('/user/resetPassword')
                .send({ params: { email: mockedUser.email } })
                .expect(400);
        });
    });

    describe('POST /user/validateToken', () => {
        it('should return 200 if the token is valid', async () => {
            const userId = 1;
            const mockedUser = generateUserData({ id: 1, resetToken: 'validToken' });
            const resetToken = 'validToken';

            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockReturnValue(userId);
            const getUserByIdMock = jest.spyOn(UserService, 'getUserById').mockResolvedValue(mockedUser);

            const response = await request(app)
                .post('/user/validateToken')
                .send({ params: { resetToken } })
                .expect(200);

            expect(getUserByIdMock).toHaveBeenCalledWith(mockedUser.id);
            expect(getUserIdMock).toHaveBeenCalled();
        });

        it('should return an error if the token is incorrect', async () => {
            const userId = 1;
            const mockedUser = generateUserData({ id: 1, resetToken: 'validToken' });
            const resetToken = 'invalidToken';

            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockReturnValue(userId);
            const getUserByIdMock = jest.spyOn(UserService, 'getUserById').mockResolvedValue(mockedUser);

            const response = await request(app)
                .post('/user/validateToken')
                .send({ params: { resetToken } })
                .expect(401);

            expect(getUserByIdMock).toHaveBeenCalledWith(mockedUser.id);
            expect(getUserIdMock).toHaveBeenCalled();

        });
    });

    describe('PUT /user/updatePassword', () => {
        it('should update the password and return a token if the user exists', async () => {
            const userId = 1;
            const password = 'newPassword';
            const mockedUser = generateUserData({ id: 1 });

            const getUserIdMock = jest.spyOn(currentUser, 'getUserId').mockReturnValue(userId);
            const getUserByIdMock = jest.spyOn(UserService, 'getUserById').mockResolvedValue(mockedUser);
            const updateUserPasswordMock = jest.spyOn(UserService, 'updateUserPassword').mockResolvedValue(null as any);

            const response = await request(app)
                .put('/user/updatePassword')
                .send({ params: { password } })
                .expect(200);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toEqual(mockedUser);

            expect(getUserByIdMock).toHaveBeenCalledWith(mockedUser.id);
            expect(getUserIdMock).toHaveBeenCalled();
        });
    });
});
