import mongoose from "mongoose";
import { PasswordConfirmationType } from "./UsersTypes";

export const PasswordRecoverySchema = new mongoose.Schema<PasswordConfirmationType>({
    confirmationCode: {
        type: String, required: true
    },
    expirationDate: {
        type: Date, required: true
    }
});