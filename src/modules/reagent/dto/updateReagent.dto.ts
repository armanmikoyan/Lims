import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReagentDto {
  @ApiProperty({ description: 'Edit left quantity of a Reagent', example: 100, required: false })
  @IsOptional()
  @IsInt()
  quantityLeft?: number;

  @ApiProperty({ description: 'Edit the the storage location by id', example: 2, required: false })
  @IsOptional()
  @IsInt()
  storageId?: number;
}

export class UpdateReagentSuccessDto {
  @ApiProperty({ example: 'Reagent A' })
  @IsString()
  name: string;

  @ApiProperty({ examples: ['Reagent', 'Sample'] })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({ example: 'Description of the reagent' })
  @IsString()
  description: string;

  @ApiProperty({ example: 5.5 })
  @IsNumber()
  quantityLeft: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  storageId: number;
}
