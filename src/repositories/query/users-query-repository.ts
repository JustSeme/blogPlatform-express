import { ReadUsersQuery } from "../../models/users/ReadUsersQuery";
import { UserDBModel } from "../../models/users/UserDBModel";
import { UsersWithQueryOutputModel, UserViewModel } from "../../models/users/UsersViewModel";
import { usersModel } from "../db";

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

        const totalCount = await usersModel.count(filterObject)
        const pagesCount = Math.ceil(totalCount / +pageSize)

        const skipCount = (+pageNumber - 1) * +pageSize
        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        let resultedUsers = await usersModel.find(filterObject).skip(skipCount).limit(+pageSize).sort({ [sortBy]: sortDirectionNumber })

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
        return await usersModel.findOne({ id: userId }, { _id: 0, __v: 0 })
    },

    async findUserByEmail(email: string) {
        return await usersModel.findOne({ email: email })
    },

    async findUserByLogin(login: string) {
        return await usersModel.findOne({ login: login })
    },

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        return await usersModel.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] })
    },

    async findUserByConfirmationCode(code: string) {
        return await usersModel.findOne({ 'emailConfirmation.confirmationCode': code })
    },

    async findUserByRecoveryPasswordCode(code: string) {
        return await usersModel.findOne({ 'passwordRecovery.confirmationCode': code })
    },
}