import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../app"
import { blogsQueryRepository } from "../repositories/blogs-query-repository"

export const blogIdValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const findedBlog = await blogsQueryRepository.findBlogById(req.params.blogId)
    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    next()
}