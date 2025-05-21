import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { NotificationType } from "apps/powerserve/prisma/generated/client";

registerEnumType(NotificationType, {
  name: 'NotificationType',
  description: 'The type of notification',
});

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field(() => NotificationType)
  notification_type: NotificationType;

  @Field()
  is_read: boolean;

  @Field()
  is_seen: boolean;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  read_at?: Date;

  @Field({ nullable: true })
  metadata?: string;

  @Field({ nullable: true })
  source_id?: string;

  @Field({ nullable: true })
  source_type?: string;
}