import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Old password',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'New password',
  })
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)/, {
    message: 'New password must contain at least one number!',
  })
  newPassword: string;
}
