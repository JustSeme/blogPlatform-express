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
exports.UsersModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
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
    return __awaiter(this, void 0, void 0, function* () {
        if (this.emailConfirmation.isConfirmed)
            return false;
        if (this.emailConfirmation.confirmationCode !== code)
            return false;
        if (this.emailConfirmation.expirationDate < new Date())
            return false;
        this.emailConfirmation.isConfirmed = true;
        yield this.save();
        return true;
    });
});
exports.UsersModel = mongoose_1.default.model('users', usersSchema);
//# sourceMappingURL=usersModel.js.map