import { DeviceSessionsViewModel } from "../api/models/DeviceSessionsViewModel"
import { DeviceRepository } from "../infrastructure/device-db-repository"
import { injectable } from 'inversify/lib/annotation/injectable';

@injectable()
export class SecurityService {
    constructor(protected deviceRepository: DeviceRepository) { }

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