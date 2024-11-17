import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { CreateTripTicketInput } from './create-trip-ticket.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTripTicketInput extends PartialType(CreateTripTicketInput) {

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  vehicle_id?: string | null;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  driver_id?: string | null;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  passengers?: string | null;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  destination?: string | null;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  purpose?: string | null;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  start_time?: string | null;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  end_time?: string | null;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  is_operation?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  is_stay_in?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  is_personal?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  is_out_of_coverage?: boolean | null;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  prepared_by_id?: string | null;

}
