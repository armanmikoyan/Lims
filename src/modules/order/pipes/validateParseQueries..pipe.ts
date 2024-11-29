import { Injectable, PipeTransform, BadRequestException, HttpStatus } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { OrdereOptions, OrderFilterOptions, OrderPaginationOptions, OrderSortOptions } from '../types/orderOptions.type';
import { GetOrdersQueryDto } from '../dto/getOrder.dto';

@Injectable()
export class ValidateParseOrderOptionsPipe implements PipeTransform {
  async transform(queries: any): Promise<OrdereOptions> {
    const queryDto = plainToClass(GetOrdersQueryDto, queries);

    const errors: ValidationError[] = await validate(queryDto);

    if (errors.length > 0) {
      const messages: string[] = [];

      errors.forEach((error: ValidationError) => {
        if (error.constraints) {
          Object.values(error.constraints).forEach((constraintMessage) => {
            messages.push(constraintMessage);
          });
        }
      });

      throw new BadRequestException({
        message: messages,
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      });
    }

    const providedSortOptions: (string | undefined)[] = [
      queryDto.updatedAt,
      queryDto.createdAt,
      queryDto.titleOrder,
      queryDto.sellerOrder,
    ].filter(Boolean);

    if (providedSortOptions.length > 1) {
      throw new BadRequestException({
        message: 'Only one of "updatedAt", "createdAt", "titleOrder", or "sellerOrder" can be provided, or none.',
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      });
    }

    const filters: OrderFilterOptions = {
      title: queryDto.title,
      seller: queryDto.seller,
      status: queryDto.status,
    };

    const sorts: OrderSortOptions = {
      chronologicalDate: {
        updatedAt: queryDto.updatedAt,
        createdAt: queryDto.createdAt,
      },
      alphabetical: {
        title: queryDto.titleOrder,
        seller: queryDto.sellerOrder,
      },
    };

    const paginations: OrderPaginationOptions = {
      skip: queryDto.skip,
      take: queryDto.take,
    };

    const options: OrdereOptions = {
      filter: filters,
      sort: sorts,
      pagination: paginations,
    };

    return options;
  }
}
