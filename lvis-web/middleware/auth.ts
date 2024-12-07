import type { SystemPermissions, WarehousePermissions } from "~/composables/system/user/user.types"
import { ROUTES } from "~/utils/constants"
import { redirectTo401Page } from "~/utils/helpers"

const ROUTE_EXEMPTIONS = [
    ROUTES.CANVASS_UPDATE,
    ROUTES.JO_UPDATE,
    ROUTES.RV_UPDATE,
    ROUTES.SPR_UPDATE,
    ROUTES.MEQS_UPDATE,
    ROUTES.PO_UPDATE,
    ROUTES.RR_UPDATE,
]

export default defineNuxtRouteMiddleware( async(to, from) => {

    if(import.meta.client) {

        const authUser = await getAuthUserAsync()

        if (isAdmin(authUser)) return
    
        if (ROUTE_EXEMPTIONS.includes(to.name as ROUTES)) return

        if (!authUser.user.permissions) return redirectTo401Page()

        const isSystemService = to.name?.toString().includes(SERVICES.SYSTEM)
        const isWarehouseService = to.name?.toString().includes(SERVICES.WAREHOUSE)
    
    
        if (isSystemService) {
    
            const permissions = authUser.user.permissions.system
            if (!permissions) return redirectTo401Page()
    
            // data management
            const isUserModule = to.name?.toString().includes(MODULES.USER)
            const isEmployeeModule = to.name?.toString().includes(MODULES.EMPLOYEE)
            const isAccountModule = to.name?.toString().includes(MODULES.ACCOUNT)
            const isClassificationModule = to.name?.toString().includes(MODULES.CLASSIFICATION)
            const isDepartmentModule = to.name?.toString().includes(MODULES.DEPARTMENT)
            const isDivisionModule = to.name?.toString().includes(MODULES.DIVISION)

            if (isUserModule) {
                if (!(await canAccessUser(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
            }
    
            if (isEmployeeModule) {
                if (!canAccessEmployee(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
            }
    
            if (isAccountModule) {
                if (!canAccessAccount(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isClassificationModule) {
                if (!canAccessClassification(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isDepartmentModule) {
                if (!canAccessDepartment(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isDivisionModule) {
                if (!canAccessDivision(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
        }
    
    
        if (isWarehouseService) {

            const permissions = authUser.user.permissions.warehouse
            if (!permissions) return redirectTo401Page()
    
            // purchasing
            const isCanvassModule = to.name?.toString().includes(MODULES.CANVASS)
            const isRVModule = to.name?.toString().includes(MODULES.RV)
            const isSPRModule = to.name?.toString().includes(MODULES.SPR)
            const isJOModule = to.name?.toString().includes(MODULES.JO)
            const isMEQSModule = to.name?.toString().includes(MODULES.MEQS)
            const isPOModule = to.name?.toString().includes(MODULES.PO)
            const isRRModule = to.name?.toString().includes(MODULES.RR)
    
            // warehousing
            const isOSRIVModule = to.name?.toString().includes(MODULES.OSRIV)
            const isSERIVModule = to.name?.toString().includes(MODULES.SERIV)
            const isMRVModule = to.name?.toString().includes(MODULES.MRV)
            const isMCTModule = to.name?.toString().includes(MODULES.MCT)
            const isMCRTModule = to.name?.toString().includes(MODULES.MCRT)
            const isMSTModule = to.name?.toString().includes(MODULES.MST)
    
            // data management
            const isSupplierModule = to.name?.toString().includes(MODULES.SUPPLIER)
            const isItemModule = to.name?.toString().includes(MODULES.ITEM)
            
            // motorpool
            const isVehicleModule = to.name?.toString().includes(MODULES.VEHICLE)
            const isTripTicketModule = to.name?.toString().includes(MODULES.TRIP_TICKET)
            const isGasSlipModule = to.name?.toString().includes(MODULES.GAS_SLIP)


            // =========================== PURCHASING =========================== 
            if (isCanvassModule) {
                if (!canAccessCanvass(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
            }
    
            if (isRVModule) {
                if (!(await canAccessRV(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
            }
    
            if (isSPRModule) {
                if (!(await canAccessSPR(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
    
            }
    
            if (isJOModule) {
                if (!(await canAccessJO(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
    
            }
    
            if (isMEQSModule) {
                if (!(await canAccessMEQS(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
    
            }
    
            if (isPOModule) {
                if (!(await canAccessPO(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
    
            }
    
            if (isRRModule) {
                if (!(await canAccessRR(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
    
            }
            
            // =========================== WAREHOUSING =========================== 
            if (isOSRIVModule) {
                if (!(await canAccessOSRIV(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
    
            }
    
            if (isSERIVModule) {
                if (!(await canAccessSERIV(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
    
            }
    
            if (isMRVModule) {
                if (!(await canAccessMRV(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
    
            }
    
            if (isMCTModule) {
                if (!(await canAccessMCT(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
    
            }
    
            if (isMCRTModule) {
                if (!(await canAccessMCRT(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
    
            }
    
            if (isMSTModule) {
                if (!(await canAccessMST(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
    
            }
    
            if (isSupplierModule) {
                if (!canAccessSupplier(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isItemModule) {
                if (!canAccessItem(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }

            // =========================== MOTORPOOL =========================== 
            if (isVehicleModule) {
                if (!canAccessVehicle(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
            }

            if (isTripTicketModule) {
                if (!(await canAccessTripTicket(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
            }

            if (isGasSlipModule) {
                if (!(await canAccessGasSlip(to.name as ROUTES, permissions))) return redirectTo401Page()
                return
            }

    
    
        }
    
        return redirectTo401Page()
        
    }


})


function isApprover(authUser: AuthUser) {
    const total_pendings = authUser.user.user_employee?.employee.total_pending_approvals
    if (total_pendings && total_pendings > 0) {
        return true
    }
}


// ============================================== SYSTEM ============================================== 

async function canAccessUser(route: ROUTES, permissions: SystemPermissions) {

    console.log('canAccessUser', route, permissions)

    const authUser = await getAuthUserAsync()

    if(!isAdmin(authUser)) {
        return false 
    }

    return true

}

function canAccessEmployee(route: ROUTES, permissions: SystemPermissions) {

    console.log('canAccessEmployee', route, permissions)

    if (!permissions.canManageEmployee) return false

    if (route === ROUTES.EMPLOYEE_INDEX) return !!permissions.canManageEmployee.read
    if (route === ROUTES.EMPLOYEE_CREATE) return !!permissions.canManageEmployee.create
    if (route === ROUTES.EMPLOYEE_UPDATE) return !!permissions.canManageEmployee.update


    return true

}

function canAccessAccount(route: ROUTES, permissions: SystemPermissions) {

    console.log('canAccessAccount', route, permissions)

    if (!permissions.canManageAccount) return false

    if (route === ROUTES.ACCOUNT_INDEX) return !!permissions.canManageAccount.read
    if (route === ROUTES.ACCOUNT_CREATE) return !!permissions.canManageAccount.create
    if (route === ROUTES.ACCOUNT_UPDATE) return !!permissions.canManageAccount.update


    return true

}

function canAccessClassification(route: ROUTES, permissions: SystemPermissions) {

    console.log('canAccessClassification', route, permissions)

    if (!permissions.canManageClassification) return false

    if (route === ROUTES.CLASSIFICATION_INDEX) return !!permissions.canManageClassification.read
    if (route === ROUTES.CLASSIFICATION_CREATE) return !!permissions.canManageClassification.create
    if (route === ROUTES.CLASSIFICATION_UPDATE) return !!permissions.canManageClassification.update


    return true

}

function canAccessDepartment(route: ROUTES, permissions: SystemPermissions) {

    console.log('canAccessDepartment', route, permissions)

    if (!permissions.canManageDepartment) return false

    if (route === ROUTES.DEPARTMENT_INDEX) return !!permissions.canManageDepartment.read
    if (route === ROUTES.DEPARTMENT_CREATE) return !!permissions.canManageDepartment.create
    if (route === ROUTES.DEPARTMENT_UPDATE) return !!permissions.canManageDepartment.update


    return true

}

function canAccessDivision(route: ROUTES, permissions: SystemPermissions) {

    console.log('canAccessDivision', route, permissions)

    if (!permissions.canManageDivision) return false

    if (route === ROUTES.DIVISION_INDEX) return !!permissions.canManageDivision.read
    if (route === ROUTES.DIVISION_CREATE) return !!permissions.canManageDivision.create
    if (route === ROUTES.DIVISION_UPDATE) return !!permissions.canManageDivision.update


    return true

}

// ============================================== WAREHOUSE ============================================== 


async function canAccessCanvass(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessCanvass', route, permissions)

    if (!permissions.canManageCanvass) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.CANVASS_INDEX) return !!permissions.canManageCanvass.search
    if (route === ROUTES.CANVASS_CREATE) return !!permissions.canManageCanvass.create
    if (route === ROUTES.CANVASS_VIEW) {
        return !!permissions.canManageCanvass.viewDetails || isApprover(authUser)
    }


    return false

}

async function canAccessRV(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessRV', route, permissions)
    
    if (!permissions.canManageRV) return false
    
    const authUser = await getAuthUserAsync()

    if (route === ROUTES.RV_INDEX) return !!permissions.canManageRV.search
    if (route === ROUTES.RV_CREATE) return !!permissions.canManageRV.create
    if (route === ROUTES.RV_VIEW) {
        return !!permissions.canManageRV.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessSPR(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessSPR', route, permissions)

    if (!permissions.canManageSPR) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.SPR_INDEX) return !!permissions.canManageSPR.search
    if (route === ROUTES.SPR_CREATE) return !!permissions.canManageSPR.create
    if (route === ROUTES.SPR_VIEW) {
        return !!permissions.canManageSPR.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessJO(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessJO', route, permissions)

    if (!permissions.canManageJO) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.JO_INDEX) return !!permissions.canManageJO.search
    if (route === ROUTES.JO_CREATE) return !!permissions.canManageJO.create
    if (route === ROUTES.JO_VIEW) {
        return !!permissions.canManageJO.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessMEQS(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessMEQS', route, permissions)

    if (!permissions.canManageMEQS) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.MEQS_INDEX) return !!permissions.canManageMEQS.search
    if (route === ROUTES.MEQS_CREATE) return !!permissions.canManageMEQS.create
    if (route === ROUTES.MEQS_VIEW) {
        return !!permissions.canManageMEQS.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessPO(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessPO', route, permissions)

    if (!permissions.canManagePO) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.PO_INDEX) return !!permissions.canManagePO.search
    if (route === ROUTES.PO_CREATE) return !!permissions.canManagePO.create
    if (route === ROUTES.PO_VIEW) {
        return !!permissions.canManagePO.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessRR(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessRR', route, permissions)

    if (!permissions.canManageRR) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.RR_INDEX) return !!permissions.canManageRR.search
    if (route === ROUTES.RR_CREATE) return !!permissions.canManageRR.create
    if (route === ROUTES.RR_VIEW) {
        return !!permissions.canManageRR.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessOSRIV(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessOSRIV', route, permissions)

    if (!permissions.canManageOSRIV) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.OSRIV_INDEX) return !!permissions.canManageOSRIV.search
    if (route === ROUTES.OSRIV_CREATE) return !!permissions.canManageOSRIV.create
    if (route === ROUTES.OSRIV_VIEW) {
        return !!permissions.canManageOSRIV.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessSERIV(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessSERIV', route, permissions)

    if (!permissions.canManageSERIV) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.SERIV_INDEX) return !!permissions.canManageSERIV.search
    if (route === ROUTES.SERIV_CREATE) return !!permissions.canManageSERIV.create
    if (route === ROUTES.SERIV_VIEW) {
        return !!permissions.canManageSERIV.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessMRV(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessMRV', route, permissions)

    if (!permissions.canManageMRV) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.MRV_INDEX) return !!permissions.canManageMRV.search
    if (route === ROUTES.MRV_CREATE) return !!permissions.canManageMRV.create
    if (route === ROUTES.MRV_VIEW) {
        return !!permissions.canManageMRV.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessMCT(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessMCT', route, permissions)

    if (!permissions.canManageMCT) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.MCT_INDEX) return !!permissions.canManageMCT.search
    if (route === ROUTES.MCT_CREATE) return !!permissions.canManageMCT.create
    if (route === ROUTES.MCT_VIEW) {
        return !!permissions.canManageMCT.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessMCRT(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessMCRT', route, permissions)

    if (!permissions.canManageMCRT) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.MCRT_INDEX) return !!permissions.canManageMCRT.search
    if (route === ROUTES.MCRT_CREATE) return !!permissions.canManageMCRT.create
    if (route === ROUTES.MCRT_VIEW) {
        return !!permissions.canManageMCRT.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessMST(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessMST', route, permissions)

    if (!permissions.canManageMST) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.MST_INDEX) return !!permissions.canManageMST.search
    if (route === ROUTES.MST_CREATE) return !!permissions.canManageMST.create
    if (route === ROUTES.MST_VIEW) {
        return !!permissions.canManageMST.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessSupplier(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessSupplier', route, permissions)

    if (!permissions.canManageSupplier) return false

    if (route === ROUTES.SUPPLIER_INDEX) return !!permissions.canManageSupplier.read
    if (route === ROUTES.SUPPLIER_CREATE) return !!permissions.canManageSupplier.create
    if (route === ROUTES.SUPPLIER_UPDATE) return !!permissions.canManageSupplier.update


    return true

}

function canAccessItem(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessItem', route, permissions)

    if (!permissions.canManageItem) return false

    if (route === ROUTES.ITEM_INDEX) return !!permissions.canManageItem.search
    if (route === ROUTES.ITEM_CREATE) return !!permissions.canManageItem.create
    if (route === ROUTES.ITEM_UPDATE) return !!permissions.canManageItem.update
    if (route === ROUTES.ITEM_VIEW) return !!permissions.canManageItem.viewDetails


    return true

}




// ============================================== MOTORPOOL ============================================== 

function canAccessVehicle(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessVehicle', route, permissions)

    if (!permissions.canManageVehicle) return false

    if (route === ROUTES.VEHICLE_INDEX) return !!permissions.canManageVehicle.read
    if (route === ROUTES.VEHICLE_CREATE) return !!permissions.canManageVehicle.create
    if (route === ROUTES.VEHICLE_UPDATE) return !!permissions.canManageVehicle.update


    return true

}

async function canAccessTripTicket(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessTripTicket', route, permissions)

    if (!permissions.canManageTripTicket) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.TRIP_TICKET_INDEX) return !!permissions.canManageTripTicket.search
    if (route === ROUTES.TRIP_TICKET_CREATE) return !!permissions.canManageTripTicket.create
    if (route === ROUTES.TRIP_TICKET_VIEW) {
        return !!permissions.canManageTripTicket.viewDetails || isApprover(authUser)
    }


    return true

}

async function canAccessGasSlip(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessGasSlip', route, permissions)

    if (!permissions.canManageGasSlip) return false

    const authUser = await getAuthUserAsync()

    if (route === ROUTES.GAS_SLIP_INDEX) return !!permissions.canManageGasSlip.search
    if (route === ROUTES.GAS_SLIP_CREATE) return !!permissions.canManageGasSlip.create
    if (route === ROUTES.GAS_SLIP_VIEW) {
        return !!permissions.canManageGasSlip.viewDetails || isApprover(authUser)
    }

    return true

}