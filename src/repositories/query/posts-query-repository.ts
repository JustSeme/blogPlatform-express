import { postsModel } from "../db";
import { PostsWithQueryOutputModel, PostViewModel } from "../../models/posts/PostViewModel";
import { ReadPostsQueryParams } from "../../models/posts/ReadPostsQuery";

export const postsQueryRepository = {
    async findPosts(queryParams: ReadPostsQueryParams, blogId: string | null): Promise<PostsWithQueryOutputModel> {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = queryParams

        const filter: any = {}
        if (blogId) {
            filter.blogId = blogId
        }

        const totalCount = await postsModel.count(filter)
        const pagesCount = Math.ceil(totalCount / +pageSize)

        const skipCount = (+pageNumber - 1) * +pageSize
        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        let resultedPosts = await postsModel.find(filter, { _id: 0, __v: 0 }).skip(skipCount).limit(+pageSize).sort({ [sortBy]: sortDirectionNumber })

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: resultedPosts
        }
    },

    async findPostById(id: string): Promise<PostViewModel | null> {
        return await postsModel.findOne({ id: id }, { _id: 0, __v: 0 })
    }
}