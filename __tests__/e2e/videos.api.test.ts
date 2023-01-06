import request from 'supertest'
import { app, HTTP_STATUSES } from '../../src/app'
import { CreateVideoInputModel } from '../../src/models/CreateVideoInputModel'
import { resolutions, resolutionsList, VideoViewModel } from '../../src/models/VideoViewModel'

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

        expect(createResponse1.body.errorMessages).toEqual([{
            message: 'Max length of title = 40',
            field: 'Title'
        }])

        const createResponse2 = await request(app)
            .post(`${baseURL}videos`)
            .send(data2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(createResponse2.body.errorMessages).toEqual([{
            message: 'Field is empty',
            field: 'Title'
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

        expect(createResponse1.body.errorMessages).toEqual([{
            message: 'Max length of author = 20',
            field: 'Author'
        }])

        const createResponse2 = await request(app)
            .post(`${baseURL}videos`)
            .send(data2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(createResponse2.body.errorMessages).toEqual([{
            message: 'Field is empty',
            field: 'Author'
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

        expect(createResponse1.body.errorMessages).toEqual([{
            message: 'Field is incorrect',
            field: 'AvailableResolutions'
        }])

        const createResponse2 = await request(app)
            .post(`${baseURL}videos`)
            .send(data2)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(createResponse2.body.errorMessages).toEqual([{
            message: 'Field is empty',
            field: 'AvailableResolutions'
        }])

        await request(app)
            .get(`${baseURL}videos`)
            .expect(200, [])
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
            minAgeRestriction: expect.any(Boolean),
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: expect.any(Array)
        })
        expect(responsedResolutions.length > 0).toBe(true)
    })

    it('should be return the video you are looking for by id', async () => {
        await request(app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(HTTP_STATUSES.OK_200, createdVideo)
    } )

    it('shold be return all videos', async () => {
        await request(app)
            .get(`${baseURL}videos`)
            
    })
})