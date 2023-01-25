import request from 'supertest'
import { app, HTTP_STATUSES } from "../../src/app"
import { BlogInputModel } from '../../src/models/blogs/BlogInputModel'
import { BlogViewModel } from '../../src/models/blogs/BlogViewModel'

const baseURL = '/homework02/'

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`${baseURL}testing/all-data`)
    })

    it('shoul\'nt create blog with incorrect auth key', async () => {
        const data1: BlogInputModel = {
            name: 'blogName',
            description: 'blog description',
            websiteUrl: 'https://justSeme.com'
        }

        await request(app)
            .post(`${baseURL}blogs`)
            .set('Authorization', 'YWRtaW46cXdlcnR5')
            .send(data1)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .get(`${baseURL}blogs`)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should\'nt create blog with incorrect input data', async () => {
        const data1: BlogInputModel = {
            name: 'over15symbolssssssssssssss',
            description: 'blog description',
            websiteUrl: 'https://justSeme.com'
        }
        const data2: BlogInputModel = {
            name: '',
            description: 'blog description',
            websiteUrl: 'https://justSeme.com'
        }

        await request(app)
            .post(`${baseURL}blogs`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post(`${baseURL}blogs`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${baseURL}blogs`)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should\'nt create blog with incorrect input data', async () => {
        const data1: BlogInputModel = {
            name: 'justBlog',
            description: 'blog description',
            websiteUrl: 'htt//justSeme'
        }
        const data2: BlogInputModel = {
            name: 'justBlog',
            description: 'blog description',
            websiteUrl: 'https://over100symbolssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss+sssssssssssssssssssssssssssssssssssssssssss.com'
        }

        await request(app)
            .post(`${baseURL}blogs`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post(`${baseURL}blogs`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${baseURL}blogs`)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdBlog: BlogViewModel
    it('should create blog with correct input data', async () => {
        const data1: BlogInputModel = {
            name: 'blogName',
            description: 'blog description',
            websiteUrl: 'https://justSeme.com'
        }

        const createdResponse = await request(app)
            .post(`${baseURL}blogs`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data1)
            .expect(HTTP_STATUSES.CREATED_201)

        createdBlog = createdResponse.body

        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: data1.name,
            description: data1.description,
            websiteUrl: data1.websiteUrl,
            createdAt: expect.any(String)
        })
    })

    it('should return the blog you are looking for by id', async () => {
        await request(app)
            .get(`${baseURL}blogs/${createdBlog.id}`)
            .expect(HTTP_STATUSES.OK_200, createdBlog)
    })

    it('should\'nt return the blog with incorrect id', async () => {
        await request(app)
            .get(`${baseURL}blogs/-1000`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should\'nt update the blog with incorrect input data', async () => {
        const data1: BlogInputModel = {
            name: 'updated name over15 symbolssssssssssss',
            description: 'updated desc',
            websiteUrl: 'https://updatedUrl.com'
        }
        const data2: BlogInputModel = {
            name: '',
            description: 'updated desc',
            websiteUrl: 'https://updatedUrl.com'
        }
        const correctData: BlogInputModel = {
            name: 'justSeme',
            description: 'updated desc',
            websiteUrl: 'https://updatedUrl.com'
        }

        await request(app)
            .put(`${baseURL}blogs/${createdBlog.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`${baseURL}blogs/${createdBlog.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`${baseURL}blogs/${createdBlog.id}`)
            .set('Authorization', 'WRtaW46cXdlcnR5')
            .send(correctData)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .get(`${baseURL}blogs/${createdBlog.id}`)
            .expect(HTTP_STATUSES.OK_200, createdBlog)
    })

    it('should\'nt update the blog with incorrect input data', async () => {
        const data1: BlogInputModel = {
            name: 'justSeme',
            description: 'updated desc',
            websiteUrl: 'ht//updatedUrl.com'
        }
        const data2: BlogInputModel = {
            name: 'justSeme',
            description: 'updated desc',
            websiteUrl: ''
        }

        await request(app)
            .put(`${baseURL}blogs/${createdBlog.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .put(`${baseURL}blogs/${createdBlog.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${baseURL}blogs/${createdBlog.id}`)
            .expect(HTTP_STATUSES.OK_200, createdBlog)
    })

    it('should\'nt delete blog without auth', async () => {
        await request(app)
            .delete(`${baseURL}blogs/${createdBlog.id}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .get(`${baseURL}blogs/${createdBlog.id}`)
            .expect(HTTP_STATUSES.OK_200, createdBlog)
    })

    it('should update the blog with correct input data', async () => {
        const data1: BlogInputModel = {
            name: 'updated name',
            description: 'updated desc',
            websiteUrl: 'https://updatedUrl.com'
        }

        await request(app)
            .put(`${baseURL}blogs/${createdBlog.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data1)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${baseURL}blogs/${createdBlog.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...data1,
                id: createdBlog.id,
                createdAt: createdBlog.createdAt
            })
    })

    it('should\'nt delete blog with incorrect id', async () => {
        await request(app)
            .delete(`${baseURL}blogs/-1000`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should delete blog with correct id', async () => {
        await request(app)
            .delete(`${baseURL}blogs/${createdBlog.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${baseURL}blogs/${createdBlog.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
})