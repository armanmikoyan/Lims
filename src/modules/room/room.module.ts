import { Module } from '@nestjs/common';
import { RoomServiceProvider } from './room.service';
import { RoomController } from './room.controller';
import { RoomRepositoryProvider } from './room.repository';

@Module({
  controllers: [RoomController],
  providers: [RoomServiceProvider, RoomRepositoryProvider],
  exports: [RoomServiceProvider, RoomRepositoryProvider],
})
export class RoomModule {}
