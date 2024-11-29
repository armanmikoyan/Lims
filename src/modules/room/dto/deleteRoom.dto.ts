import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

class DeleteRoomSuccessDto {
  @ApiProperty({ example: 'Storage Successfully deleted' })
  message: number;
  @ApiProperty({ example: 200 })
  code: number;
}

class DeleteRoomNotFoundErrorDto {
  @ApiProperty({
    example: 'Room Not Found',
  })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;
}

class DeleteRoomConflictErrorDto {
  @ApiProperty({
    example: 'Cannot delete storage because it has associated storage locations.',
  })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;

  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;
}

export { DeleteRoomSuccessDto, DeleteRoomNotFoundErrorDto, DeleteRoomConflictErrorDto };
