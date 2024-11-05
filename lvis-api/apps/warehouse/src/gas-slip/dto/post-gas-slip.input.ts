import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNumber, IsPositive, Min } from 'class-validator';

@InputType()
export class PostGasSlipInput {

  @Field(() => Float)
  @IsNumber()
  @IsPositive({ message: 'Actual liter must be a positive number.' })
  @Min(0, { message: 'Actual liter cannot be less than zero.' })
  actual_liter: number;

  @Field(() => Float)
  @IsNumber()
  @IsPositive({ message: 'Price per liter must be a positive number.' })
  @Min(1, { message: 'Price per liter must be at least 1.' })
  price_per_liter: number;
}
