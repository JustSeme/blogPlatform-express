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
exports.SecurityController = void 0;
const settings_1 = require("../settings");
const device_query_repository_1 = require("../repositories/query/device-query-repository");
class SecurityController {
    constructor(jwtService, securityService) {
        this.jwtService = jwtService;
        this.securityService = securityService;
    }
    getDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const result = yield this.jwtService.verifyRefreshToken(refreshToken);
            if (!result) {
                res.sendStatus(settings_1.HTTP_STATUSES.UNAUTHORIZED_401);
                return;
            }
            const activeDevicesForUser = yield this.securityService.getActiveDevicesForUser(result.userId);
            if (!activeDevicesForUser) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.send(activeDevicesForUser);
        });
    }
    deleteDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const result = yield this.jwtService.verifyRefreshToken(refreshToken);
            if (!result) {
                res.sendStatus(settings_1.HTTP_STATUSES.UNAUTHORIZED_401);
                return;
            }
            const isDeleted = yield this.securityService.removeAllSessions(result.userId, result.deviceId); // exclude current
            if (!isDeleted) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_IMPLEMENTED_501);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    deleteDeviceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const result = yield this.jwtService.verifyRefreshToken(refreshToken);
            if (!result) {
                res.sendStatus(settings_1.HTTP_STATUSES.UNAUTHORIZED_401);
                return;
            }
            const deletingDevice = yield device_query_repository_1.deviceQueryRepository.getDeviceByDeviceId(req.params.deviceId);
            if (!deletingDevice) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            if (result.userId !== deletingDevice.userInfo.userId) {
                res.sendStatus(settings_1.HTTP_STATUSES.FORBIDDEN_403);
                return;
            }
            yield this.securityService.deleteDevice(req.params.deviceId);
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
}
exports.SecurityController = SecurityController;
//# sourceMappingURL=security-controller.js.map