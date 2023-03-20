"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.AuthController = void 0;
const settings_1 = require("../settings");
const jwtService_1 = require("../application/jwtService");
const auth_service_1 = require("../domain/auth-service");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
const injectable_1 = require("inversify/lib/annotation/injectable");
let AuthController = class AuthController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authService.checkCredentials(req.body.loginOrEmail, req.body.password);
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
            const isCreated = yield this.authService.createUser(req.body.login, req.body.password, req.body.email);
            if (!isCreated) {
                res.sendStatus(settings_1.HTTP_STATUSES.BAD_REQUEST_400);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    registrationConfirm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isConfirmed = yield this.authService.confirmEmail(req.body.code);
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
            const result = yield this.authService.resendConfirmationCode(req.body.email);
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
            const isRecovering = yield this.authService.sendPasswordRecoveryCode(req.body.email);
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
            const isConfirmed = yield this.authService.confirmRecoveryPassword(user.id, req.body.newPassword);
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
};
AuthController = __decorate([
    (0, injectable_1.injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService, jwtService_1.JwtService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth-controller.js.map