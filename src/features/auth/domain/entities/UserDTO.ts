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