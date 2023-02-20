import { NextFunction, Response } from "express"
import { HTTP_STATUSES } from "../../app"
import { postsQueryRepository } from "../../repositories/query/posts-query-repository"

export const postIdValidationMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const commentedPost = await postsQueryRepository.findPostById(req.params.postId)
    if(!commentedPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    next()
}