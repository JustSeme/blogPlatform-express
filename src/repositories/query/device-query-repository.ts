import { deviceAuthSessionsModel } from "../db"

export const deviceQueryRepository = {
    async getCurrentIssuedAt(deviceId: string) {
        const result = await deviceAuthSessionsModel.findOne({ 'deviceInfo.deviceId': deviceId })
        return result!.issuedAt
    },

    async getDevicesForUser(userId: string) {
        return deviceAuthSessionsModel.find({ "userInfo.userId": userId }).lean()
    },

    async getDeviceByDeviceId(deviceId: string) {
        return deviceAuthSessionsModel.findOne({ "deviceInfo.deviceId": deviceId })
    },
}