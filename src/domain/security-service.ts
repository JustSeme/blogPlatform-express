import { DeviceSessionsViewModel } from "../models/devices/DeviceSessionsViewModel"
import { deviceRepository } from "../repositories/device-db-repository"
import { deviceQueryRepository } from "../repositories/query/device-query-repository"

export const securityService = {
    async getActiveDevicesForUser(userId: string) {
        const activeSessionsForUser = await deviceQueryRepository.getSessionsForUser(userId)
        if(!activeSessionsForUser) {
            return null
        }

        const displayedActiveSessionsForUser: Array<DeviceSessionsViewModel> = await activeSessionsForUser.map(el => ({
            ip: el.userInfo.userIp,
            title: el.deviceInfo.deviceName,
            lastActiveDate: el.issuedAt.toString(),
            deviceId: el.deviceInfo.deviceId
        }))
        return displayedActiveSessionsForUser
    },
    
    async destroyAllSessions(userId: string, deviceId: string) { // exclude current session
        return await deviceRepository.deleteAllSessions(userId, deviceId)
    },

    async deleteDevice(deviceId: string) {
        return await deviceRepository.destroySession(deviceId)
    }
}