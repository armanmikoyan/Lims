import { ApiProperty } from '@nestjs/swagger';

class LogoutSuccessResponseDto {
  @ApiProperty({ example: 'Logged out successfully' })
  message: string;
}

class LogoutErrorResponseDto {
  @ApiProperty({ example: 'Session not found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: 404 })
  statusCode: number;
}

export { LogoutSuccessResponseDto, LogoutErrorResponseDto };
