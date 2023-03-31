import { HydratedDocument } from "mongoose";
import { UserDBMethodsType, UserDTO } from "../domain/UsersTypes";

export type HydratedUser = HydratedDocument<UserDTO, UserDBMethodsType>