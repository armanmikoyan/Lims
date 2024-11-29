import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@gmail.com',
  })
  @IsEmail()
  email: string;
}
