import mongoose from "mongoose";
import { UserDBMethodsType, UserDTO, UserModelFullType } from "./UsersTypes";
import { EmailConfirmationSchema } from "./EmailConfirmationSchema";
import { PasswordRecoverySchema } from "./PasswordRecoverySchema";

const usersSchema = new mongoose.Schema<UserDTO, UserModelFullType, UserDBMethodsType>({
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: EmailConfirmationSchema,
    passwordRecovery: PasswordRecoverySchema,
}, { autoCreate: false, autoIndex: false })

usersSchema.method('canBeConfirmed', function canBeConfirmed(code: string) {
    const that = this as UserDTO & UserDBMethodsType
    if (that.emailConfirmation.isConfirmed) return false
    if (that.emailConfirmation.confirmationCode !== code) return false
    if (that.emailConfirmation.expirationDate < new Date()) return false

    return true
})

usersSchema.method('updateIsConfirmed', function updateIsConfirmed(code: string) {
    const that = this as UserDTO & UserDBMethodsType

    that.emailConfirmation.isConfirmed = true
    return true
})

usersSchema.static('makeInstance', function makeInstance(login: string, email: string, passwordHash: string, isConfirmed: boolean) {
    const userDTO = new UserDTO(login, email, passwordHash, isConfirmed)
    return new UsersModel(userDTO)
})

export const UsersModel = mongoose.model<UserDTO, UserModelFullType>('users', usersSchema)