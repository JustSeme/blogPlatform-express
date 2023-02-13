export type UserDBModel = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string,
    emailConfirmation: EmailConfirmationData
    registrationData: RegistrationData
}

type EmailConfirmationData = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

type RegistrationData = {
    ip: string
}