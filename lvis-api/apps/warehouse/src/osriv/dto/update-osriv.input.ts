import { IsString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateOsrivInput {

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  purpose?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  requested_by_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  item_from_id?: string;

}
