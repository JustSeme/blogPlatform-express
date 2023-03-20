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
exports.authMiddleware = void 0;
const jwtService_1 = require("../../application/jwtService");
const composition_root_1 = require("../../composition-root");
const settings_1 = require("../../settings");
const jwtService = composition_root_1.container.resolve(jwtService_1.JwtService);
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.sendStatus(settings_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwtService.getUserIdByToken(token);
    if (!userId) {
        res.sendStatus(settings_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    next();
});
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth-middleware.js.map