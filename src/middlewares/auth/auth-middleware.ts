import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../../app";
import { jwtService } from "../../application/jwtService";
import { usersQueryRepository } from "../../repositories/query/users-query-repository";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    
    const token = req.headers.authorization.split(' ')[1]
    
    const userId = await jwtService.getUserIdByToken(token)
    if(!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }

    req.user = await usersQueryRepository.findUserById(userId)
    next()
}