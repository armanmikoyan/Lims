import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ParseIdPipeErrorDto {
  @ApiProperty({ example: ['Invalid value for "id" is not a valid integer', 'Value is required.'] })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}
