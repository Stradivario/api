import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities';

export const InjectUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User|null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
