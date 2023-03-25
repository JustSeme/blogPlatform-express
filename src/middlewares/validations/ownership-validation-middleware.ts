import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../../settings"
import { commentsQueryRepository } from "../../features/blogs/infrastructure/comments-query-repository"
import { container } from "../../composition-root"
import { JwtService } from "../../application/jwtService"

const jwtService = container.resolve<JwtService>(JwtService)

export const ownershipValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const findedComment = await commentsQueryRepository.findCommentById(req.params.commentId)
    const commentOwnerId = findedComment?.commentatorInfo.userId

    const token = req.headers.authorization!.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)

    if (commentOwnerId !== userId) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
        return
    }

    next()
}