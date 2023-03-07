import mongoose from "mongoose";
import { DeviceAuthSessionsModelType } from "../../models/devices/DeviceSessionsDBModel";

export const deviceAuthSessionsSchema = new mongoose.Schema<DeviceAuthSessionsModelType>({
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