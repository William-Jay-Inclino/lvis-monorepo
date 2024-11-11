import { InputType, Field } from '@nestjs/graphql';
import { IsDateString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateActualEndTimeInput {

  @Field()
  @IsNotEmpty()
  trip_ticket_id: string;
  
  @Field()
  @IsDateString()
  @IsNotEmpty()
  actual_end_time: string;

}
