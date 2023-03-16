"use strict";
/* export type DeviceAuthSessionsModel = {
    issuedAt: number
    expireDate: number
    userInfo: UserInfoType
    deviceInfo: DeviceInfoType
} */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceAuthSessionsModel = void 0;
class DeviceAuthSessionsModel {
    constructor(issuedAt, expireDate, userId, userIp, deviceId, deviceName) {
        this.issuedAt = issuedAt;
        this.expireDate = expireDate;
        this.userInfo = {
            userId,
            userIp
        };
        this.deviceInfo = {
            deviceId,
            deviceName
        };
    }
}
exports.DeviceAuthSessionsModel = DeviceAuthSessionsModel;
//# sourceMappingURL=DeviceSessionsModel.js.map