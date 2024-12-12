import { ObjectType, Field } from '@nestjs/graphql';
import { Project } from './project.entity';
import { Item } from '../../item/entities/item.entity';

@ObjectType()
export class ProjectItem {

  @Field(() => String)
  id: string;

  @Field(() => String)
  project_id: string;

  @Field(() => String)
  item_id: string;

  @Field(() => Project)
  project: Project;

  @Field(() => Item)
  item: Item;

}
