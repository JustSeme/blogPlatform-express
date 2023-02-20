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
exports.postIdValidationMiddleware = void 0;
const app_1 = require("../../app");
const posts_query_repository_1 = require("../../repositories/query/posts-query-repository");
const postIdValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentedPost = yield posts_query_repository_1.postsQueryRepository.findPostById(req.params.postId);
    if (!commentedPost) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    next();
});
exports.postIdValidationMiddleware = postIdValidationMiddleware;
//# sourceMappingURL=postId-validation-middleware.js.map