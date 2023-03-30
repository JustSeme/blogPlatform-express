"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = exports.UserDTO = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
class UserDTO {
    constructor(login, email, passwordHash, isConfirmed) {
        this.login = login;
        this.email = email;
        this.passwordHash = passwordHash;
        this.id = (0, uuid_1.v4)();
        this.createdAt = new Date().toISOString();
        this.emailConfirmation = {
            confirmationCode: (0, uuid_1.v4)(),
            expirationDate: (0, date_fns_1.add)(new Date(), {
                hours: 1,
                minutes: 3
            }),
            isConfirmed: isConfirmed
        };
        this.passwordRecovery = {
            confirmationCode: null,
            expirationDate: new Date()
        };
    }
}
exports.UserDTO = UserDTO;
const usersSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean
    },
    passwordRecovery: {
        confirmationCode: String,
        expirationDate: Date
    }
}, { autoCreate: false, autoIndex: false });
usersSchema.method('updateIsConfirmed', function updateIsConfirmed(code) {
    const that = this;
    if (that.emailConfirmation.isConfirmed)
        return false;
    if (that.emailConfirmation.confirmationCode !== code)
        return false;
    if (that.emailConfirmation.expirationDate < new Date())
        return false;
    that.emailConfirmation.isConfirmed = true;
    return true;
});
usersSchema.static('makeInstance', function makeInstance(login, email, passwordHash, isConfirmed) {
    const userDTO = new UserDTO(login, email, passwordHash, isConfirmed);
    return new exports.UsersModel(userDTO);
});
exports.UsersModel = mongoose_1.default.model('users', usersSchema);
//# sourceMappingURL=UsersEntity.js.map