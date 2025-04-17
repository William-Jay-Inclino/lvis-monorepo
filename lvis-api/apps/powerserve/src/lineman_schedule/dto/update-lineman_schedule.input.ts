import { IsInt, IsOptional } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateLinemanScheduleInput {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  mon_shift_id?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  tue_shift_id?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  wed_shift_id?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  thu_shift_id?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  fri_shift_id?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  sat_shift_id?: number;
  
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  sun_shift_id?: number;

}
