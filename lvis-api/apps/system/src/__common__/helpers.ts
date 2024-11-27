import { Role } from "apps/system/prisma/generated/client"
import { User } from "./user.entity"
import { MODULES } from "./modules.enum"
import { RESOLVERS } from "./resolvers.enum"
import * as crypto from 'crypto';

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

    if (!permissions.system) {
        return false
    }

    const systemPermissions = permissions.system;

    const accessMap = {
        [MODULES.ACCOUNT]: {
            [RESOLVERS.createAccount]: systemPermissions.canManageAccount?.create ?? false,
            // [RESOLVERS.accounts]: systemPermissions.canManageAccount?.read ?? false,
            // [RESOLVERS.account]: systemPermissions.canManageAccount?.read ?? false,
            [RESOLVERS.updateAccount]: systemPermissions.canManageAccount?.update ?? false,
            [RESOLVERS.removeAccount]: systemPermissions.canManageAccount?.delete ?? false,
        },
        [MODULES.CLASSIFICATION]: {
            [RESOLVERS.createClassification]: systemPermissions.canManageClassification?.create ?? false,
            // [RESOLVERS.classifications]: systemPermissions.canManageClassification?.read ?? false,
            // [RESOLVERS.classification]: systemPermissions.canManageClassification?.read ?? false,
            [RESOLVERS.updateClassification]: systemPermissions.canManageClassification?.update ?? false,
            [RESOLVERS.removeClassification]: systemPermissions.canManageClassification?.delete ?? false,
        },
        [MODULES.DEPARTMENT]: {
            [RESOLVERS.createDepartment]: systemPermissions.canManageDepartment?.create ?? false,
            // [RESOLVERS.departments]: systemPermissions.canManageDepartment?.read ?? false,
            // [RESOLVERS.department]: systemPermissions.canManageDepartment?.read ?? false,
            [RESOLVERS.updateDepartment]: systemPermissions.canManageDepartment?.update ?? false,
            [RESOLVERS.removeDepartment]: systemPermissions.canManageDepartment?.delete ?? false,
        },
        [MODULES.DIVISION]: {
            [RESOLVERS.createDivision]: systemPermissions.canManageDivision?.create ?? false,
            // [RESOLVERS.departments]: systemPermissions.canManageDepartment?.read ?? false,
            // [RESOLVERS.department]: systemPermissions.canManageDepartment?.read ?? false,
            [RESOLVERS.updateDivision]: systemPermissions.canManageDivision?.update ?? false,
            [RESOLVERS.removeDivision]: systemPermissions.canManageDivision?.delete ?? false,
        },
        [MODULES.EMPLOYEE]: {
            [RESOLVERS.createEmployee]: systemPermissions.canManageEmployee?.create ?? false,
            // [RESOLVERS.employees]: systemPermissions.canManageEmployee?.read ?? false,
            // [RESOLVERS.employee]: systemPermissions.canManageEmployee?.read ?? false,
            [RESOLVERS.updateEmployee]: systemPermissions.canManageEmployee?.update ?? false,
            [RESOLVERS.removeEmployee]: systemPermissions.canManageEmployee?.delete ?? false,
        },
    };

    return accessMap[module]?.[resolver] ?? false;
}



export function encrypt_password(password: string, secretKey: string): string {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    
    return iv.toString('hex') + ':' + encrypted;
  }
  

  export function decrypt_password(ciphertext: string, secretKey: string): string {
    
    const parts = ciphertext.split(':');
    if (parts.length !== 2) {
        throw new Error('Invalid ciphertext format. It should be in the format ivHex:encryptedData');
    }
    
    const [ivHex, encrypted] = parts;
    
    if (ivHex.length !== 32) {
        throw new Error('Invalid IV length: should be 32 hex characters (16 bytes)');
    }

    try {
        const iv = Buffer.from(ivHex, 'hex');  
        const encryptedBuffer = Buffer.from(encrypted, 'hex'); 

        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let decrypted = decipher.update(encryptedBuffer, null, 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted; 
    } catch (error) {
        throw new Error(`Decryption failed: ${error.message}`);
    }
}