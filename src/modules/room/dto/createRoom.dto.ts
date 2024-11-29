import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class CreateRoomDto {
  @ApiProperty({ example: 'Unique name' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Description for storage' })
  description?: string | null;
}

class CreateRoomSuccessDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 'Room name' })
  name: string;

  @ApiProperty({ example: 'Description for storage' })
  description: string;
}

class CreateRoomConflictErrorDto {
  @ApiProperty({
    example: 'Room with this name in already exists',
  })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;

  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;
}

class CreateRoomValidationErrorDto {
  @ApiProperty({
    example: 'name must be a string',
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}

export { CreateRoomDto, CreateRoomSuccessDto, CreateRoomValidationErrorDto, CreateRoomConflictErrorDto };
