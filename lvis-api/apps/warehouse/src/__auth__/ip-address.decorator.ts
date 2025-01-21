import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { normalizeIp } from '../__common__/utils';

export const IpAddress = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | null => {
    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      return Array.isArray(ip) ? normalizeIp(ip[0]) : normalizeIp(ip);
    }

    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return Array.isArray(ip) ? normalizeIp(ip[0]) : normalizeIp(ip);
  }
);
