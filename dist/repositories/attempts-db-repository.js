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
exports.attemptsRepository = void 0;
const db_1 = require("./db");
class AttemptsRepository {
    getAttemptsCount(clientIp, requestedUrl, lastAttemptDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.AttemptsModel.countDocuments({
                clientIp,
                requestedUrl,
                requestDate: {
                    $gt: lastAttemptDate
                }
            });
        });
    }
    insertAttempt(clientIp, requestedUrl, requestDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.AttemptsModel.create({ clientIp, requestedUrl, requestDate });
            return result ? true : false;
        });
    }
    removeAttempts(clientIp, requestedUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.AttemptsModel.deleteMany({ clientIp, requestedUrl });
            return result.deletedCount > 0;
        });
    }
}
exports.attemptsRepository = new AttemptsRepository();
//# sourceMappingURL=attempts-db-repository.js.map