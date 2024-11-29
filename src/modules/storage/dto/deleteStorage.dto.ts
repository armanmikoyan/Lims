import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

class DeleteStorageSuccessDto {
  @ApiProperty({ example: 'Storage Successfully deleted' })
  message: number;
  @ApiProperty({ example: 200 })
  code: number;
}

class DeleteStorageNotFoundErrorDto {
  @ApiProperty({
    example: 'Storage Not Found',
  })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;
}

class DeleteStorageConflictErrorDto {
  @ApiProperty({
    example: 'Cannot delete storage because it has associated reagents.',
  })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;

  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;
}

export { DeleteStorageSuccessDto, DeleteStorageNotFoundErrorDto, DeleteStorageConflictErrorDto };
