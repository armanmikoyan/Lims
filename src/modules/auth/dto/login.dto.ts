import { ApiProperty } from '@nestjs/swagger';

class LoginDto {
  @ApiProperty({ example: 'admin@elab.com' })
  email: string;

  @ApiProperty({ example: 'Admin_123' })
  password: string;
}

class LoginSuccessResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...(located inside cookie)' })
  refresh_token: string;
}

class LoginErrorResponseDto {
  @ApiProperty({ example: 'Invalid credentials/Email and password are required' })
  message: string;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;

  @ApiProperty({ example: 401 })
  statusCode: number;
}

export { LoginDto, LoginSuccessResponseDto, LoginErrorResponseDto };
