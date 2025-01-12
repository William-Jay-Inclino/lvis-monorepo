import { LOCAL_STORAGE_AUTH_USER_KEY } from "./config";



export function getAuthUser(): AuthUser {
    const authUserJson = localStorage.getItem(LOCAL_STORAGE_AUTH_USER_KEY)

    if (!authUserJson) {
        // @ts-ignore
        return redirectTo401Page()
    }

    const authUser = JSON.parse(authUserJson) as AuthUser

    return authUser
}

export function getAuthUserAsync(): Promise<AuthUser> {
    return new Promise((resolve) => {
        const user = getAuthUser();  
        resolve(user);
    });
}

export function isAdmin(authUser: AuthUser): boolean {
    return authUser.user.role === ROLE.ADMIN

}

export function isAdminOrOwner(createdBy: string, authUser: AuthUser) {

    const isOwner = authUser.user.username === createdBy

    if (isAdmin(authUser) || isOwner) {
        return true
    }

    return false

}

export function canUpdate(authUser: AuthUser, created_by: string) {

    if (isAdmin(authUser)) return true

    return authUser.user.username === created_by
}

export function canCreate(authUser: AuthUser, permission: string, service?: SERVICES) {

    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()

    console.log('_service', _service);
    console.log('authUser.user.permissions', authUser.user.permissions);
    console.log('permission', permission);

    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].create

}

export function canDelete(authUser: AuthUser, permission: string, service?: SERVICES) {
    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()

    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].delete

}

export function canEdit(authUser: AuthUser, permission: string, service?: SERVICES) {
    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()


    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].update

}

export function canRead(authUser: AuthUser, permission: string, service?: SERVICES) {
    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()

    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].read

}

export function canSearch(authUser: AuthUser, permission: string, service?: SERVICES) {
    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()

    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].search

}

export function canViewDetails(authUser: AuthUser, permission: string, service?: SERVICES) {
    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()

    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].viewDetails

}


export function canPrint(authUser: AuthUser, permission: string, service?: SERVICES) {
    if (isAdmin(authUser)) return true

    if (!authUser.user.permissions) return false

    const _service = (service || SERVICES.WAREHOUSE).toLowerCase()

    // @ts-ignore
    return !!authUser.user.permissions[_service][permission].print

}