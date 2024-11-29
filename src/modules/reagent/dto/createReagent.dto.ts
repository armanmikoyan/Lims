import { ApiProperty } from '@nestjs/swagger';
import { Category, Package } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReagentDto {
  @ApiProperty({ example: 'Reagent A' })
  @IsString()
  name: string;

  @ApiProperty({ example: '58-08-2', required: false })
  @IsOptional()
  @IsString()
  casNumber?: string;

  @ApiProperty({ example: 'Producer Name', required: false })
  @IsOptional()
  @IsString()
  producer: string;

  @ApiProperty({ example: 'CATALOG001', required: false })
  @IsOptional()
  @IsString()
  catalogId: string;

  @ApiProperty({ example: 'https://e-shop.com/catalog', required: false })
  @IsOptional()
  @IsString()
  catalogLink: string;

  @ApiProperty({ example: 234, required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  pricePerUnit: number;

  @ApiProperty({ example: 'ml' })
  @IsString()
  quantityUnit: string;

  @ApiProperty({ example: 5.5 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  totalQuantity: number;

  @ApiProperty({ example: 'A sample reagent', required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 0 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  quantityLeft: number;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expirationDate: Date;

  @ApiProperty({ example: 2 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  storageId: number;

  @ApiProperty({ example: 'Cc1nc(C)c(C(=O)N/N=C/c2cccnc2)cc1C(=O)N/N=C/c1cccnc1', required: false })
  @IsOptional()
  @IsString()
  structure?: string;

  @ApiProperty({ enum: Package, description: 'Package (enum) is either Bottle or SolventsBox or PackageBox', required: false })
  @IsOptional()
  @IsEnum(Package)
  package: Package;
}

export class CreateReagentSuccessDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Reagent A' })
  @IsString()
  name: string;

  @ApiProperty({ example: '58-08-2' })
  @IsString()
  casNumber?: string | null;

  @ApiProperty({ example: 'Producer Name' })
  @IsString()
  producer: string;

  @ApiProperty({ example: 'CATALOG001' })
  @IsString()
  catalogId: string;

  @ApiProperty({ example: 'https://e-shop.com/catalog' })
  @IsString()
  catalogLink: string;

  @ApiProperty({ example: 234 })
  @IsNumber()
  pricePerUnit: number;

  @ApiProperty({ example: 'ml' })
  @IsString()
  quantityUnit: string;

  @ApiProperty({ example: 5.5 })
  @IsString()
  totalQuantity: number;

  @ApiProperty({ example: 'A sample reagent' })
  @IsString()
  description: string | null;

  @ApiProperty({ example: 0 })
  @IsNumber()
  quantityLeft: number;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDate()
  expirationDate: Date;

  @ApiProperty({ example: 2 })
  @IsString()
  storageId: number;

  @ApiProperty({ enum: Category, description: 'Category is either Reagent or Sample' })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({ examples: ['Cc1nc(C)c(C(=O)N/N=C/c2cccnc2)cc1C(=O)N/N=C/c1cccnc1', null] })
  structure: string | null;

  @ApiProperty({ enum: Package, description: 'Package (enum) is either Bottle or SolventsBox or PackageBox' })
  @IsEnum(Package)
  package: Package | null;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDate()
  updatedAt: Date;
}
