import { BlogInputModel } from "../models/blogs/BlogInputModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";

const blogs: BlogViewModel[] = [
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
    findBlogs(id: string | null) {
        if(id === null) {
            return blogs
        }
        return blogs.find(b => b.id === id)
    },

    deleteBlog(id: string | null) {
        if(id === null) {
            blogs.splice(0, blogs.length)
            return
        }

        for(let i = 0; i < blogs.length; i++) {
            if(blogs[i].id === id)
            blogs.splice(i, 1)
        }
    },

    createBlog(body: BlogInputModel) {
        const createdBlog: BlogViewModel = {
            id: Date.now().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }

        blogs.push(createdBlog)

        return createdBlog
    },

    updateBlog(id: string, body: BlogInputModel) {
        const findedBlogIndex = blogs.findIndex(v => v.id === id)
        if(findedBlogIndex < 0) {
            return
        }

        blogs[findedBlogIndex] = {
            id: blogs[findedBlogIndex].id,
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
    }
}