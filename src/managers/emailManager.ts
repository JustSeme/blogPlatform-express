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
        console.log('manager');
        const messageBody = `
            <p>To continue password recovering, </p><a href='https://somesite.com/password-recovery?recoveryCode=${confirmationCode}'>click here</a>
        `
        return emailAdapter.sendEmail(recipientEmail, 'Recovery Password', messageBody)
    }
}