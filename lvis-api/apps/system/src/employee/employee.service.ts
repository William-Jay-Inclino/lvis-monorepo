import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Employee, Prisma } from 'apps/system/prisma/generated/client';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { SystemRemoveResponse } from '../__common__/classes';
import { EmployeesResponse } from './entities/employees-response.entity';
import { AuthUser } from '../__common__/auth-user.entity';
import axios from 'axios';
import { USER_GROUP } from '../__common__/constants';

@Injectable()
export class EmployeeService {

	private readonly logger = new Logger(EmployeeService.name);
	private authUser: AuthUser

	constructor(private readonly prisma: PrismaService) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateEmployeeInput): Promise<Employee> {

		const data: Prisma.EmployeeCreateInput = {
			employee_number: input.employee_number,
			rank_number: input.rank_number,
			name_prefix: input.name_prefix,
			name_suffix: input.name_suffix,
			firstname: input.firstname,
			middlename: input.middlename,
			lastname: input.lastname,
			position: input.position,
			department: { connect: { id: input.department_id } },
			division: input.division_id ? { connect: { id: input.division_id } } : undefined,
			signature_src: input.signature_src,
			created_by: this.authUser.user.username,
		}

		const created = await this.prisma.employee.create({
			data,
			include: {
				division: true,
				department: true,
			}
		})

		this.logger.log('Successfully created Employee')

		if(created.division) {
			created.division.permissions = !!created.division.permissions ? JSON.stringify(created.division.permissions) : null
		}

		return created

	}

	async findAll(
		page: number,
		pageSize: number,
		searchValue?: string
	): Promise<EmployeesResponse> {

		const skip = (page - 1) * pageSize;

		let whereCondition: any = {};

		if (!!searchValue) {
			whereCondition = {
				OR: [
					{ lastname: { contains: searchValue.trim(), mode: 'insensitive' } },
					{ firstname: { contains: searchValue.trim(), mode: 'insensitive' } },
					{ middlename: { contains: searchValue.trim(), mode: 'insensitive' } },
				],
			};
		}

		const items = await this.prisma.employee.findMany({
			include: {
				user_employee: true,
				division: true,
				department: true,
			},
			orderBy: [{ lastname: 'asc' }, { firstname: 'asc' }],
			skip,
			take: pageSize,
			where: whereCondition,
		});

		const totalItems = await this.prisma.employee.count({
			where: whereCondition,
		});

		const employees = items.map(i => {
			if (i.division) {
				i.division.permissions = i.division.permissions 
					? JSON.stringify(i.division.permissions) 
					: null;
			}
			i.department.permissions = i.department.permissions 
					? JSON.stringify(i.department.permissions) 
					: null;
			return i;
		});

		return {
			data: employees,
			totalItems,
			currentPage: page,
			totalPages: Math.ceil(totalItems / pageSize),
		};
	}

	async findOne(id: string): Promise<Employee | null> {

		this.logger.log('findOne', id)

		const item = await this.prisma.employee.findUnique({
			where: { id },
			include: {
				user_employee: {
					include: {
						user: true
					}
				},
				department: {
					include: {
						divisions: true
					}
				},
				division: true,
			}
		})

		console.log('item', item, id)

		if (!item) {
			throw new NotFoundException('Employee not found')
		}

		if(item.division) {
			item.division.permissions = !!item.division.permissions ? JSON.stringify(item.division.permissions) : null
		}

		item.department.permissions = !!item.department.permissions ? JSON.stringify(item.department.permissions) : null

		return item
	}

	async find_employees_by_user_group(user_group_id: USER_GROUP): Promise<Employee[]> {

		console.log('find_employees_by_user_group', user_group_id);

		const user_group_members = await this.prisma.userGroupMembers.findMany({
			where: {
				user_group_id
			},
			include: {
				user: {
					include: {
						user_employee: {
							include: {
								employee: true
							}
						}
					}
				}
			}
		})

		console.log('user_group_members', user_group_members);

		const employees = user_group_members
			.flatMap(member => member.user.user_employee)
			.map(userEmployee => userEmployee.employee)
			.filter(employee => employee !== null); // Filter to ensure only non-null employees are included

		return employees;

	}

	async update(id: string, input: UpdateEmployeeInput): Promise<Employee> {

		const existingItem = await this.findOne(id)

		const data: Prisma.EmployeeUpdateInput = {
			updated_by: this.authUser.user.username,
			employee_number: input.employee_number ?? existingItem.employee_number,
			rank_number: input.rank_number ?? existingItem.rank_number,
			name_prefix: input.name_prefix ?? existingItem.name_prefix,
			name_suffix: input.name_suffix ?? existingItem.name_suffix,
			firstname: input.firstname ?? existingItem.firstname,
			middlename: input.middlename ?? existingItem.middlename,
			lastname: input.lastname ?? existingItem.lastname,
			position: input.position ?? existingItem.position,
			department: input.department_id ? { connect: { id: input.department_id } } : { connect: { id: existingItem.department_id } },
			division: input.division_id
				? { connect: { id: input.division_id } }
				: existingItem.division_id
				? { disconnect: true }
				: undefined,
			signature_src: input.signature_src ?? existingItem.signature_src,
		}


		const updated = await this.prisma.employee.update({
			data,
			where: {
				id
			},
			include: {
				division: true,
				department: true,
			}
		})

		if(!!input.signature_src && !!existingItem.signature_src && existingItem.signature_src.trim() !== '') {
			this.deleteFiles([existingItem.signature_src])
			console.log('previous file deleted');
		}

		this.logger.log('Successfully updated Employee')

		
		if(updated.division) {
			updated.division.permissions = !!updated.division.permissions ? JSON.stringify(updated.division.permissions) : null
		}

		updated.department.permissions = !!updated.department.permissions ? JSON.stringify(updated.department.permissions) : null


		return updated

	}

	async remove(id: string): Promise<SystemRemoveResponse> {

		const existingItem = await this.findOne(id)

		await this.prisma.employee.delete({
			where: { id }
		})

		return {
			success: true,
			msg: "Employee successfully deleted"
		}

	}

	async validateEmployeeIds(ids: string[]): Promise<boolean> {
		// Remove duplicates from the ids array
		const uniqueIds = Array.from(new Set(ids));
	
		const existingIds = await this.prisma.employee.findMany({
			where: {
				id: { in: uniqueIds }
			},
			select: { id: true }
		});
	
		console.log('existingIds', existingIds);
		console.log('uniqueIds', uniqueIds);
	
		return existingIds.length === uniqueIds.length;
	}
	
	async findByIds(ids: string[]): Promise<Employee[]> {

		this.logger.log('findByIds', ids)

		return await this.prisma.employee.findMany({
			where: {
				id: { in: ids }
			}
		})

	}

	async findEmployeesByName(name: string): Promise<{
		id: string,
		firstname: string,
		middlename: string,
		lastname: string,
	}[]> {
		const trimmedName = name.trim(); 
	
		const employees = await this.prisma.employee.findMany({
			select: {
				id: true,
				firstname: true,
				middlename: true,
				lastname: true,
				rank_number: true,
			},
			where: {
				OR: [
					{ lastname: { startsWith: trimmedName, mode: 'insensitive' } },
					{ firstname: { startsWith: trimmedName, mode: 'insensitive' } },
				],
			},
			take: 10,
		});
	
		return employees;
	}

	async findAllBudgetOfficers(): Promise<Employee[]> {

		const user_group_members = await this.prisma.userGroupMembers.findMany({
			where: {
				user_group_id: USER_GROUP.BUDGET_OFFICER,
			},
			include: {
				user: {
					include: {
						user_employee: {
							include: {
								employee: true
							}
						}
					}
				}
			}
		})

		if(user_group_members.length === 0) {
			return []
		}

		const employees = user_group_members
			.flatMap(member => member.user.user_employee)
			.map(userEmployee => userEmployee.employee)
			.filter(employee => employee !== null); // Filter to ensure only non-null employees are included

		console.log('');

		return employees;

	}

	async findAllFinanceManagers(): Promise<Employee[]> {

		const user_group_members = await this.prisma.userGroupMembers.findMany({
			where: {
				user_group_id: USER_GROUP.FINANCE_MANAGER,
			},
			include: {
				user: {
					include: {
						user_employee: {
							include: {
								employee: true
							}
						}
					}
				}
			}
		})

		if(user_group_members.length === 0) {
			return []
		}

		const employees = user_group_members
			.flatMap(member => member.user.user_employee)
			.map(userEmployee => userEmployee.employee)
			.filter(employee => employee !== null); // Filter to ensure only non-null employees are included

		return employees;

	}

	async findAllAuditors(): Promise<Employee[]> {

		const user_group_members = await this.prisma.userGroupMembers.findMany({
			where: {
				user_group_id: USER_GROUP.AUDITOR,
			},
			include: {
				user: {
					include: {
						user_employee: {
							include: {
								employee: true
							}
						}
					}
				}
			}
		})

		if(user_group_members.length === 0) {
			return []
		}

		const employees = user_group_members
			.flatMap(member => member.user.user_employee)
			.map(userEmployee => userEmployee.employee)
			.filter(employee => employee !== null); 

		return employees;

	}

	async is_finance_manager(employee_id: string): Promise<boolean> {
		const isFinanceManager = await this.prisma.userGroupMembers.findFirst({
		  where: {
			user: {
				user_employee: {
					employee: {
					  id: employee_id,
					},
				}
			},
			user_group_id: USER_GROUP.FINANCE_MANAGER,
		  },
		  select: {
			user_id: true, 
		  },
		});
	  
		if (isFinanceManager) {
		  console.log('finance manager');
		  return true;
		}
	  
		console.log('not finance manager');
		return false;
	}

	async is_budget_officer(employee_id: string): Promise<boolean> {
		const isBudgetOfficer = await this.prisma.userGroupMembers.findFirst({
		  where: {
			user: {
				user_employee: {
					employee: {
					  id: employee_id,
					},
				}
			},
			user_group_id: USER_GROUP.BUDGET_OFFICER,
		  },
		  select: {
			user_id: true, 
		  },
		});
	  
		if (isBudgetOfficer) {
		  console.log('budget officer');
		  return true;
		}
	  
		console.log('not budget officer');
		return false;
	}

    private async deleteFiles(filePaths: string[]) {

        console.log('deleteFiles', filePaths)

        const url = process.env.API_URL + '/api/v1/file-upload/system/employee'

        console.log('url', url)

        return axios.delete(url, { data: filePaths });
    }

}
