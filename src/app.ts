import express, { Response, Request, NextFunction } from 'express'
import { videosRepository } from './repositories/videos-repository'
import { videosRouter } from './routes/videos-router'
import { blogsRouter } from './routes/blogs-router'
import { blogsRepository } from './repositories/blogs-repository'

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
    UNAUTHORIZED_401: 401
}

const authGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(req.query.token !== '123') {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }
    next()
}

let requestsCounter = 0

const requestCounterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    requestsCounter++
    next()
}

app.use(requestCounterMiddleware)
//app.use(authGuardMiddleware)

app.use('/homework01/videos', videosRouter)
app.use('/homework02/blogs', blogsRouter)

app.delete('/homework01/testing/all-data', (req: Request, res: Response) => {
    videosRepository.deleteVideo(null)
    blogsRepository
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})