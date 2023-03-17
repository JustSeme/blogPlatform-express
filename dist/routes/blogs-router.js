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
exports.blogsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const settings_1 = require("../settings");
const basic_authorizatoin_middleware_1 = require("../middlewares/auth/basic-authorizatoin-middleware");
const input_validation_middleware_1 = require("../middlewares/validations/input-validation-middleware");
const blogs_service_1 = require("../domain/blogs-service");
const blogs_query_repository_1 = require("../repositories/query/blogs-query-repository");
const posts_router_1 = require("./posts-router");
const posts_query_repository_1 = require("../repositories/query/posts-query-repository");
const posts_service_1 = require("../domain/posts-service");
const blogId_validation_middleware_1 = require("../middlewares/validations/blogId-validation-middleware");
exports.blogsRouter = (0, express_1.Router)({});
const nameValidation = (0, express_validator_1.body)('name')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 15 });
const descriptionValidation = (0, express_validator_1.body)('description')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 500 });
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .exists()
    .trim()
    .notEmpty()
    .isURL()
    .isLength({ min: 1, max: 100 });
const blogIdValidation = (0, express_validator_1.param)('blogId')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 100 });
class BlogsController {
    constructor() {
        this.blogsService = new blogs_service_1.BlogsService();
        this.postsService = new posts_service_1.PostsService();
    }
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedBlogs = yield blogs_query_repository_1.blogsQueryRepository.findBlogs(req.query);
            if (!findedBlogs.items.length) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.send(findedBlogs);
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedBlog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(req.params.id);
            if (!findedBlog) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.send(findedBlog);
        });
    }
    getPostsForBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedPostsForBlog = yield posts_query_repository_1.postsQueryRepository.findPosts(req.query, req.params.blogId);
            if (!findedPostsForBlog.items.length) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.send(findedPostsForBlog);
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = yield this.blogsService.createBlog(req.body);
            res
                .status(settings_1.HTTP_STATUSES.CREATED_201)
                .send(createdBlog);
        });
    }
    createPostForBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPost = yield this.postsService.createPost(req.body, req.params.blogId);
            res
                .status(settings_1.HTTP_STATUSES.CREATED_201)
                .send(createdPost);
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield this.blogsService.updateBlog(req.params.id, req.body);
            if (!isUpdated) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield this.blogsService.deleteBlog(req.params.id);
            if (isDeleted) {
                res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
        });
    }
}
const blogsController = new BlogsController();
exports.blogsRouter.get('/', blogsController.getBlogs.bind(blogsController));
exports.blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController));
exports.blogsRouter.get('/:blogId/posts', blogIdValidation, blogId_validation_middleware_1.blogIdValidationMiddleware, blogsController.getPostsForBlog.bind(blogsController));
exports.blogsRouter.post('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, input_validation_middleware_1.inputValidationMiddleware, blogsController.createBlog.bind(blogsController));
exports.blogsRouter.post('/:blogId/posts', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, posts_router_1.titleValidation, posts_router_1.postContentValidation, posts_router_1.shortDescriptionValidation, blogId_validation_middleware_1.blogIdValidationMiddleware, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, blogsController.createPostForBlog.bind(blogsController));
exports.blogsRouter.put('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, input_validation_middleware_1.inputValidationMiddleware, blogsController.updateBlog.bind(blogsController));
exports.blogsRouter.delete('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, blogsController.deleteBlog.bind(blogsController));
//# sourceMappingURL=blogs-router.js.map