import { Router } from "express";
import { basicAuthorizationMiddleware } from "../middlewares/auth/basic-authorizatoin-middleware";
import { inputValidationMiddleware } from "../middlewares/validations/input-validation-middleware";
import { postContentValidation, shortDescriptionValidation, titleValidation } from "./posts-router";
import { blogIdValidationMiddleware } from "../middlewares/validations/blogId-validation-middleware";
import { body, param } from "express-validator";
import { container } from "../composition-root";
import { BlogsController } from "../controllers/blogs-controller";

export const blogsRouter = Router({})

const blogsController = container.resolve<BlogsController>(BlogsController)

const nameValidation = body('name')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 3, max: 15 })

const descriptionValidation = body('description')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 3, max: 500 })

const websiteUrlValidation = body('websiteUrl')
    .exists()
    .trim()
    .notEmpty()
    .isURL()
    .isLength({ min: 3, max: 100 })

const blogIdValidation = param('blogId')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 100 })

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))

blogsRouter.get('/:blogId/posts',
    blogIdValidation,
    blogIdValidationMiddleware,
    blogsController.getPostsForBlog.bind(blogsController))

blogsRouter.post('/',
    basicAuthorizationMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    blogsController.createBlog.bind(blogsController))

blogsRouter.post('/:blogId/posts',
    basicAuthorizationMiddleware,
    titleValidation,
    postContentValidation,
    shortDescriptionValidation,
    blogIdValidationMiddleware,
    blogIdValidation,
    inputValidationMiddleware,
    blogsController.createPostForBlog.bind(blogsController))

blogsRouter.put('/:id',
    basicAuthorizationMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    blogsController.updateBlog.bind(blogsController))

blogsRouter.delete('/:id',
    basicAuthorizationMiddleware,
    blogsController.deleteBlog.bind(blogsController))