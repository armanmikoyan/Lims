import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsPositive, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { ReagentIdsDto } from 'src/modules/order/dto/createOrder.dto';
import { StorageWithReagents } from '../types/storage.types';
import { HttpStatus } from '@nestjs/common';

class MoveItemsDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsPositive()
  sourceStorageId: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsPositive()
  destinationStorageId: number;

  @ApiProperty({ example: [{ id: 1 }, { id: 2 }, { id: 3 }] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReagentIdsDto)
  reagents: ReagentIdsDto[];
}

class MoveItemsSuccessDto {
  @ApiProperty({
    example: {
      id: 1,
      roomId: 1,
      name: 'Cabinet1-Shelf1',
      description: 'Description for Cabinet1-Shelf1',
      createdAt: '2024-10-29T10:43:20.067Z',
      updatedAt: '2024-10-29T10:43:20.067Z',
      reagents: [
        {
          id: 1,
          name: 'Reagent A',
          casNumber: '58-08-2',
          producer: 'Producer Name',
          catalogId: 'CATALOG001',
          catalogLink: 'https://e-shop.com/catalog',
          pricePerUnit: 234,
          quantityUnit: 'ml',
          totalQuantity: 5.5,
          description: 'A sample reagent',
          quantityLeft: 0,
          expirationDate: '2024-12-31T23:59:59.000Z',
          storageId: 2,
          category: 'Reagent',
          structure: 'Cc1nc(C)c(C(=O)N/N=C/c2cccnc2)cc1C(=O)N/N=C/c1cccnc1',
          package: 'Bottle',
          isDeleted: false,
          createdAt: '2024-10-30T10:57:06.401Z',
          updatedAt: '2024-10-30T14:40:14.102Z',
        },
      ],
    },
  })
  updatedSourceStorage: StorageWithReagents;

  @ApiProperty({
    example: {
      id: 2,
      roomId: 1,
      name: 'Cabinet1-Shelf1',
      description: 'Description for Cabinet1-Shelf1',
      createdAt: '2024-10-29T10:43:20.067Z',
      updatedAt: '2024-10-29T10:43:20.067Z',
      reagents: [
        {
          id: 1,
          name: 'Reagent A',
          casNumber: '58-08-2',
          producer: 'Producer Name',
          catalogId: 'CATALOG001',
          catalogLink: 'https://e-shop.com/catalog',
          pricePerUnit: 234,
          quantityUnit: 'ml',
          totalQuantity: 5.5,
          description: 'A sample reagent',
          quantityLeft: 0,
          expirationDate: '2024-12-31T23:59:59.000Z',
          storageId: 2,
          category: 'Reagent',
          structure: 'Cc1nc(C)c(C(=O)N/N=C/c2cccnc2)cc1C(=O)N/N=C/c1cccnc1',
          package: 'Bottle',
          isDeleted: false,
          createdAt: '2024-10-30T10:57:06.401Z',
          updatedAt: '2024-10-30T14:40:14.102Z',
        },
      ],
    },
  })
  updatedDestionationStorage: StorageWithReagents;
}

class MoveItemsValidationErrorsDto {
  @ApiProperty({
    example: [
      'sourceStorageId must be a positive number',
      'sourceStorageId should not be empty',
      'destinationStorageId must be a positive number',
      'destinationStorageId should not be empty',
      'reagents should not be empty',
      'reagents must be an array',
      'reagents[N].id must be an integer number',
      'reagents.each value in nested property reagents must be either object or array',
    ],
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}

class MoveItemsConflictErrorDto {
  @ApiProperty({
    example: "Source and destination storages can't be the same",
  })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;

  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;
}

class MoveItemsNotFoundErrorDto {
  @ApiProperty({
    example: [
      'The following reagent IDs: 1, 2, 3 not found in source storage id: 2',
      'Source storage with ID 3 not found',
      'Destination storage with ID 3 not found',
    ],
  })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;
}

export { MoveItemsDto, MoveItemsSuccessDto, MoveItemsValidationErrorsDto, MoveItemsConflictErrorDto, MoveItemsNotFoundErrorDto };
