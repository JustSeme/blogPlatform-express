import { Response, Request, NextFunction } from "express";
import { HTTP_STATUSES } from "../../app";
import { usersQueryRepository } from "../../repositories/query/users-query-repository";

export const registrationCountValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip

    const registrationCountPerFiveMinutes = await usersQueryRepository.getRegistrationsCount(clientIp, 5)
    
    if(registrationCountPerFiveMinutes > 5) {
        res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
        return
    }
    next()
}