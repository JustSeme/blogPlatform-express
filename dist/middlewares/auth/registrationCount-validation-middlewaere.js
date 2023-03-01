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
exports.registrationCountValidationMiddleware = void 0;
const app_1 = require("../../app");
const users_query_repository_1 = require("../../repositories/query/users-query-repository");
const registrationCountValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const clientIp = req.ip;
    const registrationCountPerFiveMinutes = yield users_query_repository_1.usersQueryRepository.getRegistrationsCount(clientIp, 100);
    if (registrationCountPerFiveMinutes > 5) {
        res.sendStatus(app_1.HTTP_STATUSES.TOO_MANY_REQUESTS_429);
        return;
    }
    next();
});
exports.registrationCountValidationMiddleware = registrationCountValidationMiddleware;
//# sourceMappingURL=registrationCount-validation-middlewaere.js.map