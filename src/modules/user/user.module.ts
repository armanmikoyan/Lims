import { Module } from '@nestjs/common';
import { UserServiceProvider } from './user.service';
import { UserRepositoryProvider } from './user.repository';
import { UserController } from './user.controller';
import { EmailService } from '../../common/services/email/email.service';

@Module({
  controllers: [UserController],
  providers: [UserServiceProvider, UserRepositoryProvider, EmailService],
  exports: [UserServiceProvider],
})
export class UserModule {}
