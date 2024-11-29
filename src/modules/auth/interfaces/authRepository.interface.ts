import { IRepository } from 'src/common/interfaces/repository.interface';
import { ISession } from './session.interface';
import { RefreshToken } from 'src/modules/security/interfaces/token.interface';

export interface IAuthRepository extends IRepository<ISession> {
  findSessionByUserId(userId: number): Promise<ISession | null>;
  findSessionByRefreshToken(refreshToken: RefreshToken): Promise<ISession | null>;
}
