"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.CommentsRepository = void 0;
const db_1 = require("./db");
const injectable_1 = require("inversify/lib/annotation/injectable");
let CommentsRepository = class CommentsRepository {
    createComment(createdComment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.CommentsModel.create(createdComment);
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.CommentsModel.deleteOne({ id: commentId });
            return result.deletedCount === 1;
        });
    }
    updateComment(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.CommentsModel.updateOne({ id: commentId }, { content: content });
            return result.matchedCount === 1;
        });
    }
    getComments(queryParams, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = queryParams;
            const filter = {
                postId: postId
            };
            const totalCount = yield db_1.CommentsModel.count(filter);
            const pagesCount = Math.ceil(totalCount / +pageSize);
            const skipCount = (+pageNumber - 1) * +pageSize;
            const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1;
            let resultedComments = yield db_1.CommentsModel.find(filter, { _id: 0, postId: 0, __v: 0 }).skip(skipCount).limit(+pageSize).sort({ [sortBy]: sortDirectionNumber }).lean();
            return {
                pagesCount: pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: totalCount,
                items: resultedComments
            };
        });
    }
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.CommentsModel.findOne({ id: commentId }).lean();
        });
    }
    setLike(likeData, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likedComment = yield db_1.CommentsModel.findOne({ id: commentId });
            if (!likedComment)
                return false;
            likedComment.likesInfo.likes.push(likeData);
            yield likedComment.save();
            return true;
        });
    }
    setDislike(likeData, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dislikedComment = yield db_1.CommentsModel.findOne({ id: commentId });
            if (!dislikedComment)
                return false;
            dislikedComment.likesInfo.dislikes.push(likeData);
            yield dislikedComment.save();
            return true;
        });
    }
    setNoneLike(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const editableComment = yield db_1.CommentsModel.findOne({ id: commentId });
            if (!editableComment)
                return false;
            const likeIndex = editableComment.likesInfo.likes.findIndex((like) => like.userId === userId);
            const dislikeIndex = editableComment.likesInfo.dislikes.findIndex((dislike) => dislike.userId === userId);
            if (likeIndex > -1) {
                editableComment.likesInfo.likes.splice(likeIndex, 1);
                yield editableComment.save();
                return true;
            }
            if (dislikeIndex > -1) {
                editableComment.likesInfo.dislikes.splice(dislikeIndex, 1);
                yield editableComment.save();
                return true;
            }
        });
    }
};
CommentsRepository = __decorate([
    (0, injectable_1.injectable)()
], CommentsRepository);
exports.CommentsRepository = CommentsRepository;
//# sourceMappingURL=comments-db-repository.js.map