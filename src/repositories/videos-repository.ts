import { getPublicationDate } from "../helpers";
import { CreateVideoInputModel } from "../models/videos/CreateVideoInputModel";
import { UpdateVideoInputModel } from "../models/videos/UpdateVideoInputModel";
import { VideoViewModel } from "../models/videos/VideoViewModel";

const videos: VideoViewModel[] = [
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

export const videosRepository = {
    findVideos(id: number | null) {
        if(id === null) {
            return videos
        }
        return videos.find(v => v.id === id)
    },

    deleteVideo(id: number | null) {
        if(id === null) {
            videos.splice(0, videos.length)
            return
        }

        for(let i = 0; i < videos.length; i++) {
            if(videos[i].id === id) {
                videos.splice(i, 1)
            }
        }
    },

    createVideo(body: CreateVideoInputModel) {
        const createdVideo: VideoViewModel = {
            id: Date.now(),
            title: body.title,
            author: body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: getPublicationDate(),
            availableResolutions: body.availableResolutions
        }

        videos.push(createdVideo)

        return createdVideo
    },

    updateVideo(id: number, body: UpdateVideoInputModel) {
        const findedVideoIndex = videos.findIndex(v => v.id === id)
        if(findedVideoIndex < 0) {
            return
        }

        videos[findedVideoIndex] = {
            id: videos[findedVideoIndex].id,
            createdAt: videos[findedVideoIndex].createdAt,
            title: body.title,
            author: body.author,
            availableResolutions: [...body.availableResolutions],
            canBeDownloaded: body.canBeDownloaded,
            minAgeRestriction: body.minAgeRestriction,
            publicationDate: body.publicationDate
        }
    }
}