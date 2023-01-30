import { UserDBModel } from "../models/users/UserDBModel";
import { usersCollection } from "./db";

export const usersRepository = {
    async createUser(newUser: UserDBModel) {
        await usersCollection.insertOne(newUser)
    },

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        return await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    },
}