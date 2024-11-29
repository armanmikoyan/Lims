import { Role } from '@prisma/client';
import { UserPayload } from '../interfaces/userEntity.interface';
import { ApiProperty } from '@nestjs/swagger';

class GetUserSuccessDto implements UserPayload {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Arman' })
  firstName: string;

  @ApiProperty({ example: 'Mikoyan' })
  lastName: string;

  @ApiProperty({ example: 'mockEmail@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Admin' })
  role: Role;

  @ApiProperty({ example: true })
  isPasswordResetRequired: boolean;
}

class GetUserErrorDto {
  @ApiProperty({ example: 'User not found' })
  message: number;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: 404 })
  statusCode: number;
}

export { GetUserSuccessDto, GetUserErrorDto };
