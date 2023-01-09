import express, { Response, Request } from 'express'
import moment from 'moment'
import { errorMessageGenerator, isIsoDate } from './helpers'
import { CreateVideoInputModel } from './models/CreateVideoInputModel'
import { ErrorMessagesOutputModel } from './models/ErrorMessagesOutputModel'
import { PutVideoInputModel } from './models/PutVideoInputModel'
import { resolutionsList, VideoViewModel } from './models/VideoViewModel'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from './types'

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

let videos: VideoViewModel[] = [
    {
        id: 1,
        title: 'IT=Camasutra practice',
        author: 'Dimych',
        canBeDownloaded: true,
        minAgeRestriction: 16,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: ['P1080', 'P240']
    },
    {
        id: 2,
        title: 'IT=Camasutra practice',
        author: 'Dimych',
        canBeDownloaded: true,
        minAgeRestriction: false,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: ['P480', 'P144', 'P720']
    },
    {
        id: 3,
        title: 'IT=Camasutra practice',
        author: 'Dimych',
        canBeDownloaded: true,
        minAgeRestriction: 18,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: ['P720', 'P2160']
    }
]

app.get('/homework01/videos', (req: Request, res: Response<VideoViewModel[]>) => {
    res.json(videos)
})

app.get('/homework01/videos/:id', (req: RequestWithParams<{ id: number }>,
    res: Response<VideoViewModel>) => {
    const findedVideo = videos.filter(v => v.id === +req.params.id)[0]

    if(!findedVideo) {
        res.sendStatus(404)
    }
    res.json(findedVideo)
})

app.delete('/homework01/videos/:id', (req: RequestWithParams<{ id: number }>,
    res: Response) => {
    const findedVideo = videos.filter(v => v.id === +req.params.id)[0]
    if(!findedVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    videos = videos.filter(v => v.id !== +req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.put('/homework01/videos/:id', (req: RequestWithParamsAndBody<{ id: number }, PutVideoInputModel>, res: Response<ErrorMessagesOutputModel>) => {
    const findedVideoIndex = videos.findIndex(v => v.id === +req.params.id)
    if(findedVideoIndex === -1) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    if(!isIsoDate(req.body.publicationDate)) {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(errorMessageGenerator('Field is incorrect', 'PublicationDate'))
        return
    }

    if(typeof req.body.canBeDownloaded !== 'boolean') {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(errorMessageGenerator('Field is incorrect', 'CanBeDownloaded'))
        return
    }

    if(typeof req.body.minAgeRestriction !== 'boolean' && typeof req.body.minAgeRestriction !== 'number') {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(errorMessageGenerator('Field is incorrect', 'MinAgeRestriction'))
            return
    }

    if(req.body.title.length < 1) {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(errorMessageGenerator('Field is empty', 'Title'))
        return
    }
    if(req.body.title.length > 40) {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(errorMessageGenerator('Max length of title = 40', 'Title'))
        return
    }
    if(req.body.author.length < 1) {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(errorMessageGenerator('Field is empty', 'Author'))
        return
    }
    if(req.body.author.length > 20) {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(errorMessageGenerator('Max length of author = 20', 'Author'))
        return
    }
    if(req.body.availableResolutions.length < 1) {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(errorMessageGenerator('Field is empty', 'AvailableResolutions'))
        return
    }

    const resolutionsLength = req.body.availableResolutions.length
    const filtredResolutionsLength = req.body.availableResolutions.filter(key => resolutionsList
        .some(val => val === key)).length

    if(filtredResolutionsLength !== resolutionsLength) {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(errorMessageGenerator('Field is incorrect', 'AvailableResolutions'))
        return
    }
    
    videos[findedVideoIndex] = {
        ...req.body,
        id: videos[findedVideoIndex].id,
        createdAt: videos[findedVideoIndex].createdAt
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.post('/homework01/videos', (req: RequestWithBody<CreateVideoInputModel>,
    res: Response<VideoViewModel | ErrorMessagesOutputModel>) => {
        if(req.body.title.length < 1) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .json(errorMessageGenerator('Field is empty', 'Title'))
            return
        }
        if(req.body.title.length > 40) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .json(errorMessageGenerator('Max length of title = 40', 'Title'))
            return
        }
        if(req.body.author.length < 1) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .json(errorMessageGenerator('Field is empty', 'Author'))
            return
        }
        if(req.body.author.length > 20) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .json(errorMessageGenerator('Max length of author = 20', 'Author'))
            return
        }
        if(req.body.availableResolutions.length < 1) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .json(errorMessageGenerator('Field is empty', 'AvailableResolutions'))
            return
        }

        const resolutionsLength = req.body.availableResolutions.length
        const filtredResolutionsLength = req.body.availableResolutions.filter(key => resolutionsList
            .some(val => val === key)).length

        if(filtredResolutionsLength !== resolutionsLength) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .json(errorMessageGenerator('Field is incorrect', 'AvailableResolutions'))
            return
        }

        const createdVideo: VideoViewModel = {
            id: Date.now(),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: Date.now() % 2 === 0,
            minAgeRestriction: false,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: req.body.availableResolutions
        }

        videos.push(createdVideo)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(createdVideo)
})

app.delete('/homework01/testing/all-data', (req: Request, res: Response) => {
    videos = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})