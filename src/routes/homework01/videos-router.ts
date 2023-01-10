import { Router, Request, Response } from "express";
import { HTTP_STATUSES } from "../../app";
import { generateErrorMessage, getPublicationDate, isIsoDate } from "../../helpers";
import { CreateVideoInputModel } from "../../models/CreateVideoInputModel";
import { ErrorMessagesOutputModel } from "../../models/ErrorMessagesOutputModel";
import { PutVideoInputModel } from "../../models/PutVideoInputModel";
import { resolutionsList, VideoViewModel } from "../../models/VideoViewModel";
import { videos } from "../../repositories/videos";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../../types";

export const videosRouter = Router({})

videosRouter.get('/', (req: Request, res: Response<VideoViewModel[]>) => {
    res.json(videos)
})

videosRouter.get('/:id', (req: RequestWithParams<{ id: number }>,
    res: Response<VideoViewModel>) => {
    const findedVideo = videos.filter(v => v.id === +req.params.id)[0]

    if(!findedVideo) {
        res.sendStatus(404)
    }
    res.json(findedVideo)
})

videosRouter.delete('/:id', (req: RequestWithParams<{ id: number }>,
    res: Response) => {
    const findedVideo = videos.filter(v => v.id === +req.params.id)[0]
    if(!findedVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    for(let i = 0; i < videos.length; i++) {
        if(videos[i].id === +req.params.id) {
            videos.splice(i, 1)
        }
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

videosRouter.put('/:id', (req: RequestWithParamsAndBody<{ id: number }, PutVideoInputModel>, res: Response<ErrorMessagesOutputModel>) => {
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
            .send(generateErrorMessage('field is incorrect', errorMessagesList))
        return
    }
    
    videos[findedVideoIndex] = {
        ...req.body,
        id: videos[findedVideoIndex].id,
        createdAt: videos[findedVideoIndex].createdAt
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

videosRouter.post('/', (req: RequestWithBody<CreateVideoInputModel>,
    res: Response<VideoViewModel | ErrorMessagesOutputModel>) => {
        const errorMessagesList = []

        if(!req.body) {
            errorMessagesList.push('your request have\'nt body')
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

        if(!req.body.availableResolutions || req.body.availableResolutions.length < 1 || filtredResolutionsLength !== resolutionsLength) {
            errorMessagesList.push('availableResolutions')
        }

        if(errorMessagesList.length) {
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .send(generateErrorMessage('field is incorrect', errorMessagesList))
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