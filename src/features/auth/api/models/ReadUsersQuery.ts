export type ReadUsersQuery = { 
    sortBy: string
    sortDirection: string
    pageNumber: number
    pageSize: number
    searchLoginTerm: string
    searchEmailTerm: string
}