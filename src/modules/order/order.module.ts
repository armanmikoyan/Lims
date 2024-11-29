import { Module } from '@nestjs/common';
import { OrderServiceProvider } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepositoryProvider } from './order.repository';

@Module({
  controllers: [OrderController],
  providers: [OrderServiceProvider, OrderRepositoryProvider],
  exports: [OrderServiceProvider],
})
export class OrderModule {}
