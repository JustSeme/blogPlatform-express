import { BlogsWithQueryOutputModel } from "../../models/blogs/BlogViewModel";
import { BlogViewModel } from "../../models/blogs/BlogViewModel";
import { ReadBlogsQueryParams } from "../../models/blogs/ReadBlogsQuery";
import { BlogsModel } from "../db";

export const blogsQueryRepository = {
    async findBlogs(queryParams: ReadBlogsQueryParams): Promise<BlogsWithQueryOutputModel> {
        let { searchNameTerm = null, sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = queryParams

        const filter: any = {}
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }

        const totalCount = await BlogsModel.count(filter)
        const pagesCount = Math.ceil(totalCount / +pageSize)

        const skipCount = (+pageNumber - 1) * +pageSize
        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        const resultedBlogs = await BlogsModel.find(filter, { _id: 0, __v: 0 }).skip(skipCount).limit(+pageSize).sort({ [sortBy]: sortDirectionNumber })

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: resultedBlogs
        }
    },

    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return await BlogsModel.findOne({ id: id }, { _id: 0, __v: 0 })
    }
}