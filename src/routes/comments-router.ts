import { Router, Response } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { commentsService } from "../domain/comments-service";
import { authMiddleware } from "../middlewares/auth-middleware";
import { ownershipValidationMiddleware } from "../middlewares/ownership-validation-middleware";
import { CommentInputModel } from "../models/comments/CommentInputModel";
import { CommentViewModel } from "../models/comments/CommentViewModel";
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

commentsRouter.get('/:commentId',
    async (req: RequestWithParams<{commentId: string}>, res: Response<CommentViewModel>) => {
        const findedComment = await commentsQueryRepository.findCommentById(req.params.commentId)
        if(!findedComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }

        res.send(findedComment!)
    })

commentsRouter.delete('/:commentId', 
    authMiddleware,
    async (req: RequestWithParams<{commentId: string}>, res: Response) => {
        const isDeleted = await commentsService.deleteComment(req.params.commentId)
        if(!isDeleted) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

commentsRouter.put('/:commentId',
    authMiddleware,
    ownershipValidationMiddleware,
    commentContentValidation,
    async (req: RequestWithParamsAndBody<{commentId: string}, CommentInputModel>, res: Response<ErrorMessagesOutputModel>) => {
        const isUpdated = await commentsService.updateComment(req.params.commentId, req.body.content)
        if(!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })