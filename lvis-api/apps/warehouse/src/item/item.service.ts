import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Item, Prisma } from 'apps/warehouse/prisma/generated/client';
import { DB_TABLE, ITEM_TRANSACTION_TYPE } from '../__common__/types';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { ItemsResponse } from './entities/items-response.entity';
import { ITEM_TYPE_CODE } from '../__common__/constants';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { WarehouseAuditService } from '../warehouse_audit/warehouse_audit.service';
import { UpdateItemPriceResponse } from './entities/update-item-price-response.entity';
import { Item as ItemEntity } from './entities/item.entity';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

@Injectable()
export class ItemService {

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: WarehouseAuditService,
	) { }

	async create(
		input: CreateItemInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<Item> {
		
		// Use a transaction to ensure atomicity
		const result = await this.prisma.$transaction(async (prisma) => {
			
			const authUser = metadata.authUser

			const item_transaction: Prisma.ItemTransactionCreateWithoutItemInput = {
				type: ITEM_TRANSACTION_TYPE.STOCK_IN,
				quantity: input.initial_quantity,
				price: input.initial_average_price,
				remarks: 'Initial item transaction',
				created_by: authUser.user.username,
				is_initial: true,
			};
		
			const createdBy = authUser.user.username;
		
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
			const itemCode = await this.generateItemCode(itemType.code as ITEM_TYPE_CODE, prisma as unknown as Prisma.TransactionClient);

			const data: Prisma.ItemCreateInput = {
				item_type: { connect: { id: input.item_type_id } },
				unit: {
				connect: { id: input.unit_id },
				},
				code: itemCode,
				description: input.description,
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
		
			// create the item
			const createdItem = await prisma.item.create({
				data,
				include: {
					unit: true,
					project_item: true,
				},
			});

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.ITEM,
				action: 'CREATE-ITEM',
				reference_id: createdItem.id,
				metadata: createdItem,
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			}, prisma as unknown as Prisma.TransactionClient)
		
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
				// item_transactions: true,
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

	async get_all_outdated_price_items() {

		const now = new Date();
		const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

		return this.prisma.item.findMany({
			select: {
				id: true,
				// code: true,
				// description: true,
				// total_quantity: true,
				// latest_price_update: true,
				// price: true,
			},
			where: {
				OR: [
					{ latest_price_update: { lt: currentMonthStart } },
					{ latest_price_update: null }
				]
			},
			orderBy: {
				code: 'asc'
			},
		})

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
				item_price_logs: {
					orderBy: {
						created_at: 'desc'
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
				project_item: {
					include: {
						project: true,
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
				unit: true,
			},
			where: {
				deleted_at: null,
				OR: [
					{ code: { contains: input, mode: 'insensitive' } },
					{ description: { contains: input, mode: 'insensitive' } },
				],
			},
			take: 10,
		});
	
		return items;
	}

	async update(
		id: string, 
		input: UpdateItemInput, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<Item> {

		return await this.prisma.$transaction(async(tx) => {

			const authUser = metadata.authUser

			const existingItem = await tx.item.findUnique({
				where: { id },
				include: {
					unit: true,
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
				updated_by: authUser.user.username,
			}
			
			// update item
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

			 // create audit
			 await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.ITEM,
				action: 'UPDATE-ITEM',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updated
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as unknown as Prisma.TransactionClient)
			

			return updated

		})


	}

	async remove(
		id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	): Promise<WarehouseRemoveResponse> {

		const authUser = metadata.authUser

		const existingItem = await this.findOne(id)

		return await this.prisma.$transaction(async(tx) => {
	
			const updatedItem = await tx.item.update({
				where: { id },
				data: { deleted_at: new Date() }
			})

			// create audit
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.ITEM,
				action: 'SOFT-DELETE-ITEM',
				reference_id: id,
				metadata: {
					'old_value': existingItem,
					'new_value': updatedItem
				},
				ip_address: metadata.ip_address,
				device_info: metadata.device_info
			  }, tx as unknown as Prisma.TransactionClient)
	
			return {
				success: true,
				msg: "Item successfully deleted"
			}

		})

	}

	/*

		total_price = all item transactions price in the previous month including beginning price
		total_quantity = all item transactions quantity in the previous month including beginning quantity

		price = total_price / total_quantity

		Note: 
		- If no item_transactions and zero quantity on the prev month then price will be the beginning price of the previous month
		- To get the beginning price and qty of the previous month -> reference item price log table
		- If item price log in not defined. Compute from the beginning until the previous month
	*/
	async update_price_transaction(payload: { 
		item_id: string, 
		metadata: { ip_address: string, device_info: any, authUser: AuthUser } 
	}): Promise<UpdateItemPriceResponse> {

		console.log('update_price', payload);

		const { item_id, metadata } = payload;

		
		return this.prisma.$transaction(async (tx) => {
			
			const item = await tx.item.findUnique({
				where: { id: item_id },
				select: { 
					id: true,
					code: true,
					description: true,
					price: true, 
					latest_price_update: true,
					total_quantity: true,
				}
			});
			
			if (!item) {
				throw new Error(`Item not found with id: ${item_id}`);
			}

			const now = new Date();
			const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

			if (new Date(item.latest_price_update) >= currentMonthStart) {
				return {
					success: false,
					msg: 'Item price already updated',
					previous_item: item as ItemEntity,
					updated_item: item as ItemEntity,
				}
			}
		  
			// Get the exact time range for the previous month
			const firstDayOfPrevMonth = startOfMonth(subMonths(now, 1)); // e.g., March 1, 00:00:00
			const lastDayOfPrevMonth = endOfMonth(subMonths(now, 1));   // e.g., March 31, 23:59:59.999


			// get beginning price and beginning qty of the previous month from item price logs table
			const item_price_log = await tx.itemPriceLog.findFirst({
				where: {
					item_id,
					created_at: {
						gte: firstDayOfPrevMonth,
						lte: lastDayOfPrevMonth
					}
				},
				orderBy: {
					created_at: 'desc'
				}
			})

			// if no item price log then reference the latest rr transaction or initial_transaction
			if(!item_price_log) {

				let beginning_price = 0

				const latest_rr_transaction = await tx.itemTransaction.findFirst({
					select: {
						price: true,
					},
					where: {
						item_id,
						rr_item_id: { not: null }
					},
					orderBy: {
						created_at: 'desc'
					}
				})

				if(latest_rr_transaction) {

					beginning_price = latest_rr_transaction.price

				} else {

					const initial_transaction = await tx.itemTransaction.findFirst({
						select: {
							quantity: true,
							price: true,
						},
						where: {
							item_id,
							is_initial: true,
						},
						orderBy: {
							created_at: 'asc'
						}
					})
		
					if(initial_transaction) {
						beginning_price = initial_transaction.price
					}

				}

				const updated_item = await this.update_price({
					item_id,
					beginning_price,
					beginning_quantity: item.total_quantity,
					latest_price_update: now,
					existing_item: item as ItemEntity,
					metadata,
				}, tx as unknown as Prisma.TransactionClient)

				return {
					success: true,
					msg: 'Item price successfully updated',
					previous_item: item as ItemEntity,
					updated_item: updated_item,
				}

			}

			console.log('item_price_log', item_price_log);

			let total_quantity_prev_month = item_price_log.beginning_quantity
			let total_price_prev_month = item_price_log.beginning_price
			let new_price = item_price_log.beginning_price

			// Get item transactions on the previous month
			const prevMonthTransactions = await tx.itemTransaction.findMany({
				where: {
					item_id,
					created_at: {
						gte: firstDayOfPrevMonth,
						lte: lastDayOfPrevMonth
					}
				},
				orderBy: {
				  	created_at: 'desc'
				}
			});

			if (prevMonthTransactions.length > 0) {

				for(let transaction of prevMonthTransactions) {
					
					if(transaction.type === ITEM_TRANSACTION_TYPE.STOCK_IN) {
						
						console.log(`stock in: ${transaction.price} * ${ transaction.quantity }}`);

						total_quantity_prev_month += transaction.quantity
						total_price_prev_month += transaction.price * transaction.quantity
					} else {

						console.log(`stock out: ${transaction.price} * ${ transaction.quantity }}`);

						total_quantity_prev_month -= transaction.quantity
						total_price_prev_month -= transaction.price * transaction.quantity
					}

				}

				if(total_quantity_prev_month > 0) {
					new_price = total_price_prev_month / total_quantity_prev_month
				}
				
			} 

			const updated_item = await this.update_price({
				item_id,
				beginning_price: new_price,
				beginning_quantity: item.total_quantity,
				latest_price_update: now,
				existing_item: item as ItemEntity,
				metadata,
			}, tx as unknown as Prisma.TransactionClient)

			return {
				success: true,
				msg: 'Item price successfully updated',
				previous_item: item as ItemEntity,
				updated_item: updated_item,
			}

		})

	}


	async update_price(payload: { 
		item_id: string,
		beginning_price: number, 
		beginning_quantity: number,
		latest_price_update: Date,
		existing_item: ItemEntity,
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }  
	}, tx: Prisma.TransactionClient): Promise<ItemEntity> {

		const { item_id, beginning_price, beginning_quantity, latest_price_update, existing_item, metadata } = payload
		const { authUser } = metadata

		// record item_price_logs
		await tx.itemPriceLog.create({
			data: {
				item_id,
				beginning_price,
				beginning_quantity,
				created_by: authUser.user.username
			}
		})
		
		const updated_item = await tx.item.update({
			where: { id: item_id },
			data: {
				price: beginning_price,
				latest_price_update,
				updated_by: authUser.user.username
			},
			select: {
				id: true,
				code: true,
				description: true,
				price: true, 
				latest_price_update: true,
				total_quantity: true,
			}
		});

		// create audit
		await this.audit.createAuditEntry({
			username: authUser.user.username,
			table: DB_TABLE.ITEM,
			action: 'UPDATE-ITEM-PRICE',
			reference_id: item_id,
			metadata: {
				'old_value': existing_item,
				'new_value': updated_item
			},
			ip_address: metadata.ip_address,
			device_info: metadata.device_info
		}, tx as unknown as Prisma.TransactionClient)

		return updated_item as ItemEntity

	}

	// getGWAPrice(itemTransactions: ItemTransaction[]): number {
	
	// 	// Return 0 if no transactions exist
	// 	if (!itemTransactions || itemTransactions.length === 0) {
	// 		return 0;
	// 	}
	
	// 	// Filter STOCK_IN transactions
	// 	const stockInTransactions = itemTransactions.filter(i => i.type === ITEM_TRANSACTION_TYPE.STOCK_IN);
	
	// 	// Return 0 if no STOCK_IN transactions exist
	// 	if (stockInTransactions.length === 0) {
	// 		return 0;
	// 	}
	
	// 	// Calculate total prices with fallback for undefined/null prices
	// 	const totalPrices = stockInTransactions.reduce((total, item) => {
	// 		const price = typeof item.price === 'number' && item.price >= 0 ? item.price : 0;
	// 		return total + price;
	// 	}, 0);
	
	// 	// Calculate GWA and ensure a valid number
	// 	const gwa = totalPrices / stockInTransactions.length;
	// 	return isNaN(gwa) || gwa < 0 ? 0 : gwa;
	// }
	
	/*
		- Get the GWA price of the item in the previous month in RR transactions
		- If no RR transactions in the previous month then get the latest RR transaction price
		- If no rr transaction then get the price of the initial transaction
		- Update price and latest_price_update field
	*/
	// async get_gwa_price_prev_month(payload: { item_id: string }): Promise<number> {

	// 	console.log('get_gwa_price_prev_month', payload);

	// 	const { item_id } = payload;
	// 	const now = new Date();
		
	// 	return this.prisma.$transaction(async (tx) => {

	// 		// First check if the item has a recent price update
	// 		const item = await tx.item.findUnique({
	// 			where: { id: item_id },
	// 			select: { 
	// 				price: true, 
	// 				latest_price_update: true,
	// 			}
	// 		});
		  
	// 		if (!item) {
	// 		  	throw new Error(`Item not found with id: ${item_id}`);
	// 		}
		  
	// 		// Proceed with price determination logic
	// 		const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	// 		const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
			
	// 		let determinedPrice: number;
		  
	// 		// Get RR transactions on the previous month
	// 		const prevMonthTransactions = await tx.itemTransaction.findMany({
	// 			where: {
	// 				item_id,
	// 				rr_item_id: { not: null }, 
	// 				created_at: {
	// 					gte: firstDayOfPrevMonth,
	// 					lte: lastDayOfPrevMonth
	// 				}
	// 			},
	// 			orderBy: {
	// 			  	created_at: 'asc'
	// 			}
	// 		});

	// 		if (prevMonthTransactions.length > 0) {
	// 			// Calculate GWA price
	// 			let totalValue = 0;
	// 			let totalQuantity = 0;
				
	// 			for (const tx of prevMonthTransactions) {
	// 				totalValue += tx.quantity * tx.price;
	// 				totalQuantity += tx.quantity;
	// 			}
				
	// 			determinedPrice = totalValue / totalQuantity;
	// 		} else {
	// 			// If no transactions in previous month, get the latest rr transaction
	// 			const latestTransaction = await tx.itemTransaction.findFirst({
	// 				where: {
	// 					item_id,
	// 					rr_item_id: { not: null }, 
	// 				},
	// 				orderBy: {
	// 					created_at: 'desc'
	// 				}
	// 			});

	// 			// if no rr transaction then get the price of the initial transaction
	// 			if(!latestTransaction) {
	// 				const initial_transaction = await tx.itemTransaction.findFirst({
	// 					select: {
	// 						price: true,
	// 					},
	// 					where: {
	// 						is_initial: true
	// 					}
	// 				})

	// 				if(initial_transaction) {
	// 					determinedPrice = initial_transaction.price
	// 				} else {
	// 					determinedPrice = 0
	// 				}
	// 			} else {
	// 				determinedPrice = latestTransaction.price
	// 			}
				
	// 		}
		  
	// 		// Update the item's price and latest_price_update if different from current price
	// 		if (determinedPrice !== item.price) {
	// 			await tx.item.update({
	// 				where: { id: item_id },
	// 				data: {
	// 					price: determinedPrice,
	// 					latest_price_update: now,
	// 					updated_by: 'System'
	// 				}
	// 			});
	// 		} else if (item.latest_price_update === null) {
	// 			// Ensure latest_price_update is set even if price didn't change
	// 			await tx.item.update({
	// 				where: { id: item_id },
	// 				data: {
	// 					latest_price_update: now,
	// 					updated_by: 'System'
	// 				}
	// 			});
	// 		}
		  
	// 		return determinedPrice;

	// 	})

	// }
	

}	
