import { Router, Response } from "express";
import { body, param } from "express-validator";
import { HTTP_STATUSES } from '../settings'
import { basicAuthorizationMiddleware } from "../middlewares/auth/basic-authorizatoin-middleware";
import { inputValidationMiddleware } from "../middlewares/validations/input-validation-middleware";
import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { BlogsService } from "../domain/blogs-service";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery } from "../types/types";
import { blogsQueryRepository } from "../repositories/query/blogs-query-repository";
import { BlogsWithQueryOutputModel } from '../models/blogs/BlogViewModel'
import { RequestWithQuery } from '../types/types'
import { postContentValidation, shortDescriptionValidation, titleValidation } from "./posts-router";
import { PostsWithQueryOutputModel, PostDBModel } from "../models/posts/PostDBModel";
import { postsQueryRepository } from "../repositories/query/posts-query-repository";
import { PostInputModel } from "../models/posts/PostInputModel";
import { PostsService } from "../domain/posts-service";
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

class BlogsController {
    private blogsService
    private postsService

    constructor() {
        this.blogsService = new BlogsService()
        this.postsService = new PostsService()
    }

    async getBlogs(req: RequestWithQuery<ReadBlogsQueryParams>, res: Response<BlogsWithQueryOutputModel>) {
        const findedBlogs = await blogsQueryRepository.findBlogs(req.query)

        if (!findedBlogs.items.length) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.send(findedBlogs as BlogsWithQueryOutputModel)
    }

    async getBlogById(req: RequestWithParams<{ id: string }>, res: Response<BlogViewModel>) {
        const findedBlog = await blogsQueryRepository.findBlogById(req.params.id)

        if (!findedBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.send(findedBlog)
    }

    async getPostsForBlog(req: RequestWithParamsAndQuery<{ blogId: string }, ReadPostsQueryParams>, res: Response<PostsWithQueryOutputModel>) {
        const findedPostsForBlog = await postsQueryRepository.findPosts(req.query, req.params.blogId)

        if (!findedPostsForBlog.items.length) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.send(findedPostsForBlog)
    }

    async createBlog(req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel | ErrorMessagesOutputModel>) {
        const createdBlog = await this.blogsService.createBlog(req.body)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdBlog)
    }

    async createPostForBlog(req: RequestWithParamsAndBody<{ blogId: string }, PostInputModel>, res: Response<PostDBModel>) {
        const createdPost = await this.postsService.createPost(req.body, req.params.blogId)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdPost)
    }

    async updateBlog(req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<ErrorMessagesOutputModel>) {
        const isUpdated = await this.blogsService.updateBlog(req.params.id, req.body)
        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async deleteBlog(req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) {
        const isDeleted = await this.blogsService.deleteBlog(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
}

const blogsController = new BlogsController()

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