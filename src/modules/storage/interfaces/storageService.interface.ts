import { Storage } from '@prisma/client';
import { StorageOptions } from '../types/storageOptions.type';
import { CreateStorageLocationsDto } from '../dto/createStorageLocation.dto';
import { StorageList, UpdatedStorages } from '../types/storage.types';
import { UpdateStroageDto } from '../dto/updateStorage.dto';
import { MoveItemsDto } from '../dto/moveItems.dto';

export interface IStorageService {
  getStorages(options: StorageOptions): Promise<StorageList>;
  getStorage(id: number): Promise<Storage | null>;
  createStorageLocation(storage: CreateStorageLocationsDto): Promise<Storage>;
  delete(id: number): Promise<void>;
  update(id: number, roomDto: UpdateStroageDto): Promise<Storage>;
  moveItems(moveItemsDto: MoveItemsDto): Promise<UpdatedStorages>;
}
