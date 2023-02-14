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
exports.refreshTokenMiddleware = void 0;
const app_1 = require("../app");
const jwtService_1 = require("../application/jwtService");
const refreshTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.headers["set-cookie"];
    if (!refreshToken) {
        res.sendStatus(app_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const newRefreshTokenAndUserId = yield jwtService_1.jwtService.refreshToken(refreshToken[0]);
    if (!newRefreshTokenAndUserId) {
        res.sendStatus(app_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    //@ts-ignore
    req.userId = newRefreshTokenAndUserId.userId;
    res.cookie('refreshToken', newRefreshTokenAndUserId.newRefreshToken, { httpOnly: true, secure: true });
    next();
});
exports.refreshTokenMiddleware = refreshTokenMiddleware;
//# sourceMappingURL=refresh-token-middleware.js.map