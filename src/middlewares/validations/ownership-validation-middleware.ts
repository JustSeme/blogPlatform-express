import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../../app"
import { commentsQueryRepository } from "../../repositories/query/comments-query-repository"

export const ownershipValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const findedComment = await commentsQueryRepository.findCommentById(req.params.commentId)
    const commentOwnerId = findedComment?.commentatorInfo.userId

    if(commentOwnerId !== req.user?.id) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
        return
    }

    next()
}