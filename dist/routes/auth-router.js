"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const composition_root_1 = require("../composition-root");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const rate_limit_middleware_1 = require("../middlewares/auth/rate-limit-middleware");
const input_validation_middleware_1 = require("../middlewares/validations/input-validation-middleware");
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
exports.authRouter.post('/login', rate_limit_middleware_1.rateLimitMiddleware, loginOrEmailValidation, users_router_1.passwordValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.authController.login.bind(composition_root_1.authController));
exports.authRouter.post('/refresh-token', composition_root_1.authController.refreshTokens.bind(composition_root_1.authController));
exports.authRouter.post('/logout', composition_root_1.authController.logout.bind(composition_root_1.authController));
exports.authRouter.post('/registration', rate_limit_middleware_1.rateLimitMiddleware, users_router_1.loginValidation, users_router_1.passwordValidation, users_router_1.emailValidationWithCustomSearch, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.authController.registration.bind(composition_root_1.authController));
exports.authRouter.post('/registration-confirmation', rate_limit_middleware_1.rateLimitMiddleware, composition_root_1.authController.registrationConfirm.bind(composition_root_1.authController));
exports.authRouter.post('/registration-email-resending', rate_limit_middleware_1.rateLimitMiddleware, emailValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.authController.resendEmail.bind(composition_root_1.authController));
exports.authRouter.post('/password-recovery', rate_limit_middleware_1.rateLimitMiddleware, emailValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.authController.recoveryPassword.bind(composition_root_1.authController));
exports.authRouter.post('/new-password', rate_limit_middleware_1.rateLimitMiddleware, newPasswordValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.authController.generateNewPassword.bind(composition_root_1.authController));
exports.authRouter.get('/me', auth_middleware_1.authMiddleware, composition_root_1.authController.sendUserInfo.bind(composition_root_1.authController));
//# sourceMappingURL=auth-router.js.map