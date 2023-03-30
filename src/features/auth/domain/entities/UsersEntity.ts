import mongoose, { Model } from "mongoose";
import { add } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

export class UserDTO {
    public id: string
    public createdAt: string

    public emailConfirmation: EmailConfirmationData
    public passwordRecovery: PasswordConfirmationData

    constructor(
        public login: string,
        public email: string,
        public passwordHash: string,
        isConfirmed: boolean
    ) {
        this.id = uuidv4()
        this.createdAt = new Date().toISOString()
        this.emailConfirmation = {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 3
            }),
            isConfirmed: isConfirmed
        }
        this.passwordRecovery = {
            confirmationCode: null,
            expirationDate: new Date()
        }
    }
}

type EmailConfirmationData = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

type PasswordConfirmationData = {
    confirmationCode: string | null
    expirationDate: Date
}


type UserDBMethodsType = {
    updateIsConfirmed: (code: string) => boolean
}

export type UserModelType = Model<UserDTO, {}, UserDBMethodsType>

type UserModelStaticType = Model<UserDTO> & {
    makeInstance(login: string, email: string, passwordHash: string, isConfirmed: boolean): any
}

type UserModelFullType = UserModelType & UserModelStaticType

const usersSchema = new mongoose.Schema<UserDTO, UserModelFullType, UserDBMethodsType>({
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

usersSchema.static('makeInstance', function makeInstance(login: string, email: string, passwordHash: string, isConfirmed: boolean) {
    const userDTO = new UserDTO(login, email, passwordHash, isConfirmed)
    return new UsersModel(userDTO)
})

export const UsersModel = mongoose.model<UserDTO, UserModelFullType>('users', usersSchema)