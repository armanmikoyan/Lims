import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { IReagentRequest } from 'src/modules/reagentRequest/interfaces/reagentRequestEntity.interface';

export class ProcurementOfficerDashboardDto {
  @ApiProperty({ description: 'Request List sorted by newly created date' })
  requestList: IReagentRequest[];

  @ApiProperty({ description: 'Count by statuses' })
  requestByStatuses: (Prisma.PickEnumerable<Prisma.ReagentRequestGroupByOutputType, 'status'[]> & {
    _count: {
      id: number;
    };
  })[];
}

export class ProcurementOfficerDashboardQueryDto {
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
