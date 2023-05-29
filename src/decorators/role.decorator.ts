import { SetMetadata } from '@nestjs/common';
import { Role as UserType } from '@prisma/client';
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
