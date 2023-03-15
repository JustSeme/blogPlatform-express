import request from 'supertest'
import { HTTP_STATUSES, server } from '../../src/app'
import { PostInputModel } from '../../src/models/posts/PostInputModel'
import { BlogInputModel } from '../../src/models/blogs/BlogInputModel'
import { CommentInputModel } from '../../src/models/comments/CommentInputModel'
import { app } from '../../src/settings'
import { jwtService } from '../../src/application/jwtService'

const baseURL = '/homeworks/'

describe('/comments', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`/homeworks/testing/all-data`)
    })

    afterAll(async () => {
        await server.close()
    })

    const correctCommentBody: CommentInputModel = {
        content: 'this content should be a correct' // min 20 max 300
    }

    let recievedAccessToken = ''

    it('should create user and should login, getting accessToken', async () => {
        const createUserInputData = {
            login: 'login',
            password: 'password',
            email: 'email@email.ru'
        }
        await request(app)
            .post(`${baseURL}users`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(createUserInputData)
            .expect(HTTP_STATUSES.CREATED_201)

        const accessTokenResponseData = await request(app)
            .post(`${baseURL}auth/login`)
            .send({
                loginOrEmail: createUserInputData.login,
                password: createUserInputData.password
            })
            .expect(HTTP_STATUSES.OK_200)
        recievedAccessToken = accessTokenResponseData.body.accessToken
    })

    let postId = ''

    it('should create blog and post for it ', async () => {
        const correctBlogBody: BlogInputModel = {
            name: 'name', //min 3 max 15
            description: 'description', // min 3 max 500
            websiteUrl: 'http://anyurl.com' // min 3 max 100, pattern ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
        }

        const createdBlogResponse = await request(app)
            .post(`${baseURL}blogs`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlogBody)
            .expect(HTTP_STATUSES.CREATED_201)

        const correctPostBody: PostInputModel = {
            title: 'postTitle', // min 3 max 30
            shortDescription: 'shortDescription', // min 3 max 100
            content: 'anyContent', // min 3 max 1000
            blogId: ''
        }
        correctPostBody.blogId = createdBlogResponse.body.id

        const createdPostResponseData = await request(app)
            .post(`${baseURL}posts`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(correctPostBody)
            .expect(HTTP_STATUSES.CREATED_201)

        expect(createdPostResponseData.body)

        postId = createdPostResponseData.body.id
    })

    it('should create comment for created post', async () => {
        await request(app)
            .post(`${baseURL}posts/${postId}/comments`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send(correctCommentBody)
            .expect(HTTP_STATUSES.CREATED_201)
    })
})