"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UsersTypes_1 = require("./UsersTypes");
const EmailConfirmationSchema_1 = require("./EmailConfirmationSchema");
const PasswordRecoverySchema_1 = require("./PasswordRecoverySchema");
const usersSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: EmailConfirmationSchema_1.EmailConfirmationSchema,
    passwordRecovery: PasswordRecoverySchema_1.PasswordRecoverySchema,
}, { autoCreate: false, autoIndex: false });
usersSchema.method('canBeConfirmed', function canBeConfirmed(code) {
    const that = this;
    if (that.emailConfirmation.isConfirmed)
        return false;
    if (that.emailConfirmation.confirmationCode !== code)
        return false;
    if (that.emailConfirmation.expirationDate < new Date())
        return false;
    return true;
});
usersSchema.method('updateIsConfirmed', function updateIsConfirmed(code) {
    const that = this;
    that.emailConfirmation.isConfirmed = true;
    return true;
});
usersSchema.static('makeInstance', function makeInstance(login, email, passwordHash, isConfirmed) {
    const userDTO = new UsersTypes_1.UserDTO(login, email, passwordHash, isConfirmed);
    return new exports.UsersModel(userDTO);
});
exports.UsersModel = mongoose_1.default.model('users', usersSchema);
//# sourceMappingURL=UsersSchema.js.map