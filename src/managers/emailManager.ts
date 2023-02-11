import { emailAdapter } from "../adapters/emailAdapter"

export const emailManager = {
    async sendConfirmationCode(recipientEmail: string, urlWithConfirmationCode: string) {
        const messageBody = `
            <h1>Hello! Welcome to BlogPlatform!!!</h1>
        `
        return await emailAdapter.sendEmail(recipientEmail, 'ConfirmationCode', messageBody)
    }
}