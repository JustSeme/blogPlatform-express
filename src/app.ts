import express, { Response, Request } from 'express'
import { videosRepository } from './repositories/videos-repository'
import { videosRouter } from './routes/homework01/videos-router'

export const app = express()
const port = 3000
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
}

app.use('/homework01/videos', videosRouter)

app.delete('/homework01/testing/all-data', (req: Request, res: Response) => {
    videosRepository.deleteVideo(null)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})