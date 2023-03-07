import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { blogsModel } from "./db";

export const blogsRepository = {
    async deleteBlog(id: string | null) {
        let result
        if (id === null) {
            result = await blogsModel.deleteMany({})
            return result.deletedCount > 0
        }

        result = await blogsModel.deleteOne({ id: id })
        return result.deletedCount === 1
    },

    async createBlog(createdBlog: BlogViewModel) {
        await blogsModel.create(createdBlog)
    },

    async updateBlog(id: string, body: BlogInputModel) {
        const result = await blogsModel.updateOne({ id: id }, { name: body.name, description: body.description, websiteUrl: body.websiteUrl })

        return result.matchedCount === 1
    }
}