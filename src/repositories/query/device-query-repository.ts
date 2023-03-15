import { DeviceAuthSessionsModel } from "../db"

export const deviceQueryRepository = {
    async getDeviceByDeviceId(deviceId: string) {
        return DeviceAuthSessionsModel.findOne({ "deviceInfo.deviceId": deviceId }).lean()
    },
}