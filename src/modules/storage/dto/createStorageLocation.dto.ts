import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateStorageLocationsDto {
  @ApiProperty({ example: 'Room1' })
  @IsNotEmpty()
  @IsString()
  roomName: string;

  @ApiProperty({ example: 'StorageName' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Description for storage' })
  description?: string | null;
}

class CreateStorageConflictErrorDto {
  @ApiProperty({
    example: ['Storage with this name in Room{n} already exists'],
  })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;

  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;
}

class CreateStorageNotFoundErrorDto {
  @ApiProperty({
    example: "Room - Doesn't exists",
  })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;
}

class CreateStorageValidationErrorDto {
  @ApiProperty({
    example: ['roomName must be a string', 'name must be a string', 'name should not be empty', 'roomName should not be empty'],
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}

export {
  CreateStorageLocationsDto,
  CreateStorageConflictErrorDto,
  CreateStorageValidationErrorDto,
  CreateStorageNotFoundErrorDto,
};
