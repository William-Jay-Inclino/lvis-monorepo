import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const IpAddress = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | null => {
    // Handle HTTP context (for REST APIs)
    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      
      // Check 'X-Forwarded-For' header first if behind a proxy (like Nginx)
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      
      // Handle case if there are multiple proxies (split the comma-separated list)
      return Array.isArray(ip) ? ip[0] : ip || null;
    }

    // Handle GraphQL context
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    
    // Check 'X-Forwarded-For' header and fallback to remoteAddress if necessary
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Return the first IP if multiple proxies, otherwise the IP
    return Array.isArray(ip) ? ip[0] : ip || null;
  }
);
