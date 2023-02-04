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
const app_1 = require("../app");
const comments_query_repository_1 = require("../repositories/query/comments-query-repository");
const ownershipValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const findedComment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.commentId);
    const commentOwnerId = findedComment === null || findedComment === void 0 ? void 0 : findedComment.commentatorInfo.userId;
    if (commentOwnerId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        res.sendStatus(app_1.HTTP_STATUSES.FORBIDDEN_403);
        return;
    }
    next();
});
exports.ownershipValidationMiddleware = ownershipValidationMiddleware;
//# sourceMappingURL=ownership-validation-middleware.js.map