import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";


@InputType()
export class UpdateLinemanInput {

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    area_id: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    supervisor_id: string;

}