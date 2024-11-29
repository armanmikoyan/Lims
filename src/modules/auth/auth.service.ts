import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IAuthService } from './interfaces/authService.interface';
import { UserPayload } from '../user/interfaces/userEntity.interface';
import { AccessToken, RefreshToken, Tokens } from '../security/interfaces/token.interface';
import { SECURITY_SERVICE_TOKEN } from '../security/security.service';
import { ISession } from './interfaces/session.interface';
import { ISecurityService } from '../security/interfaces/securityService.interface';
import { IAuthRepository } from './interfaces/authRepository.interface';
import { AUTH_REPOSITORY_TOKEN } from './auth.repository';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    @Inject(SECURITY_SERVICE_TOKEN) private securityService: ISecurityService,
    @Inject(AUTH_REPOSITORY_TOKEN) private authRepository: IAuthRepository,
  ) {}

  async login(payload: UserPayload): Promise<Tokens> {
    const tokens: Tokens = {
      access_token: await this.securityService.generateAccessToken(payload),
      refresh_token: await this.securityService.generateRefreshToken(payload),
    };
    const session: ISession = {
      refreshToken: tokens.refresh_token,
      isLoggedIn: true,
      createdAt: new Date(),
      userId: payload.id!,
    };
    await this.authRepository.upsert(session);
    return tokens;
  }

  async logout(user: UserPayload | null, token: RefreshToken | null = null): Promise<void> {
    this.logger.log(`[${this.logout.name}] - Method start`);
    let session: ISession | false;
    try {
      if (user) {
        session = await this.isLoggedIn(user.id as number, null);
      } else {
        session = await this.isLoggedIn(null, token);
      }

      if (!session) throw new NotFoundException('Session not found');
      session.isLoggedIn = false;
      await this.authRepository.update(session);

      this.logger.log(`[${this.logout.name}] - Method finished`);
    } catch (error) {
      this.logger.error(`[${this.logout.name}] - Exception thrown` + error);
      throw error;
    }
  }

  async isLoggedIn(userId: number | null, token: RefreshToken | null = null): Promise<ISession | false> {
    this.logger.log(`[${this.isLoggedIn.name}] - Method start`);
    let session: ISession | null;
    try {
      if (userId) {
        session = await this.authRepository.findSessionByUserId(userId);
      } else {
        session = await this.authRepository.findSessionByRefreshToken(token!);
      }

      this.logger.log(`[${this.isLoggedIn.name}] - Method finished`);
      if (!session || !session.isLoggedIn) return false;
      return session;
    } catch (error) {
      this.logger.error(`[${this.isLoggedIn.name}] - Exception thrown` + error);
      throw error;
    }
  }

  async refreshAccessToken(user: UserPayload): Promise<AccessToken> {
    this.logger.log(`[${this.refreshAccessToken.name}] - Method start`);
    try {
      const token: AccessToken = await this.securityService.generateAccessToken(user);
      this.logger.log(`[${this.refreshAccessToken.name}] - Method finished`);
      return token;
    } catch (error) {
      this.logger.error(`[${this.refreshAccessToken.name}] - Exception thrown` + error);
      throw error;
    }
  }
}

const AUTH_SERVICE_TOKEN = Symbol('AUTH_SERVICE_TOKEN');
const AuthServiceProvider = {
  provide: AUTH_SERVICE_TOKEN,
  useClass: AuthService,
};

export { AUTH_SERVICE_TOKEN, AuthServiceProvider };
