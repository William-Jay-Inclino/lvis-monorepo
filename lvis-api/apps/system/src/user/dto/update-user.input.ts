import { IsOptional, IsString } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, registerEnumType } from '@nestjs/graphql';
import { Role, UserStatus } from 'apps/system/prisma/generated/client';

registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'UserStatus of the User default is ACTIVE',
});

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  firstname?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  middlename?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lastname?: string;

  @Field(type => Role, { nullable: true })
  @IsOptional()
  role?: Role | null

  @Field(() => UserStatus, { nullable: true })
  @IsOptional()
  status?: UserStatus;

  @Field({ nullable: true })
  @IsOptional()
  permissions?: string;

}
