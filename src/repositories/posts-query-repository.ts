import { postsCollection } from "./db";
import { PostsWithQueryOutputModel, PostViewModel } from "../models/posts/PostViewModel";
import { ReadPostsQueryParams } from "../routes/posts-router";

export const postsQueryRepository = {
    async findPosts(queryParams: ReadPostsQueryParams, blogId: string | null): Promise<PostsWithQueryOutputModel> {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = queryParams

        const filter: any = {}
        if(blogId) {
            filter.blogId = blogId
        }

        const totalCount = await postsCollection.count(filter)
        const pagesCount = Math.ceil(totalCount / +pageSize)

        const skipCount = (+pageNumber - 1) * +pageSize
        let postsCursor = await postsCollection.find(filter, { projection: { _id: 0 }}).skip(skipCount).limit(+pageSize)

        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        const resultedPosts = await postsCursor.sort({[sortBy]: sortDirectionNumber}).toArray()
        
        return {
            pagesCount: pagesCount,
            page: pageNumber.toString(),
            pageSize: pageSize.toString(),
            totalCount: totalCount,
            items: resultedPosts
        }
    },

    async findPostById(id: string): Promise<PostViewModel | null> {
        return await postsCollection.findOne({id: id}, { projection: { _id: 0 } })
    }
}