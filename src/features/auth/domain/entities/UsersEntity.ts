import mongoose, { Model } from "mongoose";
import { UserDTO } from "./UserDTO";

type UserDBMethodsType = {
    updateIsConfirmed: (code: string) => boolean
}

export type UserModelType = Model<UserDTO, {}, UserDBMethodsType>

const usersSchema = new mongoose.Schema<UserDTO>({
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean
    },
    passwordRecovery: {
        confirmationCode: String,
        expirationDate: Date
    }
}, { autoCreate: false, autoIndex: false })

usersSchema.method('updateIsConfirmed', function updateIsConfirmed(code: string) {
    const that = this as UserDTO & UserDBMethodsType
    if (that.emailConfirmation.isConfirmed) return false
    if (that.emailConfirmation.confirmationCode !== code) return false
    if (that.emailConfirmation.expirationDate < new Date()) return false

    that.emailConfirmation.isConfirmed = true
    return true
})

export const UsersModel = mongoose.model<UserDTO, UserModelType>('users', usersSchema)