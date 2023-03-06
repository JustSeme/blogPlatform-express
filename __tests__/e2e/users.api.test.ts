import request from 'supertest'
import { HTTP_STATUSES } from '../../src/app'
import { UserInputModel } from '../../src/models/users/UserInputModel'
import { app } from '../../src/settings'

const baseURL = '/homeworks/users'

describe('/users', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`/homeworks/testing/all-data`)
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
        const response = await request(app)
            .post(`${baseURL}`)
            .send(correctUserInputData)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        console.log(response.body);

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

    it('should create new user with basic auth token', async () => {
        const response = await request(app)
            .post(`${baseURL}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctUserInputData)
            .expect(HTTP_STATUSES.CREATED_201)

        const { id, login, email, createdAt } = response.body
        console.log(response.body);

        expect(id).not.toBe(null)
        expect(login).not.toBe(null)
        expect(email).not.toBe(null)
        expect(createdAt).not.toBe(null)
    })


})