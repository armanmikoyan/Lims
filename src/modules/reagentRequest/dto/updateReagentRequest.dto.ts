import { ApiProperty } from '@nestjs/swagger';
import { Package, Status } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReagentRequestDto {
  @ApiProperty({ enum: Status, description: 'Changing the status of Reagent Request', required: false })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({ description: 'Adding the comments by Procurement Officer', required: false })
  @IsString()
  @IsOptional()
  procurementComments?: string;

  @ApiProperty({ description: 'Adding the comments by Procurement Officer', required: false })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  desiredQuantity?: number;

  @ApiProperty({ description: 'Adding the comments by Procurement Officer', required: false })
  @IsEnum(Package)
  @IsOptional()
  package?: Package;
}

export class UpdateReagentRequestSuccessDto {
  @ApiProperty({ description: 'Name of the Reagent Request' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Id of the user who creted the Reagent Request' })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 500, description: 'desired Quantity of the Requested Reagent in number, e.g. 500' })
  @IsNumber()
  desiredQuantity: number;

  @ApiProperty({ example: 'ml', description: 'Quantity Unit of the Requested Reagent in string, e.g. 500 ml' })
  @IsString()
  quantityUnit: string;

  @ApiProperty({ description: 'Structure of the Requested Reagent' })
  @IsString()
  structureSmiles?: string | null;

  @ApiProperty({ description: 'CAS Number of the Requested Reagent' })
  @IsString()
  casNumber?: string | null;

  @ApiProperty({ description: 'User comments on the Reagent Request' })
  @IsString()
  userComments?: string | null;

  @ApiProperty({ description: 'Procurement comments on the Reagent Request' })
  @IsString()
  procurementComments?: string | null;

  @ApiProperty({ enum: Status, description: 'Status of the Reagent Request' })
  @IsEnum(Status)
  status: Status;

  @ApiProperty({ description: 'Created date of the Reagent Request' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Created date of the Reagent Request' })
  @IsDate()
  updatedAt: Date;
}
