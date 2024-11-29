import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'New password',
  })
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)/, {
    message: 'New password must contain at least one number!',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirm password',
  })
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)/, {
    message: 'New password must contain at least one number!',
  })
  confirmPassword: string;
}
