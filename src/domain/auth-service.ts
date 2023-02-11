import { emailManager } from "../managers/emailManager"

export const authService = {
    async sendConfirmationCode(recipientEmail: string, url: string) {
        let urlWithConfirmationCode = ''
        return await emailManager.sendConfirmationCode(recipientEmail, urlWithConfirmationCode)
    }
}