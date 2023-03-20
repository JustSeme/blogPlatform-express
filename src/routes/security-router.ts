import { Router } from "express";
import { securityController } from "../composition-root";

export const securityRouter = Router({})

securityRouter.get('/devices', securityController.getDevices.bind(securityController))

securityRouter.delete('/devices', securityController.deleteDevices.bind(securityController))

securityRouter.delete('/devices/:deviceId', securityController.deleteDeviceById.bind(securityController))