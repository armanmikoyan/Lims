import { AccessToken, RefreshToken, Tokens } from 'src/modules/security/interfaces/token.interface';
import { UserPayload } from 'src/modules/user/interfaces/userEntity.interface';
import { ISession } from './session.interface';

export interface IAuthService {
  login(user: UserPayload): Promise<Tokens>;
  refreshAccessToken(user: UserPayload): Promise<AccessToken>;
  isLoggedIn(userId: number): Promise<ISession | false>;
  logout(user: UserPayload | null, refreshToken: RefreshToken | null): Promise<void>;
}
