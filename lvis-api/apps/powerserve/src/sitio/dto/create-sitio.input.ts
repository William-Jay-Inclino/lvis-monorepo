import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateSitioInput {

    @Field()
    @IsNotEmpty()
    barangay_id: string;

    @Field()
    @IsNotEmpty()
    name: string;

}
