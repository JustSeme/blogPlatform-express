import request from 'supertest'
import { app, HTTP_STATUSES } from '../../src/app'
import { CreateVideoInputModel } from '../../src/models/videos/CreateVideoInputModel'
import { UpdateVideoInputModel } from '../../src/models/videos/UpdateVideoInputModel'
import { resolutions, resolutionsList, VideoViewModel } from '../../src/models/videos/VideoViewModel'

const baseURL = '/homework01/'

describe('/videos', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`${baseURL}testing/all-data`)
    })

    it('should\'nt create video with incorrect title', async () => {
        const data1: CreateVideoInputModel = {
            title: 'Hello world and Hello JavaScript Im just want 40+ symbols in this title',
            author: 'justSeme',
            availableResolutions: ['P144', 'P1080', 'P2160']
        }
        const data2: CreateVideoInputModel = {
            title: '',
            author: 'justSeme',
            availableResolutions: ['P144', 'P1080', 'P2160']
        }

        const createResponse1 = await request(app)
            .post(`${baseURL}videos`)
            .send(data1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(createResponse1.body.errorsMessages).toEqual([{
            message: 'field is incorrect',
            field: 'title'
        }])

        const createResponse2 = await request(app)
            .post(`${baseURL}videos`)
            .send(data2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(createResponse2.body.errorsMessages).toEqual([{
            message: 'field is incorrect',
            field: 'title'
        }])

        await request(app)
            .get(`${baseURL}videos`)
            .expect(200, [])
    })

    it('should\'nt create video with incorrect author', async () => {
        const data1: CreateVideoInputModel = {
            title: 'Hello world',
            author: 'justSemejustSemejustSemejustSemejustSemejustSeme',
            availableResolutions: ['P144', 'P1080', 'P2160']
        }
        const data2: CreateVideoInputModel = {
            title: 'Hello world',
            author: '',
            availableResolutions: ['P144', 'P1080', 'P2160']
        }

        const createResponse1 = await request(app)
            .post(`${baseURL}videos`)
            .send(data1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(createResponse1.body.errorsMessages).toEqual([{
            message: 'field is incorrect',
            field: 'author'
        }])

        const createResponse2 = await request(app)
            .post(`${baseURL}videos`)
            .send(data2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(createResponse2.body.errorsMessages).toEqual([{
            message: 'field is incorrect',
            field: 'author'
        }])

        await request(app)
            .get(`${baseURL}videos`)
            .expect(200, [])
    })

    it('should\'nt create video with incorrect availableResolutions', async () => {
        const data1 = {
            title: 'Hello world',
            author: 'justSeme',
            availableResolutions: ['P144', 'P1080', 'maan, I was wrong']
        }
        const data2: CreateVideoInputModel = {
            title: 'Hello world',
            author: 'justSeme',
            availableResolutions: []
        }

        const createResponse1 = await request(app)
            .post(`${baseURL}videos`)
            .send(data1)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(createResponse1.body.errorsMessages).toEqual([{
            message: 'field is incorrect',
            field: 'availableResolutions'
        }])

        const createResponse2 = await request(app)
            .post(`${baseURL}videos`)
            .send(data2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(createResponse2.body.errorsMessages).toEqual([{
            message: 'field is incorrect',
            field: 'availableResolutions'
        }])

        await request(app)
            .get(`${baseURL}videos`)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdVideo: VideoViewModel
    it('should be create video with correct input data', async () => {
        const data: CreateVideoInputModel = {
            title: 'Hello world',
            author: 'justSeme',
            availableResolutions: ['P144', 'P1080', 'P2160']
        }
        const createResponse = await request(app)
            .post(`${baseURL}videos`)
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdVideo = createResponse.body
        const responsedResolutions = createdVideo.availableResolutions

        responsedResolutions.filter((key: resolutions) => resolutionsList.some(val => val === key))

        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title: 'Hello world',
            author: 'justSeme',
            canBeDownloaded: expect.any(Boolean),
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: expect.any(Array)
        })
        expect(responsedResolutions.length > 0).toBe(true)
    })

    it('should return the video you are looking for by id', async () => {
        await request(app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(HTTP_STATUSES.OK_200, createdVideo)
    })

    it('should\'nt return the video with incorrect id', async () => {
        await request(app)
            .get(`${baseURL}videos/-1000`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('sholud\'nt update video with incorrect input availableResolutions', async () => {
        const data = {
            title: 'Hello Samurais!',
            author: 'IT-KAMASUTRA',
            availableResolutions: ['123', 'P240', 'P360'],
            canBeDownloaded: false,
            minAgeRestriction: 16,
            publicationDate: new Date().toISOString()
        }
        await request(app)
            .put(`${baseURL}videos/${createdVideo.id}`)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        const recievedResponse = await request(app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(recievedResponse.body).toEqual(createdVideo)
    })

    it('sholud\'nt update video with incorrect input publicationDate', async () => {
        const data = {
            title: 'Hello Samurais!',
            author: 'IT-KAMASUTRA',
            availableResolutions: ['P144', 'P240', 'P360'],
            canBeDownloaded: false,
            minAgeRestriction: 16,
            publicationDate: 123
        }
        await request(app)
            .put(`${baseURL}videos/${createdVideo.id}`)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        const recievedResponse = await request(app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(recievedResponse.body).toEqual(createdVideo)
    })

    it('sholud\'nt update video with incorrect param id', async () => {
        const data = {
            title: 'Hello Samurais!',
            author: 'IT-KAMASUTRA',
            availableResolutions: ['P144', 'P240', 'P360'],
            canBeDownloaded: false,
            minAgeRestriction: 16,
            publicationDate: new Date().toISOString()
        }
        await request(app)
            .put(`${baseURL}videos/-1000`)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        const recievedResponse = await request(app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(recievedResponse.body).toEqual(createdVideo)
    })

    it('sholud update video with correct input data', async () => {
        const data: UpdateVideoInputModel = {
            title: 'Hello Samurais!',
            author: 'IT-KAMASUTRA',
            availableResolutions: ['P144', 'P240', 'P360'],
            canBeDownloaded: false,
            minAgeRestriction: 16,
            publicationDate: new Date().toISOString()
        }
        await request(app)
            .put(`${baseURL}videos/${createdVideo.id}`)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const recievedResponse = await request(app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(recievedResponse.body).toEqual({
            ...data,
            id: createdVideo.id,
            createdAt: createdVideo.createdAt
        })
    })

    it('should delete video with correct id', async () => {
        await request(app)
            .delete(`${baseURL}videos/${createdVideo.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should\'nt delete video with incorrect id', async () => {
        await request(app)
            .delete(`${baseURL}videos/-1000`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(`${baseURL}videos/-1000}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should return all videos', async () => {
        await request(app)
            .get(`${baseURL}videos`)
    })
})