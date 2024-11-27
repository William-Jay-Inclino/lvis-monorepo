import * as moment from 'moment';
import { APPROVAL_STATUS, ITEM_TRANSACTION_TYPE, Role, VAT_TYPE } from "./types"
import { VAT_RATE } from './config';
import * as path from 'path';
import { readFileSync } from 'fs';
import { User } from 'apps/system/src/__common__/user.entity';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { DB_ENTITY, MODULE_MAPPER, ModuleMapping } from './constants';
import { NotFoundException } from '@nestjs/common';

export const isValidApprovalStatus = (status: number): boolean => {

    const approvalStatusArray = [
        APPROVAL_STATUS.APPROVED,
        APPROVAL_STATUS.DISAPPROVED,
        APPROVAL_STATUS.PENDING,
        APPROVAL_STATUS.CANCELLED
    ]

    if (approvalStatusArray.includes(status)) {
        return true
    }

    return false

}

export const isValidItemTransactionType = (type: number): boolean => {

    const transactionTypeArray = [
        ITEM_TRANSACTION_TYPE.STOCK_IN,
        ITEM_TRANSACTION_TYPE.STOCK_OUT,
    ]

    if (transactionTypeArray.includes(type)) {
        return true
    }

    return false

}

export function getFullname(firstname: string, middlename: string | null, lastname: string) {
    if (middlename) {
        return lastname + ', ' + firstname + ' ' + convertMiddleNameToInitial(middlename)
    }
    return lastname + ', ' + firstname
}

export function convertMiddleNameToInitial(middleName: string) {
    if (middleName && middleName.length > 0) {
        return middleName.charAt(0).toUpperCase() + ".";
    } else {
        return "";
    }
}

export function getDateRange(dateString: string): { startDate: string, endDate: string } {
    const requestedDate = new Date(dateString);
    const startDate = new Date(
        requestedDate.getFullYear(),
        requestedDate.getMonth(),
        requestedDate.getDate(),
        0,
        0,
        0
    );
    const endDate = new Date(
        requestedDate.getFullYear(),
        requestedDate.getMonth(),
        requestedDate.getDate(),
        23,
        59,
        59
    );
    return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
    };
}

