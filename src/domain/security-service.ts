import { DeviceSessionsViewModel } from "../models/devices/DeviceSessionsViewModel"
import { deviceRepository } from "../repositories/device-db-repository"

class SecurityService {
    async getActiveDevicesForUser(userId: string) {
        const activeSessionsForUser = await deviceRepository.getDevicesForUser(userId)
        if (!activeSessionsForUser) {
            return null
        }

        const displayedActiveSessionsForUser: Array<DeviceSessionsViewModel> = activeSessionsForUser.map(el => ({
            ip: el.userInfo.userIp,
            title: el.deviceInfo.deviceName,
            lastActiveDate: new Date(el.issuedAt * 1000),
            deviceId: el.deviceInfo.deviceId
        }))
        return displayedActiveSessionsForUser
    }

    async removeAllSessions(userId: string, deviceId: string) { // exclude current session
        return deviceRepository.deleteAllSessions(userId, deviceId)
    }

    async deleteDevice(deviceId: string) {
        return deviceRepository.removeSession(deviceId)
    }
}

export const securityService = new SecurityService()