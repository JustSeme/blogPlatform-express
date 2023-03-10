import nodemailer from 'nodemailer'
import { settings } from "../settings";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, messageBody: string) {
        console.log('sendEmail');

        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: settings.GMAIL_LOGIN,
                pass: settings.GMAIL_APP_PASSWORD,
            },
        });

        transport.sendMail({
            from: `"Blog Platform" <${settings.GMAIL_LOGIN}>`,
            to: email,
            subject: subject,
            html: messageBody,
        });

        return
    }
}