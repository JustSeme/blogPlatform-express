import { add } from "date-fns";
import { UserDBModel } from "../models/users/UserDBModel";
import { UsersModel } from "./db";

export const usersRepository = {
    async createUser(newUser: UserDBModel) {
        await new UsersModel(newUser).save()
    },

    async deleteUser(id: string): Promise<boolean> {
        const deletedUser = UsersModel.find({ id })
        const result = await deletedUser.deleteOne()
        return result.deletedCount === 1
    },

    async deleteUsers(): Promise<boolean> {
        const result = await UsersModel.deleteMany({})
        return result.deletedCount > 0
    },

    async updateIsConfirmed(id: string) {
        const result = await UsersModel.updateOne({ id: id }, { $set: { 'emailConfirmation.isConfirmed': true } })
        return result.matchedCount === 1
    },

    async updateEmailConfirmationInfo(id: string, code: string) {
        const result = await UsersModel.updateOne({ id: id }, {
            $set: {
                'emailConfirmation.confirmationCode': code,
                'emailConfirmation.expirationDate': add(new Date(), {
                    hours: 1,
                    minutes: 3
                })
            }
        })
        return result.matchedCount === 1
    },

    async updatePasswordConfirmationInfo(id: string, code: string | null) {
        const result = await UsersModel.updateOne({ id: id }, {
            $set: {
                'passwordRecovery.confirmationCode': code,
                'passwordRecovery.expirationDate': add(new Date(), {
                    hours: 1,
                    minutes: 3
                })
            }
        })
        return result.matchedCount === 1
    },

    async updateUserPassword(id: string, newPasswordHash: string) {
        const result = await UsersModel.updateOne({ id: id }, {
            $set: {
                'passwordHash': newPasswordHash,
                'passwordRecovery.confirmationCode': null
            }
        })

        return result.matchedCount === 1
    }
}