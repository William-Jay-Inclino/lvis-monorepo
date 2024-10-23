import { Module } from '@nestjs/common';
import { FuelTypeModule } from './fuel-type/fuel-type.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './__prisma__/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './__auth__/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    PrismaModule,
    FuelTypeModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class MotorpoolModule {}
