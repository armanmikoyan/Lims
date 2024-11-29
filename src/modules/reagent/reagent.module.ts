import { Module } from '@nestjs/common';
import { ReagentServiceProvider } from './reagent.service';
import { ReagentRepositoryProvider } from './reagent.repository';
import { ReagentController } from './reagent.controller';
import { ReagentRequestModule } from '../reagentRequest/reagentRequest.module';
import { SampleServiceProvider } from './sample.service';

@Module({
  imports: [ReagentRequestModule],
  controllers: [ReagentController],
  providers: [ReagentServiceProvider, ReagentRepositoryProvider, SampleServiceProvider],
})
export class ReagentModule {}
