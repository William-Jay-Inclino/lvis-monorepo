import { Injectable } from '@nestjs/common';
import { CreateTripTicketApproverInput } from './dto/create-trip-ticket-approver.input';
import { UpdateTripTicketApproverInput } from './dto/update-trip-ticket-approver.input';

@Injectable()
export class TripTicketApproverService {
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
}
