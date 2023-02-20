import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../../app";

export const basicAuthorizationMiddleware = (req: Request<any, any, any, any>, res: Response<any, any>, next: NextFunction) => {
    const authStr = btoa('admin:qwerty')
    if(req.headers.authorization !== `Basic ${authStr}`) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    next()
}