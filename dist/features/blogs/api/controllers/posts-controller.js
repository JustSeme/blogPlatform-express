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
exports.PostsController = void 0;
const jwtService_1 = require("../../../../application/jwtService");
const users_query_repository_1 = require("../../../auth/infrastructure/users-query-repository");
const comments_service_1 = require("../../application/comments-service");
const settings_1 = require("../../../../settings");
const posts_service_1 = require("../../application/posts-service");
const injectable_1 = require("inversify/lib/annotation/injectable");
let PostsController = class PostsController {
    constructor(jwtService, postsService, commentsService) {
        this.jwtService = jwtService;
        this.postsService = postsService;
        this.commentsService = commentsService;
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
            const findedPosts = yield this.postsService.findPosts(req.query, null, accessToken);
            if (!findedPosts.items.length) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.json(findedPosts);
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
            const findedPosts = yield this.postsService.findPostById(req.params.id, accessToken);
            if (!findedPosts) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.json(findedPosts);
        });
    }
    getCommentsForPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
            const findedComments = yield this.commentsService.getComments(req.query, req.params.postId, accessToken);
            res.send(findedComments);
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPost = yield this.postsService.createPost(req.body, null);
            res
                .status(settings_1.HTTP_STATUSES.CREATED_201)
                .send(createdPost);
        });
    }
    createCommentForPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization.split(' ')[1];
            const userId = yield this.jwtService.getUserIdByToken(token);
            const commentator = yield users_query_repository_1.usersQueryRepository.findUserById(userId);
            const createdComment = yield this.commentsService.createComment(req.body.content, commentator, req.params.postId);
            if (!createdComment) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_IMPLEMENTED_501);
                return;
            }
            res
                .status(settings_1.HTTP_STATUSES.CREATED_201)
                .send(createdComment);
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield this.postsService.updatePost(req.params.id, req.body);
            if (!isUpdated) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield this.postsService.deletePosts(req.params.id);
            if (isDeleted) {
                res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
        });
    }
    updateLikeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = req.headers.authorization.split(' ')[1];
            const isUpdated = yield this.postsService.updateLike(accessToken, req.params.postId, req.body.likeStatus);
            if (!isUpdated) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_IMPLEMENTED_501);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
};
PostsController = __decorate([
    (0, injectable_1.injectable)(),
    __metadata("design:paramtypes", [jwtService_1.JwtService, posts_service_1.PostsService, comments_service_1.CommentsService])
], PostsController);
exports.PostsController = PostsController;
//# sourceMappingURL=posts-controller.js.map