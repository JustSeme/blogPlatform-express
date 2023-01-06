import { resolutions } from "./VideoViewModel"

export type CreateVideoInputModel = {
    title: string
    author: string
    availableResolutions: resolutions[]
}