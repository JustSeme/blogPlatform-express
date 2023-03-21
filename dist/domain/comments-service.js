"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const injectable_1 = require("inversify/lib/annotation/injectable");
let CommentsService = class CommentsService {
    constructor(jwtService, commentsRepository) {
        this.jwtService = jwtService;
        this.commentsRepository = commentsRepository;
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
                createdAt: createdComment.createdAt,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
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
            const isNoneSetted = yield this.commentsRepository.setNoneLike(userId, commentId);
            if (status === 'Like') {
                return this.commentsRepository.setLike(likeData, commentId);
            }
            if (status === 'Dislike') {
                return this.commentsRepository.setDislike(likeData, commentId);
            }
            return isNoneSetted;
        });
    }
    getComments(queryParams, postId, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentsDBQueryData = yield this.commentsRepository.getComments(queryParams, postId);
            const commentsViewQueryData = Object.assign(Object.assign({}, commentsDBQueryData), { items: [] });
            const displayedComments = yield this.transformLikeInfo(commentsDBQueryData.items, accessToken);
            commentsViewQueryData.items = displayedComments;
            return commentsViewQueryData;
        });
    }
    getCommentById(commentId, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const recivedComment = yield this.commentsRepository.getCommentById(commentId);
            if (!recivedComment) {
                return false;
            }
            const displayedComment = yield this.transformLikeInfo([recivedComment], accessToken);
            return displayedComment[0];
        });
    }
    transformLikeInfo(commentsArray, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = null;
            if (accessToken) {
                const jwtResult = yield this.jwtService.verifyAccessToken(accessToken);
                userId = jwtResult ? jwtResult.userId : null;
            }
            const convertedComments = commentsArray.map((comment) => {
                const likesInfoData = comment.likesInfo;
                let myStatus = 'None';
                // check that comment was liked current user
                if (likesInfoData.likes.some((el) => el.userId === userId)) {
                    myStatus = 'Like';
                }
                //check that comment was disliked current user
                if (likesInfoData.dislikes.some((el) => el.userId === userId)) {
                    myStatus = 'Dislike';
                }
                const convertedComment = {
                    id: comment.id,
                    content: comment.content,
                    commentatorInfo: Object.assign({}, comment.commentatorInfo),
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: comment.likesInfo.likes.length,
                        dislikesCount: comment.likesInfo.dislikes.length,
                        myStatus: myStatus
                    }
                };
                return convertedComment;
            });
            return convertedComments;
        });
    }
};
CommentsService = __decorate([
    (0, injectable_1.injectable)(),
    __metadata("design:paramtypes", [jwtService_1.JwtService, comments_db_repository_1.CommentsRepository])
], CommentsService);
exports.CommentsService = CommentsService;
//# sourceMappingURL=comments-service.js.map