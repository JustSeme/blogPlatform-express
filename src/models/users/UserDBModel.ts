export type UserDBModel = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string,
    emailConfirmation: EmailConfirmationData
    passwordRecovery: PasswordConfirmationData
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