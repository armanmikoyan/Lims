import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AdminDashboardDto {
  @ApiProperty({ description: 'The number of rooms', example: 4 })
  roomNumber: number;

  @ApiProperty({ description: 'The number of storages', example: 5 })
  storageNumber: number;

  @ApiProperty({ description: 'The number of users', example: 16 })
  userNumber: number;

  @ApiProperty({ description: 'The number of storages in each room' })
  storageNumberInRoom: {
    roomId: number;
    _count: {
      id: number;
    };
  }[];

  @ApiProperty({ description: 'The number of users in each role' })
  userNumberInRoles: {
    role: Role;
    _count: {
      id: number;
    };
  }[];
}
