import { UserLogEventType } from 'apps/system/prisma/generated/client';
import { IsString, IsNotEmpty, IsOptional, IsObject, IsEnum } from 'class-validator';

export class CreateUserAuditLogDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  ip_address: string;

  @IsObject()
  @IsOptional()
  device_info: Record<string, any>;

  @IsEnum(UserLogEventType)
  @IsNotEmpty()
  event_type: UserLogEventType;
}