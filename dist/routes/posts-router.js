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
exports.postsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const app_1 = require("../app");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const basic_authorizatoin_middleware_1 = require("../middlewares/basic-authorizatoin-middleware");
const blogs_service_1 = require("../domain/blogs-service");
const posts_service_1 = require("../domain/posts-service");
exports.postsRouter = (0, express_1.Router)({});
const titleValidation = (0, express_validator_1.body)('title')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 30 });
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 });
const contentValidation = (0, express_validator_1.body)('content')
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
    const findedBlog = yield blogs_service_1.blogsService.findBlogs(value);
    if (!findedBlog) {
        return Promise.reject('blog by blogId not found');
    }
    return true;
}))
    .isLength({ min: 1, max: 100 });
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findedBlog = yield posts_service_1.postsService.findPosts(null);
    if (!findedBlog) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(findedBlog);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findedBlog = yield posts_service_1.postsService.findPosts(req.params.id);
    if (!findedBlog) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(findedBlog);
}));
exports.postsRouter.post('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdPost = yield posts_service_1.postsService.createPost(req.body);
    res
        .status(app_1.HTTP_STATUSES.CREATED_201)
        .send(createdPost);
}));
exports.postsRouter.put('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield posts_service_1.postsService.updatePost(req.params.id, req.body);
    if (!isUpdated) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.postsRouter.delete('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield posts_service_1.postsService.deletePosts(req.params.id);
    if (isDeleted) {
        res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
        return;
    }
    res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
}));
//# sourceMappingURL=posts-router.js.map