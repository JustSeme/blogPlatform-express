"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = require("express");
const composition_root_1 = require("../../../../composition-root");
const security_controller_1 = require("../controllers/security-controller");
const securityController = composition_root_1.container.resolve(security_controller_1.SecurityController);
exports.securityRouter = (0, express_1.Router)({});
exports.securityRouter.get('/devices', securityController.getDevices.bind(securityController));
exports.securityRouter.delete('/devices', securityController.deleteDevices.bind(securityController));
exports.securityRouter.delete('/devices/:deviceId', securityController.deleteDeviceById.bind(securityController));
//# sourceMappingURL=security-router.js.map