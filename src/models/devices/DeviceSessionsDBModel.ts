export type DeviceAuthSessionsModel = {
    issuedAt: number
    expireDate: number
    userInfo: UserInfoType
    deviceInfo: DeviceInfoType
}

type UserInfoType = {
    userId: string
    userIp: string
}

type DeviceInfoType = {
    deviceId: string
    deviceName: string
}