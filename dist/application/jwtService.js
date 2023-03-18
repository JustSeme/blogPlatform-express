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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../settings");
const uuid_1 = require("uuid");
const device_db_repository_1 = require("../repositories/device-db-repository");
const DeviceSessionsModel_1 = require("../models/devices/DeviceSessionsModel");
class JwtService {
    constructor() {
        this.deviceRepository = new device_db_repository_1.DeviceRepository();
    }
    createAccessToken(expiresTime, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId }, settings_1.settings.JWT_SECRET, { expiresIn: expiresTime });
        });
    }
    createRefreshToken(expiresTime, deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ deviceId, userId }, settings_1.settings.JWT_SECRET, { expiresIn: expiresTime });
        });
    }
    getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield jsonwebtoken_1.default.verify(token, settings_1.settings.JWT_SECRET);
                return result.userId;
            }
            catch (err) {
                return null;
            }
        });
    }
    verifyRefreshToken(verifiedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield jsonwebtoken_1.default.verify(verifiedToken, settings_1.settings.JWT_SECRET);
                const issuedAtForDeviceId = yield this.deviceRepository.getCurrentIssuedAt(result.deviceId);
                if (issuedAtForDeviceId > result.iat) {
                    return null;
                }
                return result;
            }
            catch (err) {
                return null;
            }
        });
    }
    verifyAccessToken(verifiedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield jsonwebtoken_1.default.verify(verifiedToken, settings_1.settings.JWT_SECRET);
                return result;
            }
            catch (err) {
                return null;
            }
        });
    }
    refreshTokens(verifiedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.verifyRefreshToken(verifiedToken);
            if (!result) {
                return null;
            }
            const newRefreshToken = yield this.createRefreshToken(settings_1.settings.ACCESS_TOKEN_EXPIRE_TIME, result.deviceId, result.userId);
            const newAccessToken = yield this.createAccessToken(settings_1.settings.REFRESH_TOKEN_EXPIRE_TIME, result.userId);
            const resultOfCreatedToken = jsonwebtoken_1.default.decode(newRefreshToken);
            const isUpdated = this.deviceRepository.updateSession(result.deviceId, resultOfCreatedToken.iat, resultOfCreatedToken.exp);
            if (!isUpdated) {
                return null;
            }
            return {
                newRefreshToken,
                newAccessToken
            };
        });
    }
    login(userId, userIp, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = (0, uuid_1.v4)();
            const accessToken = yield this.createAccessToken(settings_1.settings.ACCESS_TOKEN_EXPIRE_TIME, userId);
            const refreshToken = yield this.createRefreshToken(settings_1.settings.REFRESH_TOKEN_EXPIRE_TIME, deviceId, userId);
            const result = jsonwebtoken_1.default.decode(refreshToken);
            //Спросить, где лучше добавлять новую активную сессию (Здесь, при логине, это как-то неявно)
            const newSession = new DeviceSessionsModel_1.DeviceAuthSessionsModel(result.iat, result.exp, userId, userIp, deviceId, deviceName);
            const isAdded = yield this.deviceRepository.addSession(newSession);
            if (!isAdded) {
                return null;
            }
            return {
                accessToken,
                refreshToken
            };
        });
    }
    logout(usedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.verifyRefreshToken(usedToken);
            if (!result) {
                return false;
            }
            const isDeleted = this.deviceRepository.removeSession(result.deviceId);
            if (!isDeleted) {
                return false;
            }
            return true;
        });
    }
}
exports.JwtService = JwtService;
exports.jwtService = new JwtService();
//# sourceMappingURL=jwtService.js.map