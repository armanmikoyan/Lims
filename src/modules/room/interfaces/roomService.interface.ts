import { Room } from '@prisma/client';
import { CreateRoomDto } from '../dto/createRoom.dto';
import { UpdateRoomDto } from '../dto/updateRoom.dto';
import { RoomWithStorageCount } from '../types/room.type';

export interface IRoomService {
  getRoomNameById(id: number): Promise<string | null>;
  getRoomIdsBySubName(roomName: string): Promise<number[]>;
  getRoomIdByName(roomName: string): Promise<number | null>;
  createRoom(room: CreateRoomDto): Promise<Room>;
  delete(id: number): Promise<void>;
  update(id: number, roomDto: UpdateRoomDto): Promise<Room>;
  getRooms(): Promise<RoomWithStorageCount[]>;
}
