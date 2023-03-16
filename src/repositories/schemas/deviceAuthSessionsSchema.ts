import mongoose from "mongoose";
import { DeviceAuthSessionsModel } from "../../models/devices/DeviceSessionsModel";

export const deviceAuthSessionsSchema = new mongoose.Schema<DeviceAuthSessionsModel>({
    issuedAt: { type: Number, required: true },
    expireDate: { type: Number, required: true },
    userInfo: {
        userId: { type: String, required: true },
        userIp: { type: String, required: true },
    },
    deviceInfo: {
        deviceId: { type: String, required: true },
        deviceName: { type: String, required: true },
    },
})