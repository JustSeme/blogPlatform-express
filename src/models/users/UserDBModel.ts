export type UserDBModel = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string,
    emailConfirmation: EmailConfirmationData
}

type EmailConfirmationData = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}