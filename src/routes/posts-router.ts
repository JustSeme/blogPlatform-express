import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { PostInputModel } from "../models/posts/PostInputModel";
import { PostViewModel } from "../models/posts/PostViewModel";
import { postsRepository } from "../repositories/posts-in-memory-repository";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../types";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { basicAuthorizationMiddleware } from "../middlewares/basic-authorizatoin-middleware";
import { blogsRepository } from "../repositories/blogs-in-memory-repository";

export const postsRouter = Router({})

const titleValidation = body('title')
.exists()
.trim()
.notEmpty()
.isString()
.isLength({ min: 1, max: 30})

const shortDescriptionValidation = body('shortDescription')
.exists()
.trim()
.notEmpty()
.isLength({ min: 1, max: 100 })

const contentValidation = body('content')
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
.custom((value) => {
    if(!blogsRepository.findBlogs(value)) {
        return Promise.reject('blog by blogId not found')
    }
    return true
})
.isLength({ min: 1, max: 100 })

postsRouter.get('/', async (req: Request, res: Response<PostViewModel[]>) => {
    const findedBlog = await postsRepository.findPosts(null)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.json(findedBlog as PostViewModel[])
})

postsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response<PostViewModel>) => {
    const findedBlog = await postsRepository.findPosts(req.params.id)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.json(findedBlog as PostViewModel)
})

postsRouter.post('/',
    basicAuthorizationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel | ErrorMessagesOutputModel>) => {
        const createdPost = await postsRepository.createPost(req.body)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdPost)
})

postsRouter.put('/:id',
    basicAuthorizationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response<PostViewModel | ErrorMessagesOutputModel>) => {
        const findedPost = await postsRepository.findPosts(req.params.id)
        if(!findedPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        postsRepository.updatePost(req.params.id, req.body)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

postsRouter.delete('/:id', 
    basicAuthorizationMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) => {
    const findedPost = await postsRepository.findPosts(req.params.id)
    if(!findedPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    postsRepository.deletePosts(req.params.id)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})