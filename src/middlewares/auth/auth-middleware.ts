import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../../settings"
import { JwtService } from "../../application/jwtService";

class AuthMiddleware {
    private jwtService: JwtService

    constructor() {
        this.jwtService = new JwtService()
    }

    async authMiddleware(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const token = req.headers.authorization.split(' ')[1]

        const userId = await this.jwtService.getUserIdByToken(token)

        if (!userId) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        next()
    }
}

export const authMiddleware = new AuthMiddleware().authMiddleware