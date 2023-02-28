import { Request, Response, Router } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUSES } from "../app";
import { jwtService } from "../application/jwtService";
import { securityService } from "../domain/security-service";
import { DeviceSessionsViewModel } from "../models/devices/DeviceSessionsViewModel";

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