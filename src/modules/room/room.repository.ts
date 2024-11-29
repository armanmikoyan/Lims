import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IRoomRepository } from './interfaces/roomRepository.interface';
import { Prisma, Room } from '@prisma/client';
import { CreateRoomDto } from './dto/createRoom.dto';
import { IdOnly, RoomWithStorageCount, RoomWithStorageCountObject, RoomWithStorages } from './types/room.type';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PartialWithRequiredId } from 'src/common/types/idRequired.type';

@Injectable()
export class RoomRepository implements IRoomRepository {
  private readonly logger: Logger = new Logger(RoomRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  findById(id: number): Promise<Room | null>; // base
  findById(id: number, includeStorages: true): Promise<RoomWithStorages | null>; // overload

  // implementation signature
  async findById(id: number, includeStorages: boolean = false): Promise<Room | RoomWithStorages | null> {
    this.logger.log(`[${this.findById.name}] - Method start`);
    try {
      const room: Room | null = await this.prisma.room.findUnique({
        where: {
          id,
        },
        include: {
          storages: includeStorages,
        },
      });
      this.logger.log(`[${this.findById.name}] - Method finished`);
      return room;
    } catch (error) {
      this.logger.error(`[${this.findById.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async findRoomIdByName(roomName: string): Promise<number | null> {
    this.logger.log(`[${this.findRoomIdByName.name}] - Method start`);
    try {
      const room = await this.prisma.room.findUnique({
        where: { name: roomName },
        select: { id: true },
      });
      this.logger.log(`[${this.findRoomIdByName.name}] - Method finished`);
      return room ? room.id : null;
    } catch (error) {
      this.logger.error(`[${this.findRoomIdByName.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async findRoomIdsBySubName(roomName: string): Promise<number[]> {
    this.logger.log(`[${this.findRoomIdsBySubName.name}] - Method start`);
    try {
      const rooms: IdOnly[] = await this.prisma.room.findMany({
        where: {
          name: {
            contains: roomName,
            mode: 'insensitive',
          },
        },
        select: { id: true },
      });
      this.logger.log(`[${this.findRoomIdsBySubName.name}] - Method finished`);
      const roomIds: number[] = rooms.map((room: Room) => room.id);
      return roomIds;
    } catch (error) {
      this.logger.error(`[${this.findRoomIdsBySubName.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async findRoomNameById(id: number): Promise<string | null> {
    this.logger.log(`[${this.findRoomNameById.name}] - Method start`);
    try {
      const room = await this.prisma.room.findUnique({
        where: { id },
        select: { name: true },
      });
      this.logger.log(`[${this.findRoomNameById.name}] - Method finished`);
      return room ? room.name : null;
    } catch (error) {
      this.logger.error(`[${this.findRoomNameById.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async findAll(): Promise<RoomWithStorageCount[]> {
    this.logger.log(`[${this.findAll.name}] - Method start`);
    try {
      const rooms: RoomWithStorageCountObject[] = await this.prisma.room.findMany({
        include: {
          _count: {
            select: {
              storages: true,
            },
          },
        },
      });

      const roomsWithStorageCount: RoomWithStorageCount[] = rooms.map(({ _count, ...room }) => ({
        ...room,
        storageCount: _count.storages,
      }));

      this.logger.log(`[${this.findAll.name}] - Method finished,`);
      return roomsWithStorageCount;
    } catch (error) {
      this.logger.error(`[${this.findAll.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async update(room: PartialWithRequiredId<Room>): Promise<Room> {
    this.logger.log(`[${this.update.name}] - Method start`);
    try {
      const updatedRoom: Room = await this.prisma.room.update({
        where: { id: room.id },
        data: room,
      });
      this.logger.log(`[${this.update.name}] - Method finished`);
      return updatedRoom;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        error = new ConflictException(`Room with name ${room.name} already exists`);
      }
      this.logger.error(`[${this.update.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async create(roomDto: CreateRoomDto): Promise<Room> {
    this.logger.log(`[${this.create.name}] - Method start`);
    try {
      const room: Room = await this.prisma.room.create({
        data: roomDto,
      });
      this.logger.log(`[${this.create.name}] - Method finished`);
      return room;
    } catch (error) {
      this.logger.error(`[${this.create.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async delete(id: number): Promise<Room> {
    this.logger.log(`[${this.delete.name}] - Method start`);
    try {
      const deletedRoom: Room = await this.prisma.room.delete({
        where: { id },
      });
      this.logger.log(`[${this.delete.name}] - Method finished`);
      return deletedRoom;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        error = new NotFoundException('Room Not Found');
      }
      this.logger.error(`[${this.delete.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async upsert(room: Room): Promise<void> {
    this.logger.log(`[${this.upsert.name}] - Method start`);
    try {
      await this.prisma.room.upsert({
        where: { id: room.id },
        update: {
          ...room,
        },
        create: {
          ...room,
        },
      });
      this.logger.log(`[${this.upsert.name}] - Method finished`);
    } catch (error) {
      this.logger.error(`[${this.upsert.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }
}

const ROOM_REPOSITORY_TOKEN = Symbol('ROOM_REPOSITORY_TOKEN');
const RoomRepositoryProvider = {
  provide: ROOM_REPOSITORY_TOKEN,
  useClass: RoomRepository,
};

export { ROOM_REPOSITORY_TOKEN, RoomRepositoryProvider };
