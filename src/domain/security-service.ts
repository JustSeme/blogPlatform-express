import { DeviceSessionsViewModel } from "../models/devices/DeviceSessionsViewModel"
import { DeviceRepository } from "../repositories/device-db-repository"

export class SecurityService {
    private deviceRepository: DeviceRepository

    constructor() {
        this.deviceRepository = new DeviceRepository()
    }

    async getActiveDevicesForUser(userId: string) {
        const activeSessionsForUser = await this.deviceRepository.getDevicesForUser(userId)
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
        return this.deviceRepository.deleteAllSessions(userId, deviceId)
    }

    async deleteDevice(deviceId: string) {
        return this.deviceRepository.removeSession(deviceId)
    }
}