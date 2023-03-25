import request from 'supertest'
import { server } from '../../src/app'
import { BlogInputModel } from '../../src/models/blogs/BlogInputModel'
import { CommentInputModel } from '../../src/models/comments/CommentInputModel'
import { LikeInputModel } from '../../src/models/comments/LikeInputModel'
import { PostInputModel } from '../../src/models/posts/PostInputModel'
import { app, HTTP_STATUSES, baseURL } from '../../src/settings'

describe('/posts', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`/homeworks/testing/all-data`)
    })

    let counter = 0
    afterEach(async () => {
        console.log(counter++);
        await server.close()
    })

    const correctBlogBody: BlogInputModel = {
        name: 'name',
        description: 'desc',
        websiteUrl: 'www.website.com'
    }

    let recievedAccessToken = ''
    let secondAccessToken = ''
    let thirdAccessToken = ''

    const createUserInputData = {
        login: 'firstLogin',
        password: 'password',
        email: 'email@email.ru'
    }
    const secondUserInputData = {
        login: 'secondLogi',
        password: 'password',
        email: 'email2@email.ru'
    }
    const thirdUserInputData = {
        login: 'thirdLogin',
        password: 'password',
        email: 'email3@email.ru'
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

    it('should create user and should login, getting second accessToken', async () => {
        const res = await request(app)
            .post(`${baseURL}users`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(secondUserInputData)
            .expect(HTTP_STATUSES.CREATED_201)

        const accessTokenResponseData = await request(app)
            .post(`${baseURL}auth/login`)
            .send({
                loginOrEmail: secondUserInputData.login,
                password: secondUserInputData.password
            })
            .expect(HTTP_STATUSES.OK_200)
        secondAccessToken = accessTokenResponseData.body.accessToken
    })

    it('should create user and should login, getting the thirdd accessToken', async () => {
        await request(app)
            .post(`${baseURL}users`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(thirdUserInputData)
            .expect(HTTP_STATUSES.CREATED_201)

        const accessTokenResponseData = await request(app)
            .post(`${baseURL}auth/login`)
            .send({
                loginOrEmail: thirdUserInputData.login,
                password: thirdUserInputData.password
            })
            .expect(HTTP_STATUSES.OK_200)
        thirdAccessToken = accessTokenResponseData.body.accessToken
    })

    let blogId = ''
    it('should create blog to get blogId ', async () => {
        const createdBlogData = await request(app)
            .post(`${baseURL}blogs`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(correctBlogBody)
            .expect(HTTP_STATUSES.CREATED_201)

        blogId = createdBlogData.body.id
    })

    it('shouldn\'t create post without basic auth', async () => {
        await request(app)
            .post(`${baseURL}posts`)
            .send(incorrectPostBody)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    const incorrectPostBody = {
        title: 'this title will be a over 30 symbols', // min 3 max 30
        shortDescription: 'in', // min: 3, max: 100 
        content: 'co', // min: 3, max: 1000 
        blogId: 'notABlogId'
    }

    it('shouldn\'t create post with incorrect input data', async () => {
        const errorsMessagesData = await request(app)
            .post(`${baseURL}posts`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(incorrectPostBody)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessagesData.body.errorsMessages[0].field).toEqual('title')
        expect(errorsMessagesData.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(errorsMessagesData.body.errorsMessages[2].field).toEqual('content')
        expect(errorsMessagesData.body.errorsMessages[3].field).toEqual('blogId')
        expect(errorsMessagesData.body.errorsMessages[3].message).toEqual('blog by blogId not found')
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
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(gettedPostData.body.title).toEqual(correctPostBody.title)
        expect(gettedPostData.body.shortDescription).toEqual(correctPostBody.shortDescription)
        expect(gettedPostData.body.content).toEqual(correctPostBody.content)
        expect(gettedPostData.body.blogId).toEqual(correctPostBody.blogId)
    })

    it('shouldn\'t update created post with incorrect input data', async () => {
        const errorsMessagesData = await request(app)
            .put(`${baseURL}posts/${createdPostId}`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(incorrectPostBody)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessagesData.body.errorsMessages[0].field).toEqual('title')
        expect(errorsMessagesData.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(errorsMessagesData.body.errorsMessages[2].field).toEqual('content')
        expect(errorsMessagesData.body.errorsMessages[3].field).toEqual('blogId')
        expect(errorsMessagesData.body.errorsMessages[3].message).toEqual('blog by blogId not found')

        const updatedPostData = await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(updatedPostData.body.title).toEqual(correctPostBody.title)
        expect(updatedPostData.body.shortDescription).toEqual(correctPostBody.shortDescription)
        expect(updatedPostData.body.content).toEqual(correctPostBody.content)
    })

    it('shouldn\'t update created post without basic auth', async () => {
        await request(app)
            .put(`${baseURL}posts/${createdPostId}`)
            .send(correctUpdatePostBody)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        const updatedPostData = await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(updatedPostData.body.title).toEqual(correctPostBody.title)
        expect(updatedPostData.body.shortDescription).toEqual(correctPostBody.shortDescription)
        expect(updatedPostData.body.content).toEqual(correctPostBody.content)
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
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(updatedPostData.body.title).toEqual(correctUpdatePostBody.title)
        expect(updatedPostData.body.shortDescription).toEqual(correctUpdatePostBody.shortDescription)
        expect(updatedPostData.body.content).toEqual(correctUpdatePostBody.content)
    })

    const correctCommentBody: CommentInputModel = {
        content: 'this content will over 20 symbols' // min 20 max 300
    }
    it('should create comment for current post and display correct info', async () => {
        await request(app)
            .post(`${baseURL}posts/${createdPostId}/comments`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send(correctCommentBody)
            .expect(HTTP_STATUSES.CREATED_201)

        const recievedCreatedCommentsData = await request(app)
            .get(`${baseURL}posts/${createdPostId}/comments`)
            .expect(HTTP_STATUSES.OK_200)

        expect(recievedCreatedCommentsData.body.items.length).toEqual(1)
        expect(recievedCreatedCommentsData.body.items[0].content).toEqual(correctCommentBody.content)
    })

    it('should dislike current post and display correct info', async () => {
        const dislikeBody: LikeInputModel = {
            likeStatus: 'Dislike'
        }

        await request(app)
            .put(`${baseURL}posts/${createdPostId}/like-status`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send(dislikeBody)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const likedPostData = await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(likedPostData.body.extendedLikesInfo.likesCount).toEqual(0)
        expect(likedPostData.body.extendedLikesInfo.dislikesCount).toEqual(1)
        expect(likedPostData.body.extendedLikesInfo.myStatus).toEqual('Dislike')

        expect(likedPostData.body.extendedLikesInfo.newestLikes.length).toEqual(0)
    })

    it('should set None for current post and display correct info', async () => {
        const noneBody: LikeInputModel = {
            likeStatus: 'None'
        }

        await request(app)
            .put(`${baseURL}posts/${createdPostId}/like-status`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send(noneBody)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const likedPostData = await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(likedPostData.body.extendedLikesInfo.likesCount).toEqual(0)
        expect(likedPostData.body.extendedLikesInfo.dislikesCount).toEqual(0)
        expect(likedPostData.body.extendedLikesInfo.myStatus).toEqual('None')

        expect(likedPostData.body.extendedLikesInfo.newestLikes.length).toEqual(0)
    })
    const likeBody: LikeInputModel = {
        likeStatus: 'Like'
    }

    it('should like current post and display correct info', async () => {
        await request(app)
            .put(`${baseURL}posts/${createdPostId}/like-status`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .send(likeBody)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const likedPostData = await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .set('Authorization', `Bearer ${recievedAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(likedPostData.body.extendedLikesInfo.likesCount).toEqual(1)
        expect(likedPostData.body.extendedLikesInfo.dislikesCount).toEqual(0)
        expect(likedPostData.body.extendedLikesInfo.myStatus).toEqual('Like')

        expect(likedPostData.body.extendedLikesInfo.newestLikes[0].login).toEqual(createUserInputData.login)
    })

    it('should like current post and add second like in newestLikes', async () => {
        await request(app)
            .put(`${baseURL}posts/${createdPostId}/like-status`)
            .set('Authorization', `Bearer ${secondAccessToken}`)
            .send(likeBody)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const likedPostData = await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .set('Authorization', `Bearer ${secondAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(likedPostData.body.extendedLikesInfo.likesCount).toEqual(2)
        expect(likedPostData.body.extendedLikesInfo.dislikesCount).toEqual(0)
        expect(likedPostData.body.extendedLikesInfo.myStatus).toEqual('Like')

        expect(likedPostData.body.extendedLikesInfo.newestLikes[0].login).toEqual(createUserInputData.login)
        expect(likedPostData.body.extendedLikesInfo.newestLikes[1].login).toEqual(secondUserInputData.login)
    })

    it('should like current post and add the third like in newestLikes', async () => {
        await request(app)
            .put(`${baseURL}posts/${createdPostId}/like-status`)
            .set('Authorization', `Bearer ${thirdAccessToken}`)
            .send(likeBody)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const likedPostData = await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .set('Authorization', `Bearer ${thirdAccessToken}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(likedPostData.body.extendedLikesInfo.likesCount).toEqual(3)
        expect(likedPostData.body.extendedLikesInfo.dislikesCount).toEqual(0)
        expect(likedPostData.body.extendedLikesInfo.myStatus).toEqual('Like')

        console.log(likedPostData.body.extendedLikesInfo.newestLikes, 'newest likes')

        expect(likedPostData.body.extendedLikesInfo.newestLikes[0].login).toEqual(createUserInputData.login)
        expect(likedPostData.body.extendedLikesInfo.newestLikes[1].login).toEqual(secondUserInputData.login)
        expect(likedPostData.body.extendedLikesInfo.newestLikes[2].login).toEqual(thirdUserInputData.login)
    })

    it('shouldn\'t delete post without basic auth', async () => {
        await request(app)
            .delete(`${baseURL}posts/${createdPostId}`)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .expect(HTTP_STATUSES.OK_200)
    })

    it('shouldn\'t delete post with incorrect postId', async () => {
        await request(app)
            .delete(`${baseURL}posts/12345`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .expect(HTTP_STATUSES.OK_200)
    })

    it('should delete post', async () => {
        await request(app)
            .delete(`${baseURL}posts/${createdPostId}`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${baseURL}posts/${createdPostId}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
})