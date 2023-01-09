import express, { Response, Request } from 'express'
import { errorMessageGenerator, getPublicationDate, isIsoDate } from './helpers'
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
        publicationDate: getPublicationDate(),
        availableResolutions: ['P1080', 'P240']
    },
    {
        id: 2,
        title: 'IT=Camasutra practice',
        author: 'Dimych',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: getPublicationDate(),
        availableResolutions: ['P480', 'P144', 'P720']
    },
    {
        id: 3,
        title: 'IT=Camasutra practice',
        author: 'Dimych',
        canBeDownloaded: true,
        minAgeRestriction: 18,
        createdAt: new Date().toISOString(),
        publicationDate: getPublicationDate(),
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

    const errorMessagesList = []

    if(!isIsoDate(req.body.publicationDate)) {
        errorMessagesList.push('publicationDate')
    }

    if(typeof req.body.canBeDownloaded !== 'boolean') {
        errorMessagesList.push('canBeDownloaded')
    }

    if(typeof req.body.minAgeRestriction !== null && typeof req.body.minAgeRestriction !== 'number' || !req.body.minAgeRestriction || req.body.minAgeRestriction > 18) {
        errorMessagesList.push('minAgeRestriction')
    }

    if(!req.body.title || req.body.title.length > 40) {
        errorMessagesList.push('title')
    }
    if(!req.body.author || req.body.author.length > 20) {
        errorMessagesList.push('author')
    }

    const resolutionsLength = req.body.availableResolutions?.length
    const filtredResolutionsLength = req.body.availableResolutions.filter(key => resolutionsList
        .some(val => val === key))?.length

    if(!req.body.availableResolutions || filtredResolutionsLength !== resolutionsLength) {
        errorMessagesList.push('availableResolutions')
    }


    if(errorMessagesList.length) {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .send(errorMessageGenerator('field is incorrect', errorMessagesList))
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
        const errorMessagesList = []
        
        if(!req.body.title || req.body.title.length > 40) {
            errorMessagesList.push('title')
        }
        if(!req.body.author || req.body.author.length > 20) {
            errorMessagesList.push('author')
        }

        const resolutionsLength = req.body.availableResolutions?.length
        const filtredResolutionsLength = req.body.availableResolutions.filter(key => resolutionsList
            .some(val => val === key))?.length

        if(!req.body.availableResolutions || filtredResolutionsLength !== resolutionsLength) {
            errorMessagesList.push('availableResolutions')
        }

        if(errorMessagesList.length) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .send(errorMessageGenerator('field is incorrect', errorMessagesList))
            return
        }

        const createdVideo: VideoViewModel = {
            id: Date.now(),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: getPublicationDate(),
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