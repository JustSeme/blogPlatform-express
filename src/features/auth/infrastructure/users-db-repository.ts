import { add } from "date-fns";
import { injectable } from "inversify";
import { Document } from "mongoose";
import { UsersModel } from "../domain/UsersSchema";
import { UserDTO } from "../domain/UsersTypes";
import { HydratedUser } from "./UsersTypes";

//transaction script
@injectable()
export class UsersRepository {
    async deleteUser(id: string): Promise<boolean> {
        const deletedUser = UsersModel.find({ id })
        const result = await deletedUser.deleteOne()
        return result.deletedCount === 1
    }

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
    }

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
    }

    async updateUserPassword(id: string, newPasswordHash: string) {
        const result = await UsersModel.updateOne({ id: id }, {
            $set: {
                'passwordHash': newPasswordHash,
                'passwordRecovery.confirmationCode': null
            }
        })

        return result.matchedCount === 1
    }

    async findUserByConfirmationCode(code: string): Promise<HydratedUser | null> {
        return UsersModel.findOne({ 'emailConfirmation.confirmationCode': code })
    }

    async findUserByEmail(email: string) {
        return UsersModel.findOne({ email: email })
    }

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<HydratedUser | null> {
        return UsersModel.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] })
    }

    async findUserById(userId: string) {
        return UsersModel.findOne({ id: userId }, { _id: 0, __v: 0 })
    }

    async save(user: HydratedUser) {
        return user.save()
    }
}