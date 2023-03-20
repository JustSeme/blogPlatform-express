import { Router } from "express";
import { body } from "express-validator";
import { basicAuthorizationMiddleware } from "../middlewares/auth/basic-authorizatoin-middleware";
import { inputValidationMiddleware } from "../middlewares/validations/input-validation-middleware";
import { blogsQueryRepository } from "../repositories/query/blogs-query-repository";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { postIdValidationMiddleware } from "../middlewares/validations/postId-validation-middleware";
import { commentContentValidation } from "./comments-router";
import { PostsController } from "../controllers/posts-controller";
import { container } from "../composition-root";

export const postsRouter = Router({})

const postsController = container.resolve<PostsController>(PostsController)

export const titleValidation = body('title')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 30 })

export const shortDescriptionValidation = body('shortDescription')
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 })

export const postContentValidation = body('content')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 1000 })

const blogIdValidation = body('blogId')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .custom(async (value) => {
        const findedBlog = await blogsQueryRepository.findBlogById(value)
        if (!findedBlog) {
            throw new Error('blog by blogId not found')
        }
        return true
    })
    .isLength({ min: 1, max: 100 })

postsRouter.get('/', postsController.getPosts)

postsRouter.get('/:id', postsController.getPostById)

postsRouter.get('/:postId/comments',
    postIdValidationMiddleware,
    postsController.getCommentsForPost.bind(postsController))

postsRouter.post('/',
    basicAuthorizationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    postContentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    postsController.createPost.bind(postsController))

postsRouter.post('/:postId/comments',
    authMiddleware,
    postIdValidationMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    postsController.createCommentForPost.bind(postsController))

postsRouter.put('/:id',
    basicAuthorizationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    postContentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    postsController.updatePost.bind(postsController))

postsRouter.delete('/:id',
    basicAuthorizationMiddleware,
    postsController.deletePost.bind(postsController))