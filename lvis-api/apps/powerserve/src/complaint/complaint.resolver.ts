import { Resolver } from '@nestjs/graphql';
import { ComplaintService } from './complaint.service';

@Resolver()
export class ComplaintResolver {
  constructor(private readonly complaintService: ComplaintService) {}
}
