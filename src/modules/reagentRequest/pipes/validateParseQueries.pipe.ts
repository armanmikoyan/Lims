import { BadRequestException, HttpStatus, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetReagentRequestDto } from '../dto/getReagentRequest.dto';
import {
  FilterOptions,
  PaginationOptions,
  ReagentRequestOptions,
  SortOptions,
} from '../interfaces/reagentRequestOptions.interface';
import { validate, ValidationError } from 'class-validator';

export class ValidateParseQueries implements PipeTransform {
  async transform(queries: any): Promise<ReagentRequestOptions> {
    const queryDto = plainToClass(GetReagentRequestDto, queries);
    const errors: ValidationError[] = await validate(queryDto);

    if (errors.length > 0) {
      const messages: string[] = [];

      errors.forEach((error) => {
        if (error.constraints) {
          Object.values(error.constraints).forEach((constraint) => {
            messages.push(constraint);
          });
        }
      });
      throw new BadRequestException({
        messages,
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad request',
      });
    }

    const filter: FilterOptions = {
      name: queryDto.name,
      status: queryDto.status,
    };

    const sort: SortOptions = {
      sortByCreatedDate: queryDto.sortByCreatedDate,
      sortByQuantity: queryDto.sortByQuantity,
      sortByUpdatedDate: queryDto.sortByUpdatedDate,
    };

    const pagination: PaginationOptions = {
      skip: queryDto.skip,
      take: queryDto.take,
    };

    const reagentRequestOptions: ReagentRequestOptions = {
      filter,
      sort,
      pagination,
    };

    return reagentRequestOptions;
  }
}
