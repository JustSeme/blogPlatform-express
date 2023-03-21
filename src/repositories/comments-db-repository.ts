import { CommentDBModel, LikeObjectType } from "../models/comments/CommentDBModel";
import { ReadCommentsQueryParams } from "../models/comments/ReadCommentsQuery";
import { CommentsModel } from "./db";
import { injectable } from 'inversify/lib/annotation/injectable';

@injectable()
export class CommentsRepository {
    async createComment(createdComment: CommentDBModel) {
        await CommentsModel.create(createdComment)
    }

    async deleteComment(commentId: string) {
        const result = await CommentsModel.deleteOne({ id: commentId })
        return result.deletedCount === 1
    }

    async updateComment(commentId: string, content: string) {
        const result = await CommentsModel.updateOne({ id: commentId }, { content: content })
        return result.matchedCount === 1
    }

    async getComments(queryParams: ReadCommentsQueryParams, postId: string) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = queryParams

        const filter: any = {
            postId: postId
        }

        const totalCount = await CommentsModel.count(filter)
        const pagesCount = Math.ceil(totalCount / +pageSize)

        const skipCount = (+pageNumber - 1) * +pageSize

        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        let resultedComments = await CommentsModel.find(filter, { _id: 0, postId: 0, __v: 0 }).skip(skipCount).limit(+pageSize).sort({ [sortBy]: sortDirectionNumber }).lean()

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: resultedComments
        }
    }

    async getCommentById(commentId: string) {
        return CommentsModel.findOne({ id: commentId }).lean()
    }

    async setLike(likeData: LikeObjectType, commentId: string) {
        const likedComment = await CommentsModel.findOne({ id: commentId })
        if (!likedComment) return false

        likedComment.likesInfo.likes!.push(likeData)

        await likedComment.save()
        return true
    }

    async setDislike(likeData: LikeObjectType, commentId: string) {
        const dislikedComment = await CommentsModel.findOne({ id: commentId })
        if (!dislikedComment) return false

        // TODO Почитать про $push mongoose

        dislikedComment.likesInfo.dislikes!.push(likeData)

        await dislikedComment.save()
        return true
    }

    async setNoneLike(userId: string, commentId: string) {
        const editableComment = await CommentsModel.findOne({ id: commentId })
        if (!editableComment) return false

        // TODO Почитать про $pull mongoose
        const likeIndex = editableComment.likesInfo.likes.findIndex((like) => like.userId === userId)
        const dislikeIndex = editableComment.likesInfo.dislikes.findIndex((dislike) => dislike.userId === userId)

        if (likeIndex > -1) {
            editableComment.likesInfo.likes.splice(likeIndex, 1)

            await editableComment.save()
            return true
        }

        if (dislikeIndex > -1) {
            editableComment.likesInfo.dislikes.splice(dislikeIndex, 1)

            await editableComment.save()
            return true
        }
    }
}