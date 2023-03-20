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
exports.AuthService = void 0;
const UserDBModel_1 = require("../models/users/UserDBModel");
const uuid_1 = require("uuid");
const emailManager_1 = require("../managers/emailManager");
const bcryptAdapter_1 = require("../adapters/bcryptAdapter");
//transaction script
class AuthService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    createUser(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield bcryptAdapter_1.bcryptAdapter.generatePasswordHash(password, 10);
            const newUser = new UserDBModel_1.UserDBModel(login, email, passwordHash, false);
            this.usersRepository.createUser(newUser);
            yield emailManager_1.emailManager.sendConfirmationCode(email, login, newUser.emailConfirmation.confirmationCode);
            return true;
        });
    }
    createUserWithBasicAuth(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield bcryptAdapter_1.bcryptAdapter.generatePasswordHash(password, 10);
            const newUser = new UserDBModel_1.UserDBModel(login, email, passwordHash, true);
            yield this.usersRepository.createUser(newUser);
            const displayedUser = {
                id: newUser.id,
                login: newUser.login,
                email: newUser.email,
                createdAt: newUser.createdAt
            };
            return displayedUser;
        });
    }
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserByConfirmationCode(code);
            if (!user)
                return false;
            if (user.emailConfirmation.isConfirmed)
                return false;
            if (user.emailConfirmation.confirmationCode !== code)
                return false;
            if (user.emailConfirmation.expirationDate < new Date())
                return false;
            return yield this.usersRepository.updateIsConfirmed(user.id);
        });
    }
    resendConfirmationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserByEmail(email);
            if (!user || user.emailConfirmation.isConfirmed)
                return false;
            const newConfirmationCode = (0, uuid_1.v4)();
            yield this.usersRepository.updateEmailConfirmationInfo(user.id, newConfirmationCode);
            try {
                return yield emailManager_1.emailManager.sendConfirmationCode(email, user.login, newConfirmationCode);
            }
            catch (error) {
                console.error(error);
                this.usersRepository.deleteUser(user.id);
                return false;
            }
        });
    }
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
            if (!user)
                return false;
            if (!user.emailConfirmation.isConfirmed)
                return false;
            const isConfirmed = yield bcryptAdapter_1.bcryptAdapter.comparePassword(password, user.passwordHash);
            if (isConfirmed) {
                return user;
            }
        });
    }
    sendPasswordRecoveryCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserByEmail(email);
            if (!user) {
                return true;
            }
            const passwordRecoveryCode = (0, uuid_1.v4)();
            yield emailManager_1.emailManager.sendPasswordRecoveryCode(user.email, user.login, passwordRecoveryCode);
            const isUpdated = yield this.usersRepository.updatePasswordConfirmationInfo(user.id, passwordRecoveryCode);
            if (!isUpdated) {
                return false;
            }
            return true;
        });
    }
    confirmRecoveryPassword(userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPasswordHash = yield bcryptAdapter_1.bcryptAdapter.generatePasswordHash(newPassword, 10);
            return this.usersRepository.updateUserPassword(userId, newPasswordHash);
        });
    }
    deleteUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersRepository.deleteUser(userId);
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth-service.js.map