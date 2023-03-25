export type BlogViewModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogsWithQueryOutputModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogViewModel[]
}