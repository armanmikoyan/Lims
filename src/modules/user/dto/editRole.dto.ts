import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserPayload } from '../interfaces/userEntity.interface';

class EditUserRoleDto {
  @ApiProperty({ example: 'Admin' })
  @IsEnum(Role)
  role: Role;
}

class EditUserRoleSuccessResponseDto implements UserPayload {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Arman' })
  firstName: string;

  @ApiProperty({ example: 'Mikoyan' })
  lastName: string;

  @ApiProperty({ example: 'admin@elab.com' })
  email: string;

  @ApiProperty({ example: 'Admin' })
  role: Role;
}

class EditUserRoleErrorResponseDto {
  @ApiProperty({ example: 'User not found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: 404 })
  statusCode: number;
}

export { EditUserRoleDto, EditUserRoleSuccessResponseDto, EditUserRoleErrorResponseDto };
