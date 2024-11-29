import { Module } from '@nestjs/common';
import { ReagentRequestController } from './reagentRequest.controller';
import { RequestServiceProvider } from './reagentRequest.service';
import { RequestRepositoryProvider } from './reagentRequest.repository';

@Module({
  providers: [RequestServiceProvider, RequestRepositoryProvider],
  controllers: [ReagentRequestController],
  exports: [RequestRepositoryProvider],
})
export class ReagentRequestModule {}
