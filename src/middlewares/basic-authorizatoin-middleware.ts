import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../app";

export const basicAuthorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authStr = btoa('admin:qwerty')
    if(req.headers.authorization !== `Basic ${authStr}`) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    next()
}