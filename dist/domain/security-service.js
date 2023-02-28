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
const device_query_repository_1 = require("../repositories/query/device-query-repository");
exports.securityService = {
    getActiveDevicesForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeSessionsForUser = yield device_query_repository_1.deviceQueryRepository.getSessionsForUser(userId);
            if (!activeSessionsForUser) {
                return null;
            }
            const displayedActiveSessionsForUser = yield activeSessionsForUser.map(el => ({
                ip: el.userInfo.userIp,
                title: el.deviceInfo.deviceName,
                lastActiveDate: el.issuedAt.toString(),
                deviceId: el.deviceInfo.deviceId
            }));
            return displayedActiveSessionsForUser;
        });
    }
};
//# sourceMappingURL=security-service.js.map