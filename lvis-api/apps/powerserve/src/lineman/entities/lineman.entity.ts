import { ObjectType, Field, ID, Directive, registerEnumType, Float } from '@nestjs/graphql';
import { LinemanStatus } from 'apps/powerserve/prisma/generated/client';
import { Area } from '../../area/entities/area.entity';
import { PowerInterruptionLineman } from '../../td_power_interruption_lineman/entities/power_interruption_lineman.entity';
import { KwhMeterLineman } from '../../td_kwh_meter_lineman/entities/kwh_meter_lineman.entity';
import { LineServicesLineman } from '../../td_line_services_lineman/entities/line_services_lineman.entity';
import { DlesLineman } from '../../td_dles_lineman/entities/dles_lineman.entity';
import { LmdgaLineman } from '../../td_lmdga_lineman/entities/lmdga_lineman.entity';
import { LinemanActivity } from './lineman-activity';
import { Remarks } from '../../remarks/entities/remarks';

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

  @Field()
  created_at: string;

  // derived

  @Field( () => Area)
  area: Area;

  @Field( () => [PowerInterruptionLineman])
  power_interruptions: PowerInterruptionLineman[];

  @Field( () => [KwhMeterLineman])
  kwh_meters: KwhMeterLineman[];

  @Field( () => [LineServicesLineman])
  line_services: LineServicesLineman[];

  @Field( () => [DlesLineman])
  dles: DlesLineman[];

  @Field( () => [LmdgaLineman])
  lmdgas: LmdgaLineman[];

  // programatic 

  @Field( () => [LinemanActivity], { nullable: true })
  activities: LinemanActivity[];

  @Field(() => Float, { nullable: true })
  total_numerical_rating: number 

  @Field(() => Float, { nullable: true })
  total_distance_travelled: number 

  @Field(() => Remarks, { nullable: true })
  remarks: Remarks 

}
