import { InputType, Field } from '@nestjs/graphql';
import { IsDateString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateActualStartTimeInput {

  @Field()
  @IsNotEmpty()
  trip_ticket_id: string;

  @Field()
  @IsDateString()
  @IsNotEmpty()
  actual_start_time: string;

}
