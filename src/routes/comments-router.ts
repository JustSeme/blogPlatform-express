import { Router, Response } from "express";
import { HTTP_STATUSES } from "../app";
import { commentsService } from "../domain/comments-service";
import { authMiddleware } from "../middlewares/auth-middleware";
import { CommentViewModel } from "../models/comments/CommentViewModel";
import { commentsQueryRepository } from "../repositories/query/comments-query-repository";
import { RequestWithParams } from "../types/types";

export const commentsRouter = Router({})

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