import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateTripTicketApproverSubInput } from './create-trip-ticket-approver.sub.input';
import { Type } from 'class-transformer';

@InputType()
export class CreateTripTicketInput {

  @Field()
  @IsString()
  @IsNotEmpty()
  vehicle_id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  driver_id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  passengers: string | null;

  @Field()
  @IsString()
  @IsNotEmpty()
  destination: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @Field()
  @IsDateString()
  @IsNotEmpty()
  start_time: string;

  @Field()
  @IsDateString()
  @IsNotEmpty()
  end_time: string;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  is_operation: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  is_stay_in: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  is_personal: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  is_out_of_coverage: boolean;

  @Field()
  @IsString()
  @IsNotEmpty()
  prepared_by_id: string;

  @Field(() => [CreateTripTicketApproverSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTripTicketApproverSubInput)
  approvers: CreateTripTicketApproverSubInput[];
}
