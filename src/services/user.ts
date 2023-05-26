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

export async function createUser(firstName: string, lastName: string, email: string, password: string, beginDayHour: number, endDayHour: number) {
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