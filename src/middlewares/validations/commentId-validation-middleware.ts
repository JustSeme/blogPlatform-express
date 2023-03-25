import { NextFunction, Response } from "express"
import { HTTP_STATUSES } from "../../settings"
import { commentsQueryRepository } from "../../features/blogs/infrastructure/comments-query-repository"

export const commentIdValidationMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const findedComment = await commentsQueryRepository.findCommentById(req.params.commentId)
    if (!findedComment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    next()
}