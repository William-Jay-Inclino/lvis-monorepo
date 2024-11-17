import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateGasSlipApproverSubInput } from './create-gas-slip-approver.sub.input';
import { Type } from 'class-transformer';

@InputType()
export class CreateGasSlipInput {

  @Field()
  @IsString()
  @IsNotEmpty()
  vehicle_id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  driver_id: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  gas_station_id: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  fuel_type_id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  requested_by_id: string;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  with_container: boolean;

  @Field()
  @IsString()
  @IsNotEmpty()
  liter_in_text: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @Field(() => [CreateGasSlipApproverSubInput])
  @IsNotEmpty({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGasSlipApproverSubInput)
  approvers: CreateGasSlipApproverSubInput[];

}
