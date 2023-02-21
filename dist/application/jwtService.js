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
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../settings");
const uuid_1 = require("uuid");
const device_db_repository_1 = require("../repositories/device-db-repository");
exports.jwtService = {
    createJWT(expiresTime, ...payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield jsonwebtoken_1.default.sign(Object.assign({}, payload), settings_1.settings.JWT_SECRET, { expiresIn: expiresTime });
        });
    },
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
    },
    verifyToken(verifiedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            /* const tokenInBlacklist = await refreshTokenBlacklist.find({ outDatedToken: verifiedToken }).toArray()
            if(tokenInBlacklist.length) {
                return null
            } */
            try {
                const result = yield jsonwebtoken_1.default.verify(verifiedToken, settings_1.settings.JWT_SECRET);
                return result;
            }
            catch (err) {
                return null;
            }
        });
    },
    refreshTokens(verifiedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.verifyToken(verifiedToken);
            if (!result) {
                return null;
            }
            /* await refreshTokenBlacklist.insertOne({ outDatedToken: verifiedToken }) */
            const newRefreshToken = yield this.createJWT('20s', result.userId);
            const newAccessToken = yield this.createJWT('10s', result.userId);
            return {
                newRefreshToken,
                newAccessToken
            };
        });
    },
    login(userId, userIp, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = (0, uuid_1.v4)();
            const accessToken = yield this.createJWT('10min', userId);
            const refreshToken = yield this.createJWT('20min', userId, deviceId);
            const result = jsonwebtoken_1.default.decode(refreshToken);
            const isAdded = yield device_db_repository_1.deviceRepository.addSession(result.iat, result.exp, userId, userIp, deviceId, deviceName);
            if (!isAdded) {
                return null;
            }
            return {
                accessToken,
                refreshToken
            };
        });
    },
    logout(usedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.verifyToken(usedToken);
            if (!result) {
                return false;
            }
            const isDeleted = device_db_repository_1.deviceRepository.destroySesion(result.deviceId);
            if (!isDeleted) {
                return false;
            }
            return true;
        });
    }
};
//# sourceMappingURL=jwtService.js.map