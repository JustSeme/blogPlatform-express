import { emailAdapter } from "../adapters/emailAdapter"

export const emailManager = {
    async sendConfirmationCode(recipientEmail: string, recipientLogin: string, confirmationCode: string) {

        const messageBody = `
        <h1>Hello, dear ${recipientLogin}! Welcome to the Blog Platform!</h1>
        <div>
        <p>To continue registration, </p><a href='https://some-front.com/confirm-registration?code=${confirmationCode}'>click here</a>
        </div>
        `
        return emailAdapter.sendEmail(recipientEmail, 'ConfirmationCode', messageBody)
    },

    async sendPasswordRecoveryCode(recipientEmail: string, recipientLogin: string, passwordRecoveryCode: string) {

        const messageBody = `
        <h1>Hello, dear ${recipientLogin}! Welcome to the Blog Platform!</h1>
        <div>
            <p>To continue registration, </p><a href='https://some-front.com/confirm-registration?code=${passwordRecoveryCode}'>click here</a>
        </div>
        `
        return emailAdapter.sendEmail(recipientEmail, 'PasswordRecoveryCode', messageBody)
    },
}