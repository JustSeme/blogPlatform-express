"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityService = void 0;
const device_db_repository_1 = require("../repositories/device-db-repository");
class SecurityService {
    getActiveDevicesForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeSessionsForUser = yield device_db_repository_1.deviceRepository.getDevicesForUser(userId);
            if (!activeSessionsForUser) {
                return null;
            }
            const displayedActiveSessionsForUser = activeSessionsForUser.map(el => ({
                ip: el.userInfo.userIp,
                title: el.deviceInfo.deviceName,
                lastActiveDate: new Date(el.issuedAt * 1000),
                deviceId: el.deviceInfo.deviceId
            }));
            return displayedActiveSessionsForUser;
        });
    }
    removeAllSessions(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return device_db_repository_1.deviceRepository.deleteAllSessions(userId, deviceId);
        });
    }
    deleteDevice(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return device_db_repository_1.deviceRepository.removeSession(deviceId);
        });
    }
}
exports.securityService = new SecurityService();
//# sourceMappingURL=security-service.js.map