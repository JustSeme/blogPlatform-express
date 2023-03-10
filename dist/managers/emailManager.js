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
exports.emailManager = void 0;
const emailAdapter_1 = require("../adapters/emailAdapter");
exports.emailManager = {
    sendConfirmationCode(recipientEmail, recipientLogin, confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageBody = `
        <h1>Hello, dear ${recipientLogin}! Welcome to the Blog Platform!</h1>
        <div>
            <p>To continue registration, </p><a href='https://some-front.com/confirm-registration?code=${confirmationCode}'>click here</a>
        </div>
        `;
            return emailAdapter_1.emailAdapter.sendEmail(recipientEmail, 'ConfirmationCode', messageBody);
        });
    },
    sendPasswordRecoveryCode(recipientEmail, recipientLogin, confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('manager');
            const messageBody = `
            <h1>${recipientLogin}, we revice notification, that you want to recover your password</h1>
            <div>
                <b>If you haven't tried to recover your password, ignore this message!</b>
                <p>To continue password recovering, </p><a href='https://somesite.com/password-recovery?recoveryCode=${confirmationCode}'>click here</a>
            </div>
        `;
            return emailAdapter_1.emailAdapter.sendEmail(recipientEmail, 'Recovery Password', messageBody);
        });
    }
};
//# sourceMappingURL=emailManager.js.map