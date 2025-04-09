import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import * as data from './mock-data';
import { SETTINGS } from '../__common__/constants';
import { Prisma } from 'apps/system/prisma/generated/client';
import { encrypt_password } from '../__common__/helpers';

@Injectable()
export class SeederService {

    private readonly secretKey = process.env.CRYPTO_SECRET_KEY;

    constructor(private readonly prisma: PrismaService) { }

    async seedData() {
        console.log('seeding system database...');
        try {
            await this.prisma.$transaction(async (prisma) => {

                // data mgmt
                await this.seedClassification(prisma as unknown as Prisma.TransactionClient)
                await this.seedAccount(prisma as unknown as Prisma.TransactionClient)
                await this.seedDepartment(prisma as unknown as Prisma.TransactionClient)
                await this.seedDivision(prisma as unknown as Prisma.TransactionClient)

                // users and employees
                await this.seedEmployee(prisma as unknown as Prisma.TransactionClient)
                await this.seedUserTable(prisma as unknown as Prisma.TransactionClient)
                await this.seedUserEmployeeTable(prisma as unknown as Prisma.TransactionClient);
                await this.seedUserGroupTable(prisma as unknown as Prisma.TransactionClient);
                await this.seedUserGroupMembersTable(prisma as unknown as Prisma.TransactionClient);

                // settings
                await this.seedSettingTable(prisma as unknown as Prisma.TransactionClient);
                await this.seedJOApproverSetting(prisma as unknown as Prisma.TransactionClient);
                await this.seedRVApproverSetting(prisma as unknown as Prisma.TransactionClient);
                await this.seedSPRApproverSetting(prisma as unknown as Prisma.TransactionClient);
                await this.seedMEQSApproverSetting(prisma as unknown as Prisma.TransactionClient);
                await this.seedPOApproverSetting(prisma as unknown as Prisma.TransactionClient);
                await this.seedRRApproverSetting(prisma as unknown as Prisma.TransactionClient);
            });
        } catch (error) {
        }
    }

    async seedDepartment(prisma: Prisma.TransactionClient) {
        console.log('seeding department table...');
        try {
            await prisma.department.createMany({
                data: data.departments
            })
        } catch (error) {
            throw error; 
        }

    }

    async seedDivision(prisma: Prisma.TransactionClient) {
        console.log('seeding division table...');

        try {
            await prisma.division.createMany({
                data: data.divisions
            })
        } catch (error) {
            throw error; 
        }

    }

    async seedClassification(prisma: Prisma.TransactionClient) {
        console.log('seeding classification table...');

        try {
            await prisma.classification.createMany({
                data: data.classifications
            })
        } catch (error) {
            throw error
        }


    }

    async seedAccount(prisma: Prisma.TransactionClient) {
        console.log('seeding account table...');

        try {
            await prisma.account.createMany({
                data: data.accounts
            })
        } catch (error) {
            throw error
        }


    }

    async seedEmployee(prisma: Prisma.TransactionClient) {
        console.log('seeding employee table...');

        try {
            await prisma.employee.createMany({
                data: data.employees
            })
        } catch (error) {
            throw error; 
        }


    }

    async seedJOApproverSetting(prisma: Prisma.TransactionClient) {

        console.log('seeding jo_approver_setting table...');

        try {
            await prisma.jOApproverSetting.createMany({
                data: data.jo_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedRVApproverSetting(prisma: Prisma.TransactionClient) {
        console.log('seeding rv_approver_setting table...');

        try {

            await prisma.rVApproverSetting.createMany({
                data: data.rv_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedSPRApproverSetting(prisma: Prisma.TransactionClient) {
        console.log('seeding spr_approver_setting table...');

        try {

            return prisma.sPRApproverSetting.createMany({
                data: data.spr_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedMEQSApproverSetting(prisma: Prisma.TransactionClient) {
        console.log('seeding meqs_approver_setting table...');

        try {
            await prisma.mEQSApproverSetting.createMany({
                data: data.meqs_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedPOApproverSetting(prisma: Prisma.TransactionClient) {
        console.log('seeding po_approver_setting table...');

        try {
            await prisma.pOApproverSetting.createMany({
                data: data.po_default_approvers,
            })
        } catch (error) {
            throw error
        }

    }

    async seedRRApproverSetting(prisma: Prisma.TransactionClient) {
        console.log('seeding rr_approver_setting table...');

        try {
            await prisma.rRApproverSetting.createMany({
                data: data.rr_default_approvers,
            })
        } catch (error) {
            throw error
        }

    }

    async seedUserTable(prisma: Prisma.TransactionClient) {
        console.log('seeding user table...');

        const users = data.users.map(i => ({...i, password: encrypt_password(i.password, this.secretKey)}))

        try {
            await prisma.user.createMany({
                // @ts-ignore
                data: users,
            })
        } catch (error) {
            throw error; 
        }

    }

    async seedUserGroupTable(prisma: Prisma.TransactionClient) {
        console.log('seeding user_group table...');

        try {
            await prisma.userGroup.createMany({
                data: data.userGroups,
            })
        } catch (error) {
            throw error
        }

    }

    async seedUserGroupMembersTable(prisma: Prisma.TransactionClient) {
        console.log('seeding user_group_member table...');

        try {
            await prisma.userGroupMembers.createMany({
                data: data.userGroupMember,
            })
        } catch (error) {
            throw error
        }

    }

    async seedUserEmployeeTable(prisma: Prisma.TransactionClient) {
        console.log('seeding employee table...');

        try {
            for (const userEmployee of data.userEmployees) {
                await prisma.userEmployee.create({
                    data: userEmployee,
                });
            }
        } catch (error) {
            throw error; 
        }
    }

    async seedSettingTable(prisma: Prisma.TransactionClient) {
        console.log('seeding setting table...');
    
        try {
            await prisma.setting.createMany({
                data: [
                    {
                        key: SETTINGS.GENERAL_MANAGER,
                        value: data.jannie
                    },
                    {
                        key: SETTINGS.WAREHOUSE_CUSTODIAN,
                        value: data.gene
                    },
                    {
                        key: SETTINGS.FMSD_CHIEF,
                        value: data.monroe
                    },
                    {
                        key: SETTINGS.ISD_MANAGER,
                        value: data.analou
                    },
                ]
            });
        } catch (error) {
            throw error
        }
    }

}
