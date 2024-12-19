import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateServiceCenterInput {
  
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  location: string;

  @Field()
  @IsString()
  contact_person: string;

  @Field()
  @IsString()
  contact_number: string;

  @Field()
  @IsString()
  remarks: string;

}
