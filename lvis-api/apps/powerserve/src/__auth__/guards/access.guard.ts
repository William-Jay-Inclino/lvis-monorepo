import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'apps/system/prisma/generated/client';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';
import { canAccess } from '../../__common__/helpers';

@Injectable()
export class AccessGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const access = this.reflector.get<{ module: MODULES; resolver: RESOLVERS }>('access', context.getHandler());

        if (!access) {
            return true;
        }

        let authUser: User;
        if (context.getType().toString() === 'graphql') {
            const ctx = GqlExecutionContext.create(context);
            authUser = ctx.getContext().req.user;
        } else {
            const request = context.switchToHttp().getRequest();
            authUser = request.user;
        }
        
        if (!canAccess(authUser, access.module, access.resolver)) {
            throw new ForbiddenException('You do not have permission to perform this action');
        }

        return true;
    }
}
