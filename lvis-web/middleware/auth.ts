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

export default defineNuxtRouteMiddleware((to, from) => {

    if(import.meta.client) {

        const authUser = getAuthUser()

        if (isAdmin(authUser)) return
    
        if (ROUTE_EXEMPTIONS.includes(to.name as ROUTES)) return
    
        if (!authUser.user.permissions) return redirectTo401Page()

        const isSystemService = to.name?.toString().includes(SERVICES.SYSTEM)
        const isWarehouseService = to.name?.toString().includes(SERVICES.WAREHOUSE)
    
    
        if (isSystemService) {
    
            const permissions = authUser.user.permissions.system
            if (!permissions) return redirectTo401Page()
    
            // data management
            const isEmployeeModule = to.name?.toString().includes(MODULES.EMPLOYEE)
            const isAccountModule = to.name?.toString().includes(MODULES.ACCOUNT)
            const isClassificationModule = to.name?.toString().includes(MODULES.CLASSIFICATION)
            const isDepartmentModule = to.name?.toString().includes(MODULES.DEPARTMENT)
            const isPositionModule = to.name?.toString().includes(MODULES.POSITION)
    
    
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
    
            if (isPositionModule) {
                if (!canAccessPosition(to.name as ROUTES, permissions)) return redirectTo401Page()
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
            const isUnitModule = to.name?.toString().includes(MODULES.UNIT)
            
            // stock inventory
            const isItemModule = to.name?.toString().includes(MODULES.ITEM)
            const isItemTypeModule = to.name?.toString().includes(MODULES.ITEM_TYPE)
            
            // motorpool
            const isVehicleModule = to.name?.toString().includes(MODULES.VEHICLE)
            const isFuelTypeModule = to.name?.toString().includes(MODULES.FUEL_TYPE)
            const isGasStationModule = to.name?.toString().includes(MODULES.GAS_STATION)
            const isTripTicketModule = to.name?.toString().includes(MODULES.TRIP_TICKET)
            const isGasSlipModule = to.name?.toString().includes(MODULES.GAS_SLIP)


            // =========================== PURCHASING =========================== 
            if (isCanvassModule) {
                if (!canAccessCanvass(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
            }
    
            if (isRVModule) {
                if (!canAccessRV(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
            }
    
            if (isSPRModule) {
                if (!canAccessSPR(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isJOModule) {
                if (!canAccessJO(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isMEQSModule) {
                if (!canAccessMEQS(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isPOModule) {
                if (!canAccessPO(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isRRModule) {
                if (!canAccessRR(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
            
            // =========================== WAREHOUSING =========================== 
            if (isOSRIVModule) {
                if (!canAccessOSRIV(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isSERIVModule) {
                if (!canAccessSERIV(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isMRVModule) {
                if (!canAccessMRV(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isMCTModule) {
                if (!canAccessMCT(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isMCRTModule) {
                if (!canAccessMCRT(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isMSTModule) {
                if (!canAccessMST(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isSupplierModule) {
                if (!canAccessSupplier(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isUnitModule) {
                if (!canAccessUnit(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isItemModule) {
                if (!canAccessItem(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
    
            }
    
            if (isItemTypeModule) {
                if (!canAccessItemType(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
            }
    

            // =========================== MOTORPOOL =========================== 
            if (isVehicleModule) {
                if (!canAccessVehicle(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
            }

            if (isFuelTypeModule) {
                if (!canAccessFuelType(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
            }

            if (isGasStationModule) {
                if (!canAccessGasStation(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
            }

            if (isTripTicketModule) {
                if (!canAccessTripTicket(to.name as ROUTES, permissions)) return redirectTo401Page()
                return
            }

            if (isGasSlipModule) {
                if (!canAccessGasSlip(to.name as ROUTES, permissions)) return redirectTo401Page()
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

function canAccessPosition(route: ROUTES, permissions: SystemPermissions) {

    console.log('canAccessPosition', route, permissions)

    if (!permissions.canManagePosition) return false

    if (route === ROUTES.POSITION_INDEX) return !!permissions.canManagePosition.read
    if (route === ROUTES.POSITION_CREATE) return !!permissions.canManagePosition.create
    if (route === ROUTES.POSITION_UPDATE) return !!permissions.canManagePosition.update


    return true

}

// ============================================== WAREHOUSE ============================================== 


function canAccessCanvass(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessCanvass', route, permissions)

    if (!permissions.canManageCanvass) return false

    const authUser = getAuthUser()

    if (route === ROUTES.CANVASS_INDEX) return !!permissions.canManageCanvass.search
    if (route === ROUTES.CANVASS_CREATE) return !!permissions.canManageCanvass.create
    if (route === ROUTES.CANVASS_VIEW) {
        return !!permissions.canManageCanvass.viewDetails || isApprover(authUser)
    }


    return false

}

function canAccessRV(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessRV', route, permissions)

    if (!permissions.canManageRV) return false

    const authUser = getAuthUser()

    if (route === ROUTES.RV_INDEX) return !!permissions.canManageRV.search
    if (route === ROUTES.RV_CREATE) return !!permissions.canManageRV.create
    if (route === ROUTES.RV_VIEW) {
        return !!permissions.canManageRV.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessSPR(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessSPR', route, permissions)

    if (!permissions.canManageSPR) return false

    const authUser = getAuthUser()

    if (route === ROUTES.SPR_INDEX) return !!permissions.canManageSPR.search
    if (route === ROUTES.SPR_CREATE) return !!permissions.canManageSPR.create
    if (route === ROUTES.SPR_VIEW) {
        return !!permissions.canManageSPR.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessJO(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessJO', route, permissions)

    if (!permissions.canManageJO) return false

    const authUser = getAuthUser()

    if (route === ROUTES.JO_INDEX) return !!permissions.canManageJO.search
    if (route === ROUTES.JO_CREATE) return !!permissions.canManageJO.create
    if (route === ROUTES.JO_VIEW) {
        return !!permissions.canManageJO.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessMEQS(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessMEQS', route, permissions)

    if (!permissions.canManageMEQS) return false

    const authUser = getAuthUser()

    if (route === ROUTES.MEQS_INDEX) return !!permissions.canManageMEQS.search
    if (route === ROUTES.MEQS_CREATE) return !!permissions.canManageMEQS.create
    if (route === ROUTES.MEQS_VIEW) {
        return !!permissions.canManageMEQS.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessPO(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessPO', route, permissions)

    if (!permissions.canManagePO) return false

    const authUser = getAuthUser()

    if (route === ROUTES.PO_INDEX) return !!permissions.canManagePO.search
    if (route === ROUTES.PO_CREATE) return !!permissions.canManagePO.create
    if (route === ROUTES.PO_VIEW) {
        return !!permissions.canManagePO.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessRR(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessRR', route, permissions)

    if (!permissions.canManageRR) return false

    const authUser = getAuthUser()

    if (route === ROUTES.RR_INDEX) return !!permissions.canManageRR.search
    if (route === ROUTES.RR_CREATE) return !!permissions.canManageRR.create
    if (route === ROUTES.RR_VIEW) {
        return !!permissions.canManageRR.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessOSRIV(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessOSRIV', route, permissions)

    if (!permissions.canManageOSRIV) return false

    const authUser = getAuthUser()

    if (route === ROUTES.OSRIV_INDEX) return !!permissions.canManageOSRIV.search
    if (route === ROUTES.OSRIV_CREATE) return !!permissions.canManageOSRIV.create
    if (route === ROUTES.OSRIV_VIEW) {
        return !!permissions.canManageOSRIV.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessSERIV(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessSERIV', route, permissions)

    if (!permissions.canManageSERIV) return false

    const authUser = getAuthUser()

    if (route === ROUTES.SERIV_INDEX) return !!permissions.canManageSERIV.search
    if (route === ROUTES.SERIV_CREATE) return !!permissions.canManageSERIV.create
    if (route === ROUTES.SERIV_VIEW) {
        return !!permissions.canManageSERIV.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessMRV(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessMRV', route, permissions)

    if (!permissions.canManageMRV) return false

    const authUser = getAuthUser()

    if (route === ROUTES.MRV_INDEX) return !!permissions.canManageMRV.search
    if (route === ROUTES.MRV_CREATE) return !!permissions.canManageMRV.create
    if (route === ROUTES.MRV_VIEW) {
        return !!permissions.canManageMRV.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessMCT(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessMCT', route, permissions)

    if (!permissions.canManageMCT) return false

    const authUser = getAuthUser()

    if (route === ROUTES.MCT_INDEX) return !!permissions.canManageMCT.search
    if (route === ROUTES.MCT_CREATE) return !!permissions.canManageMCT.create
    if (route === ROUTES.MCT_VIEW) {
        return !!permissions.canManageMCT.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessMCRT(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessMCRT', route, permissions)

    if (!permissions.canManageMCRT) return false

    const authUser = getAuthUser()

    if (route === ROUTES.MCRT_INDEX) return !!permissions.canManageMCRT.search
    if (route === ROUTES.MCRT_CREATE) return !!permissions.canManageMCRT.create
    if (route === ROUTES.MCRT_VIEW) {
        return !!permissions.canManageMCRT.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessMST(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessMST', route, permissions)

    if (!permissions.canManageMST) return false

    const authUser = getAuthUser()

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

function canAccessUnit(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessUnit', route, permissions)

    if (!permissions.canManageUnit) return false

    if (route === ROUTES.UNIT_INDEX) return !!permissions.canManageUnit.read
    if (route === ROUTES.UNIT_CREATE) return !!permissions.canManageUnit.create
    if (route === ROUTES.UNIT_UPDATE) return !!permissions.canManageUnit.update


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

function canAccessItemType(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessItemType', route, permissions)

    if (!permissions.canManageItemType) return false

    if (route === ROUTES.ITEM_TYPE_INDEX) return !!permissions.canManageItemType.read
    if (route === ROUTES.ITEM_TYPE_CREATE) return !!permissions.canManageItemType.create
    if (route === ROUTES.ITEM_TYPE_UPDATE) return !!permissions.canManageItemType.update


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

function canAccessFuelType(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessFuelType', route, permissions)

    if (!permissions.canManageFuelType) return false

    if (route === ROUTES.FUEL_TYPE_INDEX) return !!permissions.canManageFuelType.read
    if (route === ROUTES.FUEL_TYPE_CREATE) return !!permissions.canManageFuelType.create
    if (route === ROUTES.FUEL_TYPE_UPDATE) return !!permissions.canManageFuelType.update


    return true

}

function canAccessGasStation(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessGasStation', route, permissions)

    if (!permissions.canManageGasStation) return false

    if (route === ROUTES.GAS_STATION_INDEX) return !!permissions.canManageGasStation.read
    if (route === ROUTES.GAS_STATION_CREATE) return !!permissions.canManageGasStation.create
    if (route === ROUTES.GAS_STATION_UPDATE) return !!permissions.canManageGasStation.update


    return true

}

function canAccessTripTicket(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessTripTicket', route, permissions)

    if (!permissions.canManageTripTicket) return false

    const authUser = getAuthUser()

    if (route === ROUTES.TRIP_TICKET_INDEX) return !!permissions.canManageTripTicket.search
    if (route === ROUTES.TRIP_TICKET_CREATE) return !!permissions.canManageTripTicket.create
    if (route === ROUTES.TRIP_TICKET_VIEW) {
        return !!permissions.canManageTripTicket.viewDetails || isApprover(authUser)
    }


    return true

}

function canAccessGasSlip(route: ROUTES, permissions: WarehousePermissions) {

    console.log('canAccessGasSlip', route, permissions)

    if (!permissions.canManageGasSlip) return false

    const authUser = getAuthUser()

    if (route === ROUTES.GAS_SLIP_INDEX) return !!permissions.canManageGasSlip.search
    if (route === ROUTES.GAS_SLIP_CREATE) return !!permissions.canManageGasSlip.create
    if (route === ROUTES.GAS_SLIP_VIEW) {
        return !!permissions.canManageGasSlip.viewDetails || isApprover(authUser)
    }

    return true

}