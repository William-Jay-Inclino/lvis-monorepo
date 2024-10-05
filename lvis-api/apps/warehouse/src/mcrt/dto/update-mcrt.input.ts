import { IsString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateMcrtInput {

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  returned_by_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  item_from_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  wo_number?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  mo_number?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  jo_number?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  note?: string;

}
