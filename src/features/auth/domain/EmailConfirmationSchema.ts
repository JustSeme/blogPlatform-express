import mongoose from "mongoose";
import { EmailConfirmationType } from "./UsersTypes";

export const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true }
})