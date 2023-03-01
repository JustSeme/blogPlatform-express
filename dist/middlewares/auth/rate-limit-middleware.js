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
exports.rateLimitMiddleware = void 0;
const app_1 = require("../../app");
const attempts_db_repository_1 = require("../../repositories/attempts-db-repository");
const rateLimitMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const interval = 10 * 1000;
    const clientIp = req.ip;
    const requestedUrl = req.url;
    const currentDate = new Date();
    const lastAttemptDate = new Date(currentDate.getTime() - interval);
    const attemptsCount = yield attempts_db_repository_1.attemptsRepository.getAttemptsCountPerTime(clientIp, requestedUrl, lastAttemptDate);
    if (attemptsCount > 5) {
        res.sendStatus(app_1.HTTP_STATUSES.TOO_MANY_REQUESTS_429);
        return;
    }
    next();
});
exports.rateLimitMiddleware = rateLimitMiddleware;
//# sourceMappingURL=rate-limit-middleware.js.map