import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { PostInputModel } from "../models/posts/PostInputModel";
import { PostViewModel } from "../models/posts/PostViewModel";
import { postsRepository } from "../repositories/posts-repository";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../types";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { basicAuthorizationMiddleware } from "../middlewares/basic-authorizatoin-middleware";

export const postsRouter = Router({})

const titleValidation = body('title').isString().isLength({ min: 1, max: 30})
const shortDescriptionValidation = body('shortDescription').isString().isLength({ min: 1, max: 100 })
const contentValidation = body('content').isString().isLength({ min: 1, max: 1000 })
const blogIdValidation = body('blogId').isString().isLength({ min: 1, max: 100 })

postsRouter.get('/',  (req: Request, res: Response<PostViewModel[]>) => {
    const findedBlog = postsRepository.findPosts(null)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.json(findedBlog as PostViewModel[])
})

postsRouter.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response<PostViewModel>) => {
    const findedBlog = postsRepository.findPosts(req.params.id)

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
    (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel | ErrorMessagesOutputModel>) => {
        const createdPost = postsRepository.createPost(req.body)

        res.send(createdPost)
})

postsRouter.put('/',
    basicAuthorizationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    (req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response<PostViewModel | ErrorMessagesOutputModel>) => {
        const findedPost = postsRepository.findPosts(req.params.id)
        if(!findedPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        postsRepository.updatePost(req.params.id, req.body)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

postsRouter.delete('/:id', 
    basicAuthorizationMiddleware,
    (req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) => {
    const findedPost = postsRepository.findPosts(req.params.id)
    if(!findedPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    postsRepository.deletePosts(req.params.id)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})