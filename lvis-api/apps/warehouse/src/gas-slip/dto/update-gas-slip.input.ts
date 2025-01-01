import { IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { CreateGasSlipInput } from './create-gas-slip.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGasSlipInput extends PartialType(CreateGasSlipInput) {

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  vehicle_id?: string | null;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  driver_id?: string | null;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  gas_station_id?: number | null;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  fuel_type_id?: number | null;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  requested_by_id?: string | null;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  with_container?: boolean | null;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  liter_in_text?: string | null;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  purpose?: string | null;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  used_on?: string | null;

}
