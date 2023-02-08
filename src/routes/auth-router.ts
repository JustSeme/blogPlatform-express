import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { jwtService } from "../application/jwtService";
import { usersService } from "../domain/users-service";
import { authMiddleware } from "../middlewares/auth-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { LoginInputModel } from "../models/auth/LoginInputModel";
import { MeOutputModel } from "../models/auth/MeOutputModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { UserDBModel } from "../models/users/UserDBModel";
import { UserInputModel } from "../models/users/UserInputModel";
import { RequestWithBody } from "../types/types";
import { emailValidation, loginValidation } from "./users-router";

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
    async (req: RequestWithBody<LoginInputModel>, res: Response<ErrorMessagesOutputModel | {accessToken: string}>) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if(!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }
        
        const jwtTokenObj = await jwtService.createJWT(user)
        res.send(jwtTokenObj)
})

authRouter.post('/registration',
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<UserInputModel>, res: Response<ErrorMessagesOutputModel | any>) => {
        
    })

authRouter.get('/me', 
    authMiddleware,
    (req: Request, res: Response<MeOutputModel>) => {
        const user: UserDBModel = req.user!
        res.send({
            email: user.email,
            login: user.login,
            userId: user.id
        })
})