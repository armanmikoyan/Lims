import { Module } from '@nestjs/common';
import { AuthServiceProvider } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthRepositoryProvider } from './auth.repository';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthServiceProvider, AuthRepositoryProvider],
})
export class AuthModule {}
