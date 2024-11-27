import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthUser } from "../__common__/auth-user.entity";

export const CurrentAuthUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext): AuthUser => {
        if (context.getType() === 'http') {
            const req = context.switchToHttp().getRequest()

            return {
                authorization: req.authorization,
                user: req.user
            }

        }

        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req

        return {
            authorization: req.headers.authorization,
            user: req.user
        }

    }
)