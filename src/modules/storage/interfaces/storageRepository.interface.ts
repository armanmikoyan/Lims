import { IRepository } from 'src/common/interfaces/repository.interface';
import { Storage } from '@prisma/client';
import { StorageCreation, StorageWithReagents, FilterBy, StorageList, UpdatedStorages } from '../types/storage.types';
import { StoragePaginationOptions, StorageSortOptions } from '../types/storageOptions.type';
import { PartialWithRequiredId } from 'src/common/types/idRequired.type';
import { MoveItemsDto } from '../dto/moveItems.dto';

export interface IStorageRepository extends IRepository<Storage> {
  findById(id: number, includeReagents: true): Promise<StorageWithReagents | null>; // overload
  findById(id: number, includeReagents?: boolean): Promise<Storage | StorageWithReagents | null>; // implementation
  findUniqueStorage(roomId: number, storageName: string): Promise<Storage | null>;
  create(storageDto: StorageCreation): Promise<Storage>;
  findAllByName(storageName: string, pagination?: StoragePaginationOptions, sortOptions?: StorageSortOptions): Promise<Storage[]>;
  findAll(filterBy?: FilterBy, pagination?: StoragePaginationOptions, sortOptions?: StorageSortOptions): Promise<StorageList>;
  update(data: PartialWithRequiredId<Storage>): Promise<Storage>;
  findAllByRoom(
    roomId: number,
    pagination?: StoragePaginationOptions,
    sortOptions?: StorageSortOptions,
  ): Promise<Storage[] | null>;
  moveItems(moveItemsDto: MoveItemsDto): Promise<UpdatedStorages>;
}
