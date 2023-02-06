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
exports.commentIdValidationMiddleware = void 0;
const app_1 = require("../app");
const comments_query_repository_1 = require("../repositories/query/comments-query-repository");
const commentIdValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const findedComment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.commentId);
    if (!findedComment) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    next();
});
exports.commentIdValidationMiddleware = commentIdValidationMiddleware;
//# sourceMappingURL=commentId-validation-middleware.js.map