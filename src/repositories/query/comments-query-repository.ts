import { CommentsWithQueryOutputModel, CommentViewModel } from "../../models/comments/CommentViewModel"
import { ReadCommentsQueryParams } from "../../models/comments/ReadCommentsQuery"
import { CommentsModel } from "../db"

export const commentsQueryRepository = {
    /* async findComments(queryParams: ReadCommentsQueryParams, postId: string): Promise<CommentsWithQueryOutputModel> {
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
    }, */

    async findCommentById(commentId: string) {
        return CommentsModel.findOne({ id: commentId }, { _id: 0, postId: 0, __v: 0 }).lean()
    }
}