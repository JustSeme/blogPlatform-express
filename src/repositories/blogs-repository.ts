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
        id: '5',
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
    }
}