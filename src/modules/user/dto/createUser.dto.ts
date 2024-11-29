import { Role } from '@prisma/client';
import { IUser } from '../interfaces/userEntity.interface';
import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateUserDto implements Omit<IUser, 'password'> {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({ example: 'Arman' })
  @IsString()
  @Matches(/^[A-Z].*/, { message: 'firstName must start with an uppercase letter' })
  firstName: string;

  @ApiProperty({ example: 'Mikoyan' })
  @IsString()
  @Matches(/^[A-Z].*/, { message: 'lastName must start with an uppercase letter' })
  lastName: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}

class CreateUserSuccessDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({ example: 'Arman' })
  firstName: string;

  @ApiProperty({ example: 'Mikoyan' })
  lastName: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ example: true })
  isPasswordResetRequired: boolean;
}

class CreateUserErrorDto {
  @ApiProperty({ example: 'User with this email already exists' })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;

  @ApiProperty({ example: 409 })
  statusCode: number;
}

class CreateUserValidationErrorDto {
  @ApiProperty({
    example: [
      'Invalid email address',
      'Password must be at least 8 characters long',
      'Password must be a string',
      'role must be one of the following values: Admin, ProcurementOfficer, Researcher',
    ],
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}

export { CreateUserDto, CreateUserErrorDto, CreateUserValidationErrorDto, CreateUserSuccessDto };
