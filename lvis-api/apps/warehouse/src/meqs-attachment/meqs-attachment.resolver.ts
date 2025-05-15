import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MeqsAttachmentService } from './meqs-attachment.service';
import { MeqsAttachment } from './entities/meqs-attachment.entity';
import { CreateMeqsAttachmentInput } from './dto/create-meqs-attachment.input';
import { UpdateMeqsAttachmentInput } from './dto/update-meqs-attachment.input';

@Resolver(() => MeqsAttachment)
export class MeqsAttachmentResolver {
  constructor(private readonly meqsAttachmentService: MeqsAttachmentService) {}


}
