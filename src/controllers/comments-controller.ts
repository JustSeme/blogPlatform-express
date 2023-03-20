import { HTTP_STATUSES } from "../settings";
import { CommentsService } from "../domain/comments-service";
import { CommentInputModel } from "../models/comments/CommentInputModel";
import { CommentViewModel } from "../models/comments/CommentViewModel";
import { LikeInputModel } from "../models/comments/LikeInputModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { RequestWithParams, RequestWithParamsAndBody } from "../types/types";
import { Response } from "express";
import { injectable } from 'inversify/lib/annotation/injectable';

@injectable()
export class CommentsController {
    constructor(protected commentsService: CommentsService) { }

    async getComment(req: RequestWithParams<{ commentId: string }>, res: Response<CommentViewModel>) {
        const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null

        const findedComment = await this.commentsService.getCommentById(req.params.commentId, accessToken)
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