import request from 'supertest'
import { server } from '../../src/app'
import { app, HTTP_STATUSES, baseURL } from '../../src/settings'
import { PostInputModel } from '../../src/models/posts/PostInputModel'
import { BlogInputModel } from '../../src/models/blogs/BlogInputModel'
import { CommentInputModel } from '../../src/models/comments/CommentInputModel'

describe('/comments', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`/homeworks/testing/all-data`)
    })

    afterEach(async () => {
        await server.close()
    })

    let recievedAccessToken = ''

    const createUserInputData = {
        login: 'login',
        password: 'password',
        email: 'email@email.ru'
    }

    it('should create user and should login, getting accessToken', async () => {
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

    const correctCommentBody: CommentInputModel = {
        content: 'this content should be a correct' // min 20 max 300
    }

    const incorrectCommentBody: CommentInputModel = {
        content: '<20 chars' // min 20 max 300
    }

    let createdCommentId = ''

    it('should create comment for created post', async () => {
        const createdCommentResponseData = await request(app)
            .post(`${baseURL}posts/${postId}/comments`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send(correctCommentBody)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCommentId = createdCommentResponseData.body.id
    })

    it('shouldn\'t create comment for created post', async () => {
        await request(app)
            .post(`${baseURL}posts/${postId}/comments`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send(incorrectCommentBody)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })

    it('should get created comment by id', async () => {
        const recievedCommentData = await request(app)
            .get(`${baseURL}comments/${createdCommentId}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(recievedCommentData.body.content).toEqual(correctCommentBody.content)
        expect(recievedCommentData.body.commentatorInfo.userLogin).toEqual(createUserInputData.login)
    })

    it('shouldn\'t get comment by id if it doesn\'t exist', async () => {
        await request(app)
            .get(`${baseURL}comments/12345`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })


    it('shouldn\'t update comment by id if access token is incorrect', async () => {
        const responseData = await request(app)
            .put(`${baseURL}comments/${createdCommentId}`)
            .set('Authorization', `Bearer incorrect`)
            .send({
                content: 'this comment wasn\'t be updated'
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        expect(responseData.body)

        const updatedCommentData = await request(app)
            .get(`${baseURL}comments/${createdCommentId}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(updatedCommentData.body.content).toEqual(correctCommentBody.content)
    })

    it('should update comment by id', async () => {
        await request(app)
            .put(`${baseURL}comments/${createdCommentId}`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send({
                content: 'this comment was be updated'
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const updatedCommentData = await request(app)
            .get(`${baseURL}comments/${createdCommentId}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(updatedCommentData.body.content).toEqual('this comment was be updated')
    })

    it('should return 400 code, trying like comment with incorrect value', async () => {
        await request(app)
            .put(`${baseURL}comments/${createdCommentId}/like-status`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send({
                likeStatus: 'incorrect' // correct: Like, Dislike, None
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })

    it('should return 401 code, tring like comment without bearer auth', async () => {
        await request(app)
            .put(`${baseURL}comments/${createdCommentId}/like-status`)
            .set('Authorization', `Bearer token`)
            .send({
                likeStatus: 'Like'
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('should return 404 code, trying like non-exist comment', async () => {
        await request(app)
            .put(`${baseURL}comments/12345/like-status`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send({
                likeStatus: 'Like'
            })
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('shouldn\'t like created comment without authorization', async () => {
        await request(app)
            .put(`${baseURL}comments/${createdCommentId}/like-status`)
            .send({
                likeStatus: 'Like'
            })
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('shouldn\'t like created comment with incorrect input data', async () => {
        const response = await request(app)
            .put(`${baseURL}comments/${createdCommentId}/like-status`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send({
                likeStatus: 'incorrect'
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(response.body).toEqual({
            errorsMessages: [{
                message: 'likeStatus is incorrect',
                field: 'likeStatus'
            }]
        })
    })

    it('should like created comment and display correct like info', async () => {
        await request(app)
            .put(`${baseURL}comments/${createdCommentId}/like-status`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send({
                likeStatus: 'Like'
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        const likedCommentData = await request(app)
            .get(`${baseURL}comments/${createdCommentId}`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(likedCommentData.body.likesInfo.likesCount).toEqual(1)
        expect(likedCommentData.body.likesInfo.dislikesCount).toEqual(0)
        expect(likedCommentData.body.likesInfo.myStatus).toEqual('Like')
    })

    it('should switch Like to Dislike and display correct like info', async () => {
        await request(app)
            .put(`${baseURL}comments/${createdCommentId}/like-status`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send({
                likeStatus: 'Dislike'
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        const likedCommentData = await request(app)
            .get(`${baseURL}comments/${createdCommentId}`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(likedCommentData.body.likesInfo.likesCount).toEqual(0)
        expect(likedCommentData.body.likesInfo.dislikesCount).toEqual(1)
        expect(likedCommentData.body.likesInfo.myStatus).toEqual('Dislike')
    })

    it('should set None instead of Like/Dislike and display correct like info', async () => {
        await request(app)
            .put(`${baseURL}comments/${createdCommentId}/like-status`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send({
                likeStatus: 'None'
            })
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        const likedCommentData = await request(app)
            .get(`${baseURL}comments/${createdCommentId}`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(likedCommentData.body.likesInfo.likesCount).toEqual(0)
        expect(likedCommentData.body.likesInfo.dislikesCount).toEqual(0)
        expect(likedCommentData.body.likesInfo.myStatus).toEqual('None')
    })

    it('should delete comment by id', async () => {
        await request(app)
            .delete(`${baseURL}comments/${createdCommentId}`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${baseURL}comments/${createdCommentId}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('shouldn\'t delete comment by id if it is already deleted', async () => {
        await request(app)
            .delete(`${baseURL}comments/${createdCommentId}`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
})
