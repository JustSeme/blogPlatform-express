import { Router, Response } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { PostInputModel } from "../models/posts/PostInputModel";
import { PostsWithQueryOutputModel, PostViewModel } from "../models/posts/PostViewModel";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery, RequestWithQuery } from "../types/types";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { basicAuthorizationMiddleware } from "../middlewares/basic-authorizatoin-middleware";
import { postsService } from "../domain/posts-service";
import { postsQueryRepository } from "../repositories/query/posts-query-repository";
import { blogsQueryRepository } from "../repositories/query/blogs-query-repository";
import { ReadPostsQueryParams } from "../models/posts/ReadPostsQuery";
import { authMiddleware } from "../middlewares/auth-middleware";
import { CommentInputModel } from "../models/comments/CommentInputModel";
import { CommentViewModel } from "../models/comments/CommentViewModel";
import { commentsService } from "../domain/comments-service";
import { postIdValidationMiddleware } from "../middlewares/postId-validation-middleware";
import { ReadCommentsQueryParams } from "../models/comments/ReadCommentsQuery";
import { CommentsWithQueryOutputModel } from "../models/comments/CommentViewModel";
import { commentsQueryRepository } from "../repositories/query/comments-query-repository";
import { commentContentValidation } from "./comments-router";

export const postsRouter = Router({})

export const titleValidation = body('title')
.exists()
.trim()
.notEmpty()
.isString()
.isLength({ min: 1, max: 30})

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
    if(!findedBlog) {
        return Promise.reject('blog by blogId not found')
    }
    return true
})
.isLength({ min: 1, max: 100 })

postsRouter.get('/', async (req: RequestWithQuery<ReadPostsQueryParams>, res: Response<PostsWithQueryOutputModel>) => {
    const findedPosts = await postsQueryRepository.findPosts(req.query, null)

    if(!findedPosts.items.length) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(findedPosts as PostsWithQueryOutputModel)
})

postsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response<PostViewModel>) => {
    const findedPosts = await postsQueryRepository.findPostById(req.params.id)

    if(!findedPosts) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(findedPosts as PostViewModel)
})

postsRouter.get('/:postId/comments',
    postIdValidationMiddleware,
    async (req: RequestWithParamsAndQuery<{postId: string}, ReadCommentsQueryParams>, res: Response<CommentsWithQueryOutputModel>) => {
        const findedComments = await commentsQueryRepository.findComments(req.query, req.params.postId)
        res.send(findedComments)
    })

postsRouter.post('/',
    basicAuthorizationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    postContentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel | ErrorMessagesOutputModel>) => {
        const createdPost = await postsService.createPost(req.body, null)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdPost)
})

postsRouter.post('/:postId/comments', 
    authMiddleware,
    postIdValidationMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{postId: string}, CommentInputModel>, res: Response<CommentViewModel | ErrorMessagesOutputModel>) => {
        const createdComment = await commentsService.createComment(req.body.content, req.user, req.params.postId)
        if(!createdComment) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }
        
        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdComment)
    })

postsRouter.put('/:id',
    basicAuthorizationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    postContentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response<PostViewModel | ErrorMessagesOutputModel>) => {
        const isUpdated = await postsService.updatePost(req.params.id, req.body)
        if(!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

postsRouter.delete('/:id', 
    basicAuthorizationMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) => {
    const isDeleted = await postsService.deletePosts(req.params.id)
    if(isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }

    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})