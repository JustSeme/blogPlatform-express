"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = require("express");
const composition_root_1 = require("../composition-root");
exports.securityRouter = (0, express_1.Router)({});
exports.securityRouter.get('/devices', composition_root_1.securityController.getDevices.bind(composition_root_1.securityController));
exports.securityRouter.delete('/devices', composition_root_1.securityController.deleteDevices.bind(composition_root_1.securityController));
exports.securityRouter.delete('/devices/:deviceId', composition_root_1.securityController.deleteDeviceById.bind(composition_root_1.securityController));
//# sourceMappingURL=security-router.js.map