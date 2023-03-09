import mongoose from "mongoose";
import { UserDBModel } from "../../models/users/UserDBModel";

export const usersSchema = new mongoose.Schema<UserDBModel>({
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean
    },
    passwordRecovery: {
        confirmationCode: String,
        expirationDate: Date
    }
}, { autoCreate: false, autoIndex: false })

