import { ApiProperty } from '@nestjs/swagger';

export class TokenErrorResponseDto {
  @ApiProperty({ example: ['Token not found', 'Invalid token', 'Expired Token'] })
  message: string;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;

  @ApiProperty({ example: 401 })
  statusCode: number;
}
