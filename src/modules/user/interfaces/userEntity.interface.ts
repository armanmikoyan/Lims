import { Role } from '@prisma/client';

export interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  isPasswordResetRequired?: boolean;
}

export type UserPayload = Omit<IUser, 'password' | 'isPasswordResetRequired'> & {
  iat?: number;
  exp?: number;
};
