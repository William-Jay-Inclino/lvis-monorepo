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

        try {
            await this.prisma.$transaction(async (prisma) => {

                // data mgmt
                await this.seedClassification(prisma)
                await this.seedAccount(prisma)
                await this.seedDepartment(prisma)
                await this.seedDivision(prisma)

                // users and employees
                await this.seedEmployee(prisma)
                await this.seedUserTable(prisma)
                await this.seedUserEmployeeTable(prisma);
                await this.seedUserGroupTable(prisma);
                await this.seedUserGroupMembersTable(prisma);

                // settings
                await this.seedSettingTable(prisma);
                await this.seedJOApproverSetting(prisma);
                await this.seedRVApproverSetting(prisma);
                await this.seedSPRApproverSetting(prisma);
                await this.seedMEQSApproverSetting(prisma);
                await this.seedPOApproverSetting(prisma);
                await this.seedRRApproverSetting(prisma);
            });
        } catch (error) {
        }
    }

    async seedDepartment(prisma: Prisma.TransactionClient) {

        try {
            await prisma.department.createMany({
                data: data.departments
            })
        } catch (error) {
            throw error; 
        }

    }

    async seedDivision(prisma: Prisma.TransactionClient) {

        try {
            await prisma.division.createMany({
                data: data.divisions
            })
        } catch (error) {
            throw error; 
        }

    }

    async seedClassification(prisma: Prisma.TransactionClient) {

        try {
            await prisma.classification.createMany({
                data: data.classifications
            })
        } catch (error) {
            throw error
        }


    }

    async seedAccount(prisma: Prisma.TransactionClient) {

        try {
            await prisma.account.createMany({
                data: data.accounts
            })
        } catch (error) {
            throw error
        }


    }

    async seedEmployee(prisma: Prisma.TransactionClient) {

        try {
            await prisma.employee.createMany({
                data: data.employees
            })
        } catch (error) {
            throw error; 
        }


    }

    async seedJOApproverSetting(prisma: Prisma.TransactionClient) {

        try {
            await prisma.jOApproverSetting.createMany({
                data: data.jo_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedRVApproverSetting(prisma: Prisma.TransactionClient) {

        try {

            await prisma.rVApproverSetting.createMany({
                data: data.rv_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedSPRApproverSetting(prisma: Prisma.TransactionClient) {

        try {

            return prisma.sPRApproverSetting.createMany({
                data: data.spr_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedMEQSApproverSetting(prisma: Prisma.TransactionClient) {

        try {
            await prisma.mEQSApproverSetting.createMany({
                data: data.meqs_default_approvers,
            })
        } catch (error) {
            throw error
        }


    }

    async seedPOApproverSetting(prisma: Prisma.TransactionClient) {

        try {
            await prisma.pOApproverSetting.createMany({
                data: data.po_default_approvers,
            })
        } catch (error) {
            throw error
        }

    }

    async seedRRApproverSetting(prisma: Prisma.TransactionClient) {

        try {
            await prisma.rRApproverSetting.createMany({
                data: data.rr_default_approvers,
            })
        } catch (error) {
            throw error
        }

    }

    async seedUserTable(prisma: Prisma.TransactionClient) {

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

        try {
            await prisma.userGroup.createMany({
                data: data.userGroups,
            })
        } catch (error) {
            throw error
        }

    }

    async seedUserGroupMembersTable(prisma: Prisma.TransactionClient) {

        try {
            await prisma.userGroupMembers.createMany({
                data: data.userGroupMember,
            })
        } catch (error) {
            throw error
        }

    }

    async seedUserEmployeeTable(prisma: Prisma.TransactionClient) {

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
