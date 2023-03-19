import { JwtService } from "../application/jwtService";
import { CommentDBModel, LikeObjectType } from "../models/comments/CommentDBModel";
import { CommentsWithQueryOutputModel, CommentViewModel } from "../models/comments/CommentViewModel";
import { LikeType } from "../models/comments/LikeInputModel";
import { ReadCommentsQueryParams } from "../models/comments/ReadCommentsQuery";
import { UserDBModel } from "../models/users/UserDBModel";
import { CommentsRepository } from "../repositories/comments-db-repository";

export class CommentsService {
    private commentsRepository: CommentsRepository
    private jwtService: JwtService

    constructor() {
        this.commentsRepository = new CommentsRepository()
        this.jwtService = new JwtService()
    }

    async createComment(content: string, commentator: UserDBModel | null, postId: string) {
        if (!commentator) {
            return null
        }

        const createdComment = new CommentDBModel(content, postId, commentator.id, commentator.login)

        await this.commentsRepository.createComment(createdComment)

        return {
            id: createdComment.id,
            content: createdComment.content,
            commentatorInfo: { ...createdComment.commentatorInfo },
            createdAt: createdComment.createdAt
        }
    }

    async deleteComment(commentId: string) {
        return await this.commentsRepository.deleteComment(commentId)
    }

    async updateComment(commentId: string, content: string) {
        return this.commentsRepository.updateComment(commentId, content)
    }

    async updateLike(accessToken: string, commentId: string, status: LikeType) {
        const updatingComment = await this.commentsRepository.getCommentById(commentId)
        if (!updatingComment) {
            return false
        }

        const jwtResult = await this.jwtService.verifyAccessToken(accessToken)
        if (!jwtResult) return false

        const userId = jwtResult.userId

        const likeData: LikeObjectType = {
            userId,
            createdAt: new Date().toISOString()
        }

        if (status === 'Like') {
            const likesArray = updatingComment.likesInfo.likes

            const isAlreadyLiked = likesArray!.findIndex((like) => like.userId === userId) > 0
            if (isAlreadyLiked) return false

            return this.commentsRepository.setLike(likeData, commentId)
        }

        if (status === 'Dislike') {
            const dislikesArray = updatingComment.likesInfo.dislikes

            const isAlreadyDisliked = dislikesArray!.findIndex((dislike) => dislike.userId === userId) > 0
            if (isAlreadyDisliked) return false

            return this.commentsRepository.setDislike(likeData, commentId)
        }

        //Сделать чтобы если стоит лайк, то убирался дизлайк

        return this.commentsRepository.setNoneLike(userId, commentId)
    }

    async getComments(queryParams: ReadCommentsQueryParams, postId: string): Promise<CommentsWithQueryOutputModel> {
        const commentsQueryData = this.commentsRepository.getComments(queryParams, postId)

        return commentsQueryData
    }

    async getCommentById(commentId: string) {
        const recivedComment = await this.commentsRepository.getCommentById(commentId)
        const displayedComment: CommentViewModel = await this.transformLikeInfo([recivedComment])
        return displayedComment
    }

    async transformLikeInfo(commentsArray: CommentDBModel[]) {
        const convertedComments = commentsArray.map((comment: any) => {
            const likesInfoData = comment.likesInfo

            delete comment.likesInfo.likes
            delete comment.likesInfo.dislikes
            comment.likesInfo.likesCount = likesInfoData.likes.length
            comment.likesInfo.dislikesCount = likesInfoData.dislikes.length
        })

        return convertedComments
    }
}