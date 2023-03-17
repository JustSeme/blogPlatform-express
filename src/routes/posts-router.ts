import { Router, Response } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../settings";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { PostInputModel } from "../models/posts/PostInputModel";
import { PostsWithQueryOutputModel, PostDBModel } from "../models/posts/PostViewModel";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery, RequestWithQuery } from "../types/types";
import { inputValidationMiddleware } from "../middlewares/validations/input-validation-middleware";
import { basicAuthorizationMiddleware } from "../middlewares/auth/basic-authorizatoin-middleware";
import { PostsService } from "../domain/posts-service";
import { postsQueryRepository } from "../repositories/query/posts-query-repository";
import { blogsQueryRepository } from "../repositories/query/blogs-query-repository";
import { ReadPostsQueryParams } from "../models/posts/ReadPostsQuery";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { CommentInputModel } from "../models/comments/CommentInputModel";
import { CommentViewModel } from "../models/comments/CommentViewModel";
import { commentsService } from "../domain/comments-service";
import { postIdValidationMiddleware } from "../middlewares/validations/postId-validation-middleware";
import { ReadCommentsQueryParams } from "../models/comments/ReadCommentsQuery";
import { CommentsWithQueryOutputModel } from "../models/comments/CommentViewModel";
import { commentsQueryRepository } from "../repositories/query/comments-query-repository";
import { commentContentValidation } from "./comments-router";
import { JwtService } from "../application/jwtService";
import { usersQueryRepository } from "../repositories/query/users-query-repository";

export const postsRouter = Router({})

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

class PostsController {
    private jwtService: JwtService
    private postsService: PostsService

    constructor() {
        this.jwtService = new JwtService()
        this.postsService = new PostsService()
    }

    async getPosts(req: RequestWithQuery<ReadPostsQueryParams>, res: Response<PostsWithQueryOutputModel>) {
        const findedPosts = await postsQueryRepository.findPosts(req.query, null)

        if (!findedPosts.items.length) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(findedPosts as PostsWithQueryOutputModel)
    }

    async getPostById(req: RequestWithParams<{ id: string }>, res: Response<PostDBModel>) {
        const findedPosts = await postsQueryRepository.findPostById(req.params.id)

        if (!findedPosts) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(findedPosts as PostDBModel)
    }

    async getCommentsForPost(req: RequestWithParamsAndQuery<{ postId: string }, ReadCommentsQueryParams>, res: Response<CommentsWithQueryOutputModel>) {
        const findedComments = await commentsQueryRepository.findComments(req.query, req.params.postId)
        res.send(findedComments)
    }

    async createPost(req: RequestWithBody<PostInputModel>, res: Response<PostDBModel | ErrorMessagesOutputModel>) {
        const createdPost = await this.postsService.createPost(req.body, null)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdPost)
    }

    async createCommentForPost(req: RequestWithParamsAndBody<{ postId: string }, CommentInputModel>, res: Response<CommentViewModel | ErrorMessagesOutputModel>) {
        const token = req.headers.authorization!.split(' ')[1]
        const userId = await this.jwtService.getUserIdByToken(token)
        const commentator = await usersQueryRepository.findUserById(userId)

        const createdComment = await commentsService.createComment(req.body.content, commentator, req.params.postId)
        if (!createdComment) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdComment)
    }

    async updatePost(req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response<PostDBModel | ErrorMessagesOutputModel>) {
        const isUpdated = await this.postsService.updatePost(req.params.id, req.body)
        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async deletePost(req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) {
        const isDeleted = await this.postsService.deletePosts(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }

        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
}

const postsController = new PostsController()

postsRouter.get('/', postsController.getPosts)

postsRouter.get('/:id', postsController.getPostById)

postsRouter.get('/:postId/comments',
    postIdValidationMiddleware,
    postsController.getCommentsForPost)

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
    postsController.createCommentForPost)

postsRouter.put('/:id',
    basicAuthorizationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    postContentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    postsController.updatePost)

postsRouter.delete('/:id',
    basicAuthorizationMiddleware,
    postsController.deletePost)