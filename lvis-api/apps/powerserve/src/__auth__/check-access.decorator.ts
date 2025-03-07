import { SetMetadata } from '@nestjs/common';
import { MODULES } from 'apps/system/src/__common__/modules.enum';
import { RESOLVERS } from 'apps/system/src/__common__/resolvers.enum';

export const CheckAccess = (module: MODULES, resolver: RESOLVERS) =>
    SetMetadata('access', { module, resolver });
