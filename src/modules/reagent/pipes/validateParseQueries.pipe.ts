import { BadRequestException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import {
  FilterOptions,
  FlagOptions,
  PaginationOptions,
  ReagentOptions,
  SortOptions,
} from '../interfaces/reagentOptions.interface';
import { plainToClass } from 'class-transformer';
import { GetReagentDto } from '../dto/getReagent.dto';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidateParseReagentOptionsPipe implements PipeTransform {
  async transform(queries: any): Promise<ReagentOptions> {
    const queryDto = plainToClass(GetReagentDto, queries);
    const errors: ValidationError[] = await validate(queryDto);

    if (errors.length > 0) {
      const messages: string[] = [];

      errors.forEach((error: ValidationError) => {
        if (error.constraints) {
          Object.values(error.constraints).forEach((constraint) => {
            messages.push(constraint);
          });
        }
      });
      throw new BadRequestException({
        messages,
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      });
    }

    const filter: FilterOptions = {
      name: queryDto.name,
      category: queryDto.category,
      storageId: queryDto.storageId,
      structure: queryDto.structure,
    };

    const sort: SortOptions = {
      sortByName: queryDto.sortByName,
      sortByCreationDate: queryDto.sortByCreationDate,
      sortByUpdatedDate: queryDto.sortByUpdatedDate,
    };

    const pagination: PaginationOptions = {
      skip: queryDto.skip,
      take: queryDto.take,
    };

    const flag: FlagOptions = {
      isFullStructure: queryDto.isFullStructure,
    };

    const options: ReagentOptions = {
      filter,
      sort,
      pagination,
      flag,
    };
    return options;
  }
}
