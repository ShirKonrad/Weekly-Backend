import { User } from "../models/user";

export async function getUserById(userId: number) {
    return await User.findOne({
        where: {
            id: userId
        },
    });
}

export async function getUserByEmail(email: string) {
    return await User.findOne({
        where: {
            email: email
        },
    });
}

export async function createUser(firstName: string, lastName: string, email: string, password?: string, beginDayHour?: number, endDayHour?: number) {
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

export async function updateUser(userId: number, firstName: string, lastName: string, beginDayHour: number, endDayHour: number) {
    return await User.update(userId, {
        firstName,
        lastName,
        beginDayHour,
        endDayHour
    });
}

export async function updateUserResetToken(userId: number, resetToken: string) {
    return await User.update(userId, {resetToken})
}

export async function updateUserPassword(userId: number, password: string) {
    return await User.update(userId, {password})
}

export async function getAllUsers() {
    return await User.find();
}