import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IStorageRepository } from './interfaces/storageRepository.interface';
import { Prisma, Storage } from '@prisma/client';
import {
  StorageCreation,
  StorageWithReagents,
  FilterBy,
  StorageList,
  StorageWithReagentCount,
  StorageWithReagentCountObject,
  UpdatedStorages,
} from './types/storage.types';
import { OrderBy, StoragePaginationOptions, StorageSortOptions } from './types/storageOptions.type';
import { PartialWithRequiredId } from 'src/common/types/idRequired.type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MoveItemsDto } from './dto/moveItems.dto';

@Injectable()
export class StorageRepository implements IStorageRepository {
  private readonly logger: Logger = new Logger(StorageRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Storage | null>;
  async findById(id: number, includeReagents: true): Promise<StorageWithReagents | null>;
  async findById(id: number, includeReagents: boolean = false): Promise<Storage | StorageWithReagents | null> {
    this.logger.log(`[${this.findById.name}] - Method start`);
    try {
      const storage: Storage | null = await this.prisma.storage.findUnique({
        where: { id },
        include: {
          room: true,
          reagents: includeReagents,
        },
      });
      this.logger.log(`[${this.findById.name}] - Method finished`);
      return storage;
    } catch (error) {
      this.logger.error(`[${this.findById.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async findUniqueStorage(roomId: number, storageName: string): Promise<Storage | null> {
    this.logger.log(`[${this.findUniqueStorage.name}] - Method start`);
    try {
      const storage: Storage | null = await this.prisma.storage.findUnique({
        where: {
          roomId_name: {
            roomId,
            name: storageName,
          },
        },
        include: {
          room: true,
        },
      });
      this.logger.log(`[${this.findUniqueStorage.name}] - Method finished`);
      return storage;
    } catch (error) {
      this.logger.error(`[${this.findUniqueStorage.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async findAll(
    filterBy?: FilterBy,
    pagination?: StoragePaginationOptions,
    sortOptions?: StorageSortOptions,
  ): Promise<StorageList> {
    this.logger.log(`[${this.findAll.name}] - Method start`);
    try {
      const { skip = 0, take = 10 } = pagination || {};
      const orderBy: OrderBy = this.orderFactory(sortOptions);

      const where: Prisma.StorageWhereInput = {
        roomId: {
          in: filterBy?.roomIds,
        },
        name: {
          contains: filterBy?.name,
          mode: 'insensitive',
        },
      };

      const [storages, size]: [StorageWithReagentCountObject[], number] = await this.prisma.$transaction([
        this.prisma.storage.findMany({
          where,
          skip,
          take,
          orderBy: orderBy,
          include: {
            room: true,
            _count: {
              select: {
                reagents: true,
              },
            },
          },
        }),
        this.prisma.storage.count({ where }),
      ]);

      const storageWithReagentCount: StorageWithReagentCount[] = storages.map(({ _count, ...storages }) => ({
        ...storages,
        reagentCount: _count.reagents,
      }));

      this.logger.log(`[${this.findAll.name}] - Method finished,`);
      return { storages: storageWithReagentCount, size };
    } catch (error) {
      this.logger.error(`[${this.findAll.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async findAllByName(
    storageName: string,
    pagination?: StoragePaginationOptions,
    sortOptions?: StorageSortOptions,
  ): Promise<Storage[]> {
    this.logger.log(`[${this.findAllByName.name}] - Method start`);
    try {
      const { skip = 0, take = 10 } = pagination || {};
      const orderBy: OrderBy = this.orderFactory(sortOptions);

      const storages: Storage[] = await this.prisma.storage.findMany({
        where: {
          name: {
            contains: storageName,
            mode: 'insensitive',
          },
        },
        skip,
        take,
        orderBy,
        include: {
          room: true,
        },
      });
      this.logger.log(`[${this.findAllByName.name}] - Method finished,`);
      return storages;
    } catch (error) {
      this.logger.error(`[${this.findAllByName.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async findAllByRoom(
    roomId: number,
    pagination?: StoragePaginationOptions,
    sortOptions?: StorageSortOptions,
  ): Promise<Storage[] | null> {
    this.logger.log(`[${this.findAllByRoom.name}] - Method start`);
    try {
      const { skip = 0, take = 10 } = pagination || {};
      const orderBy: OrderBy = this.orderFactory(sortOptions);
      const storages: Storage[] = await this.prisma.storage.findMany({
        where: { roomId },
        skip,
        take,
        orderBy,
        include: {
          room: true,
        },
      });
      this.logger.log(`[${this.findAllByRoom.name}] - Method finished,`);
      return storages;
    } catch (error) {
      this.logger.error(`[${this.findAllByRoom.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async update(storage: PartialWithRequiredId<Storage>): Promise<Storage> {
    this.logger.log(`[${this.update.name}] - Method start`);
    try {
      const updatedStorage: Storage = await this.prisma.storage.update({
        where: { id: storage.id },
        data: storage,
      });
      this.logger.log(`[${this.update.name}] - Method finished`);
      return updatedStorage;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        error = new ConflictException(`Storage with name ${storage.name} already exists, in this room `);
      }
      this.logger.error(`[${this.update.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async create(data: StorageCreation): Promise<Storage> {
    this.logger.log(`[${this.create.name}] - Method start`);
    try {
      const storage: Storage = await this.prisma.storage.create({
        data,
        include: {
          room: true,
        },
      });
      this.logger.log(`[${this.create.name}] - Method finished`);
      return storage;
    } catch (error) {
      this.logger.error(`[${this.create.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async delete(id: number): Promise<Storage> {
    this.logger.log(`[${this.delete.name}] - Method start`);
    try {
      const deletedStorage: Storage = await this.prisma.storage.delete({
        where: { id },
      });
      this.logger.log(`[${this.delete.name}] - Method finished`);
      return deletedStorage;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        error = new NotFoundException('Storage Not Found');
      }
      this.logger.error(`[${this.delete.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async upsert(storage: Storage): Promise<void> {
    this.logger.log(`[${this.upsert.name}] - Method start`);
    try {
      await this.prisma.storage.upsert({
        where: { id: storage.id },
        update: {
          ...storage,
        },
        create: {
          ...storage,
        },
      });
      this.logger.log(`[${this.upsert.name}] - Method finished`);
    } catch (error) {
      this.logger.error(`[${this.upsert.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async moveItems(moveItemsDto: MoveItemsDto): Promise<UpdatedStorages> {
    this.logger.log(`[${this.moveItems.name}] - Method start`);
    try {
      const { sourceStorageId, destinationStorageId } = moveItemsDto;
      const requestedReagentIds: number[] = moveItemsDto.reagents.map((reagent) => reagent.id);

      const [sourceStorage, destinationStorage] = await this.prisma.$transaction([
        this.prisma.storage.findUnique({
          where: {
            id: sourceStorageId,
          },
          include: {
            reagents: {
              where: {
                id: {
                  in: requestedReagentIds,
                },
              },
              select: {
                id: true,
              },
            },
          },
        }),

        this.prisma.storage.findUnique({
          where: {
            id: destinationStorageId,
          },
          select: {
            id: true,
          },
        }),
      ]);

      const errorMessages: string[] = [];

      if (!sourceStorage) {
        errorMessages.push(`Source storage with ID ${sourceStorageId} not found.`);
      }

      if (!destinationStorage) {
        errorMessages.push(`Destination storage with ID ${destinationStorageId} not found.`);
      }

      if (!sourceStorage || !destinationStorage) throw new NotFoundException(errorMessages.join(' '));

      const existingReagentIds = new Set(sourceStorage.reagents.map((reagent) => reagent.id));
      const missingIds: number[] = requestedReagentIds.filter((id) => !existingReagentIds.has(id));
      if (missingIds.length > 0) {
        this.logger.error(`[${this.moveItems.name}] - Exception thrown: invalid regent ids`);
        throw new NotFoundException(
          `The following reagent IDs: ${missingIds} not found in source storage id: ${sourceStorage.id}`,
        );
      }

      const updatedDestinationStorage: StorageWithReagents = await this.prisma.storage.update({
        where: {
          id: destinationStorageId,
        },
        data: {
          reagents: {
            connect: requestedReagentIds.map((id) => ({ id })),
          },
        },
        include: {
          reagents: true,
        },
      });

      const updatedSourceStorage: StorageWithReagents = (await this.prisma.storage.findUnique({
        where: {
          id: sourceStorageId,
        },
        include: {
          reagents: true,
        },
      }))!;

      this.logger.log(`[${this.moveItems.name}] - Method finished`);
      return { updatedDestinationStorage, updatedSourceStorage };
    } catch (error) {
      this.logger.error(`[${this.moveItems.name}] - Exception thrown: ` + error);
      throw error;
    }
  }

  private orderFactory(sortOptions: StorageSortOptions | undefined): OrderBy {
    this.logger.log(`[${this.orderFactory.name}] - Method start`);
    try {
      if (!sortOptions) return undefined;
      const orderBy: OrderBy = {};
      if (sortOptions.alphabeticalStorageName) {
        orderBy.name = sortOptions.alphabeticalStorageName;
      } else if (sortOptions.chronologicalDate) {
        orderBy.updatedAt = sortOptions.chronologicalDate;
      } else {
        orderBy.room = { name: sortOptions.alphabeticalRoomName };
      }
      this.logger.log(`[${this.orderFactory.name}] - Method finished`);
      return Object.keys(orderBy).length > 0 ? orderBy : undefined;
    } catch (error) {
      this.logger.error(`[${this.orderFactory.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }
}

const STORAGE_REPOSITORY_TOKEN = Symbol('STORAGE_REPOSITORY_TOKEN');
const StorageRepositoryProvider = {
  provide: STORAGE_REPOSITORY_TOKEN,
  useClass: StorageRepository,
};

export { STORAGE_REPOSITORY_TOKEN, StorageRepositoryProvider };
