import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { TaskDetailLmdgaService } from './task_detail_lmdga.service';
import { Station } from '../__station__   /entities/station.entity';
import { TaskDetailLmdga } from './entities/task_detail_lmdga.entity';

@Resolver(() => TaskDetailLmdga)
export class TaskDetailLmdgaResolver {
	constructor(private readonly taskDetailLmdgaService: TaskDetailLmdgaService) {}


	@ResolveField(() => Station)
	substation(@Parent() lmdga: TaskDetailLmdga): any {
		return { __typename: 'Station', id: lmdga.substation_id }
	}

}
