"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const settings_1 = require("../settings");
const jwtService_1 = require("../application/jwtService");
const auth_service_1 = require("../domain/auth-service");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const rate_limit_middleware_1 = require("../middlewares/auth/rate-limit-middleware");
const input_validation_middleware_1 = require("../middlewares/validations/input-validation-middleware");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
const users_router_1 = require("./users-router");
exports.authRouter = (0, express_1.Router)({});
const loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail')
    .exists()
    .trim()
    .notEmpty()
    .isString();
const emailValidation = (0, express_validator_1.body)('email')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
const newPasswordValidation = (0, express_validator_1.body)('newPassword')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 6, max: 20 });
/* Напиши тесты */
class AuthController {
    constructor() {
        this.jwtService = new jwtService_1.JwtService();
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_service_1.authService.checkCredentials(req.body.loginOrEmail, req.body.password);
            if (!user) {
                res.sendStatus(settings_1.HTTP_STATUSES.UNAUTHORIZED_401);
                return;
            }
            const deviceName = req.headers["user-agent"] || 'undefined';
            const pairOfTokens = yield this.jwtService.login(user.id, req.ip, deviceName);
            if (!pairOfTokens) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_IMPLEMENTED_501);
                return;
            }
            res.cookie('refreshToken', pairOfTokens.refreshToken, { httpOnly: true, secure: true });
            res.send({
                accessToken: pairOfTokens.accessToken
            });
        });
    }
    refreshTokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const newTokens = yield this.jwtService.refreshTokens(refreshToken);
            if (!newTokens) {
                res.sendStatus(settings_1.HTTP_STATUSES.UNAUTHORIZED_401);
                return;
            }
            res.cookie('refreshToken', newTokens.newRefreshToken, { httpOnly: true, secure: true });
            res.send({
                accessToken: newTokens.newAccessToken
            });
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const isLogout = this.jwtService.logout(refreshToken);
            if (!isLogout) {
                res.sendStatus(settings_1.HTTP_STATUSES.UNAUTHORIZED_401);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCreated = yield auth_service_1.authService.createUser(req.body.login, req.body.password, req.body.email);
            if (!isCreated) {
                res.sendStatus(settings_1.HTTP_STATUSES.BAD_REQUEST_400);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    registrationConfirm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isConfirmed = yield auth_service_1.authService.confirmEmail(req.body.code);
            if (!isConfirmed) {
                res
                    .status(settings_1.HTTP_STATUSES.BAD_REQUEST_400)
                    .send({
                    errorsMessages: [{
                            message: 'The confirmation code is incorrect, expired or already been applied',
                            field: 'code'
                        }]
                });
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    resendEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield auth_service_1.authService.resendConfirmationCode(req.body.email);
            if (!result) {
                res
                    .status(settings_1.HTTP_STATUSES.BAD_REQUEST_400)
                    .send({
                    errorsMessages: [{
                            message: 'Your email is already confirmed or doesnt exist',
                            field: 'email'
                        }]
                });
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    recoveryPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isRecovering = yield auth_service_1.authService.sendPasswordRecoveryCode(req.body.email);
            if (!isRecovering) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_IMPLEMENTED_501);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    generateNewPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepository.findUserByRecoveryPasswordCode(req.body.recoveryCode);
            if (!user || user.passwordRecovery.expirationDate < new Date()) {
                res.status(settings_1.HTTP_STATUSES.BAD_REQUEST_400)
                    .send({
                    errorsMessages: [{ message: 'recoveryCode is incorrect', field: 'recoveryCode' }]
                });
                return;
            }
            const isConfirmed = yield auth_service_1.authService.confirmRecoveryPassword(user.id, req.body.newPassword);
            if (!isConfirmed) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_IMPLEMENTED_501);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    sendUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = req.cookies('accessToken');
            const userId = yield this.jwtService.getUserIdByToken(accessToken);
            const user = yield users_query_repository_1.usersQueryRepository.findUserById(userId);
            res.send({
                email: user.email,
                login: user.login,
                userId: user.id
            });
        });
    }
}
const authController = new AuthController();
exports.authRouter.post('/login', rate_limit_middleware_1.rateLimitMiddleware, loginOrEmailValidation, users_router_1.passwordValidation, input_validation_middleware_1.inputValidationMiddleware, authController.login.bind(authController));
exports.authRouter.post('/refresh-token', authController.refreshTokens.bind(authController));
exports.authRouter.post('/logout', authController.logout.bind(authController));
exports.authRouter.post('/registration', rate_limit_middleware_1.rateLimitMiddleware, users_router_1.loginValidation, users_router_1.passwordValidation, users_router_1.emailValidationWithCustomSearch, input_validation_middleware_1.inputValidationMiddleware, authController.registration.bind(authController));
exports.authRouter.post('/registration-confirmation', rate_limit_middleware_1.rateLimitMiddleware, authController.registrationConfirm.bind(authController));
exports.authRouter.post('/registration-email-resending', rate_limit_middleware_1.rateLimitMiddleware, emailValidation, input_validation_middleware_1.inputValidationMiddleware, authController.resendEmail.bind(authController));
exports.authRouter.post('/password-recovery', rate_limit_middleware_1.rateLimitMiddleware, emailValidation, input_validation_middleware_1.inputValidationMiddleware, authController.recoveryPassword.bind(authController));
exports.authRouter.post('/new-password', rate_limit_middleware_1.rateLimitMiddleware, newPasswordValidation, input_validation_middleware_1.inputValidationMiddleware, authController.generateNewPassword.bind(authController));
exports.authRouter.get('/me', auth_middleware_1.authMiddleware, authController.sendUserInfo.bind(authController));
//# sourceMappingURL=auth-router.js.map