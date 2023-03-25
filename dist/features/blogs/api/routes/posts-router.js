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
const basic_authorizatoin_middleware_1 = require("../../../../middlewares/auth/basic-authorizatoin-middleware");
const input_validation_middleware_1 = require("../../../../middlewares/validations/input-validation-middleware");
const blogs_query_repository_1 = require("../../infrastructure/blogs-query-repository");
const auth_middleware_1 = require("../../../../middlewares/auth/auth-middleware");
const postId_validation_middleware_1 = require("../../../../middlewares/validations/postId-validation-middleware");
const comments_router_1 = require("./comments-router");
const posts_controller_1 = require("../controllers/posts-controller");
const composition_root_1 = require("../../../../composition-root");
exports.postsRouter = (0, express_1.Router)({});
const postsController = composition_root_1.container.resolve(posts_controller_1.PostsController);
exports.titleValidation = (0, express_validator_1.body)('title')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 3, max: 30 });
exports.shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 100 });
exports.postContentValidation = (0, express_validator_1.body)('content')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 3, max: 1000 });
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
exports.postsRouter.get('/', postsController.getPosts.bind(postsController));
exports.postsRouter.get('/:id', postsController.getPostById.bind(postsController));
exports.postsRouter.get('/:postId/comments', postId_validation_middleware_1.postIdValidationMiddleware, postsController.getCommentsForPost.bind(postsController));
exports.postsRouter.post('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, exports.titleValidation, exports.shortDescriptionValidation, exports.postContentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, postsController.createPost.bind(postsController));
exports.postsRouter.post('/:postId/comments', auth_middleware_1.authMiddleware, postId_validation_middleware_1.postIdValidationMiddleware, comments_router_1.commentContentValidation, input_validation_middleware_1.inputValidationMiddleware, postsController.createCommentForPost.bind(postsController));
exports.postsRouter.put('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, exports.titleValidation, exports.shortDescriptionValidation, exports.postContentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, postsController.updatePost.bind(postsController));
exports.postsRouter.delete('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, postsController.deletePost.bind(postsController));
exports.postsRouter.put('/:postId/like-status', auth_middleware_1.authMiddleware, postId_validation_middleware_1.postIdValidationMiddleware, comments_router_1.likeValidation, input_validation_middleware_1.inputValidationMiddleware, postsController.updateLikeStatus.bind(postsController));
//# sourceMappingURL=posts-router.js.map