import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from '../settings'
import { JwtService } from "../application/jwtService";
import { AuthService } from "../domain/auth-service";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { rateLimitMiddleware } from "../middlewares/auth/rate-limit-middleware";
import { inputValidationMiddleware } from "../middlewares/validations/input-validation-middleware";
import { LoginInputModel } from "../models/auth/LoginInputModel";
import { MeOutputModel } from "../models/auth/MeOutputModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { UserInputModel } from "../models/users/UserInputModel";
import { usersQueryRepository } from "../repositories/query/users-query-repository";
import { RequestWithBody } from "../types/types";
import { emailValidationWithCustomSearch, loginValidation, passwordValidation } from "./users-router";

export const authRouter = Router({})

const loginOrEmailValidation = body('loginOrEmail')
    .exists()
    .trim()
    .notEmpty()
    .isString()

const emailValidation = body('email')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

const newPasswordValidation = body('newPassword')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 6, max: 20 })

/* Напиши тесты */

class AuthController {
    private jwtService: JwtService
    private authService: AuthService

    constructor() {
        this.jwtService = new JwtService()
        this.authService = new AuthService()
    }

    async login(req: RequestWithBody<LoginInputModel>, res: Response<ErrorMessagesOutputModel | { accessToken: string }>) {
        const user = await this.authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        const deviceName = req.headers["user-agent"] || 'undefined'
        const pairOfTokens = await this.jwtService.login(user.id, req.ip, deviceName)
        if (!pairOfTokens) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }

        res.cookie('refreshToken', pairOfTokens.refreshToken, { httpOnly: true, secure: true });
        res.send({
            accessToken: pairOfTokens.accessToken
        })
    }

    async refreshTokens(req: Request, res: Response<{ accessToken: string }>) {
        const refreshToken = req.cookies.refreshToken

        const newTokens = await this.jwtService.refreshTokens(refreshToken)
        if (!newTokens) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        res.cookie('refreshToken', newTokens.newRefreshToken, { httpOnly: true, secure: true })
        res.send({
            accessToken: newTokens.newAccessToken
        })
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const isLogout = this.jwtService.logout(refreshToken)
        if (!isLogout) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async registration(req: RequestWithBody<UserInputModel>, res: Response<ErrorMessagesOutputModel>) {
        const isCreated = await this.authService.createUser(req.body.login, req.body.password, req.body.email)
        if (!isCreated) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async registrationConfirm(req: RequestWithBody<{ code: string }>, res: Response<ErrorMessagesOutputModel>) {
        const isConfirmed = await this.authService.confirmEmail(req.body.code)
        if (!isConfirmed) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .send({
                    errorsMessages: [{
                        message: 'The confirmation code is incorrect, expired or already been applied',
                        field: 'code'
                    }]
                })
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async resendEmail(req: RequestWithBody<{ email: string }>, res: Response<ErrorMessagesOutputModel>) {
        const result = await this.authService.resendConfirmationCode(req.body.email)
        if (!result) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .send({
                    errorsMessages: [{
                        message: 'Your email is already confirmed or doesnt exist',
                        field: 'email'
                    }]
                })
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async recoveryPassword(req: RequestWithBody<{ email: string }>, res: Response) {
        const isRecovering = await this.authService.sendPasswordRecoveryCode(req.body.email)
        if (!isRecovering) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async generateNewPassword(req: RequestWithBody<{ newPassword: string, recoveryCode: string }>, res: Response) {
        const user = await usersQueryRepository.findUserByRecoveryPasswordCode(req.body.recoveryCode)
        if (!user || user.passwordRecovery.expirationDate < new Date()) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400)
                .send({
                    errorsMessages: [{ message: 'recoveryCode is incorrect', field: 'recoveryCode' }]
                })
            return
        }

        const isConfirmed = await this.authService.confirmRecoveryPassword(user.id, req.body.newPassword)
        if (!isConfirmed) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async sendUserInfo(req: Request, res: Response<MeOutputModel>) {
        const accessToken = req.cookies('accessToken')
        const userId = await this.jwtService.getUserIdByToken(accessToken)
        const user = await usersQueryRepository.findUserById(userId)
        res.send({
            email: user!.email,
            login: user!.login,
            userId: user!.id
        })
    }
}

const authController = new AuthController()

authRouter.post('/login',
    rateLimitMiddleware,
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware,
    authController.login.bind(authController))

authRouter.post('/refresh-token', authController.refreshTokens.bind(authController))

authRouter.post('/logout', authController.logout.bind(authController))

authRouter.post('/registration',
    rateLimitMiddleware,
    loginValidation,
    passwordValidation,
    emailValidationWithCustomSearch,
    inputValidationMiddleware,
    authController.registration.bind(authController))

authRouter.post('/registration-confirmation',
    rateLimitMiddleware,
    authController.registrationConfirm.bind(authController))

authRouter.post('/registration-email-resending',
    rateLimitMiddleware,
    emailValidation,
    inputValidationMiddleware,
    authController.resendEmail.bind(authController))

authRouter.post('/password-recovery',
    rateLimitMiddleware,
    emailValidation,
    inputValidationMiddleware,
    authController.recoveryPassword.bind(authController))

authRouter.post('/new-password',
    rateLimitMiddleware,
    newPasswordValidation,
    inputValidationMiddleware,
    authController.generateNewPassword.bind(authController))

authRouter.get('/me',
    authMiddleware,
    authController.sendUserInfo.bind(authController))