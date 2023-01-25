import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { basicAuthorizationMiddleware } from "../middlewares/basic-authorizatoin-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { blogsRepository } from "../repositories/blogs-db-repository";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../types";


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

blogsRouter.get('/', async (req: Request, res: Response<BlogViewModel[]>) => {
    const findedBlog = await blogsRepository.findBlogs(null)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.json(findedBlog as BlogViewModel[])
})

blogsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response<BlogViewModel>) => {
    const findedBlog = await blogsRepository.findBlogs(req.params.id)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(findedBlog as BlogViewModel)
})

blogsRouter.post('/',
    basicAuthorizationMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel | ErrorMessagesOutputModel>) => {
        const createdBlog = await blogsRepository.createBlog(req.body)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdBlog)
})

blogsRouter.put('/:id',
    basicAuthorizationMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<ErrorMessagesOutputModel>) => {
        const isUpdated = await blogsRepository.updateBlog(req.params.id, req.body)
        if(!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

blogsRouter.delete('/:id', 
    basicAuthorizationMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) => {
    const isDeleted = await blogsRepository.deleteBlog(req.params.id)
    if(isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})