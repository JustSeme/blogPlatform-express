"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../settings");
const device_db_repository_1 = require("../features/security/infrastructure/device-db-repository");
const injectable_1 = require("inversify/lib/annotation/injectable");
let JwtService = class JwtService {
    constructor(deviceRepository) {
        this.deviceRepository = deviceRepository;
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
};
JwtService = __decorate([
    (0, injectable_1.injectable)(),
    __metadata("design:paramtypes", [device_db_repository_1.DeviceRepository])
], JwtService);
exports.JwtService = JwtService;
//# sourceMappingURL=jwtService.js.map