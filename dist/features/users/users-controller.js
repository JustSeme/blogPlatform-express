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
exports.UsersController = void 0;
const injectable_1 = require("inversify/lib/annotation/injectable");
const auth_service_1 = require("../../domain/auth-service");
const users_query_repository_1 = require("../../repositories/query/users-query-repository");
const settings_1 = require("../../settings");
let UsersController = class UsersController {
    constructor(authService) {
        this.authService = authService;
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = yield this.authService.createUserWithBasicAuth(req.body.login, req.body.password, req.body.email);
            if (!createdUser) {
                res.sendStatus(settings_1.HTTP_STATUSES.BAD_REQUEST_400);
                return;
            }
            res.status(settings_1.HTTP_STATUSES.CREATED_201).send(createdUser);
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedUsers = yield users_query_repository_1.usersQueryRepository.findUsers(req.query);
            res.send(findedUsers);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield this.authService.deleteUsers(req.params.id);
            if (!isDeleted) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
};
UsersController = __decorate([
    (0, injectable_1.injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users-controller.js.map