"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const app_1 = require("../app");
const posts_repository_1 = require("../repositories/posts-repository");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const basic_authorizatoin_middleware_1 = require("../middlewares/basic-authorizatoin-middleware");
exports.postsRouter = (0, express_1.Router)({});
const titleValidation = (0, express_validator_1.body)('title').isString().isLength({ min: 1, max: 30 });
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').isString().isLength({ min: 1, max: 100 });
const contentValidation = (0, express_validator_1.body)('content').isString().isLength({ min: 1, max: 1000 });
const blogIdValidation = (0, express_validator_1.body)('blogId').isString().isLength({ min: 1, max: 100 });
exports.postsRouter.get('/', (req, res) => {
    const findedBlog = posts_repository_1.postsRepository.findPosts(null);
    if (!findedBlog) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.json(findedBlog);
});
exports.postsRouter.get('/:id', (req, res) => {
    const findedBlog = posts_repository_1.postsRepository.findPosts(req.params.id);
    if (!findedBlog) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.json(findedBlog);
});
exports.postsRouter.post('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const createdPost = posts_repository_1.postsRepository.createPost(req.body);
    res.send(createdPost);
});
exports.postsRouter.put('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const findedPost = posts_repository_1.postsRepository.findPosts(req.params.id);
    if (!findedPost) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    posts_repository_1.postsRepository.updatePost(req.params.id, req.body);
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
});
exports.postsRouter.delete('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, (req, res) => {
    const findedPost = posts_repository_1.postsRepository.findPosts(req.params.id);
    if (!findedPost) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    posts_repository_1.postsRepository.deletePosts(req.params.id);
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
});
//# sourceMappingURL=posts-router.js.map