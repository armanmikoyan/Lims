import { Module } from '@nestjs/common';
import { StorageServiceProvider } from './storage.service';
import { StorageController } from './storage.controller';
import { StorageRepositoryProvider } from './storage.repository';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [RoomModule],
  controllers: [StorageController],
  providers: [StorageServiceProvider, StorageRepositoryProvider],
  exports: [StorageServiceProvider],
})
export class StorageModule {}
