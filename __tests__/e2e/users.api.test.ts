import request from 'supertest'
import { server } from '../../src/app'
import { HTTP_STATUSES } from '../../src/settings'
import { UserInputModel } from '../../src/features/auth/application/dto/UserInputModel'
import { app } from '../../src/settings'

const baseURL = '/homeworks/users'

const generateEmail = (str: string) => `${str}@mail.ru`

describe('/users', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`/homeworks/testing/all-data`)
    })

    afterAll(async () => {
        await server.close()
    })

    const correctUserInputData: UserInputModel = {
        login: 'justSeme',
        password: '123123123',
        email: 'semyn03@mail.ru'
    }

    const incorrectUserInputData: UserInputModel = {
        login: 'overTenSymbols',
        password: 'overTwentySymbolsForItsToBeIncorrect',
        email: 'itsJustNotEmail"email,com'
    }

    it(`shouldn't create new user without basic auth token`, async () => {
        await request(app)
            .post(`${baseURL}`)
            .send(correctUserInputData)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't create new user with incorrect input data`, async () => {
        const response = await request(app)
            .post(`${baseURL}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectUserInputData)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(response.body).toEqual({
            errorsMessages: [
                {
                    "message": "Invalid value",
                    "field": "login"
                },
                {
                    "message": "Invalid value",
                    "field": "password"
                },
                {
                    "message": "Invalid value",
                    "field": "email"
                }
            ]
        })
    })

    let createdUser: any
    it('should create new user with basic auth token', async () => {
        const response = await request(app)
            .post(`${baseURL}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctUserInputData)
            .expect(HTTP_STATUSES.CREATED_201)

        const { id, login, email, createdAt } = response.body
        createdUser = response.body

        expect(typeof id).toBe('string')
        expect(typeof login).toBe('string')
        expect(typeof email).toBe('string')
        expect(typeof createdAt).toBe('string')
    })

    it('should return array with one created user', async () => {
        const response = await request(app)
            .get(`${baseURL}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200)

        expect(response.body.totalCount === 1).toBe(true)
        expect(response.body.items[0]).toEqual(createdUser)
    })

    let id1: string, id2: string, id3: string
    it('should create three users and return error if email adress and login is already use', async () => {
        const firstUser = {
            login: 'abc',
            password: '123123123',
            email: generateEmail('JohnCena')
        }
        const secondUser = {
            login: 'def',
            password: '123123123',
            email: generateEmail('JohnDoe')
        }
        const thirdUser = {
            login: 'ghi',
            password: '123123123',
            email: generateEmail('justCena')
        }

        const response1 = await request(app)
            .post(`${baseURL}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(firstUser)
            .expect(HTTP_STATUSES.CREATED_201)
        expect(typeof response1.body.id).toBe('string')
        id1 = response1.body.id

        const response2 = await request(app)
            .post(`${baseURL}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(secondUser)
            .expect(HTTP_STATUSES.CREATED_201)
        expect(typeof response2.body.id).toBe('string')
        id2 = response2.body.id

        const response3 = await request(app)
            .post(`${baseURL}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(thirdUser)
            .expect(HTTP_STATUSES.CREATED_201)
        expect(typeof response3.body.id).toBe('string')
        id3 = response3.body.id

        const response4 = await request(app)
            .post(`${baseURL}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(secondUser)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        expect(response4.body).toEqual({
            errorsMessages: [
                {
                    "message": "Login already in use",
                    "field": "login"
                },
                {
                    "message": "Email already in use",
                    "field": "email"
                }
            ]
        })
    })

    it('should return array of users with asc sorting for login', async () => {
        const response = await request(app)
            .get(`${baseURL}?sortDirection=asc&sortBy=login`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200)

        expect(response.body.totalCount === 4).toBe(true)

        expect(response.body.items[0].id).toEqual(id1)
        expect(response.body.items[1].id).toEqual(id2)
        expect(response.body.items[2].id).toEqual(id3)
        expect(response.body.items[3].id).toEqual(createdUser.id)
    })

    it('should return two users with email regex John', async () => {
        const response = await request(app)
            .get(`${baseURL}?searchEmailTerm=John&sortDirection=asc`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200)

        expect(response.body.totalCount === 2).toBe(true)

        expect(response.body.items[0].id).toBe(id1)
        expect(response.body.items[1].id).toBe(id2)
    })

    it('should delete two users by id', async () => {
        await request(app)
            .delete(`${baseURL}/${id1}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .delete(`${baseURL}/${id2}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const response = await request(app)
            .get(`${baseURL}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200)

        expect(response.body.totalCount === 2).toBe(true)
    })

    it('should return a error if user is already deleted', async () => {
        await request(app)
            .delete(`${baseURL}/${id1}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
})