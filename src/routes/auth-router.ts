import { Router } from "express";
import { body } from "express-validator";
import { container } from "../composition-root";
import { AuthController } from "../controllers/auth-controller";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { rateLimitMiddleware } from "../middlewares/auth/rate-limit-middleware";
import { inputValidationMiddleware } from "../middlewares/validations/input-validation-middleware";
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

const authController = container.resolve<AuthController>(AuthController)

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