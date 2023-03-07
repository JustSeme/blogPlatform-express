import { DeviceAuthSessionsModel } from "../db"

export const deviceQueryRepository = {
    async getCurrentIssuedAt(deviceId: string) {
        const result = await DeviceAuthSessionsModel.findOne({ 'deviceInfo.deviceId': deviceId })
        return result!.issuedAt
    },

    async getDevicesForUser(userId: string) {
        return DeviceAuthSessionsModel.find({ "userInfo.userId": userId }).lean()
    },

    async getDeviceByDeviceId(deviceId: string) {
        return DeviceAuthSessionsModel.findOne({ "deviceInfo.deviceId": deviceId })
    },
}