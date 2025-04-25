import { Injectable } from '@nestjs/common';
import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { UpdateLinemanScheduleInput } from './dto/update-lineman_schedule.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { PowerserveAuditService } from '../powerserve_audit/powerserve_audit.service';
import { DB_TABLE } from '../__common__/types';
import { Prisma } from '@prisma/client';
import { MutationLinemanScheduleResponse } from './entities/mutation-lineman-schedule-response';

@Injectable()
export class LinemanScheduleService {

	constructor(
		private readonly prisma: PrismaService,
		private readonly audit: PowerserveAuditService,
	) { }

	async update(payload: {
		input: UpdateLinemanScheduleInput,
		metadata: { ip_address: string, device_info: any, authUser: AuthUser }
	}): Promise<MutationLinemanScheduleResponse> {
		
		const { input, metadata } = payload
		const { authUser, ip_address, device_info } = metadata

		return this.prisma.$transaction(async (tx) => {
		
			// Prepare common data for both create and update
			const scheduleData = {
			  lineman: { connect: { id: input.lineman_id } },
			  general_shift: { connect: { id: input.general_shift_id } },
			  mon_shift: { connect: { id: input.mon_shift_id } },
			  tue_shift: { connect: { id: input.tue_shift_id } },
			  wed_shift: { connect: { id: input.wed_shift_id } },
			  thu_shift: { connect: { id: input.thu_shift_id } },
			  fri_shift: { connect: { id: input.fri_shift_id } },
			  sat_shift: { connect: { id: input.sat_shift_id } },
			  sun_shift: { connect: { id: input.sun_shift_id } },
			};
		
			// Upsert the schedule
			const updatedSchedule = await tx.linemanSchedule.upsert({
			  where: { lineman_id: input.lineman_id },
			  update: scheduleData,
			  create: scheduleData,
			  include: {
				general_shift: true,
				lineman: true,
				mon_shift: true,
				tue_shift: true,
				wed_shift: true,
				thu_shift: true,
				fri_shift: true,
				sat_shift: true,
				sun_shift: true,
			  },
			});
			

			// log it
			await tx.linemanScheduleLog.create({
				data: {
				  lineman: { connect: { id: updatedSchedule.lineman_id } },
				  general_shift: updatedSchedule.general_shift,
				  mon_shift: updatedSchedule.mon_shift,
				  tue_shift: updatedSchedule.tue_shift,
				  wed_shift: updatedSchedule.wed_shift,
				  thu_shift: updatedSchedule.thu_shift,
				  fri_shift: updatedSchedule.fri_shift,
				  sat_shift: updatedSchedule.sat_shift,
				  sun_shift: updatedSchedule.sun_shift,
				  recorded_by: authUser.user.username,
				},
			});

			// audit log
			await this.audit.createAuditEntry({
				username: authUser.user.username,
				table: DB_TABLE.LINEMAN_SCHEDULE,
				action: 'UPDATE-LINEMAN-SCHEDULE',
				reference_id: updatedSchedule.id,
				metadata: updatedSchedule, 
				ip_address,
				device_info
			}, tx as unknown as Prisma.TransactionClient);
		
			return {
				success: true,
				msg: 'Lineman schedule updated successfully',
				data: updatedSchedule
			}

		});

	}

}
