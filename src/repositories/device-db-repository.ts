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

    async destroySession(deviceId: string) {
        const result = await deviceAuthSessions.deleteOne({'deviceInfo.deviceId': deviceId})
        return result.acknowledged
    },

    async deleteAllSessions(userId: string, deviceId: string) { // exclude current session
        const result = await deviceAuthSessions.deleteMany({$and: [{'userInfo.userId': userId}, {'deviceInfo.deviceId': {$ne: deviceId}}]})
        return result.acknowledged
    },

    async updateSession(deviceId: string, issuedAt: number, expireDate: number) {
        const result = await deviceAuthSessions.updateOne({"deviceInfo.deviceId": deviceId}, {$set: {issuedAt, expireDate}})
        return result.acknowledged
    },
}