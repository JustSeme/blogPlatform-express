import { resolutions } from "./VideoViewModel"

export type PutVideoInputModel = {
    title: string
    author: string
    availableResolutions: resolutions[]
    canBeDownloaded: boolean
    minAgeRestriction: number
    publicationDate: string
}