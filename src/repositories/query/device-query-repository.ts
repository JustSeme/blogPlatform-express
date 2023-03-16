import { DeviceAuthSessionsDBModel } from "../db"

export const deviceQueryRepository = {
    async getDeviceByDeviceId(deviceId: string) {
        return DeviceAuthSessionsDBModel.findOne({ "deviceInfo.deviceId": deviceId }).lean()
    },
}