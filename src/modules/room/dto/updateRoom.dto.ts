import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class UpdateRoomDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'new unique name' })
  name?: string | undefined;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Description for Room' })
  description?: string | undefined;
}

class UpdateRoomSuccessDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 'Updated name' })
  name: string;

  @ApiProperty({ example: 'Updated Description' })
  description: string;
}

class UpdateRoomConflictErrorDto {
  @ApiProperty({
    example: 'Room with this name in already exists',
  })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;

  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;
}

class UpdateRoomNotFoundErrorDto {
  @ApiProperty({
    example: 'Room Not Found',
  })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;
}

class UpdateRoomValidationErrorDto {
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
  UpdateRoomDto,
  UpdateRoomSuccessDto,
  UpdateRoomConflictErrorDto,
  UpdateRoomNotFoundErrorDto,
  UpdateRoomValidationErrorDto,
};
