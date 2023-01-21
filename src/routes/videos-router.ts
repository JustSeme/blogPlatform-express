import { Router, Request, Response } from "express";
import { HTTP_STATUSES } from "../app";
import { generateErrorMessage, isIsoDate } from "../helpers";
import { CreateVideoInputModel } from "../models/videos/CreateVideoInputModel";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { UpdateVideoInputModel } from "../models/videos/UpdateVideoInputModel";
import { resolutionsList, VideoViewModel } from "../models/videos/VideoViewModel";
import { videosRepository } from "../repositories/videos-repository";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../types";

export const videosRouter = Router({})

videosRouter.get('/', async (req: Request, res: Response<VideoViewModel[]>) => {
    res.json(await videosRepository.findVideos(null) as VideoViewModel[])
})

videosRouter.get('/:id', async (req: RequestWithParams<{ id: number }>,
    res: Response<VideoViewModel>) => {
    const findedVideo = await videosRepository.findVideos(+req.params.id)

    if(!findedVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.json(findedVideo as VideoViewModel)
})

videosRouter.delete('/:id', (req: RequestWithParams<{ id: number }>,
    res: Response) => {
    const findedVideo = videosRepository.findVideos(+req.params.id)
    if(!findedVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    videosRepository.deleteVideo(+req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

videosRouter.put('/:id', (req: RequestWithParamsAndBody<{ id: number }, UpdateVideoInputModel>, res: Response<ErrorMessagesOutputModel>) => {
    const findedVideo = videosRepository.findVideos(+req.params.id)
    if(!findedVideo) {
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

    videosRepository.updateVideo(+req.params.id, req.body)
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

videosRouter.post('/', async (req: RequestWithBody<CreateVideoInputModel>,
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

        const createdVideo = await videosRepository.createVideo(req.body)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(createdVideo)
})