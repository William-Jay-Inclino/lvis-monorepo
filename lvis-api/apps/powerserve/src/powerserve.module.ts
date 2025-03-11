import { Module } from '@nestjs/common';
import { PowerserveController } from './powerserve.controller';
import { PowerserveService } from './powerserve.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { SeederModule } from './__seeder__/seeder.module';
import { PrismaModule } from './__prisma__/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { AreaModule } from './area/area.module';
import { PowerserveAuditModule } from './powerserve_audit/powerserve_audit.module';
import { AuthModule } from './__auth__/auth.module';
import { LinemanModule } from './lineman/lineman.module';
import { MunicipalityModule } from './municipality/municipality.module';
import { BarangayModule } from './barangay/barangay.module';
import { SitioModule } from './sitio/sitio.module';
import { FeederModule } from './feeder/feeder.module';
import { WeatherConditionModule } from './weather_condition/weather_condition.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ============================= SHARED ============================= 

    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    PrometheusModule.register(),
    HttpModule,
    AuthModule,
    SeederModule,
    PrismaModule,
    AreaModule,
    PowerserveAuditModule,
    LinemanModule,
    MunicipalityModule,
    BarangayModule,
    SitioModule,
    FeederModule,
    WeatherConditionModule,
    DeviceModule,

  ],
  controllers: [PowerserveController],
  providers: [PowerserveService],
})
export class PowerserveModule {}
