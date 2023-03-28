import { UserDTO } from "../features/auth/domain/entities/UserDTO";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserDTO | null
            userId: string | null
        }
    }
}