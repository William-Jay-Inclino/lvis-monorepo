import { IsOptional, IsString } from 'class-validator';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateServiceCenterInput } from './create-service-center.input';

@InputType()
export class UpdateServiceCenterInput extends PartialType(CreateServiceCenterInput) {

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contact_person?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contact_number?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  remarks?: string | null;

}
