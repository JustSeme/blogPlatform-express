import { resolutions } from "./VideoViewModel"

export type UpdateVideoInputModel = {
    title: string
    author: string
    availableResolutions: resolutions[]
    canBeDownloaded: boolean
    minAgeRestriction: number
    publicationDate: string
}