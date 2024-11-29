import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Order } from '../types/orderOptions.type';
import { OrderWithReagentCount } from '../types/order.type';
import { HttpStatus } from '@nestjs/common';
import { Status } from '@prisma/client';
import { GetReagentRequestSuccessDto } from 'src/modules/reagentRequest/dto/getReagentRequest.dto';

class GetOrdersQueryDto {
  @ApiProperty({ required: false, type: String, description: 'title of the order' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, type: String, description: 'Name of the seller' })
  @IsOptional()
  @IsString()
  seller?: string;

  @ApiProperty({ required: false, enum: Status, description: 'Status of order' })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({ required: false, type: Number, description: 'Starting index for pagination', minimum: 0 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiProperty({ required: false, type: Number, description: 'Number of items to return', minimum: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  take?: number;

  @ApiProperty({ required: false, enum: Order, description: 'Order by chronological date updatedAt (asc or desc)' })
  @IsOptional()
  @IsEnum(Order)
  updatedAt?: Order;

  @ApiProperty({ required: false, enum: Order, description: 'Order by chronological date createddAt (asc or desc)' })
  @IsOptional()
  @IsEnum(Order)
  createdAt?: Order;

  @ApiProperty({ required: false, enum: Order, description: 'Order by alphabedical date title (asc or desc)' })
  @IsOptional()
  @IsEnum(Order)
  titleOrder?: Order;

  @ApiProperty({ required: false, enum: Order, description: 'Order by alphabedical date seller (asc or desc)' })
  @IsOptional()
  @IsEnum(Order)
  sellerOrder?: Order;
}

class GetOrderListResponseDto {
  @ApiProperty({
    example: [
      {
        id: 19,
        userId: 3,
        title: 'title',
        seller: 'Oriflame',
        status: 'Pending',
        createdAt: '2024-10-29T11:39:54.455Z',
        updatedAt: '2024-10-31T13:48:19.996Z',
        reagents: [
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
            updatedAt: '2024-10-29T13:25:13.528Z',
            orderId: 25,
          },
        ],
        reagentCount: 1,
      },
    ],
  })
  orders: OrderWithReagentCount[];

  @ApiProperty({ example: 2 })
  size: number;
}

class GetOneOrderResponseDto {
  @ApiProperty({ example: 19 })
  id: number;

  @ApiProperty({ example: 3 })
  userId: number;

  @ApiProperty({ example: 'title' })
  title: string;

  @ApiProperty({ example: 'Oriflame' })
  seller: string;

  @ApiProperty({ example: 'Pending' })
  status: Status;

  @ApiProperty({ example: '2024-10-29T11:39:54.455Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-10-31T13:48:19.996Z' })
  updatedAt: string;

  @ApiProperty({ type: [GetReagentRequestSuccessDto] })
  reagents: GetReagentRequestSuccessDto[];
}

class GetOrderValidationErrorsDto {
  @ApiProperty({
    example: [
      'skip must not be less than 0',
      'skip must be an integer number',
      'take must not be less than 1',
      'take must be an integer number',
      'Only one of "updatedAt", "createdAt", "titleOrder", or "sellerOrder" can be provided, or none.',
      'seller must be shorter than or equal to 200 characters',
      'title must be shorter than or equal to 200 characters',
    ],
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}

export { GetOrdersQueryDto, GetOrderListResponseDto, GetOrderValidationErrorsDto, GetOneOrderResponseDto };
