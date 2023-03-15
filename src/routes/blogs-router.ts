import { Router, Response } from "express";
import { body, param } from "express-validator";
import { HTTP_STATUSES } from '../../src/settings'
import { basicAuthorizationMiddleware } from "../middlewares/auth/basic-authorizatoin-middleware";
import { inputValidationMiddleware } from "../middlewares/validations/input-validation-middleware";
import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { blogsService } from "../domain/blogs-service";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery } from "../types/types";
import { blogsQueryRepository } from "../repositories/query/blogs-query-repository";
import { BlogsWithQueryOutputModel } from '../models/blogs/BlogViewModel'
import { RequestWithQuery } from '../types/types'
import { postContentValidation, shortDescriptionValidation, titleValidation } from "./posts-router";
import { PostsWithQueryOutputModel, PostViewModel } from "../models/posts/PostViewModel";
import { postsQueryRepository } from "../repositories/query/posts-query-repository";
import { PostInputModel } from "../models/posts/PostInputModel";
import { postsService } from "../domain/posts-service";
import { blogIdValidationMiddleware } from "../middlewares/validations/blogId-validation-middleware";
import { ReadBlogsQueryParams } from "../models/blogs/ReadBlogsQuery";
import { ReadPostsQueryParams } from "../models/posts/ReadPostsQuery";


export const blogsRouter = Router({})

const nameValidation = body('name')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 15 })

const descriptionValidation = body('description')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 500 })

const websiteUrlValidation = body('websiteUrl')
    .exists()
    .trim()
    .notEmpty()
    .isURL()
    .isLength({ min: 1, max: 100 })

const blogIdValidation = param('blogId')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 100 })

blogsRouter.get('/', async (req: RequestWithQuery<ReadBlogsQueryParams>, res: Response<BlogsWithQueryOutputModel>) => {
    const findedBlogs = await blogsQueryRepository.findBlogs(req.query)

    if (!findedBlogs.items.length) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(findedBlogs as BlogsWithQueryOutputModel)
})

blogsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response<BlogViewModel>) => {
    const findedBlog = await blogsQueryRepository.findBlogById(req.params.id)

    if (!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(findedBlog)
})

blogsRouter.get('/:blogId/posts',
    blogIdValidation,
    blogIdValidationMiddleware,
    async (req: RequestWithParamsAndQuery<{ blogId: string }, ReadPostsQueryParams>, res: Response<PostsWithQueryOutputModel>) => {
        const findedPostsForBlog = await postsQueryRepository.findPosts(req.query, req.params.blogId)

        if (!findedPostsForBlog.items.length) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(findedPostsForBlog)
    })

blogsRouter.post('/',
    basicAuthorizationMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel | ErrorMessagesOutputModel>) => {
        const createdBlog = await blogsService.createBlog(req.body)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdBlog)
    })

blogsRouter.post('/:blogId/posts',
    basicAuthorizationMiddleware,
    titleValidation,
    postContentValidation,
    shortDescriptionValidation,
    blogIdValidationMiddleware,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{ blogId: string }, PostInputModel>, res: Response<PostViewModel>) => {
        const createdPost = await postsService.createPost(req.body, req.params.blogId)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdPost)
    })

blogsRouter.put('/:id',
    basicAuthorizationMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<ErrorMessagesOutputModel>) => {
        const isUpdated = await blogsService.updateBlog(req.params.id, req.body)
        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

blogsRouter.delete('/:id',
    basicAuthorizationMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) => {
        const isDeleted = await blogsService.deleteBlog(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })