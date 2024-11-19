import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import * as data from './mock-data';
import { SETTINGS } from '../__common__/constants';
import { PrismaClient } from 'apps/system/prisma/generated/client';

@Injectable()
export class SeederService {

    constructor(private readonly prisma: PrismaService) { }

    // async seedData() {
    //     console.log('Seeding data...');

    //     try {
    //         await this.prisma.$transaction([
                // // this.seedClassification(),
                // // this.seedAccount(),
                // this.seedDepartment(),
                // this.seedDivision(),
                // this.seedEmployee(),
                // this.seedUserTable(),
                // this.seedUserEmployeeTable(),
                // // this.seedJOApproverSetting(),
                // // this.seedRVApproverSetting(),
                // // this.seedSPRApproverSetting(),
                // // this.seedMEQSApproverSetting(),
                // // this.seedPOApproverSetting(),
                // // this.seedRRApproverSetting(),
                // // this.seedUserGroupTable(),
                // // this.seedUserGroupMembersTable(),
                // // this.seedSettingTable(),
    //         ]
    //         );

    //         console.log('Seeding done')
    //     } catch (error) {
    //         console.error('Transaction failed. Rolling back...', error);
    //     }
    // }

    async seedData() {
        console.log('Starting database seeding transaction...');

        try {
            await this.prisma.$transaction(async (prisma) => {

                // data mgmt
                await this.seedClassification(prisma as PrismaClient)
                await this.seedAccount(prisma as PrismaClient)
                await this.seedDepartment(prisma as PrismaClient)
                await this.seedDivision(prisma as PrismaClient)

                // users and employees
                await this.seedEmployee(prisma as PrismaClient)
                await this.seedUserTable(prisma as PrismaClient)
                await this.seedUserEmployeeTable(prisma as PrismaClient);
                await this.seedUserGroupTable(prisma as PrismaClient);
                await this.seedUserGroupMembersTable(prisma as PrismaClient);

                // settings
                await this.seedSettingTable(prisma as PrismaClient);
                await this.seedJOApproverSetting(prisma as PrismaClient);
                await this.seedRVApproverSetting(prisma as PrismaClient);
                await this.seedSPRApproverSetting(prisma as PrismaClient);
                await this.seedMEQSApproverSetting(prisma as PrismaClient);
                await this.seedPOApproverSetting(prisma as PrismaClient);
                await this.seedRRApproverSetting(prisma as PrismaClient);
            });
            console.log('Database seeding transaction completed successfully.');
        } catch (error) {
            console.error('Error during database seeding transaction:', error);
        }
    }

    async seedDepartment(prisma: PrismaClient) {
        console.log('seeding department table...')

        try {
            await prisma.department.createMany({
                data: data.departments
            })
        } catch (error) {
            throw error; 
        }

    }

    async seedDivision(prisma: PrismaClient) {
        console.log('seeding division table...')

        try {
            await prisma.division.createMany({
                data: data.divisions
            })
        } catch (error) {
            throw error; 
        }

    }

    async seedClassification(prisma: PrismaClient) {
        console.log('seeding classification table...')

        try {
            await prisma.classification.createMany({
                data: data.classifications
            })
        } catch (error) {
            throw error
        }


    }

    async seedAccount(prisma: PrismaClient) {
        console.log('seeding account table...')

        try {
            await prisma.account.createMany({
                data: data.accounts
            })
        } catch (error) {
            throw error
        }


    }

    async seedEmployee(prisma: PrismaClient) {
        console.log('seeding employee table...')

        try {
            await prisma.employee.createMany({
                data: data.employees
            })
        } catch (error) {
            throw error; 
        }


    }

    async seedJOApproverSetting(prisma: PrismaClient) {
        console.log('seeding jo_approver_setting table...')

        try {
            await prisma.jOApproverSetting.createMany({
                data: data.jo_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedRVApproverSetting(prisma: PrismaClient) {
        console.log('seeding rv_approver_setting table...')

        try {

            await prisma.rVApproverSetting.createMany({
                data: data.rv_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedSPRApproverSetting(prisma: PrismaClient) {

        console.log('seeding spr_approver_setting table...')

        try {

            return prisma.sPRApproverSetting.createMany({
                data: data.spr_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedMEQSApproverSetting(prisma: PrismaClient) {
        console.log('seeding meqs_approver_setting table...')

        try {
            await prisma.mEQSApproverSetting.createMany({
                data: data.meqs_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedPOApproverSetting(prisma: PrismaClient) {
        console.log('seeding po_approver_setting table...')

        try {
            await prisma.pOApproverSetting.createMany({
                data: data.po_default_approvers,
            })
        } catch (error) {
            throw error
        }

    }

    async seedRRApproverSetting(prisma: PrismaClient) {
        console.log('seeding rr_approver_setting table...')

        try {
            await prisma.rRApproverSetting.createMany({
                data: data.rr_default_approvers,
            })
        } catch (error) {
            throw error
        }

    }

    async seedUserTable(prisma: PrismaClient) {
        console.log('seeding user table...')

        try {
            await prisma.user.createMany({
                // @ts-ignore
                data: data.users,
            })
        } catch (error) {
            throw error; 
        }

    }

    async seedUserGroupTable(prisma: PrismaClient) {
        console.log('seeding user_group table...')

        try {
            await prisma.userGroup.createMany({
                data: data.userGroups,
            })
        } catch (error) {
            throw error
        }

    }

    async seedUserGroupMembersTable(prisma: PrismaClient) {
        console.log('seeding user_group_member table...')

        try {
            await prisma.userGroupMembers.createMany({
                data: data.userGroupMember,
            })
        } catch (error) {
            throw error
        }

    }

    async seedUserEmployeeTable(prisma: PrismaClient) {
        console.log('Seeding user_employee table...');

        try {
            for (const userEmployee of data.userEmployees) {
                await prisma.userEmployee.create({
                    data: userEmployee,
                });
            }
            console.log('Seeding user_employee table completed successfully.');
        } catch (error) {
            throw error; 
        }
    }

    async seedSettingTable(prisma: PrismaClient) {
        console.log('seeding setting table....');
    
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
                ]
            });
        } catch (error) {
            throw error
        }
    }

}
