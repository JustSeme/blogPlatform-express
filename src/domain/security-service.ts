import { DeviceSessionsViewModel } from "../models/devices/DeviceSessionsViewModel"
import { deviceRepository } from "../repositories/device-db-repository"
import { deviceQueryRepository } from "../repositories/query/device-query-repository"

export const securityService = {
    async getActiveDevicesForUser(userId: string) {
        const activeSessionsForUser = await deviceQueryRepository.getDevicesForUser(userId)
        if(!activeSessionsForUser) {
            return null
        }

        const displayedActiveSessionsForUser: Array<DeviceSessionsViewModel> = await activeSessionsForUser.map(el => ({
            ip: el.userInfo.userIp,
            title: el.deviceInfo.deviceName,
            lastActiveDate: new Date(el.issuedAt * 1000),
            deviceId: el.deviceInfo.deviceId
        }))
        return displayedActiveSessionsForUser
    },
    
    async removeAllSessions(userId: string, deviceId: string) { // exclude current session
        return await deviceRepository.deleteAllSessions(userId, deviceId)
    },

    async deleteDevice(deviceId: string) {
        return await deviceRepository.removeSession(deviceId)
    }
}