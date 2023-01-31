import { ReadUsersQuery } from "../../models/users/ReadUsersQuery";
import { UsersWithQueryOutputModel } from "../../models/users/UsersViewModel";
import { usersCollection } from "../db";

export const usersQueryRepository = {
    async findUsers(queryParams: ReadUsersQuery): Promise<UsersWithQueryOutputModel> {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null } = queryParams

        const filter: any = {}
        if(searchEmailTerm) {
            filter.email = searchEmailTerm
        }
        if(searchLoginTerm) {
            filter.login = searchLoginTerm
        }

        const totalCount = await usersCollection.count(filter)
        const pagesCount = Math.ceil(totalCount / +pageSize)

        const skipCount = (+pageNumber - 1) * +pageSize
        let usersCursor = await usersCollection.find(filter, { projection: { _id: 0 }}).skip(skipCount).limit(+pageSize)

        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        const resultedUsers = await usersCursor.sort({[sortBy]: sortDirectionNumber}).toArray()
        
        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: resultedUsers
        }
    }
}