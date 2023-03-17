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
exports.postContentValidation = exports.shortDescriptionValidation = exports.titleValidation = exports.postsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const settings_1 = require("../settings");
const input_validation_middleware_1 = require("../middlewares/validations/input-validation-middleware");
const basic_authorizatoin_middleware_1 = require("../middlewares/auth/basic-authorizatoin-middleware");
const posts_service_1 = require("../domain/posts-service");
const posts_query_repository_1 = require("../repositories/query/posts-query-repository");
const blogs_query_repository_1 = require("../repositories/query/blogs-query-repository");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const comments_service_1 = require("../domain/comments-service");
const postId_validation_middleware_1 = require("../middlewares/validations/postId-validation-middleware");
const comments_query_repository_1 = require("../repositories/query/comments-query-repository");
const comments_router_1 = require("./comments-router");
const jwtService_1 = require("../application/jwtService");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
exports.postsRouter = (0, express_1.Router)({});
exports.titleValidation = (0, express_validator_1.body)('title')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 30 });
exports.shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 });
exports.postContentValidation = (0, express_validator_1.body)('content')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 1000 });
const blogIdValidation = (0, express_validator_1.body)('blogId')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const findedBlog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(value);
    if (!findedBlog) {
        throw new Error('blog by blogId not found');
    }
    return true;
}))
    .isLength({ min: 1, max: 100 });
class PostsController {
    constructor() {
        this.jwtService = new jwtService_1.JwtService();
        this.postsService = new posts_service_1.PostsService();
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
            const findedComments = yield comments_query_repository_1.commentsQueryRepository.findComments(req.query, req.params.postId);
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
            const createdComment = yield comments_service_1.commentsService.createComment(req.body.content, commentator, req.params.postId);
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
const postsController = new PostsController();
exports.postsRouter.get('/', postsController.getPosts);
exports.postsRouter.get('/:id', postsController.getPostById);
exports.postsRouter.get('/:postId/comments', postId_validation_middleware_1.postIdValidationMiddleware, postsController.getCommentsForPost);
exports.postsRouter.post('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, exports.titleValidation, exports.shortDescriptionValidation, exports.postContentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, postsController.createPost.bind(postsController));
exports.postsRouter.post('/:postId/comments', auth_middleware_1.authMiddleware, postId_validation_middleware_1.postIdValidationMiddleware, comments_router_1.commentContentValidation, input_validation_middleware_1.inputValidationMiddleware, postsController.createCommentForPost);
exports.postsRouter.put('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, exports.titleValidation, exports.shortDescriptionValidation, exports.postContentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, postsController.updatePost);
exports.postsRouter.delete('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, postsController.deletePost);
//# sourceMappingURL=posts-router.js.map