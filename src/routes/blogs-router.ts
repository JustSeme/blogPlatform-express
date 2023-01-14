import { Router, Request, Response } from "express";
import { HTTP_STATUSES } from "../app";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { blogsRepository } from "../repositories/blogs-repository";
import { RequestWithParams } from "../types";


export const blogsRouter = Router({})

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