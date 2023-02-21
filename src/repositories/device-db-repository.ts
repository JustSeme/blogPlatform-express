import { deviceAuthSessions } from "./db"

export const deviceRepository = {
    async addSession(issuedAt: number, expireAt: number, userId: string, userIp: string, deviceId: string, deviceName: string) {
        const result = await deviceAuthSessions.insertOne({
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

        return result.acknowledged
    },

    async destroySesion(deviceId: string) {
        const result = await deviceAuthSessions.deleteOne({'deviceInfo.deviceId': deviceId})
        return result.acknowledged
    }
}