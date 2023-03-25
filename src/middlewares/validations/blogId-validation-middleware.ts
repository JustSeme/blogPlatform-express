import { NextFunction, Response } from "express"
import { HTTP_STATUSES } from "../../settings"
import { blogsQueryRepository } from "../../features/blogs/infrastructure/blogs-query-repository"

export const blogIdValidationMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const findedBlog = await blogsQueryRepository.findBlogById(req.params.blogId)
    if (!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    next()
}