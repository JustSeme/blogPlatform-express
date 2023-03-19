import { Router, Response } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../settings";
import { CommentsService } from "../domain/comments-service";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { commentIdValidationMiddleware } from "../middlewares/validations/commentId-validation-middleware";
import { inputValidationMiddleware } from "../middlewares/validations/input-validation-middleware";
import { ownershipValidationMiddleware } from "../middlewares/validations/ownership-validation-middleware";
import { CommentInputModel } from "../models/comments/CommentInputModel";
import { CommentViewModel } from "../models/comments/CommentViewModel";
import { LikeInputModel } from "../models/comments/LikeInputModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { commentsQueryRepository } from "../repositories/query/comments-query-repository";
import { RequestWithParams, RequestWithParamsAndBody } from "../types/types";

export const commentsRouter = Router({})

export const commentContentValidation = body('content')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 20, max: 300 })


const likeValidation = body('likeStatus')
    .exists()
    .trim()
    .custom(value => {
        if (value === 'None' || value === 'Like' || value === 'Dislike') {
            return true
        }
        throw new Error('likeStatus is incorrect')
    })

class CommentsController {
    private commentsService: CommentsService

    constructor() {
        this.commentsService = new CommentsService()
    }

    async getComment(req: RequestWithParams<{ commentId: string }>, res: Response<CommentViewModel>) {
        const findedComment = await this.commentsService.getCommentById(req.params.commentId)
        if (!findedComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.send(findedComment!)
    }

    async deleteComment(req: RequestWithParams<{ commentId: string }>, res: Response) {
        const isDeleted = await this.commentsService.deleteComment(req.params.commentId)
        if (!isDeleted) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async updateComment(req: RequestWithParamsAndBody<{ commentId: string }, CommentInputModel>, res: Response<ErrorMessagesOutputModel>) {
        const isUpdated = await this.commentsService.updateComment(req.params.commentId, req.body.content)
        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async updateLikeForComment(req: RequestWithParamsAndBody<{ commentId: string }, LikeInputModel>, res: Response) {
        const accessToken = req.headers.authorization!.split(' ')[1]

        const isUpdated = await this.commentsService.updateLike(accessToken, req.params.commentId, req.body.likeStatus)
        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}

const commentsController = new CommentsController()

commentsRouter.get('/:commentId',
    commentsController.getComment.bind(commentsController))

commentsRouter.delete('/:commentId',
    authMiddleware,
    commentIdValidationMiddleware,
    ownershipValidationMiddleware,
    commentsController.deleteComment.bind(commentsController))

commentsRouter.put('/:commentId',
    authMiddleware,
    commentIdValidationMiddleware,
    ownershipValidationMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    commentsController.updateComment.bind(commentsController))

commentsRouter.put('/:commentId/like-status',
    authMiddleware,
    commentIdValidationMiddleware,
    likeValidation,
    inputValidationMiddleware,
    commentsController.updateLikeForComment.bind(commentsController)
)