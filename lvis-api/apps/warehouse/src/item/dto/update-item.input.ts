import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CreateItemInput } from './create-item.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  item_type_id?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  unit_id?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  project_id?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  alert_level?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string

}
