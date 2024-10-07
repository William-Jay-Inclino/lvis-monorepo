import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { Item, MCRTApprover, MCTApprover, MRVItem, OSRIVApprover, OSRIVItem, Prisma, RRApprover, SERIVApprover, SERIVItem } from 'apps/warehouse/prisma/generated/client';
import { APPROVAL_STATUS, ITEM_TRANSACTION_TYPE } from '../__common__/types';
import { WarehouseRemoveResponse } from '../__common__/classes';
import { ItemsResponse } from './entities/items-response.entity';
import { AuthUser } from '../__common__/auth-user.entity';
import { ItemTransaction } from './entities/item-transaction.entity';
import { RrApproverStatusUpdated } from '../rr-approver/events/rr-approver-status-updated.event';
import { OnEvent } from '@nestjs/event-emitter';
import { RrItem } from '../rr-item/entities/rr-item.entity';
import { OsrivApproverStatusUpdated } from '../osriv-approver/events/osriv-approver-status-updated.event';
import { SerivApproverStatusUpdated } from '../seriv-approver/events/seriv-approver-status-updated.event';
import { MctApproverStatusUpdated } from '../mct-approver/events/mct-approver-status-updated.event';
import { McrtApproverStatusUpdated } from '../mcrt-approver/events/mcrt-approver-status-updated.event';
import { ITEM_TYPE_CODE } from '../__common__/constants';

@Injectable()
export class ItemService {

	private readonly logger = new Logger(ItemService.name);
	private authUser: AuthUser
	private includedFields = {
		unit: true
	}

	constructor(
		private readonly prisma: PrismaService
	) { }

	setAuthUser(authUser: AuthUser) {
		this.authUser = authUser
	}

	// async create(input: CreateItemInput): Promise<Item> {

	// 	this.logger.log('create()', input)

	// 	// Check if the code already exists
	// 	const existingItem = await this.prisma.item.findUnique({
	// 		where: {
	// 			code: input.code,
	// 		},
	// 	})

	// 	if (existingItem) {
	// 		throw new ConflictException('Item code must be unique. A different item with the same code already exists.');
	// 	}

	// 	const item_transaction: Prisma.ItemTransactionCreateWithoutItemInput = {
	// 		type: ITEM_TRANSACTION_TYPE.STOCK_IN,
	// 		quantity: input.initial_quantity,
	// 		price: input.initial_average_price,
	// 		remarks: 'Initial item transaction',
	// 		created_at: new Date(),
	// 		created_by: this.authUser.user.username
	// 	}

	// 	const createdBy = this.authUser.user.username
	// 	const itemType = await this.prisma.itemType.findUnique({
	// 		select: {
	// 			code: true
	// 		},
	// 		where: { id: input.item_type_id }
	// 	})

	// 	if(!itemType) {
	// 		throw new NotFoundException('Item type code not found')
	// 	}

	// 	const itemCode = await this.generateItemCode(itemType.code as ITEM_TYPE_CODE)

	// 	const data: Prisma.ItemCreateInput = {
	// 		item_type: {connect: { id: input.item_type_id  }},
	// 		unit: {
	// 			connect: { id: input.unit_id }
	// 		},
	// 		code: itemCode,
	// 		description: input.description,
	// 		initial_quantity: input.initial_quantity,
	// 		total_quantity: input.initial_quantity,
	// 		alert_level: input.alert_level,
	// 		created_by: createdBy,
	// 		item_transactions: {
	// 			create: item_transaction
	// 		}
	// 	}

	// 	const created = await this.prisma.item.create({
	// 		data,
	// 		include: this.includedFields
	// 	})

	// 	this.logger.log('Successfully created Item')

	// 	return created

	// }

	async create(input: CreateItemInput): Promise<Item> {
		this.logger.log('create()', input);
	  
		// Use a transaction to ensure atomicity
		const result = await this.prisma.$transaction(async (prisma) => {
	  
		  const item_transaction: Prisma.ItemTransactionCreateWithoutItemInput = {
			type: ITEM_TRANSACTION_TYPE.STOCK_IN,
			quantity: input.initial_quantity,
			price: input.initial_average_price,
			remarks: 'Initial item transaction',
			created_at: new Date(),
			created_by: this.authUser.user.username,
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
		  };
	  
		  // Create the item
		  const createdItem = await prisma.item.create({
			data,
			include: this.includedFields,
		  });
	  
		  return createdItem;
		});
	  
		this.logger.log('Successfully created Item');
		return result;
	  }
	  
