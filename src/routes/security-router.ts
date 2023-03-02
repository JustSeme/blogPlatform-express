import { Request, Response, Router } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUSES } from "../app";
import { jwtService } from "../application/jwtService";
import { securityService } from "../domain/security-service";
import { DeviceSessionsViewModel } from "../models/devices/DeviceSessionsViewModel";
import { deviceQueryRepository } from "../repositories/query/device-query-repository";
import { RequestWithParams } from "../types/types";

export const securityRouter = Router({})

securityRouter.get('/devices', 
    async (req: Request, res: Response<DeviceSessionsViewModel[]>) => {
        if(!req.body) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }
        if(!req.cookies) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }
        const refreshToken = req.cookies?.refreshToken
        
        const result = await jwtService.verifyToken(refreshToken) as JwtPayload
        console.log('route', req.cookies);
        
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
    async (req: RequestWithParams<{deviceId: string}>, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const result = await jwtService.verifyToken(refreshToken) as JwtPayload
        if(!result) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const deletingDevice = await deviceQueryRepository.getDeviceByDeviceId(req.params.deviceId)
        
        if(!deletingDevice) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        if(result.userId !== deletingDevice.userInfo.userId){
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

        await securityService.deleteDevice(req.params.deviceId)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })