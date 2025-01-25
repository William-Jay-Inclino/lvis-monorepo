import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'apps/system/src/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { SystemAuditModule } from '../system_audit/system_audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '10h' }
    }),
    SystemAuditModule,
  ],
  controllers: [AuthController],
  providers: [AuthResolver, AuthService, UserService, JwtStrategy, LocalStrategy]
})
export class AuthModule {}
