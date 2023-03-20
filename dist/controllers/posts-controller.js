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
exports.PostsController = void 0;
const users_query_repository_1 = require("../repositories/query/users-query-repository");
const settings_1 = require("../settings");
const posts_query_repository_1 = require("../repositories/query/posts-query-repository");
class PostsController {
    constructor(jwtService, postsService, commentsService) {
        this.jwtService = jwtService;
        this.postsService = postsService;
        this.commentsService = commentsService;
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedPosts = yield posts_query_repository_1.postsQueryRepository.findPosts(req.query, null);
            if (!findedPosts.items.length) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.json(findedPosts);
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedPosts = yield posts_query_repository_1.postsQueryRepository.findPostById(req.params.id);
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
}
exports.PostsController = PostsController;
//# sourceMappingURL=posts-controller.js.map