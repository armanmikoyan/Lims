import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IUser, UserPayload } from './interfaces/userEntity.interface';
import { IUserService } from './interfaces/userService.interface';
import { Role } from '@prisma/client';
import { USER_REPOSITORY_TOKEN } from './user.repository';
import { SECURITY_SERVICE_TOKEN } from '../security/security.service';
import { EmailService } from '../../common/services/email/email.service';
import { ResetToken } from '../security/interfaces/token.interface';
import generator from 'generate-password-ts';
import { IUserRepository } from './interfaces/userRepository.interface';
import { ISecurityService } from '../security/interfaces/securityService.interface';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
class UserService implements IUserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: IUserRepository,
    @Inject(SECURITY_SERVICE_TOKEN) private securityService: ISecurityService,
    private emailService: EmailService,
  ) {}

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findByEmail(email);
  }

  async getUserById(id: number): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.getUserByEmail(email);
    if (user && (await this.securityService.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  omitPassword(user: IUser): UserPayload {
    this.logger.log(`[${this.omitPassword.name}] - Method start`);
    try {
      const { password, ...userPayload } = user;
      void password; // for lint (intentionally not using this variable)

      this.logger.log(`[${this.omitPassword.name}] - Method finished`);
      return userPayload;
    } catch (error) {
      this.logger.error(`[${this.omitPassword.name}] - Exception thrown` + error);
      throw error;
    }
  }

  omitPasswords(users: IUser[]): UserPayload[] {
    this.logger.log(`[${this.omitPasswords.name}] - Method start`);
    try {
      const userPayloads: UserPayload[] = users.map(({ password, ...userPayload }) => {
        void password; // for lint (intentionally not using this variable)
        return userPayload;
      });
      this.logger.log(`[${this.omitPasswords.name}] - Method finished`);
      return userPayloads;
    } catch (error) {
      this.logger.error(`[${this.omitPasswords.name}] - Exception thrown` + error);
      throw error;
    }
  }

  async editUserRole(userId: number, role: Role): Promise<UserPayload> {
    let user: IUser | null = await this.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    user = await this.userRepository.update(user);
    const userPayload: UserPayload = this.omitPassword(user);
    return userPayload;
  }

  async createUser(userInfo: CreateUserDto): Promise<UserPayload> {
    const existingUser = await this.userRepository.findByEmail(userInfo.email);
    if (existingUser) throw new ConflictException('User with this email already exists');
    const tempPassword = this.generatePassword();

    let user: IUser = {
      ...userInfo,
      isPasswordResetRequired: true,
      password: await this.securityService.hash(tempPassword),
    };
    try {
      user = await this.userRepository.create(user);
      await this.emailService.sendTempPasswordEmail(userInfo.email, tempPassword);
    } catch (error) {
      const toDelete: IUser | null = await this.userRepository.findByEmail(userInfo.email);
      if (toDelete) {
        await this.deleteUser(toDelete.id as number);
      }
      throw error;
    }

    const userPayload: UserPayload = this.omitPassword(user);
    return userPayload;
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User is not found');
    }

    const passwordCheck = await this.securityService.compare(oldPassword, user.password);
    if (!passwordCheck) {
      throw new BadRequestException('Wrong password');
    }

    const newHashedPassword = await this.securityService.hash(newPassword, 10);
    user.password = newHashedPassword;
    await this.userRepository.update(user);
    await this.userRepository.setPasswordResetFlag(user, false);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email not found');
    }
    const payload = { id: user.id as number, email };
    const token = await this.securityService.generateResetToken(payload);
    await this.emailService.sendPasswordResetEmail(email, token);
  }

  async resetPassword(reset_token: ResetToken, newPassword: string, confirmPassword: string): Promise<void> {
    const token = await this.securityService.verifyResetToken(reset_token);

    if (!token) {
      throw new NotFoundException('Token is invalid');
    }

    const user = await this.getUserById(token.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    user.password = await this.securityService.hash(newPassword, 10);
    await this.userRepository.update(user);
    await this.userRepository.setPasswordResetFlag(user, false);
  }

  async adminResetPassword(userId: number): Promise<void> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tempPassword = this.generatePassword();

    user.password = await this.securityService.hash(tempPassword, 10);
    await this.userRepository.update(user);
    await this.emailService.sendTempPasswordEmail(user.email, tempPassword);
    await this.userRepository.setPasswordResetFlag(user, true);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(userId);
  }

  async getUser(userId: number): Promise<UserPayload> {
    const user: IUser | null = await this.getUserById(userId);
    if (!user) throw new NotFoundException('User not found');
    return this.omitPassword(user);
  }

  async getUsers(): Promise<UserPayload[]> {
    this.logger.log(`[${this.getUsers.name}] - Method start`);
    try {
      const users: IUser[] = await this.userRepository.findAll();
      const saveUsers: UserPayload[] = this.omitPasswords(users);
      this.logger.log(`[${this.getUsers.name}] - Method finished`);
      return saveUsers;
    } catch (error) {
      this.logger.error(`[${this.getUsers.name}] - Exception thrown` + error);
      throw error;
    }
  }

  private generatePassword(): string {
    return generator.generate({
      length: 10,
      numbers: true,
    });
  }
}

const USER_SERVICE_TOKEN = Symbol('USER_SERVICE_TOKEN');
const UserServiceProvider = {
  provide: USER_SERVICE_TOKEN,
  useClass: UserService,
};

export { USER_SERVICE_TOKEN, UserServiceProvider };
