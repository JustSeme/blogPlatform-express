"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UsersRepository = void 0;
const date_fns_1 = require("date-fns");
const inversify_1 = require("inversify");
const db_1 = require("../../../repositories/db");
//transaction script
let UsersRepository = class UsersRepository {
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new db_1.UsersModel(newUser).save();
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedUser = db_1.UsersModel.find({ id });
            const result = yield deletedUser.deleteOne();
            return result.deletedCount === 1;
        });
    }
    updateIsConfirmed(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.UsersModel.updateOne({ id: id }, { $set: { 'emailConfirmation.isConfirmed': true } });
            return result.matchedCount === 1;
        });
    }
    updateEmailConfirmationInfo(id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.UsersModel.updateOne({ id: id }, {
                $set: {
                    'emailConfirmation.confirmationCode': code,
                    'emailConfirmation.expirationDate': (0, date_fns_1.add)(new Date(), {
                        hours: 1,
                        minutes: 3
                    })
                }
            });
            return result.matchedCount === 1;
        });
    }
    updatePasswordConfirmationInfo(id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.UsersModel.updateOne({ id: id }, {
                $set: {
                    'passwordRecovery.confirmationCode': code,
                    'passwordRecovery.expirationDate': (0, date_fns_1.add)(new Date(), {
                        hours: 1,
                        minutes: 3
                    })
                }
            });
            return result.matchedCount === 1;
        });
    }
    updateUserPassword(id, newPasswordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.UsersModel.updateOne({ id: id }, {
                $set: {
                    'passwordHash': newPasswordHash,
                    'passwordRecovery.confirmationCode': null
                }
            });
            return result.matchedCount === 1;
        });
    }
    findUserByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.UsersModel.findOne({ 'emailConfirmation.confirmationCode': code });
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.UsersModel.findOne({ email: email });
        });
    }
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.UsersModel.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.UsersModel.findOne({ id: userId }, { _id: 0, __v: 0 });
        });
    }
};
UsersRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersRepository);
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=users-db-repository.js.map