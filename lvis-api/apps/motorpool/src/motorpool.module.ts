import { Module } from '@nestjs/common';
import { FuelTypeModule } from './fuel-type/fuel-type.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './__prisma__/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './__auth__/auth.module';
import { GasStationModule } from './gas-station/gas-station.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { TripTicketModule } from './trip-ticket/trip-ticket.module';
import { TripTicketApproverModule } from './trip-ticket-approver/trip-ticket-approver.module';

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
    GasStationModule,
    VehicleModule,
    TripTicketModule,
    TripTicketApproverModule,
  ],
  controllers: [],
  providers: [],
})
export class MotorpoolModule {}
