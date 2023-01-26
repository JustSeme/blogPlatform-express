import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { basicAuthorizationMiddleware } from "../middlewares/basic-authorizatoin-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { blogsService } from "../domain/blogs-service";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../types";
import { blogsQueryRepository } from "../repositories/blogs-query-repository";
import { blogsOutputModel } from "../models/blogs/blogsOutputModel";
import { RequestWithQuery } from '../types'


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

export type readBlogsQueryParams = {
    searchNameTerm: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
}

blogsRouter.get('/', async (req: RequestWithQuery<readBlogsQueryParams>, res: Response<blogsOutputModel>) => {
    const findedBlog = await blogsQueryRepository
    .findBlogs(req.query.searchNameTerm, req.query.sortDirection, req.query.sortBy, req.query.pageNumber, req.query.pageSize)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.json(findedBlog as blogsOutputModel)
})

blogsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response<BlogViewModel>) => {
    const findedBlog = await blogsQueryRepository.findBlogById(req.params.id)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(findedBlog)
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