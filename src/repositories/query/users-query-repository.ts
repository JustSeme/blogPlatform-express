import { ReadUsersQuery } from "../../models/users/ReadUsersQuery";
import { UsersWithQueryOutputModel, UserViewModel } from "../../models/users/UsersViewModel";
import { usersCollection } from "../db";

export const usersQueryRepository = {
    async findUsers(queryParams: ReadUsersQuery): Promise<UsersWithQueryOutputModel> {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null } = queryParams

        const filterArray: any = []
        if(searchEmailTerm) {
            filterArray.push({email: {$regex: searchEmailTerm, $options: 'i'}})
        }
        if(searchLoginTerm) {
            filterArray.push({login: {$regex: searchLoginTerm, $options: 'i'}})
        }

        const totalCount = await usersCollection.count({$or: filterArray})
        const pagesCount = Math.ceil(totalCount / +pageSize)
        
        const skipCount = (+pageNumber - 1) * +pageSize
        let usersCursor = await usersCollection.find({$or: filterArray}, { projection: { _id: 0 }}).skip(skipCount).limit(+pageSize)

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
    },

    async findUserById(userId: string) {
        return await usersCollection.findOne({id: userId}, { projection: { _id: 0 }})
    }
}