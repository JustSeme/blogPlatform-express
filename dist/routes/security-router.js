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
const device_query_repository_1 = require("../repositories/query/device-query-repository");
exports.securityRouter = (0, express_1.Router)({});
exports.securityRouter.get('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.cookies) {
        res.sendStatus(app_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    console.log(req.cookies);
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
    const isDeleted = yield security_service_1.securityService.removeAllSessions(result.userId, result.deviceId);
    if (!isDeleted) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_IMPLEMENTED_501);
        return;
    }
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.securityRouter.delete('/devices/:deviceId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const result = yield jwtService_1.jwtService.verifyToken(refreshToken);
    if (!result) {
        res.sendStatus(app_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const deletingDevice = yield device_query_repository_1.deviceQueryRepository.getDeviceByDeviceId(req.params.deviceId);
    if (!deletingDevice) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    if (result.userId !== deletingDevice.userInfo.userId) {
        res.sendStatus(app_1.HTTP_STATUSES.FORBIDDEN_403);
        return;
    }
    yield security_service_1.securityService.deleteDevice(req.params.deviceId);
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
//# sourceMappingURL=security-router.js.map