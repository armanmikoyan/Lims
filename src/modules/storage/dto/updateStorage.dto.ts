import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class UpdateStroageDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'new unique name' })
  name?: string | undefined;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Description for storage' })
  description?: string | undefined;
}

class UpdateStroageSuccessDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 1 })
  roomId: number;

  @ApiProperty({ example: 'Updated name' })
  name: string;

  @ApiProperty({ example: 'Updated Description' })
  description: string;

  @ApiProperty({ example: '2024-10-18T12:57:35.834Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-10-23T17:09:00.204Z' })
  updatedAt: string;
}

class UpdateStorageConflictErrorDto {
  @ApiProperty({
    example: 'Storage with this name already exists in this room',
  })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;

  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;
}

class UpdateStorageNotFoundErrorDto {
  @ApiProperty({
    example: 'Storage Not Found',
  })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;
}

class UpdateStorageValidationErrorDto {
  @ApiProperty({
    example: [
      'description must be a string',
      'name must be a string',
      'Invalid value for "id" is not a valid integer',
      'Value is required',
    ],
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}

export {
  UpdateStroageDto,
  UpdateStroageSuccessDto,
  UpdateStorageConflictErrorDto,
  UpdateStorageNotFoundErrorDto,
  UpdateStorageValidationErrorDto,
};
