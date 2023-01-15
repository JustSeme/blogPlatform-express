import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/src/validation-result";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map(el => {
            return {
                message: el.msg,
                field: el.param
            }
        });
        res.status(400).json({ errorsMessages: errorsMessages });
        return
    }
    next()
}