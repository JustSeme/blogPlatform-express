import request from 'supertest'
import { server } from '../../src/app'
import { BlogInputModel } from '../../src/models/blogs/BlogInputModel'
import { PostInputModel } from '../../src/models/posts/PostInputModel'
import { app, HTTP_STATUSES, baseURL } from '../../src/settings'

describe('/posts', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`/homeworks/testing/all-data`)
    })

    afterEach(async () => {
        await server.close()
    })

    const correctBlogBody: BlogInputModel = {
        name: 'name',
        description: 'desc',
        websiteUrl: 'www.website.com'
    }

    let blogId = ''
    it('should create blog to get blogId ', async () => {
        const createdBlogData = await request(app)
            .post(`${baseURL}blogs`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(correctBlogBody)
            .expect(HTTP_STATUSES.CREATED_201)

        blogId = createdBlogData.body.id
    })

    const correctPostBody: PostInputModel = {
        title: 'correctTitle', // min 3 max 30
        shortDescription: 'correct description', // min: 3, max: 100 
        content: 'correct content', // min: 3, max: 1000 
        blogId: blogId
    }

    let createdPostId = ''

    it('should create post with correct input data and display correct info', async () => {
        correctPostBody.blogId = blogId

        const createdPostData = await request(app)
            .post(`${baseURL}posts`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(correctPostBody)
            .expect(HTTP_STATUSES.CREATED_201)

        createdPostId = createdPostData.body.id

        const gettedPostData = await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(gettedPostData.body.title).toEqual(correctPostBody.title)
        expect(gettedPostData.body.shortDescription).toEqual(correctPostBody.shortDescription)
        expect(gettedPostData.body.content).toEqual(correctPostBody.content)
        expect(gettedPostData.body.blogId).toEqual(correctPostBody.blogId)

    })

    const correctUpdatePostBody: PostInputModel = {
        title: 'updated',
        shortDescription: 'updated description',
        content: 'updated content',
        blogId: correctPostBody.blogId
    }

    it('should update created post and display correct info', async () => {
        correctUpdatePostBody.blogId = correctPostBody.blogId
        await request(app)
            .put(`${baseURL}posts/${createdPostId}`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(correctUpdatePostBody)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const updatedPostData = await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(updatedPostData.body.title).toEqual(correctUpdatePostBody.title)
        expect(updatedPostData.body.shortDescription).toEqual(correctUpdatePostBody.shortDescription)
        expect(updatedPostData.body.content).toEqual(correctUpdatePostBody.content)
    })
})