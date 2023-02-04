import { CommentsWithQueryOutputModel } from "../../models/comments/CommentViewModel"
import { ReadCommentsQueryParams } from "../../models/comments/ReadCommentsQuery"
import { commentsCollection } from "../db"

export const commentsQueryRepository = {
    async findComments(queryParams: ReadCommentsQueryParams, postId: string): Promise<CommentsWithQueryOutputModel> {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = queryParams

        const filter: any = {
            postId: postId
        }

        const totalCount = await commentsCollection.count(filter)
        const pagesCount = Math.ceil(totalCount / +pageSize)

        const skipCount = (+pageNumber - 1) * +pageSize
        
        let commentsCursor = await commentsCollection.find(filter, { projection: { _id: 0 }}).skip(skipCount).limit(+pageSize)

        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        const resultedComments = await commentsCursor.sort({[sortBy]: sortDirectionNumber}).toArray()
        
        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: resultedComments
        }
    },
}