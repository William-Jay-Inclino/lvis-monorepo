import { ObjectType, Field, ID, Directive, registerEnumType } from '@nestjs/graphql';
import { LinemanStatus } from 'apps/powerserve/prisma/generated/client';
import { Area } from '../../area/entities/area.entity';

registerEnumType(LinemanStatus, {
  name: 'LinemanStatus',
  description: 'Status of the Lineman. Default is ACTIVE',
});

@ObjectType()
@Directive('@key(fields: "id")')
export class Lineman {

  @Field(() => ID)
  id: string;

  @Field()
  employee_id: string;

  @Field()
  area_id: string;

  @Field()
  supervisor_id: string;

  @Field( () => LinemanStatus)
  status: LinemanStatus;

  // derived

  @Field( () => Area)
  area: Area;

}
