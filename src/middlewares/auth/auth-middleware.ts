import { NextFunction, Request, Response } from "express";
import { JwtService } from "../../application/jwtService";
import { container } from "../../composition-root";
import { HTTP_STATUSES } from "../../settings"

const jwtService = container.resolve<JwtService>(JwtService)

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)

    if (!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    next()
}