import type { UserPermissions } from "../user/user.types";


export interface Position {
    id: string;
    name: string;
    permissions: UserPermissions;
}


export interface CreatePositionInput {
    name: string;
    permissions: UserPermissions;
}

export interface MutationResponse {
    success: boolean
    msg: string
    data?: Position
}