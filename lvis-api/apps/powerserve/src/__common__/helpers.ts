import { User } from "apps/system/prisma/generated/client";
import { MODULES } from "apps/system/src/__common__/modules.enum";
import { RESOLVERS } from "apps/system/src/__common__/resolvers.enum";


export function canAccess(user: User, module: MODULES, resolvers: RESOLVERS): boolean {
    return true
}