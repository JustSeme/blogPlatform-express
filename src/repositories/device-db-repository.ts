import { DeviceAuthSessionsModel } from "../models/devices/DeviceSessionsModel"
import { DeviceAuthSessionsDBModel } from "./db"

export class DeviceRepository {
    async addSession(newSession: DeviceAuthSessionsModel) {
        const result = await DeviceAuthSessionsDBModel.create(newSession)
        return result ? true : false
    }

    async removeSession(deviceId: string) {
        const result = await DeviceAuthSessionsDBModel.deleteOne({ 'deviceInfo.deviceId': deviceId })
        return result.deletedCount === 1
    }

    async deleteAllSessions(userId: string, deviceId: string) { // exclude current session
        const result = await DeviceAuthSessionsDBModel.deleteMany({ $and: [{ 'userInfo.userId': userId }, { 'deviceInfo.deviceId': { $ne: deviceId } }] })
        return result.deletedCount > 0
    }

    async updateSession(deviceId: string, issuedAt: number, expireDate: number) {
        const result = await DeviceAuthSessionsDBModel.updateOne({ "deviceInfo.deviceId": deviceId }, { issuedAt, expireDate })
        return result.matchedCount === 1
    }

    async getDevicesForUser(userId: string) {
        return DeviceAuthSessionsDBModel.find({ "userInfo.userId": userId })
    }

    async getCurrentIssuedAt(deviceId: string) {
        const result = await DeviceAuthSessionsDBModel.findOne({ 'deviceInfo.deviceId': deviceId })
        return result!.issuedAt
    }
}