import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { blogsRepository } from "../repositories/blogs-repository";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../types";


export const blogsRouter = Router({})

const nameValidation = body('name').isString().isLength({ min: 1, max: 15 })
const descriptionValidation = body('description').isString().isLength({ min: 1, max: 500 })
const websiteUrlValidation = body('websiteUrl').isString().isURL().isLength({ min: 1, max: 100 })

blogsRouter.get('/',  (req: Request, res: Response<BlogViewModel[]>) => {
    const findedBlog = blogsRepository.findBlogs(null)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.json(findedBlog as BlogViewModel[])
})

blogsRouter.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response<BlogViewModel>) => {
    const findedBlog = blogsRepository.findBlogs(req.params.id)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.json(findedBlog as BlogViewModel)
})

blogsRouter.post('/',
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel | ErrorMessagesOutputModel>) => {
    
        const createdBlog = blogsRepository.createBlog(req.body)

        res
            .status(HTTP_STATUSES.OK_200)
            .send(createdBlog)
})

blogsRouter.put('/:id',
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    (req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>, res: Response<ErrorMessagesOutputModel>) => {
        const findedBlog = blogsRepository.findBlogs(req.params.id)
        if(!findedBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        blogsRepository.updateBlog(req.params.id, req.body)
    
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

blogsRouter.delete('/:id', (req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) => {
    const findedBlog = blogsRepository.findBlogs(req.params.id)
    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    blogsRepository.deleteBlog(req.params.id)
})