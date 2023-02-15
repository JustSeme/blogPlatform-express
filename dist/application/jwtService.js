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
const db_1 = require("../repositories/db");
const settings_1 = require("../settings");
exports.jwtService = {
    createJWT(userId, expiresTime) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield jsonwebtoken_1.default.sign({ userId: userId }, settings_1.settings.JWT_SECRET, { expiresIn: expiresTime });
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
            const tokenInBlacklist = yield db_1.refreshTokenBlacklist.find({ outDatedToken: verifiedToken }).toArray();
            if (tokenInBlacklist.length) {
                return null;
            }
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
            yield db_1.refreshTokenBlacklist.insertOne({ outDatedToken: verifiedToken });
            const newRefreshToken = yield this.createJWT(result.userId, '20s');
            const newAccessToken = yield this.createJWT(result.userId, '10s');
            return {
                newRefreshToken,
                newAccessToken
            };
        });
    },
    logout(usedToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this.verifyToken(usedToken);
            if (!result) {
                return false;
            }
            const insertResult = yield db_1.refreshTokenBlacklist.insertOne({ outDatedToken: usedToken });
            if (!insertResult.acknowledged) {
                return false;
            }
            return true;
        });
    }
};
//# sourceMappingURL=jwtService.js.map