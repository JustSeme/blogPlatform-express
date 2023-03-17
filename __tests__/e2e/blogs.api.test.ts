import { baseURL, HTTP_STATUSES } from "../../src/settings";
import request from 'supertest'
import { server } from '../../src/app'
import { app } from "../../src/settings";

/* describe('/blogs', () => {
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

    it('should create new blog with correct input data', () => {
        request(app)
            .post(`${baseURL}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.CREATED_201)

        // get blog
    })
}) */