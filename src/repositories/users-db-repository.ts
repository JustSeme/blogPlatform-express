import { add } from "date-fns";
import { UserDBModel } from "../models/users/UserDBModel";
import { usersCollection } from "./db";

export const usersRepository = {
    async createUser(newUser: UserDBModel) {
        await usersCollection.insertOne(newUser)
    },

    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    
    async deleteUsers(): Promise<boolean> {
        const result = await usersCollection.deleteMany({})
        return result.deletedCount > 0
    },

    async updateIsConfirmed(id: string) {
        const result = await usersCollection.updateOne({id: id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },

    async updateEmailConfirmationInfo(id: string, code: string) {
        const result = await usersCollection.updateOne({id: id}, {$set: {
            'emailConfirmation.confirmationCode': code,
            'emailConfirmation.expirationDate': add(new Date(), {
                hours: 1,
                minutes: 3
            })
        }})
        return result.modifiedCount === 1
    },

    async updatePasswordConfirmationInfo(id: string, code: string | null) {
        const result = await usersCollection.updateOne({id: id}, {$set: {
            'passwordRecovery.confirmationCode': code,
            'passwordRecovery.expirationDate': add(new Date(), {
                hours: 1,
                minutes: 3
            })
        }})
        return result.modifiedCount === 1
    },

    async updateUserPassword(id: string, newPasswordHash: string) {
        const result = await usersCollection.updateOne({id: id}, {$set: {
            'passwordHash': newPasswordHash,
            'passwordRecovery.confirmationCode': null
        }})

        return result.modifiedCount === 1
    }
}