import { Resolver } from '@nestjs/graphql';
import { ComplaintLogService } from './complaint_log.service';

@Resolver()
export class ComplaintLogResolver {
  constructor(private readonly complaintLogService: ComplaintLogService) {}
}
