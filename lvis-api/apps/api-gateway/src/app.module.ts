import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { Module, UnauthorizedException } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { verify } from 'jsonwebtoken'
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload-warehouse/file-upload.module';
import { FileUploadSystemModule } from './file-upload-system/file-upload-system.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { getClientIp } from './__common__/utils';
// import { PrometheusModule } from '@willsoto/nestjs-prometheus';

const getToken = (authToken: string) => {

  const match = authToken.match(/^Bearer (.*)$/)
  if(!match || match.length > 2) {
    throw new UnauthorizedException('Invalid token');
  }

  return match[1]

}

const decodeToken = (tokenString: string) => {

  const decoded = verify(tokenString, process.env.JWT_SECRET_KEY)

  if(!decoded) {
    throw new UnauthorizedException('Invalid token');
  }

  return decoded

}

export function handleAuth({ req }) {
  try {
    // Extract the client IP address
    const ip = getClientIp(req);

     // Extract the User-Agent header
     const userAgent = req.headers['user-agent'] || null;

    // Extract and decode the authorization token if provided
    let user = null;
    let authorization = null;

    if (req.headers.authorization) {
      authorization = req.headers.authorization;
      const token = getToken(authorization);
      user = decodeToken(token);
    }

    // Return the context with the user, authorization, and IP
    return {
      user,
      authorization,
      ip, // Add IP to the context
      userAgent,
    };
  } catch (error) {
    console.error('Error in handleAuth:', error);
    throw new UnauthorizedException('Invalid token or missing authorization');
  }
}


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        // cors: true,
        path: '/lvis/graphql',
        context: handleAuth
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'system',
              url: process.env.SYSTEM_URL,
            },
            {
              name: 'warehouse',
              url: process.env.WAREHOUSE_URL,
            },
            {
              name: 'powerserve',
              url: process.env.POWERSERVE_URL,
            },
          ],
        }),
        buildService({ url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              request.http.headers.set('user', context.user ? context.user : null);
              request.http.headers.set('authorization', context.authorization ? context.authorization : null);
              request.http.headers.set('X-Client-IP', context.ip || null);
              request.http.headers.set('User-Agent', context.userAgent || null);
            },
          });
        },
      },
    }),

    AuthModule,
    FileUploadModule,
    FileUploadSystemModule,
    PrometheusModule.register()
  ],
  controllers: [],
  providers: [],
})


export class AppModule {}
