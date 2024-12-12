import { ObjectType, Field } from '@nestjs/graphql';
import { ProjectItem } from './project-item.entity';

@ObjectType()
export class Project {

  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => [ProjectItem])
  project_items: ProjectItem[];

}
