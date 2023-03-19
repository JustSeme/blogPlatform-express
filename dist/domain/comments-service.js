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
exports.CommentsService = void 0;
const jwtService_1 = require("../application/jwtService");
const CommentDBModel_1 = require("../models/comments/CommentDBModel");
const comments_db_repository_1 = require("../repositories/comments-db-repository");
class CommentsService {
    constructor() {
        this.commentsRepository = new comments_db_repository_1.CommentsRepository();
        this.jwtService = new jwtService_1.JwtService();
    }
    createComment(content, commentator, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!commentator) {
                return null;
            }
            const createdComment = new CommentDBModel_1.CommentDBModel(content, postId, commentator.id, commentator.login);
            yield this.commentsRepository.createComment(createdComment);
            return {
                id: createdComment.id,
                content: createdComment.content,
                commentatorInfo: Object.assign({}, createdComment.commentatorInfo),
                createdAt: createdComment.createdAt
            };
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.commentsRepository.deleteComment(commentId);
        });
    }
    updateComment(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.commentsRepository.updateComment(commentId, content);
        });
    }
    updateLike(accessToken, commentId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatingComment = yield this.commentsRepository.getCommentById(commentId);
            if (!updatingComment) {
                return false;
            }
            const jwtResult = yield this.jwtService.verifyAccessToken(accessToken);
            if (!jwtResult)
                return false;
            const userId = jwtResult.userId;
            const likeData = {
                userId,
                createdAt: new Date().toISOString()
            };
            if (status === 'Like') {
                const likesArray = updatingComment.likesInfo.likes;
                const isAlreadyLiked = likesArray.findIndex((like) => like.userId === userId) > 0;
                if (isAlreadyLiked)
                    return false;
                return this.commentsRepository.setLike(likeData, commentId);
            }
            if (status === 'Dislike') {
                const dislikesArray = updatingComment.likesInfo.dislikes;
                const isAlreadyDisliked = dislikesArray.findIndex((dislike) => dislike.userId === userId) > 0;
                if (isAlreadyDisliked)
                    return false;
                return this.commentsRepository.setDislike(likeData, commentId);
            }
            //Сделать чтобы если стоит лайк, то убирался дизлайк
            return this.commentsRepository.setNoneLike(userId, commentId);
        });
    }
}
exports.CommentsService = CommentsService;
//# sourceMappingURL=comments-service.js.map