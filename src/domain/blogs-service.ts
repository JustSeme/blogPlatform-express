import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { blogsRepository } from "../repositories/blogs-db-repository";

class BlogsService {
    async deleteBlog(id: string | null) {
        return blogsRepository.deleteBlog(id)
    }

    async createBlog(body: BlogInputModel): Promise<BlogViewModel> {
        const createdBlog: BlogViewModel = {
            id: Date.now().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsRepository.createBlog(createdBlog)

        return createdBlog
    }

    async updateBlog(id: string, body: BlogInputModel) {
        return await blogsRepository.updateBlog(id, body)
    }
}

export const blogsService = new BlogsService()