import { DeviceAuthSessionsModel } from "./db"

export const deviceRepository = {
    async addSession(issuedAt: number, expireAt: number, userId: string, userIp: string, deviceId: string, deviceName: string) {
        const result = await DeviceAuthSessionsModel.create({
            issuedAt: issuedAt,
            expireDate: expireAt,
            userInfo: {
                userId,
                userIp
            },
            deviceInfo: {
                deviceId,
                deviceName
            }
        })

        return result ? true : false
    },

    async removeSession(deviceId: string) {
        const result = await DeviceAuthSessionsModel.deleteOne({ 'deviceInfo.deviceId': deviceId })
        return result.deletedCount === 1
    },

    async deleteAllSessions(userId: string, deviceId: string) { // exclude current session
        const result = await DeviceAuthSessionsModel.deleteMany({ $and: [{ 'userInfo.userId': userId }, { 'deviceInfo.deviceId': { $ne: deviceId } }] })
        return result.deletedCount > 0
    },

    async updateSession(deviceId: string, issuedAt: number, expireDate: number) {
        const result = await DeviceAuthSessionsModel.updateOne({ "deviceInfo.deviceId": deviceId }, { issuedAt, expireDate })
        return result.matchedCount === 1
    },
}