export function formatToPhpCurrency(number: number) {
    return number.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// In PURCHASING SERVICE you can only update/cancel if you are the owner or admin
// In DATA MANAGEMENT anyone can CRUD if permitted
// In STOCK INVENTORY anyone can CRUD if permitted


export function canAccess(user: User, module: MODULES, resolver: RESOLVERS): boolean {

    if (user.role === Role.ADMIN) {
        return true
    }

    if (!user.permissions) {
        return false;
    }

    // @ts-ignore
    const permissions = JSON.parse(user.permissions) as UserPermissions

    if (!permissions) {
        return
    }

    if (!permissions.warehouse) {
        return false
    }

    const warehousePermissions = permissions.warehouse;

    const accessMap = {

        // ===================== PURCHASING ===================== 
        [MODULES.CANVASS]: {
            [RESOLVERS.createCanvass]: warehousePermissions.canManageCanvass?.create ?? false,
            [RESOLVERS.printCanvass]: warehousePermissions.canManageCanvass?.print ?? false,
        },
        [MODULES.RV]: {
            [RESOLVERS.createRv]: warehousePermissions.canManageRV?.create ?? false,
            [RESOLVERS.printRv]: warehousePermissions.canManageRV?.print ?? false,
        },
        [MODULES.SPR]: {
            [RESOLVERS.createSpr]: warehousePermissions.canManageSPR?.create ?? false,
            [RESOLVERS.printSpr]: warehousePermissions.canManageSPR?.print ?? false,
        },
        [MODULES.JO]: {
            [RESOLVERS.createJo]: warehousePermissions.canManageJO?.create ?? false,
            [RESOLVERS.printJo]: warehousePermissions.canManageJO?.print ?? false,
        },
        [MODULES.MEQS]: {
            [RESOLVERS.createMeqs]: warehousePermissions.canManageMEQS?.create ?? false,
            [RESOLVERS.printMeqs]: warehousePermissions.canManageMEQS?.print ?? false,
        },
        [MODULES.PO]: {
            [RESOLVERS.createPo]: warehousePermissions.canManagePO?.create ?? false,
            [RESOLVERS.printPo]: warehousePermissions.canManagePO?.print ?? false,
        },
        [MODULES.RR]: {
            [RESOLVERS.createRr]: warehousePermissions.canManageRR?.create ?? false,
            [RESOLVERS.printRr]: warehousePermissions.canManageRR?.print ?? false,
        },


        // ===================== WAREHOUSING ===================== 

        [MODULES.OSRIV]: {
            [RESOLVERS.createOsriv]: warehousePermissions.canManageOSRIV?.create ?? false,
            [RESOLVERS.printOsriv]: warehousePermissions.canManageOSRIV?.print ?? false,
        },
        [MODULES.SERIV]: {
            [RESOLVERS.createSeriv]: warehousePermissions.canManageSERIV?.create ?? false,
            [RESOLVERS.printSeriv]: warehousePermissions.canManageSERIV?.print ?? false,
        },
        [MODULES.MRV]: {
            [RESOLVERS.createMrv]: warehousePermissions.canManageMRV?.create ?? false,
            [RESOLVERS.printMrv]: warehousePermissions.canManageMRV?.print ?? false,
        },
        [MODULES.MCT]: {
            [RESOLVERS.createMct]: warehousePermissions.canManageMCT?.create ?? false,
            [RESOLVERS.printMct]: warehousePermissions.canManageMCT?.print ?? false,
        },
        [MODULES.MCRT]: {
            [RESOLVERS.createMcrt]: warehousePermissions.canManageMCRT?.create ?? false,
            [RESOLVERS.printMcrt]: warehousePermissions.canManageMCRT?.print ?? false,
        },
        [MODULES.MST]: {
            [RESOLVERS.createMst]: warehousePermissions.canManageMST?.create ?? false,
            [RESOLVERS.printMst]: warehousePermissions.canManageMST?.print ?? false,
        },
        [MODULES.SUPPLIER]: {
            [RESOLVERS.createSupplier]: warehousePermissions.canManageSupplier?.create ?? false,
            [RESOLVERS.updateSupplier]: warehousePermissions.canManageSupplier?.update ?? false,
            [RESOLVERS.removeSupplier]: warehousePermissions.canManageSupplier?.delete ?? false,
        },
        [MODULES.UNIT]: {
            [RESOLVERS.createUnit]: warehousePermissions.canManageUnit?.create ?? false,
            [RESOLVERS.updateUnit]: warehousePermissions.canManageUnit?.update ?? false,
            [RESOLVERS.removeUnit]: warehousePermissions.canManageUnit?.delete ?? false,
        },
        [MODULES.STATION]: {
            [RESOLVERS.createStation]: warehousePermissions.canManageStation?.create ?? false,
            [RESOLVERS.updateStation]: warehousePermissions.canManageStation?.update ?? false,
            [RESOLVERS.removeStation]: warehousePermissions.canManageStation?.delete ?? false,
        },
        [MODULES.PROJECT]: {
            [RESOLVERS.createProject]: warehousePermissions.canManageProject?.create ?? false,
            [RESOLVERS.updateProject]: warehousePermissions.canManageProject?.update ?? false,
            [RESOLVERS.removeProject]: warehousePermissions.canManageProject?.delete ?? false,
        },
        [MODULES.ITEM]: {
            [RESOLVERS.createItem]: warehousePermissions.canManageItem?.create ?? false,
            [RESOLVERS.updateItem]: warehousePermissions.canManageItem?.update ?? false,
            [RESOLVERS.removeItem]: warehousePermissions.canManageItem?.delete ?? false,
        },
        [MODULES.ITEM_TYPE]: {
            [RESOLVERS.createItemType]: warehousePermissions.canManageItemType?.create ?? false,
            [RESOLVERS.updateItemType]: warehousePermissions.canManageItemType?.update ?? false,
            [RESOLVERS.removeItemType]: warehousePermissions.canManageItemType?.delete ?? false,
        },


        // ===================== MOTORPOOL ===================== 

        [MODULES.GAS_STATION]: {
            [RESOLVERS.createGasStation]: warehousePermissions.canManageGasStation?.create ?? false,
            [RESOLVERS.updateGasStation]: warehousePermissions.canManageGasStation?.update ?? false,
            [RESOLVERS.removeGasStation]: warehousePermissions.canManageGasStation?.delete ?? false,
        },
        [MODULES.VEHICLE]: {
            [RESOLVERS.createVehicle]: warehousePermissions.canManageVehicle?.create ?? false,
            [RESOLVERS.updateVehicle]: warehousePermissions.canManageVehicle?.update ?? false,
            [RESOLVERS.removeVehicle]: warehousePermissions.canManageVehicle?.delete ?? false,
        },
        [MODULES.FUEL_TYPE]: {
            [RESOLVERS.createFuelType]: warehousePermissions.canManageFuelType?.create ?? false,
            [RESOLVERS.updateFuelType]: warehousePermissions.canManageFuelType?.update ?? false,
            [RESOLVERS.removeFuelType]: warehousePermissions.canManageFuelType?.delete ?? false,
        },
        [MODULES.TRIP_TICKET]: {
            [RESOLVERS.createTripTicket]: warehousePermissions.canManageTripTicket?.create ?? false,
        },
        [MODULES.GAS_SLIP]: {
            [RESOLVERS.createGasSlip]: warehousePermissions.canManageGasSlip?.create ?? false,
        },
    };

    return accessMap[module]?.[resolver] ?? false;
}

export function isAdmin(authUser: AuthUser): boolean {
    return (authUser.user.role === Role.ADMIN)
}

export function isNormalUser(authUser: AuthUser): boolean {
    return (authUser.user.role === Role.USER)
}

export function formatDate(d: any, hasTime?: boolean) {

    if (!d) {
        return ""
    }

    let date = d;
    if (!isNaN(d)) {
        date = Number(d) < 10000000000 ? Number(d) * 1000 : Number(d);
    }

    return !!hasTime ? moment(date).format('MMM DD YYYY h:mm A') : moment(date).format('MMM DD YYYY')
}

export function getVatAmount(price: number, vat_type: VAT_TYPE) {

    if (!price) return 0

    if (vat_type === VAT_TYPE.EXC) {
        return price * VAT_RATE
    }

    if (vat_type === VAT_TYPE.INC) {
        return (price * VAT_RATE) / (1 + VAT_RATE);
    }

    return 0

}

export function getImageAsBase64(filename: string): string {
    const imagePath = path.resolve('assets', filename);
    const imageBuffer = readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    return base64Image;
}

export function getModule(entity: DB_ENTITY): ModuleMapping {
    const module = MODULE_MAPPER[entity]
    if(!module) {
        throw new NotFoundException(`module not found`)
    }
    return module
}

export function getFullnameWithTitles(
    firstname: string,
    lastname: string,
    middlename?: string | null,
    namePrefix?: string | null,
    nameSuffix?: string | null
  ): string {
    const middleInitial = middlename ? `${middlename[0].toUpperCase()}.` : "";
  
    const formattedLastName = nameSuffix ? `${lastname},` : lastname;
  
    const fullName = [
      namePrefix,  
      firstname,    
      middleInitial, 
      formattedLastName,
      nameSuffix    
    ]
      .filter(Boolean) 
      .join(" "); 
  
    return fullName;
}