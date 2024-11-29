import { UserPayload } from 'src/modules/user/interfaces/userEntity.interface';
import { AccessToken, RefreshToken, ResetToken } from './token.interface';

export interface ISecurityService {
  generateAccessToken(payload: any): Promise<AccessToken>;
  generateRefreshToken(payload: any): Promise<RefreshToken>;
  generateResetToken(payload: any): Promise<RefreshToken>;
  verifyRefreshToken(token: RefreshToken): Promise<UserPayload>;
  verifyResetToken(token: ResetToken): Promise<any>;
  verifyAccessToken(token: AccessToken): Promise<UserPayload>;
  hash(entity: any, salt?: number): Promise<string>;
  compare(raw: any, hashed: any): Promise<boolean>;
}
