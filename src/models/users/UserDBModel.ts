export type UserDBModel = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string,
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
}