import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Order } from '../types/storageOptions.type';
import { Transform } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';
import { Room } from '@prisma/client';

class GetStoragesQueryDto {
  @ApiProperty({ required: false, type: String, description: 'Full path of storage location' })
  @IsOptional()
  @IsString()
  fullPath?: string;

  @ApiProperty({ required: false, type: String, description: 'name of the room' })
  @IsOptional()
  @IsString()
  roomName?: string;

  @ApiProperty({ required: false, type: String, description: 'Name of the storage' })
  @IsOptional()
  @IsString()
  storageName?: string;

  @ApiProperty({ required: false, type: Number, description: 'Starting index for pagination', minimum: 0 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiProperty({ required: false, type: Number, description: 'Number of items to return', minimum: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  take?: number;

  @ApiProperty({ required: false, enum: Order, description: 'Order by chronological date (asc or desc)' })
  @IsOptional()
  @IsEnum(Order)
  chronologicalDate?: Order;

  @ApiProperty({ required: false, enum: Order, description: 'Order by alphabetical storage (asc or desc)' })
  @IsOptional()
  @IsEnum(Order)
  alphabeticalStorageName?: Order;

  @ApiProperty({ required: false, enum: Order, description: 'Order by alphabetical room (asc or desc)' })
  @IsOptional()
  @IsEnum(Order)
  alphabeticalRoomName?: Order;
}

class GetStorageSuccessDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 3 })
  roomId: number;

  @ApiProperty({ example: 'some name' })
  name: string;

  @ApiProperty({ example: 'Description for storage' })
  description: string;

  @ApiProperty({ example: '2024-10-11T09:04:23.426Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-10-11T09:04:23.426Z' })
  updatedAt: Date;

  @ApiProperty({ example: 10 })
  reagentCount: number;

  @ApiProperty({
    example: {
      id: 6,
      name: 'Unique name2',
      description: 'Description for storage',
    },
  })
  room: Room;
}

class GetStorageListResponseDto {
  @ApiProperty({
    type: [GetStorageSuccessDto],
    example: [
      {
        id: 155,
        roomId: 3,
        name: 'test2',
        description: null,
        createdAt: '2024-10-22T11:27:55.708Z',
        updatedAt: '2024-10-22T12:27:32.000Z',
        reagentCount: 99,
        room: {
          id: 3,
          name: 'Room3',
          description: null,
        },
      },
    ],
  })
  storages: GetStorageSuccessDto[];

  @ApiProperty({ example: 2 })
  size: number;
}

class GetStorageValidationErrorsDto {
  @ApiProperty({
    example: [
      'id must not be less than 1',
      'id must be an integer number',
      'roomId must not be less than 1',
      'roomId must be an integer number',
      'skip must not be less than 0',
      'skip must be an integer number',
      'take must not be less than 1',
      'take must be an integer number',
      'chronologicalDate must be one of the following values: asc, desc',
      'alphabeticalStorageName must be one of the following values: asc, desc',
      'alphabeticalRoomName must be one of the following values: asc, desc',
      'Only one of alphabeticalStorageName, alphabeticalRoomName or chronologicalDate must be provided',
    ],
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}

export { GetStorageSuccessDto, GetStoragesQueryDto, GetStorageValidationErrorsDto, GetStorageListResponseDto };
