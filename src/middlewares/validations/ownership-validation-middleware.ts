import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../../settings"
import { JwtService, } from "../../application/jwtService"
import { commentsQueryRepository } from "../../repositories/query/comments-query-repository"

class OwnershipValidationMiddleware {
    private jwtService: JwtService

    constructor() {
        this.jwtService = new JwtService()
    }

    async ownershipValidationMiddleware(req: Request, res: Response, next: NextFunction) {
        const findedComment = await commentsQueryRepository.findCommentById(req.params.commentId)
        const commentOwnerId = findedComment?.commentatorInfo.userId

        const token = req.headers.authorization!.split(' ')[1]
        const userId = await this.jwtService.getUserIdByToken(token)

        if (commentOwnerId !== userId) {
            res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            return
        }

        next()
    }
}

export const ownershipValidationMiddleware = new OwnershipValidationMiddleware().ownershipValidationMiddleware