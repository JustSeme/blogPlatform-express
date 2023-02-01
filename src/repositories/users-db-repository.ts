import { UserDBModel } from "../models/users/UserDBModel";
import { usersCollection } from "./db";

export const usersRepository = {
    async createUser(newUser: UserDBModel) {
        await usersCollection.insertOne(newUser)
    },

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        return await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    },

    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    
    async deleteUsers(): Promise<boolean> {
        const result = await usersCollection.deleteMany({})
        return result.deletedCount > 0
    }, 
}