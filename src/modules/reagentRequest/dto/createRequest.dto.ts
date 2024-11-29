import { ApiProperty } from '@nestjs/swagger';
import { Package, Status } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ example: 'Reagent A' })
  @IsString()
  name: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  desiredQuantity: number;

  @ApiProperty({ example: 'ml' })
  @IsString()
  quantityUnit: string;

  @ApiProperty({ example: 'CO' })
  @IsOptional()
  @IsString()
  structureSmiles?: string;

  @ApiProperty({ example: '123-45-67' })
  @IsOptional()
  @IsString()
  casNumber?: string;

  @ApiProperty({ example: 'Commenting here...' })
  @IsOptional()
  @IsString()
  userComments?: string;

  @ApiProperty({ enum: Package, description: 'Package (enum) is either Bottle or SolventsBox or PackageBox' })
  @IsOptional()
  @IsEnum(Package)
  package: Package;

  @ApiProperty({ example: 'producer' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === undefined ? null : value))
  producer: string | null;

  @ApiProperty({ example: 'CATALOG001', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === undefined ? null : value))
  catalogId: string | null;

  @ApiProperty({ example: 'https://e-shop.com/catalog', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === undefined ? null : value))
  catalogLink: string | null;

  @ApiProperty({ example: 234, required: false })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? null : Number(value)))
  @IsNumber()
  pricePerUnit: number | null;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', required: false })
  @IsOptional()
  @Type(() => Date)
  @Transform(({ value }) => (value === undefined ? null : new Date(value)))
  @IsDate()
  expirationDate: Date | null;

  @ApiProperty({ example: 'false' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? false : value))
  @IsBoolean()
  hide: boolean;
}

export class CreateRequestSuccessDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Reagent A' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  desiredQuantity: number;

  @ApiProperty({ example: 'ml' })
  @IsString()
  quantityUnit: string;

  @ApiProperty({ examples: ['CO'] })
  @IsString()
  structureSmiles: string | null;

  @ApiProperty({ examples: ['123-45-67'] })
  @IsString()
  casNumber: string | null;

  @ApiProperty({ examples: ['Commenting here...'] })
  userComments: string | null;

  @ApiProperty()
  procurementComments: string | null;

  @ApiProperty({ enum: Status, description: 'Returns status: Pending' })
  status: Status;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ enum: Package, description: 'Package (enum) is either Bottle or SolventsBox or PackageBox' })
  @IsEnum(Package)
  package: Package | null;

  @ApiProperty({ example: 'producer' })
  producer: string | null;

  @ApiProperty({ example: 'CATALOG001' })
  catalogId: string | null;

  @ApiProperty({ example: 'https://e-shop.com/catalog' })
  catalogLink: string | null;

  @ApiProperty({ example: 234, required: false })
  pricePerUnit: number | null;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  expirationDate: Date | null;
}
