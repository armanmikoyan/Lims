import { USER_SERVICE_TOKEN } from 'src/modules/user/user.service';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUser, UserPayload } from 'src/modules/user/interfaces/userEntity.interface';
import { IUserService } from 'src/modules/user/interfaces/userService.interface';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(@Inject(USER_SERVICE_TOKEN) private userService: IUserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { email, password } = request.body;
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required.');
    }

    const validUser: IUser | null = await this.userService.validateUser(email, password);
    if (!validUser) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const userPayload: UserPayload = this.userService.omitPassword(validUser);
    request.user = userPayload;

    return true;
  }
}
