import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../../app"
import { jwtService } from "../../application/jwtService"


export const refreshTokenValidation = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    
    if(!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const result = await jwtService.verifyToken(refreshToken)
    
    if(!result) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    next()
}