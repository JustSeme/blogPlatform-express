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
const blogs_controller_1 = require("../controllers/blogs-controller");
exports.blogsRouter = (0, express_1.Router)({});
const blogsController = composition_root_1.container.resolve(blogs_controller_1.BlogsController);
const nameValidation = (0, express_validator_1.body)('name')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 3, max: 15 });
const descriptionValidation = (0, express_validator_1.body)('description')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 3, max: 500 });
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .exists()
    .trim()
    .notEmpty()
    .isURL()
    .isLength({ min: 3, max: 100 });
const blogIdValidation = (0, express_validator_1.param)('blogId')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 100 });
exports.blogsRouter.get('/', blogsController.getBlogs.bind(blogsController));
exports.blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController));
exports.blogsRouter.get('/:blogId/posts', blogIdValidation, blogId_validation_middleware_1.blogIdValidationMiddleware, blogsController.getPostsForBlog.bind(blogsController));
exports.blogsRouter.post('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, input_validation_middleware_1.inputValidationMiddleware, blogsController.createBlog.bind(blogsController));
exports.blogsRouter.post('/:blogId/posts', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, posts_router_1.titleValidation, posts_router_1.postContentValidation, posts_router_1.shortDescriptionValidation, blogId_validation_middleware_1.blogIdValidationMiddleware, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, blogsController.createPostForBlog.bind(blogsController));
exports.blogsRouter.put('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, input_validation_middleware_1.inputValidationMiddleware, blogsController.updateBlog.bind(blogsController));
exports.blogsRouter.delete('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, blogsController.deleteBlog.bind(blogsController));
//# sourceMappingURL=blogs-router.js.map