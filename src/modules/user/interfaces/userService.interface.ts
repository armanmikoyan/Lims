import { Role } from '@prisma/client';
import { IUser, UserPayload } from './userEntity.interface';
import { ResetToken } from 'src/modules/security/interfaces/token.interface';
import { CreateUserDto } from '../dto/createUser.dto';

export interface IUserService {
  getUser(userId: number): Promise<UserPayload>;
  getUsers(): Promise<UserPayload[]>;
  validateUser(email: string, password: string): Promise<IUser | null>;
  editUserRole(userId: number, role: Role): Promise<UserPayload>;
  createUser(userInfo: CreateUserDto): Promise<UserPayload>;
  omitPassword(user: IUser): UserPayload;
  omitPasswords(users: IUser[]): UserPayload[];
  deleteUser(userId: number): Promise<void>;
  adminResetPassword(userId: number): Promise<void>;
  resetPassword(reset_token: ResetToken, newPassword: string, confirmPassword: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void>;
}
