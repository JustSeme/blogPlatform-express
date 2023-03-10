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

    async sendPasswordRecoveryCode(recipientEmail: string, recipientLogin: string, confirmationCode: string) {
        const messageBody = `
            <h1>${recipientLogin}, we revice notification, that you want to recover your password</h1>
            <div>
                <b>If you haven't tried to recover your password, ignore this message!</b>
                <p>To continue password recovering, </p><a href='https://somesite.com/password-recovery?recoveryCode=${confirmationCode}'>click here</a>
            </div>
        `
        return emailAdapter.sendEmail(recipientEmail, 'Recovery Password', messageBody)
    }
}