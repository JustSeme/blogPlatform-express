import { Request, Response, Router } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUSES } from '../settings'
import { JwtService } from "../application/jwtService";
import { SecurityService } from "../domain/security-service";
import { DeviceSessionsViewModel } from "../models/devices/DeviceSessionsViewModel";
import { deviceQueryRepository } from "../repositories/query/device-query-repository";
import { RequestWithParams } from "../types/types";

export const securityRouter = Router({})

class SecurityController {
    private jwtService: JwtService
    private securityService: SecurityService

    constructor() {
        this.jwtService = new JwtService()
        this.securityService = new SecurityService()
    }

    async getDevices(req: Request, res: Response<DeviceSessionsViewModel[]>) {
        const refreshToken = req.cookies.refreshToken
        const result = await this.jwtService.verifyRefreshToken(refreshToken) as JwtPayload

        if (!result) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const activeDevicesForUser = await this.securityService.getActiveDevicesForUser(result.userId)
        if (!activeDevicesForUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.send(activeDevicesForUser)
    }

    async deleteDevices(req: Request, res: Response) { // exclude current
        const refreshToken = req.cookies.refreshToken
        const result = await this.jwtService.verifyRefreshToken(refreshToken) as JwtPayload

        if (!result) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const isDeleted = await this.securityService.removeAllSessions(result.userId, result.deviceId) // exclude current
        if (!isDeleted) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async deleteDeviceById(req: RequestWithParams<{ deviceId: string }>, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const result = await this.jwtService.verifyRefreshToken(refreshToken) as JwtPayload
        if (!result) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const deletingDevice = await deviceQueryRepository.getDeviceByDeviceId(req.params.deviceId)

        if (!deletingDevice) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        if (result.userId !== deletingDevice.userInfo.userId) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

        await this.securityService.deleteDevice(req.params.deviceId)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}

const securityController = new SecurityController()

securityRouter.get('/devices', securityController.getDevices.bind(securityController))

securityRouter.delete('/devices', securityController.deleteDevices.bind(securityController))

securityRouter.delete('/devices/:deviceId', securityController.deleteDeviceById.bind(securityController))