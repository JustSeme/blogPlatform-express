import mongoose from "mongoose";
import { AttemptsDBModel } from "./AttemptsDBModel";

export const attemptsSchema = new mongoose.Schema<AttemptsDBModel>({
    clientIp: { type: String, required: true },
    requestedUrl: { type: String, required: true },
    requestDate: { type: Date, required: true },
})