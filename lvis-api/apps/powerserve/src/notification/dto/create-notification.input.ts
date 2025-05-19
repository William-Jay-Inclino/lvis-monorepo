import { Field, InputType } from "@nestjs/graphql";
import { NotificationType } from "apps/powerserve/prisma/generated/client";

@InputType()
export class CreateNotificationInput {
  @Field()
  username: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field(() => NotificationType, { defaultValue: NotificationType.SYSTEM })
  notification_type?: NotificationType;

  @Field({ nullable: true })
  metadata?: any;

  @Field({ nullable: true })
  source_id?: string;

  @Field({ nullable: true })
  source_type?: string;
}