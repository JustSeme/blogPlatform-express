import request from 'supertest'
import { HTTP_STATUSES, server } from '../../src/app'
import { PostInputModel } from '../../src/models/posts/PostInputModel'
import { BlogInputModel } from '../../src/models/blogs/BlogInputModel'
import { CommentInputModel } from '../../src/models/comments/CommentInputModel'
import { app } from '../../src/settings'

describe('/comments', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`/homeworks/testing/all-data`)
    })

    afterAll(async () => {
        await server.close()
    })

    const correctBlogBody: BlogInputModel = {
        name: 'name', //min 3 max 15
        description: 'description', // min 3 max 500
        websiteUrl: 'http://anyurl.com' // min 3 max 100, pattern ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    }

    const correctPostBody: PostInputModel = {
        title: 'postTitle', // min 3 max 30
        shortDescription: 'shortDescription', // min 3 max 100
        content: 'anyContent', // min 3 max 1000
        blogId: ''
    }

    const correctCommentBody: CommentInputModel = {
        content: 'this content should be a correct' // min 20 max 300
    }

    it('should create blog, post for it and comment for it', async () => {
        await request(app)
            .post('/homeworks/blogs')
            .send(correctBlogBody)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.CREATED_201)
    })
})