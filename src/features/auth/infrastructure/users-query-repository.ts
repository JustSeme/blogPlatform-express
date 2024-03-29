import { ReadUsersQuery } from "../api/models/ReadUsersQuery";
import { UsersWithQueryOutputModel } from "../api/models/UsersViewModel";
import { UsersModel } from "../domain/UsersSchema";

export const usersQueryRepository = {
    async findUsers(queryParams: ReadUsersQuery): Promise<UsersWithQueryOutputModel> {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10, searchLoginTerm = null, searchEmailTerm = null } = queryParams

        const filterArray: any = []
        if (searchEmailTerm) {
            filterArray.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
        }
        if (searchLoginTerm) {
            filterArray.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
        }

        const filterObject = filterArray.length ? { $or: filterArray } : {}

        const totalCount = await UsersModel.countDocuments(filterObject)
        const pagesCount = Math.ceil(totalCount / +pageSize)

        const skipCount = (+pageNumber - 1) * +pageSize
        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1

        let resultedUsers = await UsersModel.find(filterObject).skip(skipCount).limit(+pageSize).sort({ [sortBy]: sortDirectionNumber }).lean()

        const displayedUsers = resultedUsers.map(el => ({
            id: el.id,
            login: el.login,
            email: el.email,
            createdAt: el.createdAt
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
        return UsersModel.findOne({ id: userId }, { _id: 0, __v: 0 }).lean()
    },

    async findUserByLogin(login: string) {
        return UsersModel.findOne({ login: login }).lean()
    },

    async findUserByRecoveryPasswordCode(code: string) {
        return UsersModel.findOne({ 'passwordRecovery.confirmationCode': code }).lean()
    },

    async findUserByEmail(email: string) {
        return UsersModel.findOne({ email: email }).lean()
    }
}