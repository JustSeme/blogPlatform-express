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
exports.emailAdapter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const settings_1 = require("../settings");
exports.emailAdapter = {
    sendConfirmationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let transport = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: settings_1.settings.GMAIL_LOGIN,
                    pass: settings_1.settings.GMAIL_APP_PASSWORD,
                },
            });
            let info = yield transport.sendMail({
                from: `"Blog Platform" <${settings_1.settings.GMAIL_LOGIN}>`,
                to: email,
                subject: 'Confirmation Code',
                html: "here will be confirmation code",
            });
            return info.accepted.length > 0;
        });
    }
};
//# sourceMappingURL=emailAdapter.js.map