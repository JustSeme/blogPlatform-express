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
exports.deviceRepository = void 0;
const db_1 = require("./db");
exports.deviceRepository = {
    addSession(issuedAt, expireAt, userId, userIp, deviceId, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.deviceAuthSessions.insertOne({
                issuedAt: issuedAt,
                expireDate: expireAt,
                userInfo: {
                    userId,
                    userIp
                },
                deviceInfo: {
                    deviceId,
                    deviceName
                }
            });
            return result.acknowledged;
        });
    },
    destroySession(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.deviceAuthSessions.deleteOne({ 'deviceInfo.deviceId': deviceId });
            return result.acknowledged;
        });
    },
    deleteAllSessions(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.deviceAuthSessions.deleteMany({ $and: [{ 'userInfo.userId': userId }, { 'deviceInfo.deviceId': { $ne: deviceId } }] });
            return result.acknowledged;
        });
    },
    updateSession(deviceId, issuedAt, expireDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.deviceAuthSessions.updateOne({ "deviceInfo.deviceId": deviceId }, { $set: { issuedAt, expireDate } });
            return result.acknowledged;
        });
    },
};
//# sourceMappingURL=device-db-repository.js.map