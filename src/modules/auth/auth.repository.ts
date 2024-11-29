import { Injectable, Logger } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { ISession } from './interfaces/session.interface';
import { RefreshToken } from '../security/interfaces/token.interface';

@Injectable()
export class AuthRepository implements Partial<IRepository<ISession>> {
  private readonly logger: Logger = new Logger(AuthRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findSessionByUserId(userId: number): Promise<ISession | null> {
    return await this.prisma.session.findFirst({
      where: {
        userId,
      },
    });
  }

  async findSessionByRefreshToken(refreshToken: RefreshToken): Promise<ISession | null> {
    try {
      this.logger.log(`[${this.findSessionByRefreshToken.name}] - Method start`);
      const session: ISession | null = await this.prisma.session.findFirst({
        where: {
          refreshToken,
        },
      });
      this.logger.log(`[${this.findSessionByRefreshToken.name}] - Method finished`);
      return session;
    } catch (error) {
      this.logger.error(`[${this.findSessionByRefreshToken.name}] - Exception thrown` + error);
      throw error;
    }
  }

  async update(session: ISession): Promise<ISession> {
    return await this.prisma.session.update({
      where: { userId: session.userId },
      data: session,
    });
  }

  async create(session: ISession): Promise<ISession> {
    return await this.prisma.session.create({
      data: session,
    });
  }

  async upsert(session: ISession): Promise<void> {
    await this.prisma.session.upsert({
      where: { userId: session.userId },
      update: {
        ...session,
      },
      create: {
        ...session,
      },
    });
  }
}

const AUTH_REPOSITORY_TOKEN = Symbol('AUTH_REPOSITORY_TOKEN');
const AuthRepositoryProvider = {
  provide: AUTH_REPOSITORY_TOKEN,
  useClass: AuthRepository,
};

export { AUTH_REPOSITORY_TOKEN, AuthRepositoryProvider };
