import { Module } from '@nestjs/common';
import { SERVICES } from '.';
import { StatusController } from './status.controller';

@Module({
  controllers: [StatusController],
  providers: [...SERVICES],
})
export class StatusModule {}
