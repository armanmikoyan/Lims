export interface ISession {
  id?: number;
  refreshToken: string;
  isLoggedIn: boolean;
  createdAt: Date;
  userId: number;
}
