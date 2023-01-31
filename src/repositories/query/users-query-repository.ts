import { ReadUsersQuery } from "../../models/users/ReadUsersQuery";
import { UsersWithQueryOutputModel, UserViewModel } from "../../models/users/UsersViewModel";
import { usersCollection } from "../db";

export const usersQueryRepository = {
    async findUsers(queryParams: ReadUsersQuery): Promise<UsersWithQueryOutputModel> {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null } = queryParams

        const filterByEmail: any = {}
        const filterByLogin: any = {}
        if(searchEmailTerm) {
            filterByEmail.email = {$regex: searchEmailTerm, $options: 'i'}
        }
        if(searchLoginTerm) {
            filterByLogin.login = {$regex: searchLoginTerm, $options: 'i'}
        }

        const totalCount = await usersCollection.count({$or: [filterByEmail, filterByLogin]})
        const pagesCount = Math.ceil(totalCount / +pageSize)
        
        const skipCount = (+pageNumber - 1) * +pageSize
        let usersCursor = await usersCollection.find({$or: [filterByEmail, filterByLogin]}, { projection: { _id: 0 }}).skip(skipCount).limit(+pageSize)

        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        const resultedUsers = await usersCursor.sort({[sortBy]: sortDirectionNumber}).toArray()
        const displayedUsers: UserViewModel[] = resultedUsers.map(u => ({
            id: u.id,
            login: u.login,
            email: u.email,
            createdAt: u.createdAt
        }))
        
        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: displayedUsers
        }
    }
}