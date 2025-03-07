import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserAgent = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | null => {
    if (context.getType() === 'http') {
      // For HTTP requests, extract User-Agent from headers
      const req = context.switchToHttp().getRequest();
      return req.headers['user-agent'] || null;
    }

    // For GraphQL requests, extract user-agent from the request headers in the context
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();
    const req = ctx.req; // Access the request object from the context

    return req.headers['user-agent'] || null; // Extract user-agent from headers
  }
);