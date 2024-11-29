import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

class CreateReagentValidationErrorDto {
  @ApiProperty({
    example: ['storageId should not be empty', 'storageId must be a positive number'],
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}

class ReagentNotFoundErrorDto {
  @ApiProperty({ example: 'Reagent request is not found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;
}
export { CreateReagentValidationErrorDto, ReagentNotFoundErrorDto };
