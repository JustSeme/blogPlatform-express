import { Response, Router } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { usersService } from "../domain/users-service";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { LoginInputModel } from "../models/auth/LoginInputModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { RequestWithBody } from "../types";

export const authRouter = Router({})

const loginOrEmailValidation = body('loginOrEmail')
.exists()
.trim()
.notEmpty()
.isString()

const passwordValidation = body('password')
.exists()
.trim()
.notEmpty()
.isString()

authRouter.post('/login',
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<LoginInputModel>, res: Response<ErrorMessagesOutputModel>) => {
        const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if(!checkResult) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})