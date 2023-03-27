import { DeviceAuthSessionsDBModel } from "../../../repositories/db"

export const deviceQueryRepository = {
    async getDeviceByDeviceId(deviceId: string) {
        return DeviceAuthSessionsDBModel.findOne({ "deviceInfo.deviceId": deviceId }).lean()
    },
}