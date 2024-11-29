import { IRepository } from 'src/common/interfaces/repository.interface';
import { IUser } from './userEntity.interface';

export interface IUserRepository extends IRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  setPasswordResetFlag(user: IUser, bool: boolean): any;
}
