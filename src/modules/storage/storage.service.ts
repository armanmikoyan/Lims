import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { STORAGE_REPOSITORY_TOKEN } from './storage.repository';
import { IStorageRepository } from './interfaces/storageRepository.interface';
import { IStorageService } from './interfaces/storageService.interface';
import { Storage } from '@prisma/client';
import { CreateStorageLocationsDto } from './dto/createStorageLocation.dto';
import { FilterBy, StorageList, StorageWithReagents, UpdatedStorages } from './types/storage.types';
import { StorageFilterOptions, StoragePaginationOptions, StorageSortOptions, StorageOptions } from './types/storageOptions.type';
import { UpdateStroageDto } from './dto/updateStorage.dto';
import { MoveItemsDto } from './dto/moveItems.dto';
import { ROOM_REPOSITORY_TOKEN } from '../room/room.repository';
import { IRoomRepository } from '../room/interfaces/roomRepository.interface';

@Injectable()
export class StorageService implements IStorageService {
  private readonly logger: Logger = new Logger(StorageService.name);

  constructor(
    @Inject(STORAGE_REPOSITORY_TOKEN) private storageRepository: IStorageRepository,
    @Inject(ROOM_REPOSITORY_TOKEN) private roomRepository: IRoomRepository,
  ) {}

  async getStorages(options: StorageOptions): Promise<StorageList> {
    this.logger.log(`[${this.getStorages.name}] - Method start`);
    try {
      let storageList: StorageList | null = {
        size: 0,
        storages: [],
      };
      const { roomName, storageName, fullPath }: StorageFilterOptions = options.filter;
      const pagination: StoragePaginationOptions = options.pagination;
      const sort: StorageSortOptions = options.sort;
      const filterBy: FilterBy = {
        name: storageName,
        roomIds: undefined,
      };

      if (fullPath || roomName) {
        let finalRoomName: string = roomName ?? '';
        if (fullPath) {
          const [roomName = '', storageName = ''] = fullPath.split(' ').filter((val) => val != '');
          filterBy.name = storageName;
          finalRoomName = roomName;
        }
        const roomIds: number[] = await this.roomRepository.findRoomIdsBySubName(finalRoomName);
        filterBy.roomIds = roomIds;
      }

      storageList = await this.storageRepository.findAll(filterBy, pagination, sort);

      this.logger.log(`[${this.getStorages.name}] - Method finished`);
      return storageList;
    } catch (error) {
      this.logger.error(`[${this.getStorages.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async getStorage(id: number): Promise<Storage | null> {
    this.logger.log(`[${this.getStorage.name}] - Method start`);
    try {
      const storage: Storage | null = await this.storageRepository.findById(id);
      this.logger.log(`[${this.getStorage.name}] - Method finished`);
      return storage;
    } catch (error) {
      this.logger.error(`[${this.getStorage.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async createStorageLocation(storageDto: CreateStorageLocationsDto): Promise<Storage> {
    this.logger.log(`[${this.createStorageLocation.name}] - Method start`);
    try {
      const { roomName, name, description = null } = storageDto;

      const roomId: number | null = await this.roomRepository.findRoomIdByName(roomName);
      if (!roomId) throw new NotFoundException(`Room ${roomName} - Doesn't exists`);

      const existingStorage: Storage | null = await this.storageRepository.findUniqueStorage(roomId, name);
      if (existingStorage) throw new ConflictException(`Storage with this - ${name} - in Room${roomName} already exists`);

      const storage: Storage = await this.storageRepository.create({ roomId, name, description });
      this.logger.log(`[${this.createStorageLocation.name}] - Method finished`);
      return storage;
    } catch (error) {
      this.logger.error(`[${this.createStorageLocation.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`[${this.delete.name}] - Method start`);
    try {
      const storage: StorageWithReagents | null = await this.storageRepository.findById(id, true);
      if (!storage) throw new NotFoundException('Storage Not Found');
      if (storage.reagents.length !== 0) {
        throw new ConflictException('Cannot delete storage because it has associated reagents.');
      }

      await this.storageRepository.delete(id);
      this.logger.log(`[${this.delete.name}] - Method finished`);
    } catch (error) {
      this.logger.error(`[${this.delete.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async update(id: number, storageDto: UpdateStroageDto): Promise<Storage> {
    this.logger.log(`[${this.update.name}] - Method start`);
    try {
      let storage: Storage | null = await this.storageRepository.findById(id);
      if (!storage) throw new NotFoundException('Storage Not Found');

      storage = await this.storageRepository.update({ id, ...storageDto });

      this.logger.log(`[${this.update.name}] - Method finished`);
      return storage;
    } catch (error) {
      this.logger.error(`[${this.update.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async moveItems(moveItemsDto: MoveItemsDto): Promise<UpdatedStorages> {
    this.logger.log(`[${this.moveItems.name}] - Method start`);
    try {
      const { sourceStorageId, destinationStorageId } = moveItemsDto;
      if (sourceStorageId === destinationStorageId) {
        throw new ConflictException("Source and destination storages can't be the same");
      }
      const updatedStorages: UpdatedStorages = await this.storageRepository.moveItems(moveItemsDto);
      this.logger.log(`[${this.moveItems.name}] - Method finished`);
      return updatedStorages;
    } catch (error) {
      this.logger.error(`[${this.moveItems.name}] - Exception thrown: ` + error);
      throw error;
    }
  }
}

const STORAGE_SERVICE_TOKEN = Symbol('STORAGE_SERVICE_TOKEN');
const StorageServiceProvider = {
  provide: STORAGE_SERVICE_TOKEN,
  useClass: StorageService,
};

export { STORAGE_SERVICE_TOKEN, StorageServiceProvider };
