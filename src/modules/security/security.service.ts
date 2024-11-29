import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, RefreshToken, ResetToken } from './interfaces/token.interface';
import { ISecurityService } from './interfaces/securityService.interface';
import * as bcrypt from 'bcrypt';
import { UserPayload } from '../user/interfaces/userEntity.interface';

@Injectable()
class SecurityService implements ISecurityService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateAccessToken(payload: any): Promise<AccessToken> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
    });
  }

  async generateRefreshToken(payload: any): Promise<RefreshToken> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
    });
  }

  async generateResetToken(payload: any): Promise<ResetToken> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_RESET_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_RESET_TOKEN_EXPIRATION'),
    });
  }

  async hash(entity: any, salt: number = 10): Promise<string> {
    return await bcrypt.hash(entity, salt);
  }

  async compare(raw: any, hashed: any): Promise<boolean> {
    return await bcrypt.compare(raw, hashed);
  }

  async verifyAccessToken(token: AccessToken): Promise<UserPayload> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
    return payload;
  }

  async verifyRefreshToken(token: RefreshToken): Promise<UserPayload> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    return payload;
  }

  async verifyResetToken(token: ResetToken): Promise<any> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.getOrThrow<string>('JWT_RESET_SECRET'),
    });
    return payload;
  }
}

const SECURITY_SERVICE_TOKEN = Symbol('SECURITY_SERVICE_TOKEN');
const SecurityServiceProvider = {
  provide: SECURITY_SERVICE_TOKEN,
  useClass: SecurityService,
};

export { SECURITY_SERVICE_TOKEN, SecurityServiceProvider };
