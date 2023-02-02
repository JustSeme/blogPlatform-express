import { UserDBModel } from "../models/users/UserDBModel";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserDBModel | null
        }
    }
}