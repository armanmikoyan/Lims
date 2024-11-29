import { Global, Module } from '@nestjs/common';
import { SecurityServiceProvider } from './security.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule],
  providers: [SecurityServiceProvider],
  exports: [SecurityServiceProvider],
})
export class SecurityModule {}
