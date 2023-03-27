import { UserDBModel } from "../features/auth/domain/entities/UserDBModel";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserDBModel | null
            userId: string | null
        }
    }
}