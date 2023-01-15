import { PostViewModel } from '../models/posts/PostViewModel'

const posts: PostViewModel[] = [
    {
        id: '1',
        title: 'The best post',
        shortDescription: 'This description should be no more 100 length',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        blogId: '1',
        blogName: 'Ржака!!! Смотреть всем!!!!!!!'
    },
    {
        id: '2',
        title: 'The best post',
        shortDescription: 'This description should be no more 100 length',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        blogId: '1',
        blogName: 'Ржака!!! Смотреть всем!!!!!!!'
    },
    {
        id: '3',
        title: 'The best post',
        shortDescription: 'This description should be no more 100 length',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        blogId: '1',
        blogName: 'Ржака!!! Смотреть всем!!!!!!!'
    },
    {
        id: '4',
        title: 'The best post',
        shortDescription: 'This description should be no more 100 length',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        blogId: '1',
        blogName: 'Ржака!!! Смотреть всем!!!!!!!'
    },
    {
        id: '5',
        title: 'The best post',
        shortDescription: 'This description should be no more 100 length',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        blogId: '1',
        blogName: 'Ржака!!! Смотреть всем!!!!!!!'
    },
]

export const postsRepository = {
    findPosts(id: string | null) {
        if(id === null) {
            return posts
        }
        return posts.find(p => p.id === id)
    },

    deletePosts(id: string | null) {
        if(id === null) {
            posts.splice(0, posts.length)
            return
        }

        for(let i = 0; i < posts.length; i++) {
            if(posts[i].id === id)
            posts.splice(i, 1)
        }
    }
}