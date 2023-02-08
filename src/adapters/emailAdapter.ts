import nodemailer from 'nodemailer'
import { settings } from "../settings";

export const emailAdapter = {
    async sendConfirmationCode(email: string) {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: settings.GMAIL_LOGIN,
                pass: settings.GMAIL_APP_PASSWORD,
            },
        });
        
        let info = await transport.sendMail({
            from: `"Blog Platform" <${settings.GMAIL_LOGIN}>`,
            to: email,
            subject: 'Confirmation Code',
            html: "here will be confirmation code",
        });
    }
}