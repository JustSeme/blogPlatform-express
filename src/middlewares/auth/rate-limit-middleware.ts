import { add } from "date-fns";
import { Response, Request, NextFunction } from "express";
import { HTTP_STATUSES } from "../../app";
import { attemptsRepository } from "../../repositories/attempts-db-repository";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const interval = 10 * 1000
    const clientIp = req.ip
    const requestedUrl = req.url
    const currentDate = new Date()
    const lastAttemptDate = new Date(currentDate.getTime() - interval)

    const attemptsCount = await attemptsRepository.getAttemptsCountPerTime(clientIp, requestedUrl, lastAttemptDate)
    
    if(attemptsCount > 5) {
        res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
        return
    }

    next()
}