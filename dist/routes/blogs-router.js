"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const basic_authorizatoin_middleware_1 = require("../middlewares/auth/basic-authorizatoin-middleware");
const input_validation_middleware_1 = require("../middlewares/validations/input-validation-middleware");
const posts_router_1 = require("./posts-router");
const blogId_validation_middleware_1 = require("../middlewares/validations/blogId-validation-middleware");
const express_validator_1 = require("express-validator");
const composition_root_1 = require("../composition-root");
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
exports.blogsRouter.get('/', composition_root_1.blogsController.getBlogs.bind(composition_root_1.blogsController));
exports.blogsRouter.get('/:id', composition_root_1.blogsController.getBlogById.bind(composition_root_1.blogsController));
exports.blogsRouter.get('/:blogId/posts', blogIdValidation, blogId_validation_middleware_1.blogIdValidationMiddleware, composition_root_1.blogsController.getPostsForBlog.bind(composition_root_1.blogsController));
exports.blogsRouter.post('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.blogsController.createBlog.bind(composition_root_1.blogsController));
exports.blogsRouter.post('/:blogId/posts', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, posts_router_1.titleValidation, posts_router_1.postContentValidation, posts_router_1.shortDescriptionValidation, blogId_validation_middleware_1.blogIdValidationMiddleware, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.blogsController.createPostForBlog.bind(composition_root_1.blogsController));
exports.blogsRouter.put('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.blogsController.updateBlog.bind(composition_root_1.blogsController));
exports.blogsRouter.delete('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, composition_root_1.blogsController.deleteBlog.bind(composition_root_1.blogsController));
//# sourceMappingURL=blogs-router.js.map