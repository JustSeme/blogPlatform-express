import { DeviceSessionsViewModel } from "../models/devices/DeviceSessionsViewModel"
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
    }
}