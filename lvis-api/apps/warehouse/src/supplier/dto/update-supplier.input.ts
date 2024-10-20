import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { CreateSupplierInput } from './create-supplier.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { VAT_TYPE } from '../../__common__/types';

@InputType()
export class UpdateSupplierInput extends PartialType(CreateSupplierInput) {
  
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  contact?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  tin?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  address?: string | null;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  is_vat_registered: boolean;


  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  vat_type?: VAT_TYPE | null;

}
