import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import { videosRepository } from './repositories/videos-in-memory-repository'
import { videosRouter } from './routes/videos-router'
import { blogsRouter } from './features/blogs/api/routes/blogs-router'
import { postsRouter } from './features/blogs/api/routes/posts-router'
import { usersRouter } from './features/users/api/routes/users-router'
import { authRouter } from './routes/auth-router'
import { commentsRouter } from './features/blogs/api/routes/comments-router'
import { securityRouter } from './routes/security-router'
import { AttemptsModel, BlogsModel, PostsModel, UsersModel } from "./repositories/db"

const username = "justSeme"
const password = "RMMXpX1hUlXqbKED"

let mongoDBname = 'blog_platform'

export const settings = {
    mongoURI: process.env.mongoURI || `mongodb+srv://${username}:${password}@cluster86890.fgczccf.mongodb.net/${mongoDBname}?retryWrites=true&w=majority`,
    JWT_SECRET: process.env.JWT_SECRET || 'super_secret',
    PORT: process.env.PORT || 3000,
    GMAIL_LOGIN: process.env.GMAIL_LOGIN || 'kepxep69@gmail.com',
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || 'gpllbohdhqcrdvnh',
    ACCESS_TOKEN_EXPIRE_TIME: '5min',
    REFRESH_TOKEN_EXPIRE_TIME: '20min',
}

export const baseURL = '/homeworks/'

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    TOO_MANY_REQUESTS_429: 429,

    NOT_IMPLEMENTED_501: 501
}

export const app = express()
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
app.use(cookieParser())
app.set('trust proxy', true)

app.use('/homeworks/videos', videosRouter)

app.use('/homeworks/blogs', blogsRouter)
app.use('/homeworks/posts', postsRouter)

app.use('/homeworks/users', usersRouter)
app.use('/homeworks/auth', authRouter)

app.use('/homeworks/comments', commentsRouter)

app.use('/homeworks/security', securityRouter)

app.delete('/homework01/testing/all-data', async (req: Request, res: Response) => {
    await videosRepository.deleteVideo(null)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.delete('/homeworks/testing/all-data', async (req: Request, res: Response) => {
    await PostsModel.deleteMany({})
    await BlogsModel.deleteMany({})
    await UsersModel.deleteMany({})
    await AttemptsModel.deleteMany({})
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})