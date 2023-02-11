import { emailAdapter } from "../adapters/emailAdapter"

export const emailManager = {
    async sendConfirmationCode(recipientEmail: string, recipientLogin: string, confirmationCode: string) {
        const messageBody = `
            <h1>Hello, dear ${recipientLogin}! Welcome to the Blog Platform!</h1>
            <div>
                <p>To continue registration, </p><a href='https://some-front.com/confirm-registration?code=${confirmationCode}'>click here</a>
            </div>
        `
        return await emailAdapter.sendEmail(recipientEmail, 'ConfirmationCode', messageBody)
    }
}