import { Request, Response, Router } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUSES } from "../app";
import { jwtService } from "../application/jwtService";
import { securityService } from "../domain/security-service";
import { DeviceSessionsViewModel } from "../models/devices/DeviceSessionsViewModel";
import { deviceQueryRepository } from "../repositories/query/device-query-repository";
import { RequestWithQuery } from "../types/types";

export const securityRouter = Router({})

securityRouter.get('/devices', 
    async (req: Request, res: Response<DeviceSessionsViewModel[]>) => {
        const refreshToken = req.cookies.refreshToken
        const result = await jwtService.verifyToken(refreshToken) as JwtPayload
        if(!result) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const activeDevicesForUser = await securityService.getActiveDevicesForUser(result.userId)
        if(!activeDevicesForUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404) 
            return
        }

        res.send(activeDevicesForUser)
})

securityRouter.delete('/devices', 
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const result = await jwtService.verifyToken(refreshToken) as JwtPayload
        if(!result) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const isDeleted = await securityService.removeAllSessions(result.userId, result.deviceId)
        if(!isDeleted) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

securityRouter.delete('/devices/:deviceId',
    async (req: RequestWithQuery<{deviceId: string}>, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const result = await jwtService.verifyToken(refreshToken) as JwtPayload
        if(!result) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const deletingDevice = await deviceQueryRepository.getDeviceByDeviceId(req.query.deviceId)
        if(!deletingDevice || !req.query.deviceId) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const devicesForCurrentUser = await securityService.getActiveDevicesForUser(result.userId)
        const currentDevice = devicesForCurrentUser?.find(device => device.deviceId === req.query.deviceId)
        if(!currentDevice) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

        const isDeleted = await securityService.deleteDevice(req.query.deviceId)
        if(!isDeleted) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })