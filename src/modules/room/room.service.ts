import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ROOM_REPOSITORY_TOKEN } from './room.repository';
import { IRoomRepository } from './interfaces/roomRepository.interface';
import { IRoomService } from './interfaces/roomService.interface';
import { Room } from '@prisma/client';
import { RoomWithStorageCount, RoomWithStorages } from './types/room.type';
import { UpdateRoomDto } from './dto/updateRoom.dto';

@Injectable()
export class RoomService implements IRoomService {
  private readonly logger: Logger = new Logger(RoomService.name);

  constructor(@Inject(ROOM_REPOSITORY_TOKEN) private roomRepository: IRoomRepository) {}

  async getRooms(): Promise<RoomWithStorageCount[]> {
    this.logger.log(`[${this.getRooms.name}] - Method start`);
    try {
      const rooms: RoomWithStorageCount[] = await this.roomRepository.findAll();
      this.logger.log(`[${this.getRooms.name}] - Method finished`);
      return rooms;
    } catch (error) {
      this.logger.error(`[${this.getRooms.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async getRoomNameById(id: number): Promise<string | null> {
    this.logger.log(`[${this.getRoomNameById.name}] - Method start`);
    try {
      const roomName: string | null = await this.roomRepository.findRoomNameById(id);
      this.logger.log(`[${this.getRoomNameById.name}] - Method finished`);
      return roomName;
    } catch (error) {
      this.logger.error(`[${this.getRoomNameById.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async getRoomIdByName(roomName: string): Promise<number | null> {
    this.logger.log(`[${this.getRoomIdByName.name}] - Method start`);
    try {
      const roomId: number | null = await this.roomRepository.findRoomIdByName(roomName);
      this.logger.log(`[${this.getRoomIdByName.name}] - Method finished`);
      return roomId;
    } catch (error) {
      this.logger.error(`[${this.getRoomIdByName.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async getRoomIdsBySubName(roomName: string): Promise<number[]> {
    this.logger.log(`[${this.getRoomIdsBySubName.name}] - Method start`);
    try {
      const roomIds: number[] = await this.roomRepository.findRoomIdsBySubName(roomName);
      this.logger.log(`[${this.getRoomIdsBySubName.name}] - Method finished`);
      return roomIds;
    } catch (error) {
      this.logger.error(`[${this.getRoomIdsBySubName.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async createRoom(roomDto: Room): Promise<Room> {
    this.logger.log(`[${this.createRoom.name}] - Method start`);
    try {
      const roomExists = await this.roomRepository.findRoomIdByName(roomDto.name);
      if (roomExists) throw new ConflictException(`Room with name ${roomDto.name} already exists`);

      const room: Room = await this.roomRepository.create(roomDto);
      this.logger.log(`[${this.createRoom.name}] - Method finished`);
      return room;
    } catch (error) {
      this.logger.error(`[${this.createRoom.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`[${this.delete.name}] - Method start`);
    try {
      const room: RoomWithStorages | null = await this.roomRepository.findById(id, true);
      if (!room) throw new NotFoundException('Room Not Found');
      if (room.storages.length !== 0) {
        throw new ConflictException('Cannot delete Room because it has associated storage locations.');
      }

      await this.roomRepository.delete(id);
      this.logger.log(`[${this.delete.name}] - Method finished`);
    } catch (error) {
      this.logger.error(`[${this.delete.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }

  async update(id: number, roomDto: UpdateRoomDto): Promise<Room> {
    this.logger.log(`[${this.update.name}] - Method start`);
    try {
      let room: Room | null = await this.roomRepository.findById(id);
      if (!room) throw new NotFoundException('Room Not Found');

      room = await this.roomRepository.update({ id, ...roomDto });

      this.logger.log(`[${this.update.name}] - Method finished`);
      return room;
    } catch (error) {
      this.logger.error(`[${this.update.name}] - Exception thrown: ${error}`);
      throw error;
    }
  }
}

const ROOM_SERVICE_TOKEN = Symbol('ROOM_SERVICE_TOKEN');
const RoomServiceProvider = {
  provide: ROOM_SERVICE_TOKEN,
  useClass: RoomService,
};

export { ROOM_SERVICE_TOKEN, RoomServiceProvider };
