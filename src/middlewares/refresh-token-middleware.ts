import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../app"
import { jwtService } from "../application/jwtService"


export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.headers["set-cookie"]
    if(!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const newRefreshTokenAndUserId = await jwtService.refreshToken(refreshToken[0])
    if(!newRefreshTokenAndUserId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    //@ts-ignore
    req.userId = newRefreshTokenAndUserId.userId
    res.cookie('refreshToken', newRefreshTokenAndUserId.newRefreshToken, { httpOnly: true, secure: true});
    next()
}