import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Item, Prisma } from 'apps/warehouse/prisma/generated/client';
import { ITEM_TRANSACTION_TYPE } from '../__common__/types';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { ItemsResponse } from './entities/items-response.entity';
import { ItemTransaction } from './entities/item-transaction.entity';
import { ITEM_TYPE_CODE } from '../__common__/constants';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';

@Injectable()
export class ItemService {

	private authUser: AuthUser

	constructor(
		private readonly prisma: PrismaService
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	async create(input: CreateItemInput): Promise<Item> {
	  
		// Use a transaction to ensure atomicity
		const result = await this.prisma.$transaction(async (prisma) => {
	  
		  const item_transaction: Prisma.ItemTransactionCreateWithoutItemInput = {
			type: ITEM_TRANSACTION_TYPE.STOCK_IN,
			quantity: input.initial_quantity,
			price: input.initial_average_price,
			remarks: 'Initial item transaction',
			created_by: this.authUser.user.username,
			is_initial: true,
		  };
	  
		  const createdBy = this.authUser.user.username;
	  
		  // Fetch the item type code
		  const itemType = await prisma.itemType.findUnique({
			select: {
			  code: true,
			},
			where: { id: input.item_type_id },
		  });
	  
		  if (!itemType) {
			throw new NotFoundException('Item type code not found');
		  }
	  
		  // Generate the item code within the transaction
		  const itemCode = await this.generateItemCode(itemType.code as ITEM_TYPE_CODE, prisma);
	  
		  const data: Prisma.ItemCreateInput = {
			item_type: { connect: { id: input.item_type_id } },
			unit: {
			  connect: { id: input.unit_id },
			},
			code: itemCode,
			description: input.description,
			initial_quantity: input.initial_quantity,
			total_quantity: input.initial_quantity,
			alert_level: input.alert_level,
			created_by: createdBy,
			item_transactions: {
			  create: item_transaction,
			},
			project_item: input.project_id
			? {
				create: {
				project: { connect: { id: input.project_id } },
				},
			}
			: undefined,
		  };
	  
		  // Create the item
		  const createdItem = await prisma.item.create({
			data,
			include: {
				unit: true,
				project_item: true,
			},
		  });
	  
		  return createdItem;
		});
	  
		return result;
	}
	  
	async generateItemCode(itemTypeCode: ITEM_TYPE_CODE, prisma: Prisma.TransactionClient): Promise<string> {
		const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
	  
		// Check if there's already an entry for this item type and year
		let itemCodeTracker = await prisma.itemCodeTracker.findFirst({
		  where: {
			item_code: itemTypeCode,
			year: currentYear,
		  },
		});
	  
		let lastIncremental = 1;
	  
		// If no entry found for the current year, create one
		if (!itemCodeTracker) {
		  itemCodeTracker = await prisma.itemCodeTracker.create({
			data: {
			  item_code: itemTypeCode,
			  year: currentYear,
			  last_incremental: lastIncremental,
			},
		  });
		} else {
		  // Increment the last incremental value
		  lastIncremental = itemCodeTracker.last_incremental + 1;
	  
		  // Update the tracker with the new incremental value
		  await prisma.itemCodeTracker.update({
			where: { id: itemCodeTracker.id },
			data: { last_incremental: lastIncremental },
		  });
		}
	  
		// Pad the incremental number to ensure it's 5 digits long (e.g., 00001)
		const paddedIncremental = lastIncremental.toString().padStart(5, '0');
	  
		// Generate the final item code in the format XX-YY-XXXXX (e.g., OS-24-00001)
		const generatedCode = `${itemTypeCode}-${currentYear.toString().padStart(2, '0')}-${paddedIncremental}`;
	  
		return generatedCode;
	}

	async findAll(
		page: number, 
		pageSize: number, 
		description?: string, 
		item_codes?: ITEM_TYPE_CODE[],
		project_id?: string, 
	): Promise<ItemsResponse> {

		const skip = (page - 1) * pageSize;

		let whereCondition: any = { deleted_at: null };

		if (description) {
			whereCondition = {
				description: { contains: description.trim(), mode: 'insensitive' },
			};
		}

		if (item_codes && item_codes.length > 0) {
			whereCondition.item_type = {
				code: { in: item_codes }, 
			};
		}

		if (project_id) {
			whereCondition.project_item = {
			  project_id,
			};
		  }

		const items = await this.prisma.item.findMany({
			include: {
				unit: true,
				item_transactions: true,
				item_type: true,
				project_item: {
					include: {
						project: true,
					}
				},
			},
			where: whereCondition,
			orderBy: {
				code: 'asc'
			},
			skip,
			take: pageSize
		})

		const totalItems = await this.prisma.item.count({
			where: whereCondition
		})

		return {
			data: items,
			totalItems,
			currentPage: page,
			totalPages: Math.ceil(totalItems / pageSize),
		};

	}

	async findOne(id: string): Promise<Item | undefined> {

		const item = await this.prisma.item.findUnique({
			include: {
				item_transactions: {
					orderBy: {
						id: 'desc'
					},
					include: {
						rr_item: {
							include: {
								rr: true
							}
						},
						osriv_item: {
							include: {
								osriv: true
							}
						},
						seriv_item: {
							include: {
								seriv: true
							}
						},
						mrv_item: {
							include: {
								mrv: {
									include: {
										mct: true
									}
								}
							}
						},
						mcrt_item: {
							include: {
								mcrt: true
							}
						},
						mst_item: {
							include: {
								mst: true
							}
						},
					}
				},
				unit: true,
				item_type: true,
				project_item: {
					include: {
						project: true,
					}
				},
			},
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Item not found')
		}

		return item

	}

	async findByCode(code: string): Promise<Item> {

		const item = await this.prisma.item.findUnique({
			include: {
				item_transactions: {
					orderBy: {
						id: 'desc'
					},
					include: {
						rr_item: {
							include: {
								rr: true
							}
						}
					}
				},
				item_type: true,
				unit: true,
			},
			where: { code }
		})

		if (!item) {
			throw new NotFoundException('Item not found')
		}

		return item

	}

	async findItemsByCode(q: string) {
		const input = q.trim(); 
	
		const items = await this.prisma.item.findMany({
			select: {
				id: true,
				code: true,
				description: true,
			},
			where: {
				deleted_at: null,
				OR: [
					{ code: { startsWith: input } },
				],
			},
			take: 10,
		});
	
		return items;
	}

	async update(id: string, input: UpdateItemInput): Promise<Item> {

		return await this.prisma.$transaction(async(tx) => {

			const existingItem = await tx.item.findUnique({
				where: { id },
				include: {
					project_item: true,
				}
			})

			if(!existingItem) {
				throw new BadRequestException('Item not found with id of ' + id)
			}

			if(!input.project_id && existingItem.project_item) {
				await tx.projectItem.delete({
					where: {
						id: existingItem.project_item.id
					}
				})
			}

			if(input.project_id && !existingItem.project_item) {
				await tx.projectItem.create({
					data: {
						project_id: input.project_id,
						item_id: id
					}
				})
			}

			if(input.project_id && existingItem.project_item) {
				await tx.projectItem.update({
					where: { id: existingItem.project_item.id },
					data: {
						project_id: input.project_id
					}
				})
			}
			
			const updatedBy = this.authUser.user.username

			const data: Prisma.ItemUpdateInput = {
				item_type: input.item_type_id ? 
					{ connect: { id: input.item_type_id } } 
					: 
					{ connect: { id: existingItem.item_type_id } },
				unit: input.unit_id ?
					{ connect: { id: input.unit_id } }
					:
					{ connect: { id: existingItem.unit_id } },
				description: input.description ?? existingItem.description,
				alert_level: input.alert_level ?? existingItem.alert_level,
				updated_by: updatedBy,
			}
	
			const updated = await tx.item.update({
				data,
				include: {
					unit: true,
					project_item: true,
				},
				where: {
					id
				}
			})
	
			return updated

		})


	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {
		const existingItem = await this.findOne(id)

		await this.prisma.item.update({
			where: { id },
			data: { deleted_at: new Date() }
		})

		return {
			success: true,
			msg: "Item successfully deleted"
		}
	}

	getGWAPrice(itemTransactions: ItemTransaction[]): number {
		console.log('itemTransactions', itemTransactions);
	
		// Return 0 if no transactions exist
		if (!itemTransactions || itemTransactions.length === 0) {
			return 0;
		}
	
		// Filter STOCK_IN transactions
		const stockInTransactions = itemTransactions.filter(i => i.type === ITEM_TRANSACTION_TYPE.STOCK_IN);
	
		// Return 0 if no STOCK_IN transactions exist
		if (stockInTransactions.length === 0) {
			return 0;
		}
	
		// Calculate total prices with fallback for undefined/null prices
		const totalPrices = stockInTransactions.reduce((total, item) => {
			const price = typeof item.price === 'number' && item.price >= 0 ? item.price : 0;
			return total + price;
		}, 0);
	
		// Calculate GWA and ensure a valid number
		const gwa = totalPrices / stockInTransactions.length;
		return isNaN(gwa) || gwa < 0 ? 0 : gwa;
	}
	

	

}	
