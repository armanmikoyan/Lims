import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { IReagent } from 'src/modules/reagent/interfaces/reagentEntity.interface';

export class ResearcherDashboardDto {
  @ApiProperty({ description: 'Number of Reagents and Samples' })
  reagentsVsSampleNumber: (Prisma.PickEnumerable<Prisma.ReagentGroupByOutputType, 'category'[]> & {
    _count: {
      id: number;
    };
  })[];

  @ApiProperty({ description: 'Number of Reagents and Samples - Expired' })
  reagentsVsSampleExpiredNumber: (Prisma.PickEnumerable<Prisma.ReagentGroupByOutputType, 'category'[]> & {
    _count: {
      expirationDate: number;
    };
  })[];

  @ApiProperty({ description: 'Number of Reagents and Samples - Empty' })
  reagentsVsSampleEmptyNumber: (Prisma.PickEnumerable<Prisma.ReagentGroupByOutputType, 'category'[]> & {
    _count: {
      expirationDate: number;
    };
  })[];

  @ApiProperty({ description: 'List of Reagents and Samples - Expired or near to expiration' })
  expiredList: IReagent[];

  @ApiProperty({ description: 'List of Reagents and Samples - Empty or equal or less than a half of TotalQuantity' })
  emptyList: IReagent[];
}

export class ResearcherDashboardQueryDto {
  @ApiProperty({ description: 'year, ex. 2024', required: false })
  @Transform((value) => Number(value))
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiProperty({ description: 'month, ex. 11', required: false })
  @Transform((value) => Number(value))
  @IsOptional()
  @IsNumber()
  month?: number;
}
