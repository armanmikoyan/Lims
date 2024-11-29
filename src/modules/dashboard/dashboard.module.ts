import { Module } from '@nestjs/common';
import { DashboardServiceProvider } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  providers: [DashboardServiceProvider],
  controllers: [DashboardController],
})
export class DashboardModule {}
