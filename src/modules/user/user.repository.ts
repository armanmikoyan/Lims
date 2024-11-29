import { Injectable, Logger } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interface';
import { IUser } from './interfaces/userEntity.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
class UserRepository implements IRepository<IUser> {
  private readonly logger: Logger = new Logger(UserRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<IUser | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<IUser[]> {
    this.logger.log(`[${this.findAll.name}] - Method start`);
    try {
      const users: IUser[] = await this.prisma.user.findMany();
      this.logger.log(`[${this.findAll.name}] - Method finished`);
      return users;
    } catch (error) {
      this.logger.error(`[${this.findAll.name}] - Exception thrown` + error);
      throw error;
    }
  }

  async update(user: IUser): Promise<IUser> {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: user,
    });
  }

  async create(user: IUser): Promise<IUser> {
    return await this.prisma.user.create({
      data: user,
    });
  }

  async setPasswordResetFlag(user: IUser, bool: boolean) {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isPasswordResetRequired: bool,
      },
    });
  }

  async upsert(user: IUser): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        ...user,
      },
      create: {
        ...user,
      },
    });
  }

  async delete(id: number): Promise<IUser> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}

const USER_REPOSITORY_TOKEN = Symbol('USER_REPOSITORY_TOKEN');
const UserRepositoryProvider = {
  provide: USER_REPOSITORY_TOKEN,
  useClass: UserRepository,
};

export { USER_REPOSITORY_TOKEN, UserRepositoryProvider };
