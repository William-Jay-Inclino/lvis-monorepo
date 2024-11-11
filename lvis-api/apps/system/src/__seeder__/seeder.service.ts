import { Injectable } from '@nestjs/common';
import { PrismaService } from '../__prisma__/prisma.service';
import * as data from './mock-data';
import { SETTINGS } from '../__common__/constants';

@Injectable()
export class SeederService {

    constructor(private readonly prisma: PrismaService) { }

    async seedData() {
        console.log('Seeding data...');

        try {
            await this.prisma.$transaction([
                this.seedDepartment(),
                this.seedClassification(),
                this.seedAccount(),
                this.seedPosition(),
                this.seedEmployee(),
                this.seedJOApproverSetting(),
                this.seedRVApproverSetting(),
                this.seedSPRApproverSetting(),
                this.seedMEQSApproverSetting(),
                this.seedPOApproverSetting(),
                this.seedRRApproverSetting(),
                this.seedUserTable(),
                this.seedUserGroupTable(),
                this.seedUserGroupMembersTable(),
                this.seedUserEmployeeTable(),
                this.seedSettingTable(),
            ]
            );

            console.log('Seeding done')
        } catch (error) {
            console.error('Transaction failed. Rolling back...', error);
        }
    }

    seedDepartment() {
        console.log('seeding department table...')

        try {
            return this.prisma.department.createMany({
                data: data.departments
            })
        } catch (error) {
            console.error(error)
        }

    }

    seedClassification() {
        console.log('seeding classification table...')

        try {
            return this.prisma.classification.createMany({
                data: data.classifications
            })
        } catch (error) {
            console.error(error)
        }


    }

    seedPosition() {
        console.log('seeding position table...')

        try {
            return this.prisma.position.createMany({
                data: data.positions
            })
        } catch (error) {
            console.error(error)
        }


    }

    seedAccount() {
        console.log('seeding account table...')

        try {
            return this.prisma.account.createMany({
                data: data.accounts
            })
        } catch (error) {
            console.error(error)
        }


    }

    seedEmployee() {
        console.log('seeding employee table...')

        try {
            return this.prisma.employee.createMany({
                data: data.employees
            })
        } catch (error) {
            console.error(error)
        }


    }

    seedJOApproverSetting() {
        console.log('seeding jo_approver_setting table...')

        try {
            return this.prisma.jOApproverSetting.createMany({
                data: data.jo_default_approvers,
            })
        } catch (error) {
            console.error(error)
        }


    }

    seedRVApproverSetting() {
        console.log('seeding rv_approver_setting table...')

        try {
            return this.prisma.rVApproverSetting.createMany({
                data: data.rv_default_approvers,
            })
        } catch (error) {
            console.error(error)
        }


    }

    seedSPRApproverSetting() {
        console.log('seeding spr_approver_setting table...')

        try {
            return this.prisma.sPRApproverSetting.createMany({
                data: data.spr_default_approvers,
            })
        } catch (error) {
            console.error(error)
        }


    }

    seedMEQSApproverSetting() {
        console.log('seeding meqs_approver_setting table...')

        try {
            return this.prisma.mEQSApproverSetting.createMany({
                data: data.meqs_default_approvers,
            })
        } catch (error) {
            console.error(error)
        }


    }

    seedPOApproverSetting() {
        console.log('seeding po_approver_setting table...')

        try {
            return this.prisma.pOApproverSetting.createMany({
                data: data.po_default_approvers,
            })
        } catch (error) {
            console.error(error)
        }

    }

    seedRRApproverSetting() {
        console.log('seeding rr_approver_setting table...')

        try {
            return this.prisma.rRApproverSetting.createMany({
                data: data.rr_default_approvers,
            })
        } catch (error) {
            console.error(error)
        }

    }

    seedUserTable() {
        console.log('seeding user table...')

        try {
            return this.prisma.user.createMany({
                // @ts-ignore
                data: data.users,
            })
        } catch (error) {
            console.error(error)
        }

    }

    seedUserGroupTable() {
        console.log('seeding user_group table...')

        try {
            return this.prisma.userGroup.createMany({
                data: data.userGroups,
            })
        } catch (error) {
            console.error(error)
        }

    }

    seedUserGroupMembersTable() {
        console.log('seeding user_group_member table...')

        try {
            return this.prisma.userGroupMembers.createMany({
                data: data.userGroupMember,
            })
        } catch (error) {
            console.error(error)
        }

    }

    seedUserEmployeeTable() {
        console.log('seeding user_employee table....')

        try {
            return this.prisma.userEmployee.createMany({
                data: data.userEmployees,
            })
        } catch (error) {
            console.error(error)
        }

    }

    seedSettingTable() {
        console.log('seeding setting table....');
    
        try {
            return this.prisma.setting.createMany({
                data: [
                    {
                        key: SETTINGS.GENERAL_MANAGER,
                        value: data.employees[3].id
                    },
                    {
                        key: SETTINGS.WAREHOUSE_CUSTODIAN,
                        value: data.employees[19].id
                    },
                    {
                        key: SETTINGS.FMSD_CHIEF,
                        value: data.employees[20].id
                    },
                ]
            });
        } catch (error) {
            console.error(error);
        }
    }

}
