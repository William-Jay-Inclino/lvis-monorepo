import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { McrtItemService } from './mcrt-item.service';
import { MCRTItem } from './entities/mcrt-item.entity';
import { CreateMcrtItemInput } from './dto/create-mcrt-item.input';
import { UpdateMcrtItemInput } from './dto/update-mcrt-item.input';

@Resolver(() => MCRTItem)
export class McrtItemResolver {
  constructor(private readonly mcrtItemService: McrtItemService) {}
}
