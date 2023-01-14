import request from 'supertest'
import { app } from "../../src/app"


const baseURL = '/homework02/'

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`${baseURL}/testing/all-data`)
    })

    
})