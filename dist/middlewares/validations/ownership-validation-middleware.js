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
exports.ownershipValidationMiddleware = void 0;
const settings_1 = require("../../settings");
const comments_query_repository_1 = require("../../repositories/query/comments-query-repository");
const composition_root_1 = require("../../composition-root");
const jwtService_1 = require("../../application/jwtService");
const jwtService = composition_root_1.container.resolve(jwtService_1.JwtService);
const ownershipValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const findedComment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.commentId);
    const commentOwnerId = findedComment === null || findedComment === void 0 ? void 0 : findedComment.commentatorInfo.userId;
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwtService.getUserIdByToken(token);
    if (commentOwnerId !== userId) {
        res.sendStatus(settings_1.HTTP_STATUSES.FORBIDDEN_403);
        return;
    }
    next();
});
exports.ownershipValidationMiddleware = ownershipValidationMiddleware;
//# sourceMappingURL=ownership-validation-middleware.js.map