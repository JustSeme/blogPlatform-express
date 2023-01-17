import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/src/validation-result";
import { HTTP_STATUSES } from "../app";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped()

        const errorsMessages = Object.keys(errorsObj).map(key => {
            return {
                message: errorsObj[key].msg,
                field: key
            }
        });
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: errorsMessages });
        return
    }
    next()
}