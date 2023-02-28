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
exports.securityRouter = void 0;
const express_1 = require("express");
const app_1 = require("../app");
const jwtService_1 = require("../application/jwtService");
const security_service_1 = require("../domain/security-service");
exports.securityRouter = (0, express_1.Router)({});
exports.securityRouter.get('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const result = yield jwtService_1.jwtService.verifyToken(refreshToken);
    if (!result) {
        res.sendStatus(app_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const activeDevicesForUser = yield security_service_1.securityService.getActiveDevicesForUser(result.userId);
    if (!activeDevicesForUser) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.send(activeDevicesForUser);
}));
exports.securityRouter.delete('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const result = yield jwtService_1.jwtService.verifyToken(refreshToken);
    if (!result) {
        res.sendStatus(app_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const isDeleted = yield security_service_1.securityService.destroyAllSessions(result.userId, result.deviceId);
    if (!isDeleted) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_IMPLEMENTED_501);
        return;
    }
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.securityRouter.delete('/devices/:deviceId');
//# sourceMappingURL=security-router.js.map