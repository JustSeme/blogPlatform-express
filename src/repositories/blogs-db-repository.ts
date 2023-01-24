import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { client } from "./db";

const __blogs: BlogViewModel[] = [
    {
        id: '1',
        name: 'Ржака!!! Смотреть всем!!!!!!!',
        description: 'kek lol',
        websiteUrl: 'https://anyurl.com'
    },
    {
        id: '2',
        name: 'Ржака!!! Смотреть всем!!!!!!!',
        description: 'kek lol',
        websiteUrl: 'https://anyurl.com'
    },
    {
        id: '3',
        name: 'Ржака!!! Смотреть всем!!!!!!!',
        description: 'kek lol',
        websiteUrl: 'https://anyurl.com'
    },
    {
        id: '4',
        name: 'Ржака!!! Смотреть всем!!!!!!!',
        description: 'kek lol',
        websiteUrl: 'https://anyurl.com'
    },
    {
        id: '10',
        name: 'Ржака!!! Смотреть всем!!!!!!!',
        description: 'kek lol',
        websiteUrl: 'https://anyurl.com'
    },
]

export const blogsRepository = {
    async findBlogs(id: string | null): Promise<BlogViewModel[] | BlogViewModel | null> {
        if(id === null) {
            return await client.db('blog_platform').collection<BlogViewModel>('blogs').find({}).toArray()
        }
        return await client.db('blog_platform').collection<BlogViewModel>('blogs').findOne({id: id})
    },

    async deleteBlog(id: string | null) {
        let result
        if(id === null) {
            result = await client.db('blog_platform').collection<BlogViewModel>('blogs').deleteMany({})
            return result.deletedCount > 0
        }
        result = await client.db('blog_platform').collection<BlogViewModel>('blogs').deleteOne({id: id})

        return result.deletedCount === 1
    },

    async createBlog(body: BlogInputModel): Promise<BlogViewModel> {
        const createdBlog: BlogViewModel = {
            id: Date.now().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }

        await client.db('blog_platform').collection<BlogViewModel>('blogs').insertOne(createdBlog)

        return createdBlog
    },

    async updateBlog(id: string, body: BlogInputModel) {
        const result = await client.db('blog_platform').collection<BlogViewModel>('blogs')
            .updateOne({id: id}, {$set:{name: body.name, description: body.description, websiteUrl: body.websiteUrl}})

        return result.matchedCount === 1
    }
}