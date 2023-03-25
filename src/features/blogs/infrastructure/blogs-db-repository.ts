import { BlogInputModel } from "../application/dto/BlogInputModel";
import { BlogViewModel } from "../api/models/BlogViewModel";
import { BlogsModel } from "../../../repositories/db";
import { injectable } from 'inversify/lib/annotation/injectable';

@injectable()
export class BlogsRepository {
    async deleteBlog(id: string | null) {
        let result
        if (id === null) {
            result = await BlogsModel.deleteMany({})
            return result.deletedCount > 0
        }

        result = await BlogsModel.deleteOne({ id: id })
        return result.deletedCount === 1
    }

    async createBlog(createdBlog: BlogViewModel) {
        await BlogsModel.create(createdBlog)
    }

    async updateBlog(id: string, body: BlogInputModel) {
        const result = await BlogsModel.updateOne({ id: id }, { name: body.name, description: body.description, websiteUrl: body.websiteUrl })

        return result.matchedCount === 1
    }

    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return await BlogsModel.findOne({ id: id }, { _id: 0, __v: 0 })
    }
}