import { Model } from "mongoose"
import { add } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { HydratedUser } from "../infrastructure/UsersTypes"

export class UserDTO {
    public id: string
    public createdAt: string

    public emailConfirmation: EmailConfirmationType
    public passwordRecovery: PasswordConfirmationType

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

export type EmailConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export type PasswordConfirmationType = {
    confirmationCode: string | null
    expirationDate: Date
}

export type UserDBMethodsType = {
    updateIsConfirmed: (code: string) => boolean
    canBeConfirmed: (code: string) => boolean
}

export type UserModelType = Model<UserDTO, {}, UserDBMethodsType>

type UserModelStaticType = Model<UserDTO> & {
    makeInstance(login: string, email: string, passwordHash: string, isConfirmed: boolean): HydratedUser
}

export type UserModelFullType = UserModelType & UserModelStaticType