import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StatusModule } from './modules/status/status.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SecurityModule } from './modules/security/security.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { StorageModule } from './modules/storage/storage.module';
import * as cookieParser from 'cookie-parser';
import { ReagentModule } from './modules/reagent/reagent.module';
import { ReagentRequestModule } from './modules/reagentRequest/reagentRequest.module';
import { OrderModule } from './modules/order/order.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StatusModule,
    UserModule,
    AuthModule,
    SecurityModule,
    PrismaModule,
    StorageModule,
    ReagentModule,
    ReagentRequestModule,
    OrderModule,
    DashboardModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
