import { HttpStatus } from '@nestjs/common';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ReagentRequest, Status } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';

class ReagentIdsDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;
}

class CreateOrderDto {
  @ApiProperty({ example: 'title' })
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'oriflame' })
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  seller: string;

  @ApiProperty({ example: [{ id: 1 }, { id: 2 }, { id: 3 }] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReagentIdsDto)
  reagents: ReagentIdsDto[];

  @ApiHideProperty()
  @Exclude()
  status: Status = Status.Pending;
}

class CreateOrderSuccessDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  userId: number;

  @ApiProperty({ example: 'title' })
  title: string;

  @ApiProperty({ example: 'seller' })
  seller: string;

  @ApiProperty({ example: Status.Pending })
  status: Status;

  @ApiProperty({ example: '2024-10-29T11:19:04.248Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-10-29T11:19:04.248Z' })
  updatedAt: Date;

  @ApiProperty({
    example: [
      {
        id: 1,
        userId: 1,
        name: 'Reagent A',
        structureSmiles: 'CO',
        casNumber: '123-45-67',
        desiredQuantity: 12.1,
        quantityUnit: '121212',
        userComments: 'Commenting here...',
        procurementComments: null,
        status: 'Pending',
        createdAt: '2024-10-29T10:56:20.529Z',
        updatedAt: '2024-10-29T11:19:04.248Z',
        orderId: 12,
      },
    ],
  })
  reagents: ReagentRequest[];
}

class CreateOrderBadRequestDto {
  @ApiProperty({
    example: [
      'title must be shorter than or equal to 200 characters',
      'seller must be shorter than or equal to 200 characters',
      'reagents must be an array',
      'title should not be empty',
      'seller should not be empty',
      'reagents should not be empty',
      'reagents must be an array',
      'reagents[n].id must be an integer number',
    ],
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}

class CreateOrderConflictErrorDto {
  @ApiProperty({
    example: [
      '1: Order with id 48 includes reagentRequests with ids - 2 which has status Ordered',
      '2: Order with id 51 includes reagentRequests with ids - 1 which has status Ordered',
      '3: Order with id 52 includes reagentRequests with ids - 3 which has status Ordered',
    ],
  })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;

  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;
}

class CreateOrderNotFoundDto {
  @ApiProperty({ example: "The following reagent with ID's not found: 1, 2, 3" })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;
}

export {
  CreateOrderDto,
  CreateOrderSuccessDto,
  CreateOrderBadRequestDto,
  CreateOrderNotFoundDto,
  ReagentIdsDto,
  CreateOrderConflictErrorDto,
};
