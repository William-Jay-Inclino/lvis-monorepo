import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTripTicketApproverInput } from './dto/create-trip-ticket-approver.input';
import { UpdateTripTicketApproverInput } from './dto/update-trip-ticket-approver.input';
import { PrismaService } from '../__prisma__/prisma.service';
import { TripTicketApprover } from 'apps/warehouse/prisma/generated/client';

@Injectable()
export class TripTicketApproverService {

  constructor(
    private readonly prisma: PrismaService,
  ) {

  }

  create(createTripTicketApproverInput: CreateTripTicketApproverInput) {
    return 'This action adds a new tripTicketApprover';
  }

  findAll() {
    return `This action returns all tripTicketApprover`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tripTicketApprover`;
  }

  update(id: number, updateTripTicketApproverInput: UpdateTripTicketApproverInput) {
    return `This action updates a #${id} tripTicketApprover`;
  }

  remove(id: number) {
    return `This action removes a #${id} tripTicketApprover`;
  }

  async findByTripTicketId(tripTicketId: string): Promise<TripTicketApprover[]> {

    if (!tripTicketId) {
        throw new BadRequestException('tripTicketId is undefined')
    }

    return await this.prisma.tripTicketApprover.findMany({
        where: {
            trip_ticket_id: tripTicketId
        },
        orderBy: {
            order: 'asc'
        }
    })
  }

}
