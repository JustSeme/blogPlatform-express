import { server } from '../../src/app'
import request from 'supertest'
import { baseURL, HTTP_STATUSES, app } from "../../src/settings";

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`/homeworks/testing/all-data`)
    })

    afterEach(async () => {
        await server.close()
    })

    const correctBlogBody = {
        name: 'blogName', // min 3 max 15
        description: 'description', // min 3 max 500
        websiteUrl: 'www.anyurl.com' // min 3 max 100 pattern ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    }

    it('shouldn\'t create new blog without basic authorization', async () => {
        await request(app)
            .post(`${baseURL}blogs`)
            .send(correctBlogBody)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .get(`${baseURL}blogs`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    const incorrectBlogBody = {
        name: 'thisNameWasBeOver15Symbols', // min 3 max 15
        description: 'tw', // min 3 max 500
        websiteUrl: 'notAUrl' // min 3 max 100 pattern ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    }

    it('shouldn\'t create new blog with incorrect input data', async () => {
        const errorsMessagesData = await request(app)
            .post(`${baseURL}blogs`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectBlogBody)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessagesData.body.errorsMessages.length).toEqual(3)
        expect(errorsMessagesData.body.errorsMessages[0].field).toEqual('name')
        expect(errorsMessagesData.body.errorsMessages[1].field).toEqual('description')
        expect(errorsMessagesData.body.errorsMessages[2].field).toEqual('websiteUrl')

        await request(app)
            .get(`${baseURL}blogs`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    let createdBlogId = ''
    it('should create new blog with correct input data', async () => {
        const responseData = await request(app)
            .post(`${baseURL}blogs`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlogBody)
            .expect(HTTP_STATUSES.CREATED_201)

        createdBlogId = responseData.body.id
        const blogData = await request(app)
            .get(`${baseURL}blogs/${createdBlogId}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(blogData.body.name).toEqual(correctBlogBody.name)
        expect(blogData.body.description).toEqual(correctBlogBody.description)
        expect(blogData.body.websiteUrl).toEqual(correctBlogBody.websiteUrl)
    })

    it('shouldn\'t update blog with incorrect input data', async () => {
        const errorsMessagesData = await request(app)
            .put(`${baseURL}blogs/${createdBlogId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectBlogBody)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        const notUpdatedBlogData = await request(app)
            .get(`${baseURL}blogs/${createdBlogId}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(notUpdatedBlogData.body.name).toEqual(correctBlogBody.name)
        expect(notUpdatedBlogData.body.description).toEqual(correctBlogBody.description)
        expect(notUpdatedBlogData.body.websiteUrl).toEqual(correctBlogBody.websiteUrl)

        expect(errorsMessagesData.body.errorsMessages.length).toEqual(3)
        expect(errorsMessagesData.body.errorsMessages[0].field).toEqual('name')
        expect(errorsMessagesData.body.errorsMessages[1].field).toEqual('description')
        expect(errorsMessagesData.body.errorsMessages[2].field).toEqual('websiteUrl')
    })

    const correctBlogBodyForUpdate = {
        name: 'was changed', // min 3 max 15
        description: 'description was changed', // min 3 max 500
        websiteUrl: 'www.changedUrl.com' // min 3 max 100 pattern ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    }
    it('should update created blog', async () => {
        await request(app)
            .put(`${baseURL}blogs/${createdBlogId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlogBodyForUpdate)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const blogData = await request(app)
            .get(`${baseURL}blogs/${createdBlogId}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(blogData.body.name).toEqual(correctBlogBodyForUpdate.name)
        expect(blogData.body.description).toEqual(correctBlogBodyForUpdate.description)
        expect(blogData.body.websiteUrl).toEqual(correctBlogBodyForUpdate.websiteUrl)
    })

    const correctPostBody = {
        title: 'correct title', // min: 3, max: 30 
        shortDescription: 'short desc', // min: 3, max: 100
        content: 'content' // min: 3, max: 1000
    }
    it('should create post for current blog', async () => {
        await request(app)
            .post(`${baseURL}blogs/${createdBlogId}/posts`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctPostBody)
            .expect(HTTP_STATUSES.CREATED_201)

        const postsForBlogData = await request(app)
            .get(`${baseURL}blogs/${createdBlogId}/posts`)
            .expect(HTTP_STATUSES.OK_200)

        expect(postsForBlogData.body.items.length).toEqual(1)
        expect(postsForBlogData.body.items[0].title).toEqual(correctPostBody.title)
        expect(postsForBlogData.body.items[0].shortDescription).toEqual(correctPostBody.shortDescription)
        expect(postsForBlogData.body.items[0].content).toEqual(correctPostBody.content)
    })
})