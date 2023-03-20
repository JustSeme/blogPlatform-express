import { Router } from "express";
import { container } from "../composition-root";
import { SecurityController } from "../controllers/security-controller";

const securityController = container.resolve<SecurityController>(SecurityController)

export const securityRouter = Router({})

securityRouter.get('/devices', securityController.getDevices.bind(securityController))

securityRouter.delete('/devices', securityController.deleteDevices.bind(securityController))

securityRouter.delete('/devices/:deviceId', securityController.deleteDeviceById.bind(securityController))