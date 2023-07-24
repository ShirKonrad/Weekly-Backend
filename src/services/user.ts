import { User } from "../models/user";

export class UserService {

    static getUserById = async (userId: number) => {
        return await User.findOne({
            where: {
                id: userId
            },
        });
    }

    static getUserByEmail = async (email: string) => {
        return await User.findOne({
            where: {
                email: email
            },
        });
    }

    static createUser = async (firstName: string, lastName: string, email: string, password?: string, beginDayHour?: number, endDayHour?: number) => {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            beginDayHour,
            endDayHour
        })

        const results = await User.save(user)
        return results
    }

    static updateUser = async (userId: number, firstName: string, lastName: string, beginDayHour: number, endDayHour: number) => {
        return await User.update(userId, {
            firstName,
            lastName,
            beginDayHour,
            endDayHour
        });
    }

    static updateUserResetToken = async (userId: number, resetToken: string) => {
        return await User.update(userId, { resetToken })
    }

    static updateUserPassword = async (userId: number, password: string) => {
        return await User.update(userId, { password })
    }

    static getAllUsers = async () => {
        return await User.find();
    }
}