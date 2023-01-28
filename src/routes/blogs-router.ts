import { Router, Request, Response } from "express";
import { body, param } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { basicAuthorizationMiddleware } from "../middlewares/basic-authorizatoin-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { blogsService } from "../domain/blogs-service";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery } from "../types";
import { blogsQueryRepository } from "../repositories/blogs-query-repository";
import { BlogsWithQueryOutputModel } from '../models/blogs/BlogViewModel'
import { RequestWithQuery } from '../types'
import { contentValidation, ReadPostsQueryParams, shortDescriptionValidation, titleValidation } from "./posts-router";
import { PostsWithQueryOutputModel, PostViewModel } from "../models/posts/PostViewModel";
import { postsQueryRepository } from "../repositories/posts-query-repository";
import { PostInputModel } from "../models/posts/PostInputModel";
import { postsService } from "../domain/posts-service";


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
.custom(async (value) => {
    const findedBlog = await blogsService.findBlogs(value)
    if(!findedBlog) {
        return Promise.reject('blog by blogId not found')
    }
    return true
})
.isLength({ min: 1, max: 100 })

export type ReadBlogsQueryParams = {
    searchNameTerm: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
}

blogsRouter.get('/', async (req: RequestWithQuery<ReadBlogsQueryParams>, res: Response<BlogsWithQueryOutputModel>) => {
    const findedBlogs = await blogsQueryRepository.findBlogs(req.query)

    if(!findedBlogs.items.length) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(findedBlogs as BlogsWithQueryOutputModel)
})

blogsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response<BlogViewModel>) => {
    const findedBlog = await blogsQueryRepository.findBlogById(req.params.id)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(findedBlog)
})

blogsRouter.get('/:blogId/posts', async (req: RequestWithParamsAndQuery<{blogId: string}, ReadPostsQueryParams>, res: Response<PostsWithQueryOutputModel>) => {
    const findedPostsForBlog = await postsQueryRepository.findPosts(req.query, req.params.blogId)

    if(!findedPostsForBlog.items.length) {
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
    contentValidation,
    shortDescriptionValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{blogId: string}, PostInputModel>, res: Response<PostViewModel>) => {
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
        if(!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

blogsRouter.delete('/:id', 
    basicAuthorizationMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) => {
    const isDeleted = await blogsService.deleteBlog(req.params.id)
    if(isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})