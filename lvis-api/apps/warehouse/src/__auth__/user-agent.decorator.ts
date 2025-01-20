import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserAgent = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | null => {
    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      // Extract User-Agent from HTTP headers, return null if not found
      return req.headers['user-agent'] || null; 
    }

    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    // Extract User-Agent from GraphQL context, return null if not found
    return req.headers['user-agent'] || null;
  }
);