	private async generateItemCode(itemTypeCode: ITEM_TYPE_CODE, prisma: Prisma.TransactionClient): Promise<string> {
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

	async findAll(page: number, pageSize: number, name?: string, item_codes?: ITEM_TYPE_CODE[]): Promise<ItemsResponse> {

		const skip = (page - 1) * pageSize;

		let whereCondition: any = {
			deleted_at: null
		};

		if (name) {
			whereCondition = {
				name: { contains: name.trim(), mode: 'insensitive' },
			};
		}

		if (item_codes && item_codes.length > 0) {
			whereCondition.item_type = {
				code: { in: item_codes }, 
			};
		}

		const items = await this.prisma.item.findMany({
			include: {
				unit: true,
				item_transactions: true,
				item_type: true,
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

		this.logger.log('fineOne()', id)

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
								mrv: true
							}
						},
						mcrt_item: {
							include: {
								mcrt: true
							}
						},
					}
				},
				unit: true,
				item_type: true,
			},
			where: { id }
		})

		if (!item) {
			throw new NotFoundException('Item not found')
		}

		return item

	}

	async findByCode(code: string): Promise<Item> {

		this.logger.log('fineOne()', code)

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

		const existingItem = await this.findOne(id)

		// Check if the code is being updated and if it already exists for another item
		if (input.code && input.code !== existingItem.code) {
			const existingCodeItem = await this.prisma.item.findUnique({
				where: {
					code: input.code,
				},
			})

			if (existingCodeItem) {
				throw new ConflictException('Item code must be unique. A different item with the same code already exists.');
			}
		}

		const updatedBy = this.authUser.user.username

		const data: Prisma.ItemUpdateInput = {
			item_type: input.item_type_id ? { connect: { id: input.item_type_id } } : { connect: { id: existingItem.item_type_id } },
			unit: input.unit_id ?
				{ connect: { id: input.unit_id } }
				:
				{ connect: { id: existingItem.unit_id } },
			code: input.code ?? existingItem.code,
			description: input.description ?? existingItem.description,
			alert_level: input.alert_level ?? existingItem.alert_level,
			updated_by: updatedBy
		}

		const updated = await this.prisma.item.update({
			data,
			include: this.includedFields,
			where: {
				id
			}
		})

		this.logger.log('Successfully updated item')

		return updated

	}

	async remove(id: string): Promise<WarehouseRemoveResponse> {
		const existingItem = await this.findOne(id)

		await this.prisma.item.update({
			where: { id },
			data: {
				deleted_at: new Date(),
				deleted_by: this.authUser.user.username
			}
		})

		return {
			success: true,
			msg: "Item successfully deleted"
		}
	}

	getGWAPrice(itemTransactions: ItemTransaction[]): number {

		const stockInTransactions = itemTransactions.filter(i => i.type === ITEM_TRANSACTION_TYPE.STOCK_IN)
		const totalPrices = stockInTransactions.reduce((total, item) => total + item.price, 0);
		const gwa = totalPrices / stockInTransactions.length;

		return gwa

	}

	// private async generateItemCode(itemTypeCode: ITEM_TYPE_CODE): Promise<string> {
	// 	// Get the last two digits of the current year as an integer (e.g., 24 for 2024)
	// 	const currentYear = new Date().getFullYear() % 100; 
	
	// 	// Check if there's already an entry for this item type and year
	// 	let itemCodeTracker = await this.prisma.itemCodeTracker.findFirst({
	// 	  where: {
	// 		item_code: itemTypeCode,
	// 		year: currentYear,
	// 	  },
	// 	});
	
	// 	let lastIncremental = 1;
	
	// 	// If no entry found for the current year, create one
	// 	if (!itemCodeTracker) {
	// 	  itemCodeTracker = await this.prisma.itemCodeTracker.create({
	// 		data: {
	// 		  item_code: itemTypeCode,
	// 		  year: currentYear,
	// 		  last_incremental: lastIncremental,
	// 		},
	// 	  });
	// 	} else {
	// 	  // Increment the last incremental value
	// 	  lastIncremental = itemCodeTracker.last_incremental + 1;
		  
	// 	  // Update the tracker with the new incremental value
	// 	  await this.prisma.itemCodeTracker.update({
	// 		where: { id: itemCodeTracker.id },
	// 		data: { last_incremental: lastIncremental },
	// 	  });
	// 	}
	
	// 	// Pad the incremental number to ensure it's 5 digits long (e.g., 00001)
	// 	const paddedIncremental = lastIncremental.toString().padStart(5, '0');
	
	// 	// Generate the final item code in the format XX-YY-XXXXX (e.g., OS-24-00001)
	// 	const generatedCode = `${itemTypeCode}-${currentYear.toString().padStart(2, '0')}-${paddedIncremental}`;
	
	// 	return generatedCode;
	// }

	// ================== RR EVENTS ================== 

	@OnEvent('rr-approver-status.updated')
	async handleRrApproverStatusUpdated(payload: RrApproverStatusUpdated) {

		this.logger.log('=== item-transaction.service.ts ===')

		console.log('handleRrApproverStatusUpdated()', payload)

		const rrApprover = await this.prisma.rRApprover.findUnique({
			where: { id: payload.id },
			include: {
				rr: {
					include: {
						rr_items: {
							include: {
								meqs_supplier_item: {
									include: {
										canvass_item: {
											include: {
												item: true
											}
										}
									}
								}
							}
						},
						rr_approvers: true
					}
				}
			}
		})

		if (!rrApprover) {
			throw new NotFoundException('rrApprover not found with id: ' + payload.id)
		}

		if (rrApprover.rr.is_completed) {
			console.log('RR is already completed. End function')
			return
		}

		const approvers = rrApprover.rr.rr_approvers

		console.log('approvers', approvers)

		const isApproved = this.isStatusApproved(approvers)

		if (!isApproved) {
			console.log('RR status is not approved. End function')
			return
		}

		console.log('Transacting RR items...')

		// add rr items to item_transaction table and update total quantity of item in the item table
		// @ts-ignore
		const response = await this.transactRrItems(rrApprover.rr_id, rrApprover.rr.rr_items)

		console.log('response', response)

	}

	private async transactRrItems(rrId: string, rrItems: RrItem[]): Promise<{ success: boolean }> {

		console.log('transactRrItems', rrItems)

		const queries = []

		// prepare query for item transaction
		const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []


		for (let rrItem of rrItems) {

			if (!rrItem.meqs_supplier_item.canvass_item.item) {
				continue
			}

			const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: rrItem.meqs_supplier_item.canvass_item.item.id,
				rr_item_id: rrItem.id,
				type: ITEM_TRANSACTION_TYPE.STOCK_IN,
				quantity: rrItem.quantity_accepted,
				price: rrItem.meqs_supplier_item.price,
				remarks: 'From RR'
			}

			itemTransactions.push(data)

		}

		const createItemTransactionsQuery = this.prisma.itemTransaction.createMany({
			data: itemTransactions
		})

		queries.push(createItemTransactionsQuery)

		// prepare queries for updating item quantity based on item_transactions
		for (let transaction of itemTransactions) {

			const item = await this.prisma.item.findUnique({ where: { id: transaction.item_id } });
			if (!item) {
				throw new NotFoundException(`Item not found with item_id: ${transaction.item_id}`);
			}

			// const totalQuantity = item.total_quantity + transaction.quantity;

			const updateItemQtyQuery = this.prisma.item.update({
				where: { id: item.id },
				data: {
					total_quantity: {
						increment: transaction.quantity
					}
				},
			});

			queries.push(updateItemQtyQuery)

		}


		// set is_completed field in rr table to true 
		const updateRRQuery = this.prisma.rR.update({
			where: {
				id: rrId
			},
			data: {
				is_completed: true
			}
		})
		queries.push(updateRRQuery)

		console.log('queries', queries)


		// EXECUTE QUERIES
		await this.prisma.$transaction(queries)

		return {
			success: true
		}

	}



	// ================== OSRIV EVENTS ================== 

	@OnEvent('osriv-approver-status.updated')
	async handleOsrivApproverStatusUpdated(payload: OsrivApproverStatusUpdated) {

		this.logger.log('=== item-transaction.service.ts ===')

		console.log('handleOsrivApproverStatusUpdated()', payload)

		const osrivApprover = await this.prisma.oSRIVApprover.findUnique({
			where: { id: payload.id },
			include: {
				osriv: {
					include: {
						osriv_items: {
							include: {
								item: true
							}
						},
						osriv_approvers: true
					}
				}
			}
		})

		if (!osrivApprover) {
			throw new NotFoundException('osrivApprover not found with id: ' + payload.id)
		}

		if (osrivApprover.osriv.is_completed) {
			console.log('OSRIV is already completed. End function')
			return
		}

		const approvers = osrivApprover.osriv.osriv_approvers

		console.log('approvers', approvers)

		const isApproved = this.isStatusApproved(approvers)

		if (!isApproved) {
			console.log('OSRIV status is not approved. End function')
			return
		}

		console.log('Transacting OSRIV items...')

		// add osriv items to item_transaction table and update total_quantity and quantity_on_queue of item in the item table
		// @ts-ignore
		const response = await this.transactOsrivItems(osrivApprover.osriv_id, osrivApprover.osriv.osriv_items)

		console.log('response', response)

	}

	// add osriv items to item_transaction
	// update total_quantity and quantity_on_queue of item

	private async transactOsrivItems(osrivId: string, osrivItems: OSRIVItem[]): Promise<{ success: boolean }> {

		const queries: Prisma.PrismaPromise<any>[] = []
		const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []

		for(let osrivItem of osrivItems) {
			
			const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: osrivItem.item_id,
				osriv_item_id: osrivItem.id,
				type: ITEM_TRANSACTION_TYPE.STOCK_OUT,
				quantity: osrivItem.quantity,
				price: osrivItem.price,
				remarks: 'OSRIV Request'
			}

			itemTransactions.push(data)

		}

		const createItemTransactionsQuery = this.prisma.itemTransaction.createMany({
			data: itemTransactions
		})

		queries.push(createItemTransactionsQuery)

		// set is_completed field in osriv table to true 
		const updateOSRIVQuery = this.prisma.oSRIV.update({
			where: {
				id: osrivId
			},
			data: {
				is_completed: true
			}
		})
		queries.push(updateOSRIVQuery)

		// update item total_quantity and quantity_on_queue on each item
        const updateItemQueries = this.generateUpdateItemQueries(osrivItems, ITEM_TRANSACTION_TYPE.STOCK_OUT); 

		const allQueries = [...queries, ...updateItemQueries]; // combine the Prisma promises

		// EXECUTE QUERIES
		await this.prisma.$transaction(allQueries)

		return {
			success: true
		}

	}



	// ================== SERIV EVENTS ================== 

	@OnEvent('seriv-approver-status.updated')
	async handleSerivApproverStatusUpdated(payload: SerivApproverStatusUpdated) {

		this.logger.log('=== item-transaction.service.ts ===')

		console.log('handleSerivApproverStatusUpdated()', payload)

		const serivApprover = await this.prisma.sERIVApprover.findUnique({
			where: { id: payload.id },
			include: {
				seriv: {
					include: {
						seriv_items: {
							include: {
								item: true
							}
						},
						seriv_approvers: true
					}
				}
			}
		})

		if (!serivApprover) {
			throw new NotFoundException('serivApprover not found with id: ' + payload.id)
		}

		if (serivApprover.seriv.is_completed) {
			console.log('SERIV is already completed. End function')
			return
		}

		const approvers = serivApprover.seriv.seriv_approvers

		console.log('approvers', approvers)

		const isApproved = this.isStatusApproved(approvers)

		if (!isApproved) {
			console.log('SERIV status is not approved. End function')
			return
		}

		console.log('Transacting SERIV items...')

		// add seriv items to item_transaction table and update total_quantity and quantity_on_queue of item in the item table
		// @ts-ignore
		const response = await this.transactSerivItems(serivApprover.seriv_id, serivApprover.seriv.seriv_items)

		console.log('response', response)

	}

	// add seriv items to item_transaction
	// update total_quantity and quantity_on_queue of item

	private async transactSerivItems(serivId: string, serivItems: SERIVItem[]): Promise<{ success: boolean }> {

		const queries: Prisma.PrismaPromise<any>[] = []
		const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []

		for(let serivItem of serivItems) {
			
			const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: serivItem.item_id,
				seriv_item_id: serivItem.id,
				type: ITEM_TRANSACTION_TYPE.STOCK_OUT,
				quantity: serivItem.quantity,
				price: serivItem.price,
				remarks: 'SERIV Request'
			}

			itemTransactions.push(data)

		}

		const createItemTransactionsQuery = this.prisma.itemTransaction.createMany({
			data: itemTransactions
		})

		queries.push(createItemTransactionsQuery)

		// set is_completed field in osriv table to true 
		const updateSERIVQuery = this.prisma.sERIV.update({
			where: {
				id: serivId
			},
			data: {
				is_completed: true
			}
		})
		queries.push(updateSERIVQuery)

		// update item total_quantity and quantity_on_queue on each item
		const updateItemQueries = this.generateUpdateItemQueries(serivItems, ITEM_TRANSACTION_TYPE.STOCK_OUT); 

		const allQueries = [...queries, ...updateItemQueries]; // combine the Prisma promises

		// EXECUTE QUERIES
		await this.prisma.$transaction(allQueries)

		return {
			success: true
		}

	}



	// ================== MCT EVENTS ================== 

	@OnEvent('mct-approver-status.updated')
	async handleMctApproverStatusUpdated(payload: MctApproverStatusUpdated) {

		this.logger.log('=== item-transaction.service.ts ===')

		console.log('handleMctApproverStatusUpdated()', payload)

		const mctApprover = await this.prisma.mCTApprover.findUnique({
			where: { id: payload.id },
			include: {
				mct: {
					include: {
						mrv: {
							include: {
								mrv_items: {
									include: {
										item: true
									}
								},
							}
						},
						mct_approvers: true
					}
				}
			}
		})

		if (!mctApprover) {
			throw new NotFoundException('mctApprover not found with id: ' + payload.id)
		}

		if (mctApprover.mct.is_completed) {
			console.log('MCRT is already completed. End function')
			return
		}

		const approvers = mctApprover.mct.mct_approvers

		console.log('approvers', approvers)

		const isApproved = this.isStatusApproved(approvers)

		if (!isApproved) {
			console.log('MCT status is not approved. End function')
			return
		}

		console.log('Transacting MCT items...')

		// add seriv items to item_transaction table and update total_quantity and quantity_on_queue of item in the item table
		// @ts-ignore
		const response = await this.transactMrvItems(mctApprover.mct_id, mctApprover.mct.mrv.mrv_items, mctApprover.mct.mrv.id)

		console.log('response', response)

	}

	// add mct items to item_transaction
	// update total_quantity and quantity_on_queue of item

	private async transactMrvItems(mctId: string, mrvItems: MRVItem[], mrvId: string): Promise<{ success: boolean }> {

		const queries: Prisma.PrismaPromise<any>[] = []
		const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []

		for(let mrvItem of mrvItems) {
			
			const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: mrvItem.item_id,
				mrv_item_id: mrvItem.id,
				type: ITEM_TRANSACTION_TYPE.STOCK_OUT,
				quantity: mrvItem.quantity,
				price: mrvItem.price,
				remarks: 'MCT Request'
			}

			itemTransactions.push(data)

		}

		const createItemTransactionsQuery = this.prisma.itemTransaction.createMany({
			data: itemTransactions
		})

		queries.push(createItemTransactionsQuery)

		// set is_completed field in mct table to true 
		const updateMCTQuery = this.prisma.mCT.update({
			where: {
				id: mctId
			},
			data: {
				is_completed: true
			}
		})
		queries.push(updateMCTQuery)

		// set is_completed field in mrv table to true 
		const updateMRVQuery = this.prisma.mRV.update({
			where: {
				id: mrvId
			},
			data: {
				is_completed: true
			}
		})

		queries.push(updateMRVQuery)

		// update item total_quantity and quantity_on_queue on each item
		const updateItemQueries = this.generateUpdateItemQueries(mrvItems, ITEM_TRANSACTION_TYPE.STOCK_OUT); 

		const allQueries = [...queries, ...updateItemQueries]; // combine the Prisma promises

		// EXECUTE QUERIES
		await this.prisma.$transaction(allQueries)

		return {
			success: true
		}

	}



	// ================== MRV EVENTS ================== 

	@OnEvent('mrv-approver-status.updated')

	async handleMrvApproverStatusUpdated(payload: McrtApproverStatusUpdated) {
		this.logger.log('=== item-transaction.service.ts ===')

		console.log('handleMrvApproverStatusUpdated()', payload)

		const mrvApprover = await this.prisma.mRVApprover.findUnique({
			where: { id: payload.id },
			include: {
				mrv: true
			}
		})

		if(!mrvApprover) {
			throw new NotFoundException('mrvApprover not found with id: ' + payload.id)
		}

		const result = await this.prisma.mRV.update({
			where: { id: mrvApprover.mrv.id },
			data: {
				is_completed: true
			}
		})

		console.log('mrv is_completed set to true', result);

	}


	// ================== MCRT EVENTS ================== 

	@OnEvent('mcrt-approver-status.updated')
	async handleMcrtApproverStatusUpdated(payload: McrtApproverStatusUpdated) {

		this.logger.log('=== item-transaction.service.ts ===')

		console.log('handleMcrtApproverStatusUpdated()', payload)

		const mcrtApprover = await this.prisma.mCRTApprover.findUnique({
			where: { id: payload.id },
			include: {
				mcrt: {
					include: {
						mcrt_items: {
							include: {
								item: true
							}
						},
						mcrt_approvers: true
					}
				}
			}
		})

		if (!mcrtApprover) {
			throw new NotFoundException('mcrtApprover not found with id: ' + payload.id)
		}

		if (mcrtApprover.mcrt.is_completed) {
			console.log('MCRT is already completed. End function')
			return
		}

		const approvers = mcrtApprover.mcrt.mcrt_approvers

		console.log('approvers', approvers)

		const isApproved = this.isStatusApproved(approvers)

		if (!isApproved) {
			console.log('MCRT status is not approved. End function')
			return
		}

		console.log('Transacting MCRT items...')

		// add mcrt items to item_transaction table and update total_quantity and quantity_on_queue of item in the item table
		// @ts-ignore
		const response = await this.transactMcrtItems(mcrtApprover.mcrt_id, mcrtApprover.mcrt.mcrt_items)

		console.log('response', response)

	}

	// add mct items to item_transaction
	// update total_quantity and quantity_on_queue of item

	private async transactMcrtItems(mcrtId: string, mcrtItems: MRVItem[]): Promise<{ success: boolean }> {

		const queries: Prisma.PrismaPromise<any>[] = []
		const itemTransactions: Prisma.ItemTransactionCreateManyInput[] = []

		for(let mcrtItem of mcrtItems) {
			
			const data: Prisma.ItemTransactionCreateManyInput = {
				item_id: mcrtItem.item_id,
				mcrt_item_id: mcrtItem.id,
				type: ITEM_TRANSACTION_TYPE.STOCK_IN,
				quantity: mcrtItem.quantity,
				price: mcrtItem.price,
				remarks: 'MCRT Request'
			}

			itemTransactions.push(data)

		}

		const createItemTransactionsQuery = this.prisma.itemTransaction.createMany({
			data: itemTransactions
		})

		queries.push(createItemTransactionsQuery)

		// set is_completed field in mct table to true 
		const updateMCTQuery = this.prisma.mCRT.update({
			where: {
				id: mcrtId
			},
			data: {
				is_completed: true
			}
		})
		queries.push(updateMCTQuery)

		// update item total_quantity and quantity_on_queue on each item
		const updateItemQueries = this.generateUpdateItemQueries(mcrtItems, ITEM_TRANSACTION_TYPE.STOCK_IN); 

		const allQueries = [...queries, ...updateItemQueries]; // combine the Prisma promises

		// EXECUTE QUERIES
		await this.prisma.$transaction(allQueries)

		return {
			success: true
		}

	}




	// ================== REUSABLE FUNCTIONS ================== 

	private isStatusApproved(approvers: OSRIVApprover[] | SERIVApprover[] | RRApprover[] | MCTApprover[] | MCRTApprover[]): boolean {

		for (let approver of approvers) {

			if (approver.status !== APPROVAL_STATUS.APPROVED) {
				return false
			}

		}

		return true

	}

	private generateUpdateItemQueries(items: OSRIVItem[] | SERIVItem[] | MRVItem[], transaction: ITEM_TRANSACTION_TYPE) {

		// decrement total_quantity 
		// decerement quantity_on_queue
		if(transaction === ITEM_TRANSACTION_TYPE.STOCK_OUT) {
			return items.map(item => {
				return this.prisma.item.update({
					where: { id: item.item_id },
					data: {
						quantity_on_queue: {
							decrement: item.quantity
						},
						total_quantity: {
							decrement: item.quantity
						}
					}
				});
			});
		}

		// increment total_quantity
		if(transaction === ITEM_TRANSACTION_TYPE.STOCK_IN) {
			return items.map(item => {
				return this.prisma.item.update({
					where: { id: item.item_id },
					data: {
						total_quantity: {
							increment: item.quantity
						}
					}
				});
			});
		}

	}

}	
