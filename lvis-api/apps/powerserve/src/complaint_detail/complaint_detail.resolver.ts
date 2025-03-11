import { Resolver } from '@nestjs/graphql';
import { ComplaintDetailService } from './complaint_detail.service';

@Resolver()
export class ComplaintDetailResolver {
  constructor(private readonly complaintDetailService: ComplaintDetailService) {}
}
