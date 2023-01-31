import { BlogsWithQueryOutputModel } from "../../models/blogs/BlogViewModel";
import { BlogViewModel } from "../../models/blogs/BlogViewModel";
import { ReadBlogsQueryParams } from "../../models/blogs/ReadBlogsQuery";
import { blogsCollection } from "../db";

export const blogsQueryRepository = {
    async findBlogs(queryParams: ReadBlogsQueryParams): Promise<BlogsWithQueryOutputModel> {
        let { searchNameTerm = null, sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = queryParams
        const filter: any = {}
        if(searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}
        }

        const totalCount = await blogsCollection.count(filter)
        const pagesCount = Math.ceil(totalCount / +pageSize)
        
        const skipCount = (+pageNumber - 1) * +pageSize
        const blogsCursor = await blogsCollection.find(filter, { projection: { _id: 0 }}).skip(skipCount).limit(+pageSize)

        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        const resultedBlogs = await blogsCursor.sort({[sortBy]: sortDirectionNumber}).toArray()
        
        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: resultedBlogs
        }
    },

    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return await blogsCollection.findOne({id: id}, { projection: { _id: 0 } })
    }
}