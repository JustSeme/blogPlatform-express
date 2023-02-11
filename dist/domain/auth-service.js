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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const users_db_repository_1 = require("../repositories/users-db-repository");
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const emailManager_1 = require("../managers/emailManager");
exports.authService = {
    createUser(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield bcrypt_1.default.hash(password, 10);
            const newUser = {
                id: (0, crypto_1.randomUUID)(),
                login: login,
                email: email,
                passwordHash,
                createdAt: new Date().toISOString(),
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        hours: 1,
                        minutes: 3
                    }),
                    isConfirmed: false
                }
            };
            yield users_db_repository_1.usersRepository.createUser(newUser);
            const displayedUser = {
                id: newUser.id,
                login: newUser.login,
                email: newUser.email,
                createdAt: newUser.createdAt
            };
            try {
                emailManager_1.emailManager.sendConfirmationCode(email, login, newUser.emailConfirmation.confirmationCode);
            }
            catch (error) {
                console.error(error);
                users_db_repository_1.usersRepository.deleteUser(newUser.id);
                return null;
            }
            return displayedUser;
        });
    },
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.usersRepository.findUserByConfirmationCode(code);
            if (!user) {
                return false;
            }
            if (user.emailConfirmation.expirationDate > new Date() && user.emailConfirmation.confirmationCode === code) {
                return yield users_db_repository_1.usersRepository.updateConfirmation(user.id);
            }
            return false;
        });
    },
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.usersRepository.findUserByLoginOrEmail(loginOrEmail);
            if (!user)
                return false;
            const isConfirmed = yield bcrypt_1.default.compare(password, user.passwordHash);
            if (isConfirmed) {
                return user;
            }
        });
    },
    deleteUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId) {
                return yield users_db_repository_1.usersRepository.deleteUser(userId);
            }
            return yield users_db_repository_1.usersRepository.deleteUsers();
        });
    }
};
//# sourceMappingURL=auth-service.js.map