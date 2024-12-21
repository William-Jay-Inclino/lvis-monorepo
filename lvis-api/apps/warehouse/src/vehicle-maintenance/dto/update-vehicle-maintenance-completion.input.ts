import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";


@InputType()
export class UpdateVehicleMaintenanceCompletionInput{

    @Field()
    @IsNotEmpty()
    @IsString()
    vehicle_maintenance_id: string;

    @Field(() => Boolean)
    @IsBoolean()
    is_completed: boolean;

}
