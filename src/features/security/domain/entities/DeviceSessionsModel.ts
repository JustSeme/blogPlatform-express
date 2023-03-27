/* export type DeviceAuthSessionsModel = {
    issuedAt: number
    expireDate: number
    userInfo: UserInfoType
    deviceInfo: DeviceInfoType
} */

export class DeviceAuthSessionsModel {
    public userInfo: UserInfoType
    public deviceInfo: DeviceInfoType

    constructor(
        public issuedAt: number,
        public expireDate: number,
        userId: string,
        userIp: string,
        deviceId: string,
        deviceName: string,
    ) {

        this.userInfo = {
            userId,
            userIp
        }
        this.deviceInfo = {
            deviceId,
            deviceName
        }
    }
}

type UserInfoType = {
    userId: string
    userIp: string
}

type DeviceInfoType = {
    deviceId: string
    deviceName: string
}